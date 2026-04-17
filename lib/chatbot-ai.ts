/**
 * lib/chatbot-ai.ts
 * n0008 Stella 챗봇 AI 엔진 — Cloudflare Workers AI REST 호출 버전
 *
 * 필요 환경변수 (n0008 사용 계정):
 *   CF_ACCOUNT_ID      — Cloudflare 계정 ID
 *   CF_AI_TOKEN        — Workers AI 권한이 포함된 API Token
 *   CF_AI_MODEL        — (선택) 기본값 @cf/qwen/qwen3-30b-a3b-fp8
 */

import { getSetting } from "@/lib/chatbot-db";
import { CHURCH_KB, loadDynamicKB } from "@/lib/chatbot-kb";

const ESCALATION_KEYWORDS = [
  "사람", "상담사", "직접", "관리자", "목사님 연결", "담당자", "불만", "항의", "환불",
  "human", "agent", "manager", "refund", "complaint", "persona", "humano",
];

export function detectEscalation(message: string): boolean {
  const lower = message.toLowerCase();
  return ESCALATION_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

/* ── 언어 감지 ──────────────────────────────────────────────── */
export function detectLanguage(message: string): string {
  if (/[\uAC00-\uD7A3\u1100-\u11FF]/.test(message)) return "Korean";
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(message)) return "Japanese";
  if (/[\u4E00-\u9FFF]/.test(message)) return "Chinese";
  if (/[\u0600-\u06FF]/.test(message)) return "Arabic";
  if (/[\u0E00-\u0E7F]/.test(message)) return "Thai";
  if (/[\u0900-\u097F]/.test(message)) return "Hindi";
  if (/[\u0400-\u04FF]/.test(message)) return "Russian";
  if (/[a-zA-Z]/.test(message)) {
    const l = message.toLowerCase();
    if (/\b(hola|como|gracias|por favor|precio)\b/.test(l)) return "Spanish";
    if (/\b(bonjour|merci|comment|prix|salut)\b/.test(l)) return "French";
    if (/\b(hallo|danke|wie|bitte|preis)\b/.test(l)) return "German";
    if (/\b(ciao|grazie|come|prezzo)\b/.test(l)) return "Italian";
    if (/\b(ol[aá]|obrigad|como|pre[cç]o)\b/.test(l)) return "Portuguese";
    if (/\b(halo|terima kasih|bagaimana|harga)\b/.test(l)) return "Indonesian";
    if (/\b(xin ch[aà]o|c[aả]m [oơ]n)\b/.test(l)) return "Vietnamese";
  }
  return "English";
}

/* ── 메시지 타입 ─────────────────────────────────────────────── */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/* ── 시스템 프롬프트 ────────────────────────────────────────── */
function buildSystemPrompt(customKb: string, dynamicKb: string, userLang: string): string {
  // 일광교회 규칙:
  //  - 영어 질문 → 영어로만 응답
  //  - 그 외 모든 언어(한국어 포함) → 해당 언어로 응답 (기본은 한국어)
  const langRule = userLang === "English"
    ? `*** MANDATORY: The user is writing in English. Respond ONLY in English. Do NOT use Korean or any other language. ***`
    : userLang === "Korean"
      ? `*** MANDATORY: 사용자는 한국어로 질문하고 있습니다. 반드시 한국어로만 응답하세요. 영어를 쓰지 마세요. ***`
      : `*** MANDATORY: The user is writing in ${userLang}. You MUST respond ENTIRELY in ${userLang}. Do NOT use English or any other language. ***`;

  return `You are the Ilkwang Church (일광교회) friendly AI assistant. You help visitors with questions about the church, worship services, ministries, blog posts, bulletins, notices, sermons, offerings, and how to get involved.

CRITICAL RULES:
1. ${langRule}
2. Be warm, welcoming, and concise. Do NOT introduce yourself by name in every message. 첫 인사는 "반갑습니다. 일광교회입니다."처럼 자연스럽게.
3. Answer any church-related question the visitor may have — worship times, ministries, bulletins, notices, sermons, directions, offerings, contact info, sign-up process, staff, history, vision, faith basics, etc.
4. Base every answer on the CHURCH KNOWLEDGE below. If the specific fact is not present, say you are not sure and suggest contacting the church office (02-927-0691 / ilkwang@ilkwang.or.kr).
5. Do NOT invent facts, times, staff names, or events that are not in the knowledge base.
6. Do NOT use any markdown or special formatting. No ** (bold), no * (italic), no ## (headings), no --- (dashes), no bullet dashes, no numbered prefixes, no backticks, no links in []() format. Plain readable text only.
7. For sensitive matters (complaints, personal counseling, specific giving records), suggest contacting the church office directly at 02-927-0691.
8. When giving directions or worship times, prefer the most specific data from the CHURCH KNOWLEDGE (not generic answers).

TEACHING STYLE:
- Be conversational and encouraging — like a helpful church staff member welcoming a visitor.
- After answering, ask a friendly follow-up question when appropriate (e.g. "혹시 예배 참석 방법도 안내해 드릴까요?").
- Use Korean 존댓말.

CHURCH KNOWLEDGE (static):
${CHURCH_KB}
${dynamicKb ? `\nCHURCH KNOWLEDGE (live — bulletins, notices, sermons, gallery):\n${dynamicKb}` : ""}
${customKb ? `\nADDITIONAL INFO (admin-provided):\n${customKb}` : ""}`;
}

/* ── CF Workers AI REST 호출 ───────────────────────────────── */
interface CFAiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CFAiResponse {
  result?: {
    response?: string;
    // Some models may return different shape
  };
  success?: boolean;
  errors?: { code: number; message: string }[];
}

async function callCloudflareAi(
  messages: CFAiMessage[],
  opts: { max_tokens?: number; temperature?: number } = {},
): Promise<string> {
  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_AI_TOKEN;
  const model = process.env.CF_AI_MODEL || "@cf/qwen/qwen3-30b-a3b-fp8";

  if (!accountId || !token) {
    throw new Error("CF_ACCOUNT_ID / CF_AI_TOKEN not configured");
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      max_tokens: opts.max_tokens ?? 600,
      temperature: opts.temperature ?? 0.5,
    }),
    cache: "no-store",
  });

  const raw = (await res.json()) as CFAiResponse;
  if (!res.ok || !raw.success) {
    const msg = raw.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new Error(`Cloudflare AI error: ${msg}`);
  }

  const text = raw.result?.response ?? "";
  return text;
}

/* ── 메인 AI 응답 함수 ─────────────────────────────────────── */
export async function runChatbotAI(messages: ChatMessage[]): Promise<string> {
  try {
    const [customKb, dynamicKb] = await Promise.all([
      getSetting("custom_knowledge_base"),
      loadDynamicKB().catch(() => ""),
    ]);

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const userLang = lastUser ? detectLanguage(lastUser.content) : "Korean";

    const systemPrompt = buildSystemPrompt(customKb, dynamicKb, userLang);

    const aiMessages: CFAiMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    ];

    const raw = await callCloudflareAi(aiMessages, { max_tokens: 600, temperature: 0.5 });

    const text = raw
      // 추론 태그 제거 (Qwen3가 <think>...</think>를 뱉을 수 있음)
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/\*\*([^*]*)\*\*/g, "$1")
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/^[-_*]{3,}\s*$/gm, "")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/^>\s*/gm, "")
      .replace(/\u2014/g, " - ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return text || "죄송합니다. 지금 응답을 드리기 어렵습니다. 잠시 후 다시 시도하시거나 pastor@ilkwang.or.kr 로 문의해 주세요.";
  } catch (e) {
    console.error("[chatbot-ai] error:", e);
    return "죄송합니다. 지금 응답을 드리기 어렵습니다. 잠시 후 다시 시도하시거나 pastor@ilkwang.or.kr 로 문의해 주세요.";
  }
}

/* ── 상담원 답변 자동 번역 (관리자 답장 시) ──────────────── */
const LANGUAGE_NAME_MAP: Record<string, string> = {
  en: "English", vi: "Vietnamese", ja: "Japanese", zh: "Chinese",
  es: "Spanish", fr: "French", de: "German", pt: "Portuguese",
  th: "Thai", id: "Indonesian", ms: "Malay", ar: "Arabic",
  hi: "Hindi", ru: "Russian", it: "Italian", tr: "Turkish",
  nl: "Dutch", sv: "Swedish", pl: "Polish", ko: "Korean",
};

export async function translateMessage(message: string, targetLanguage: string): Promise<string> {
  if (!targetLanguage || targetLanguage === "ko" || targetLanguage === "kr") return message;
  try {
    const targetLang = LANGUAGE_NAME_MAP[targetLanguage] || targetLanguage;
    const raw = await callCloudflareAi(
      [
        {
          role: "system",
          content: `You are a translator. Translate the following message from Korean to ${targetLang}. Output ONLY the translated text, nothing else. No explanations, no quotes, no markdown, no <think> tags.`,
        },
        { role: "user", content: message },
      ],
      { max_tokens: 500, temperature: 0.3 },
    );
    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    return cleaned && cleaned.length > 1 ? cleaned : message;
  } catch (e) {
    console.error("[chatbot-ai] translate error:", e);
    return message;
  }
}
