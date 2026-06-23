import { cn } from "@/lib/utils";
import type { Rating } from "@/lib/types";

const CONFIG: Record<
  Rating,
  { emoji: string; ring: string; text: string; glow: string }
> = {
  underpaid: {
    emoji: "🔴",
    ring: "border-red-500/30 bg-red-500/10",
    text: "text-red-400",
    glow: "shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]",
  },
  fair: {
    emoji: "🟡",
    ring: "border-yellow-500/30 bg-yellow-500/10",
    text: "text-yellow-300",
    glow: "shadow-[0_0_40px_-10px_rgba(234,179,8,0.45)]",
  },
  above_market: {
    emoji: "🟢",
    ring: "border-primary/40 bg-primary/10",
    text: "text-primary",
    glow: "shadow-[0_0_40px_-10px_rgba(34,197,94,0.55)]",
  },
};

const SUBTITLE: Record<Rating, string> = {
  underpaid: "This offer is below market — there's room to push.",
  fair: "This offer is within market range.",
  above_market: "This is a strong offer above market.",
};

export function RatingBadge({
  rating,
  label,
}: {
  rating: Rating;
  label: string;
}) {
  const c = CONFIG[rating] ?? CONFIG.fair;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border px-6 py-6 text-center",
        c.ring,
        c.glow
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {c.emoji}
        </span>
        <span className={cn("text-3xl font-bold tracking-tight", c.text)}>
          {label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{SUBTITLE[rating]}</p>
    </div>
  );
}
