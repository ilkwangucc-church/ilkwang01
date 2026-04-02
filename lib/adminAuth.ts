import { createHash, createHmac } from "crypto";

/** 회원 등급 레이블 */
export const ROLE_LABELS: Record<number, string> = {
  1: "일반회원",
  2: "성도",
  3: "제직",
  4: "당회원",
  5: "교역자",
  6: "담임목사",
  7: "최고관리자",
};

/** 회원 등급별 뱃지 색상 (Tailwind) */
export const ROLE_COLORS: Record<number, string> = {
  1: "bg-gray-100 text-gray-600",
  2: "bg-emerald-100 text-emerald-700",
  3: "bg-blue-100 text-blue-700",
  4: "bg-indigo-100 text-indigo-700",
  5: "bg-purple-100 text-purple-700",
  6: "bg-amber-100 text-amber-700",
  7: "bg-red-100 text-red-700",
};

const SALT = process.env.ADMIN_SALT || "ilkwang_salt_2026";
const SECRET = process.env.ADMIN_SECRET || "ilkwang_secret_2026";

/** 비밀번호 해싱 */
export function hashPassword(password: string): string {
  return createHash("sha256").update(password + SALT).digest("hex");
}

export interface AdminSession {
  username: string;
  role: number;
  displayName: string;
}

/** 세션 토큰 생성 */
export function createSessionToken(username: string, role: number, displayName: string): string {
  const payload = { u: username, r: role, n: displayName, t: Date.now() };
  const str = JSON.stringify(payload);
  const sig = createHmac("sha256", SECRET).update(str).digest("hex").substring(0, 32);
  return Buffer.from(`${str}||${sig}`).toString("base64");
}

/** 세션 토큰 검증 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf8");
    const sepIdx = raw.lastIndexOf("||");
    if (sepIdx === -1) return null;
    const str = raw.substring(0, sepIdx);
    const sig = raw.substring(sepIdx + 2);
    const expectedSig = createHmac("sha256", SECRET).update(str).digest("hex").substring(0, 32);
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(str);
    // 7일 만료
    if (Date.now() - payload.t > 7 * 24 * 60 * 60 * 1000) return null;
    return { username: payload.u, role: payload.r, displayName: payload.n };
  } catch {
    return null;
  }
}
