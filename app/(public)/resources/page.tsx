import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Download, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "교재자료",
  description: "일광교회 각 부서 교재 및 학습 자료 다운로드",
};

const materials = [
  {
    category: "주일 설교 요약",
    items: [
      { title: "2024년 1분기 설교 요약집", date: "2024-03-31", type: "PDF", size: "2.1 MB" },
      { title: "2023년 연간 설교 요약집", date: "2024-01-01", type: "PDF", size: "8.5 MB" },
    ],
  },
  {
    category: "소그룹 교재",
    items: [
      { title: "2024 상반기 소그룹 교재 (1과~10과)", date: "2024-02-01", type: "PDF", size: "3.4 MB" },
      { title: "성경 핵심 교리 12강", date: "2023-09-01", type: "PDF", size: "1.8 MB" },
      { title: "새가족 안내 교재", date: "2023-06-01", type: "PDF", size: "0.9 MB" },
    ],
  },
  {
    category: "주일학교 교재",
    items: [
      { title: "2024년 유치부 공과 (1~4월)", date: "2024-01-05", type: "PDF", size: "4.2 MB" },
      { title: "2024년 초등부 공과 (1~4월)", date: "2024-01-05", type: "PDF", size: "5.1 MB" },
      { title: "2024년 중고등부 공과 (1~4월)", date: "2024-01-05", type: "PDF", size: "3.7 MB" },
    ],
  },
  {
    category: "성경공부",
    items: [
      { title: "창세기 강해 스터디 노트", date: "2024-01-10", type: "PDF", size: "6.0 MB" },
      { title: "요한복음 12주 강해", date: "2023-10-01", type: "PDF", size: "4.8 MB" },
      { title: "로마서 개론 (전도사 강의)", date: "2023-07-01", type: "PDF", size: "3.2 MB" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <section className="bg-[#2E7D32] text-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-3 tracking-widest uppercase">Resources</p>
          <h1 className="text-4xl font-bold mb-4">교재자료</h1>
          <p className="text-green-100 text-lg">
            각 부서 교재와 성경공부 자료를 다운로드하세요
          </p>
        </div>
      </section>

      {/* 서브 메뉴 */}
      <section className="bg-white border-b py-4">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-4 justify-center">
          <Link href="/resources" className="px-5 py-2 rounded-full bg-[#2E7D32] text-white text-sm font-medium">교재자료</Link>
          <Link href="/resources/board" className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32] text-sm font-medium transition-colors">나눔게시판</Link>
        </div>
      </section>

      {/* 자료 목록 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 space-y-10">
          {materials.map((section) => (
            <div key={section.category}>
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <BookOpen className="w-5 h-5 text-[#2E7D32]" />
                {section.category}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 group-hover:text-[#2E7D32] transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.date} · {item.type} · {item.size}</p>
                      </div>
                    </div>
                    <button className="shrink-0 ml-4 flex items-center gap-1 text-sm text-[#2E7D32] font-medium hover:underline">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">다운로드</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 안내 */}
        <div className="max-w-[1400px] mx-auto px-4 mt-10">
          <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl p-5 text-sm text-gray-700">
            <strong className="text-[#2E7D32]">자료 요청 안내:</strong> 목록에 없는 자료가 필요하시면{" "}
            <Link href="/contact" className="text-[#2E7D32] underline">문의하기</Link>를 통해 연락 주시거나,
            교회 사무실(02-927-0691)로 문의해 주세요.
          </div>
        </div>
      </section>
    </div>
  );
}
