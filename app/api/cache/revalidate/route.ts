/**
 * POST /api/cache/revalidate
 * 캐시 재검증 API — 관리자 전용
 *
 * body: { action, path?, tag?, section?, secret }
 * action: "all" | "cdn" | "path" | "tag" | "section" | "object" | "tags"
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  CACHE_TAGS, ALL_PATHS, revalidateAllPages, revalidateCDN, revalidateSection,
} from "@/lib/cache";
import { flushAllCached } from "@/lib/object-cache";

const SECRET = process.env.REVALIDATION_SECRET ?? "ilkwang-cache-2026";

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json() as {
      action:   string;
      path?:    string;
      tag?:     string;
      section?: string;
      secret?:  string;
    };

    // 비밀키 검증
    if (body.secret !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ts     = new Date().toISOString();
    let results: string[] = [];

    switch (body.action) {
      /* ── 전체 캐시 초기화 ────────────────────────────────── */
      case "all": {
        results = await revalidateAllPages();
        const flushed = await flushAllCached();
        results.push(`오브젝트캐시 ${flushed}개 항목 제거`);
        break;
      }

      /* ── CDN 캐시 초기화 ────────────────────────────────── */
      case "cdn": {
        results = await revalidateCDN();
        for (const p of ALL_PATHS) {
          revalidatePath(p, "page");
          results.push(p);
        }
        break;
      }

      /* ── 특정 경로 재검증 ────────────────────────────────── */
      case "path": {
        if (!body.path) {
          return NextResponse.json({ error: "path 필수" }, { status: 400 });
        }
        revalidatePath(body.path, "page");
        revalidatePath(body.path, "layout");
        results = [`경로 재검증: ${body.path}`];
        break;
      }

      /* ── 태그 재검증 ────────────────────────────────────── */
      case "tag": {
        if (!body.tag) {
          return NextResponse.json({ error: "tag 필수" }, { status: 400 });
        }
        revalidateTag(body.tag, {});
        results = [`태그 재검증: ${body.tag}`];
        break;
      }

      /* ── 섹션 재검증 ────────────────────────────────────── */
      case "section": {
        if (!body.section) {
          return NextResponse.json({ error: "section 필수" }, { status: 400 });
        }
        results = await revalidateSection(body.section);
        break;
      }

      /* ── 오브젝트 캐시만 초기화 ─────────────────────────── */
      case "object": {
        const count = await flushAllCached();
        results = [`오브젝트캐시 ${count}개 항목 제거 완료`];
        break;
      }

      /* ── 모든 태그 재검증 ────────────────────────────────── */
      case "tags": {
        for (const tag of Object.values(CACHE_TAGS)) {
          revalidateTag(tag, {});
          results.push(`[tag:${tag}]`);
        }
        break;
      }

      default:
        return NextResponse.json({ error: `알 수 없는 action: ${body.action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, results, timestamp: ts });
  } catch (err) {
    console.error("[cache/revalidate] 오류:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
