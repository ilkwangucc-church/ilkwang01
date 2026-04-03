import crypto from "crypto";

/* ── 환경변수 ──────────────────────────────────────────────── */

const API_KEY = process.env.COOLSMS_API_KEY || "";
const API_SECRET = process.env.COOLSMS_API_SECRET || "";
const SENDER = process.env.COOLSMS_SENDER || "";

const API_BASE = "https://api.solapi.com";

/* ── 타입 ──────────────────────────────────────────────────── */

export interface SmsRecipient {
  name: string;
  phone: string;
}

export interface SmsSendResult {
  success: boolean;
  total: number;
  sent: number;
  failed: number;
  error?: string;
}

/* ── 인증 헤더 생성 (HMAC-SHA256) ──────────────────────────── */

function createAuthHeader(): string {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString("hex");
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(date + salt)
    .digest("hex");
  return `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

/* ── SMS/LMS 자동 구분 ─────────────────────────────────────── */

function getMessageType(text: string): "SMS" | "LMS" {
  // 한글 1자 = 2바이트, 영문/숫자 1자 = 1바이트 (EUC-KR 기준 90바이트)
  let byteLength = 0;
  for (const ch of text) {
    byteLength += ch.charCodeAt(0) > 127 ? 2 : 1;
  }
  return byteLength <= 90 ? "SMS" : "LMS";
}

/* ── 연동 상태 확인 ────────────────────────────────────────── */

export function isSmsConfigured(): boolean {
  return !!(API_KEY && API_SECRET && SENDER);
}

/* ── 문자 발송 ─────────────────────────────────────────────── */

export async function sendSms(
  recipients: SmsRecipient[],
  message: string,
): Promise<SmsSendResult> {
  if (!isSmsConfigured()) {
    return {
      success: false,
      total: recipients.length,
      sent: 0,
      failed: recipients.length,
      error: "문자 서비스 미연동 (COOLSMS 환경변수를 설정하세요)",
    };
  }

  if (!message.trim()) {
    return {
      success: false,
      total: 0,
      sent: 0,
      failed: 0,
      error: "메시지 내용이 비어있습니다",
    };
  }

  const validRecipients = recipients.filter((r) => r.phone);
  if (validRecipients.length === 0) {
    return {
      success: false,
      total: 0,
      sent: 0,
      failed: 0,
      error: "유효한 수신자가 없습니다",
    };
  }

  const type = getMessageType(message);
  const messages = validRecipients.map((r) => ({
    to: r.phone.replace(/-/g, ""),
    from: SENDER.replace(/-/g, ""),
    type,
    text: message,
  }));

  try {
    const res = await fetch(`${API_BASE}/messages/v4/send-many`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: createAuthHeader(),
      },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        total: validRecipients.length,
        sent: 0,
        failed: validRecipients.length,
        error: data.errorMessage || data.message || "발송 실패",
      };
    }

    const sent = data.groupInfo?.count?.total || validRecipients.length;
    const failed = (data.groupInfo?.count?.registeredFailed || 0);

    return {
      success: true,
      total: validRecipients.length,
      sent: sent - failed,
      failed,
    };
  } catch (err) {
    return {
      success: false,
      total: validRecipients.length,
      sent: 0,
      failed: validRecipients.length,
      error: err instanceof Error ? err.message : "네트워크 오류",
    };
  }
}
