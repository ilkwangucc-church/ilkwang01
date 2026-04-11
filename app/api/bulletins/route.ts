import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/object-cache";
import { readBulletins } from "@/lib/bulletins";

const CACHE_KEY = "bulletins:list";
const CACHE_TTL = 3600;

export async function GET() {
  try {
    const cached = await getCached<unknown[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
      });
    }

    const bulletins = await readBulletins();
    bulletins.sort((a, b) => b.date.localeCompare(a.date));

    await setCached(CACHE_KEY, bulletins, CACHE_TTL);

    return NextResponse.json(bulletins, {
      headers: { "X-Cache": "MISS", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
