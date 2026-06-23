import { TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { RatingBadge } from "@/components/RatingBadge";
import { EmailDraft } from "@/components/EmailDraft";
import { formatUSD } from "@/lib/utils";
import type { ResultResponse } from "@/lib/types";

const TWITTER_HANDLE = "NegotiateAI";

function tweetHref(result: ResultResponse): string {
  const text = `I just used NegotiateAI to analyze my job offer at ${
    result.context.companyName || "my new company"
  } 💰 It found my market rate and wrote my counter-offer email in 60 seconds. @${TWITTER_HANDLE}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function ResultCard({ result }: { result: ResultResponse }) {
  const { context } = result;
  const role = context.jobTitle || "your role";
  const city = context.city || "your area";
  const years = context.yearsOfExperience || "—";

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Offer Analysis</h1>
        <p className="text-muted-foreground">
          {context.jobTitle}
          {context.companyName ? ` · ${context.companyName}` : ""}
        </p>
      </div>

      {/* Rating */}
      <RatingBadge rating={result.rating} label={result.ratingLabel} />

      {/* Market range */}
      <Card>
        <CardContent className="space-y-1 p-6">
          <p className="text-sm text-muted-foreground">
            For a {years}-year {role} in {city}, the market range is
          </p>
          <p className="text-2xl font-semibold">
            {formatUSD(result.marketRangeLow)} –{" "}
            {formatUSD(result.marketRangeHigh)}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / year
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Counter-offer */}
      <Card className="border-primary/30 bg-primary/[0.06]">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Recommended counter-offer
            </p>
            <p className="text-3xl font-bold text-primary">
              Ask for {formatUSD(result.counterOffer)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Negotiation points */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Your 3 Negotiation Points</h2>
          <ul className="space-y-3">
            {result.negotiationPoints.map((point, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Email draft */}
      <Card>
        <CardContent className="p-6">
          <EmailDraft initialEmail={result.emailDraft} />
        </CardContent>
      </Card>

      {/* Share CTA */}
      <a
        href={tweetHref(result)}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-border bg-card p-5 text-center text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
      >
        🐦 Tweet your win → tag us → get a free re-analysis
      </a>

      {/* Refund note */}
      <p className="text-center text-xs text-muted-foreground">
        Not happy with your results? Email us at{" "}
        <a className="underline" href="mailto:support@negotiateai.com">
          support@negotiateai.com
        </a>{" "}
        for a full refund.
      </p>
    </div>
  );
}
