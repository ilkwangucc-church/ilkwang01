import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "갤러리",
  description: "일광교회 갤러리 - 예배, 행사, 교제 사진 모음",
};

// Unsplash 교회/예배/신앙 관련 이미지
const galleryImages = [
  { id: 1, title: "2025 성탄절 예배", src: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=500&q=70", category: "예배" },
  { id: 2, title: "추수감사주일", src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=70", category: "예배" },
  { id: 3, title: "청년부 수련회", src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=70", category: "행사" },
  { id: 4, title: "교회 봉사활동", src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&q=70", category: "봉사" },
  { id: 5, title: "찬양예배", src: "https://images.unsplash.com/photo-1520637836993-5730c1a53f8b?w=500&q=70", category: "예배" },
  { id: 6, title: "어린이 성탄발표회", src: "https://images.unsplash.com/photo-1547247153-b3e42ca9c8f5?w=500&q=70", category: "다음세대" },
  { id: 7, title: "교회 야유회", src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&q=70", category: "교제" },
  { id: 8, title: "주일 예배", src: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=500&q=70", category: "예배" },
  { id: 9, title: "선교 보고회", src: "https://images.unsplash.com/photo-1542397284385-6010376c5337?w=500&q=70", category: "선교" },
  { id: 10, title: "구역 성경공부", src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&q=70", category: "교육" },
  { id: 11, title: "새가족 환영예배", src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&q=70", category: "예배" },
  { id: 12, title: "교회 창립기념일", src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=500&q=70", category: "행사" },
];

const categories = ["전체", "예배", "행사", "교제", "다음세대", "봉사", "선교", "교육"];

export default function GalleryPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#FFC107] text-sm font-nanum-bold tracking-widest uppercase mb-2">Gallery</p>
          <h1 className="font-nanum-extrabold text-4xl md:text-5xl">갤러리</h1>
        </div>
      </div>

      {/* 서브메뉴 */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {[{ label: "공지사항", href: "/news" }, { label: "행사안내", href: "/news/events" }, { label: "갤러리", href: "/news/gallery" }].map((m, i) => (
            <Link key={m.label} href={m.href}
              className={`py-4 px-5 text-sm font-nanum-bold whitespace-nowrap border-b-2 ${i === 2 ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-gray-500 hover:text-[#2E7D32]"}`}>
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((c, i) => (
            <button key={c} className={`px-4 py-1.5 rounded-full text-sm font-nanum-bold transition-colors ${i === 0 ? "bg-[#2E7D32] text-white" : "bg-gray-100 text-gray-600 hover:bg-[#E8F5E9] hover:text-[#2E7D32]"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* 갤러리 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-3">
                  <span className="text-xs text-[#FFC107] font-nanum-bold">{img.category}</span>
                  <p className="text-white text-sm font-nanum-bold">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
