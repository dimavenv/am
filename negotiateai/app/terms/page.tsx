import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | NegotiateAI",
  description:
    "The terms governing your use of NegotiateAI — what you get, pricing, instant digital delivery, refunds, and contact.",
  alternates: { canonical: absoluteUrl("/terms") },
};

const UPDATED = "June 29, 2026";

export default function TermsPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="container relative z-10 mx-auto max-w-2xl py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to NegotiateAI
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {UPDATED}
        </p>

        <div className="article mt-8">
          <h2>1. The service</h2>
          <p>
            NegotiateAI (&quot;we,&quot; &quot;us&quot;) operates the website{" "}
            <Link href="/">negotiateai.site</Link>, an online tool that analyzes a
            job offer you provide and returns an estimated market salary range, a
            suggested counter-offer figure, and a ready-to-send negotiation email.
            By using the service you agree to these terms.
          </p>

          <h2>2. What you get</h2>
          <p>
            For a one-time fee you receive a single AI-generated analysis of the
            offer details you submit, delivered instantly in your browser and as a
            downloadable PDF report. The output is informational only.
          </p>

          <h2>3. Price and payment</h2>
          <p>
            The service costs <strong>$9 USD per analysis</strong> (a one-time
            charge — there is no subscription or recurring billing). Payments are
            processed by our third-party payment provider; we never receive or
            store your card or wallet credentials.
          </p>

          <h2>4. Delivery</h2>
          <p>
            This is a digital product delivered immediately. After your payment is
            confirmed, access is granted automatically in your open session and a
            single-use access code is emailed to you as a backup. Delivery is
            considered complete once the analysis is generated.
          </p>

          <h2>5. Refunds</h2>
          <p>
            If you are not satisfied with your analysis, email{" "}
            <a href="mailto:support@negotiateai.site">support@negotiateai.site</a>{" "}
            within 14 days and we will issue a full refund. Because the product is
            delivered instantly, refunds are handled manually on request rather
            than automatically.
          </p>

          <h2>6. Acceptable use</h2>
          <p>
            You agree to provide accurate information and to use the service only
            for lawful purposes. You may not resell, scrape, or attempt to disrupt
            the service or abuse access codes.
          </p>

          <h2>7. Not professional advice</h2>
          <p>
            NegotiateAI provides AI-generated estimates and suggested wording for
            general informational purposes. It is <strong>not</strong> financial,
            legal, career, or tax advice, and the salary ranges are estimates, not
            guarantees. You are responsible for any decisions you make.
          </p>

          <h2>8. Limitation of liability</h2>
          <p>
            The service is provided &quot;as is.&quot; To the maximum extent
            permitted by law, our total liability for any claim relating to the
            service is limited to the amount you paid for it.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:support@negotiateai.site">support@negotiateai.site</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
