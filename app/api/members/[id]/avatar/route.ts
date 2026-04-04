import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifySessionToken } from "@/lib/adminAuth";
import { readMembers, writeMembers } from "@/lib/members";

const ALLOWED_IMG = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/** POST — 회원 프로필 이미지 업로드 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await params;
    const memberId = Number(id);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_IMG.includes(ext)) {
      return NextResponse.json({ error: "JPG, PNG, WEBP, GIF 이미지만 가능합니다." }, { status: 400 });
    }

    // public/members/ 저장
    const dir = path.join(process.cwd(), "public", "members");
    await mkdir(dir, { recursive: true });
    const filename = `${memberId}-${Date.now()}${ext}`;
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    const profileUrl = `/members/${filename}`;

    // 회원 데이터 업데이트
    const members = await readMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return NextResponse.json({ error: "회원 없음" }, { status: 404 });

    members[idx] = { ...members[idx], profileUrl };
    await writeMembers(members);

    return NextResponse.json({ success: true, profileUrl });
  } catch (err) {
    console.error("avatar upload error:", err);
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
