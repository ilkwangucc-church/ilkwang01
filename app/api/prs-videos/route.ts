import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const CHANNEL_ID = "UCISl2wEDnzYeg-k_kElfN4Q"; // @PRS
const TMP_PATH    = "/tmp/ilkwang-prs-videos.json";
const TMP_TS_PATH = "/tmp/ilkwang-prs-videos-ts.txt";
const CACHE_TTL   = 60 * 60 * 6; // 6시간

export interface PRSVideo {
  id: string;
  title: string;
  books: string[]; // 매핑된 성경 권 이름(들)
  publishedAt: string;
}

/* ─── 성경 약어 → 전체 이름 매핑 ─── */
const ABBREV_MAP: [string, string][] = [
  ["창",  "창세기"],   ["출",  "출애굽기"], ["레",  "레위기"],
  ["민",  "민수기"],   ["신",  "신명기"],   ["수",  "여호수아"],
  ["삿",  "사사기"],   ["룻",  "룻기"],     ["삼상","사무엘상"],
  ["삼하","사무엘하"], ["왕상","열왕기상"], ["왕하","열왕기하"],
  ["대상","역대상"],   ["대하","역대하"],   ["스",  "에스라"],
  ["느",  "느헤미야"], ["에",  "에스더"],   ["욥",  "욥기"],
  ["시",  "시편"],     ["잠",  "잠언"],     ["전",  "전도서"],
  ["아",  "아가"],     ["사",  "이사야"],   ["렘",  "예레미야"],
  ["애",  "예레미야애가"], ["겔","에스겔"],  ["단",  "다니엘"],
  ["호",  "호세아"],   ["욜",  "요엘"],     ["암",  "아모스"],
  ["옵",  "오바댜"],   ["욘",  "요나"],     ["미",  "미가"],
  ["나",  "나훔"],     ["합",  "하박국"],   ["습",  "스바냐"],
  ["학",  "학개"],     ["슥",  "스가랴"],   ["말",  "말라기"],
  ["마",  "마태복음"], ["막",  "마가복음"], ["눅",  "누가복음"],
  ["요",  "요한복음"], ["행",  "사도행전"], ["롬",  "로마서"],
  ["고전","고린도전서"],["고후","고린도후서"],["갈","갈라디아서"],
  ["엡",  "에베소서"], ["빌",  "빌립보서"], ["골",  "골로새서"],
  ["살전","데살로니가전서"],["살후","데살로니가후서"],
  ["딤전","디모데전서"],["딤후","디모데후서"],["딛","디도서"],
  ["몬",  "빌레몬서"], ["히",  "히브리서"], ["약",  "야고보서"],
  ["벧전","베드로전서"],["벧후","베드로후서"],
  ["요일","요한일서"], ["요이","요한이서"], ["요삼","요한삼서"],
  ["유",  "유다서"],   ["계",  "요한계시록"],
];

const FULL_NAMES = ABBREV_MAP.map(([, name]) => name);

/** 영상 제목에서 성경 권 이름 추출 */
function extractBooks(title: string): string[] {
  const found = new Set<string>();

  // 1) 전체 이름 직접 포함 여부
  for (const name of FULL_NAMES) {
    if (title.includes(name)) found.add(name);
  }

  // 2) 약어 매칭 (긴 약어 먼저 처리)
  const sorted = [...ABBREV_MAP].sort((a, b) => b[0].length - a[0].length);
  // 괄호 안과 제목 전체에서 "약어+숫자" 패턴 찾기
  for (const [abbr, name] of sorted) {
    if (found.has(name)) continue;
    // 약어 뒤에 숫자 또는 공백+숫자가 오는 패턴
    const re = new RegExp(`(?:^|[\\s,(])${abbr}\\s*\\d`, "i");
    if (re.test(title)) found.add(name);
  }

  return Array.from(found);
}

/* ─── InnerTube 응답에서 영상 목록 + continuation 추출 ─── */
function parseInnerTube(data: Record<string, unknown>): {
  videos: Omit<PRSVideo, "books">[];
  continuation: string | null;
} {
  const videos: Omit<PRSVideo, "books">[] = [];
  let continuation: string | null = null;

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;

    // 영상 항목
    if ("videoId" in obj && "title" in obj && typeof obj.videoId === "string") {
      const title =
        (obj.title as { runs?: { text: string }[]; simpleText?: string })
          ?.runs?.[0]?.text ??
        (obj.title as { simpleText?: string })?.simpleText ??
        "";
      const publishedAt =
        (obj.publishedTimeText as { simpleText?: string })?.simpleText ?? "";
      if (title) videos.push({ id: obj.videoId, title, publishedAt });
      return; // 더 깊이 파지 않음
    }

    // continuation 토큰
    if ("token" in obj && typeof obj.token === "string" && !continuation) {
      continuation = obj.token;
    }

    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) val.forEach(walk);
      else if (val && typeof val === "object") walk(val);
    }
  }

  walk(data);
  return { videos, continuation };
}

const INNERTUBE_CTX = {
  client: {
    clientName: "WEB",
    clientVersion: "2.20231219.04.00",
    hl: "ko",
    gl: "KR",
  },
};

/** InnerTube로 채널 전체 영상 가져오기 (최대 MAX_PAGES × ~30개) */
async function fetchAllVideosInnerTube(): Promise<Omit<PRSVideo, "books">[]> {
  const all: Omit<PRSVideo, "books">[] = [];
  let cont: string | null = null;
  const MAX_PAGES = 60; // ~1800 개

  for (let page = 0; page < MAX_PAGES; page++) {
    const body = cont
      ? { context: INNERTUBE_CTX, continuation: cont }
      : {
          context: INNERTUBE_CTX,
          browseId: CHANNEL_ID,
          params: "EgZ2aWRlb3MQAg==",
        };

    try {
      const res = await fetch(
        "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36",
            "X-YouTube-Client-Name": "1",
            "X-YouTube-Client-Version": "2.20231219.04.00",
          },
          body: JSON.stringify(body),
          cache: "no-store",
        }
      );
      if (!res.ok) break;

      const data = (await res.json()) as Record<string, unknown>;
      const { videos, continuation } = parseInnerTube(data);

      all.push(...videos);
      cont = continuation;
      if (!cont) break;

      // 과부하 방지
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.warn("[prs-videos] InnerTube error:", e);
      break;
    }
  }

  return all;
}

/** RSS 피드 fallback (최신 15개) */
async function fetchRSS(): Promise<Omit<PRSVideo, "books">[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { cache: "no-store" }
    );
    const xml = await res.text();
    const ids     = [...xml.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g)].map(m => m[1]);
    const titles  = [...xml.matchAll(/<title>([^<]+)<\/title>/g)].map(m => m[1]);
    const pubDates = [...xml.matchAll(/<published>([^<]+)<\/published>/g)].map(m => m[1]);

    return ids.map((id, i) => ({
      id,
      title:       titles[i + 1] ?? "",  // +1: 첫 <title>은 채널명
      publishedAt: pubDates[i + 1]?.slice(0, 10) ?? "",
    }));
  } catch {
    return [];
  }
}

/* ─── GET ─── */
export async function GET() {
  // 캐시 확인
  try {
    const ts  = await readFile(TMP_TS_PATH, "utf-8").catch(() => "0");
    const age = (Date.now() - parseInt(ts)) / 1000;
    if (age < CACHE_TTL) {
      const cached = await readFile(TMP_PATH, "utf-8");
      return NextResponse.json(JSON.parse(cached), {
        headers: { "Cache-Control": "no-store" },
      });
    }
  } catch { /* miss */ }

  // 신규 fetch
  let raw = await fetchAllVideosInnerTube();
  if (raw.length === 0) raw = await fetchRSS();

  // books 필드 추가
  const videos: PRSVideo[] = raw.map((v) => ({
    ...v,
    books: extractBooks(v.title),
  }));

  // 캐시 저장
  try {
    await writeFile(TMP_PATH, JSON.stringify(videos), "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* ignore */ }

  return NextResponse.json(videos, {
    headers: { "Cache-Control": "no-store" },
  });
}
