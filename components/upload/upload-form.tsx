"use client";

import { FormEvent } from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

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
          backgroundColor: "#1f2937",
          color: "#f0f4f8",
        },
        descriptionClassName: "!text-[#f0f4f8]",
      });
    },
    onUploadBegin: (file) => {
      console.log("Upload started for file:", file);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    const response = await startUpload([file]);
    if (!response || response.length === 0) {
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

    // Parse the PDF using LangChain
    const summary = await generatePdfSummary(response);
    console.log("Summary generated:", summary);
    // Summarize the PDF using AI
    // Save the summary to the database
    // Redirect to the [id] summary page
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
