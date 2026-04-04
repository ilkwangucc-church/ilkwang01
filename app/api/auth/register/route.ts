import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/adminAuth";
import { readMembers, writeMembers, generateMemberId } from "@/lib/members";

/** POST /api/auth/register — 자체 회원가입 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
    }

    const members = await readMembers();

    // 이메일 중복 확인
    const exists = members.find(
      (m) => m.email !== "-" && m.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
    }

    const newMember = {
      id: generateMemberId(members),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "-",
      role: 1,
      dept: "-",
      matched: false,
      joined: new Date().toISOString().slice(0, 10),
      passwordHash: hashPassword(password),
    };

    members.push(newMember);
    await writeMembers(members);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
