import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readMembers, writeMembers } from "@/lib/members";

/** PUT — 회원 수정 (등급·부서 등) */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await params;
    const memberId = Number(id);
    const body = await req.json();
    const members = await readMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return NextResponse.json({ error: "회원 없음" }, { status: 404 });

    members[idx] = { ...members[idx], ...body, id: memberId };
    await writeMembers(members);

    return NextResponse.json({ success: true, member: members[idx] });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** DELETE — 회원 삭제 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await params;
    const memberId = Number(id);
    const members = await readMembers();
    const filtered = members.filter((m) => m.id !== memberId);
    if (filtered.length === members.length) return NextResponse.json({ error: "회원 없음" }, { status: 404 });

    await writeMembers(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
