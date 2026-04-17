"use client";
import type { Ticket } from "@/lib/chatbot-types";

export function TicketsTab({
  tickets,
  updateTicket,
}: {
  tickets: Ticket[];
  updateTicket: (id: number, status: string) => void;
}) {
  const open = tickets.filter((t) => t.status === "open");
  const inProgress = tickets.filter((t) => t.status === "in_progress");
  const resolved = tickets.filter((t) => t.status === "resolved");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-xs text-gray-500 mb-1">대기중</div>
          <div className="text-xl font-bold text-blue-600">{open.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-xs text-gray-500 mb-1">처리중</div>
          <div className="text-xl font-bold text-yellow-600">{inProgress.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-xs text-gray-500 mb-1">해결됨</div>
          <div className="text-xl font-bold text-emerald-600">{resolved.length}</div>
        </div>
      </div>

      <div className="space-y-2">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white rounded-lg border p-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-gray-900">#{t.id} {t.subject}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    t.status === "open"
                      ? "bg-blue-100 text-blue-700"
                      : t.status === "resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.status === "open" ? "대기중" : t.status === "resolved" ? "해결됨" : "처리중"}
                </span>
                {t.language && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700">
                    {t.language.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1 leading-relaxed">{t.message.slice(0, 200)}</div>
              <div className="text-xs text-gray-400">
                {t.email || "익명"} · {t.created_at.slice(0, 10)}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {t.status !== "in_progress" && (
                <button
                  onClick={() => updateTicket(t.id, "in_progress")}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700"
                >
                  처리중
                </button>
              )}
              {t.status !== "resolved" && (
                <button
                  onClick={() => updateTicket(t.id, "resolved")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                >
                  해결됨
                </button>
              )}
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-gray-500 text-center py-10 text-sm">티켓 없음</div>
        )}
      </div>
    </div>
  );
}
