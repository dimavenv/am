"use client";

import { motion } from "framer-motion";

import { formatUSD } from "@/lib/utils";

/**
 * Horizontal gauge showing where the user's current offer and the recommended
 * counter sit relative to the estimated market range.
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

  const pos = (x: number) =>
    Math.max(0, Math.min(100, ((x - min) / (max - min)) * 100));

  const bandLeft = pos(low);
  const bandWidth = pos(high) - bandLeft;

  return (
    <div className="select-none px-1 pb-2 pt-9">
      <div className="relative h-2 w-full rounded-full bg-secondary">
        {/* Market range band */}
        <motion.div
          className="absolute top-0 h-full rounded-full bg-primary/30"
          style={{ left: `${bandLeft}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${bandWidth}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />

        {/* Counter / target marker (above) */}
        {counterValid && (
          <motion.div
            className="absolute -top-1 z-20 -translate-x-1/2"
            style={{ left: `${pos(counter)}%` }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-4 w-4 -translate-y-1 rounded-full border-2 border-background bg-primary shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              Target {formatUSD(counter)}
            </div>
          </motion.div>
        )}

        {/* Current offer marker (below) */}
        {offerValid && (
          <motion.div
            className="absolute -top-1 z-10 -translate-x-1/2"
            style={{ left: `${pos(offer)}%` }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-4 w-4 -translate-y-1 rounded-full border-2 border-background bg-muted-foreground" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Your offer {formatUSD(offer)}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-12 flex justify-between text-xs text-muted-foreground">
        <span>{formatUSD(low)}</span>
        <span className="text-foreground/70">Market range</span>
        <span>{formatUSD(high)}</span>
      </div>
    </div>
  );
}
