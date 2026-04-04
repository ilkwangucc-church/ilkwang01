"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BookUser, Award, MessageSquare,
  Video, Monitor, Heart, Building2, FileStack,
  Bell, CalendarDays, BookOpen, BookMarked, Image as GalleryIcon,
  Settings, LogOut, Menu, X, Zap, ChevronDown, ChevronRight,
  Camera, GraduationCap, FolderOpen, Users2, PenLine,
  Link2, HeartHandshake, BookText, Newspaper,
  Eye, EyeOff, UserCircle, Lock, Phone, Building, CalendarCheck,
} from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/adminAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// 커뮤니티 그룹 — 모든 회원에게 표시
const communityGroups: NavGroup[] = [
  {
    label: "예배·말씀",
    items: [
      { label: "성경통독",   href: "/dashboard/bible",   icon: BookText },
      { label: "설교 보기",  href: "/dashboard/sermons", icon: BookOpen },
    ],
  },
  {
    label: "성장·교육",
    items: [
      { label: "교회교육", href: "/dashboard/education", icon: GraduationCap },
      { label: "자료실",   href: "/dashboard/resources", icon: FolderOpen },
    ],
  },
  {
    label: "교제·소통",
    items: [
      { label: "성도의 하루",  href: "/dashboard/daily",       icon: Camera },
      { label: "부서나눔",     href: "/dashboard/dept-share",  icon: Users2 },
      { label: "부서별 블로그", href: "/dashboard/blog",        icon: PenLine },
      { label: "상담신청",     href: "/dashboard/counseling",  icon: HeartHandshake },
    ],
  },
  {
    label: "안내",
    items: [
      { label: "행사안내",     href: "/dashboard/events",     icon: CalendarDays },
      { label: "부서별 인스타", href: "/dashboard/instagram",  icon: Link2 },
    ],
  },
];

// 관리 그룹 — 5단계(교역자) 이상에게만 표시
const adminGroups: NavGroup[] = [
  {
    label: "회원 · 교인",
    items: [
      { label: "회원 관리",   href: "/dashboard/members",        icon: Users },
      { label: "교인 관리",   href: "/dashboard/church-members", icon: BookUser },
      { label: "증명서 발급", href: "/dashboard/certificates",   icon: Award },
    ],
  },
  {
    label: "웹사이트 콘텐츠",
    items: [
      { label: "홈 화면 수정",   href: "/dashboard/hero",        icon: Monitor },
      { label: "섬기는 사람들",  href: "/dashboard/ministers",   icon: Heart },
      { label: "부서 소개 수정", href: "/dashboard/departments", icon: Building2 },
      { label: "미디어 관리",    href: "/dashboard/media",       icon: Video },
      { label: "페이지 관리",    href: "/dashboard/pages",       icon: FileStack },
    ],
  },
  {
    label: "교회 운영",
    items: [
      { label: "문의 접수함", href: "/dashboard/contacts",                 icon: MessageSquare },
      { label: "공지안내",    href: "/dashboard/notices/announcements",    icon: Bell },
      { label: "행사 관리",   href: "/dashboard/notices/events",          icon: CalendarDays },
      { label: "주보 관리",   href: "/dashboard/bulletins",               icon: BookMarked },
      { label: "갤러리 관리", href: "/dashboard/gallery",                 icon: GalleryIcon },
      { label: "뉴스레터",    href: "/dashboard/sermons",                 icon: Newspaper },
    ],
  },
  {
    label: "시스템",
    items: [
      { label: "캐시 관리",   href: "/dashboard/cache",               icon: Zap },
      { label: "인스타 설정", href: "/dashboard/settings/instagram", icon: Camera },
      { label: "사이트 설정", href: "/dashboard/settings",           icon: Settings },
    ],
  },
];

interface AdminUser {
  username: string;
  role: number;
  displayName: string;
}

function NavGroupSection({
  group,
  openGroups,
  toggleGroup,
  isActive,
  setSidebarOpen,
}: {
  group: NavGroup;
  openGroups: Record<string, boolean>;
  toggleGroup: (label: string) => void;
  isActive: (href: string) => boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  return (
    <div className="mb-1">
      <button
        onClick={() => toggleGroup(group.label)}
        className="w-full flex items-center justify-between px-5 py-1.5 text-[15px] font-semibold text-gray-400 hover:text-gray-200 transition-colors"
      >
        {group.label}
        {openGroups[group.label]
          ? <ChevronDown className="w-3 h-3" />
          : <ChevronRight className="w-3 h-3" />
        }
      </button>
      {openGroups[group.label] && (
        <div>
          {group.items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-2 text-[14px] transition-colors mx-2 rounded-lg ${
                  active
                    ? "bg-[#2E7D32] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "예배·말씀": true,
    "성장·교육": false,
    "교제·소통": true,
    "안내": false,
    "회원 · 교인": false,
    "웹사이트 콘텐츠": false,
    "교회 운영": false,
    "시스템": false,
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  /* 프로필 모달 */
  const [showProfile, setShowProfile]       = useState(false);
  const [profileTab, setProfileTab]         = useState<"info" | "pw">("info");
  const [profileData, setProfileData]       = useState<Record<string, string>>({});
  const [pwForm, setPwForm]                 = useState({ current: "", next: "", confirm: "" });
  const [showCurPw, setShowCurPw]           = useState(false);
  const [showNewPw, setShowNewPw]           = useState(false);
  const [profileMsg, setProfileMsg]         = useState("");
  const [profileErr, setProfileErr]         = useState("");
  const [profileSaving, setProfileSaving]   = useState(false);
  const [mounted, setMounted]               = useState(false);
  const pwInputRef = useRef<HTMLInputElement>(null);

  // 로그인 페이지는 레이아웃 없이 렌더
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("admin_user");
    if (stored) {
      try { setAdminUser(JSON.parse(stored)); } catch { /* noop */ }
    }
    fetch("/api/admin/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.username) setAdminUser(data); })
      .catch(() => {});
  }, []);

  async function openProfile() {
    setProfileTab("info");
    setProfileMsg("");
    setProfileErr("");
    setPwForm({ current: "", next: "", confirm: "" });
    setShowProfile(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) setProfileData(await res.json());
    } catch { /* noop */ }
  }

  async function handlePwChange(e: React.FormEvent) {
    e.preventDefault();
    setProfileErr(""); setProfileMsg("");
    if (pwForm.next !== pwForm.confirm) { setProfileErr("새 비밀번호가 일치하지 않습니다."); return; }
    if (pwForm.next.length < 8)          { setProfileErr("8자 이상 입력해주세요."); return; }
    setProfileSaving(true);
    try {
      const res  = await fetch("/api/admin/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) { setProfileErr(data.error || "오류가 발생했습니다."); return; }
      setProfileMsg("비밀번호가 변경되었습니다.");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch { setProfileErr("서버 오류가 발생했습니다."); }
    finally  { setProfileSaving(false); }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    sessionStorage.removeItem("admin_user");
    router.push("/login");
  }

  function toggleGroup(label: string) {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 사이드바 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* 로고 헤더 */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-800 shrink-0 relative">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-end select-none"
            style={{ gap: 6, letterSpacing: 0 }}
          >
            <div className="shrink-0" style={{ width: 20, height: 28, marginBottom: 3 }}>
              <img
                src="/logo01.png"
                alt="일광교회"
                style={{ width: 20, height: 28, objectFit: "contain", display: "block" }}
              />
            </div>
            <div className="flex flex-col items-start leading-none" style={{ paddingTop: 6 }}>
              <span
                className="font-nanum"
                style={{ fontSize: 8, color: "rgba(255,255,255,0.75)", letterSpacing: "0.03em" }}
              >
                행복과 영원으로 초대하는
              </span>
              <span
                className="font-noto-black"
                style={{ fontSize: 20, color: "#ffffff", marginTop: 4 }}
              >
                일광교회
              </span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="absolute right-4 lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 현재 사용자 */}
        {adminUser && (
          <div className="px-5 py-3 border-b border-gray-800 bg-gray-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#2E7D32]/30 rounded-full flex items-center justify-center text-[#6dbf73] font-bold text-sm shrink-0">
                {adminUser.displayName?.[0] || adminUser.username[0]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">{adminUser.displayName || adminUser.username}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ROLE_COLORS[adminUser.role] || "bg-gray-700 text-gray-300"}`}>
                  {ROLE_LABELS[adminUser.role] || "회원"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-3">
          {/* 홈 */}
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2 mx-2 px-3 py-2 text-[14px] transition-colors rounded-lg mb-1 ${
              pathname === "/dashboard"
                ? "bg-[#2E7D32] text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Home
          </Link>

          {/* 커뮤니티 그룹 — 모든 회원 */}
          {communityGroups.map((group) => (
            <NavGroupSection
              key={group.label}
              group={group}
              openGroups={openGroups}
              toggleGroup={toggleGroup}
              isActive={isActive}
              setSidebarOpen={setSidebarOpen}
            />
          ))}

          {/* 관리자 구분선 */}
          <div className="mx-5 my-3 border-t border-gray-700" />
          <p className="px-5 py-1 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">관리자</p>
          {adminGroups.map((group) => (
            <NavGroupSection
              key={group.label}
              group={group}
              openGroups={openGroups}
              toggleGroup={toggleGroup}
              isActive={isActive}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </nav>

        {/* 로그아웃 */}
        <div className="p-3 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 상단 헤더 */}
        <header className="h-14 bg-white border-b flex items-center px-5 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">
            사이트 보기 →
          </Link>
          {adminUser && (
            <button
              type="button"
              onClick={openProfile}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {adminUser.displayName?.[0] || adminUser.username[0]}
              </div>
              <span className="text-sm text-gray-700 hidden sm:block">{adminUser.displayName || adminUser.username}</span>
            </button>
          )}
        </header>

        {/* 대시보드 폰트 스케일링 — 최소 14px */}
        <style>{`
          .dc .text-xs,
          .dc .text-\\[10px\\],
          .dc .text-\\[11px\\],
          .dc .text-\\[10px\\] { font-size:0.875rem !important; line-height:1.375rem !important }
          .dc .text-sm { font-size:1rem !important; line-height:1.5rem !important }
          .dc .text-base { font-size:1.0625rem !important; line-height:1.625rem !important }
          .dc .text-lg { font-size:1.25rem !important; line-height:1.75rem !important }
          .dc .text-xl { font-size:1.5rem !important; line-height:2rem !important }
          .dc .text-2xl { font-size:1.875rem !important; line-height:2.375rem !important }
          .dc table th, .dc table td { font-size:max(0.875rem, inherit) }
        `}</style>
        {/* 페이지 컨텐츠 */}
        <main className="dc flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>

    {/* ── 내 프로필 모달 (Portal) ─────────────────────────── */}
    {mounted && showProfile && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

          {/* 헤더 */}
          <div className="bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] px-6 py-5 flex items-center gap-4 relative">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {adminUser?.displayName?.[0] || adminUser?.username?.[0] || "?"}
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{adminUser?.displayName || adminUser?.username}</p>
              <span className="text-white/80 text-xs">{ROLE_LABELS[adminUser?.role ?? 0] || "회원"}</span>
            </div>
            <button
              onClick={() => setShowProfile(false)}
              className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 탭 */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setProfileTab("info"); setProfileErr(""); setProfileMsg(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${profileTab === "info" ? "text-[#2E7D32] border-b-2 border-[#2E7D32]" : "text-gray-400 hover:text-gray-600"}`}
            >
              내 정보
            </button>
            <button
              onClick={() => { setProfileTab("pw"); setProfileErr(""); setProfileMsg(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${profileTab === "pw" ? "text-[#2E7D32] border-b-2 border-[#2E7D32]" : "text-gray-400 hover:text-gray-600"}`}
            >
              비밀번호 변경
            </button>
          </div>

          {/* 내 정보 탭 */}
          {profileTab === "info" && (
            <div className="px-6 py-5 space-y-3">
              {[
                { icon: <UserCircle className="w-4 h-4" />, label: "아이디", value: profileData.username || adminUser?.username || "-" },
                { icon: <UserCircle className="w-4 h-4" />, label: "이름",   value: profileData.displayName || adminUser?.displayName || "-" },
                { icon: <Building  className="w-4 h-4" />, label: "부서",   value: profileData.dept  || "-" },
                { icon: <Phone     className="w-4 h-4" />, label: "연락처", value: profileData.phone || "-" },
                { icon: <CalendarCheck className="w-4 h-4" />, label: "가입일", value: profileData.joined || "-" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 shrink-0">{icon}</span>
                  <span className="text-xs text-gray-400 w-14 shrink-0">{label}</span>
                  <span className="text-sm text-gray-800 font-medium">{value}</span>
                </div>
              ))}
              <button
                onClick={handleLogout}
                className="w-full mt-2 py-2.5 border border-red-200 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> 로그아웃
              </button>
            </div>
          )}

          {/* 비밀번호 변경 탭 */}
          {profileTab === "pw" && (
            <form onSubmit={handlePwChange} className="px-6 py-5 space-y-4">
              {profileErr && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{profileErr}</p>}
              {profileMsg && <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">{profileMsg}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                <div className="relative">
                  <input
                    ref={pwInputRef}
                    type={showCurPw ? "text" : "password"}
                    value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                    placeholder="현재 비밀번호"
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                  />
                  <button type="button" onClick={() => setShowCurPw(v => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 <span className="text-gray-400 text-xs">(8자 이상)</span></label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                    placeholder="새 비밀번호"
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                  />
                  <button type="button" onClick={() => setShowNewPw(v => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="비밀번호 재입력"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowProfile(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  취소
                </button>
                <button type="submit" disabled={profileSaving}
                  className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors disabled:opacity-60 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  {profileSaving ? "변경 중..." : "변경 완료"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
