"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

type Department = {
  id: number;
  name: string;
  description: string;
  leaderName: string;
  meetingTime: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
};

const INITIAL: Department[] = [
  { id: 1, name: "1부 예배",    description: "주일 1부 예배 공동체 (오전 9시)",          leaderName: "담임목사", meetingTime: "주일 오전 9시",    imageUrl: "", isActive: true, sortOrder: 1 },
  { id: 2, name: "2부 예배",    description: "주일 2부 예배 공동체 (오전 11시)",         leaderName: "담임목사", meetingTime: "주일 오전 11시",   imageUrl: "", isActive: true, sortOrder: 2 },
  { id: 3, name: "청년부",      description: "20~30대 청년들의 공동체. 함께 성장합니다.", leaderName: "전도사",   meetingTime: "주일 오후 2시",    imageUrl: "", isActive: true, sortOrder: 3 },
  { id: 4, name: "중고등부",    description: "중학생·고등학생 공동체.",                   leaderName: "전도사",   meetingTime: "주일 오전 11시",   imageUrl: "", isActive: true, sortOrder: 4 },
  { id: 5, name: "주일학교",    description: "어린이 주일학교. 다음 세대를 세웁니다.",   leaderName: "교사",     meetingTime: "주일 오전 11시",   imageUrl: "", isActive: true, sortOrder: 5 },
  { id: 6, name: "선교부",      description: "국내외 선교 사역을 감당합니다.",           leaderName: "장로",     meetingTime: "매월 첫째 주 수요일", imageUrl: "", isActive: true, sortOrder: 6 },
  { id: 7, name: "찬양대",      description: "예배를 위한 찬양 사역팀.",                 leaderName: "지휘자",   meetingTime: "토요일 오후 6시",  imageUrl: "", isActive: true, sortOrder: 7 },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", leaderName: "", meetingTime: "", imageUrl: "" });

  function openNew() {
    setEditItem(null);
    setFormData({ name: "", description: "", leaderName: "", meetingTime: "", imageUrl: "" });
    setShowModal(true);
  }

  function openEdit(d: Department) {
    setEditItem(d);
    setFormData({ name: d.name, description: d.description, leaderName: d.leaderName, meetingTime: d.meetingTime, imageUrl: d.imageUrl });
    setShowModal(true);
  }

  function handleSave() {
    if (!formData.name.trim()) { alert("부서명을 입력해주세요."); return; }
    if (editItem) {
      setDepartments(prev => prev.map(d => d.id === editItem.id ? { ...d, ...formData } : d));
    } else {
      setDepartments(prev => [...prev, { id: Date.now(), ...formData, isActive: true, sortOrder: prev.length + 1 }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    if (!confirm("이 부서를 삭제하시겠습니까?")) return;
    setDepartments(prev => prev.filter(d => d.id !== id));
  }

  function toggleActive(id: number) {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">부서 소개 수정</h1>
          <p className="text-gray-500 text-sm mt-0.5">각 부서별 소개 내용 및 이미지 관리</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          <Plus className="w-4 h-4" /> 부서 추가
        </button>
      </div>

      {/* 부서 카드 목록 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-opacity ${d.isActive ? "border-gray-100" : "border-gray-100 opacity-50"}`}>
            {d.imageUrl ? (
              <div className="h-32 bg-gray-100 overflow-hidden">
                <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-24 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                <span className="text-3xl">🏢</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{d.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{d.meetingTime}</p>
                </div>
                <button onClick={() => toggleActive(d.id)} className="shrink-0">
                  {d.isActive
                    ? <ToggleRight className="w-5 h-5 text-[#2E7D32]" />
                    : <ToggleLeft className="w-5 h-5 text-gray-300" />
                  }
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{d.description}</p>
              {d.leaderName && (
                <p className="text-xs text-gray-400 mb-3">담당: {d.leaderName}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(d)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#2E7D32] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Pencil className="w-3 h-3" /> 수정
                </button>
                <button onClick={() => handleDelete(d.id)} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-red-500 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{editItem ? "부서 수정" : "새 부서 추가"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">부서명 *</label>
                  <input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">담당자</label>
                  <input value={formData.leaderName} onChange={(e) => setFormData(p => ({ ...p, leaderName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">모임 시간</label>
                <input value={formData.meetingTime} onChange={(e) => setFormData(p => ({ ...p, meetingTime: e.target.value }))}
                  placeholder="예: 주일 오전 11시"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">부서 소개</label>
                <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">대표 이미지 주소</label>
                <input value={formData.imageUrl} onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                  type="url" placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
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
