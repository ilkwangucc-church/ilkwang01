import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getCached, setCached } from "@/lib/object-cache";

const CACHE_KEY = "bulletins:list";
const CACHE_TTL = 3600; // 1시간

export async function GET() {
  try {
    // 오브젝트 캐시 확인
    const cached = await getCached<unknown[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      });
    }

    const dataPath = path.join(process.cwd(), "data", "bulletins.json");
    const raw      = await readFile(dataPath, "utf-8");
    const bulletins = JSON.parse(raw);
    // 최신 날짜 순 정렬
    bulletins.sort((a: { date: string }, b: { date: string }) =>
      b.date.localeCompare(a.date)
    );

    // 오브젝트 캐시에 저장
    await setCached(CACHE_KEY, bulletins, CACHE_TTL);

    return NextResponse.json(bulletins, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
