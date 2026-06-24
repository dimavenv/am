"use client";

import { motion, type Variants } from "framer-motion";
import { Share2, ShieldCheck, Target } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { RatingBadge } from "@/components/RatingBadge";
import { EmailDraft } from "@/components/EmailDraft";
import { OfferGauge } from "@/components/OfferGauge";
import { CountUp } from "@/components/CountUp";
import type { ResultResponse } from "@/lib/types";

const TWITTER_HANDLE = "NegotiateAI";

function tweetHref(result: ResultResponse): string {
  const text = `I just used NegotiateAI to analyze my job offer at ${
    result.context.companyName || "my new company"
  } 💰 It found my market rate and wrote my counter-offer email in 60 seconds. @${TWITTER_HANDLE}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function ResultCard({ result }: { result: ResultResponse }) {
  const { context } = result;
  const role = context.jobTitle || "your role";
  const city = context.city || "your area";
  const years = context.yearsOfExperience || "—";
  const offer = Number(context.salary);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-2xl space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Offer Analysis</h1>
        <p className="text-muted-foreground">
          {context.jobTitle}
          {context.companyName ? ` · ${context.companyName}` : ""}
        </p>
      </motion.div>

      {/* Rating */}
      <motion.div variants={item}>
        <RatingBadge rating={result.rating} label={result.ratingLabel} />
      </motion.div>

      {/* Market range + gauge */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="space-y-1 p-6">
            <p className="text-sm text-muted-foreground">
              For a {years}-year {role} in {city}, the market range is
            </p>
            <p className="text-2xl font-semibold">
              <CountUp value={result.marketRangeLow} /> –{" "}
              <CountUp value={result.marketRangeHigh} delay={0.15} />
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / year
              </span>
            </p>
            <OfferGauge
              low={result.marketRangeLow}
              high={result.marketRangeHigh}
              offer={offer}
              counter={result.counterOffer}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Counter-offer */}
      <motion.div variants={item}>
        <Card className="border-primary/30 bg-primary/[0.06]">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Recommended counter-offer
              </p>
              <p className="text-3xl font-bold text-primary">
                Ask for <CountUp value={result.counterOffer} delay={0.2} />
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Negotiation points */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Your 3 Negotiation Points</h2>
            <ul className="space-y-3">
              {result.negotiationPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Email draft */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <EmailDraft initialEmail={result.emailDraft} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Share CTA */}
      <motion.a
        variants={item}
        href={tweetHref(result)}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-5 text-center text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
      >
        <Share2 className="h-4 w-4 text-primary" />
        Tweet your win → tag us → get a free re-analysis
      </motion.a>

      {/* Refund note */}
      <motion.p
        variants={item}
        className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Not happy? Email{" "}
        <a className="underline" href="mailto:support@negotiateai.com">
          support@negotiateai.com
        </a>{" "}
        for a full refund.
      </motion.p>
    </motion.div>
  );
}
