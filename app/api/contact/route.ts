import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }

    // 문의 내용 콘솔 기록 (DB 연동 전 임시)
    console.log("📬 새 문의 접수:", { name, phone, email, subject, message, at: new Date().toISOString() });

    return NextResponse.json({ success: true, message: "문의가 접수되었습니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
