// POST /api/chatbot-ext/csat — submit satisfaction rating (public)
import { NextRequest } from "next/server";
import { saveCsat, updateConversationStatus } from "@/lib/chatbot-db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      conversation_id: string;
      rating: number;
      feedback?: string;
    };
    const { conversation_id, rating } = body;
    if (!conversation_id || !rating || rating < 1 || rating > 5) {
      return Response.json({ error: "conversation_id and rating (1-5) required" }, { status: 400 });
    }
    await saveCsat({
      conversation_id,
      rating: Math.round(rating),
      feedback: body.feedback || null,
    });
    await updateConversationStatus(conversation_id, "resolved");
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[chatbot-ext/csat]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
