import FadeContent from "@/components/bits/FadeContent";
import BgGradient from "@/components/common/bg-gradient";
import EmptySummaryState from "@/components/summaries/empty-summary-state";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summaries";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Key } from "react";
import { getPriceIdForActiveUser, hasReachedUploadLimit } from "@/lib/user";
import Link from "next/link";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/common/motion-wrapper";
import { itemsVariants, pricingPlans } from "@/utils/constants";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = user?.id;
  console.log("User ID:", userId);
  if (!userId) {
    return redirect("/sign-in");
  }

  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(userId);
  const summaries = await getSummaries(userId);

  const userPriceId = await getPriceIdForActiveUser(
    user.emailAddresses[0].emailAddress
  );
  const isPro =
    userPriceId &&
    pricingPlans.find((plan) => plan.priceId === userPriceId)?.id === "pro";

  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex-col gap-4"
      >
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex flex-col gap-2">
              <MotionH1
                variants={itemsVariants}
                initial="hidden"
                whileInView="visible"
                className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent"
              >
                Your Summaries
              </MotionH1>
              <MotionP
                variants={itemsVariants}
                initial="hidden"
                animate="visible"
                className="text-gry-600"
              >
                Transform your PDFs into concise, actionable insights
              </MotionP>
            </div>
            {(!hasReachedLimit || isPro) && (
              <MotionDiv
                variants={itemsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                className="self-start"
              >
                <Button
                  variant={"link"}
                  className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:scale-105 transition-all duration-300 hover:no-underline"
                >
                  <Link href="/upload" className="flex text-white items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    New Summary
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>
          {hasReachedLimit && !isPro && (
            <MotionDiv
              variants={itemsVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
                <p className="text-sm">
                  You have reached the limit of {uploadLimit} uploads on the
                  Basic Plan.{" "}
                  <Link
                    href="/#pricing"
                    className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
                  >
                    Click here to upgrade to Pro{" "}
                    <ArrowRight className="w-4 h-4 inline-block" />
                  </Link>{" "}
                  for unlimited uploads.
                </p>
              </div>
            </MotionDiv>
          )}

          <FadeContent
            blur={true}
            duration={500}
            easing="ease-out"
            initialOpacity={0}
          >
            {summaries.length === 0 ? (
              <EmptySummaryState />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
                {summaries.map(
                  (summary: unknown, index: Key | null | undefined) => (
                    <SummaryCard key={index} summary={summary} />
                  )
                )}
              </div>
            )}
          </FadeContent>
        </div>
      </MotionDiv>
    </main>
  );
}
