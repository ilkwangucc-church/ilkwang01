import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, hashPassword } from "@/lib/adminAuth";
import { readMembers, writeMembers } from "@/lib/members";

/** PUT — 회원 수정 (이름·등급·부서·비밀번호 등) */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await params;
    const memberId = Number(id);
    const body = await req.json();

    if (body.password && body.password.length < 8) {
      return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다" }, { status: 400 });
    }

    const members = await readMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return NextResponse.json({ error: "회원 없음" }, { status: 404 });

    // password 평문은 저장하지 않고 해싱 후 passwordHash 로 변환
    const { password, passwordHash: _oldHash, ...rest } = body as {
      password?: string;
      passwordHash?: string;
      [key: string]: unknown;
    };

    const update: Record<string, unknown> = { ...rest };
    if (password) {
      update.passwordHash = hashPassword(password);
    }
    // password 미입력 시 기존 passwordHash 유지
    if (!password) {
      update.passwordHash = members[idx].passwordHash;
    }

    members[idx] = { ...members[idx], ...update, id: memberId };
    await writeMembers(members);

    const { passwordHash: _pw, ...safeMember } = members[idx] as typeof members[number] & { passwordHash?: string };
    return NextResponse.json({ success: true, member: safeMember });
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
