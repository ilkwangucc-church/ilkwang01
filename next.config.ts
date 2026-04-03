import type { NextConfig } from "next";

/* ── 보안 헤더 ───────────────────────────────────────────────────── */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /* ── 기본 최적화 ─────────────────────────────────────────────── */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  /* ── 이미지 최적화 ──────────────────────────────────────────── */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "graph.instagram.com" },
    ],
    formats: ["image/avif", "image/webp"],  // AVIF 우선, WEBP 폴백
    minimumCacheTTL: 86_400,                // CDN 이미지 캐시 24시간
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },

  /* ── HTTP 헤더 (보안 + CDN 캐시) ────────────────────────────── */
  async headers() {
    return [
      /* 전체 페이지 — 보안 헤더 */
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      /* Next.js 빌드 정적 자산 — 1년 Immutable */
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      /* 이미지 / 폰트 — 30일 */
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      /* 주보 파일 — 1일 (업로드 후 on-demand 재검증) */
      {
        source: "/bulletins/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
      /* favicon / 로고 — 7일 */
      {
        source: "/(favicon.ico|logo.*|pastor.*|apple-icon.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
