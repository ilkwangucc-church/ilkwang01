import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { sendSms, isSmsConfigured } from "@/lib/sms";

export async function POST(req: NextRequest) {
  /* 인증 */
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5)
    return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  /* 연동 확인 */
  if (!isSmsConfigured()) {
    return NextResponse.json(
      { error: "문자 서비스 미연동 (관리자 설정에서 COOLSMS 환경변수를 확인하세요)" },
      { status: 503 },
    );
  }

  /* 요청 파싱 */
  try {
    const body = await req.json();
    const { recipients, message } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "수신자 목록이 비어있습니다" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "메시지 내용이 비어있습니다" }, { status: 400 });
    }

    const result = await sendSms(recipients, message.trim());

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
