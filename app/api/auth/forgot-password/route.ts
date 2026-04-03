import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET || "ilkwang_secret_2026";

/** 재설정 토큰 생성 (이메일 + 만료시간 포함, 1시간 유효) */
function createResetToken(email: string): string {
  const expires = Date.now() + 60 * 60 * 1000;
  const payload = JSON.stringify({ email, expires });
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex").substring(0, 32);
  return Buffer.from(`${payload}||${sig}`).toString("base64url");
}

/** Brevo HTTP API로 이메일 발송 */
async function sendBrevoEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL || "noreply@ilkwang.or.kr";
  const fromName = process.env.BREVO_FROM_NAME || "일광교회";

  if (!apiKey) return false;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  return res.ok;
}

/** POST /api/auth/forgot-password — 비밀번호 재설정 이메일 발송 요청 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const token = createResetToken(normalizedEmail);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${req.headers.get("host")}`;
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
        <div style="background: #2E7D32; padding: 32px 24px; text-align: center;">
          <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 6px;">행복과 영원으로 초대하는</p>
          <p style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: -0.5px;">일광교회</p>
        </div>
        <div style="padding: 36px 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px;">비밀번호 재설정 안내</h2>
          <p style="font-size: 15px; color: #374151; line-height: 1.7; margin: 0 0 8px;">안녕하세요, 성도님.</p>
          <p style="font-size: 15px; color: #374151; line-height: 1.7; margin: 0 0 28px;">
            비밀번호 재설정 요청이 접수되었습니다.<br/>
            아래 버튼을 클릭하시면 새 비밀번호를 설정하실 수 있습니다.
          </p>
          <div style="text-align: center; margin: 0 0 28px;">
            <a href="${resetLink}"
               style="display: inline-block; padding: 16px 36px; background: #2E7D32; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: -0.3px;">
              비밀번호 재설정하기
            </a>
          </div>
          <div style="background: #f9fafb; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 6px;">⏱ 이 링크는 <strong>1시간</strong> 동안만 유효합니다.</p>
            <p style="font-size: 13px; color: #6b7280; margin: 0;">🔒 본인이 요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다.</p>
          </div>
          <p style="font-size: 13px; color: #9ca3af; line-height: 1.6; margin: 0;">
            버튼이 클릭되지 않으면 아래 주소를 브라우저에 붙여넣어 주세요.<br/>
            <a href="${resetLink}" style="color: #2E7D32; word-break: break-all;">${resetLink}</a>
          </p>
        </div>
        <div style="border-top: 1px solid #f3f4f6; padding: 20px 32px; text-align: center;">
          <p style="font-size: 12px; color: #d1d5db; margin: 0;">일광교회 성도 포털 · 문의: 교회 사무실</p>
        </div>
      </div>
    `;

    const sent = await sendBrevoEmail(
      normalizedEmail,
      "[일광교회] 비밀번호 재설정 안내",
      html
    );

    if (!sent) {
      // BREVO_API_KEY 미설정 시 개발 환경 확인용 로그
      console.log(`[비밀번호 찾기] BREVO_API_KEY 미설정 — 재설정 링크: ${resetLink}`);
    }

    // 보안상 이메일 존재 여부와 무관하게 항상 성공 응답
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
