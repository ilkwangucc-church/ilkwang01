import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const CHANNEL_ID  = "UCISl2wEDnzYeg-k_kElfN4Q"; // @PRS
const TMP_PATH    = "/tmp/ilkwang-prs-videos.json";
const TMP_TS_PATH = "/tmp/ilkwang-prs-videos-ts.txt";
const CACHE_TTL   = 60 * 60 * 6; // 6시간

export interface PRSVideo {
  id: string;
  title: string;
  books: string[];        // 매핑된 성경 권 이름(들)
  chapter: number | null; // 단일 권 영상의 장/편 번호
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

/** 영상/플레이리스트 제목에서 성경 권 이름 추출 */
function extractBooks(title: string): string[] {
  const found = new Set<string>();
  for (const name of FULL_NAMES) {
    if (title.includes(name)) found.add(name);
  }
  const sorted = [...ABBREV_MAP].sort((a, b) => b[0].length - a[0].length);
  for (const [abbr, name] of sorted) {
    if (found.has(name)) continue;
    const re = new RegExp(`(?:^|[\\s,(\\[])${abbr}\\s*\\d`, "i");
    if (re.test(title)) found.add(name);
  }
  return Array.from(found);
}

/** 제목에서 장/편 번호 추출 — 단일 권 영상 전용 */
function extractChapter(title: string, books: string[]): number | null {
  if (books.length !== 1) return null;
  // "N장" 또는 "N편" (시편 등) 패턴, "제N장" 허용
  const m = title.match(/제?\s*(\d+)\s*[장편]/);
  return m ? parseInt(m[1], 10) : null;
}

/* ─── InnerTube 공통 ─── */
const INNERTUBE_CTX = {
  client: {
    clientName: "WEB",
    clientVersion: "2.20231219.04.00",
    hl: "ko",
    gl: "KR",
  },
};

const INNERTUBE_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36",
  "X-YouTube-Client-Name": "1",
  "X-YouTube-Client-Version": "2.20231219.04.00",
};

async function innerTubePOST(
  body: object
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false",
      {
        method: "POST",
        headers: INNERTUBE_HEADERS,
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch (e) {
    console.warn("[prs-videos] InnerTube POST 오류:", e);
    return null;
  }
}

/* ─── 응답 파서: 영상 항목 ─── */
function parseVideoItems(data: Record<string, unknown>): {
  videos: Omit<PRSVideo, "books" | "chapter">[];
  continuation: string | null;
} {
  const videos: Omit<PRSVideo, "books" | "chapter">[] = [];
  let continuation: string | null = null;

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;

    if ("videoId" in obj && "title" in obj && typeof obj.videoId === "string") {
      const title =
        (obj.title as { runs?: { text: string }[]; simpleText?: string })
          ?.runs?.[0]?.text ??
        (obj.title as { simpleText?: string })?.simpleText ??
        "";
      const publishedAt =
        (obj.publishedTimeText as { simpleText?: string })?.simpleText ?? "";
      if (title) videos.push({ id: obj.videoId, title, publishedAt });
      return;
    }

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

/* ─── 응답 파서: 플레이리스트 항목 ─── */
function parsePlaylistItems(data: Record<string, unknown>): {
  playlists: { id: string; title: string }[];
  continuation: string | null;
} {
  const playlists: { id: string; title: string }[] = [];
  let continuation: string | null = null;

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;

    if (
      "playlistId" in obj &&
      "title" in obj &&
      typeof obj.playlistId === "string"
    ) {
      const title =
        (obj.title as { runs?: { text: string }[]; simpleText?: string })
          ?.runs?.[0]?.text ??
        (obj.title as { simpleText?: string })?.simpleText ??
        "";
      if (title) playlists.push({ id: obj.playlistId as string, title });
      return;
    }

    if ("token" in obj && typeof obj.token === "string" && !continuation) {
      continuation = obj.token;
    }

    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) val.forEach(walk);
      else if (val && typeof val === "object") walk(val);
    }
  }

  walk(data);
  return { playlists, continuation };
}

/* ─── 채널 플레이리스트 탭 전체 가져오기 ─── */
async function fetchChannelPlaylists(): Promise<
  { id: string; title: string }[]
> {
  const all: { id: string; title: string }[] = [];
  let cont: string | null = null;

  for (let page = 0; page < 5; page++) {
    const body = cont
      ? { context: INNERTUBE_CTX, continuation: cont }
      : {
          context: INNERTUBE_CTX,
          browseId: CHANNEL_ID,
          params: "EglwbGF5bGlzdHMQAA==", // 재생목록 탭
        };

    const data = await innerTubePOST(body);
    if (!data) break;

    const { playlists, continuation } = parsePlaylistItems(data);
    all.push(...playlists);
    cont = continuation;
    if (!cont) break;

    await new Promise((r) => setTimeout(r, 200));
  }

  return all;
}

/* ─── 특정 플레이리스트의 영상 가져오기 ─── */
async function fetchPlaylistVideos(
  playlistId: string
): Promise<Omit<PRSVideo, "books" | "chapter">[]> {
  const all: Omit<PRSVideo, "books" | "chapter">[] = [];
  let cont: string | null = null;

  for (let page = 0; page < 20; page++) {
    const body = cont
      ? { context: INNERTUBE_CTX, continuation: cont }
      : { context: INNERTUBE_CTX, browseId: `VL${playlistId}` };

    const data = await innerTubePOST(body);
    if (!data) break;

    const { videos, continuation } = parseVideoItems(data);
    all.push(...videos);
    cont = continuation;
    if (!cont) break;

    await new Promise((r) => setTimeout(r, 150));
  }

  return all;
}

/* ─── 플레이리스트 기반 통독 영상 전체 수집 ─── */
async function fetchAllVideosFromPlaylists(): Promise<
  Omit<PRSVideo, "books" | "chapter">[]
> {
  const playlists = await fetchChannelPlaylists();
  if (playlists.length === 0) return [];

  console.log(`[prs-videos] 플레이리스트 ${playlists.length}개 발견`);

  // 성경 권 이름이 포함된 플레이리스트만 대상으로 삼음
  // 매칭되는 것이 없으면 전체 플레이리스트 처리
  const biblePlaylists = playlists.filter(
    (p) => extractBooks(p.title).length > 0
  );
  const targets = biblePlaylists.length > 0 ? biblePlaylists : playlists;

  console.log(`[prs-videos] 통독 대상 플레이리스트 ${targets.length}개`);

  // 병렬 배치 처리 (10개씩)
  const BATCH = 10;
  const all: Omit<PRSVideo, "books" | "chapter">[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map((p) => fetchPlaylistVideos(p.id))
    );
    for (const videos of results) {
      for (const v of videos) {
        if (!seen.has(v.id)) {
          seen.add(v.id);
          all.push(v);
        }
      }
    }
    if (i + BATCH < targets.length) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  console.log(`[prs-videos] 플레이리스트 수집 영상 총 ${all.length}개`);
  return all;
}

/* ─── Fallback: 채널 videos 탭 전체 ─── */
async function fetchAllVideosInnerTube(): Promise<
  Omit<PRSVideo, "books" | "chapter">[]
> {
  const all: Omit<PRSVideo, "books" | "chapter">[] = [];
  let cont: string | null = null;
  const MAX_PAGES = 60;

  for (let page = 0; page < MAX_PAGES; page++) {
    const body = cont
      ? { context: INNERTUBE_CTX, continuation: cont }
      : {
          context: INNERTUBE_CTX,
          browseId: CHANNEL_ID,
          params: "EgZ2aWRlb3MQAg==",
        };

    const data = await innerTubePOST(body);
    if (!data) break;

    const { videos, continuation } = parseVideoItems(data);
    all.push(...videos);
    cont = continuation;
    if (!cont) break;

    await new Promise((r) => setTimeout(r, 250));
  }

  return all;
}

/* ─── Fallback: RSS 피드 (최신 15개) ─── */
async function fetchRSS(): Promise<Omit<PRSVideo, "books" | "chapter">[]> {
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
      title:       titles[i + 1] ?? "",
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

  // 1차: 재생목록 기반 fetch
  let raw = await fetchAllVideosFromPlaylists();

  // 2차: 채널 videos 탭 fallback
  if (raw.length === 0) raw = await fetchAllVideosInnerTube();

  // 3차: RSS fallback
  if (raw.length === 0) raw = await fetchRSS();

  // books + chapter 필드 추가
  const videos: PRSVideo[] = raw.map((v) => {
    const books = extractBooks(v.title);
    return { ...v, books, chapter: extractChapter(v.title, books) };
  });

  // 캐시 저장
  try {
    await writeFile(TMP_PATH, JSON.stringify(videos), "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* ignore */ }

  return NextResponse.json(videos, {
    headers: { "Cache-Control": "no-store" },
  });
}
