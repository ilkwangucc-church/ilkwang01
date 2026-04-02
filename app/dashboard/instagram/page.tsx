import { Link2, ExternalLink } from "lucide-react";

const DEPT_INSTAGRAMS = [
  { dept: "일광교회 공식",   handle: "@ilkwang_church",   color: "from-purple-500 to-pink-500",    bg: "bg-purple-50",    followers: "1.2k", bio: "일광교회 공식 인스타그램",   url: "https://instagram.com/", posts: 248 },
  { dept: "청년부",          handle: "@ilkwang_youth",    color: "from-blue-500 to-purple-500",    bg: "bg-blue-50",      followers: "387",  bio: "일광교회 청년부 소식",       url: "https://instagram.com/", posts: 134 },
  { dept: "찬양팀",          handle: "@ilkwang_worship",  color: "from-amber-400 to-orange-500",   bg: "bg-amber-50",     followers: "256",  bio: "예배 찬양팀 이야기",         url: "https://instagram.com/", posts: 89 },
  { dept: "어린이부",        handle: "@ilkwang_kids",     color: "from-green-400 to-teal-500",     bg: "bg-green-50",     followers: "198",  bio: "어린이들의 믿음 이야기",     url: "https://instagram.com/", posts: 76 },
  { dept: "선교부",          handle: "@ilkwang_mission",  color: "from-red-400 to-rose-500",       bg: "bg-rose-50",      followers: "312",  bio: "세계 선교 소식",             url: "https://instagram.com/", posts: 167 },
  { dept: "청소년부",        handle: "@ilkwang_teen",     color: "from-indigo-500 to-blue-500",    bg: "bg-indigo-50",    followers: "143",  bio: "중·고등부 커뮤니티",         url: "https://instagram.com/", posts: 58 },
];

export default function Link2Page() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Link2 className="w-6 h-6 text-[#2E7D32]" /> 부서별 인스타그램
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">각 부서의 인스타그램에서 생생한 소식을 만나세요</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {DEPT_INSTAGRAMS.map((account) => (
          <a
            key={account.dept}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              {/* 아이콘 */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${account.color} flex items-center justify-center text-white shrink-0`}>
                <Link2 className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{account.dept}</p>
                <p className="text-sm text-gray-500">{account.handle}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#2E7D32] transition-colors shrink-0" />
            </div>
            <p className="text-sm text-gray-600 mb-3">{account.bio}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span><strong className="text-gray-900">{account.posts}</strong> 게시물</span>
              <span><strong className="text-gray-900">{account.followers}</strong> 팔로워</span>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#C8E6C9] text-center">
        <Link2 className="w-8 h-8 text-[#2E7D32] mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-800 mb-1">부서 계정 추가 요청</p>
        <p className="text-xs text-gray-500 mb-3">담당 관리자에게 인스타그램 계정 등록을 요청하세요</p>
        <a
          href="/dashboard/counseling"
          className="inline-flex items-center gap-1.5 text-sm text-[#2E7D32] font-medium hover:underline"
        >
          관리자에게 문의하기 →
        </a>
      </div>
    </div>
  );
}
