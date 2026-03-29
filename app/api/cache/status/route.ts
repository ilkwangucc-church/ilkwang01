/**
 * GET /api/cache/status
 * 캐시 현황 조회 — 관리자 전용
 */
import { NextResponse } from "next/server";
import { getObjectCacheStats } from "@/lib/object-cache";
import { PAGE_SECTIONS } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const objectStats = await getObjectCacheStats();

    return NextResponse.json({
      timestamp:   new Date().toISOString(),
      objectCache: objectStats,
      pageCache: {
        engine: "Next.js Data Cache (Vercel CDN)",
        sections: PAGE_SECTIONS.map((s) => ({
          label:      s.label,
          paths:      s.paths,
          revalidate: s.revalidate === false ? "static" : `${s.revalidate}s`,
          strategy:   s.revalidate === false
            ? "Static (빌드 고정)"
            : s.revalidate <= 1800
            ? `ISR ${Math.round((s.revalidate as number) / 60)}분`
            : `ISR ${Math.round((s.revalidate as number) / 3600)}시간`,
        })),
      },
      cdn: {
        provider:    "Vercel Edge Network",
        pops:        "100+",
        staticTTL:   "31,536,000s (1년, immutable)",
        bulletinTTL: "86,400s (24시간)",
        imageTTL:    "86,400s (24시간, next/image)",
      },
      environment: {
        redis:       !!(process.env.UPSTASH_REDIS_REST_URL),
        speedInsights: !!(process.env.VERCEL),
        vercel:      !!(process.env.VERCEL),
        nodeEnv:     process.env.NODE_ENV,
      },
    });
  } catch (err) {
    console.error("[cache/status] 오류:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
