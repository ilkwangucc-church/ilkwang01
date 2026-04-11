import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const CHANNEL_HANDLE = "@ilkwangucc";
const TMP_PATH       = "/tmp/ilkwang-sermons.json";
const TMP_TS_PATH    = "/tmp/ilkwang-sermons-ts.txt";
const CACHE_TTL      = 60 * 60 * 6; // 6시간

export interface SermonVideo {
  id:          string;
  title:       string;
  publishedAt: string;   // "yyyy. m. d." 또는 상대 날짜
  year:        number;   // 연도 (추정)
  duration:    string;   // "HH:MM:SS" 또는 ""
  thumbnail:   string;   // maxresdefault URL
}

/* ─── InnerTube 공통 ─── */
const CTX = {
  client: { clientName: "WEB", clientVersion: "2.20231219.04.00", hl: "ko", gl: "KR" },
};
const HEADERS = {
  "Content-Type":             "application/json",
  "User-Agent":               "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36",
  "X-YouTube-Client-Name":    "1",
  "X-YouTube-Client-Version": "2.20231219.04.00",
};

async function itPOST(body: object): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false",
      { method: "POST", headers: HEADERS, body: JSON.stringify(body), cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json() as Record<string, unknown>;
  } catch (e) {
    console.warn("[ilkwang-sermons] InnerTube 오류:", e);
    return null;
  }
}

/* ─── 라이브 스트림 여부 판별 ─── */
function isLive(obj: Record<string, unknown>): boolean {
  const json = JSON.stringify(obj);
  if (/"BADGE_STYLE_TYPE_LIVE_NOW"/.test(json)) return true;
  if (/"thumbnailOverlayTimeStatusRenderer".*?"LIVE"/.test(json)) return true;
  // upcomingEventData 또는 isLive
  if (/"isLive"\s*:\s*true/.test(json)) return true;
  return false;
}

/* ─── 연도 추정 ─── */
function guessYear(publishedAt: string): number {
  const now = new Date();
  // "2024. 3. 1." 형식
  const full = publishedAt.match(/(\d{4})\.\s*\d+\.\s*\d+/);
  if (full) return parseInt(full[1]);
  // "N년 전"
  const yearsAgo = publishedAt.match(/(\d+)\s*년\s*전/);
  if (yearsAgo) return now.getFullYear() - parseInt(yearsAgo[1]);
  // "N개월 전", "N주 전", "N일 전", "N시간 전" → 올해
  if (/개월|주|일|시간|분/.test(publishedAt)) return now.getFullYear();
  return now.getFullYear(); // 기본값
}

/* ─── 영상 파싱 ─── */
interface RawVideo {
  id: string; title: string; publishedAt: string; duration: string; isLiveStream: boolean;
}
function parseVideos(data: Record<string, unknown>): { videos: RawVideo[]; continuation: string | null } {
  const videos: RawVideo[] = [];
  let continuation: string | null = null;

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;

    if ("videoId" in obj && typeof obj.videoId === "string" && "title" in obj) {
      const title =
        (obj.title as { runs?: { text: string }[]; simpleText?: string })?.runs?.[0]?.text ??
        (obj.title as { simpleText?: string })?.simpleText ?? "";

      const publishedAt =
        (obj.publishedTimeText as { simpleText?: string })?.simpleText ??
        (obj.dateText as { simpleText?: string })?.simpleText ?? "";

      // 재생 시간
      const duration =
        (obj.lengthText as { simpleText?: string })?.simpleText ??
        (obj.thumbnailOverlayTimeStatusRenderer as Record<string, unknown> | undefined)?.text?.toString() ?? "";

      if (title) {
        videos.push({
          id:           obj.videoId,
          title,
          publishedAt,
          duration,
          isLiveStream: isLive(obj),
        });
      }
      return;
    }

    // continuation 토큰: 4qmFsg 로 시작하는 YouTube 페이지네이션 토큰
    if ("token" in obj && typeof obj.token === "string"
        && obj.token.startsWith("4qmFsg") && !continuation) {
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

/* ─── 채널 핸들로 채널 ID 조회 ─── */
async function resolveChannelId(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/${handle}`, {
      headers: { "User-Agent": HEADERS["User-Agent"] },
      cache: "no-store",
    });
    const html = await res.text();
    // YouTube HTML은 externalId 또는 channelId 두 가지 중 하나를 사용
    const m = html.match(/"externalId"\s*:\s*"(UC[^"]+)"/)
           ?? html.match(/"channelId"\s*:\s*"(UC[^"]+)"/);
    return m ? m[1] : null;
  } catch { return null; }
}

/* ─── 채널 Videos 탭 전체 수집 ─── */
async function fetchAllSermons(): Promise<SermonVideo[]> {
  // 채널 ID 확인
  const channelId = await resolveChannelId(CHANNEL_HANDLE);
  if (!channelId) {
    console.warn("[ilkwang-sermons] 채널 ID 조회 실패");
    return [];
  }
  console.log(`[ilkwang-sermons] 채널 ID: ${channelId}`);

  const all: RawVideo[] = [];
  let cont: string | null = null;
  const MAX_PAGES = 60;
  const STOP_YEAR = 2024;

  for (let page = 0; page < MAX_PAGES; page++) {
    const body = cont
      ? { context: CTX, continuation: cont }
      : { context: CTX, browseId: channelId, params: "EgZ2aWRlb3MQAg==" };

    const data = await itPOST(body);
    if (!data) break;

    const { videos, continuation } = parseVideos(data);
    let stop = false;

    for (const v of videos) {
      const year = guessYear(v.publishedAt);
      if (year < STOP_YEAR) { stop = true; break; }
      all.push(v);
    }

    cont = continuation;
    if (!cont || stop) break;
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`[ilkwang-sermons] 수집 ${all.length}개 (라이브/쇼츠 필터 전)`);

  // 라이브 스트림 + 쇼츠 필터
  const filtered = all.filter((v) => {
    if (v.isLiveStream) return false;
    const titleLower = v.title.toLowerCase();
    if (/라이브|live|생방송|스트리밍/.test(titleLower)) return false;
    // 쇼츠: duration이 60초 이하 형식 (:ss 또는 0:ss)
    if (/^0?:\d\d$/.test(v.duration)) return false;
    if (/^#shorts/i.test(v.title)) return false;
    return true;
  });

  console.log(`[ilkwang-sermons] 필터 후 ${filtered.length}개`);

  return filtered.map((v) => ({
    id:          v.id,
    title:       v.title,
    publishedAt: v.publishedAt,
    year:        guessYear(v.publishedAt),
    duration:    v.duration,
    thumbnail:   `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  }));
}

/* ─── GET ─── */
export async function GET() {
  // 캐시
  try {
    const ts  = await readFile(TMP_TS_PATH, "utf-8").catch(() => "0");
    const age = (Date.now() - parseInt(ts)) / 1000;
    if (age < CACHE_TTL) {
      const cached = await readFile(TMP_PATH, "utf-8");
      return NextResponse.json(JSON.parse(cached), { headers: { "Cache-Control": "no-store" } });
    }
  } catch { /* miss */ }

  const sermons = await fetchAllSermons();

  try {
    await writeFile(TMP_PATH, JSON.stringify(sermons));
    await writeFile(TMP_TS_PATH, String(Date.now()));
  } catch { /* ignore */ }

  return NextResponse.json(sermons, { headers: { "Cache-Control": "no-store" } });
}
