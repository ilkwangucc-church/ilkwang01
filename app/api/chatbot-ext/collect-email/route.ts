// POST /api/chatbot-ext/collect-email — capture visitor email (public)
// 이메일 시퀀스 발송은 외부 큐 기능이라 단순 수집만 수행
import { NextRequest } from "next/server";
import { upsertEmailContact, logAnalytics } from "@/lib/chatbot-db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email: string;
      conversation_id?: string;
      visitor_id?: string;
      language?: string;
    };

    const email = (body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const nextEmail = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await upsertEmailContact({
      conversation_id: body.conversation_id || null,
      visitor_id: body.visitor_id || null,
      email,
      language: body.language || null,
      sequence_step: 1,
      next_email_at: nextEmail,
    });

    await logAnalytics({
      event_type: "email_collected",
      conversation_id: body.conversation_id || null,
      visitor_id: body.visitor_id || null,
      page_url: null,
      language: body.language || null,
    });

    return Response.json({ ok: true });
  } catch (e) {
    console.error("[chatbot-ext/collect-email]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
