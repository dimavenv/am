import { ImageResponse } from "next/og";

export const runtime = "edge";

// A 3:1 PNG brand banner for payment-provider dashboards (TryBit asks for a
// 3x1 PNG/JPEG logo). Open /brand/logo in a browser and "Save image as…" to
// upload it. The mark mirrors the favicon: ascending bars + a rising arrow.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 48,
          padding: "0 80px",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.18), transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 200,
            height: 200,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 48,
            background: "linear-gradient(135deg, #34d96b 0%, #16a34a 100%)",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            <rect x="25" y="60" width="13" height="18" rx="3" fill="#04130a" />
            <rect x="43" y="48" width="13" height="30" rx="3" fill="#04130a" />
            <rect x="61" y="36" width="13" height="42" rx="3" fill="#04130a" />
            <path
              d="M26 56 L72 30"
              stroke="#04130a"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M60 30 L72 30 L72 42"
              stroke="#04130a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, color: "#ffffff" }}>
            NegotiateAI
          </div>
          <div style={{ fontSize: 34, color: "#9ca3af" }}>
            negotiateai.site
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 400 }
  );
}
