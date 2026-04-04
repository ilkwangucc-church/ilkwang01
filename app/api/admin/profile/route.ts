import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, hashPassword, createSessionToken } from "@/lib/adminAuth";
import { readMembers, writeMembers } from "@/lib/members";

/** GET — 내 프로필 정보 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "세션 만료" }, { status: 401 });

  const members = await readMembers();
  const member = members.find(
    (m) =>
      (m.email !== "-" && m.email.toLowerCase() === session.username.toLowerCase()) ||
      m.name === session.displayName
  );

  return NextResponse.json({
    username:    session.username,
    displayName: session.displayName,
    role:        session.role,
    email:       member?.email   || "-",
    phone:       member?.phone   || "-",
    dept:        member?.dept    || "-",
    joined:      member?.joined  || "-",
    profileUrl:  member?.profileUrl,
    memberId:    member?.id,
  });
}

/** PATCH — 이름 / 비밀번호 변경 */
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "세션 만료" }, { status: 401 });

  try {
    const { displayName, phone, dept, currentPassword, newPassword } = await req.json();

    const members = await readMembers();
    const idx = members.findIndex(
      (m) =>
        (m.email !== "-" && m.email.toLowerCase() === session.username.toLowerCase()) ||
        m.name === session.displayName
    );

    if (newPassword) {
      if (newPassword.length < 8)
        return NextResponse.json({ error: "새 비밀번호는 8자 이상이어야 합니다" }, { status: 400 });
      if (idx === -1)
        return NextResponse.json({ error: "최고관리자 비밀번호는 환경변수로 관리됩니다" }, { status: 400 });
      if (currentPassword && members[idx].passwordHash !== hashPassword(currentPassword))
        return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다" }, { status: 400 });
      members[idx] = { ...members[idx], passwordHash: hashPassword(newPassword) };
    }

    const newName = displayName?.trim();
    if (idx !== -1) {
      if (newName) members[idx] = { ...members[idx], name: newName };
      if (phone !== undefined) members[idx] = { ...members[idx], phone: phone || "-" };
      if (dept !== undefined) members[idx] = { ...members[idx], dept: dept || "-" };
      await writeMembers(members);
    }

    const updatedDisplayName = (newName && idx !== -1) ? newName : session.displayName;
    const newToken = createSessionToken(session.username, session.role, updatedDisplayName);

    const res = NextResponse.json({ success: true, displayName: updatedDisplayName });
    res.cookies.set("admin_session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
