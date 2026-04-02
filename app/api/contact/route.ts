import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }

    // Supabase contact_submissions 테이블에 저장
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("contact_submissions").insert({
        name,
        phone: phone || null,
        email,
        subject,
        message,
        is_read: false,
      });
    } catch (dbErr) {
      // DB 저장 실패 시 콘솔에만 기록 (사용자에게는 성공 응답)
      console.error("📬 DB 저장 실패 (콘솔 기록):", { name, phone, email, subject, message });
      console.error(dbErr);
    }

    return NextResponse.json({ success: true, message: "문의가 접수되었습니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
