import { Metadata } from "next";
import Link from "next/link";
import { Play, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "설교영상",
  description: "일광교회 설교 영상 아카이브 — 유튜브 채널 ilwangucc",
};

// 실제 운영 시 Supabase DB 또는 YouTube API 연동으로 교체
const sermons = [
  { id: 1, title: "부활의 증인으로 살라", preacher: "담임목사", date: "2024-03-31", category: "주일예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "고전 15:1-11" },
  { id: 2, title: "십자가 앞에 서라", preacher: "담임목사", date: "2024-03-24", category: "주일예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "갈 2:20" },
  { id: 3, title: "기도의 능력", preacher: "담임목사", date: "2024-03-20", category: "수요예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "약 5:13-18" },
  { id: 4, title: "주님을 닮아가는 삶", preacher: "담임목사", date: "2024-03-17", category: "주일예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "빌 2:1-11" },
  { id: 5, title: "성령 충만한 교회", preacher: "담임목사", date: "2024-03-13", category: "수요예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "행 2:1-13" },
  { id: 6, title: "말씀 위에 세운 믿음", preacher: "담임목사", date: "2024-03-10", category: "주일예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "마 7:24-27" },
  { id: 7, title: "하나님의 선하심을 믿으라", preacher: "담임목사", date: "2024-03-06", category: "수요예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "롬 8:28" },
  { id: 8, title: "새 언약의 백성", preacher: "담임목사", date: "2024-03-03", category: "주일예배", youtube: "https://www.youtube.com/@ilkwangucc", scripture: "렘 31:31-34" },
];

const categories = ["전체", "주일예배", "수요예배", "특별예배", "새벽기도"];

export default function SermonsPage() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <section className="bg-[#2E7D32] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-3 tracking-widest uppercase">Sermons</p>
          <h1 className="text-4xl font-bold mb-4">설교영상</h1>
          <p className="text-green-100 text-lg">
            하나님의 말씀, 언제 어디서나 다시 들을 수 있습니다
          </p>
          <a
            href="https://www.youtube.com/@ilkwangucc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white text-[#2E7D32] rounded-full font-semibold hover:bg-green-50 transition-colors text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            유튜브 채널 바로가기
          </a>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-8 bg-white border-b sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                cat === "전체"
                  ? "bg-[#2E7D32] text-white"
                  : "border border-gray-300 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 설교 목록 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {sermons.map((s) => (
              <a
                key={s.id}
                href={s.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                {/* 썸네일 영역 */}
                <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] opacity-80" />
                  <div className="relative z-10 text-center text-white p-4">
                    <p className="text-xs text-green-200 mb-1">{s.scripture}</p>
                    <p className="font-bold text-lg">{s.title}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                  </div>
                </div>
                {/* 정보 */}
                <div className="p-4">
                  <span className="inline-block text-xs px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full mb-2">{s.category}</span>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors">{s.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{s.preacher}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* 더보기 */}
          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@ilkwangucc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#2E7D32] text-[#2E7D32] rounded-full font-semibold hover:bg-[#2E7D32] hover:text-white transition-colors"
            >
              유튜브에서 더보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
