// GET /api/chatbot-ext/history/[id] — load conversation history (public)
import { NextRequest } from "next/server";
import { getMessages } from "@/lib/chatbot-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return Response.json({ messages: [] });
    const rows = await getMessages(id, 40);
    return Response.json({
      messages: rows.map((m) => ({ role: m.role, content: m.content, created_at: m.created_at })),
    });
  } catch (e) {
    console.error("[chatbot-ext/history]", e);
    return Response.json({ messages: [] });
  }
}
