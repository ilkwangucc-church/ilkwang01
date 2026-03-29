import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: { default: "일광교회", template: "%s | 일광교회" },
  description: "행복과 영원으로 초대하는 일광교회 - 대한예수교장로회(합동) 서울 성북구 동소문로 212-68",
  keywords: ["일광교회", "교회", "성북구", "동소문로", "대한예수교장로회", "합동"],
  openGraph: {
    title: "일광교회",
    description: "행복과 영원으로 초대하는 일광교회",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        {/* Vercel Speed Insights — Core Web Vitals 실시간 모니터링 */}
        <SpeedInsights />
        {/* Vercel Analytics — 페이지 방문 통계 */}
        <Analytics />
      </body>
    </html>
  );
}
