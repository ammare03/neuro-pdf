import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptySummaryState() {
  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center gap-4">
        <FileText className="w-16 h-16 text-gray-400" />
        <h2 className="text-xxl font-bold text-gray-600">No summaries yet</h2>
        <p className="text-gray-500 max-w-md">
          Upload your first PDF to get started with AI-Powered Summaries.
        </p>
        <Link href="/upload">
          <Button
            variant="link"
            className="mt-4 text-white bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:no-underline"
          >
            Create Your First Summary
          </Button>
        </Link>
      </div>
    </div>
  );
}
