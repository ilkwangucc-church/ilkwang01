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

/* ── 일광교회 지식베이스 (코어, 관리자 설정으로 확장 가능) ───── */
const KNOWLEDGE_BASE = `
일광교회 (Ilkwang Church) — 대한예수교장로회(합동).
주소: 서울 성북구 동소문로 212-68. 전화: 02-927-0691.
웹사이트: https://ilkwang.or.kr  이메일: pastor@ilkwang.or.kr
담임목사: 담임목사님이 섬기고 계십니다.

예배 시간:
- 주일예배 1부: 주일 오전 9:00
- 주일예배 2부: 주일 오전 11:00
- 수요예배: 수요일 오후 7:30
- 새벽기도회: 화~토 오전 5:30
- 금요철야: 금요일 오후 9:00

사역부서: 유아부, 유치부, 유년부, 초등부, 중등부, 고등부, 청년부, 장년부.
주요 기관: 주일학교, 청소년부, 청년부, 선교부, 찬양대, 새가족부.

참여 방법:
- 처음 방문: 주일 예배에 오셔서 새가족실에 등록. 안내가 있습니다.
- 등록: 교회 홈페이지 '회원가입' 또는 새가족실 방문.
- 헌금: 주일 헌금, 계좌이체(국민은행) 둘 다 가능. 헌금 관련 문의는 재정부.
- 봉사: 각 부서장 또는 교역자께 문의.

오시는 길: 지하철 4호선 성신여대입구역에서 마을버스로 이동 가능.
주차: 교회 앞 주차 가능.
`;

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
function buildSystemPrompt(customKb: string, userLang: string): string {
  const langRule = userLang !== "English"
    ? `*** MANDATORY: The user is writing in ${userLang}. You MUST respond ENTIRELY in ${userLang}. Do NOT use English. ***`
    : `ALWAYS respond in the SAME language the user writes in. If Korean, respond in Korean.`;

  return `You are the Ilkwang Church (일광교회) friendly AI assistant. You help visitors with questions about the church, worship services, ministries, and how to get involved.

CRITICAL RULES:
1. ${langRule}
2. Be warm, welcoming, and concise. Do NOT introduce yourself by name in every message.
3. Only answer questions about Ilkwang Church, worship, Christian faith basics, and related topics.
4. If you do not know the answer, say so honestly and suggest contacting the church (pastor@ilkwang.or.kr / 02-927-0691).
5. Do NOT invent facts about the church that are not in the knowledge base.
6. Do NOT use any markdown or special formatting. No ** (bold), no * (italic), no ## (headings), no --- (dashes), no bullet dashes, no numbered prefixes, no backticks, no links in []() format. Plain readable text only.
7. For complaints or administrative matters, suggest contacting the church office directly.

TEACHING STYLE:
- Explain step by step when helpful (e.g. "주일 예배에 오시려면... ").
- After explaining, ask a friendly follow-up question when appropriate.
- Be conversational and encouraging — like a helpful church staff member.

CHURCH KNOWLEDGE:
${KNOWLEDGE_BASE}
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
    const customKb = await getSetting("custom_knowledge_base");

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const userLang = lastUser ? detectLanguage(lastUser.content) : "English";

    const systemPrompt = buildSystemPrompt(customKb, userLang);

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
