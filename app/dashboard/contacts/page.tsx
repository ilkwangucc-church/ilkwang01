"use client";
import { useState } from "react";
import { Search, Mail, Phone, CheckCheck, Eye } from "lucide-react";

const CONTACTS = [
  { id: 1, name: "김○○", phone: "010-1234-5678", email: "kim@email.com", subject: "예배 시간 문의", message: "주일 예배 시간이 몇 시인가요? 오전 예배와 오후 예배 모두 알고 싶습니다.", isRead: false, createdAt: "2025-04-01 10:23" },
  { id: 2, name: "이○○", phone: "010-2345-6789", email: "lee@email.com", subject: "새 가족 등록 방법",  message: "교회에 처음 나가려고 하는데, 새 가족 등록은 어떻게 하나요?", isRead: false, createdAt: "2025-03-30 15:45" },
  { id: 3, name: "박○○", phone: "010-3456-7890", email: "park@email.com", subject: "청년부 모임 문의", message: "청년부는 몇 살까지 참여할 수 있나요? 30대도 가능한지 알고 싶습니다.", isRead: true, createdAt: "2025-03-28 09:12" },
  { id: 4, name: "최○○", phone: "-",              email: "choi@email.com", subject: "주차 안내 요청",  message: "주일날 주차 공간이 있나요? 처음 방문 예정인데 주차 방법을 알고 싶어요.", isRead: true, createdAt: "2025-03-25 14:30" },
  { id: 5, name: "정○○", phone: "010-5678-9012", email: "jeong@email.com", subject: "헌금 계좌 문의", message: "온라인 헌금을 하려고 하는데 계좌 정보를 알 수 있을까요?", isRead: true, createdAt: "2025-03-22 11:05" },
];

type Contact = typeof CONTACTS[0];

export default function ContactsPage() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Contact | null>(null);

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const filtered = contacts.filter((c) => {
    const matchSearch = !search || c.name.includes(search) || c.subject.includes(search) || c.message.includes(search);
    const matchRead =
      filterRead === "all" ? true :
      filterRead === "unread" ? !c.isRead :
      c.isRead;
    return matchSearch && matchRead;
  });

  function openContact(c: Contact) {
    if (!c.isRead) {
      setContacts(prev => prev.map(item => item.id === c.id ? { ...item, isRead: true } : item));
      setSelected({ ...c, isRead: true });
    } else {
      setSelected(c);
    }
  }

  function markAllRead() {
    setContacts(prev => prev.map(c => ({ ...c, isRead: true })));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">문의 접수함</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            홈페이지 문의 내역 · 전체 {contacts.length}건
            {unreadCount > 0 && <span className="ml-2 text-gray-700 font-semibold">미확인 {unreadCount}건</span>}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <CheckCheck className="w-4 h-4" /> 전체 읽음 처리
          </button>
        )}
      </div>

      {/* 검색 · 필터 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름·제목·내용 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterRead(f)}
              className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                filterRead === f ? "bg-[#2E7D32] text-white border-[#2E7D32]" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "전체" : f === "unread" ? "미확인" : "확인완료"}
            </button>
          ))}
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => openContact(c)}
              className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!c.isRead ? "bg-gray-50/60" : ""}`}
            >
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-medium ${!c.isRead ? "text-gray-900" : "text-gray-700"}`}>{c.subject}</p>
                  {!c.isRead && <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 truncate">{c.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-gray-400">{c.name}</span>
                  <span className="text-[11px] text-gray-300">·</span>
                  <span className="text-[11px] text-gray-400">{c.createdAt}</span>
                </div>
              </div>
              <Eye className={`w-4 h-4 shrink-0 mt-0.5 ${c.isRead ? "text-gray-300" : "text-gray-500"}`} />
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">문의 내역이 없습니다.</div>
        )}
      </div>

      {/* 문의 상세 모달 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900 truncate pr-4">{selected.subject}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium text-gray-700">이름:</span> {selected.name}
                </div>
                {selected.phone !== "-" && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {selected.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {selected.email}
                </div>
              </div>
              <div className="text-xs text-gray-400">{selected.createdAt}</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">답변 메모 (내부용)</label>
                <textarea rows={3} placeholder="처리 내용, 답변 여부 등을 기록하세요..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">닫기</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors">메모 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
