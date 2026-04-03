"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  MessageSquare,
  User,
  Image as ImageIcon,
  Settings,
  Lock,
  Unlock,
} from "lucide-react";

/* ── 타입 정의 ──────────────────────────────────────────────── */

interface FamilyMember {
  relation: string;
  name: string;
  birthDate: string;
  memberCategory: string;
  position: string;
  department: string;
  faithLevel: string;
  phone: string;
  photo: string;
  notes: string;
}

interface MemoEntry {
  content: string;
  author: string;
  createdAt: string;
}

interface PastoralVisit {
  visitDate: string;
  bibleHymn: string;
  visitContent: string;
  category: string;
  author: string;
}

interface ChurchMember {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  familyRelation: string;
  faithHead: string;
  photo: string;
  familyPhotos: string[];
  parish: string;
  spouse: string;
  phone: string;
  tel: string;
  address: string;
  memberType: string;
  currentStatus: string;
  registrationDate: string;
  introducer: string;
  marriageStatus: string;
  attendanceRate: string;
  serviceDept: string;
  workplace: string;
  detailPosition: string;
  ordinationDate: string;
  missionGroup: string;
  baptismType: string;
  baptismDate: string;
  baptismChurch: string;
  memos: MemoEntry[];
  groups: string[];
  familyMembers: FamilyMember[];
  pastoralVisits: PastoralVisit[];
  createdAt: string;
  updatedAt: string;
}

/* ── 상수 ───────────────────────────────────────────────────── */

const DEFAULT_CATEGORIES = ["정기심방", "이사심방", "새해심방", "병문안"];

/* ── 빈 객체 헬퍼 ───────────────────────────────────────────── */

function emptyMember(): Omit<ChurchMember, "id" | "createdAt" | "updatedAt"> {
  return {
    name: "",
    birthDate: "",
    gender: "남",
    familyRelation: "",
    faithHead: "",
    photo: "",
    familyPhotos: [],
    parish: "",
    spouse: "",
    phone: "",
    tel: "",
    address: "",
    memberType: "장년",
    currentStatus: "출석",
    registrationDate: "",
    introducer: "",
    marriageStatus: "미혼",
    attendanceRate: "A",
    serviceDept: "",
    workplace: "",
    detailPosition: "",
    ordinationDate: "",
    missionGroup: "",
    baptismType: "",
    baptismDate: "",
    baptismChurch: "",
    memos: [],
    groups: [],
    familyMembers: [],
    pastoralVisits: [],
  };
}

function emptyFamily(): FamilyMember {
  return {
    relation: "",
    name: "",
    birthDate: "",
    memberCategory: "",
    position: "",
    department: "",
    faithLevel: "",
    phone: "",
    photo: "",
    notes: "",
  };
}

function emptyVisit(): PastoralVisit {
  return { visitDate: "", bibleHymn: "", visitContent: "", category: "정기심방", author: "" };
}

/* ── 현재 사용자 이름 가져오기 ──────────────────────────────── */

function getCurrentAuthor(): string {
  try {
    const raw = sessionStorage.getItem("admin_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.displayName || "관리자";
    }
  } catch {
    // silent
  }
  return "관리자";
}

/* ── SMS 링크 컴포넌트 ──────────────────────────────────────── */

function SmsLink({ number }: { number: string }) {
  if (!number) return <span className="text-gray-400">-</span>;
  return (
    <a
      href={`sms:${number.replace(/-/g, "")}`}
      className="text-[#2E7D32] hover:underline inline-flex items-center gap-1"
    >
      <MessageSquare className="w-3 h-3" />
      {number}
    </a>
  );
}

/* ── 이미지 모달 컴포넌트 ──────────────────────────────────── */

function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={onClose}>
        <X className="w-8 h-8" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
    </div>
  );
}

/* ── 가족 상세 모달 컴포넌트 ────────────────────────────────── */

function FamilyDetailModal({
  member,
  onClose,
  onImageClick,
}: {
  member: FamilyMember;
  onClose: () => void;
  onImageClick: (src: string, alt: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-bold text-gray-900">가족 상세 정보</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-5">
          <div className="flex items-start gap-4 mb-5">
            {member.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                onClick={() => onImageClick(member.photo, member.name)}
              />
            ) : (
              <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-blue-300" />
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-gray-900">{member.name || "-"}</h4>
              {member.relation && (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-medium mt-1">
                  {member.relation}
                </span>
              )}
            </div>
          </div>

          <dl className="space-y-3">
            {[
              ["관계", member.relation],
              ["생년월일", member.birthDate],
              ["교인구분", member.memberCategory],
              ["직분", member.position],
              ["소속부서", member.department],
              ["신급", member.faithLevel],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center">
                <dt className="w-20 shrink-0 text-xs text-gray-500 font-medium">{label}</dt>
                <dd className="text-sm text-gray-900">{val || "-"}</dd>
              </div>
            ))}
            {member.phone && (
              <div className="flex items-center">
                <dt className="w-20 shrink-0 text-xs text-gray-500 font-medium">연락처</dt>
                <dd>
                  <SmsLink number={member.phone} />
                </dd>
              </div>
            )}
            {member.notes && (
              <div className="flex items-start">
                <dt className="w-20 shrink-0 text-xs text-gray-500 font-medium pt-0.5">비고</dt>
                <dd className="text-sm text-gray-700 whitespace-pre-wrap">{member.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ── 교적카드 레이블/값 셀 스타일 ──────────────────────────── */

const labelCellClass =
  "bg-gray-100 font-medium text-gray-700 px-3 py-2 whitespace-nowrap text-xs border border-gray-300";
const valueCellClass = "px-3 py-2 text-sm text-gray-900 border border-gray-300";

/* ── 필터 탭 ────────────────────────────────────────────────── */

const MEMBER_TYPE_FILTERS = [
  { label: "전체", value: "" },
  { label: "장년", value: "장년" },
  { label: "청년", value: "청년" },
  { label: "중고등", value: "중고등" },
  { label: "유초등", value: "유초등" },
];

// Suppress unused variable warnings for table cell styles used in potential future enhancements
void labelCellClass;
void valueCellClass;

/* ════════════════════════════════════════════════════════════ */
/*  메인 페이지 컴포넌트                                       */
/* ════════════════════════════════════════════════════════════ */

export default function ChurchMembersPage() {
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 모달
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ChurchMember | null>(null);
  const [form, setForm] = useState(emptyMember());
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);

  // 이미지 모달
  const [imageModal, setImageModal] = useState<{ src: string; alt: string } | null>(null);

  // 가족 상세 모달
  const [familyDetailModal, setFamilyDetailModal] = useState<FamilyMember | null>(null);

  // 심방 카테고리 접기/펼치기
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  // 가져오기 결과
  const [importResult, setImportResult] = useState<string | null>(null);

  // 파일 인풋 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 인라인 메모 추가
  const [newMemoText, setNewMemoText] = useState("");

  // 카테고리 관리
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showVisitCatModal, setShowVisitCatModal] = useState(false);
  const [visitCats, setVisitCats] = useState<string[]>([]);
  const [lockedVisitCats, setLockedVisitCats] = useState<string[]>([]);
  const [memberGroupCats, setMemberGroupCats] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState("");
  const [newGroupInput, setNewGroupInput] = useState("");

  // 심방내역 필터 (아코디언 내부)
  const [activeVisitCatFilter, setActiveVisitCatFilter] = useState<string>("");

  // 그룹 관리 — 회원 목록 보기
  const [selectedGroupView, setSelectedGroupView] = useState<string | null>(null);
  const [checkedPhones, setCheckedPhones] = useState<Set<string>>(new Set());

  // 그룹 설정 모달 탭 + 교인 추가 패널
  const [groupModalTab, setGroupModalTab] = useState<"builtin" | "custom">("builtin");
  const [showAddMemberPanel, setShowAddMemberPanel] = useState(false);
  const [groupAddSearch, setGroupAddSearch] = useState("");

  // 문자 보내기 모달
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsRecipients, setSmsRecipients] = useState<{ name: string; phone: string }[]>([]);
  const [smsMessage, setSmsMessage] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsResult, setSmsResult] = useState<{ success: boolean; sent: number; failed: number; error?: string } | null>(null);

  /* ── 모든 그룹 수집 (서버 카테고리 + 교인 데이터) ──────── */

  const allGroups = [...new Set([...memberGroupCats, ...members.flatMap(m => m.groups || [])])];

  /* ── 데이터 로드 ─────────────────────────────────────────── */

  async function fetchMembers() {
    try {
      const res = await fetch("/api/church-members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/church-categories");
      if (res.ok) {
        const data = await res.json();
        setVisitCats(data.visitCategories || []);
        setMemberGroupCats(data.memberGroups || []);
        setLockedVisitCats(data.lockedVisitCategories || []);
      }
    } catch { /* silent */ }
  }

  async function saveCategories(vc: string[], mg: string[], lvc?: string[]) {
    const locked = lvc !== undefined ? lvc : lockedVisitCats;
    try {
      await fetch("/api/church-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitCategories: vc, memberGroups: mg, lockedVisitCategories: locked }),
      });
      setVisitCats(vc);
      setMemberGroupCats(mg);
      setLockedVisitCats(locked);
    } catch { alert("카테고리 저장 실패"); }
  }

  async function saveLockedVisitCats(lvc: string[]) {
    try {
      await fetch("/api/church-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitCategories: visitCats, memberGroups: memberGroupCats, lockedVisitCategories: lvc }),
      });
      setLockedVisitCats(lvc);
    } catch { alert("저장 실패"); }
  }

  async function updateMemberType(memberId: string, newType: string) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    try {
      const res = await fetch(`/api/church-members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...member, memberType: newType }),
      });
      if (!res.ok) throw new Error();
      await fetchMembers();
    } catch { alert("저장 실패"); }
  }

  async function addMemberToCustomGroup(memberId: string, groupName: string) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    if ((member.groups || []).includes(groupName)) return;
    const updated = [...(member.groups || []), groupName];
    try {
      const res = await fetch(`/api/church-members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...member, groups: updated }),
      });
      if (!res.ok) throw new Error();
      await fetchMembers();
    } catch { alert("저장 실패"); }
  }

  async function removeMemberFromCustomGroup(memberId: string, groupName: string) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    const updated = (member.groups || []).filter(g => g !== groupName);
    try {
      const res = await fetch(`/api/church-members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...member, groups: updated }),
      });
      if (!res.ok) throw new Error();
      await fetchMembers();
    } catch { alert("저장 실패"); }
  }

  useEffect(() => {
    fetchMembers();
    fetchCategories();
  }, []);

  /* ── 검색/필터 ───────────────────────────────────────────── */

  const filtered = members.filter((m) => {
    if (filterType && m.memberType !== filterType) return false;
    if (filterGroup && !(m.groups || []).includes(filterGroup)) return false;
    if (
      search &&
      ![m.name, m.phone, m.parish, m.serviceDept].some((v) =>
        v?.toLowerCase().includes(search.toLowerCase()),
      )
    )
      return false;
    return true;
  });

  /* ── 모달 열기/닫기 ──────────────────────────────────────── */

  function openNew() {
    setEditingMember(null);
    setForm(emptyMember());
    setActiveTab(0);
    setShowModal(true);
  }

  function openEdit(m: ChurchMember) {
    setEditingMember(m);
    setForm({
      name: m.name,
      birthDate: m.birthDate,
      gender: m.gender,
      familyRelation: m.familyRelation,
      faithHead: m.faithHead,
      photo: m.photo,
      familyPhotos: m.familyPhotos?.length ? [...m.familyPhotos] : [],
      parish: m.parish,
      spouse: m.spouse,
      phone: m.phone,
      tel: m.tel,
      address: m.address,
      memberType: m.memberType,
      currentStatus: m.currentStatus,
      registrationDate: m.registrationDate,
      introducer: m.introducer,
      marriageStatus: m.marriageStatus,
      attendanceRate: m.attendanceRate,
      serviceDept: m.serviceDept,
      workplace: m.workplace,
      detailPosition: m.detailPosition,
      ordinationDate: m.ordinationDate,
      missionGroup: m.missionGroup,
      baptismType: m.baptismType,
      baptismDate: m.baptismDate,
      baptismChurch: m.baptismChurch,
      memos: m.memos?.length ? m.memos.map(memo => ({ ...memo })) : [],
      groups: m.groups?.length ? [...m.groups] : [],
      familyMembers: m.familyMembers?.length
        ? m.familyMembers.map((f) => ({ ...f }))
        : [],
      pastoralVisits: m.pastoralVisits?.length
        ? m.pastoralVisits.map((v) => ({ ...v }))
        : [],
    });
    setActiveTab(0);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingMember(null);
  }

  /* ── CRUD ────────────────────────────────────────────────── */

  async function handleSave() {
    if (!form.name.trim()) {
      alert("이름은 필수입니다.");
      return;
    }
    setSaving(true);
    try {
      if (editingMember) {
        const res = await fetch(`/api/church-members/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("수정 실패");
      } else {
        const res = await fetch("/api/church-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("등록 실패");
      }
      closeModal();
      await fetchMembers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장 중 오류 발생");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 교인을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/church-members/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch {
      alert("삭제 중 오류 발생");
    }
  }

  /* ── 인라인 메모 추가 ─────────────────────────────────────── */

  async function handleAddMemo(memberId: string) {
    if (!newMemoText.trim()) return;
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newMemo: MemoEntry = {
      content: newMemoText.trim(),
      author: getCurrentAuthor(),
      createdAt: new Date().toISOString(),
    };

    const updatedMemos = [...(member.memos || []), newMemo];

    try {
      const res = await fetch(`/api/church-members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...member, memos: updatedMemos }),
      });
      if (res.ok) {
        setNewMemoText("");
        await fetchMembers();
      }
    } catch {
      alert("메모 저장 중 오류 발생");
    }
  }

  /* ── 엑셀 가져오기 ───────────────────────────────────────── */

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/church-members/import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setImportResult(
          `가져오기 완료: ${data.imported}명 신규, ${data.updated}명 업데이트` +
            (data.errors?.length
              ? `\n오류: ${data.errors.join(", ")}`
              : ""),
        );
        await fetchMembers();
      } else {
        setImportResult(`오류: ${data.error}`);
      }
    } catch {
      setImportResult("파일 업로드 중 오류가 발생했습니다.");
    }
    // 파일 인풋 초기화
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ── 폼 업데이트 헬퍼 ────────────────────────────────────── */

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateFamilyPhoto(idx: number, value: string) {
    setForm((prev) => {
      const arr = [...(prev.familyPhotos || [])];
      while (arr.length <= idx) arr.push("");
      arr[idx] = value;
      return { ...prev, familyPhotos: arr };
    });
  }

  function updateFamilyMember(
    idx: number,
    field: keyof FamilyMember,
    value: string,
  ) {
    setForm((prev) => {
      const arr = [...prev.familyMembers];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, familyMembers: arr };
    });
  }

  function addFamilyMember() {
    setForm((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, emptyFamily()],
    }));
  }

  function removeFamilyMember(idx: number) {
    setForm((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== idx),
    }));
  }

  function updateVisit(idx: number, field: keyof PastoralVisit, value: string) {
    setForm((prev) => {
      const arr = [...prev.pastoralVisits];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, pastoralVisits: arr };
    });
  }

  function addVisit() {
    const author = getCurrentAuthor();
    setForm((prev) => ({
      ...prev,
      pastoralVisits: [...prev.pastoralVisits, { ...emptyVisit(), author }],
    }));
  }

  function removeVisit(idx: number) {
    setForm((prev) => ({
      ...prev,
      pastoralVisits: prev.pastoralVisits.filter((_, i) => i !== idx),
    }));
  }

  /* ── 심방 카테고리 토글 ──────────────────────────────────── */

  function toggleCategory(cat: string) {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }
  void toggleCategory;

  /* ── 심방을 카테고리별로 그룹핑 ──────────────────────────── */

  function groupVisitsByCategory(visits: PastoralVisit[]) {
    const groups: Record<string, PastoralVisit[]> = {};
    for (const v of visits) {
      const cat = v.category || "기타";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(v);
    }
    return groups;
  }

  /* ── 입력 필드 컴포넌트 ──────────────────────────────────── */

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30";

  function FormField({
    label,
    field,
    type = "text",
    placeholder,
  }: {
    label: string;
    field: string;
    type?: string;
    placeholder?: string;
  }) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type={type}
          value={(form as Record<string, unknown>)[field] as string}
          onChange={(e) => updateField(field, e.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
      </div>
    );
  }

  function FormSelect({
    label,
    field,
    options,
  }: {
    label: string;
    field: string;
    options: string[];
  }) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          value={(form as Record<string, unknown>)[field] as string}
          onChange={(e) => updateField(field, e.target.value)}
          className={inputClass}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════ */
  /*  렌더링                                                   */
  /* ══════════════════════════════════════════════════════════ */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
        데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── 헤더 ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">교인 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            교적 명부 · 총 {members.length}명 등록
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              (window.location.href = "/api/church-members/template")
            }
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            양식 다운로드
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            엑셀 가져오기
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() =>
              (window.location.href = "/api/church-members/export")
            }
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            엑셀 내보내기
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            교인 등록
          </button>
        </div>
      </div>

      {/* ── 가져오기 결과 알림 ─────────────────────────────── */}
      {importResult && (
        <div className="flex items-center justify-between bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] px-4 py-3 rounded-xl text-sm">
          <span className="whitespace-pre-wrap">{importResult}</span>
          <button
            onClick={() => setImportResult(null)}
            className="ml-3 text-[#2E7D32] hover:text-[#1B5E20]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 검색 + 필터 ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름·전화번호·교구·부서 검색..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => { setShowGroupModal(true); setGroupModalTab("builtin"); setSelectedGroupView(null); setShowAddMemberPanel(false); setGroupAddSearch(""); }}
            className="p-1.5 rounded-full border border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors"
            title="그룹 설정"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          {MEMBER_TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors font-medium ${
                filterType === f.value
                  ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
          {allGroups.map(g => (
            <button
              key={g}
              onClick={() => setFilterGroup(filterGroup === g ? "" : g)}
              className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors font-medium ${
                filterGroup === g
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── 교인 테이블 ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="w-8 px-3 py-3"></th>
                <th className="text-left px-4 py-3">이름</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  연락처
                </th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  교구
                </th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  상세직분
                </th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  출석률
                </th>
                <th className="text-left px-4 py-3">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m) => (
                <>
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === m.id ? null : m.id)
                    }
                  >
                    <td className="px-3 py-3 text-gray-400">
                      {expandedId === m.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0">
                          {m.name?.[0] || <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-400">
                            {m.birthDate || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {m.phone ? (
                        <span
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SmsLink number={m.phone} />
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                      {m.parish || "-"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                      {m.detailPosition || "-"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          m.attendanceRate === "A"
                            ? "bg-green-100 text-green-700"
                            : m.attendanceRate === "B"
                              ? "bg-yellow-100 text-yellow-700"
                              : m.attendanceRate === "C"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.attendanceRate || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(m);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#2E7D32] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(m.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* ── 교적카드 아코디언 (카드형 레이아웃) ── */}
                  {expandedId === m.id && (
                    <tr key={`${m.id}-card`}>
                      <td colSpan={7} className="px-2 sm:px-4 py-3 bg-gray-50/70">
                        <div className="space-y-3">

                          {/* ── 프로필 헤더 ── */}
                          <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-start gap-3">

                              {/* 프로필 사진 */}
                              {m.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={m.photo}
                                  alt={m.name}
                                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 ring-2 ring-[#E8F5E9] cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setImageModal({ src: m.photo, alt: m.name })}
                                />
                              ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#E8F5E9] rounded-xl flex items-center justify-center shrink-0 ring-2 ring-[#E8F5E9]">
                                  <span className="text-[#2E7D32] font-bold text-lg">{m.name?.[0]}</span>
                                </div>
                              )}

                              {/* 우측 전체 영역 */}
                              <div className="flex-1 min-w-0">

                                {/* 이름·배지 행 + 수정일 */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h3 className="text-base font-bold text-gray-900 leading-tight">{m.name}</h3>
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-medium">{m.memberType || "장년"}</span>
                                      {m.detailPosition && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{m.detailPosition}</span>
                                      )}
                                      {m.currentStatus && m.currentStatus !== "출석" && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">{m.currentStatus}</span>
                                      )}
                                    </div>

                                    {/* 그룹 태그 */}
                                    {m.groups && m.groups.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                                        {m.groups.map(g => (
                                          <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                                            {g}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* 기본 인적사항 — 2열 그리드 */}
                                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
                                      <div className="flex items-baseline gap-1 text-xs">
                                        <span className="text-gray-400 shrink-0">성별·생년</span>
                                        <span className="text-gray-700 truncate">{m.gender} · {m.birthDate || "-"}</span>
                                      </div>
                                      <div className="flex items-baseline gap-1 text-xs">
                                        <span className="text-gray-400 shrink-0">혼인</span>
                                        <span className="text-gray-700">{m.marriageStatus || "-"}</span>
                                      </div>
                                      {m.parish && (
                                        <div className="flex items-baseline gap-1 text-xs">
                                          <span className="text-gray-400 shrink-0">교구</span>
                                          <span className="text-gray-700 truncate">{m.parish}</span>
                                        </div>
                                      )}
                                      {m.serviceDept && (
                                        <div className="flex items-baseline gap-1 text-xs">
                                          <span className="text-gray-400 shrink-0">봉사</span>
                                          <span className="text-gray-700 truncate">{m.serviceDept}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* 연락처 */}
                                    <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                                      {m.phone && (
                                        <span onClick={e => e.stopPropagation()}>
                                          <SmsLink number={m.phone} />
                                        </span>
                                      )}
                                      {m.tel && <span className="text-xs text-gray-500">TEL {m.tel}</span>}
                                    </div>
                                  </div>

                                  {/* 수정일 */}
                                  <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                                    {m.updatedAt ? new Date(m.updatedAt).toLocaleDateString("ko-KR") : ""}
                                  </span>
                                </div>

                                {/* 가족 사진 — 이름 아래 별도 행 */}
                                {m.familyPhotos && m.familyPhotos.filter(Boolean).length > 0 && (
                                  <div className="flex gap-2 mt-3 flex-wrap">
                                    {m.familyPhotos.map((fp, fpi) =>
                                      fp ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          key={fpi}
                                          src={fp}
                                          alt={`${m.name} 가족사진 ${fpi + 1}`}
                                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                          onClick={() => setImageModal({ src: fp, alt: `${m.name} 가족사진 ${fpi + 1}` })}
                                        />
                                      ) : null
                                    )}
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>

                          {/* ── 정보 그리드 (모바일 2열, 데스크탑 3열) ── */}
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">

                            {/* 기본 정보 */}
                            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                              <h4 className="text-[11px] sm:text-xs font-bold text-[#2E7D32] mb-2.5 flex items-center gap-1">
                                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 기본 정보
                              </h4>
                              <dl className="space-y-1.5">
                                {[
                                  ["가족관계", m.familyRelation],
                                  ["신앙세대주", m.faithHead],
                                  ["배우자", m.spouse],
                                  ["주소", m.address],
                                ].map(([label, val]) => (
                                  <div key={label} className="flex gap-1">
                                    <dt className="w-14 sm:w-16 shrink-0 text-[10px] sm:text-xs text-gray-400">{label}</dt>
                                    <dd className="text-gray-800 text-[10px] sm:text-xs break-all leading-relaxed">{val || "-"}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>

                            {/* 교인 정보 */}
                            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                              <h4 className="text-[11px] sm:text-xs font-bold text-[#2E7D32] mb-2.5">교인 정보</h4>
                              <dl className="space-y-1.5">
                                {[
                                  ["등록일", m.registrationDate],
                                  ["인도자", m.introducer],
                                  ["출석률", m.attendanceRate],
                                  ["봉사부서", m.serviceDept],
                                  ["직장명", m.workplace],
                                ].map(([label, val]) => (
                                  <div key={label} className="flex gap-1">
                                    <dt className="w-14 sm:w-16 shrink-0 text-[10px] sm:text-xs text-gray-400">{label}</dt>
                                    <dd className="text-gray-800 text-[10px] sm:text-xs break-all leading-relaxed">{val || "-"}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>

                            {/* 직분 · 세례 */}
                            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 col-span-2 lg:col-span-1">
                              <h4 className="text-[11px] sm:text-xs font-bold text-[#2E7D32] mb-2.5">직분 · 세례</h4>
                              <dl className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-1.5">
                                {[
                                  ["상세직분", m.detailPosition],
                                  ["임직일", m.ordinationDate],
                                  ["선교회", m.missionGroup],
                                  ["세례유형", m.baptismType],
                                  ["집례일", m.baptismDate],
                                  ["집례교회", m.baptismChurch],
                                ].map(([label, val]) => (
                                  <div key={label} className="flex gap-1">
                                    <dt className="w-14 sm:w-16 shrink-0 text-[10px] sm:text-xs text-gray-400">{label}</dt>
                                    <dd className="text-gray-800 text-[10px] sm:text-xs break-all leading-relaxed">{val || "-"}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          </div>

                          {/* ── 메모 ── */}
                          <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h4 className="text-xs font-bold text-gray-500 mb-2">메모</h4>
                            {m.memos && m.memos.length > 0 ? (
                              <div className="space-y-2">
                                {m.memos.map((memo, mi) => (
                                  <div key={mi} className="bg-gray-50 rounded-lg px-3 py-2">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] text-gray-400">{memo.author}</span>
                                      <span className="text-[10px] text-gray-300">·</span>
                                      <span className="text-[10px] text-gray-400">
                                        {memo.createdAt ? new Date(memo.createdAt).toLocaleDateString("ko-KR") : ""}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">등록된 메모가 없습니다.</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <input
                                placeholder="메모 입력..."
                                value={expandedId === m.id ? newMemoText : ""}
                                onChange={(e) => setNewMemoText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddMemo(m.id);
                                  }
                                }}
                                className={inputClass + " flex-1"}
                              />
                              <button
                                onClick={() => handleAddMemo(m.id)}
                                className="px-3 py-2 bg-[#2E7D32] text-white rounded-xl text-sm shrink-0"
                              >
                                추가
                              </button>
                            </div>
                          </div>

                          {/* ── 가족사항 (카드 레이아웃) ── */}
                          {m.familyMembers && m.familyMembers.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <div className="px-4 py-2.5 border-b border-gray-100">
                                <h4 className="text-xs font-bold text-[#2E7D32]">
                                  가족사항
                                  <span className="ml-2 text-gray-400 font-normal">{m.familyMembers.length}명</span>
                                </h4>
                              </div>
                              <div className="p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {m.familyMembers.map((f, fi) => (
                                    <div
                                      key={fi}
                                      className="bg-white rounded-xl border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all"
                                      onClick={() => setFamilyDetailModal(f)}
                                    >
                                      <div className="flex items-center gap-3">
                                        {/* 가족 사진 */}
                                        {f.photo ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img
                                            src={f.photo}
                                            alt={f.name}
                                            className="w-12 h-12 rounded-lg object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setImageModal({ src: f.photo, alt: f.name });
                                            }}
                                          />
                                        ) : (
                                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                            <span className="text-blue-600 font-bold text-sm">{f.name?.[0] || "?"}</span>
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-gray-900">{f.name || "-"}</span>
                                            {f.relation && (
                                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-medium">{f.relation}</span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 flex-wrap">
                                            {f.position && <span>{f.position}</span>}
                                            {f.department && <span>· {f.department}</span>}
                                          </div>
                                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                                            {f.birthDate && <span>{f.birthDate}</span>}
                                            {f.memberCategory && <span>· {f.memberCategory}</span>}
                                            {f.faithLevel && <span>· {f.faithLevel}</span>}
                                          </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── 심방내역 (필터 + 목록) ── */}
                          {m.pastoralVisits && m.pastoralVisits.length > 0 && (() => {
                            const allCatsInMember = [...new Set(m.pastoralVisits.map(v => v.category || "기타"))];
                            const displayVisits = activeVisitCatFilter
                              ? m.pastoralVisits.filter(v => (v.category || "기타") === activeVisitCatFilter)
                              : m.pastoralVisits;
                            return (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              {/* 헤더: 제목 + 설정 아이콘 + 필터 버튼 */}
                              <div className="px-4 py-2.5 border-b border-gray-100">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs font-bold text-[#2E7D32] shrink-0">
                                    심방내역
                                    <span className="ml-1.5 text-gray-400 font-normal">{m.pastoralVisits.length}건</span>
                                  </h4>
                                  <button
                                    onClick={e => { e.stopPropagation(); setShowVisitCatModal(true); }}
                                    className="p-1 rounded-full border border-[#2E7D32]/30 text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors shrink-0"
                                    title="심방 분류 설정"
                                  >
                                    <Settings className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); setActiveVisitCatFilter(""); }}
                                    className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors font-medium shrink-0 ${
                                      activeVisitCatFilter === ""
                                        ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                  >
                                    전체
                                  </button>
                                  {allCatsInMember.map(cat => (
                                    <button
                                      key={cat}
                                      onClick={e => { e.stopPropagation(); setActiveVisitCatFilter(activeVisitCatFilter === cat ? "" : cat); }}
                                      className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors font-medium shrink-0 ${
                                        activeVisitCatFilter === cat
                                          ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                      }`}
                                    >
                                      {cat}
                                      <span className="ml-1 opacity-60">
                                        ({m.pastoralVisits.filter(v => (v.category || "기타") === cat).length})
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {/* 심방 목록 */}
                              <div className="divide-y divide-gray-100">
                                {displayVisits.length === 0 ? (
                                  <p className="text-xs text-gray-400 text-center py-4">해당 분류의 심방 기록이 없습니다.</p>
                                ) : displayVisits.map((v, vi) => (
                                  <div key={vi} className="px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] font-medium shrink-0">
                                        {v.category || "기타"}
                                      </span>
                                      <span className="text-xs font-medium text-gray-900">{v.visitDate || "-"}</span>
                                      {v.author && <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">{v.author}</span>}
                                      {v.bibleHymn && <span className="text-xs text-gray-400">{v.bibleHymn}</span>}
                                    </div>
                                    {v.visitContent && <p className="text-xs text-gray-600 leading-relaxed pl-1">{v.visitContent}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            );
                          })()}

                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search || filterType || filterGroup
              ? "검색 결과가 없습니다."
              : "등록된 교인이 없습니다."}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  등록/편집 모달                                        */}
      {/* ══════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-gray-900">
                {editingMember ? "교인 정보 수정" : "새 교인 등록"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* 탭 헤더 */}
            <div className="flex border-b shrink-0">
              {["기본정보", "교인정보", "가족사항", "심방내역", "메모"].map(
                (tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === i
                        ? "text-[#2E7D32] border-b-2 border-[#2E7D32]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            {/* 탭 내용 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 탭 0: 기본정보 */}
              {activeTab === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="이름 *" field="name" />
                  <FormField label="생년월일" field="birthDate" />
                  <FormSelect
                    label="성별"
                    field="gender"
                    options={["남", "여"]}
                  />
                  <FormField label="가족관계" field="familyRelation" />
                  <FormField label="신앙세대주" field="faithHead" />
                  <FormField label="교구" field="parish" />
                  <FormField label="배우자" field="spouse" />
                  <FormField label="HP (휴대폰)" field="phone" />
                  <FormField label="TEL (전화)" field="tel" />
                  <div className="col-span-2">
                    <FormField label="주소" field="address" />
                  </div>

                  {/* 사진 URL 입력 */}
                  <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <h4 className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> 사진 관리
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <FormField label="프로필 사진 URL" field="photo" placeholder="https://example.com/photo.jpg" />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            가족 사진 1 URL
                          </label>
                          <input
                            type="text"
                            value={form.familyPhotos?.[0] || ""}
                            onChange={(e) => updateFamilyPhoto(0, e.target.value)}
                            className={inputClass}
                            placeholder="https://example.com/family1.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            가족 사진 2 URL
                          </label>
                          <input
                            type="text"
                            value={form.familyPhotos?.[1] || ""}
                            onChange={(e) => updateFamilyPhoto(1, e.target.value)}
                            className={inputClass}
                            placeholder="https://example.com/family2.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 탭 1: 교인정보 */}
              {activeTab === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    label="교인구분"
                    field="memberType"
                    options={["장년", "청년", "중고등", "유초등", "유아", "기타"]}
                  />
                  <FormSelect
                    label="현재상태"
                    field="currentStatus"
                    options={["출석", "결석", "군입대", "이명", "탈퇴", "별세"]}
                  />
                  <FormField label="등록일" field="registrationDate" />
                  <FormField label="인도자" field="introducer" />
                  <FormSelect
                    label="결혼관계"
                    field="marriageStatus"
                    options={["미혼", "기혼", "이혼", "사별"]}
                  />
                  <FormSelect
                    label="출석률"
                    field="attendanceRate"
                    options={["A", "B", "C", "D"]}
                  />
                  <FormField label="봉사부서" field="serviceDept" />
                  <FormField label="직장명" field="workplace" />
                  <FormField label="상세직분" field="detailPosition" />
                  <FormField label="임직일" field="ordinationDate" />
                  <FormField label="선교회" field="missionGroup" />
                  <FormSelect
                    label="세례유형"
                    field="baptismType"
                    options={["", "유아세례", "세례", "입교", "학습"]}
                  />
                  <FormField label="집례일" field="baptismDate" />
                  <FormField label="집례교회" field="baptismChurch" />
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      그룹 태그 (쉼표로 구분)
                    </label>
                    <input
                      list="group-datalist"
                      value={form.groups?.join(", ") || ""}
                      onChange={(e) => {
                        const tags = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        setForm(prev => ({ ...prev, groups: tags }));
                      }}
                      className={inputClass}
                      placeholder="예: 기획위원회, 찬양팀, ..."
                    />
                    <datalist id="group-datalist">
                      {[...new Set([...memberGroupCats, ...allGroups])].map(g => <option key={g} value={g} />)}
                    </datalist>
                  </div>
                </div>
              )}

              {/* 탭 2: 가족사항 */}
              {activeTab === 2 && (
                <div className="space-y-4">
                  {form.familyMembers.map((fam, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-xl p-4 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-600">
                          가족 #{i + 1}
                        </span>
                        <button
                          onClick={() => removeFamilyMember(i)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> 삭제
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            관계
                          </label>
                          <input
                            value={fam.relation}
                            onChange={(e) =>
                              updateFamilyMember(i, "relation", e.target.value)
                            }
                            className={inputClass}
                            placeholder="예: 배우자, 자녀"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            이름
                          </label>
                          <input
                            value={fam.name}
                            onChange={(e) =>
                              updateFamilyMember(i, "name", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            생년월일
                          </label>
                          <input
                            value={fam.birthDate}
                            onChange={(e) =>
                              updateFamilyMember(i, "birthDate", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            교인구분
                          </label>
                          <input
                            value={fam.memberCategory}
                            onChange={(e) =>
                              updateFamilyMember(
                                i,
                                "memberCategory",
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            직분
                          </label>
                          <input
                            value={fam.position}
                            onChange={(e) =>
                              updateFamilyMember(i, "position", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            소속부서
                          </label>
                          <input
                            value={fam.department}
                            onChange={(e) =>
                              updateFamilyMember(
                                i,
                                "department",
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            신급
                          </label>
                          <input
                            value={fam.faithLevel}
                            onChange={(e) =>
                              updateFamilyMember(
                                i,
                                "faithLevel",
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            휴대폰
                          </label>
                          <input
                            value={fam.phone}
                            onChange={(e) =>
                              updateFamilyMember(i, "phone", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            비고
                          </label>
                          <input
                            value={fam.notes}
                            onChange={(e) =>
                              updateFamilyMember(i, "notes", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                      {/* 가족 사진 URL */}
                      <div className="border-t border-gray-100 pt-3 mt-2">
                        <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> 사진 URL
                        </label>
                        <input
                          value={fam.photo}
                          onChange={(e) =>
                            updateFamilyMember(i, "photo", e.target.value)
                          }
                          className={inputClass}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addFamilyMember}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm border border-dashed border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors w-full justify-center"
                  >
                    <Plus className="w-4 h-4" /> 가족 추가
                  </button>
                </div>
              )}

              {/* 탭 3: 심방내역 */}
              {activeTab === 3 && (
                <div className="space-y-4">
                  {/* 심방 카테고리 탭 바 */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={() => setShowVisitCatModal(true)}
                      className="p-1.5 rounded-full border border-[#2E7D32]/40 text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                      title="심방 카테고리 설정"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    {visitCats.map(cat => {
                      const count = form.pastoralVisits.filter(v => v.category === cat).length;
                      return (
                        <span key={cat} className="px-3 py-1 text-xs rounded-full bg-[#E8F5E9] text-[#2E7D32] font-medium">
                          {cat} {count > 0 && <span className="text-[10px] text-[#2E7D32]/60">({count})</span>}
                        </span>
                      );
                    })}
                  </div>
                  {form.pastoralVisits.map((visit, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-600">
                          심방 #{i + 1}
                        </span>
                        <button
                          onClick={() => removeVisit(i)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> 삭제
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            카테고리 (직접 입력 가능)
                          </label>
                          <input
                            list={`visit-cat-${i}`}
                            value={visit.category || ""}
                            onChange={(e) =>
                              updateVisit(i, "category", e.target.value)
                            }
                            className={inputClass}
                            placeholder="예: 정기심방, 병문안..."
                          />
                          <datalist id={`visit-cat-${i}`}>
                            {[...new Set([
                              ...visitCats,
                              ...members.flatMap((mm) =>
                                (mm.pastoralVisits || []).map((v) => v.category).filter(Boolean)
                              ),
                            ])].map((c) => (
                              <option key={c} value={c} />
                            ))}
                          </datalist>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            심방일
                          </label>
                          <input
                            value={visit.visitDate}
                            onChange={(e) =>
                              updateVisit(i, "visitDate", e.target.value)
                            }
                            className={inputClass}
                            placeholder="2025-01-01"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            성경/찬송
                          </label>
                          <input
                            value={visit.bibleHymn}
                            onChange={(e) =>
                              updateVisit(i, "bibleHymn", e.target.value)
                            }
                            className={inputClass}
                            placeholder="요한복음 3:16 / 찬송 205장"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            기록자
                          </label>
                          <input
                            value={visit.author || ""}
                            onChange={(e) =>
                              updateVisit(i, "author", e.target.value)
                            }
                            className={inputClass}
                            placeholder="기록자 이름"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          심방내용
                        </label>
                        <textarea
                          value={visit.visitContent}
                          onChange={(e) =>
                            updateVisit(i, "visitContent", e.target.value)
                          }
                          rows={2}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addVisit}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm border border-dashed border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors w-full justify-center"
                  >
                    <Plus className="w-4 h-4" /> 심방 추가
                  </button>
                </div>
              )}

              {/* 탭 4: 메모 */}
              {activeTab === 4 && (
                <div className="space-y-4">
                  {form.memos && form.memos.length > 0 ? (
                    <div className="space-y-3">
                      {form.memos.map((memo, mi) => (
                        <div key={mi} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">{memo.author}</span>
                                <span className="text-xs text-gray-300">·</span>
                                <span className="text-xs text-gray-400">
                                  {memo.createdAt ? new Date(memo.createdAt).toLocaleDateString("ko-KR") : ""}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setForm(prev => ({
                                  ...prev,
                                  memos: prev.memos.filter((_, i) => i !== mi),
                                }));
                              }}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 shrink-0"
                            >
                              <Trash2 className="w-3 h-3" /> 삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">등록된 메모가 없습니다.</p>
                  )}
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
                    <label className="block text-xs font-bold text-gray-600">새 메모 추가</label>
                    <textarea
                      placeholder="메모 내용을 입력하세요..."
                      className={`${inputClass} resize-none`}
                      rows={3}
                      id="modal-memo-input"
                    />
                    <button
                      onClick={() => {
                        const textarea = document.getElementById("modal-memo-input") as HTMLTextAreaElement;
                        const content = textarea?.value?.trim();
                        if (!content) return;
                        const newMemo: MemoEntry = {
                          content,
                          author: getCurrentAuthor(),
                          createdAt: new Date().toISOString(),
                        };
                        setForm(prev => ({
                          ...prev,
                          memos: [...(prev.memos || []), newMemo],
                        }));
                        textarea.value = "";
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition-colors"
                    >
                      <Plus className="w-4 h-4" /> 메모 추가
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl shrink-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
              >
                {saving
                  ? "저장 중..."
                  : editingMember
                    ? "수정 완료"
                    : "등록 완료"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/*  카테고리 관리 모달                                     */}
      {/* ══════════════════════════════════════════════════════ */}
      {/* ── 교인 그룹 설정 모달 (통합) ──────────────────────── */}
      {showGroupModal && (() => {
        const BUILTIN_TYPES = ["장년", "청년", "중고등", "유초등"];

        // 기본 분류 탭
        const builtinViewMembers = selectedGroupView
          ? members.filter(m => m.memberType === selectedGroupView)
          : [];
        const builtinViewWithPhone = builtinViewMembers.filter(m => m.phone);
        const builtinAllChecked = builtinViewWithPhone.length > 0 && builtinViewWithPhone.every(m => checkedPhones.has(m.phone));

        // 직접 만든 그룹 탭
        const customViewMembers = selectedGroupView
          ? members.filter(m => (m.groups || []).includes(selectedGroupView))
          : [];
        const customViewWithPhone = customViewMembers.filter(m => m.phone);
        const customAllChecked = customViewWithPhone.length > 0 && customViewWithPhone.every(m => checkedPhones.has(m.phone));

        // 추가 가능한 교인 (현재 그룹에 없는 교인)
        const notInCustomGroup = selectedGroupView && groupModalTab === "custom"
          ? members.filter(m => !(m.groups || []).includes(selectedGroupView) && m.name.includes(groupAddSearch))
          : [];

        function closeGroupModal() {
          setShowGroupModal(false);
          setSelectedGroupView(null);
          setCheckedPhones(new Set());
          setShowAddMemberPanel(false);
          setGroupAddSearch("");
        }

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">

            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" /> 교인 그룹 설정
              </h3>
              <button onClick={closeGroupModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {/* 탭 */}
            <div className="flex border-b shrink-0">
              <button
                onClick={() => { setGroupModalTab("builtin"); setSelectedGroupView(null); setCheckedPhones(new Set()); setShowAddMemberPanel(false); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${groupModalTab === "builtin" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                기본 분류
              </button>
              <button
                onClick={() => { setGroupModalTab("custom"); setSelectedGroupView(null); setCheckedPhones(new Set()); setShowAddMemberPanel(false); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${groupModalTab === "custom" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                직접 만든 그룹
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* ─── 기본 분류 탭 ─── */}
              {groupModalTab === "builtin" && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {BUILTIN_TYPES.map(type => {
                      const cnt = members.filter(m => m.memberType === type).length;
                      const isActive = selectedGroupView === type;
                      return (
                        <button
                          key={type}
                          onClick={() => { setSelectedGroupView(isActive ? null : type); setCheckedPhones(new Set()); }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-[#2E7D32] text-white" : "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]"}`}
                        >
                          {type} <span className="text-[11px] opacity-70">({cnt}명)</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedGroupView && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={builtinAllChecked}
                            onChange={() => {
                              if (builtinAllChecked) setCheckedPhones(new Set());
                              else setCheckedPhones(new Set(builtinViewWithPhone.map(m => m.phone)));
                            }}
                            className="w-4 h-4 rounded accent-[#2E7D32]"
                          />
                          <span className="text-xs font-bold text-gray-700">{selectedGroupView}</span>
                          <span className="text-[10px] text-gray-400">{builtinViewMembers.length}명</span>
                        </div>
                        {checkedPhones.size > 0 && (
                          <button
                            onClick={() => {
                              const recipients = builtinViewMembers.filter(m => m.phone && checkedPhones.has(m.phone)).map(m => ({ name: m.name, phone: m.phone }));
                              setSmsRecipients(recipients); setSmsMessage(""); setSmsResult(null); setShowSmsModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2E7D32] text-white rounded-lg"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> 선택 문자 ({checkedPhones.size})
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto">
                        {builtinViewMembers.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-6">해당 분류에 소속된 교인이 없습니다.</p>
                        ) : builtinViewMembers.map(m => (
                          <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={!!m.phone && checkedPhones.has(m.phone)}
                              disabled={!m.phone}
                              onChange={() => {
                                if (!m.phone) return;
                                setCheckedPhones(prev => { const next = new Set(prev); if (next.has(m.phone)) next.delete(m.phone); else next.add(m.phone); return next; });
                              }}
                              className="w-4 h-4 rounded accent-[#2E7D32]"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-900">{m.name}</span>
                              {m.detailPosition && <span className="text-[10px] text-gray-400 ml-2">{m.detailPosition}</span>}
                            </div>
                            <select
                              value={m.memberType}
                              onChange={async (e) => { await updateMemberType(m.id, e.target.value); }}
                              onClick={e => e.stopPropagation()}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]/30"
                            >
                              {BUILTIN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGroupView && builtinViewWithPhone.length > 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const recipients = builtinViewWithPhone.map(m => ({ name: m.name, phone: m.phone }));
                          setSmsRecipients(recipients); setSmsMessage(""); setSmsResult(null); setShowSmsModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20]"
                      >
                        <MessageSquare className="w-4 h-4" /> 전체 문자 ({builtinViewWithPhone.length}명)
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* ─── 직접 만든 그룹 탭 ─── */}
              {groupModalTab === "custom" && (
                <>
                  {/* 그룹 목록 */}
                  <div className="flex flex-wrap gap-2">
                    {memberGroupCats.map(grp => {
                      const cnt = members.filter(m => (m.groups || []).includes(grp)).length;
                      const isActive = selectedGroupView === grp;
                      return (
                        <span
                          key={grp}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${isActive ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-600 hover:bg-purple-100"}`}
                        >
                          <span onClick={() => { setSelectedGroupView(isActive ? null : grp); setCheckedPhones(new Set()); setShowAddMemberPanel(false); setGroupAddSearch(""); }}>
                            {grp} <span className={`text-[10px] ${isActive ? "text-purple-200" : "text-purple-400"}`}>({cnt}명)</span>
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); const updated = memberGroupCats.filter(g => g !== grp); saveCategories(visitCats, updated); if (selectedGroupView === grp) { setSelectedGroupView(null); setShowAddMemberPanel(false); } }}
                            className={`${isActive ? "text-purple-200 hover:text-red-300" : "text-purple-400 hover:text-red-500"} transition-colors`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      );
                    })}
                    {memberGroupCats.length === 0 && <p className="text-sm text-gray-400">등록된 그룹이 없습니다.</p>}
                  </div>

                  {/* 그룹 추가 입력 */}
                  <div className="flex gap-2">
                    <input
                      value={newGroupInput}
                      onChange={e => setNewGroupInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && newGroupInput.trim()) {
                          const updated = [...memberGroupCats, newGroupInput.trim()];
                          saveCategories(visitCats, updated);
                          setNewGroupInput("");
                        }
                      }}
                      placeholder="새 그룹 이름 입력..."
                      className={inputClass + " flex-1"}
                    />
                    <button
                      onClick={() => {
                        if (!newGroupInput.trim()) return;
                        const updated = [...memberGroupCats, newGroupInput.trim()];
                        saveCategories(visitCats, updated);
                        setNewGroupInput("");
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm shrink-0"
                    >추가</button>
                  </div>

                  {/* 선택된 그룹 교인 목록 + 추가/제거 */}
                  {selectedGroupView && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={customAllChecked}
                            onChange={() => {
                              if (customAllChecked) setCheckedPhones(new Set());
                              else setCheckedPhones(new Set(customViewWithPhone.map(m => m.phone)));
                            }}
                            className="w-4 h-4 rounded accent-purple-600"
                          />
                          <span className="text-xs font-bold text-gray-700">{selectedGroupView}</span>
                          <span className="text-[10px] text-gray-400">{customViewMembers.length}명</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {checkedPhones.size > 0 && (
                            <button
                              onClick={() => {
                                const recipients = customViewMembers.filter(m => m.phone && checkedPhones.has(m.phone)).map(m => ({ name: m.name, phone: m.phone }));
                                setSmsRecipients(recipients); setSmsMessage(""); setSmsResult(null); setShowSmsModal(true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2E7D32] text-white rounded-lg"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> 선택 문자 ({checkedPhones.size})
                            </button>
                          )}
                          <button
                            onClick={() => { setShowAddMemberPanel(v => !v); setGroupAddSearch(""); }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <Plus className="w-3.5 h-3.5" /> 교인 추가
                          </button>
                        </div>
                      </div>

                      {/* 교인 추가 패널 */}
                      {showAddMemberPanel && (
                        <div className="border-b border-gray-200 bg-purple-50 p-3 space-y-2">
                          <input
                            value={groupAddSearch}
                            onChange={e => setGroupAddSearch(e.target.value)}
                            placeholder="이름으로 검색..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                          <div className="max-h-[160px] overflow-y-auto space-y-1">
                            {notInCustomGroup.length === 0 ? (
                              <p className="text-xs text-gray-400 text-center py-2">추가할 교인이 없습니다.</p>
                            ) : notInCustomGroup.map(m => (
                              <div key={m.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                                <div>
                                  <span className="text-sm font-medium text-gray-900">{m.name}</span>
                                  {m.memberType && <span className="text-[10px] text-gray-400 ml-2">{m.memberType}</span>}
                                </div>
                                <button
                                  onClick={async () => { await addMemberToCustomGroup(m.id, selectedGroupView!); }}
                                  className="text-xs px-2.5 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >추가</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto">
                        {customViewMembers.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-6">해당 그룹에 소속된 교인이 없습니다.</p>
                        ) : customViewMembers.map(m => (
                          <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={!!m.phone && checkedPhones.has(m.phone)}
                              disabled={!m.phone}
                              onChange={() => {
                                if (!m.phone) return;
                                setCheckedPhones(prev => { const next = new Set(prev); if (next.has(m.phone)) next.delete(m.phone); else next.add(m.phone); return next; });
                              }}
                              className="w-4 h-4 rounded accent-purple-600"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-900">{m.name}</span>
                              {m.memberType && <span className="text-[10px] text-gray-400 ml-2">{m.memberType}</span>}
                            </div>
                            {m.phone ? (
                              <span className="text-xs text-gray-500">{m.phone}</span>
                            ) : (
                              <span className="text-[10px] text-red-400">번호 없음</span>
                            )}
                            <button
                              onClick={async () => { await removeMemberFromCustomGroup(m.id, selectedGroupView!); }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="그룹에서 제거"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGroupView && customViewWithPhone.length > 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const recipients = customViewWithPhone.map(m => ({ name: m.name, phone: m.phone }));
                          setSmsRecipients(recipients); setSmsMessage(""); setSmsResult(null); setShowSmsModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20]"
                      >
                        <MessageSquare className="w-4 h-4" /> 전체 문자 ({customViewWithPhone.length}명)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl shrink-0 flex justify-end">
              <button onClick={closeGroupModal} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">닫기</button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── 심방 분류 설정 모달 (잠금 기능 포함) ───────────── */}
      {showVisitCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#2E7D32]" /> 심방 분류 설정
              </h3>
              <button onClick={() => setShowVisitCatModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {/* 범례 */}
              <p className="text-xs text-gray-400">
                자물쇠 버튼으로 분류를 잠그면 실수로 삭제되지 않습니다.
              </p>
              {/* 카테고리 목록 */}
              {visitCats.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">등록된 분류가 없습니다.</p>
              )}
              {visitCats.map((cat) => {
                const isLocked = lockedVisitCats.includes(cat);
                const visitCount = members.reduce((acc, m) => acc + (m.pastoralVisits || []).filter(v => (v.category || "기타") === cat).length, 0);
                return (
                  <div
                    key={cat}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                      isLocked ? "bg-amber-50 border-amber-200" : "bg-[#E8F5E9] border-[#C8E6C9]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isLocked && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      <span className={`text-sm font-medium truncate ${isLocked ? "text-amber-700" : "text-[#2E7D32]"}`}>{cat}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{visitCount}건</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* 잠금/해제 토글 */}
                      <button
                        onClick={() => {
                          const updated = isLocked
                            ? lockedVisitCats.filter(c => c !== cat)
                            : [...lockedVisitCats, cat];
                          saveLockedVisitCats(updated);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLocked
                            ? "text-amber-500 hover:bg-amber-100"
                            : "text-gray-400 hover:bg-gray-100 hover:text-amber-500"
                        }`}
                        title={isLocked ? "잠금 해제" : "잠금 설정"}
                      >
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                      {/* 삭제 (잠금 상태이면 비활성) */}
                      <button
                        disabled={isLocked}
                        onClick={() => {
                          if (isLocked) return;
                          const updated = visitCats.filter(c => c !== cat);
                          saveCategories(updated, memberGroupCats);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLocked
                            ? "text-gray-200 cursor-not-allowed"
                            : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                        }`}
                        title={isLocked ? "잠금 상태 — 삭제 불가" : "삭제"}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* 새 분류 추가 */}
              <div className="flex gap-2 pt-2">
                <input
                  value={newCatInput}
                  onChange={e => setNewCatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newCatInput.trim()) {
                      const updated = [...visitCats, newCatInput.trim()];
                      saveCategories(updated, memberGroupCats);
                      setNewCatInput("");
                    }
                  }}
                  placeholder="새 심방 분류 이름 입력..."
                  className={inputClass + " flex-1"}
                />
                <button
                  onClick={() => {
                    if (!newCatInput.trim()) return;
                    const updated = [...visitCats, newCatInput.trim()];
                    saveCategories(updated, memberGroupCats);
                    setNewCatInput("");
                  }}
                  className="px-4 py-2 bg-[#2E7D32] text-white rounded-xl text-sm shrink-0"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl shrink-0">
              <button onClick={() => setShowVisitCatModal(false)} className="w-full py-2 text-sm bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 문자 보내기 모달 ───────────────────────────────── */}
      {showSmsModal && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2E7D32]" /> 문자 보내기
              </h3>
              <button onClick={() => { setShowSmsModal(false); setSmsResult(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* 수신자 목록 */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2">수신자 ({smsRecipients.length}명)</h4>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                  {smsRecipients.map((r, ri) => (
                    <span key={ri} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {r.name}
                      <span className="text-gray-400">{r.phone}</span>
                      <button
                        onClick={() => setSmsRecipients(prev => prev.filter((_, i) => i !== ri))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 메시지 입력 */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2">메시지 내용</h4>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="문자 내용을 입력하세요..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10px] ${smsMessage.length > 90 ? "text-orange-500" : "text-gray-400"}`}>
                    {smsMessage.length}자 · {smsMessage.length <= 90 ? "SMS (단문)" : "LMS (장문)"}
                  </span>
                  <span className="text-[10px] text-gray-400">90자 초과 시 LMS 자동 전환</span>
                </div>
              </div>

              {/* 발송 결과 */}
              {smsResult && (
                <div className={`p-3 rounded-xl text-sm ${smsResult.success ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-red-50 text-red-600"}`}>
                  {smsResult.success ? (
                    <p>발송 완료: {smsResult.sent}건 성공{smsResult.failed > 0 && `, ${smsResult.failed}건 실패`}</p>
                  ) : (
                    <p>발송 실패: {smsResult.error}</p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl shrink-0 flex items-center justify-between">
              <button onClick={() => { setShowSmsModal(false); setSmsResult(null); }} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">취소</button>
              <button
                onClick={async () => {
                  if (!smsMessage.trim()) { alert("메시지 내용을 입력하세요."); return; }
                  if (smsRecipients.length === 0) { alert("수신자가 없습니다."); return; }
                  setSmsSending(true);
                  setSmsResult(null);
                  try {
                    const res = await fetch("/api/sms/send", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ recipients: smsRecipients, message: smsMessage.trim() }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      setSmsResult({ success: true, sent: data.sent, failed: data.failed });
                    } else {
                      setSmsResult({ success: false, sent: 0, failed: smsRecipients.length, error: data.error || "발송 실패" });
                    }
                  } catch {
                    setSmsResult({ success: false, sent: 0, failed: smsRecipients.length, error: "네트워크 오류" });
                  } finally {
                    setSmsSending(false);
                  }
                }}
                disabled={smsSending || !smsMessage.trim() || smsRecipients.length === 0}
                className="flex items-center gap-1.5 px-5 py-2 text-sm bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                {smsSending ? "발송 중..." : `발송하기 (${smsRecipients.length}명)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/*  가족 상세 모달 (fixed, 최상위)                        */}
      {/* ══════════════════════════════════════════════════════ */}
      {familyDetailModal && (
        <FamilyDetailModal
          member={familyDetailModal}
          onClose={() => setFamilyDetailModal(null)}
          onImageClick={(src, alt) => {
            setFamilyDetailModal(null);
            setImageModal({ src, alt });
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/*  이미지 모달 (fixed, 최상위)                           */}
      {/* ══════════════════════════════════════════════════════ */}
      {imageModal && (
        <ImageModal
          src={imageModal.src}
          alt={imageModal.alt}
          onClose={() => setImageModal(null)}
        />
      )}
    </div>
  );
}
