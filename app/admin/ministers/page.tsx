"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

type Minister = {
  id: number;
  name: string;
  title: string;
  department: string;
  imageUrl: string;
  bio: string;
  sortOrder: number;
  isActive: boolean;
};

const INITIAL: Minister[] = [
  { id: 1, name: "강성원",  title: "담임목사",  department: "교역자",   imageUrl: "", bio: "일광교회 담임목사입니다.", sortOrder: 1, isActive: true },
  { id: 2, name: "김○○",   title: "교육목사",  department: "교역자",   imageUrl: "", bio: "교육 사역을 담당합니다.",   sortOrder: 2, isActive: true },
  { id: 3, name: "이○○",   title: "전도사",    department: "청년부",   imageUrl: "", bio: "청년부를 담당합니다.",      sortOrder: 3, isActive: true },
  { id: 4, name: "박○○",   title: "장로",      department: "당회",     imageUrl: "", bio: "",                         sortOrder: 4, isActive: true },
  { id: 5, name: "최○○",   title: "집사",      department: "찬양대",   imageUrl: "", bio: "찬양 사역을 섬깁니다.",    sortOrder: 5, isActive: true },
];

export default function MinistersPage() {
  const [ministers, setMinisters] = useState<Minister[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Minister | null>(null);
  const [formData, setFormData] = useState({ name: "", title: "", department: "", imageUrl: "", bio: "" });

  function openNew() {
    setEditItem(null);
    setFormData({ name: "", title: "", department: "", imageUrl: "", bio: "" });
    setShowModal(true);
  }

  function openEdit(m: Minister) {
    setEditItem(m);
    setFormData({ name: m.name, title: m.title, department: m.department, imageUrl: m.imageUrl, bio: m.bio });
    setShowModal(true);
  }

  function handleSave() {
    if (!formData.name.trim() || !formData.title.trim()) {
      alert("이름과 직분을 입력해주세요."); return;
    }
    if (editItem) {
      setMinisters(prev => prev.map(m => m.id === editItem.id ? { ...m, ...formData } : m));
    } else {
      setMinisters(prev => [...prev, {
        id: Date.now(), ...formData,
        sortOrder: prev.length + 1, isActive: true,
      }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    setMinisters(prev => prev.filter(m => m.id !== id));
  }

  function toggleActive(id: number) {
    setMinisters(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  }

  const active = ministers.filter(m => m.isActive);
  const inactive = ministers.filter(m => !m.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">섬기는 사람들</h1>
          <p className="text-gray-500 text-sm mt-0.5">교역자·직분자·봉사자 소개 관리</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          <Plus className="w-4 h-4" /> 새 항목 추가
        </button>
      </div>

      {/* 활성 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">게시 중 ({active.length}명)</h2>
          <p className="text-xs text-gray-400">순서를 변경하려면 드래그하세요</p>
        </div>
        <div className="divide-y divide-gray-50">
          {active.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold text-sm shrink-0">
                {m.imageUrl ? <img src={m.imageUrl} className="w-full h-full rounded-full object-cover" alt={m.name} /> : m.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-medium">{m.title}</span>
                </div>
                <p className="text-xs text-gray-400">{m.department}{m.bio ? ` · ${m.bio.substring(0, 30)}...` : ""}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleActive(m.id)} className="px-2 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded transition-colors">숨김</button>
                <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-[#2E7D32] rounded hover:bg-gray-100 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {active.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">게시 중인 항목이 없습니다.</div>}
        </div>
      </div>

      {/* 숨김 목록 */}
      {inactive.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden opacity-60">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-700">숨김 처리 ({inactive.length}명)</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {inactive.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs shrink-0">{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">{m.name} · {m.title}</p>
                </div>
                <button onClick={() => toggleActive(m.id)} className="px-2 py-1 text-xs text-[#2E7D32] hover:bg-[#E8F5E9] rounded transition-colors">게시</button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{editItem ? "항목 수정" : "새 항목 추가"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">이름 *</label>
                  <input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">직분 *</label>
                  <input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="담임목사, 전도사, 집사..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">소속 부서</label>
                <input value={formData.department} onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))}
                  placeholder="예: 교역자, 청년부, 찬양대"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">프로필 사진 주소</label>
                <input value={formData.imageUrl} onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                  type="url" placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">소개글</label>
                <textarea value={formData.bio} onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                  rows={3} placeholder="간단한 소개를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors">
                {editItem ? "수정 완료" : "추가 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
