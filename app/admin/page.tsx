import { Metadata } from "next";
import Link from "next/link";
import {
  Users, BookOpen, Bell, DollarSign, MessageSquare,
  Award, Building2, Heart, Eye, ArrowRight,
  ClipboardList, FileText, Monitor, Video
} from "lucide-react";

export const metadata: Metadata = { title: "관리자 대시보드 | 일광교회" };

const stats = [
  { label: "전체 회원수",    value: "342명",   icon: Users,         color: "text-blue-600",   bg: "bg-blue-50",   href: "/admin/members" },
  { label: "이번달 설교",    value: "8편",     icon: BookOpen,      color: "text-green-600",  bg: "bg-green-50",  href: "/admin/sermons" },
  { label: "미확인 문의",    value: "3건",     icon: MessageSquare, color: "text-rose-600",   bg: "bg-rose-50",   href: "/admin/contacts" },
  { label: "이번달 헌금",    value: "2,450만원", icon: DollarSign,   color: "text-purple-600", bg: "bg-purple-50", href: "/admin/offerings" },
];

const quickMenus = [
  { label: "회원 관리",       href: "/admin/members",        Icon: Users,         desc: "7단계 등급 관리" },
  { label: "교인 관리",       href: "/admin/church-members", Icon: ClipboardList, desc: "교적 명부" },
  { label: "증명서 발급",     href: "/admin/certificates",   Icon: FileText,      desc: "등록·세례 증명" },
  { label: "문의 접수함",     href: "/admin/contacts",       Icon: MessageSquare, desc: "홈페이지 문의" },
  { label: "홈 화면 수정",    href: "/admin/hero",           Icon: Monitor,       desc: "메인 배너 편집" },
  { label: "섬기는 사람들",   href: "/admin/ministers",      Icon: Heart,         desc: "교역자·봉사자" },
  { label: "부서 소개 수정",  href: "/admin/departments",    Icon: Building2,     desc: "부서별 소개" },
  { label: "미디어 관리",     href: "/admin/media",          Icon: Video,         desc: "동영상·이미지" },
];

const recentNotices = [
  { title: "2025 부활절 연합예배 안내", date: "2025-04-10", views: 312 },
  { title: "봄 부흥성회 강사 프로필",   date: "2025-04-05", views: 245 },
  { title: "청년부 수련회 참가 신청",   date: "2025-03-28", views: 189 },
  { title: "소그룹 리더 모집 안내",     date: "2025-03-20", views: 167 },
];

const recentContacts = [
  { name: "김○○", subject: "예배 시간 문의", date: "2025-04-01", isRead: false },
  { name: "이○○", subject: "새 가족 등록 방법",  date: "2025-03-30", isRead: false },
  { name: "박○○", subject: "청년부 모임 문의",    date: "2025-03-28", isRead: true },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 text-sm mt-0.5">일광교회 관리자 패널에 오신 것을 환영합니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </Link>
          );
        })}
      </div>

      {/* 빠른 메뉴 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">빠른 메뉴</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickMenus.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-2 bg-gray-50 hover:bg-[#E8F5E9] rounded-xl p-4 text-center transition-colors group"
            >
              <q.Icon className="w-6 h-6 text-[#2E7D32] group-hover:text-[#1B5E20]" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#2E7D32]">{q.label}</span>
              <span className="text-xs text-gray-400">{q.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 최근 공지사항 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">최근 공지사항</h2>
            <Link href="/admin/notices" className="flex items-center gap-1 text-xs text-[#2E7D32] hover:underline">
              전체보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNotices.map((n, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0 ml-3">
                  <Eye className="w-3 h-3" />{n.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 문의 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">최근 문의</h2>
            <Link href="/admin/contacts" className="flex items-center gap-1 text-xs text-[#2E7D32] hover:underline">
              전체보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.map((c, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.subject}</p>
                    <p className="text-xs text-gray-400">{c.name} · {c.date}</p>
                  </div>
                </div>
                {!c.isRead && (
                  <span className="shrink-0 w-2 h-2 bg-rose-500 rounded-full" title="미확인" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 회원 등급 안내 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">회원 등급 체계</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { level: 1, name: "일반회원",   color: "bg-gray-100 text-gray-600" },
            { level: 2, name: "믿음회원",   color: "bg-emerald-100 text-emerald-700" },
            { level: 3, name: "소망회원",   color: "bg-blue-100 text-blue-700" },
            { level: 4, name: "사랑회원",   color: "bg-indigo-100 text-indigo-700" },
            { level: 5, name: "일반관리자", color: "bg-purple-100 text-purple-700" },
            { level: 6, name: "교역자",     color: "bg-amber-100 text-amber-700" },
            { level: 7, name: "교역자(최고)", color: "bg-amber-100 text-amber-700" },
          ].map((g) => (
            <div key={g.level} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${g.color}`}>{g.level}</span>
              <span className="text-xs font-medium text-gray-700">{g.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
