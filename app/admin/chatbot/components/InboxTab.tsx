"use client";
import type { Conversation, Message } from "@/lib/chatbot-types";
import { STATUS_LABEL_KO, formatTime } from "@/lib/chatbot-types";

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "영어" },
  { value: "ja", label: "일본어" },
  { value: "zh", label: "중국어" },
  { value: "vi", label: "베트남어" },
  { value: "th", label: "태국어" },
  { value: "id", label: "인도네시아어" },
  { value: "es", label: "스페인어" },
  { value: "fr", label: "프랑스어" },
  { value: "de", label: "독일어" },
  { value: "ru", label: "러시아어" },
];

function statusBadgeClass(status: string) {
  if (status === "resolved") return "bg-emerald-100 text-emerald-700";
  if (status === "handled") return "bg-yellow-100 text-yellow-700";
  if (status === "escalated") return "bg-red-100 text-red-700";
  return "bg-blue-100 text-blue-700";
}

interface Props {
  filteredConvs: Conversation[];
  selectedConv: Conversation | null;
  setSelectedConv: (c: Conversation | null) => void;
  messages: Message[];
  replyText: string;
  setReplyText: (v: string) => void;
  targetLanguage: string;
  setTargetLanguage: (v: string) => void;
  sendingReply: boolean;
  loading: boolean;
  convFilter: string;
  setConvFilter: (v: string) => void;
  convSearch: string;
  setConvSearch: (v: string) => void;
  page: number;
  setPage: (fn: (p: number) => number) => void;
  pages: number;
  openConversation: (c: Conversation) => void;
  sendReply: () => void;
  updateConvStatus: (id: string, status: string) => void;
  loadConversations: () => void;
}

export function InboxTab({
  filteredConvs,
  selectedConv,
  setSelectedConv,
  messages,
  replyText,
  setReplyText,
  targetLanguage,
  setTargetLanguage,
  sendingReply,
  loading,
  convFilter,
  setConvFilter,
  convSearch,
  setConvSearch,
  page,
  setPage,
  pages,
  openConversation,
  sendReply,
  updateConvStatus,
  loadConversations,
}: Props) {
  if (selectedConv) {
    return (
      <div className="flex gap-4 h-[640px]">
        {/* 목록 */}
        <div className="w-72 shrink-0 overflow-y-auto flex flex-col gap-1.5">
          <button
            onClick={() => setSelectedConv(null)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 text-left"
          >
            ← 목록으로
          </button>
          {filteredConvs.map((c) => (
            <div
              key={c.id}
              onClick={() => openConversation(c)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedConv?.id === c.id
                  ? "bg-emerald-50 border-[#2E7D32]"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex gap-1.5 mb-1 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusBadgeClass(c.status)}`}>
                  {STATUS_LABEL_KO[c.status] || c.status}
                </span>
                {c.escalated === 1 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700">
                    에스컬
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {c.customer_email || c.visitor_id || "익명"}
              </div>
              <div className="text-xs text-gray-600 truncate mt-0.5">
                {c.last_message || c.first_message || "—"}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">{c.msg_count}개 메시지</div>
            </div>
          ))}
        </div>

        {/* 대화 상세 */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="flex-1">
              <div className="font-bold text-gray-900">
                {selectedConv.customer_email || selectedConv.visitor_id || "익명"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {selectedConv.msg_count}개 메시지 · {selectedConv.language?.toUpperCase() || "—"} ·{" "}
                {selectedConv.created_at.slice(0, 10)}
              </div>
            </div>
            <select
              value={selectedConv.status}
              onChange={(e) => updateConvStatus(selectedConv.id, e.target.value)}
              className="bg-white border rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="open">진행중</option>
              <option value="handled">처리됨</option>
              <option value="resolved">해결됨</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-gray-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[75%] p-3 rounded-lg text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-[#2E7D32] text-white"
                    : m.role === "agent"
                    ? "self-start bg-emerald-50 border-l-4 border-emerald-500 text-gray-800"
                    : "self-start bg-white border text-gray-800"
                }`}
              >
                {m.role !== "user" && (
                  <div className={`text-[10px] font-bold mb-1 ${m.role === "agent" ? "text-emerald-700" : "text-gray-500"}`}>
                    {m.role === "agent" ? "상담원" : "AI"}
                  </div>
                )}
                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                <div className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/60" : "text-gray-400"}`}>
                  {m.created_at.slice(11, 16)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-700">전송 언어</span>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-white border rounded-lg px-2 py-1 text-xs"
              >
                {LANGUAGE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-gray-500">
                한국어가 아니면 자동 번역되어 전송됩니다
              </span>
            </div>
            <div className="flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="상담원 답변을 한국어로 입력 (Enter 전송, Shift+Enter 줄바꿈)"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                className="flex-1 border rounded-lg px-3 py-2 text-sm resize-none"
              />
              <button
                onClick={sendReply}
                disabled={sendingReply}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
              >
                {sendingReply ? "전송 중" : "전송"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <input
          value={convSearch}
          onChange={(e) => setConvSearch(e.target.value)}
          placeholder="이메일, 메시지 검색..."
          className="border rounded-lg px-3 py-2 text-sm min-w-[240px]"
        />
        {(["all", "open", "escalated", "handled", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setConvFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              convFilter === f
                ? "bg-[#2E7D32] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {({ all: "전체", open: "진행중", escalated: "에스컬", handled: "처리됨", resolved: "해결됨" } as const)[f]}
          </button>
        ))}
        <button
          onClick={loadConversations}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          새로고침
        </button>
      </div>

      <div className="space-y-1.5">
        {loading && <div className="text-gray-500 p-4 text-sm">로딩 중...</div>}
        {!loading && filteredConvs.length === 0 && (
          <div className="text-gray-500 text-center py-10 text-sm">대화 없음</div>
        )}
        {filteredConvs.map((c) => (
          <div
            key={c.id}
            onClick={() => openConversation(c)}
            className={`bg-white rounded-lg p-4 cursor-pointer hover:shadow-sm border ${
              c.escalated ? "border-red-300" : "border-gray-200"
            } flex items-center gap-4`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-gray-900">
                  {c.customer_email || c.visitor_id || "익명"}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusBadgeClass(c.status)}`}>
                  {STATUS_LABEL_KO[c.status] || c.status}
                </span>
                {c.escalated === 1 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700">
                    에스컬
                  </span>
                )}
                {c.language && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700">
                    {c.language.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {c.last_message || c.first_message || "—"}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-500">{c.msg_count}개</div>
              <div className="text-xs text-gray-400 mt-0.5">{formatTime(c.created_at)}</div>
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm disabled:opacity-50"
          >
            이전
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
