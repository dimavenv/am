import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | NegotiateAI",
  description:
    "How NegotiateAI handles your data — what we collect, how it's used, the providers we rely on, and how long anything is kept.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

const UPDATED = "June 29, 2026";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {UPDATED}
        </p>

        <div className="article mt-8">
          <p>
            We built NegotiateAI to need as little of your data as possible. There
            are no accounts and we do not keep a database of your offers. This
            policy explains exactly what is handled and by whom.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Your email address</strong> — used solely to deliver your
              access code and your receipt.
            </li>
            <li>
              <strong>The offer details you enter</strong> (job title, salary,
              city, experience, optional notes, and an optional offer-letter PDF)
              — sent to our AI provider to generate your analysis, then discarded.
              We do not store them in a database.
            </li>
            <li>
              <strong>Payment information</strong> — handled entirely by our
              payment provider. We never see or store your card or crypto-wallet
              details; we only receive a confirmation that a payment settled.
            </li>
          </ul>

          <h2>Service providers we use</h2>
          <p>
            To run the service we share the minimum necessary data with:
          </p>
          <ul>
            <li>
              <strong>OpenRouter</strong> — routes your offer details to an AI
              model to produce the analysis.
            </li>
            <li>
              <strong>Resend</strong> — sends your access-code email.
            </li>
            <li>
              <strong>TryBit</strong> — processes your payment.
            </li>
            <li>
              <strong>Vercel</strong> — hosts the website and serves it securely
              over HTTPS.
            </li>
          </ul>

          <h2>Data retention</h2>
          <p>
            Offer details are processed to generate your result and are not
            persisted by us afterwards. We retain only minimal records needed to
            deliver access codes and prevent code reuse (an order reference and the
            issued code), plus your email for receipt and support purposes.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            We keep tracking to a minimum. Any analytics used are for aggregate,
            non-identifying traffic measurement only.
          </p>

          <h2>Your rights</h2>
          <p>
            You can request access to or deletion of the limited personal data we
            hold (your email and any order reference) by emailing us. We will
            respond within a reasonable time.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy questions or requests? Email{" "}
            <a href="mailto:support@negotiateai.site">support@negotiateai.site</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
