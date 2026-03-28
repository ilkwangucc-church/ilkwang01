/**
 * 일광교회 YouTube 유틸리티
 * - YOUTUBE_API_KEY 환경변수 있으면 YouTube Data API v3 사용 (20개, 고화질 썸네일)
 * - 없으면 YouTube RSS 피드 사용 (15개, API키 불필요)
 * - 둘 다 실패하면 하드코딩 폴백
 *
 * 채널: https://www.youtube.com/@ilkwangucc
 * 채널 ID: UC93mC-lGcsXSJj4d2oHvGvA
 */

export interface YTVideo {
  id: string;
  title: string;
  publishedAt: string; // ISO 날짜 문자열
  thumbnail: string;
  description: string;
}

export const YT_CHANNEL_ID   = "UC93mC-lGcsXSJj4d2oHvGvA";
export const YT_CHANNEL_URL  = "https://www.youtube.com/@ilkwangucc";

/** 영상 썸네일 URL */
export const ytThumb = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** 영상 YouTube 직접 시청 URL */
export const ytWatch = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;

/** 영상 임베드 URL (옵션 포함) */
export function ytEmbed(
  id: string,
  opts: {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    controls?: boolean;
    modestbranding?: boolean;
  } = {}
): string {
  const p = new URLSearchParams();
  if (opts.autoplay)                  p.set("autoplay", "1");
  if (opts.mute)                      p.set("mute", "1");
  if (opts.loop)                      { p.set("loop", "1"); p.set("playlist", id); }
  if (opts.controls === false)        p.set("controls", "0");
  if (opts.modestbranding !== false)  p.set("modestbranding", "1");
  p.set("rel", "0");
  p.set("playsinline", "1");
  p.set("enablejsapi", "1");
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}

// ─── 메인 fetch 함수 ────────────────────────────────────────────────────────

/**
 * 채널 최신 영상 목록 가져오기.
 * 서버 컴포넌트에서만 호출 가능 (Node fetch 사용).
 * Next.js ISR: 30분마다 자동 갱신.
 */
export async function fetchChannelVideos(): Promise<YTVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const videos = await fetchViaAPI(apiKey);
      if (videos.length > 0) return videos;
    }
    const rss = await fetchViaRSS();
    if (rss.length > 0) return rss;
  } catch (e) {
    console.error("[YouTube] fetch 실패:", e);
  }
  return FALLBACK_VIDEOS;
}

// ─── RSS 피드 파싱 (API 키 불필요) ────────────────────────────────────────

async function fetchViaRSS(): Promise<YTVideo[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
    { next: { revalidate: 1800 } } // 30분
  );
  if (!res.ok) return [];
  const xml = await res.text();

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  return entries
    .map((m) => {
      const e = m[1];
      const id          = e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
      const title       = decodeXML(e.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
      const publishedAt = e.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
      const description = decodeXML(
        e.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.slice(0, 300) ?? ""
      );
      return { id, title, publishedAt, thumbnail: ytThumb(id), description };
    })
    .filter((v) => v.id);
}

// ─── YouTube Data API v3 ──────────────────────────────────────────────────

async function fetchViaAPI(apiKey: string): Promise<YTVideo[]> {
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&channelId=${YT_CHANNEL_ID}` +
    `&maxResults=20&order=date&type=video&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) return [];
  const data = await res.json();
  if (data.error) {
    console.error("[YouTube API]", data.error.message);
    return fetchViaRSS();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((item: any) => ({
    id:          item.id.videoId,
    title:       item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url ??
      ytThumb(item.id.videoId),
    description: item.snippet.description?.slice(0, 300) ?? "",
  }));
}

// ─── XML 디코딩 ─────────────────────────────────────────────────────────────

function decodeXML(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

// ─── 폴백 데이터 (네트워크 실패 시) ─────────────────────────────────────────

export const FALLBACK_VIDEOS: YTVideo[] = [
  { id: "BVamVjzwBIo", title: '2026.03.15. "지혜로운 마음" (시편 90편 1-17)',                        publishedAt: "2026-03-15", thumbnail: ytThumb("BVamVjzwBIo"), description: "" },
  { id: "LALfugNQtzk", title: "0308 일광교회 주일설교 신점일 담임목사 출애굽기 17장 1 17절",          publishedAt: "2026-03-08", thumbnail: ytThumb("LALfugNQtzk"), description: "" },
  { id: "GwAn_d-Wn-g", title: "2025.12.21.예수, 우리 왕(이사야 9:6-7)",                              publishedAt: "2025-12-21", thumbnail: ytThumb("GwAn_d-Wn-g"), description: "" },
  { id: "5JyvKnBRwXI", title: "2025.12.14.전에 하던 대로(다니엘 6:10)",                              publishedAt: "2025-12-14", thumbnail: ytThumb("5JyvKnBRwXI"), description: "" },
  { id: "HDT6y_97ZZY", title: "2025.12.7.바닥에서도 시작되는 하나님의 스토리(창세기 39:1-6)",        publishedAt: "2025-12-07", thumbnail: ytThumb("HDT6y_97ZZY"), description: "" },
  { id: "GNSONodOirY", title: "2025.11.30.광야에서 만난 연합의 능력(출애굽기17장8-13)",              publishedAt: "2025-11-30", thumbnail: ytThumb("GNSONodOirY"), description: "" },
  { id: "-GpyxONySN0", title: "2025.11.16.감사는 선택이 아닌 체질이다(골로새서 3장15-17절)",        publishedAt: "2025-11-16", thumbnail: ytThumb("-GpyxONySN0"), description: "" },
  { id: "vettJ40x1xE", title: "2025.11.09.내게로 오라(마태복음 11장28절)",                          publishedAt: "2025-11-09", thumbnail: ytThumb("vettJ40x1xE"), description: "" },
  { id: "i4C_PY1roDc", title: "2025.10.26.잃은 자를 향한 하나님의 사랑(누가복음15장 1-7절)",        publishedAt: "2025-10-26", thumbnail: ytThumb("i4C_PY1roDc"), description: "" },
  { id: "1DMRzPvBJrI", title: "2025.10.19.늦기 전에, 바로 지금(누가복음16장19-31절)",              publishedAt: "2025-10-19", thumbnail: ytThumb("1DMRzPvBJrI"), description: "" },
  { id: "P84g5BgIpDs", title: "2025.10.12.광야에서도 예배하라(시편63편1-8절)",                      publishedAt: "2025-10-12", thumbnail: ytThumb("P84g5BgIpDs"), description: "" },
  { id: "nZXptLAWmBU", title: "2025.10.05.행복의 비결(시편100편1-5절)",                              publishedAt: "2025-10-05", thumbnail: ytThumb("nZXptLAWmBU"), description: "" },
];
