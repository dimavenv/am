import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — the NegotiateAI mark (ascending bars + rising arrow) on the
// brand green, sized for iOS home-screen bookmarks (no transparency).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
    ),
    { ...size }
  );
}
