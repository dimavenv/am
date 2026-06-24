"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DEFAULT_MESSAGES = [
  "Analyzing market data…",
  "Calculating your worth…",
  "Writing your negotiation email…",
];

// Ascending bar heights (%) so the chart reads as "climbing".
const BARS = [22, 34, 30, 48, 62, 78, 96];

export function AnalyzingChart({
  messages = DEFAULT_MESSAGES,
}: {
  messages?: string[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      2000
    );
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="relative h-44 w-full max-w-[18rem]">
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/10 blur-2xl" />

        {/* bars */}
        <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between gap-2 px-1">
          {BARS.map((h, i) => (
            <motion.div
              key={i}
              className="w-full rounded-t-md bg-gradient-to-t from-primary/20 to-primary"
              initial={{ height: "6%" }}
              animate={{ height: `${h}%` }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1.1,
              }}
            />
          ))}
        </div>

        {/* upward trend line */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.polyline
            points="3,92 18,74 33,79 49,55 64,40 80,24 97,6"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
        </svg>
      </div>

      <div className="h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
