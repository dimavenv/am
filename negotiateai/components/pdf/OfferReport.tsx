"use client";

import {
  Document,
  Page,
  Polygon,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

import type { Rating, ResultResponse } from "@/lib/types";

// ─── colours ───────────────────────────────────────────────
const C = {
  primary: "#22c55e",
  primaryLight: "#f0fdf4",
  primaryDark: "#16a34a",
  dark: "#111827",
  body: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f9fafb",
  white: "#ffffff",
  red: "#ef4444",
  redLight: "#fef2f2",
  yellow: "#d97706",
  yellowLight: "#fffbeb",
} as const;

const RATING_BG: Record<Rating, string> = {
  underpaid: C.redLight,
  fair: C.yellowLight,
  above_market: C.primaryLight,
};
const RATING_COLOR: Record<Rating, string> = {
  underpaid: C.red,
  fair: C.yellow,
  above_market: C.primaryDark,
};
const RATING_BORDER: Record<Rating, string> = {
  underpaid: "#fecaca",
  fair: "#fde68a",
  above_market: "#bbf7d0",
};

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const fmtDate = () =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ─── styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    color: C.dark,
    fontSize: 10,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: C.primary,
    paddingBottom: 12,
    marginBottom: 22,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: C.primary,
    marginRight: 7,
  },
  logoText: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    letterSpacing: -0.3,
  },
  headerRight: {
    fontSize: 8,
    color: C.muted,
    textAlign: "right",
    lineHeight: 1.6,
  },

  // Rating hero
  ratingBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  ratingSymbolRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingLabel: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.4,
  },
  ratingMeta: {
    fontSize: 9.5,
    color: C.body,
    marginTop: 4,
    lineHeight: 1.5,
  },

  // Two-col cards
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  // Market range card
  rangeCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 14,
    marginRight: 10,
    backgroundColor: C.bg,
  },
  // Counter card
  counterCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderRadius: 8,
    padding: 14,
    backgroundColor: C.primaryLight,
  },
  cardLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.9,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  rangeValue: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginBottom: 3,
  },
  counterValue: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: C.primaryDark,
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 8.5,
    color: C.muted,
  },
  counterSub: {
    fontSize: 8.5,
    color: C.primaryDark,
  },

  // Divider label
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    color: C.muted,
    textTransform: "uppercase",
    marginRight: 8,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },

  // Negotiation points
  pointsWrap: { marginBottom: 20 },
  pointRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  pointBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.primaryLight,
    borderWidth: 1,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    marginTop: 0.5,
    flexShrink: 0,
  },
  pointBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.primaryDark,
    textAlign: "center",
  },
  pointText: {
    flex: 1,
    fontSize: 10,
    color: C.body,
    lineHeight: 1.55,
  },

  // Email draft
  emailWrap: { marginBottom: 24 },
  emailBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 14,
    backgroundColor: C.bg,
  },
  emailLine: {
    fontSize: 8.8,
    fontFamily: "Courier",
    color: C.dark,
    lineHeight: 1.65,
  },
  emailLineEmpty: {
    fontSize: 8.8,
    fontFamily: "Courier",
    color: C.dark,
    lineHeight: 0.7,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: C.muted,
  },
  footerBrand: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
  },
});

// ─── component ─────────────────────────────────────────────
export function OfferReportPDF({ result }: { result: ResultResponse }) {
  const { context } = result;
  const rating = result.rating as Rating;

  const offer = Number(context.salary);
  const gain = result.counterOffer - offer;
  const gainStr =
    gain > 0
      ? `+${fmtUSD(gain)} from offered`
      : gain < 0
      ? `${fmtUSD(gain)} from offered`
      : "same as offered";

  const emailLines = result.emailDraft.split("\n");

  const docTitle = `NegotiateAI — ${context.jobTitle || "Offer"} at ${
    context.companyName || "Company"
  }`;

  return (
    <Document title={docTitle} author="NegotiateAI" keywords="salary negotiation">
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header} fixed>
          <View style={s.logoRow}>
            <View style={s.logoDot} />
            <Text style={s.logoText}>NegotiateAI</Text>
          </View>
          <Text style={s.headerRight}>
            {"Offer Analysis Report\n"}
            {fmtDate()}
          </Text>
        </View>

        {/* ── Rating hero ── */}
        <View
          style={[
            s.ratingBox,
            {
              backgroundColor: RATING_BG[rating],
              borderColor: RATING_BORDER[rating],
            },
          ]}
        >
          <View style={s.ratingSymbolRow}>
            <RatingMark rating={rating} color={RATING_COLOR[rating]} />
            <Text
              style={[s.ratingLabel, { color: RATING_COLOR[rating] }]}
            >
              {result.ratingLabel}
            </Text>
          </View>
          <Text style={s.ratingMeta}>
            {[
              context.jobTitle,
              context.companyName,
              context.city,
            ]
              .filter(Boolean)
              .join(" · ")}
            {"\n"}
            {context.yearsOfExperience
              ? `${context.yearsOfExperience} year${
                  Number(context.yearsOfExperience) !== 1 ? "s" : ""
                } of experience`
              : ""}
            {context.salary && offer > 0
              ? `${context.yearsOfExperience ? " · " : ""}Offered: ${fmtUSD(
                  offer
                )}`
              : ""}
          </Text>
        </View>

        {/* ── Market analysis cards ── */}
        <SectionHeading title="Market Analysis" />
        <View style={s.row}>
          <View style={s.rangeCard}>
            <Text style={s.cardLabel}>Market Range</Text>
            <Text style={s.rangeValue}>
              {fmtUSD(result.marketRangeLow)} – {fmtUSD(result.marketRangeHigh)}
            </Text>
            <Text style={s.cardSub}>
              {[
                context.yearsOfExperience &&
                  `${context.yearsOfExperience}-year ${context.jobTitle || "professional"}`,
                context.city,
              ]
                .filter(Boolean)
                .join(" in ")}
            </Text>
          </View>
          <View style={s.counterCard}>
            <Text style={s.cardLabel}>Recommended Counter-Offer</Text>
            <Text style={s.counterValue}>
              Ask for {fmtUSD(result.counterOffer)}
            </Text>
            <Text style={s.counterSub}>{gainStr}</Text>
          </View>
        </View>

        {/* ── Negotiation points ── */}
        <SectionHeading title="Your Negotiation Strategy" />
        <View style={s.pointsWrap}>
          {result.negotiationPoints.map((point, i) => (
            <View key={i} style={s.pointRow}>
              <View style={s.pointBadge}>
                <Text style={s.pointBadgeText}>{i + 1}</Text>
              </View>
              <Text style={s.pointText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* ── Email draft ── */}
        <SectionHeading title="Your Negotiation Email" />
        <View style={s.emailWrap}>
          <View style={s.emailBox}>
            {emailLines.map((line, i) =>
              line.trim() === "" ? (
                <Text key={i} style={s.emailLineEmpty}>
                  {" "}
                </Text>
              ) : (
                <Text key={i} style={s.emailLine}>
                  {line}
                </Text>
              )
            )}
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerBrand}>NegotiateAI</Text>
          <Text style={s.footerText}>
            Not financial advice · negotiateai.com
          </Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

/**
 * Up/down/equals indicator drawn with vector SVG (no font glyphs — standard
 * PDF Helvetica is Latin-1 only, so unicode arrows render as tofu; and
 * react-pdf's CSS border-triangle trick mis-miters the downward case).
 */
function RatingMark({ rating, color }: { rating: Rating; color: string }) {
  if (rating === "fair") {
    return (
      <Svg width={13} height={9} viewBox="0 0 13 9" style={{ marginRight: 9 }}>
        <Rect x={0} y={1} width={13} height={2.6} fill={color} />
        <Rect x={0} y={5.4} width={13} height={2.6} fill={color} />
      </Svg>
    );
  }
  const points =
    rating === "above_market" ? "6,0 12,11 0,11" : "0,0 12,0 6,11";
  return (
    <Svg width={12} height={11} viewBox="0 0 12 11" style={{ marginRight: 9 }}>
      <Polygon points={points} fill={color} />
    </Svg>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionLine} />
    </View>
  );
}
