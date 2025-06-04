"use client";

import { FormEvent } from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";

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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // Validating the fields
    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);
    if (!validatedFields.success) {
      console.error(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
      );
      return;
    }
    // Schema with ZOD
    // Upload the file to UploadThing
    // Parse the PDF using LangChain
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
