import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NegotiateAI — Is Your Job Offer Lowballing You?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.18), transparent 55%)",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#22c55e",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />
          NegotiateAI
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 28,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          <span>Find out if your job offer is&nbsp;</span>
          <span style={{ color: "#22c55e" }}>lowballing you.</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#888888",
            maxWidth: 900,
          }}
        >
          Market rate, a counter-offer number, and a ready-to-send email — in 60
          seconds. Just $9.
        </div>
      </div>
    ),
    { ...size }
  );
}
