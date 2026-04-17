// PATCH /api/admin/chatbot/tickets/[id] — 티켓 상태 변경
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { updateTicket } from "@/lib/chatbot-db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = (await req.json()) as { status?: string; assigned_to?: string };

    if (!body.status && body.assigned_to === undefined) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    const ticketId = parseInt(id, 10);
    if (!Number.isFinite(ticketId)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    const updated = await updateTicket(ticketId, {
      status: body.status,
      assigned_to: body.assigned_to,
    });
    if (!updated) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin-chatbot-ticket-update]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
