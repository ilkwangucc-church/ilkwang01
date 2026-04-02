"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Camera, BookText, GraduationCap, FolderOpen,
  Users2, PenLine, HeartHandshake, CalendarDays,
  BookOpen, ArrowRight, Sun, Bell,
  Users, MessageSquare,
} from "lucide-react";

const TODAY_VERSE = {
  text: "여호와는 나의 목자시니 내게 부족함이 없으리로다",
  ref: "시편 23:1",
};

const DAILY_FEED = [
  { name: "김성도", avatar: "김", time: "오늘 오전 8:24", text: "오늘도 말씀으로 하루를 시작합니다 🙏", color: "bg-emerald-100 text-emerald-700" },
  { name: "이은혜", avatar: "이", time: "오늘 오전 7:58", text: "새벽 기도 후 아침 노을이 너무 아름다웠어요 ☀️", color: "bg-blue-100 text-blue-700" },
  { name: "박믿음", avatar: "박", time: "어제 오후 9:12", text: "소그룹 모임에서 큰 은혜를 받았습니다 💛", color: "bg-amber-100 text-amber-700" },
];

const UPCOMING_EVENTS = [
  { date: "4.10", day: "목", title: "부활절 연합예배", category: "예배", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { date: "4.15", day: "화", title: "청년부 수련회 등록 마감", category: "청년부", color: "bg-purple-50 text-purple-700 border-purple-100" },
  { date: "4.20", day: "일", title: "봄 부흥성회 시작", category: "특별집회", color: "bg-amber-50 text-amber-700 border-amber-100" },
];

const COMMUNITY_MENUS = [
  { label: "성도의 하루", href: "/dashboard/daily",      icon: "📸", desc: "사진 한 장 + 한 줄" },
  { label: "성경통독",    href: "/dashboard/bible",      icon: "📖", desc: "연간 통독 계획" },
  { label: "교회교육",    href: "/dashboard/education",  icon: "🎓", desc: "교육 프로그램" },
  { label: "부서나눔",    href: "/dashboard/dept-share", icon: "🤝", desc: "부서별 게시판" },
  { label: "부서 블로그", href: "/dashboard/blog",       icon: "✍️", desc: "글쓰기" },
  { label: "행사안내",    href: "/dashboard/events",     icon: "📅", desc: "일정 및 이벤트" },
  { label: "상담신청",    href: "/dashboard/counseling", icon: "💬", desc: "비공개 상담" },
  { label: "자료실",      href: "/dashboard/resources",  icon: "📁", desc: "교육·나눔 자료" },
  { label: "부서 인스타", href: "/dashboard/instagram",  icon: "📷", desc: "인스타그램 연결" },
];

interface AdminUser { role: number; displayName: string; username: string; }

export default function CommunityHome() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_user");
    if (stored) { try { setAdminUser(JSON.parse(stored)); } catch { /* noop */ } }
    fetch("/api/admin/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.username) setAdminUser(d); })
      .catch(() => {});
  }, []);

  const isAdmin = (adminUser?.role ?? 0) >= 5;
  const displayName = adminUser?.displayName || adminUser?.username || "성도";
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayStr = days[today.getDay()] + "요일";

  return (
    <div className="space-y-6 max-w-4xl">

      {/* 환영 배너 */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-green-200 text-sm mb-1">
              <Sun className="w-3.5 h-3.5 inline mr-1" />
              {dateStr} {dayStr}
            </p>
            <h1 className="text-2xl font-bold mb-1">{displayName}님, 환영합니다 👋</h1>
            <p className="text-green-100 text-sm">일광교회 커뮤니티에 오신 것을 환영합니다</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-sm max-w-xs">
            <p className="text-green-100 text-xs mb-1">오늘의 말씀</p>
            <p className="text-white font-medium leading-relaxed">"{TODAY_VERSE.text}"</p>
            <p className="text-green-200 text-xs mt-1 text-right">{TODAY_VERSE.ref}</p>
          </div>
        </div>
      </div>

      {/* 커뮤니티 빠른 메뉴 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">커뮤니티 메뉴</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {COMMUNITY_MENUS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-1.5 bg-gray-50 hover:bg-[#E8F5E9] rounded-xl p-3 text-center transition-colors group"
            >
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-[#2E7D32]">{q.label}</span>
              <span className="text-[10px] text-gray-400 hidden sm:block">{q.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 성도의 하루 미리보기 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#2E7D32]" /> 성도의 하루
            </h2>
            <Link href="/dashboard/daily" className="flex items-center gap-1 text-xs text-[#2E7D32] hover:underline">
              더보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DAILY_FEED.map((f, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${f.color}`}>
                  {f.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-800">{f.name}</span>
                    <span className="text-[10px] text-gray-400">{f.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <Link
              href="/dashboard/daily"
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] rounded-lg text-sm font-medium transition-colors"
            >
              <Camera className="w-4 h-4" /> 오늘 하루 나누기
            </Link>
          </div>
        </div>

        {/* 이번 주 행사 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#2E7D32]" /> 다가오는 행사
            </h2>
            <Link href="/dashboard/events" className="flex items-center gap-1 text-xs text-[#2E7D32] hover:underline">
              전체보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {UPCOMING_EVENTS.map((e, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <div className="w-12 text-center shrink-0">
                  <p className="text-lg font-bold text-gray-900">{e.date}</p>
                  <p className="text-[10px] text-gray-400">{e.day}요일</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${e.color}`}>{e.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 관리자 요약 — 5단계 이상만 */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" /> 관리자 요약
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/dashboard/members" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
              <div><p className="text-xs text-gray-500">전체 회원</p><p className="font-bold text-gray-900">342명</p></div>
            </Link>
            <Link href="/dashboard/contacts" className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
              <MessageSquare className="w-5 h-5 text-rose-600" />
              <div><p className="text-xs text-gray-500">미확인 문의</p><p className="font-bold text-gray-900">3건</p></div>
            </Link>
            <Link href="/dashboard/notices/announcements" className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
              <Bell className="w-5 h-5 text-amber-600" />
              <div><p className="text-xs text-gray-500">최근 공지</p><p className="font-bold text-gray-900">3건</p></div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
