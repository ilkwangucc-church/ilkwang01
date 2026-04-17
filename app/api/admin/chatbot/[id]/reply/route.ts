// POST /api/admin/chatbot/[id]/reply — 관리자 수동 답장 (자동 번역 지원)
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import {
  getConversation,
  saveConversation,
  appendMessage,
  getMessages,
} from "@/lib/chatbot-db";
import { translateMessage, detectLanguage } from "@/lib/chatbot-ai";

async function resolveVisitorLanguage(id: string): Promise<string | null> {
  const conv = await getConversation(id);
  let visitorLang = conv?.language || null;
  if (!visitorLang || visitorLang === "en") {
    const msgs = await getMessages(id, 20);
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    if (lastUser?.content) {
      const codeMap: Record<string, string> = {
        Korean: "ko", Japanese: "ja", Chinese: "zh", Arabic: "ar", Thai: "th",
        Hindi: "hi", Russian: "ru", Spanish: "es", French: "fr", German: "de",
        Italian: "it", Portuguese: "pt", Indonesian: "id", Vietnamese: "vi",
      };
      const detected = detectLanguage(lastUser.content);
      if (detected !== "English" && codeMap[detected]) {
        visitorLang = codeMap[detected];
        if (conv) {
          conv.language = visitorLang;
          await saveConversation(conv);
        }
      }
    }
  }
  return visitorLang;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = (await req.json()) as {
      message: string;
      translatedMessage?: string;
      targetLanguage?: string | null;
      previewOnly?: boolean;
    };

    if (!body.message?.trim()) {
      return Response.json({ error: "Message required" }, { status: 400 });
    }

    const adminMessage = body.message.trim();
    const visitorLang =
      body.targetLanguage?.trim() || (await resolveVisitorLanguage(id));

    if (body.previewOnly) {
      try {
        const preview = await translateMessage(adminMessage, visitorLang || "ko");
        return Response.json({
          ok: true,
          preview,
          translated: preview !== adminMessage,
          language: visitorLang,
        });
      } catch (e) {
        console.error("[reply-preview-translate]", e);
        return Response.json({
          ok: true,
          preview: adminMessage,
          translated: false,
          language: visitorLang,
        });
      }
    }

    let finalMessage = adminMessage;
    if (body.translatedMessage?.trim()) {
      finalMessage = body.translatedMessage.trim();
    } else if (visitorLang && visitorLang !== "ko" && visitorLang !== "kr") {
      try {
        finalMessage = await translateMessage(adminMessage, visitorLang);
      } catch (e) {
        console.error("[reply-translate] translation failed:", e);
      }
    }

    await appendMessage({
      conversation_id: id,
      role: "agent",
      content: finalMessage,
      page_url: null,
      language: visitorLang || null,
    });

    const conv = await getConversation(id);
    if (conv) {
      conv.last_message = finalMessage.slice(0, 300);
      conv.last_active_at = new Date().toISOString();
      conv.status = "handled";
      conv.msg_count += 1;
      await saveConversation(conv);
    }

    return Response.json({
      ok: true,
      sentMessage: finalMessage,
      translated: finalMessage !== adminMessage,
      language: visitorLang,
    });
  } catch (e) {
    console.error("[admin-chatbot-reply]", e);
    return Response.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
