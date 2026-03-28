import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }

    // TODO: Resend(이메일) + Coolsms(문자) 연동 예정
    // 현재는 콘솔 출력 (추후 실제 전송으로 교체)
    console.log("📬 새 문의:", { name, phone, email, subject, message });

    return NextResponse.json({ success: true, message: "문의가 접수되었습니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
