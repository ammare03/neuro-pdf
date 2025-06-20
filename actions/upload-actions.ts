"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfText({ fileUrl }: { fileUrl: string }) {
  if (!fileUrl) {
    return {
      success: false,
      message: "Failed tofetch and extract PDF text",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);
    console.log({ pdfText });

    if (!pdfText) {
      return {
        success: false,
        message: "Failed to fetch and extract text from PDF",
        data: null,
      };
    }

    return {
      success: true,
      message: "PDF text generated successfully",
      data: {
        pdfText,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch and extract PDF text",
      data: null,
    };
  }
}

export async function generatePdfSummary({
  pdfText,
  fileName,
}: {
  pdfText: string;
  fileName: string;
}) {
  let summary;
  try {
    summary = await generateSummaryFromOpenAI(pdfText);
  } catch (error) {
    console.error("Error generating summary:", error);
    // Call Gemini API as a fallback
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      try {
        summary = await generateSummaryFromGemini(pdfText);
        console.log("Generated summary using Gemini API: \n", summary);
      } catch (geminiError) {
        console.error(
          "Gemini API failed after OpenAI quota exceeded:",
          geminiError
        );
        throw new Error(
          "Failed to generate summary from both OpenAI and Gemini"
        );
      }
    }
  }

  if (!summary) {
    return {
      success: false,
      message: "Failed to generate summary",
      data: null,
    };
  }

  return {
    success: true,
    message: "PDF summary generated successfully",
    data: {
      summary,
      title: fileName,
    },
  };
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // SQL insert to save the summary
  try {
    console.log("In savePdfSummary");
    const sql = await getDbConnection();
    if (!sql) {
      throw new Error("Database connection failed");
    }
    const [savedSummary] = await sql`
    INSERT INTO pdf_summaries (
      user_id, 
      original_file_url, 
      summary_text, 
      title, 
      file_name
    ) VALUES ( 
      ${userId}, 
      ${fileUrl}, 
      ${summary}, 
      ${title}, 
      ${fileName} 
    ) RETURNING id, summary_text;`;
    return savedSummary;
  } catch (error) {
    console.error("Error saving PDF summary:", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // User is logged in and has a userId
  // Save PDF summary to the database
  // savePdfSummary
  let savedSummary;
  console.log("In storePdfSummaryAction");
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    //@ts-ignore
    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }

  // Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
