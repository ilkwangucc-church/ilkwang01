// GET /api/admin/chatbot — 대화 목록 (관리자 인박스)
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { listConversations } from "@/lib/chatbot-db";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const type = (url.searchParams.get("type") ?? "all").trim().toLowerCase();
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const perPage = 20;

    const all = await listConversations(500);

    const filtered = all.filter((row) => {
      if (type === "member" && !row.is_member) return false;
      if (type === "guest" && row.is_member) return false;
      if (
        search &&
        !String(row.customer_email ?? "").toLowerCase().includes(search) &&
        !String(row.customer_name ?? "").toLowerCase().includes(search) &&
        !String(row.first_message ?? "").toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });

    const start = (page - 1) * perPage;
    return Response.json({
      conversations: filtered.slice(start, start + perPage),
      page,
      pages: Math.max(1, Math.ceil(filtered.length / perPage)),
      total: filtered.length,
    });
  } catch (e) {
    console.error("[admin-chatbot-list]", e);
    return Response.json({ error: "챗봇 대화 목록 조회 실패" }, { status: 500 });
  }
}
