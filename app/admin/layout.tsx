"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, BookOpen,
  Bell, Image, DollarSign, Menu, X, Settings, LogOut, BookMarked, Zap
} from "lucide-react";

const navItems = [
  { label: "대시보드",      href: "/admin",            icon: LayoutDashboard },
  { label: "콘텐츠 관리",   href: "/admin/content",    icon: FileText },
  { label: "주보 관리",     href: "/admin/bulletins",  icon: BookMarked },
  { label: "성도(교적) 관리", href: "/admin/members",  icon: Users },
  { label: "설교/미디어",   href: "/admin/sermons",    icon: BookOpen },
  { label: "공지/게시판",   href: "/admin/notices",    icon: Bell },
  { label: "갤러리 관리",   href: "/admin/gallery",    icon: Image },
  { label: "헌금 현황",     href: "/admin/offerings",  icon: DollarSign },
  { label: "캐시 관리",     href: "/admin/cache",      icon: Zap },
  { label: "사이트 설정",   href: "/admin/settings",   icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
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
        {/* 로고 */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2E7D32] rounded-full flex items-center justify-center text-white font-bold text-xs">일</div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">일광교회</p>
              <p className="text-gray-400 text-[10px]">관리자 패널</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
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
        </nav>

        {/* 하단 */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Link>
        </div>
      </aside>

      {/* 오버레이 (모바일) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 상단 헤더 */}
        <header className="h-16 bg-white border-b flex items-center px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-[#2E7D32]">
            사이트 보기 →
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-xs font-bold">관</div>
            <span className="text-sm text-gray-700 hidden sm:block">관리자</span>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
