"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const DEFAULT_MESSAGES = [
  "Analyzing market data…",
  "Calculating your worth…",
  "Writing your negotiation email…",
];

export function LoadingSpinner({
  messages = DEFAULT_MESSAGES,
  rotate = true,
}: {
  messages?: string[];
  rotate?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!rotate || messages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(id);
  }, [rotate, messages.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground transition-opacity duration-300">
        {messages[index]}
      </p>
    </div>
  );
}
