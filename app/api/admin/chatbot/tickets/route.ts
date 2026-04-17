// GET /api/admin/chatbot/tickets — 티켓 목록
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { listTickets } from "@/lib/chatbot-db";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const perPage = 20;

    const items = await listTickets(status);
    const start = (page - 1) * perPage;

    return Response.json({
      tickets: items.slice(start, start + perPage),
      page,
      pages: Math.max(1, Math.ceil(items.length / perPage)),
      total: items.length,
    });
  } catch (e) {
    console.error("[admin-chatbot-tickets]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
