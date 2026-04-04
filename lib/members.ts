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
/** /tmp 타임스탬프 파일 (캐시 유효성 확인용) */
const TMP_TS_PATH = "/tmp/ilkwang-members-ts.txt";
/** GitHub 파일 경로 */
const GH_FILE_PATH = "data/members.json";
/** /tmp 캐시 유효 시간 (초) — 30초 */
const CACHE_TTL = 30;

/* ── GitHub Contents API 헬퍼 ─────────────────────────────── */
function hasGithub(): boolean {
  return !!(process.env.GITHUB_DB_TOKEN && process.env.GITHUB_DB_REPO);
}

/** GitHub에서 data/members.json 읽기 */
async function githubRead(): Promise<{ content: string; sha: string } | null> {
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo = process.env.GITHUB_DB_REPO!;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${GH_FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { content: string; sha: string };
    const decoded = Buffer.from(json.content, "base64").toString("utf-8");
    return { content: decoded, sha: json.sha };
  } catch {
    return null;
  }
}

/** GitHub에 data/members.json 업데이트 (커밋 생성) */
async function githubWrite(data: string, currentSha: string): Promise<boolean> {
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo = process.env.GITHUB_DB_REPO!;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${GH_FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "DB: 회원 데이터 업데이트",
          content: Buffer.from(data).toString("base64"),
          sha: currentSha,
        }),
        cache: "no-store",
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

/* ── Upstash Redis 헬퍼 (레거시 지원) ────────────────────── */
function hasRedis(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisGet(key: string): Promise<string | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const json = (await res.json()) as { result: string | null };
  return json.result;
}

async function redisSet(key: string, value: string, ttl: number): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const segments = ["set", key, value, "EX", String(ttl)]
    .map(encodeURIComponent)
    .join("/");
  await fetch(`${url}/${segments}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

const REDIS_KEY = "ilkwang:members:v1";
const REDIS_TTL = 86400 * 365;

/* ── /tmp 캐시 헬퍼 ──────────────────────────────────────── */
async function tmpCacheValid(): Promise<boolean> {
  try {
    const ts = await readFile(TMP_TS_PATH, "utf-8");
    return Date.now() - Number(ts) < CACHE_TTL * 1000;
  } catch {
    return false;
  }
}

async function writeTmpCache(data: string): Promise<void> {
  try {
    await writeFile(TMP_PATH, data, "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch {
    /* /tmp 쓰기 실패 무시 */
  }
}

/* ── 회원 목록 읽기 ────────────────────────────────────────── */
/**
 * 우선순위:
 * 1. Upstash Redis (설정 시)
 * 2. /tmp 캐시 (30초 이내)
 * 3. GitHub Contents API (영구 저장소)
 * 4. /tmp (만료되어도 있으면)
 * 5. 배포 번들 data/members.json
 */
export async function readMembers(): Promise<Member[]> {
  // 1. Upstash Redis (설정된 경우 최우선)
  if (hasRedis()) {
    try {
      const raw = await redisGet(REDIS_KEY);
      if (raw) return JSON.parse(raw) as Member[];
    } catch { /* Redis 실패 시 다음으로 */ }
  }

  // 2. /tmp 캐시 (최근 30초 이내 → 빠른 응답)
  if (await tmpCacheValid()) {
    try {
      const raw = await readFile(TMP_PATH, "utf-8");
      const members = JSON.parse(raw) as Member[];
      if (members.length > 0) return members;
    } catch { /* no-op */ }
  }

  // 3. GitHub Contents API (영구 저장소)
  if (hasGithub()) {
    try {
      const result = await githubRead();
      if (result) {
        const members = JSON.parse(result.content) as Member[];
        // SHA와 데이터를 /tmp에 캐시
        await writeTmpCache(result.content);
        try {
          await writeFile("/tmp/ilkwang-members-sha.txt", result.sha, "utf-8");
        } catch { /* no-op */ }
        return members;
      }
    } catch { /* GitHub 실패 시 다음으로 */ }
  }

  // 4. /tmp (만료되어도 있으면 사용)
  try {
    const raw = await readFile(TMP_PATH, "utf-8");
    return JSON.parse(raw) as Member[];
  } catch { /* no-op */ }

  // 5. 배포 번들 초기 데이터
  try {
    const raw = await readFile(DEPLOY_PATH, "utf-8");
    return JSON.parse(raw) as Member[];
  } catch { /* no-op */ }

  return [];
}

/* ── 회원 목록 쓰기 ────────────────────────────────────────── */
/**
 * 쓰기 순서:
 * 1. GitHub Contents API (영구 저장)
 * 2. Upstash Redis (설정 시)
 * 3. /tmp 캐시
 */
export async function writeMembers(members: Member[]): Promise<void> {
  const data = JSON.stringify(members, null, 2);

  // 1. GitHub Contents API (영구 저장 — 핵심)
  if (hasGithub()) {
    try {
      // 현재 SHA 가져오기 (캐시 또는 API)
      let sha: string | null = null;
      try {
        sha = await readFile("/tmp/ilkwang-members-sha.txt", "utf-8");
      } catch { /* no-op */ }

      if (!sha) {
        const current = await githubRead();
        sha = current?.sha ?? null;
      }

      if (sha) {
        const ok = await githubWrite(data, sha);
        if (ok) {
          // 새 SHA 가져와서 캐시 업데이트
          const updated = await githubRead();
          if (updated) {
            try {
              await writeFile("/tmp/ilkwang-members-sha.txt", updated.sha, "utf-8");
            } catch { /* no-op */ }
          }
          console.log("[members] GitHub 저장 성공");
        } else {
          // SHA 충돌 시 재시도 (1회)
          const fresh = await githubRead();
          if (fresh) {
            const retry = await githubWrite(data, fresh.sha);
            if (retry) {
              const afterRetry = await githubRead();
              if (afterRetry) {
                try {
                  await writeFile("/tmp/ilkwang-members-sha.txt", afterRetry.sha, "utf-8");
                } catch { /* no-op */ }
              }
              console.log("[members] GitHub 저장 성공 (재시도)");
            } else {
              console.warn("[members] GitHub 저장 실패");
            }
          }
        }
      }
    } catch (e) {
      console.warn("[members] GitHub write 오류:", e);
    }
  }

  // 2. Upstash Redis (설정된 경우)
  if (hasRedis()) {
    try {
      await redisSet(REDIS_KEY, data, REDIS_TTL);
    } catch {
      console.warn("[members] Redis write 실패");
    }
  }

  // 3. /tmp 캐시 업데이트
  await writeTmpCache(data);

  // 4. 로컬 파일 (자체 서버에서만 가능)
  try {
    await writeFile(DEPLOY_PATH, data, "utf-8");
  } catch { /* Vercel에서는 실패 — 무시 */ }
}

/* ── ID 생성 ──────────────────────────────────────────────── */
export function generateMemberId(members: Member[]): number {
  if (members.length === 0) return 1;
  return Math.max(...members.map((m) => m.id)) + 1;
}
