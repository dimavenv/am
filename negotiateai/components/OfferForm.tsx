"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Read a File into a base64 string (no data: prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function OfferForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      const fileInput = form.elements.namedItem(
        "offerLetter"
      ) as HTMLInputElement | null;
      const file = fileInput?.files?.[0];

      let pdfBase64: string | undefined;
      if (file) {
        if (file.type !== "application/pdf") {
          throw new Error("Please upload a PDF file.");
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error("PDF is too large (max 8MB).");
        }
        pdfBase64 = await fileToBase64(file);
      }

      const payload = {
        jobTitle: String(data.get("jobTitle") ?? "").trim(),
        companyName: String(data.get("companyName") ?? "").trim(),
        salary: String(data.get("salary") ?? "").trim(),
        city: String(data.get("city") ?? "").trim(),
        yearsOfExperience: String(data.get("yearsOfExperience") ?? "").trim(),
        notes: String(data.get("notes") ?? "").trim(),
        pdfBase64,
      };

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      const { url } = await res.json();
      if (!url) throw new Error("Could not start checkout. Please try again.");
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          name="jobTitle"
          required
          placeholder="Senior Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" name="companyName" required placeholder="Acme Inc." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="salary">Offered Base Salary (USD)</Label>
          <Input
            id="salary"
            name="salary"
            type="number"
            min={0}
            required
            placeholder="140000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min={0}
            max={60}
            required
            placeholder="6"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City / Metro Area</Label>
        <Input
          id="city"
          name="city"
          required
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="offerLetter">Upload Offer Letter (optional)</Label>
        <label
          htmlFor="offerLetter"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-background px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40"
        >
          <Upload className="h-4 w-4" />
          <span className="truncate">
            {fileName ?? "Drop a PDF to extract bonus, equity & benefits"}
          </span>
        </label>
        <input
          id="offerLetter"
          name="offerLetter"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder='e.g. "They said the salary is fixed and non-negotiable."'
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full text-base"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" /> Redirecting to secure checkout…
          </>
        ) : (
          <>
            Analyze My Offer — $9 <ArrowRight />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secure one-time payment via Stripe · No account needed · We don&apos;t
        store your offer details.
      </p>
    </form>
  );
}
