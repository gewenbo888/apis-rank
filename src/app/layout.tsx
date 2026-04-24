import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apis.psyverse.fun"),
  title: "API Services · Ranked | API 服务排行榜",
  description:
    "44 production APIs scored on performance, DX, pricing, integration, docs, and rate limits — across AI, payments, comms, maps, storage, auth, backend, search, voice & video. 主流 API 服务影响力综合排名。",
  keywords: [
    "API ranking", "developer APIs", "Stripe vs PayPal", "OpenAI Anthropic Gemini", "Twilio Vonage", "Resend Postmark",
    "API 排行", "支付 API", "AI API", "通信 API"
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "API Services · Ranked" }],
    title: "API Services · Ranked",
    description: "44 production APIs scored, weighted, and compared. 主流 API 服务影响力综合排名。",
    url: "https://apis.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "API Services · Ranked",
    description: "44 production APIs scored, weighted, and compared.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#7c3aed" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
