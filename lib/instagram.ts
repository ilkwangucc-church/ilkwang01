/**
 * 일광교회 Instagram Graph API 유틸리티
 * - 부서별 인스타그램 계정 관리 (JSON 파일 기반)
 * - Instagram Graph API를 통한 피드 조회
 * - 장기 토큰 갱신
 * - 인메모리 캐시 (lib/object-cache.ts 활용)
 */

import { readFile, writeFile } from "fs/promises";
import path from "path";
import { getCached, setCached, delCached } from "@/lib/object-cache";

/* ── 타입 ─────────────────────────────────────────────────────── */

export interface InstagramAccount {
  id: string;
  dept: string;
  handle: string;
  gradient: string;
  bio: string;
  url: string;
  accessToken: string;
  instagramUserId: string;
  tokenExpiresAt: string;
  isActive: boolean;
}

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink: string;
}

/* ── JSON 파일 읽기/쓰기 ──────────────────────────────────────── */

const DATA_PATH = path.join(process.cwd(), "data", "instagram-accounts.json");

export async function readAccounts(): Promise<InstagramAccount[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeAccounts(accounts: InstagramAccount[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(accounts, null, 2), "utf-8");
}

export async function getAccountById(id: string): Promise<InstagramAccount | undefined> {
  const accounts = await readAccounts();
  return accounts.find((a) => a.id === id);
}

/* ── Instagram Graph API ──────────────────────────────────────── */

const IG_API = "https://graph.instagram.com";
const FEED_CACHE_TTL = 1800; // 30분

export async function fetchInstagramFeed(
  account: InstagramAccount,
  limit = 12,
): Promise<InstagramPost[]> {
  if (!account.accessToken || !account.isActive) return [];

  const cacheKey = `ig:feed:${account.id}`;
  const cached = await getCached<InstagramPost[]>(cacheKey);
  if (cached) return cached;

  // 토큰 만료 임박 시 백그라운드 갱신 시도
  if (isTokenExpiringSoon(account.tokenExpiresAt, 7) && !isTokenExpired(account.tokenExpiresAt)) {
    refreshLongLivedToken(account.accessToken)
      .then(async (result) => {
        if (result) {
          const accounts = await readAccounts();
          const idx = accounts.findIndex((a) => a.id === account.id);
          if (idx >= 0) {
            accounts[idx].accessToken = result.access_token;
            accounts[idx].tokenExpiresAt = new Date(Date.now() + result.expires_in * 1000).toISOString();
            await writeAccounts(accounts);
          }
        }
      })
      .catch(() => {});
  }

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink";
    const url = `${IG_API}/me/media?fields=${fields}&limit=${limit}&access_token=${account.accessToken}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error(`[Instagram] Feed fetch failed for ${account.id}:`, res.status);
      return [];
    }

    const data = await res.json();
    const posts: InstagramPost[] = data.data ?? [];
    await setCached(cacheKey, posts, FEED_CACHE_TTL);
    return posts;
  } catch (e) {
    console.error(`[Instagram] Feed fetch error for ${account.id}:`, e);
    return [];
  }
}

/** 피드 캐시 삭제 */
export async function invalidateFeedCache(accountId: string): Promise<void> {
  await delCached(`ig:feed:${accountId}`);
}

/* ── 토큰 갱신 ────────────────────────────────────────────────── */

export async function refreshLongLivedToken(
  currentToken: string,
): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const url = `${IG_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ── 토큰 만료 체크 ───────────────────────────────────────────── */

export function isTokenExpiringSoon(expiresAt: string, daysThreshold = 7): boolean {
  if (!expiresAt) return true;
  const expiry = new Date(expiresAt).getTime();
  const threshold = Date.now() + daysThreshold * 24 * 60 * 60 * 1000;
  return expiry < threshold;
}

export function isTokenExpired(expiresAt: string): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() < Date.now();
}
