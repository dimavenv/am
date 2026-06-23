import { Suspense } from "react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ResultView } from "@/components/ResultView";

// Results depend on the session_id query param — never statically cache.
export const dynamic = "force-dynamic";

export default function ResultPage() {
  return (
    <main className="container min-h-screen py-12 sm:py-16">
      <Suspense fallback={<LoadingSpinner />}>
        <ResultView />
      </Suspense>
    </main>
  );
}
