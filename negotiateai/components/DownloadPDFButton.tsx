"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ResultResponse } from "@/lib/types";

type State = "idle" | "loading" | "ready";

/**
 * Lazy-loads @react-pdf/renderer only when the user first clicks, keeping
 * the main bundle free of the ~500KB PDF library.
 */
export function DownloadPDFButton({ result }: { result: ResultResponse }) {
  const [state, setState] = useState<State>("idle");

  // These hold the dynamically-imported components.
  // We store them as `any` because generic React.ComponentType<> doesn't
  // capture the render-prop children that PDFDownloadLink uses.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LinkComp, setLinkComp] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [DocComp, setDocComp] = useState<any>(null);

  async function load() {
    setState("loading");
    try {
      const [{ PDFDownloadLink }, { OfferReportPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/OfferReport"),
      ]);
      // Use functional setState to prevent React from calling the component
      // as an updater function.
      setLinkComp(() => PDFDownloadLink);
      setDocComp(() => OfferReportPDF);
      setState("ready");
    } catch {
      setState("idle");
    }
  }

  const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const fileName = `NegotiateAI-${slug(result.context.companyName || "Offer")}-${slug(
    result.context.jobTitle || "Analysis"
  )}.pdf`;

  // ─── PDF not loaded yet ────────────────────────────────
  if (state !== "ready" || !LinkComp || !DocComp) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={state === "idle" ? load : undefined}
        disabled={state === "loading"}
        className="gap-2"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {state === "loading" ? "Preparing…" : "Download PDF"}
      </Button>
    );
  }

  // ─── PDF ready — render PDFDownloadLink ───────────────
  const Doc = DocComp;
  return (
    <LinkComp document={<Doc result={result} />} fileName={fileName}>
      {({ loading }: { loading: boolean }) => (
        <Button size="sm" variant="outline" disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? "Generating PDF…" : "Download PDF"}
        </Button>
      )}
    </LinkComp>
  );
}
