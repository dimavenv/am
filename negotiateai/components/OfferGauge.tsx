"use client";

import { motion } from "framer-motion";

import { formatUSD } from "@/lib/utils";

/**
 * Horizontal gauge showing where the user's current offer and the recommended
 * counter sit relative to the estimated market range. Value labels live in a
 * static, wrap-friendly legend below the bar (no absolutely-positioned tooltips
 * that could overflow the viewport on mobile).
 */
export function OfferGauge({
  low,
  high,
  offer,
  counter,
}: {
  low: number;
  high: number;
  offer: number;
  counter: number;
}) {
  if (!(low > 0) || !(high > low)) return null;

  const offerValid = Number.isFinite(offer) && offer > 0;
  const counterValid = Number.isFinite(counter) && counter > 0;

  const points = [low, high];
  if (offerValid) points.push(offer);
  if (counterValid) points.push(counter);

  const dmin = Math.min(...points);
  const dmax = Math.max(...points);
  const span = dmax - dmin || 1;
  const pad = span * 0.14;
  const min = dmin - pad;
  const max = dmax + pad;

  // Clamp dot centres to [3, 97]% so the 16px markers never poke past the card.
  const pos = (x: number) =>
    Math.max(3, Math.min(97, ((x - min) / (max - min)) * 100));

  const bandLeft = Math.max(0, Math.min(100, ((low - min) / (max - min)) * 100));
  const bandRight = Math.max(0, Math.min(100, ((high - min) / (max - min)) * 100));

  return (
    <div className="select-none px-1 pb-1 pt-2">
      {/* Bar */}
      <div className="relative h-2 w-full rounded-full bg-secondary">
        <motion.div
          className="absolute top-0 h-full rounded-full bg-primary/30"
          style={{ left: `${bandLeft}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${bandRight - bandLeft}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />

        {counterValid && (
          <motion.div
            className="absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-[0_0_12px_rgba(34,197,94,0.8)]"
            style={{ left: `${pos(counter)}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 18 }}
          />
        )}

        {offerValid && (
          <motion.div
            className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-muted-foreground"
            style={{ left: `${pos(offer)}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 300, damping: 18 }}
          />
        )}
      </div>

      {/* Range end labels */}
      <div className="mt-3 flex justify-between text-xs tabular-nums text-muted-foreground">
        <span>{formatUSD(low)}</span>
        <span className="text-foreground/70">Market range</span>
        <span>{formatUSD(high)}</span>
      </div>

      {/* Legend */}
      {(offerValid || counterValid) && (
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
          {offerValid && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
              Your offer{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {formatUSD(offer)}
              </span>
            </span>
          )}
          {counterValid && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Target{" "}
              <span className="font-semibold tabular-nums text-primary">
                {formatUSD(counter)}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
