"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function EmailDraft({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); select-to-copy still works.
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">
          Your Negotiation Email — Ready to Send
        </h3>
        <Button size="sm" onClick={handleCopy} className="shrink-0">
          {copied ? (
            <>
              <Check /> Copied!
            </>
          ) : (
            <>
              <Copy /> Copy Email
            </>
          )}
        </Button>
      </div>
      <Textarea
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        rows={16}
        className="min-h-[320px] resize-y font-mono text-sm leading-relaxed"
        spellCheck={false}
      />
      <p className="text-xs text-muted-foreground">
        Edit anything you like before sending — it&apos;s yours.
      </p>
    </div>
  );
}
