// POST /api/chatbot-ext/escalate — request human agent (public)
// 에스컬레이션 기록만 생성 (푸시 알림은 N-Link APK 기능이라 이번 포팅에선 제외)
import { NextRequest } from "next/server";
import {
  createEscalation,
  markConversationEscalated,
  logAnalytics,
} from "@/lib/chatbot-db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      conversation_id?: string;
      visitor_id?: string;
      email?: string;
      message?: string;
      language?: string;
    };

    const escalation = await createEscalation({
      conversation_id: body.conversation_id || null,
      visitor_id: body.visitor_id || null,
      email: body.email || null,
      message: body.message || "Human agent requested",
      language: body.language || null,
    });

    if (body.conversation_id) {
      await markConversationEscalated(body.conversation_id);
    }

    await logAnalytics({
      event_type: "escalation",
      conversation_id: body.conversation_id || null,
      visitor_id: body.visitor_id || null,
      page_url: null,
      language: body.language || null,
    });

    return Response.json({ ok: true, escalation_id: escalation.id });
  } catch (e) {
    console.error("[chatbot-ext/escalate]", e);
    return Response.json({ error: "Failed to escalate" }, { status: 500 });
  }
}
