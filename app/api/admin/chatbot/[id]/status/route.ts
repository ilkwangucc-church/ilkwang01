// PATCH /api/admin/chatbot/[id]/status — 대화 상태 변경
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { updateConversationStatus } from "@/lib/chatbot-db";

const VALID_STATUSES = ["open", "handled", "resolved", "escalated"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = (await req.json()) as { status: string };

    if (!VALID_STATUSES.includes(body.status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }
    await updateConversationStatus(id, body.status);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin-chatbot-status]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
