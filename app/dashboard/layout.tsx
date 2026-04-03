"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BookUser, Award, MessageSquare,
  Video, Monitor, Heart, Building2, FileStack,
  Bell, CalendarDays, BookOpen, BookMarked, Image as GalleryIcon,
  Settings, LogOut, Menu, X, Zap, ChevronDown, ChevronRight,
  Camera, GraduationCap, FolderOpen, Users2, PenLine,
  Link2, HeartHandshake, BookText, Newspaper,
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

  // 로그인 페이지는 레이아웃 없이 렌더
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_user");
    if (stored) {
      try { setAdminUser(JSON.parse(stored)); } catch { /* noop */ }
    }
    fetch("/api/admin/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.username) setAdminUser(data); })
      .catch(() => {});
  }, []);

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {adminUser.displayName?.[0] || adminUser.username[0]}
              </div>
              <span className="text-sm text-gray-700 hidden sm:block">{adminUser.displayName || adminUser.username}</span>
            </div>
          )}
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
