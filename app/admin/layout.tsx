"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BookUser, Award, MessageSquare,
  Video, Monitor, Heart, Building2, FileStack,
  Bell, BookOpen, BookMarked, Image, DollarSign,
  Settings, LogOut, Menu, X, Zap, ChevronDown, ChevronRight
} from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/adminAuth";

interface NavGroup {
  label: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navGroups: NavGroup[] = [
  {
    label: "회원 · 교인",
    items: [
      { label: "회원 관리",   href: "/admin/members",        icon: Users },
      { label: "교인 관리",   href: "/admin/church-members", icon: BookUser },
      { label: "증명서 발급", href: "/admin/certificates",   icon: Award },
    ],
  },
  {
    label: "웹사이트 콘텐츠",
    items: [
      { label: "홈 화면 수정",       href: "/admin/hero",        icon: Monitor },
      { label: "섬기는 사람들",      href: "/admin/ministers",   icon: Heart },
      { label: "부서 소개 수정",     href: "/admin/departments", icon: Building2 },
      { label: "미디어 관리",        href: "/admin/media",       icon: Video },
      { label: "페이지 관리",        href: "/admin/pages",       icon: FileStack },
    ],
  },
  {
    label: "교회 운영",
    items: [
      { label: "문의 접수함",  href: "/admin/contacts",  icon: MessageSquare },
      { label: "공지/게시판",  href: "/admin/notices",   icon: Bell },
      { label: "설교/미디어",  href: "/admin/sermons",   icon: BookOpen },
      { label: "주보 관리",    href: "/admin/bulletins", icon: BookMarked },
      { label: "갤러리 관리",  href: "/admin/gallery",   icon: Image },
      { label: "헌금 현황",    href: "/admin/offerings", icon: DollarSign },
    ],
  },
  {
    label: "시스템",
    items: [
      { label: "캐시 관리",  href: "/admin/cache",    icon: Zap },
      { label: "사이트 설정", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminUser {
  username: string;
  role: number;
  displayName: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "회원 · 교인": true,
    "웹사이트 콘텐츠": true,
    "교회 운영": false,
    "시스템": false,
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // 로그인 페이지는 레이아웃 없이 렌더
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // sessionStorage에서 사용자 정보 로드
    const stored = sessionStorage.getItem("admin_user");
    if (stored) {
      try { setAdminUser(JSON.parse(stored)); } catch { /* noop */ }
    }
    // 서버에서도 확인
    fetch("/api/admin/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.username) setAdminUser(data); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    sessionStorage.removeItem("admin_user");
    router.push("/admin/login");
  }

  function toggleGroup(label: string) {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
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
        <div className="h-16 flex items-center px-5 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">일</div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm leading-tight truncate">일광교회</p>
              <p className="text-gray-400 text-[10px]">관리자 패널</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-2 lg:hidden text-gray-400 hover:text-white shrink-0">
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
                  {ROLE_LABELS[adminUser.role] || "관리자"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-3">
          {/* 대시보드 */}
          <Link
            href="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors mx-2 rounded-lg mb-1 ${
              isActive("/admin") && pathname === "/admin"
                ? "bg-[#2E7D32] text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            대시보드
          </Link>

          {/* 그룹 메뉴 */}
          {navGroups.map((group) => (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-5 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
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
                        className={`flex items-center gap-3 px-5 py-2 text-sm transition-colors mx-2 rounded-lg ${
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
