import { Suspense } from "react";
import Link from "next/link";
import { Check, Mail, Target, TrendingUp } from "lucide-react";

import { OfferForm } from "@/components/OfferForm";
import { PaidBanner } from "@/components/PaidBanner";
import { Card, CardContent } from "@/components/ui/card";

const HIGHLIGHTS = [
  {
    Icon: TrendingUp,
    title: "Your real market range",
    body: "Benchmarked against public salary data for your exact role, city, and years of experience.",
  },
  {
    Icon: Target,
    title: "An exact counter-offer number",
    body: "Not vague advice — a specific figure to ask for, with the reasoning to back it up.",
  },
  {
    Icon: Mail,
    title: "A ready-to-send email",
    body: "A professional negotiation email written for your situation. Copy, paste, send.",
  },
];

const STEPS = [
  {
    title: "Paste your offer details",
    body: "Job title, salary, city, experience — plus your offer letter if you have it.",
  },
  {
    title: "Pay $9 — one time, no subscription",
    body: "Frictionless one-time payment. No account, no recurring charges.",
  },
  {
    title: "Get your analysis + email",
    body: "Market rate, a counter-offer number, and a ready-to-send negotiation email.",
  },
];

const FAQS = [
  {
    q: 'What if salary is "non-negotiable"?',
    a: "Most companies say this — our email is crafted for exactly this situation, focused on total compensation and respectful, evidence-based asks.",
  },
  {
    q: "How accurate is the market data?",
    a: "We use AI to estimate a realistic range from public salary data for your role, city, and experience. It's a well-reasoned estimate to anchor your negotiation — not a guarantee — so sanity-check it against sources like Levels.fyi or Glassdoor for your specific company.",
  },
  {
    q: "What if I'm not happy with the results?",
    a: "Email us at support@negotiateai.site for a full refund. No questions asked.",
  },
  {
    q: "Is my data private?",
    a: "We don't store your offer details. Your data is processed to generate your analysis and then discarded.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-3xl pb-12 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            No account needed · Private · Results in 60 seconds
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Find out if your job offer is{" "}
            <span className="text-primary">lowballing you.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            Paste your offer. Get your market rate, a counter-offer number, and a
            ready-to-send email — in 60 seconds.
          </p>
          <div className="mt-8">
            <a
              href="#analyze"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Analyze My Offer — $9
            </a>
          </div>
        </section>

        {/* What you get */}
        <section className="grid gap-4 py-8 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="space-y-3 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* How it works */}
        <section className="py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section id="analyze" className="scroll-mt-8 py-8">
          <Suspense fallback={null}>
            <PaidBanner />
          </Suspense>
          <OfferForm />
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((f) => (
              <Card key={f.q}>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <h3 className="font-semibold">{f.q}</h3>
                  </div>
                  <p className="pl-6 text-sm text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Want to write it yourself first? Read our{" "}
              <Link
                href="/blog"
                className="font-medium text-primary underline underline-offset-2"
              >
                salary negotiation guides &amp; email templates
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} NegotiateAI · Not financial advice ·{" "}
            <Link className="underline" href="/blog">
              Guides
            </Link>{" "}
            ·{" "}
            <a className="underline" href="#">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a className="underline" href="mailto:contact@negotiateai.site">
              contact@negotiateai.site
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
