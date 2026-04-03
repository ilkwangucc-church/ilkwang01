import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { verifySessionToken } from "@/lib/adminAuth";

const DATA_PATH = path.join(process.cwd(), "data", "church-categories.json");

interface Categories {
  visitCategories: string[];
  memberGroups: string[];
}

async function readCategories(): Promise<Categories> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { visitCategories: [], memberGroups: [] };
  }
}

async function writeCategories(data: Categories): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/** GET — 카테고리 목록 */
export async function GET() {
  const data = await readCategories();
  return NextResponse.json(data);
}

/** PUT — 카테고리 수정 (추가/삭제) */
export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const body = await req.json();
    const current = await readCategories();

    if (body.visitCategories) current.visitCategories = body.visitCategories;
    if (body.memberGroups) current.memberGroups = body.memberGroups;

    await writeCategories(current);
    return NextResponse.json({ success: true, ...current });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
