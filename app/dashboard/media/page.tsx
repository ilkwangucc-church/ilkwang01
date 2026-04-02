"use client";
import { useState } from "react";
import { Video, Image as ImageIcon, ExternalLink, Pencil, Save, X } from "lucide-react";

type MediaItem = {
  id: string;
  label: string;
  type: "youtube" | "image";
  section: string;
  current: string;
};

const MEDIA_ITEMS: MediaItem[] = [
  { id: "latest_sermon_url",    label: "최신 설교 영상",       type: "youtube", section: "홈 화면",   current: "https://www.youtube.com/watch?v=example1" },
  { id: "worship_live_url",     label: "예배 실시간 중계",     type: "youtube", section: "예배",      current: "https://www.youtube.com/live/example2" },
  { id: "hero_bg_image",        label: "메인 배너 배경 이미지", type: "image",   section: "홈 화면",   current: "https://images.unsplash.com/photo-1538128439861" },
  { id: "about_hero_image",     label: "소개 페이지 이미지",   type: "image",   section: "소개",      current: "https://images.unsplash.com/photo-1516035069371" },
  { id: "worship_hero_image",   label: "예배 페이지 이미지",   type: "image",   section: "예배",      current: "https://images.unsplash.com/photo-1505576399279" },
  { id: "youth_hero_image",     label: "청년부 페이지 이미지", type: "image",   section: "청년부",    current: "https://images.unsplash.com/photo-1529156069898" },
  { id: "contact_hero_image",   label: "문의 페이지 이미지",   type: "image",   section: "문의",      current: "https://images.unsplash.com/photo-1606788075819" },
];

export default function MediaPage() {
  const [items, setItems] = useState(MEDIA_ITEMS);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [sectionFilter, setSectionFilter] = useState("전체");

  const sections = ["전체", ...Array.from(new Set(items.map(i => i.section)))];

  const filtered = sectionFilter === "전체" ? items : items.filter(i => i.section === sectionFilter);

  function startEdit(item: MediaItem) {
    setEditId(item.id);
    setEditValue(item.current);
  }

  function saveEdit(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, current: editValue } : i));
    setEditId(null);
  }

  function cancelEdit() {
    setEditId(null);
    setEditValue("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">미디어 관리</h1>
        <p className="text-gray-500 text-sm mt-0.5">사이트 내 동영상 주소 및 이미지 주소를 관리합니다</p>
      </div>

      {/* 섹션 필터 */}
      <div className="flex flex-wrap gap-2">
        {sections.map(s => (
          <button
            key={s}
            onClick={() => setSectionFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sectionFilter === s ? "bg-[#2E7D32] text-white border-[#2E7D32]" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 미디어 목록 */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.type === "youtube" ? "bg-red-100" : "bg-blue-100"
              }`}>
                {item.type === "youtube"
                  ? <Video className="w-5 h-5 text-red-600" />
                  : <ImageIcon className="w-5 h-5 text-blue-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{item.section}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    item.type === "youtube" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                  }`}>{item.type === "youtube" ? "YouTube" : "이미지"}</span>
                </div>

                {editId === item.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="url"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#2E7D32] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                      placeholder="새 주소를 입력하세요"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(item.id)} className="flex items-center gap-1 px-3 py-2 bg-[#2E7D32] text-white rounded-lg text-sm hover:bg-[#1B5E20] transition-colors">
                      <Save className="w-3.5 h-3.5" /> 저장
                    </button>
                    <button onClick={cancelEdit} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400 truncate flex-1">{item.current || "주소 없음"}</p>
                    <div className="flex gap-1 shrink-0">
                      {item.current && (
                        <a href={item.current} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#2E7D32] rounded hover:bg-gray-100 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => startEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-[#2E7D32] rounded hover:bg-gray-100 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <p className="font-semibold mb-1">📌 이미지 주소 안내</p>
        <p>이미지 주소는 Unsplash(unsplash.com), 교회 서버, 또는 Supabase Storage의 공개 URL을 사용할 수 있습니다. 변경 후 사이트를 새로고침하여 확인해주세요.</p>
      </div>
    </div>
  );
}
