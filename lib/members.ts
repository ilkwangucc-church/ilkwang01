import { readFile, writeFile } from "fs/promises";
import path from "path";

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: number;
  dept: string;
  matched: boolean;
  joined: string;
  passwordHash?: string; // 자체 회원가입 시 저장
  profileUrl?: string;   // 프로필 이미지 URL (선택)
}

/** 배포 번들 경로 (읽기 가능, Vercel에서 쓰기 불가) */
const DEPLOY_PATH = path.join(process.cwd(), "data", "members.json");
/** Vercel /tmp 경로 (쓰기 가능, 인스턴스 내 유지) */
const TMP_PATH = "/tmp/ilkwang-members.json";
/** Upstash Redis 키 (Vercel 환경 영구 저장) */
const REDIS_KEY = "ilkwang:members:v1";
const REDIS_TTL = 86400 * 365; // 1년

/* ── Upstash Redis 헬퍼 ────────────────────────────────────── */
function hasRedis(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisGet(key: string): Promise<string | null> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res   = await fetch(
    `${url}/get/${encodeURIComponent(key)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  const json = (await res.json()) as { result: string | null };
  return json.result;
}

async function redisSet(key: string, value: string, ttl: number): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const segments = ["set", key, value, "EX", String(ttl)]
    .map(encodeURIComponent)
    .join("/");
  await fetch(`${url}/${segments}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache:   "no-store",
  });
}

/* ── 회원 목록 읽기 ────────────────────────────────────────── */
/**
 * 우선순위: Upstash Redis → /tmp → data/members.json
 */
export async function readMembers(): Promise<Member[]> {
  // 1. Upstash Redis (Vercel 환경 인스턴스 간 공유 영구 저장소)
  if (hasRedis()) {
    try {
      const raw = await redisGet(REDIS_KEY);
      if (raw) return JSON.parse(raw) as Member[];
    } catch {
      // Redis 실패 시 로컬 파일로 폴백
    }
  }

  // 2. /tmp (동일 인스턴스 내 빠른 캐시)
  try {
    const raw = await readFile(TMP_PATH, "utf-8");
    return JSON.parse(raw) as Member[];
  } catch { /* no-op */ }

  // 3. 배포 번들 초기 데이터
  try {
    const raw = await readFile(DEPLOY_PATH, "utf-8");
    return JSON.parse(raw) as Member[];
  } catch { /* no-op */ }

  return [];
}

/* ── 회원 목록 쓰기 ────────────────────────────────────────── */
/**
 * 우선순위: Upstash Redis(영구) + data/(자체서버) 또는 /tmp(Vercel 폴백)
 */
export async function writeMembers(members: Member[]): Promise<void> {
  const data = JSON.stringify(members, null, 2);

  // 1. Upstash Redis (Vercel 환경 영구 저장 — 인스턴스 무관)
  if (hasRedis()) {
    try {
      await redisSet(REDIS_KEY, data, REDIS_TTL);
    } catch {
      console.warn("[members] Redis write 실패");
    }
  }

  // 2. 로컬 파일 (자체 서버 → data/, Vercel → /tmp)
  try {
    await writeFile(DEPLOY_PATH, data, "utf-8");
  } catch {
    try {
      await writeFile(TMP_PATH, data, "utf-8");
    } catch {
      // Redis 만 가능한 경우 무시
    }
  }
}

/* ── ID 생성 ──────────────────────────────────────────────── */
export function generateMemberId(members: Member[]): number {
  if (members.length === 0) return 1;
  return Math.max(...members.map((m) => m.id)) + 1;
}
