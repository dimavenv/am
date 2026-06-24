"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

import { formatUSD } from "@/lib/utils";

/** Animated number that counts up from 0 to `value` on mount. */
export function CountUp({
  value,
  format = "usd",
  duration = 1.1,
  delay = 0,
}: {
  value: number;
  format?: "usd" | "number";
  duration?: number;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  return (
    <>
      {format === "usd"
        ? formatUSD(display)
        : Math.round(display).toLocaleString("en-US")}
    </>
  );
}
