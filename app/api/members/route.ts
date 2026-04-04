import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readMembers, writeMembers, generateMemberId } from "@/lib/members";

/** GET — 회원 목록 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  const members = await readMembers();
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const roleFilter = url.searchParams.get("role") ? Number(url.searchParams.get("role")) : 0;

  const filtered = members.filter((m) => {
    if (search && ![m.name, m.email, m.phone].some((v) => v?.toLowerCase().includes(search))) return false;
    if (roleFilter > 0 && m.role !== roleFilter) return false;
    return true;
  });

  // passwordHash 는 클라이언트에 노출하지 않음
  const safe = filtered.map(({ passwordHash: _pw, ...rest }) => rest);
  return NextResponse.json(safe);
}

/** POST — 회원 추가 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const body = await req.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "이름은 필수입니다" }, { status: 400 });
    if (!body.email?.trim() && !body.phone?.trim()) {
      return NextResponse.json({ error: "이메일 또는 휴대폰 번호 중 하나는 필수입니다" }, { status: 400 });
    }

    const members = await readMembers();
    const newMember = {
      id: generateMemberId(members),
      name: body.name.trim(),
      email: body.email?.trim() || "-",
      phone: body.phone?.trim() || "-",
      role: Number(body.role) || 1,
      dept: body.dept?.trim() || "-",
      matched: false,
      joined: new Date().toISOString().slice(0, 10),
    };
    members.push(newMember);
    await writeMembers(members);

    return NextResponse.json({ success: true, member: newMember });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
