import { AlertTriangle, Check, Star } from "lucide-react";

import { OfferForm } from "@/components/OfferForm";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote: "I got $14,000 more just from sending the email it wrote.",
    name: "Marcus T.",
    role: "Software Engineer, Austin TX",
  },
  {
    quote:
      "Thought the offer was standard. It was 18% below market. Negotiated up to market rate.",
    name: "Priya S.",
    role: "Product Manager, NYC",
  },
  {
    quote: "Worth every penny. Took 5 minutes and I got an extra week of PTO.",
    name: "Jake R.",
    role: "Data Analyst, Chicago",
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
    a: "We use AI trained on real salary data patterns from Glassdoor, LinkedIn, and Levels.fyi to estimate a realistic range for your role, city, and experience.",
  },
  {
    q: "What if I'm not happy with the results?",
    a: "Email us at support@negotiateai.com for a full refund. No questions asked.",
  },
  {
    q: "Is my data private?",
    a: "We don't store your offer details. Your data is processed to generate your analysis and then discarded.",
  },
];

export default function Home({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10">
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error === "payment_failed"
              ? "We couldn't verify your payment. If you were charged, email support@negotiateai.com."
              : "Your checkout was canceled. No worries — you can analyze your offer whenever you're ready."}
          </div>
        )}

        {/* Hero */}
        <section className="mx-auto max-w-3xl pb-12 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            10,000+ offers analyzed · No account needed · Instant results
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

        {/* Social proof */}
        <section className="grid gap-4 py-8 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="space-y-4 p-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  “{t.quote}”
                </p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
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
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} NegotiateAI · Not financial advice ·{" "}
            <a className="underline" href="#">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a className="underline" href="mailto:contact@negotiateai.com">
              contact@negotiateai.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
