"use client";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Save, X } from "lucide-react";

type PageItem = {
  id: string;
  title: string;
  path: string;
  section: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "url"; value: string }[];
};

const PAGES: PageItem[] = [
  {
    id: "home",
    title: "홈 (메인 화면)",
    path: "/",
    section: "메인",
    fields: [
      { key: "about_title",   label: "교회 소개 제목", type: "text",     value: "일광교회를 소개합니다" },
      { key: "about_desc",    label: "교회 소개 내용", type: "textarea", value: "1971년 설립된 일광교회는 대한예수교장로회(합동) 소속입니다." },
      { key: "phone",         label: "전화번호",       type: "text",     value: "02-927-0691" },
      { key: "address",       label: "주소",           type: "text",     value: "서울 성북구 동소문로 212-68" },
    ],
  },
  {
    id: "about",
    title: "교회 소개",
    path: "/about",
    section: "소개",
    fields: [
      { key: "history_title",  label: "역사 제목",  type: "text",     value: "일광교회의 역사" },
      { key: "history_desc",   label: "역사 내용",  type: "textarea", value: "1971년 창립 이후 지역사회와 함께 성장해 왔습니다." },
      { key: "vision_title",   label: "비전 제목",  type: "text",     value: "우리의 비전" },
      { key: "vision_desc",    label: "비전 내용",  type: "textarea", value: "말씀과 기도, 전도와 선교로 하나님 나라를 확장합니다." },
    ],
  },
  {
    id: "worship",
    title: "예배 안내",
    path: "/worship",
    section: "예배",
    fields: [
      { key: "worship_1_name", label: "1부 예배 이름",  type: "text", value: "주일 1부 예배" },
      { key: "worship_1_time", label: "1부 예배 시간",  type: "text", value: "오전 9시 30분" },
      { key: "worship_2_name", label: "2부 예배 이름",  type: "text", value: "주일 2부 예배" },
      { key: "worship_2_time", label: "2부 예배 시간",  type: "text", value: "오전 11시 30분" },
      { key: "wed_name",       label: "수요 예배 이름", type: "text", value: "수요 예배" },
      { key: "wed_time",       label: "수요 예배 시간", type: "text", value: "오후 7시 30분" },
    ],
  },
  {
    id: "contact",
    title: "문의하기",
    path: "/contact",
    section: "문의",
    fields: [
      { key: "contact_title",  label: "페이지 제목",  type: "text",     value: "문의하기" },
      { key: "contact_desc",   label: "안내 문구",    type: "textarea", value: "궁금한 점이 있으시면 언제든지 연락해 주세요." },
      { key: "contact_email",  label: "문의 이메일",  type: "text",     value: "ilkwang@ilkwang.or.kr" },
    ],
  },
  {
    id: "offering",
    title: "온라인 헌금",
    path: "/offering",
    section: "헌금",
    fields: [
      { key: "offering_bank",    label: "은행명",     type: "text", value: "국민은행" },
      { key: "offering_account", label: "계좌번호",   type: "text", value: "000-000-000000" },
      { key: "offering_holder",  label: "예금주",     type: "text", value: "일광교회" },
    ],
  },
];

export default function PagesPage() {
  const [pages, setPages] = useState<PageItem[]>(PAGES);
  const [editPageId, setEditPageId] = useState<string | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  function startEdit(page: PageItem) {
    setEditPageId(page.id);
    const draft: Record<string, string> = {};
    page.fields.forEach(f => { draft[f.key] = f.value; });
    setDraftValues(draft);
  }

  function cancelEdit() {
    setEditPageId(null);
    setDraftValues({});
  }

  function saveEdit(pageId: string) {
    setPages(prev => prev.map(p => {
      if (p.id !== pageId) return p;
      return { ...p, fields: p.fields.map(f => ({ ...f, value: draftValues[f.key] ?? f.value })) };
    }));
    setEditPageId(null);
    setSavedId(pageId);
    setTimeout(() => setSavedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">페이지 관리</h1>
        <p className="text-gray-500 text-sm mt-0.5">각 페이지의 제목·내용·안내 정보를 수정합니다</p>
      </div>

      <div className="space-y-4">
        {pages.map((page) => {
          const isEditing = editPageId === page.id;
          return (
            <div key={page.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">{page.section}</span>
                  <h2 className="font-semibold text-gray-900 text-sm">{page.title}</h2>
                  <Link href={page.path} target="_blank" className="text-gray-300 hover:text-[#2E7D32] transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  {savedId === page.id && (
                    <span className="text-xs text-[#2E7D32] font-medium">✓ 저장됨</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={cancelEdit} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        <X className="w-3 h-3" /> 취소
                      </button>
                      <button onClick={() => saveEdit(page.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors">
                        <Save className="w-3 h-3" /> 저장
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(page)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                      <Pencil className="w-3 h-3" /> 수정
                    </button>
                  )}
                </div>
              </div>

              {/* 필드 목록 */}
              <div className="p-5">
                {isEditing ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {page.fields.map((f) => (
                      <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                        {f.type === "textarea" ? (
                          <textarea
                            value={draftValues[f.key] ?? f.value}
                            onChange={(e) => setDraftValues(p => ({ ...p, [f.key]: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none"
                          />
                        ) : (
                          <input
                            value={draftValues[f.key] ?? f.value}
                            onChange={(e) => setDraftValues(p => ({ ...p, [f.key]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {page.fields.map((f) => (
                      <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                        <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                        <p className={`text-sm text-gray-700 ${f.type === "textarea" ? "whitespace-pre-line line-clamp-2" : "truncate"}`}>
                          {f.value || <span className="text-gray-300 italic">내용 없음</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
