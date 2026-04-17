"use client";
import type { Analytics } from "@/lib/chatbot-types";

export function OverviewTab({ analytics: a }: { analytics: Analytics | null }) {
  const stats = [
    { label: "전체 대화", value: a?.total_conversations ?? 0 },
    { label: "해결 완료", value: a?.resolved_conversations ?? 0 },
    { label: "해결률", value: `${a?.resolution_rate ?? 0}%` },
    { label: "에스컬레이션", value: a?.total_escalations ?? 0 },
    { label: "티켓", value: a?.total_tickets ?? 0 },
    { label: "평균 CSAT", value: a?.avg_csat != null ? `${a.avg_csat} / 5` : "-" },
    { label: "이메일 수집", value: a?.email_contacts ?? 0 },
  ];

  const maxDaily = a?.daily_volume?.length
    ? Math.max(...a.daily_volume.map((d) => d.n), 1)
    : 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-xl font-bold text-gray-900">{String(s.value)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {a?.daily_volume && a.daily_volume.length > 0 && (
          <div className="bg-white rounded-lg border p-5">
            <div className="text-sm font-semibold text-gray-900 mb-4">일별 대화 수 (14일)</div>
            <div className="flex gap-1 items-end h-28">
              {a.daily_volume.map((d) => {
                const h = Math.max(4, Math.round((d.n / maxDaily) * 85));
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] text-gray-500">{d.n || ""}</div>
                    <div
                      className="w-full bg-[#2E7D32] rounded-t"
                      style={{ height: h }}
                    />
                    <div className="text-[10px] text-gray-500">{d.day.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {a?.languages && a.languages.length > 0 && (
          <div className="bg-white rounded-lg border p-5">
            <div className="text-sm font-semibold text-gray-900 mb-4">언어 분포</div>
            <div className="flex gap-2 flex-wrap">
              {a.languages.map((l) => (
                <span
                  key={l.language}
                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium"
                >
                  {l.language.toUpperCase()} · {l.n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
