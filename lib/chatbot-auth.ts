// 챗봇 관리자 API 인증 헬퍼 — 기존 admin_session 쿠키 재사용
import { NextRequest } from "next/server";
import { verifySessionToken, type AdminSession } from "@/lib/adminAuth";

export function getAdminFromRequest(req: NextRequest): AdminSession | null {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function requireAdmin(req: NextRequest): { session: AdminSession } | { error: Response } {
  const session = getAdminFromRequest(req);
  if (!session) {
    return {
      error: Response.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  // 관리자 등급(5단계) 이상
  if (session.role < 5) {
    return {
      error: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session };
}
