/**
 * 오브젝트 캐시 (인메모리 LRU + Upstash Redis 선택적 연동)
 *
 * 환경변수 없음: 인메모리 캐시 (개발/소규모 운영)
 * UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN 설정 시: Redis 사용
 */

/* ── 인메모리 캐시 구현 ─────────────────────────────────────── */
interface CacheEntry {
  value:     unknown;
  expiresAt: number;
  createdAt: number;
  key:       string;
  hits:      number;
  size:      number; // approximate bytes
}

class MemoryCache {
  private store = new Map<string, CacheEntry>();
  private readonly maxEntries = 500;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    entry.hits++;
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds = 3600): void {
    this.evict();
    const serialized = JSON.stringify(value);
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
      createdAt: Date.now(),
      key,
      hits: 0,
      size: serialized.length,
    });
  }

  del(key: string): void {
    this.store.delete(key);
  }

  flush(): number {
    const count = this.store.size;
    this.store.clear();
    return count;
  }

  stats(): ObjectCacheStats {
    const now  = Date.now();
    let active = 0, expired = 0, totalHits = 0, totalBytes = 0;
    const keys: string[] = [];

    for (const [, entry] of this.store) {
      if (now > entry.expiresAt) {
        expired++;
      } else {
        active++;
        keys.push(entry.key);
        totalHits  += entry.hits;
        totalBytes += entry.size;
      }
    }
    return {
      type: "In-Memory",
      redis: false,
      total: this.store.size,
      active,
      expired,
      totalHits,
      approximateBytes: totalBytes,
      keys: keys.slice(0, 20),
    };
  }

  private evict(): void {
    if (this.store.size < this.maxEntries) return;
    const now  = Date.now();
    // 만료된 항목 먼저 제거
    for (const [k, v] of this.store) {
      if (now > v.expiresAt) this.store.delete(k);
    }
    // 여전히 크면 가장 오래된 항목 제거
    if (this.store.size >= this.maxEntries) {
      const oldest = [...this.store.values()]
        .sort((a, b) => a.createdAt - b.createdAt)[0];
      if (oldest) this.store.delete(oldest.key);
    }
  }
}

/* ── 글로벌 싱글턴 (Next.js dev 핫리로드 대응) ──────────────── */
type GlobalWithCache = typeof globalThis & { __ilkwangCache?: MemoryCache };
const g = global as GlobalWithCache;
if (!g.__ilkwangCache) g.__ilkwangCache = new MemoryCache();
export const memCache = g.__ilkwangCache;

/* ── 공개 타입 ──────────────────────────────────────────────── */
export interface ObjectCacheStats {
  type:             "In-Memory" | "Upstash Redis";
  redis:            boolean;
  total:            number;
  active:           number;
  expired:          number;
  totalHits:        number;
  approximateBytes: number;
  keys:             string[];
}

/* ── Upstash Redis 헬퍼 ─────────────────────────────────────── */
function hasRedis(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisCmd(command: string, ...args: string[]): Promise<unknown> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const path  = [command, ...args].map(encodeURIComponent).join("/");
  const res   = await fetch(`${url}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache:   "no-store",
  });
  const json  = await res.json();
  return (json as { result: unknown }).result;
}

/* ── 공개 API ───────────────────────────────────────────────── */
export async function getCached<T>(key: string): Promise<T | null> {
  if (hasRedis()) {
    try {
      const raw = await redisCmd("get", key) as string | null;
      if (raw) return JSON.parse(raw) as T;
    } catch (e) {
      console.warn("[ObjectCache] Redis GET 실패, 메모리 캐시 사용:", e);
    }
  }
  return memCache.get<T>(key);
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds = 3600
): Promise<void> {
  memCache.set(key, value, ttlSeconds);
  if (hasRedis()) {
    try {
      const payload = JSON.stringify(value);
      await redisCmd("set", key, payload, "EX", String(ttlSeconds));
    } catch (e) {
      console.warn("[ObjectCache] Redis SET 실패:", e);
    }
  }
}

export async function delCached(key: string): Promise<void> {
  memCache.del(key);
  if (hasRedis()) {
    try { await redisCmd("del", key); }
    catch (e) { console.warn("[ObjectCache] Redis DEL 실패:", e); }
  }
}

export async function flushAllCached(): Promise<number> {
  const count = memCache.flush();
  if (hasRedis()) {
    try { await redisCmd("flushdb"); }
    catch (e) { console.warn("[ObjectCache] Redis FLUSHDB 실패:", e); }
  }
  return count;
}

export async function getObjectCacheStats(): Promise<ObjectCacheStats> {
  if (hasRedis()) {
    try {
      const dbsize = await redisCmd("dbsize") as number;
      const info   = await redisCmd("info", "keyspace") as string;
      const hits   = ((info || "").match(/keyspace_hits:(\d+)/) || [])[1] ?? "0";
      return {
        type:             "Upstash Redis",
        redis:            true,
        total:            dbsize,
        active:           dbsize,
        expired:          0,
        totalHits:        parseInt(hits, 10),
        approximateBytes: 0,
        keys:             [],
      };
    } catch (e) {
      console.warn("[ObjectCache] Redis stats 실패:", e);
    }
  }
  return memCache.stats();
}
