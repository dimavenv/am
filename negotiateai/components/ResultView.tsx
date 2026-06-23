"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import type { ResultResponse } from "@/lib/types";

export function ResultView() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [result, setResult] = useState<ResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/?error=payment_failed");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/get-result?session_id=${encodeURIComponent(sessionId)}`
        );

        // Not paid / unknown session → send them home with a banner.
        if (res.status === 403) {
          router.replace("/?error=payment_failed");
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load your analysis.");
        }

        const data = (await res.json()) as ResultResponse;
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  if (error) {
    return (
      <div className="space-y-5 py-24 text-center">
        <p className="text-muted-foreground">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Try again</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  if (!result) return <LoadingSpinner />;

  return <ResultCard result={result} />;
}
