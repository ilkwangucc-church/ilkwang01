import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionToken } from "@/lib/adminAuth";
import { readMembers } from "@/lib/members";

/** 관리자 계정 목록 (환경변수 또는 기본값) */
function getAdminAccounts() {
  return [
    {
      username: "webmaster",
      email: "webmaster@ilkwang.or.kr",
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "@Herosws413105l5"),
      role: 7,
      displayName: "최고관리자",
      isActive: true,
    },
  ];
}

/** POST /api/admin/auth — 로그인 */
export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return NextResponse.json({ error: "아이디/이메일과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const id = identifier.trim();
    const isEmail = id.includes("@");

    // 계정 목록에서 일치하는 계정 찾기
    const account = getAdminAccounts().find((a) =>
      isEmail ? a.email === id.toLowerCase() : a.username === id
    );

    if (!account || !account.isActive || account.passwordHash !== passwordHash) {
      // 하드코딩 계정에 없으면 members.json 에서 찾기
      const members = await readMembers();
      let member = null;

      if (isEmail) {
        // 이메일로 직접 검색
        member = members.find(
          (m) =>
            m.email !== "-" &&
            m.email.toLowerCase() === id.toLowerCase() &&
            m.passwordHash === passwordHash
        );
      } else {
        // 유저네임(이메일 @ 앞부분)으로 검색 — 2단계 이상만
        member = members.find(
          (m) =>
            m.role >= 2 &&
            m.email !== "-" &&
            m.email.split("@")[0].toLowerCase() === id.toLowerCase() &&
            m.passwordHash === passwordHash
        );
      }

      if (member) {
        const username = member.email.split("@")[0];
        const mToken = createSessionToken(username, member.role, member.name);
        const mRes = NextResponse.json({
          success: true,
          username,
          role: member.role,
          displayName: member.name,
        });
        mRes.cookies.set("admin_session", mToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
        return mRes;
      }
      return NextResponse.json({ error: "아이디/이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const token = createSessionToken(account.username, account.role, account.displayName);

    const response = NextResponse.json({
      success: true,
      username: account.username,
      role: account.role,
      displayName: account.displayName,
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin auth error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

/** DELETE /api/admin/auth — 로그아웃 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
  return response;
}
