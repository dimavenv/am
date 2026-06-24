"use client";

import { motion } from "framer-motion";
import { Equal, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Rating } from "@/lib/types";

const CONFIG: Record<
  Rating,
  {
    Icon: LucideIcon;
    ring: string;
    text: string;
    glow: string;
    iconBg: string;
    subtitle: string;
  }
> = {
  underpaid: {
    Icon: TrendingDown,
    ring: "border-red-500/30 bg-red-500/[0.07]",
    text: "text-red-400",
    glow: "shadow-[0_0_60px_-15px_rgba(239,68,68,0.55)]",
    iconBg: "bg-red-500/15 text-red-400",
    subtitle: "This offer is below market — there's real room to push.",
  },
  fair: {
    Icon: Equal,
    ring: "border-yellow-500/30 bg-yellow-500/[0.07]",
    text: "text-yellow-300",
    glow: "shadow-[0_0_60px_-15px_rgba(234,179,8,0.5)]",
    iconBg: "bg-yellow-500/15 text-yellow-300",
    subtitle: "This offer sits within market range — but you can still optimize.",
  },
  above_market: {
    Icon: TrendingUp,
    ring: "border-primary/40 bg-primary/[0.07]",
    text: "text-primary",
    glow: "shadow-[0_0_60px_-15px_rgba(34,197,94,0.6)]",
    iconBg: "bg-primary/15 text-primary",
    subtitle: "This is a strong offer above market. Nicely done.",
  },
};

export function RatingBadge({
  rating,
  label,
}: {
  rating: Rating;
  label: string;
}) {
  const c = CONFIG[rating] ?? CONFIG.fair;
  const Icon = c.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border px-6 py-7 text-center",
        c.ring,
        c.glow
      )}
    >
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 16 }}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          c.iconBg
        )}
      >
        <Icon className="h-7 w-7" strokeWidth={2.5} />
      </motion.div>
      <span className={cn("text-3xl font-bold tracking-tight", c.text)}>
        {label}
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">{c.subtitle}</p>
    </motion.div>
  );
}
