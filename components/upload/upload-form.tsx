"use client";

import { FormEvent, useRef, useState } from "react";
import UploadFormInput from "./upload-form-input";
import { set, z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  generatePdfText,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Inavlid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Upload complete");
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast("Error occurred while uploading", {
        description: error.message,
        duration: 3000,
        icon: "❌",
        style: {
          backgroundColor: "#f0f4f8",
          color: "#1f2937",
        },
        descriptionClassName: "!text-[#1f2937]",
      });
    },
    onUploadBegin: (file) => {
      console.log("Upload started for file:", file);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // Validating the fields
      const validatedFields = schema.safeParse({ file });
      console.log(validatedFields);
      if (!validatedFields.success) {
        toast("Something went wrong", {
          description: validatedFields.error.errors[0].message,
          duration: 3000,
          icon: "❌",
          style: {
            backgroundColor: "#f0f4f8",
            color: "#1f2937",
          },
          descriptionClassName: "!text-[#1f2937]",
        });
        setIsLoading(false);
        return;
      }
      toast("Uploading PDF...", {
        description: "Please wait while we upload your PDF...",
        duration: 3000,
        icon: "📤",
        style: {
          backgroundColor: "#f0f4f8",
          color: "#1f2937",
        },
        descriptionClassName: "!text-[#1f2937]",
      });

      // Schema with ZOD
      // Upload the file to UploadThing
      const uploadResponse = await startUpload([file]);
      if (!uploadResponse || uploadResponse.length === 0) {
        toast("Something went wrong!", {
          description: "Failed to upload the PDF. Please use a different file.",
          duration: 3000,
          icon: "❌",
          style: {
            backgroundColor: "#f0f4f8",
            color: "#1f2937",
          },
          descriptionClassName: "!text-[#1f2937]",
        });
        setIsLoading(false);
        return;
      }
      toast("Processing PDF...", {
        description: "Hang tight! Our AI is reading through your PDF! ✨",
        duration: 3000,
        icon: "📄",
        style: {
          backgroundColor: "#f0f4f8",
          color: "#1f2937",
        },
        descriptionClassName: "!text-[#1f2937]",
      });

      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

      // Parse the PDF using LangChain
      // Summarize the PDF using AI

      let storeResult: any;

      toast("Saving PDF...", {
        description: "Hang tight! We are saving your summary! ✨",
        duration: 3000,
        icon: "📄",
        style: {
          backgroundColor: "#f0f4f8",
          color: "#1f2937",
        },
        descriptionClassName: "!text-[#1f2937]",
      });

      const formattedFileName = formatFileNameAsTitle(file.name);

      const result = await generatePdfText({
        fileUrl: uploadFileUrl,
      });

      toast("Generating PDF Summary...", {
        description: "Hang tight! Our AI is reading through your PDF! ✨",
        duration: 3000,
        icon: "📄",
        style: {
          backgroundColor: "#f0f4f8",
          color: "#1f2937",
        },
        descriptionClassName: "!text-[#1f2937]",
      });

      // Call AI Service
      const summaryResult = await generatePdfSummary({
        pdfText: result?.data?.pdfText ?? "",
        fileName: formattedFileName,
      });

      toast("Saving PDF Summary...", {
        description: "Hang tight! Our AI is reading through your PDF! ✨",
        duration: 3000,
        icon: "📄",
        style: {
          backgroundColor: "#f0f4f8",
          color: "#1f2937",
        },
        descriptionClassName: "!text-[#1f2937]",
      });

      const { data = null, message = null } = summaryResult || {};

      if (data?.summary) {
        // Save the summary to the database
        storeResult = await storePdfSummaryAction({
          summary: data.summary,
          fileUrl: uploadFileUrl,
          title: formattedFileName,
          fileName: file.name,
        });

        toast("Summary Generated!", {
          description:
            "Your PDF has been successfully summarized and saved! ✨",
          icon: "✅",
          duration: 3000,
          style: {
            backgroundColor: "#f0f4f8",
            color: "#1f2937",
          },
          descriptionClassName: "!text-[#1f2937]",
        });

        formRef.current?.reset();
        router.push(`/summaries/${storeResult.data.id}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error occured:", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
