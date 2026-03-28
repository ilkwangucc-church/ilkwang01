import { Metadata } from "next";
import Link from "next/link";
import { Users, BookOpen, Bell, DollarSign, TrendingUp, Eye, MessageSquare, Calendar } from "lucide-react";

export const metadata: Metadata = { title: "관리자 대시보드 | 일광교회" };

const stats = [
  { label: "총 성도수", value: "342명", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "이번달 설교", value: "8편", icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
  { label: "미확인 공지", value: "3건", icon: Bell, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "이번달 헌금", value: "2,450만원", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
];

const recentNotices = [
  { title: "2024 부활절 연합예배 안내", date: "2024-03-25", views: 312 },
  { title: "봄 부흥성회 강사 프로필", date: "2024-03-20", views: 245 },
  { title: "청년부 수련회 참가 신청", date: "2024-03-18", views: 189 },
  { title: "소그룹 리더 모집 안내", date: "2024-03-15", views: 167 },
];

const recentMembers = [
  { name: "홍길동", email: "hong@email.com", role: "일반회원", joined: "2024-03-28" },
  { name: "김성도", email: "kim@email.com", role: "성도", joined: "2024-03-25" },
  { name: "이장로", email: "lee@email.com", role: "성도", joined: "2024-03-20" },
  { name: "박집사", email: "park@email.com", role: "부서관리자", joined: "2024-03-15" },
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
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{s.label}</p>
                <div className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 최근 공지사항 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">최근 공지사항</h2>
            <Link href="/admin/notices" className="text-xs text-[#2E7D32] hover:underline">전체보기</Link>
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

        {/* 최근 가입 회원 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">최근 가입 회원</h2>
            <Link href="/admin/members" className="text-xs text-[#2E7D32] hover:underline">전체보기</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentMembers.map((m, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] text-xs font-bold">
                    {m.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    m.role === "부서관리자" ? "bg-purple-100 text-purple-700" :
                    m.role === "성도" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>{m.role}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{m.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "공지 작성", href: "/admin/notices/new", icon: "📢" },
            { label: "설교 등록", href: "/admin/sermons/new", icon: "🎬" },
            { label: "성도 조회", href: "/admin/members", icon: "👥" },
            { label: "헌금 입력", href: "/admin/offerings/new", icon: "💰" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-2 bg-gray-50 hover:bg-[#E8F5E9] rounded-xl p-4 text-sm font-medium text-gray-700 hover:text-[#2E7D32] transition-colors"
            >
              <span className="text-xl">{q.icon}</span>
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
