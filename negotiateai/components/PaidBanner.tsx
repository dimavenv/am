"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck, X } from "lucide-react";

/**
 * Shown when the buyer returns from the TryBit checkout (`?paid=1`). Reassures
 * them their code is on the way and points them at the code field below.
 */
export function PaidBanner() {
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (params.get("paid") === "1") setOpen(true);
  }, [params]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-auto mb-6 flex max-w-xl items-start gap-3 rounded-xl border border-primary/30 bg-primary/[0.08] p-4"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <MailCheck className="h-4 w-4" />
          </span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-foreground">
              Payment received — check your email
            </p>
            <p className="text-muted-foreground">
              Your access code is on its way (usually under a minute). Paste it in
              the code field below to unlock your analysis. Don&apos;t see it?
              Check spam.
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
