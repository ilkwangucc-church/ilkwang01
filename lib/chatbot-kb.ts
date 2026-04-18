/**
 * 일광교회 챗봇 지식베이스 (KB)
 * - CHURCH_KB: 홈페이지·대시보드에서 추출한 사이트 전체 정보 (정적)
 * - loadDynamicKB(): data/*.json 에서 주보, 공지 등 최신 동적 데이터 로딩
 */
import { readFile } from "fs/promises";
import path from "path";
import { FALLBACK_VIDEOS } from "@/lib/youtube";

export interface KnowledgeDoc {
  title: string;
  content: string;
  source: "static" | "dynamic";
  keywords?: string[];
}

/* ──────────────────────────────────────────────────────────────
 * 1. 정적 지식베이스 — 홈페이지/관리자 대시보드 모든 콘텐츠 집약
 *    (public/ 페이지 및 about, worship, youth, offering, contact 등)
 * ──────────────────────────────────────────────────────────── */
export const CHURCH_KB = `
[교회 개요]
이름: 일광교회 (Ilkwang Church)
소속: 대한예수교장로회 (합동측, 총신대학교)
설립: 1971년 (서울 성북구 돈암동 지역)
성격: 하나님 중심·성경 중심·교회 중심의 개혁주의 신앙을 추구하는 교회
슬로건: "행복과 영원으로 초대하는 교회"
공식 사이트: https://ilkwang.or.kr

[담임목사]
이름: 신점일
학력:
- 총신대학교 신학과 졸업 (B.A.)
- 총신대학교 신학대학원 졸업 (M.Div.)
- 합동신학대학원대학교 목회학 박사 수료 (D.Min.)
경력:
- 전) 서울동노회 청년부 연합 수련회 강사
- 전) 합동 총회 국내선교부 협력 목사
- 현) 일광교회 담임목사
- 현) 성북노회 임원
목회 철학: "내가 곧 길이요 진리요 생명이니 ..." (요한복음 14:6)에 근거하여 일광교회를 방문하는 모든 이들을 행복과 영원으로 초대.

[연락처]
전화: 02-927-0691
이메일: ilkwang@ilkwang.or.kr  (챗봇/AI: pastor@ilkwang.or.kr)
주소: 서울특별시 성북구 동소문로 212-68 (우편번호 02723)

[오시는 길]
지하철: 4호선 길음역 하차, 도보 약 10분
버스:
- 간선 152, 162, 171
- 지선 1111, 2112, 7212
주차: 교회 앞 주차 가능

[예배 시간]
- 주일 1부 예배: 주일 오전 9:30 (본당) — 온 가족이 함께 드리는 아침 예배
- 주일 2부 예배: 주일 오전 11:00 (본당) — 일광교회의 주 예배, 모든 성도가 함께
- 주일 오후예배: 주일 오후 1:30 (본당) — 청년 및 오후 성도를 위한 예배
- 새벽기도회: 매일 오전 5:00 (본당)
- 수요오전기도회: 수요일 오전 10:30 (본당)
- 수요성경공부: 수요일 오후 8:00 (본당)

(과거 n0008 자료와의 차이 안내: 현행 사이트 공식 시간은 위의 여섯 가지입니다.)

[교회 역사 타임라인]
- 1971: 일광교회 창립 (초대 담임 故 이광수 목사), 돈암동에서 10여 명의 성도와 첫 예배
- 1975: 현 예배당 부지 매입
- 1980: 제1 교육관 건립
- 1985: 대한예수교장로회(합동) 노회 가입
- 1990: 성도 500명 돌파, 본당 증축
- 1995: 해외선교사 최초 파송 (동남아)
- 2000: 창립 30주년 기념 감사예배
- 2005: 제2 교육관 및 다목적홀 건립
- 2010: 창립 40주년, '섬기는 교회' 비전 선포
- 2015: 온라인 예배 시스템 도입 (유튜브 생중계)
- 2019: 해외 선교지 7개국 파송 확대 (아시아·아프리카·중남미 20여 명)
- 2021: 창립 50주년, '하나님 나라의 전진' 기념예배
- 2024: 홈페이지 리뉴얼, 디지털 사역 강화

[교회 사명]
살아계신 하나님을 예배하고, 예수 그리스도의 제자로 훈련되어, 성령의 능력으로 사랑·전도·섬김으로 하나님의 나라를 확장한다.

[추구하는 공동체 (5대 공동체)]
1. 예배공동체 — 하나님을 위하여 존재하는 공동체. 참된 예배로 하나님과 관계 회복.
2. 훈련공동체 — 성도를 말씀으로 세우는 공동체. 제자훈련과 소그룹 성경공부.
3. 치유공동체 — 가정과 사회를 변화시키는 공동체. 상처받은 영혼 치유, 가정 회복.
4. 비전공동체 — 미래의 지도자를 세우는 공동체. 다음세대 양육.
5. 선교공동체 — 지구촌 땅 끝까지 복음을 전하는 공동체. 국내외 선교 사역.

개혁주의 5대 강령(Five Solas)을 고백:
- 오직 성경 (Sola Scriptura)
- 오직 믿음 (Sola Fide)
- 오직 은혜 (Sola Gratia)
- 오직 그리스도 (Solus Christus)
- 오직 하나님께 영광 (Soli Deo Gloria)

[다음세대 사역]
유초등부:
- 유치부 (5~7세): 주일 오전 11:00, 4층 유초등부실. 놀이·찬양 중심.
- 아동부 (초등 1~6학년): 주일 오전 11:00, 4층 유초등부실. 저학년/고학년 구분.
- 주요 프로그램: 주일 공과, 어린이 찬양대, 여름 VBS(7월), 절기 예배.

중고등부 (중1~고3):
- 주일 예배: 매 주일 오전 9:00, 3층 소예배실. 말씀 중심 강해.
- 금요 기도 모임: 매주 금 오후 7:30.
- 소그룹 성경공부: 격주 토 오후 2:00.
- 연간 행사: 3월 신학기 환영, 5월 청소년 축제, 7~8월 여름 수련회(3박4일), 10월 신앙 에세이 공모, 12월 성탄 공연.

청년부 (대학생~30대 미혼):
- 주일 예배: 주일 오후 1:30, 3층 소예배실. 예배 후 청년 모임.
- 금요 성경공부: 매주 금 오후 7:30.
- 소그룹: 격주 토요일 오후, 5~8명.
- 연간 행사: 4월 봄수련회(강원 3박4일), 5월 전도훈련·노방전도, 7~8월 여름 단기선교, 12월 청년의 밤.

[헌금 안내]
계좌:
- 국민은행 000-00-0000-000 (예금주: 일광교회) — 십일조/감사헌금
- 신한은행 000-000-000000 (예금주: 일광교회) — 건축헌금
- 우리은행 000-000000-00-000 (예금주: 일광교회) — 선교헌금

헌금 종류:
- 십일조 — 수입의 1/10을 하나님께 드리는 헌금
- 감사헌금 — 하나님의 은혜에 감사하여 드리는 헌금
- 건축헌금 — 성전 건축을 위한 헌금
- 선교헌금 — 국내외 선교 사역을 위한 헌금
- 구제헌금 — 어려운 이웃을 돕기 위한 헌금
- 교육헌금 — 다음세대 교육을 위한 헌금

이체 시 안내: 성함과 헌금 종류를 메모란에 기재 (예: "홍길동 십일조"). 헌금 영수증 필요 시 교회 사무실(02-927-0691) 문의.

[홈페이지 주요 메뉴 구조]
- / (홈)
- /about (담임목사 인사말), /about/vision (소개&비전), /about/pastor (섬기는 사람들), /about/history (교회역사), /about/worship-info (예배안내), /about/location (오시는길)
- /worship (예배/말씀), /worship/sermons (설교 목록)
- /youth (다음세대), /youth/sunday (유초등부), /youth/teens (중고등부), /youth/young-adults (청년부)
- /news (소식), /news/bulletin (주보), /news/community (커뮤니티), /news/events (행사), /news/gallery (갤러리)
- /blog (블로그)
- /offering (온라인 헌금)
- /resources (자료실), /resources/board (게시판)
- /contact (문의하기)

[관리자 대시보드 (교역자·직원용)]
로그인: /admin/login
주요 메뉴:
- 회원·교인: 회원 관리, 교인 관리, 증명서 발급
- 웹사이트 콘텐츠: 홈 화면 수정, 섬기는 사람들, 부서 소개 수정, 미디어 관리, 페이지 관리
- 교회 운영: 문의 접수함, 챗봇 관리, 공지/게시판, 설교/미디어, 주보 관리, 갤러리 관리, 헌금 현황
- 시스템: 캐시 관리, 사이트 설정

회원 등급 (7단계):
1. 일반회원, 2. 믿음회원, 3. 소망회원, 4. 사랑회원, 5. 일반관리자, 6. 교역자, 7. 최고관리자.

[FAQ]
Q. 처음 방문인데 어떻게 해야 하나요?
A. 주일 1부(오전 9:30), 2부(오전 11:00), 주일 오후예배(오후 1:30) 중 편한 시간에 본당으로 오세요. 새가족 안내가 있습니다.

Q. 헌금 영수증은 어떻게 받나요?
A. 교회 사무실(02-927-0691)로 문의하시면 발급해 드립니다.

Q. 주차는 가능한가요?
A. 교회 앞에 주차 가능합니다. 주일 예배 시간에는 자리가 제한될 수 있습니다.

Q. 온라인으로 예배를 볼 수 있나요?
A. 네, 유튜브 생중계를 통해 온라인 예배 참여가 가능합니다.

Q. 새가족 등록은 어디서 하나요?
A. 주일 예배 후 새가족실에서 등록하시거나 홈페이지에서 회원가입 후 교회 사무실로 연락 주세요.

Q. 담임목사님 성함이 어떻게 되시나요?
A. 신점일 목사님이 섬기고 계십니다.

Q. 교회는 언제 설립됐나요?
A. 1971년에 서울 성북구 돈암동 지역에서 설립되어 50년이 넘는 역사를 이어오고 있습니다.
`;

const EXTRA_SYSTEM_KB = `
[기본 안내 원칙]
챗봇의 기본 안내는 헤더 메뉴인 교회소개, 예배/말씀, 다음세대, 나눔과 소식 구조를 기준으로 설명합니다.
예배 시간, 오시는 길, 담임목사 소개, 교회 비전, 교회 역사 같은 1차 기본 정보는 교회소개와 예배/말씀 메뉴 기준으로 먼저 안내합니다.
공지, 광고, 주보, 행사, 갤러리, 최근 업데이트 같은 내용은 2차 정보입니다. 사용자가 공지, 광고사항, 주보, 행사, 최근 소식 등을 직접 물을 때만 별도로 안내합니다.
기본 안내 질문에 답할 때는 공지나 주보 내용을 섞어서 답하지 않습니다.

[교회소개 메뉴 안내]
교회소개 메뉴는 /about 아래 정보로 구성됩니다.
/about 는 담임목사 인사말, /about/history 는 교회역사, /about/pastor 는 섬기는 사람들, /about/vision 은 교회비전, /about/location 은 오시는길, /about/worship-info 는 예배안내입니다.
교회의 기본 소개, 담임목사 소개, 위치 안내, 비전, 역사 질문은 교회소개 메뉴 기준으로 답합니다.

[예배/말씀 메뉴 안내]
예배/말씀 메뉴는 /worship 와 /worship/sermons 로 구성됩니다.
기본 예배 안내 질문은 /worship 의 공식 예배 시간 정보를 우선 사용합니다.
설교 영상, 최근 설교, 유튜브 채널 안내는 /worship/sermons 및 설교 데이터 기준으로 별도로 설명합니다.

[다음세대 메뉴 안내]
다음세대 메뉴는 /youth 아래 유초등부(/youth/sunday), 중고등부(/youth/teens), 청년부(/youth/young-adults)로 구성됩니다.
다음세대 질문은 부서별 예배 시간, 대상 연령, 주요 프로그램을 중심으로 답합니다.

[나눔과 소식 메뉴 안내]
나눔과 소식 메뉴는 /news 를 기준으로 주보(/news/bulletin), 행사안내(/news/events), 갤러리(/news/gallery), 자료실(/resources), 게시판(/resources/board), 커뮤니티(/news/community, /blog)를 포함합니다.
이 메뉴는 공지, 광고사항, 주보, 행사, 갤러리, 자료 공유 등 2차 소식성 정보를 다루는 영역입니다.

[예배 시간 기본 안내 형식]
예배 안내를 요청하면 기본 형식은 다음 순서를 따릅니다.
제목: 예배 안내
섹션 1: 주일예배
1부 오전 9:30
2부 오전 11:00
주일 오후예배 오후 1:30
섹션 2: 기도회와 성경공부
새벽기도회 매일 오전 5:00
수요오전기도회 수요일 오전 10:30
수요성경공부 수요일 오후 8:00
마무리: 처음 방문이시면 어떤 예배가 편한지도 이어서 안내합니다.

[공개 사이트 기능]
메인 홈(/)은 히어로, 최신 설교, 예배 안내, 블로그 미리보기, 행사, 교회 소개, 핵심 가치, 문의 CTA로 구성됩니다.
상단 공개 메뉴는 교회소개(/about), 예배/말씀(/worship), 다음세대(/youth), 나눔과 소식(/news), 온라인 헌금(/offering), 문의하기(/contact)입니다.
자료실은 /resources, 게시판은 /resources/board, 블로그는 /blog, 주보는 /news/bulletin, 행사안내는 /news/events, 갤러리는 /news/gallery 입니다.

[회원 대시보드 기능]
회원 로그인 경로는 /dashboard/login 입니다.
모든 회원 공통 메뉴는 성경통독(/dashboard/bible), 설교 보기(/dashboard/sermons), 교회교육(/dashboard/education), 자료실(/dashboard/resources), 성도의 하루(/dashboard/daily), 부서나눔(/dashboard/dept-share), 부서별 블로그(/dashboard/blog), 상담신청(/dashboard/counseling), 행사안내(/dashboard/events), 부서별 인스타(/dashboard/instagram) 입니다.
운영자 권한(역할 5 이상)에는 회원 관리, 교인 관리, 증명서, 홈 화면 수정, 섬기는 사람들, 부서 소개, 미디어, 페이지 관리, 문의, 공지, 행사, 주보, 갤러리, 뉴스레터, 캐시, 인스타 설정, 사이트 설정 메뉴가 추가됩니다.

[백엔드 API 구조]
공개 API는 /api/chatbot-ext/config, /api/chatbot-ext/chat, /api/chatbot-ext/history/[id], /api/chatbot-ext/collect-email, /api/chatbot-ext/escalate, /api/chatbot-ext/csat, /api/contact, /api/notices, /api/sermons, /api/bulletins, /api/gallery, /api/ilkwang-sermons 등으로 구성됩니다.
관리자 인증 API는 /api/admin/auth, /api/admin/auth/me, /api/admin/profile 입니다.
관리자 운영 API는 /api/admin/chatbot/*, /api/cache/*, /api/church-members/*, /api/members/*, /api/certificates, /api/instagram/*, /api/sms/send 등으로 구성됩니다.

[콘텐츠 저장 구조]
공지, 설교, 주보, 갤러리, 성경 나눔 등 공개 콘텐츠는 data/*.json 파일을 기본 데이터 원본으로 사용합니다.
GITHUB_DB_TOKEN 과 GITHUB_DB_REPO 가 설정되면 공지, 설교, 주보, 갤러리 등은 GitHub 저장소와 동기화되어 운영됩니다.
챗봇 대화, 설정, 분석은 UPSTASH_REDIS_REST_URL 과 UPSTASH_REDIS_REST_TOKEN 이 있을 때 Redis에 저장됩니다.

[챗봇 시스템]
챗봇 위젯 스크립트는 /chatbot-embed.js 이고, self-hosted 모드에서는 현재 사이트 origin 을 API base 로 사용합니다.
챗봇 설정 API는 /api/chatbot-ext/config 이며 기본 봇 이름은 일광안내, 기본 인사말은 "반갑습니다. 일광교회입니다." 입니다.
AI 응답은 Cloudflare Workers AI 를 우선 사용하며 필요한 환경변수는 CF_ACCOUNT_ID 와 CF_AI_TOKEN 입니다. 모델 기본값은 @cf/qwen/qwen3-30b-a3b-fp8 입니다.
외부 AI가 없어도 공개 지식베이스를 기반으로 예배 시간, 연락처, 위치, 헌금 안내, 사이트 메뉴, 관리자 기능, API 구조 같은 질문에는 답하도록 설계되어 있습니다.
`;

/* ──────────────────────────────────────────────────────────────
 * 2. 동적 KB 로더 — /data/*.json 에서 최신 주보·공지 등 읽기
 * ──────────────────────────────────────────────────────────── */
async function readJsonSafe<T>(file: string): Promise<T | null> {
  try {
    // 1) 배포 번들 (읽기 전용)
    const deployPath = path.join(process.cwd(), "data", file);
    const raw = await readFile(deployPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // 2) /tmp (관리자 수정된 최신본 — Vercel 환경)
    try {
      const tmpPath = `/tmp/ilkwang-${file}`;
      const raw = await readFile(tmpPath, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}

function createDoc(
  title: string,
  content: string,
  source: KnowledgeDoc["source"],
  keywords: string[] = [],
): KnowledgeDoc {
  return {
    title,
    content: content.trim(),
    source,
    keywords,
  };
}

function parseSectionDocs(text: string, source: KnowledgeDoc["source"]): KnowledgeDoc[] {
  return text
    .split(/\n(?=\[[^\]]+\])/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^\[([^\]]+)\]\n?([\s\S]*)$/);
      if (!match) {
        return createDoc("일광교회 안내", chunk, source);
      }
      const [, title, body] = match;
      return createDoc(title, body.trim(), source, [title]);
    });
}

const STATIC_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  ...parseSectionDocs(CHURCH_KB, "static"),
  ...parseSectionDocs(EXTRA_SYSTEM_KB, "static"),
];

interface BulletinRow {
  id: number;
  date: string;
  highlights?: string[];
  front?: string;
  back?: string;
}

interface NoticeRow {
  id: number;
  title: string;
  category?: string;
  content?: string;
  pinned?: boolean;
  published?: boolean;
  date?: string;
}

interface SermonRow {
  id?: number;
  title?: string;
  preacher?: string;
  date?: string;
  scripture?: string;
  youtube_url?: string;
}

interface GalleryRow {
  id?: number;
  title?: string;
  date?: string;
  category?: string;
  url?: string;
}

interface DepartmentInfo {
  dept?: string;
  name?: string;
  [key: string]: unknown;
}

export function getStaticKnowledgeDocs(): KnowledgeDoc[] {
  return STATIC_KNOWLEDGE_DOCS;
}

export async function loadDynamicKnowledgeDocs(): Promise<KnowledgeDoc[]> {
  const [bulletins, notices, sermons, gallery] = await Promise.all([
    readJsonSafe<BulletinRow[]>("bulletins.json"),
    readJsonSafe<NoticeRow[]>("notices.json"),
    readJsonSafe<SermonRow[]>("sermons.json"),
    readJsonSafe<GalleryRow[]>("gallery.json"),
  ]);

  const docs: KnowledgeDoc[] = [];

  if (bulletins && bulletins.length > 0) {
    const latest = bulletins.slice(0, 5);
    docs.push(
      createDoc(
        "최근 주보 요약",
        latest
          .map((b) => {
            const highlights = b.highlights?.length ? `주요 내용: ${b.highlights.join(" / ")}` : "";
            return `${b.date} 주보. ${highlights}`.trim();
          })
          .join("\n"),
        "dynamic",
        ["주보", "bulletin"],
      ),
    );

    for (const b of latest) {
      docs.push(
        createDoc(
          `주보 ${b.date}`,
          [
            `날짜: ${b.date}`,
            b.highlights?.length ? `주요 내용: ${b.highlights.join(" / ")}` : "",
            b.front ? `앞면 이미지: ${b.front}` : "",
            b.back ? `뒷면 이미지: ${b.back}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          "dynamic",
          ["주보", b.date],
        ),
      );
    }
  }

  if (notices && notices.length > 0) {
    const active = notices
      .filter((n) => n.published !== false)
      .slice(0, 10)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (b.date || "").localeCompare(a.date || "");
      });

    if (active.length > 0) {
      docs.push(
        createDoc(
          "최근 공지사항 요약",
          active
            .map((n) => `[${n.category || "공지"}] ${n.title}${n.date ? ` (${n.date})` : ""}${n.pinned ? " [고정]" : ""}`)
            .join("\n"),
          "dynamic",
          ["공지", "notice", "행사"],
        ),
      );
    }

    for (const n of active) {
      docs.push(
        createDoc(
          `공지 ${n.title}`,
          [
            `분류: ${n.category || "공지"}`,
            n.date ? `날짜: ${n.date}` : "",
            n.pinned ? "고정 공지입니다." : "",
            n.content ? `내용: ${n.content}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          "dynamic",
          ["공지", "notice", n.category || "공지", n.date || ""],
        ),
      );
    }
  }

  const latestSermons = sermons && sermons.length > 0
    ? sermons.slice(0, 5)
    : FALLBACK_VIDEOS.slice(0, 5).map((video) => ({
        title: video.title,
        preacher: "신점일 목사",
        date: video.publishedAt,
        scripture: "",
        youtube_url: `https://www.youtube.com/watch?v=${video.id}`,
      }));

  if (latestSermons.length > 0) {
    docs.push(
      createDoc(
        "최근 설교 요약",
        latestSermons
          .map((s) => {
            return `${s.date || "날짜 미상"} 설교. 제목: ${s.title || "제목 미상"}${s.preacher ? ` / 설교자: ${s.preacher}` : ""}${s.scripture ? ` / 본문: ${s.scripture}` : ""}`;
          })
          .join("\n"),
        "dynamic",
        ["설교", "sermon", "유튜브", "youtube"],
      ),
    );

    for (const s of latestSermons) {
      docs.push(
        createDoc(
          `설교 ${s.title || s.date || "최근 설교"}`,
          [
            s.date ? `날짜: ${s.date}` : "",
            s.preacher ? `설교자: ${s.preacher}` : "",
            s.scripture ? `본문: ${s.scripture}` : "",
            s.youtube_url ? `영상: ${s.youtube_url}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          "dynamic",
          ["설교", "sermon", s.date || ""],
        ),
      );
    }
  }

  if (gallery && gallery.length > 0) {
    const latest = gallery.slice(0, 6);
    docs.push(
      createDoc(
        "최근 갤러리 요약",
        latest
          .map((g) => `${g.date || "날짜 미상"} / ${g.category || "일반"} / ${g.title || "-"}`)
          .join("\n"),
        "dynamic",
        ["갤러리", "gallery", "사진"],
      ),
    );
  }

  return docs;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      normalize(text)
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length >= 2),
    ),
  );
}

function isSecondaryKnowledgeQuery(query: string): boolean {
  return /공지|광고|광고사항|주보|행사|이벤트|소식|뉴스|최근|갤러리|사진|bulletin|notice|announcement|event|gallery/i.test(query);
}

function isSecondaryKnowledgeDoc(doc: KnowledgeDoc): boolean {
  return doc.source === "dynamic" || /최근 주보|주보 |공지 |최근 공지사항|갤러리|최근 설교 요약/.test(doc.title);
}

function isPrimaryGuideDoc(doc: KnowledgeDoc): boolean {
  return /기본 안내 원칙|교회소개 메뉴 안내|예배\/말씀 메뉴 안내|다음세대 메뉴 안내|나눔과 소식 메뉴 안내|예배 시간 기본 안내 형식|교회 개요|담임목사|연락처|오시는 길|예배 시간|다음세대 사역|교회 역사 타임라인|교회 사명|홈페이지 주요 메뉴 구조/.test(doc.title);
}

export function searchKnowledgeDocs(query: string, docs: KnowledgeDoc[], limit = 6): KnowledgeDoc[] {
  const normalizedQuery = normalize(query);
  const queryCompact = normalizedQuery.replace(/\s+/g, "");
  const tokens = tokenize(query);
  const secondaryQuery = isSecondaryKnowledgeQuery(query);

  const scored = docs
    .map((doc) => {
      const haystack = normalize(`${doc.title}\n${doc.content}`);
      const haystackCompact = haystack.replace(/\s+/g, "");
      let score = 0;

      if (isPrimaryGuideDoc(doc) && !secondaryQuery) score += 18;
      if (isSecondaryKnowledgeDoc(doc) && secondaryQuery) score += 22;
      if (isSecondaryKnowledgeDoc(doc) && !secondaryQuery) score -= 24;

      if (normalizedQuery && haystack.includes(normalizedQuery)) score += 50;
      if (queryCompact && haystackCompact.includes(queryCompact)) score += 40;

      for (const token of tokens) {
        if (haystack.includes(token)) score += token.length >= 4 ? 12 : 7;
      }

      if (normalizedQuery.includes("교회소개") && doc.title.includes("교회소개 메뉴 안내")) score += 45;
      if ((normalizedQuery.includes("예배") || normalizedQuery.includes("말씀")) && doc.title.includes("예배/말씀 메뉴 안내")) score += 35;
      if ((normalizedQuery.includes("다음세대") || normalizedQuery.includes("유초등부") || normalizedQuery.includes("중고등부") || normalizedQuery.includes("청년부")) && doc.title.includes("다음세대 메뉴 안내")) score += 35;
      if ((normalizedQuery.includes("나눔과 소식") || normalizedQuery.includes("소식")) && doc.title.includes("나눔과 소식 메뉴 안내")) score += 35;
      if ((normalizedQuery.includes("예배안내") || normalizedQuery.includes("예배 시간")) && doc.title.includes("예배 시간 기본 안내 형식")) score += 55;

      for (const keyword of doc.keywords || []) {
        const normalizedKeyword = normalize(keyword);
        if (normalizedKeyword && normalizedQuery.includes(normalizedKeyword)) score += 15;
      }

      return { doc, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.doc);
}

export function serializeKnowledgeDocs(docs: KnowledgeDoc[]): string {
  return docs
    .map((doc) => `[${doc.title}]\n${doc.content}`)
    .join("\n\n");
}

export async function loadKnowledgeDocs(): Promise<KnowledgeDoc[]> {
  const dynamicDocs = await loadDynamicKnowledgeDocs();
  return [...STATIC_KNOWLEDGE_DOCS, ...dynamicDocs];
}

export async function loadKnowledgeBaseText(): Promise<string> {
  const docs = await loadKnowledgeDocs();
  return serializeKnowledgeDocs(docs);
}

export async function loadDynamicKB(): Promise<string> {
  const docs = await loadDynamicKnowledgeDocs();
  return serializeKnowledgeDocs(docs);
}
