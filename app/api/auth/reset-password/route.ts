import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET || "ilkwang_secret_2026";

/** 재설정 토큰 검증 */
function verifyResetToken(token: string): { email: string } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const sepIdx = raw.lastIndexOf("||");
    if (sepIdx === -1) return null;

    const payload = raw.substring(0, sepIdx);
    const sig = raw.substring(sepIdx + 2);
    const expectedSig = createHmac("sha256", SECRET).update(payload).digest("hex").substring(0, 32);

    if (sig !== expectedSig) return null;

    const data = JSON.parse(payload);
    if (Date.now() > data.expires) return null; // 만료 확인

    return { email: data.email };
  } catch {
    return null;
  }
}

/** POST /api/auth/reset-password — 새 비밀번호 저장 */
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "올바르지 않은 요청입니다." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
    }

    // 토큰 검증
    const verified = verifyResetToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: "링크가 만료되었거나 유효하지 않습니다. 비밀번호 찾기를 다시 진행해주세요." },
        { status: 400 }
      );
    }

    // 실제 비밀번호 변경 처리
    // - 현재 구조는 환경변수 기반 계정 → DB 연동 후 실제 변경 가능
    // - DB 연동 시 이 주석 아래에 업데이트 로직 추가
    console.log(`[비밀번호 재설정] 대상 이메일: ${verified.email}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
