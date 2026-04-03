import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readMembers, writeMembers, createEmptyMember } from "@/lib/church-members";

/** GET — 교인 목록 (검색/필터) */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  const members = await readMembers();
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const memberType = url.searchParams.get("memberType") || "";
  const status = url.searchParams.get("currentStatus") || "";

  const filtered = members.filter((m) => {
    if (search && ![m.name, m.phone, m.address, m.parish, m.serviceDept, m.detailPosition]
      .some((v) => v?.toLowerCase().includes(search))) return false;
    if (memberType && m.memberType !== memberType) return false;
    if (status && m.currentStatus !== status) return false;
    return true;
  });

  return NextResponse.json(filtered);
}

/** POST — 교인 등록 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "이름은 필수입니다" }, { status: 400 });

    const member = createEmptyMember(body);
    const members = await readMembers();
    members.push(member);
    await writeMembers(members);

    return NextResponse.json({ success: true, member });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
