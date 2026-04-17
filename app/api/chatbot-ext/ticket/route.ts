// POST /api/chatbot-ext/ticket — submit support ticket (public)
import { NextRequest } from "next/server";
import { createTicket, logAnalytics } from "@/lib/chatbot-db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      conversation_id?: string;
      visitor_id?: string;
      email?: string;
      name?: string;
      subject: string;
      message: string;
      language?: string;
    };

    const { subject, message } = body;
    if (!subject?.trim() || !message?.trim()) {
      return Response.json({ error: "Subject and message required" }, { status: 400 });
    }

    const ticket = await createTicket({
      conversation_id: body.conversation_id || null,
      visitor_id: body.visitor_id || null,
      email: body.email || null,
      name: body.name || null,
      subject: subject.trim(),
      message: message.trim(),
      language: body.language || null,
    });

    await logAnalytics({
      event_type: "ticket",
      conversation_id: body.conversation_id || null,
      visitor_id: body.visitor_id || null,
      page_url: null,
      language: body.language || null,
    });

    return Response.json({ ok: true, ticket_id: ticket.id });
  } catch (e) {
    console.error("[chatbot-ext/ticket]", e);
    return Response.json({ error: "Failed to submit ticket" }, { status: 500 });
  }
}
