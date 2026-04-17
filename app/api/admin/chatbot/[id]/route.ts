// GET /api/admin/chatbot/[id] — 대화 상세
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { getConversation, getMessages } from "@/lib/chatbot-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const conversation = await getConversation(id);
    if (!conversation) {
      return Response.json({ error: "대화를 찾을 수 없습니다" }, { status: 404 });
    }
    const messages = await getMessages(id, 500);
    return Response.json({ conversation, messages });
  } catch (e) {
    console.error("[admin-chatbot-detail]", e);
    return Response.json({ error: "챗봇 대화 상세 조회 실패" }, { status: 500 });
  }
}
