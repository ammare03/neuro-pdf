import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import FadeContent from "@/components/bits/FadeContent";
import { ORIGIN_URL } from "@/utils/helpers";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NeuroPDF - AI-Powered PDF Summarization",
  description:
    "Save hours of reading time with NeuroPDF's AI-powered PDF summarization tool. Upload your PDF and get concise summaries in seconds.",
  icons: {
    icon: "/icon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/neuro-pdf.png",
      },
    ],
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fontSans.variable} font-sans antialiased`}>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Toaster position="bottom-center" offset={40} visibleToasts={3} />
              <FadeContent>{children}</FadeContent>
            </main>

            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
