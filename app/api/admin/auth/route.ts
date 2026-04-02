import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hashPassword, createSessionToken } from "@/lib/adminAuth";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** POST /api/admin/auth — 로그인 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("admin_accounts")
      .select("username, email, password_hash, role, display_name, is_active")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error || !data || !data.is_active || data.password_hash !== passwordHash) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    // 마지막 로그인 시간 업데이트
    await supabase
      .from("admin_accounts")
      .update({ last_login: new Date().toISOString() })
      .eq("email", email.trim().toLowerCase());

    const token = createSessionToken(data.username, data.role, data.display_name || data.username);

    const response = NextResponse.json({
      success: true,
      username: data.username,
      role: data.role,
      displayName: data.display_name,
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
