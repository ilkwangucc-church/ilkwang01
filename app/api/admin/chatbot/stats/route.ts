// GET /api/admin/chatbot/stats — 간단 통계
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { listConversations, listTickets } from "@/lib/chatbot-db";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const all = await listConversations(1000);
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const member = all.filter((c) => c.is_member === 1);
    const guest = all.filter((c) => !c.is_member);
    const todayConv = all.filter((c) => c.created_at.startsWith(today));
    const weekConv = all.filter(
      (c) => new Date(c.created_at).getTime() >= weekAgo,
    );
    const totalMessages = all.reduce((sum, c) => sum + (c.msg_count || 0), 0);
    const openTickets = (await listTickets("open")).length;

    return Response.json({
      total_conversations: all.length,
      member_conversations: member.length,
      guest_conversations: guest.length,
      today_conversations: todayConv.length,
      week_conversations: weekConv.length,
      total_messages: totalMessages,
      open_tickets: openTickets,
      section_dwell_ms: 2000,
    });
  } catch (e) {
    console.error("[admin-chatbot-stats]", e);
    return Response.json({ error: "챗봇 통계 조회 실패" }, { status: 500 });
  }
}
