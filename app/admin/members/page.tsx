"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, UserCheck, UserX, ChevronDown, X, Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { ROLE_LABELS, ROLE_LABELS_SELECT, ROLE_COLORS } from "@/lib/adminAuth";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: number;
  dept: string;
  matched: boolean;
  joined: string;
  profileUrl?: string;
}

interface MemberForm {
  name: string;
  email: string;
  phone: string;
  role: number;
  dept: string;
  password: string;
  confirmPassword: string;
}

const EMPTY_FORM: MemberForm = {
  name: "", email: "", phone: "", role: 1, dept: "", password: "", confirmPassword: "",
};

function memberToForm(m: Member): MemberForm {
  return {
    name: m.name,
    email: m.email === "-" ? "" : m.email,
    phone: m.phone === "-" ? "" : m.phone,
    role: m.role,
    dept: m.dept === "-" ? "" : m.dept,
    password: "",
    confirmPassword: "",
  };
}

/* ── 비밀번호 표시/숨기기 ─────────────────────────────────── */
function PwToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} tabIndex={-1}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

/* ── 프로필 아바타 ───────────────────────────────────────── */
function Avatar({
  member, size = "sm", clickable, onClick,
}: {
  member: Member;
  size?: "sm" | "lg";
  clickable?: boolean;
  onClick?: () => void;
}) {
  const dim  = size === "lg" ? "w-20 h-20 text-2xl" : "w-9 h-9 text-xs";
  const ring = clickable
    ? "cursor-pointer hover:ring-2 hover:ring-[#2E7D32] hover:ring-offset-1 transition-all"
    : "";

  if (member.profileUrl) {
    return (
      <div className={`${dim} rounded-full overflow-hidden shrink-0 ${ring}`} onClick={onClick}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={member.profileUrl} alt={member.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${dim} bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold shrink-0 ${ring}`}
      onClick={onClick}
    >
      {member.name[0]}
    </div>
  );
}

/* ── 회원 폼 필드 (추가 / 편집 공용) ─────────────────────── */
function MemberFormFields({
  form, setForm, error, saving, isEdit, onSubmit, onClose,
}: {
  form: MemberForm;
  setForm: React.Dispatch<React.SetStateAction<MemberForm>>;
  error: string;
  saving: boolean;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이름 <span className="text-red-500">*</span>
        </label>
        <input type="text" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="홍길동"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이메일 <span className="text-gray-400 text-xs">(이메일 또는 휴대폰 중 하나 필수)</span>
        </label>
        <input type="email" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="example@email.com"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰</label>
        <input type="tel" value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          placeholder="010-0000-0000"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
          <select value={form.role}
            onChange={e => setForm(p => ({ ...p, role: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            {Object.entries(ROLE_LABELS_SELECT).map(([v, label]) => (
              <option key={v} value={v}>{v}단계 · {label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            부서 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <input type="text" value={form.dept}
            onChange={e => setForm(p => ({ ...p, dept: e.target.value }))}
            placeholder="예: 청년부"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          비밀번호{" "}
          <span className="text-gray-400 text-xs">
            {isEdit ? "(변경 시에만 입력, 빈 칸이면 유지)" : "(선택 · 8자 이상)"}
          </span>
        </label>
        <div className="relative">
          <input type={showPw ? "text" : "password"} value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder={isEdit ? "변경할 비밀번호" : "8자 이상 (로그인용)"}
            className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
          <PwToggle show={showPw} onToggle={() => setShowPw(v => !v)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
        <div className="relative">
          <input type={showConfirm ? "text" : "password"} value={form.confirmPassword}
            onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="비밀번호 재입력"
            className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
          <PwToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          취소
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors disabled:opacity-60">
          {saving ? "저장 중..." : isEdit ? "수정 완료" : "추가 완료"}
        </button>
      </div>
    </form>
  );
}

/* ── 메인 페이지 ─────────────────────────────────────────── */
export default function MembersPage() {
  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState(0);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [members, setMembers]           = useState<Member[]>([]);
  const [loading, setLoading]           = useState(true);

  /* 추가 모달 */
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm]           = useState<MemberForm>(EMPTY_FORM);
  const [addError, setAddError]         = useState("");
  const [addSaving, setAddSaving]       = useState(false);

  /* 편집 모달 */
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget]       = useState<Member | null>(null);
  const [editForm, setEditForm]           = useState<MemberForm>(EMPTY_FORM);
  const [editError, setEditError]         = useState("");
  const [editSaving, setEditSaving]       = useState(false);

  /* 프로필 이미지 업로드 */
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview]     = useState<string>("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) setMembers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const filtered = members.filter((m) => {
    const matchSearch = !search ||
      m.name.includes(search) || m.email.includes(search) || m.phone.includes(search);
    return matchSearch && (roleFilter === 0 || m.role === roleFilter);
  });

  /* 인라인 등급 변경 */
  async function handleRoleChange(id: number, newRole: number) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    setInlineEditId(null);
    await fetch(`/api/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
  }

  /* 회원 추가 */
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.name.trim()) { setAddError("이름을 입력해 주세요."); return; }
    if (!addForm.email.trim() && !addForm.phone.trim()) {
      setAddError("이메일 또는 휴대폰 번호 중 하나는 필수입니다."); return;
    }
    if (addForm.password && addForm.password.length < 8) {
      setAddError("비밀번호는 8자 이상이어야 합니다."); return;
    }
    if (addForm.password !== addForm.confirmPassword) {
      setAddError("비밀번호가 일치하지 않습니다."); return;
    }

    setAddSaving(true); setAddError("");
    try {
      const body: Record<string, unknown> = {
        name: addForm.name, email: addForm.email, phone: addForm.phone,
        role: addForm.role, dept: addForm.dept,
      };
      if (addForm.password) body.password = addForm.password;

      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { setAddError((await res.json()).error || "저장 중 오류가 발생했습니다."); return; }
      await fetchMembers();
      setAddForm(EMPTY_FORM);
      setShowAddModal(false);
    } catch {
      setAddError("저장 중 오류가 발생했습니다.");
    } finally {
      setAddSaving(false);
    }
  }

  /* 편집 열기 (프로필 이미지 클릭 또는 편집 버튼) */
  function openEdit(m: Member) {
    setEditTarget(m);
    setEditForm(memberToForm(m));
    setEditError("");
    setAvatarPreview("");
    setShowEditModal(true);
  }

  /* 편집 제출 */
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name.trim()) { setEditError("이름을 입력해 주세요."); return; }
    if (!editForm.email.trim() && !editForm.phone.trim()) {
      setEditError("이메일 또는 휴대폰 번호 중 하나는 필수입니다."); return;
    }
    if (editForm.password && editForm.password.length < 8) {
      setEditError("비밀번호는 8자 이상이어야 합니다."); return;
    }
    if (editForm.password !== editForm.confirmPassword) {
      setEditError("비밀번호가 일치하지 않습니다."); return;
    }

    setEditSaving(true); setEditError("");
    try {
      const body: Record<string, unknown> = {
        name: editForm.name,
        email: editForm.email || "-",
        phone: editForm.phone || "-",
        role: editForm.role,
        dept: editForm.dept || "-",
      };
      if (editForm.password) body.password = editForm.password;

      const res = await fetch(`/api/members/${editTarget!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { setEditError((await res.json()).error || "저장 중 오류가 발생했습니다."); return; }
      await fetchMembers();
      setShowEditModal(false);
    } catch {
      setEditError("저장 중 오류가 발생했습니다.");
    } finally {
      setEditSaving(false);
    }
  }

  /* 프로필 이미지 업로드 */
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editTarget) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch(`/api/members/${editTarget.id}/avatar`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.profileUrl) {
        setEditTarget(prev => prev ? { ...prev, profileUrl: data.profileUrl } : prev);
        setMembers(prev => prev.map(m =>
          m.id === editTarget.id ? { ...m, profileUrl: data.profileUrl } : m
        ));
      }
    } catch { /* 업로드 실패 시 미리보기만 유지 */ }
    finally { setAvatarUploading(false); }
  }

  /* 삭제 */
  async function handleDelete(id: number) {
    if (!confirm("이 회원을 삭제하시겠습니까?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    await fetchMembers();
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">총 {members.length}명 · 6단계 등급 관리</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddError(""); setAddForm(EMPTY_FORM); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          + 회원 추가
        </button>
      </div>

      {/* 검색 · 필터 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="이름·이메일·전화번호 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
          <option value={0}>전체 등급</option>
          {Object.entries(ROLE_LABELS_SELECT).map(([v, label]) => (
            <option key={v} value={v}>{v}단계 · {label}</option>
          ))}
        </select>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">불러오는 중...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">이름</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">연락처</th>
                  <th className="text-left px-5 py-3">등급</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">교적</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">부서</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">가입일</th>
                  <th className="text-left px-5 py-3">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {/* 프로필 이미지 클릭 → 편집 모달 */}
                        <Avatar member={m} size="sm" clickable onClick={() => openEdit(m)} />
                        <div>
                          <p className="font-medium text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-600">{m.phone}</td>
                    <td className="px-5 py-3">
                      {inlineEditId === m.id ? (
                        <select defaultValue={m.role}
                          onChange={e => handleRoleChange(m.id, Number(e.target.value))}
                          onBlur={() => setInlineEditId(null)} autoFocus
                          className="text-xs border border-gray-300 rounded px-1.5 py-1 focus:outline-none">
                          {Object.entries(ROLE_LABELS_SELECT).map(([v, label]) => (
                            <option key={v} value={v}>{v}. {label}</option>
                          ))}
                        </select>
                      ) : (
                        <button onClick={() => setInlineEditId(m.id)}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[m.role] || "bg-gray-100 text-gray-600"} hover:opacity-80`}
                          title="클릭하여 등급 변경">
                          {ROLE_LABELS[m.role]} <ChevronDown className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      {m.matched
                        ? <span className="flex items-center gap-1 text-emerald-600 text-xs"><UserCheck className="w-3 h-3" />완료</span>
                        : <span className="flex items-center gap-1 text-gray-400 text-xs"><UserX className="w-3 h-3" />미연결</span>}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-600">{m.dept}</td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-400">{m.joined}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(m)}
                          className="text-xs text-[#2E7D32] hover:underline">편집</button>
                        <button onClick={() => handleDelete(m.id)}
                          className="text-xs text-red-500 hover:underline">삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">검색 결과가 없습니다.</div>
            )}
          </div>
        )}
      </div>

      {/* 등급 안내 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">회원 등급 안내 (6단계)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(ROLE_LABELS_SELECT).map(([v, name]) => {
            const level = Number(v);
            const count = members.filter(m => m.role === level).length;
            return (
              <div key={v} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${ROLE_COLORS[level]}`}>{v}</span>
                <span className="text-xs font-medium text-gray-700">{name}</span>
                <span className="text-[11px] text-gray-400">{count}명</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 회원 추가 모달 ─────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">회원 추가</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MemberFormFields
              form={addForm} setForm={setAddForm}
              error={addError} saving={addSaving} isEdit={false}
              onSubmit={handleAddSubmit}
              onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* ── 편집 모달 — 프로필 이미지 클릭으로도 열림 ────────── */}
      {showEditModal && editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* 헤더: 프로필 이미지 + 이름 */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                {/* 프로필 이미지 — 클릭 시 파일 선택 */}
                <div className="relative">
                  <Avatar
                    member={{ ...editTarget, profileUrl: avatarPreview || editTarget.profileUrl }}
                    size="lg"
                    clickable
                    onClick={() => avatarInputRef.current?.click()}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-[#2E7D32] rounded-full flex items-center justify-center text-white hover:bg-[#1B5E20] transition-colors shadow"
                  >
                    {avatarUploading
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Camera className="w-3 h-3" />
                    }
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{editTarget.name}</h2>
                  <p className="text-xs text-gray-400">이미지 클릭하여 프로필 사진 변경</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MemberFormFields
              form={editForm} setForm={setEditForm}
              error={editError} saving={editSaving} isEdit={true}
              onSubmit={handleEditSubmit}
              onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
