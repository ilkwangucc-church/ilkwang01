import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readMembers, writeMembers } from "@/lib/church-members";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return null;
  return session;
}

/** GET — 교인 단건 조회 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  const { id } = await params;
  const members = await readMembers();
  const member = members.find((m) => m.id === id);
  if (!member) return NextResponse.json({ error: "교인 없음" }, { status: 404 });

  return NextResponse.json(member);
}

/** PUT — 교인 수정 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const members = await readMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx < 0) return NextResponse.json({ error: "교인 없음" }, { status: 404 });

  members[idx] = { ...members[idx], ...body, updatedAt: new Date().toISOString() };
  await writeMembers(members);

  return NextResponse.json({ success: true, member: members[idx] });
}

/** DELETE — 교인 삭제 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  const { id } = await params;
  const members = await readMembers();
  const filtered = members.filter((m) => m.id !== id);
  if (filtered.length === members.length) return NextResponse.json({ error: "교인 없음" }, { status: 404 });

  await writeMembers(filtered);
  return NextResponse.json({ success: true });
}
