/**
 * 캐시 태그 및 페이지 재검증 유틸리티 (Next.js 16 App Router)
 *
 * 사용법:
 *   fetch(url, { next: { tags: [CACHE_TAGS.bulletins] } })
 *   revalidateAllPages()
 */

import { revalidatePath, revalidateTag } from "next/cache";

/* ── 캐시 태그 상수 ─────────────────────────────────────────────── */
export const CACHE_TAGS = {
  bulletins:  "bulletins",
  news:       "news",
  sermons:    "sermons",
  events:     "events",
  gallery:    "gallery",
  resources:  "resources",
  blog:       "blog",
  all:        "all",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/* ── ISR 재검증 주기 (초) ─────────────────────────────────────── */
export const REVALIDATE = {
  static:   false,   // 완전 정적 (빌드 시 고정)
  short:    1_800,   // 30분
  medium:   3_600,   // 1시간
  long:     7_200,   // 2시간
  day:      86_400,  // 24시간
} as const;

/* ── 주요 페이지 경로 ─────────────────────────────────────────── */
export const PAGE_SECTIONS: { label: string; paths: string[]; revalidate: number | false }[] = [
  { label: "홈",           paths: ["/"],                          revalidate: false },
  { label: "교회소개",      paths: ["/about", "/about/history", "/about/pastor", "/about/vision", "/about/location"], revalidate: false },
  { label: "예배/말씀",     paths: ["/worship", "/worship/sermons"], revalidate: REVALIDATE.short },
  { label: "다음세대",      paths: ["/youth", "/youth/sunday", "/youth/teens", "/youth/young-adults"], revalidate: false },
  { label: "교회소식",      paths: ["/news"],                     revalidate: REVALIDATE.medium },
  { label: "주보자료",      paths: ["/news/bulletin"],            revalidate: REVALIDATE.long },
  { label: "행사안내",      paths: ["/news/events"],              revalidate: REVALIDATE.medium },
  { label: "갤러리",        paths: ["/news/gallery"],             revalidate: REVALIDATE.long },
  { label: "교재/커뮤니티", paths: ["/resources", "/resources/board", "/blog"], revalidate: REVALIDATE.medium },
];

export const ALL_PATHS = PAGE_SECTIONS.flatMap((s) => s.paths);

/* ── revalidateTag 래퍼 (Next.js 16: 두 번째 인자 필수) ──────── */
function rvTag(tag: string) {
  revalidateTag(tag, {});
}

/* ── revalidatePath 래퍼 ─────────────────────────────────────── */
function rvPath(path: string, type: "page" | "layout" = "page") {
  revalidatePath(path, type);
}

/* ── 전체 페이지 재검증 ──────────────────────────────────────── */
export async function revalidateAllPages(): Promise<string[]> {
  const results: string[] = [];
  // 루트 레이아웃 재검증 (CDN 포함)
  rvPath("/", "layout");
  results.push("/ (layout)");
  // 모든 경로
  for (const path of ALL_PATHS) {
    rvPath(path, "page");
    results.push(path);
  }
  // 모든 캐시 태그
  for (const tag of Object.values(CACHE_TAGS)) {
    rvTag(tag);
    results.push(`[tag:${tag}]`);
  }
  return results;
}

/* ── 섹션별 재검증 ─────────────────────────────────────────── */
export async function revalidateSection(section: string): Promise<string[]> {
  const results: string[] = [];
  const found = PAGE_SECTIONS.find(
    (s) => s.label === section || s.paths.includes(section)
  );
  if (found) {
    for (const path of found.paths) {
      rvPath(path, "page");
      results.push(path);
    }
  } else {
    rvPath(section, "page");
    results.push(section);
  }
  return results;
}

/* ── CDN 레이아웃 재검증 ────────────────────────────────────── */
export async function revalidateCDN(): Promise<string[]> {
  rvPath("/", "layout");
  return ["/ (CDN layout invalidated)"];
}

/* ── 외부 직접 호출용 (API 라우트에서 사용) ─────────────────── */
export { rvTag as revalidateCacheTag, rvPath as revalidateCachePath };
