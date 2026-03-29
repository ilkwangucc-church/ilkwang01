"use client";
import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, Zap, Globe, Database, Server,
  CheckCircle2, AlertCircle, Loader2, BarChart3,
  Trash2, Clock, HardDrive, Wifi, Activity,
} from "lucide-react";

/* ── 타입 ─────────────────────────────────────────────────────── */
interface ObjectCacheStats {
  type:             string;
  redis:            boolean;
  total:            number;
  active:           number;
  expired:          number;
  totalHits:        number;
  approximateBytes: number;
  keys:             string[];
}
interface PageSection {
  label:      string;
  paths:      string[];
  revalidate: string;
  strategy:   string;
}
interface CacheStatus {
  timestamp:   string;
  objectCache: ObjectCacheStats;
  pageCache:   { engine: string; sections: PageSection[] };
  cdn:         { provider: string; pops: string; staticTTL: string; bulletinTTL: string; imageTTL: string };
  environment: { redis: boolean; speedInsights: boolean; vercel: boolean; nodeEnv: string };
}

/* ── 상수 ─────────────────────────────────────────────────────── */
const SECRET = "ilkwang-cache-2026";

const SECTIONS = [
  { label: "전체 초기화",   action: "all",     icon: RefreshCw, color: "red",    desc: "모든 캐시(페이지+CDN+오브젝트) 한 번에 초기화" },
  { label: "CDN 초기화",    action: "cdn",     icon: Globe,     color: "orange", desc: "Vercel Edge 캐시 및 전체 레이아웃 재검증" },
  { label: "페이지캐시 초기화", action: "tags", icon: Zap,       color: "blue",   desc: "Next.js Data Cache 태그 전체 재검증" },
  { label: "오브젝트캐시 초기화", action: "object", icon: Database, color: "purple", desc: "Redis / 인메모리 오브젝트 캐시 완전 초기화" },
];

const COLOR_MAP: Record<string, string> = {
  red:    "bg-red-50 border-red-200 hover:bg-red-100 text-red-700",
  orange: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700",
  blue:   "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700",
  purple: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700",
};

/* ── 포맷 헬퍼 ────────────────────────────────────────────────── */
const fmtBytes = (b: number) =>
  b > 1024 * 1024
    ? `${(b / 1024 / 1024).toFixed(1)} MB`
    : b > 1024
    ? `${(b / 1024).toFixed(1)} KB`
    : `${b} B`;

/* ── 메인 컴포넌트 ────────────────────────────────────────────── */
export default function AdminCachePage() {
  const [status,    setStatus]    = useState<CacheStatus | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [logs,      setLogs]      = useState<{ ts: string; action: string; results: string[]; ok: boolean }[]>([]);

  /* 상태 불러오기 */
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/cache/status", { cache: "no-store" });
      setStatus(await r.json());
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  /* 캐시 액션 실행 */
  const runAction = async (action: string, label: string) => {
    setActioning(action);
    try {
      const res  = await fetch("/api/cache/revalidate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action, secret: SECRET }),
      });
      const json = await res.json();
      setLogs((prev) => [
        {
          ts:      new Date().toLocaleTimeString("ko-KR"),
          action:  label,
          results: json.results ?? [json.error ?? "완료"],
          ok:      res.ok,
        },
        ...prev.slice(0, 9),
      ]);
      if (res.ok) await fetchStatus();
    } finally {
      setActioning(null);
    }
  };

  /* 섹션별 초기화 */
  const runSection = async (section: string) => {
    setActioning(`section:${section}`);
    try {
      const res  = await fetch("/api/cache/revalidate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "section", section, secret: SECRET }),
      });
      const json = await res.json();
      setLogs((prev) => [
        { ts: new Date().toLocaleTimeString("ko-KR"), action: `[${section}] 재검증`, results: json.results ?? [], ok: res.ok },
        ...prev.slice(0, 9),
      ]);
      if (res.ok) await fetchStatus();
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">캐시 관리</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Vercel Edge · Next.js Data Cache · 오브젝트 캐시 통합 관리
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          새로고침
        </button>
      </div>

      {/* ── 환경 현황 카드 ── */}
      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Server, label: "캐시 엔진",
              value: status.objectCache.redis ? "Upstash Redis" : "In-Memory",
              sub: status.objectCache.redis ? "Sub-ms 응답" : "개발 모드",
              ok: status.objectCache.redis,
            },
            {
              icon: Database, label: "활성 항목",
              value: `${status.objectCache.active}개`,
              sub: `만료 ${status.objectCache.expired}개`,
              ok: true,
            },
            {
              icon: Activity, label: "캐시 히트",
              value: `${status.objectCache.totalHits}회`,
              sub: fmtBytes(status.objectCache.approximateBytes),
              ok: true,
            },
            {
              icon: Wifi, label: "Vercel CDN",
              value: status.environment.vercel ? "연결됨" : "로컬",
              sub: `PoP ${status.cdn.pops}`,
              ok: status.environment.vercel,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{card.label}</span>
                  <span className={`ml-auto w-2 h-2 rounded-full ${card.ok ? "bg-green-400" : "bg-yellow-400"}`} />
                </div>
                <p className="text-lg font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4대 캐시 액션 ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTIONS.map(({ label, action, icon: Icon, color, desc }) => {
          const busy = actioning === action;
          return (
            <div
              key={action}
              className={`rounded-xl border p-5 transition-colors ${COLOR_MAP[color]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  color === "red"    ? "bg-red-100"    :
                  color === "orange" ? "bg-orange-100" :
                  color === "blue"   ? "bg-blue-100"   : "bg-purple-100"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-sm mb-1">{label}</h3>
              <p className="text-xs opacity-70 leading-relaxed mb-4">{desc}</p>
              <button
                onClick={() => runAction(action, label)}
                disabled={!!actioning}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
                  color === "red"    ? "bg-red-600 hover:bg-red-700 text-white"       :
                  color === "orange" ? "bg-orange-500 hover:bg-orange-600 text-white" :
                  color === "blue"   ? "bg-blue-600 hover:bg-blue-700 text-white"     :
                                       "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {busy
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 처리 중…</>
                  : <><Icon className="w-3.5 h-3.5" /> 실행</>
                }
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── 페이지캐싱 설정 ── */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2E7D32]" />
            <h2 className="font-bold text-gray-800 text-sm">페이지캐싱 설정</h2>
            <span className="ml-auto text-xs text-gray-400">
              {status?.pageCache.engine}
            </span>
          </div>
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {(status?.pageCache.sections ?? []).map((s) => (
              <div key={s.label} className="flex items-center px-5 py-3 gap-3 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                  <p className="text-xs text-gray-400 truncate">{s.paths.join(", ")}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-bold ${
                    s.revalidate === "static" ? "text-gray-400" : "text-[#2E7D32]"
                  }`}>{s.strategy}</p>
                </div>
                <button
                  onClick={() => runSection(s.label)}
                  disabled={!!actioning}
                  title="이 섹션만 재검증"
                  className="p-1.5 text-gray-300 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition-colors disabled:opacity-30"
                >
                  {actioning === `section:${s.label}`
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <RefreshCw className="w-3.5 h-3.5" />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── 오브젝트캐싱 현황 ── */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-500" />
            <h2 className="font-bold text-gray-800 text-sm">오브젝트캐싱</h2>
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
              status?.objectCache.redis
                ? "bg-green-50 text-green-600"
                : "bg-yellow-50 text-yellow-600"
            }`}>
              {status?.objectCache.type ?? "—"}
            </span>
          </div>
          <div className="p-5 space-y-4">
            {/* 통계 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "전체",  val: status?.objectCache.total    ?? 0, color: "text-gray-800" },
                { label: "활성",  val: status?.objectCache.active   ?? 0, color: "text-green-600" },
                { label: "만료",  val: status?.objectCache.expired  ?? 0, color: "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* 캐시 키 목록 */}
            {status?.objectCache.keys && status.objectCache.keys.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">활성 캐시 키</p>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {status.objectCache.keys.map((k) => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                      <code className="text-gray-600 truncate">{k}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Redis 미연동 안내 */}
            {!status?.objectCache.redis && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-700">
                <p className="font-semibold mb-1">Upstash Redis 미연동</p>
                <p>.env.local에 UPSTASH_REDIS_REST_URL 및 UPSTASH_REDIS_REST_TOKEN 설정 시 Sub-ms Redis 캐시 활성화</p>
              </div>
            )}

            <button
              onClick={() => runAction("object", "오브젝트캐시 초기화")}
              disabled={!!actioning}
              className="w-full flex items-center justify-center gap-2 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              캐시 완전 초기화
            </button>
          </div>
        </div>
      </div>

      {/* ── CDN 설정 현황 ── */}
      {status && (
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-gray-800 text-sm">CDN 캐시 설정</h2>
            <span className="ml-auto text-xs text-gray-400">{status.cdn.provider}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "정적 자산 (_next/static)",   val: status.cdn.staticTTL,   icon: "⚡" },
              { label: "주보 파일 (/bulletins/)",    val: status.cdn.bulletinTTL, icon: "📄" },
              { label: "최적화 이미지 (next/image)", val: status.cdn.imageTTL,    icon: "🖼" },
              { label: "PoP 거점",                  val: status.cdn.pops,         icon: "🌐" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{item.icon} {item.label}</p>
                <p className="text-sm font-bold text-gray-700 truncate">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 실행 로그 ── */}
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="font-bold text-gray-300 text-sm">실행 로그</h2>
            <button
              onClick={() => setLogs([])}
              className="ml-auto text-xs text-gray-500 hover:text-gray-300"
            >
              지우기
            </button>
          </div>
          <div className="p-4 space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-gray-500 shrink-0">{log.ts}</span>
                {log.ok
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  : <AlertCircle  className="w-3.5 h-3.5 text-red-400   shrink-0 mt-0.5" />
                }
                <div>
                  <span className={log.ok ? "text-green-300" : "text-red-300"}>
                    {log.action}
                  </span>
                  <div className="text-gray-500 mt-0.5">
                    {log.results.slice(0, 5).map((r, j) => (
                      <div key={j}>· {r}</div>
                    ))}
                    {log.results.length > 5 && (
                      <div>· … 외 {log.results.length - 5}개</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
