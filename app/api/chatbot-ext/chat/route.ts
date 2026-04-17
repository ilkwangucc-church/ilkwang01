// POST /api/chatbot-ext/chat — main AI chat endpoint (public)
// n0008 app/api/chatbot-ext/chat/route.ts 포팅 (D1 → Upstash Redis)
import { NextRequest } from "next/server";
import {
  runChatbotAI,
  detectEscalation,
  detectLanguage,
  type ChatMessage,
} from "@/lib/chatbot-ai";
import {
  getConversation,
  createConversation,
  saveConversation,
  appendMessage,
  logAnalytics,
  generateConvId,
  generateVisitorId,
} from "@/lib/chatbot-db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message: string;
      conversation_id?: string;
      visitor_id?: string;
      page_url?: string;
      language?: string;
      history?: ChatMessage[];
    };

    const { message, page_url } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return Response.json({ error: "Message required" }, { status: 400 });
    }

    const detectedLang = detectLanguage(message);
    const langCodeMap: Record<string, string> = {
      Korean: "ko", Japanese: "ja", Chinese: "zh", Arabic: "ar", Thai: "th",
      Hindi: "hi", Russian: "ru", Spanish: "es", French: "fr", German: "de",
      Italian: "it", Portuguese: "pt", Indonesian: "id", Vietnamese: "vi", English: "en",
    };
    const language = body.language || langCodeMap[detectedLang] || null;

    const convId = body.conversation_id || generateConvId();
    const visitorId = body.visitor_id || generateVisitorId();
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history.slice(-8) : [];

    const needsHuman = detectEscalation(message);

    const aiMessages: ChatMessage[] = [
      ...history,
      { role: "user", content: message.trim() },
    ];

    const reply = await runChatbotAI(aiMessages);

    const preview = message.trim().slice(0, 300);
    const existing = await getConversation(convId);
    const nowIso = new Date().toISOString();

    if (existing) {
      existing.msg_count += 2;
      existing.last_message = preview;
      existing.last_active_at = nowIso;
      if (!existing.language) existing.language = language;
      if (needsHuman) existing.escalated = 1;
      await saveConversation(existing);
    } else {
      await createConversation({
        id: convId,
        visitor_id: visitorId,
        customer_email: null,
        customer_name: null,
        pages_visited: null,
        first_message: preview,
        last_message: preview,
        msg_count: 2,
        status: "open",
        language,
        escalated: needsHuman ? 1 : 0,
        is_member: 0,
        last_active_at: nowIso,
        created_at: nowIso,
      });
    }

    await appendMessage({
      conversation_id: convId,
      role: "user",
      content: message.trim(),
      page_url: page_url || null,
      language,
      created_at: nowIso,
    });

    await appendMessage({
      conversation_id: convId,
      role: "assistant",
      content: reply,
      page_url: page_url || null,
      language: null,
      created_at: new Date().toISOString(),
    });

    await logAnalytics({
      event_type: "message",
      conversation_id: convId,
      visitor_id: visitorId,
      page_url: page_url || null,
      language,
    });

    return Response.json({
      reply,
      conversation_id: convId,
      visitor_id: visitorId,
      needs_human: needsHuman,
    });
  } catch (e) {
    console.error("[chatbot-ext/chat]", e);
    return Response.json({ error: "AI service temporarily unavailable" }, { status: 500 });
  }
}
