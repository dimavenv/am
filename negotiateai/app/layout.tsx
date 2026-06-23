import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://negotiateai.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "NegotiateAI — Is Your Job Offer Lowballing You?",
  description:
    "Get your market rate, a counter-offer number, and a ready-to-send negotiation email in 60 seconds. Just $9.",
  openGraph: {
    title: "NegotiateAI — Is Your Job Offer Lowballing You?",
    description:
      "Get your market rate, a counter-offer number, and a ready-to-send negotiation email in 60 seconds. Just $9.",
    url: baseUrl,
    siteName: "NegotiateAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NegotiateAI — Is Your Job Offer Lowballing You?",
    description:
      "Get your market rate, a counter-offer number, and a ready-to-send negotiation email in 60 seconds. Just $9.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
