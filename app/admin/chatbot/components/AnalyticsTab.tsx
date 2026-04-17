"use client";
import type { Analytics } from "@/lib/chatbot-types";

export function AnalyticsTab({
  analytics: a,
  analyticsLoading,
}: {
  analytics: Analytics | null;
  analyticsLoading: boolean;
}) {
  if (analyticsLoading) {
    return <div className="text-gray-500 p-10 text-sm">분석 데이터 로딩 중...</div>;
  }
  if (!a) {
    return <div className="text-gray-500 text-center py-10 text-sm">분석 데이터 없음</div>;
  }

  const stats = [
    { label: "전체 대화 (30일)", value: a.total_conversations },
    { label: "해결 완료", value: a.resolved_conversations },
    { label: "해결률", value: `${a.resolution_rate ?? 0}%` },
    { label: "에스컬레이션", value: a.total_escalations },
    { label: "티켓", value: a.total_tickets },
    { label: "평균 CSAT", value: a.avg_csat != null ? `${a.avg_csat} ★` : "—" },
    { label: "이메일 수집", value: a.email_contacts },
  ];

  const langTotal = a.languages.reduce((acc, x) => acc + x.n, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-xl font-bold text-gray-900">{String(s.value)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {a.languages.length > 0 && (
          <div className="bg-white rounded-lg border p-5">
            <div className="text-sm font-semibold text-gray-900 mb-3">언어 분포</div>
            <div className="space-y-3">
              {a.languages.map((l) => {
                const pct = langTotal ? Math.round((l.n / langTotal) * 100) : 0;
                return (
                  <div key={l.language}>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="font-semibold text-gray-900">{l.language.toUpperCase()}</span>
                      <span className="text-gray-500">{l.n}개 ({pct}%)</span>
                    </div>
                    <div className="bg-gray-200 rounded h-2">
                      <div className="bg-[#2E7D32] rounded h-2" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {a.events.length > 0 && (
          <div className="bg-white rounded-lg border p-5">
            <div className="text-sm font-semibold text-gray-900 mb-3">이벤트 분류</div>
            <div className="flex gap-2.5 flex-wrap">
              {a.events.map((e) => (
                <div key={e.event_type} className="bg-gray-50 rounded-lg border p-3 min-w-[120px]">
                  <div className="text-lg font-bold text-gray-900">{e.n}</div>
                  <div className="text-xs text-gray-500">{e.event_type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
