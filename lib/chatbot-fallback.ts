import {
  loadKnowledgeDocs,
  searchKnowledgeDocs,
  type KnowledgeDoc,
} from "@/lib/chatbot-kb";
import {
  findDialogueReply,
  formatChurchIntroReply,
  formatLightGreetingReply,
  formatLocationReply,
  formatNewsReply,
  formatNextGenerationReply,
  formatOfferingReply,
  formatPastorReply,
  formatSermonReply,
  formatWorshipReply,
} from "@/lib/chatbot-dialogue-db";
import { findFaqReply } from "@/lib/chatbot-faq-db";
import {
  buildOfficeInquiryReply,
  buildScopeGuidanceReply,
  isDetailedInquiry,
  isSupportedGuideQuery,
} from "@/lib/chatbot-guard";

interface ChatMessageLike {
  role: "user" | "assistant" | "system";
  content: string;
}

function normalizeAnswer(text: string): string {
  return text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function shorten(text: string, maxLength = 260): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1).trim()}…`;
}

function composeDirectAnswer(query: string, docs: KnowledgeDoc[]): string | null {
  const top = docs[0];
  if (!top) return null;

  if (/프론트|frontend|공개 사이트|홈페이지|메인 화면|랜딩|public/i.test(query)) {
    const publicDocs = docs.filter((doc) =>
      doc.title.includes("공개 사이트 기능") || doc.title.includes("홈페이지 주요 메뉴 구조"),
    );
    if (publicDocs.length > 0) {
      return publicDocs
        .slice(0, 2)
        .map((doc) => `${doc.title}: ${doc.content}`)
        .join("\n\n");
    }
  }

  if (/예배|주일|새벽|수요|기도회|시간|worship|service/i.test(query)) {
    return formatWorshipReply();
  }

  if (/전화|연락|문의|이메일|주소|위치|오시는 길|주차|contact|location/i.test(query)) {
    return formatLocationReply();
  }

  if (/목사|담임|신점일|pastor/i.test(query)) {
    return formatPastorReply();
  }

  if (/다음세대|유초등부|유치부|아동부|중고등부|청년부|youth|young adults|teens/i.test(query)) {
    return formatNextGenerationReply();
  }

  if (/교회소개|교회 안내|처음 방문|기본 안내/i.test(query)) {
    return formatChurchIntroReply();
  }

  if (/헌금|계좌|offering|donation/i.test(query)) {
    return formatOfferingReply();
  }

  if (/설교|말씀|유튜브|sermon/i.test(query)) {
    return formatSermonReply();
  }

  if (/공지|광고|광고사항|주보|행사|소식|뉴스|bulletin|notice|announcement|event/i.test(query)) {
    const secondaryDocs = docs.filter((doc) => /주보|공지|갤러리|행사|나눔과 소식 메뉴 안내/.test(doc.title));
    if (secondaryDocs.length > 0) {
      return [
        formatNewsReply(),
        "",
        secondaryDocs
          .slice(0, 3)
          .map((doc) => `${doc.title}: ${shorten(doc.content, 220)}`)
          .join("\n\n"),
      ].join("\n");
    }
    return formatNewsReply();
  }

  if (/관리자|admin|대시보드|dashboard|회원 기능|운영 기능/i.test(query)) {
    const picked = docs.filter((doc) =>
      doc.title.includes("관리자") ||
      doc.title.includes("회원 대시보드") ||
      doc.title.includes("공개 사이트 기능"),
    );
    if (picked.length > 0) {
      return picked
        .slice(0, 3)
        .map((doc) => `${doc.title}: ${shorten(doc.content, 280)}`)
        .join("\n\n");
    }
  }

  if (/백엔드|api|서버|endpoint|엔드포인트|구조/i.test(query)) {
    const apiDoc = docs.find((doc) => doc.title.includes("백엔드 API 구조"));
    const storageDoc = docs.find((doc) => doc.title.includes("콘텐츠 저장 구조"));
    if (apiDoc && storageDoc) {
      return `${apiDoc.content}\n\n${storageDoc.content}`;
    }
  }

  if (/챗봇|chatbot|ai/i.test(query)) {
    const chatbotDoc = docs.find((doc) => doc.title.includes("챗봇 시스템"));
    if (chatbotDoc) {
      return chatbotDoc.content;
    }
  }

  return null;
}

export async function runFallbackChatbotAI(messages: ChatMessageLike[]): Promise<string> {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const query = lastUser?.content.trim() || "";

  if (!query) {
    return formatLightGreetingReply();
  }

  const faqReply = findFaqReply(query);
  if (faqReply) {
    return normalizeAnswer(faqReply);
  }

  const dialogueReply = findDialogueReply(query);
  if (dialogueReply) {
    return normalizeAnswer(dialogueReply);
  }

  if (isDetailedInquiry(query)) {
    return buildOfficeInquiryReply();
  }

  if (!isSupportedGuideQuery(query)) {
    return buildScopeGuidanceReply();
  }

  const docs = await loadKnowledgeDocs();
  const relevantDocs = searchKnowledgeDocs(query, docs, 6);

  if (relevantDocs.length === 0) {
    return buildScopeGuidanceReply();
  }

  const direct = composeDirectAnswer(query, relevantDocs);
  if (direct) return normalizeAnswer(direct);

  if (relevantDocs.length > 0 && relevantDocs[0]) {
    return normalizeAnswer(`${shorten(relevantDocs[0].content, 260)}\n\n필요하시면 예배, 위치, 다음세대, 주보, 설교, 연락처 중 어떤 안내가 필요한지 바로 이어서 도와드리겠습니다.`);
  }

  return buildScopeGuidanceReply();
}
