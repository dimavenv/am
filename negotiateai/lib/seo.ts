/**
 * Shared SEO constants. The canonical site URL is read from NEXT_PUBLIC_BASE_URL
 * so robots.txt, the sitemap, canonicals, and JSON-LD all agree on one host.
 * Pick ONE canonical host (with or without www) and set it consistently in
 * Vercel — mixing www and non-www splits your ranking signals.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://negotiateai.site"
).replace(/\/$/, "");

export const SITE_NAME = "NegotiateAI";

export const SITE_DESCRIPTION =
  "Get your market rate, a counter-offer number, and a ready-to-send salary negotiation email in 60 seconds. One-time $9, no account.";

/** Absolute URL helper for canonicals, sitemap entries, and JSON-LD. */
export function absoluteUrl(path = ""): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
