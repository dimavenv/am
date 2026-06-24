"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AnalyzingChart } from "@/components/AnalyzingChart";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { RESULT_STORAGE_KEY } from "@/lib/storage";
import type { ResultResponse } from "@/lib/types";

export function ResultView() {
  const router = useRouter();
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
      if (!raw) {
        setNotFound(true);
        return;
      }
      setResult(JSON.parse(raw) as ResultResponse);
    } catch {
      setNotFound(true);
    }
  }, []);

  if (notFound) {
    return (
      <div className="space-y-5 py-24 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            No analysis found
          </h1>
          <p className="text-muted-foreground">
            Your results live only in this browser tab. Run a new analysis to
            get started.
          </p>
        </div>
        <Button onClick={() => router.push("/")}>Analyze an offer</Button>
      </div>
    );
  }

  if (!result) return <AnalyzingChart />;

  return <ResultCard result={result} />;
}
