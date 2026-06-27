import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { POSTS } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Salary Negotiation Guides & Email Templates | NegotiateAI",
  description:
    "Specific, example-driven guides on negotiating your salary by email — templates, counter-offer scripts, and total-compensation tactics with real numbers.",
  alternates: { canonical: absoluteUrl("/blog") },
};

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="container relative z-10 mx-auto max-w-3xl py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to NegotiateAI
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Salary negotiation, the specific way
        </h1>
        <p className="mt-3 text-balance text-lg text-muted-foreground">
          Real templates and counter-offer scripts with actual numbers — not
          generic &quot;tips.&quot; Then let the tool write yours in 60 seconds.
        </p>

        <div className="mt-10 space-y-4">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="p-6">
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {p.readingMinutes} min read
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read guide <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
