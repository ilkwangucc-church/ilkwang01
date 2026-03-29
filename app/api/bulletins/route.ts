import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "bulletins.json");
    const raw = await readFile(dataPath, "utf-8");
    const bulletins = JSON.parse(raw);
    // 최신 날짜 순 정렬
    bulletins.sort((a: { date: string }, b: { date: string }) =>
      b.date.localeCompare(a.date)
    );
    return NextResponse.json(bulletins);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
