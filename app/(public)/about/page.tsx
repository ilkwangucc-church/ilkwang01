import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "교회소개",
  description: "일광교회를 소개합니다. 1971년 설립, 대한예수교장로회(합동) 소속 서울 성북구 교회",
};

const submenu = [
  { label: "인사말", href: "/about" },
  { label: "소개&비전", href: "/about/vision" },
  { label: "교역자", href: "/about/pastor" },
  { label: "예배안내", href: "/about/worship-info" },
  { label: "오시는길", href: "/about/location" },
];

export default function AboutPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#FFC107] text-sm font-nanum-bold tracking-widest uppercase mb-2">Church Introduction</p>
          <h1 className="font-nanum-extrabold text-4xl md:text-5xl">교회소개</h1>
        </div>
      </div>

      {/* 서브메뉴 */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {submenu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="py-4 px-5 text-sm font-nanum-bold whitespace-nowrap border-b-2 border-[#2E7D32] text-[#2E7D32]"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 인사말 본문 */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-nanum-extrabold text-3xl text-[#2E7D32] mb-10 text-center">담임목사 인사말</h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* 목사님 사진 */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                alt="담임목사 신점일"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#FFC107] text-gray-900 rounded-xl px-4 py-2 shadow-lg">
              <p className="font-nanum-extrabold text-sm">담임목사</p>
              <p className="font-nanum-extrabold text-lg">신점일 목사</p>
            </div>
          </div>

          {/* 인사말 텍스트 */}
          <div className="space-y-5 text-gray-700 leading-loose">
            <h3 className="font-nanum-extrabold text-2xl text-gray-800">"행복과 영원으로 초대하는 교회"</h3>

            <p>
              사람들의 소원은 어린이나 어른이나 <strong className="text-[#2E7D32]">'행복'</strong>입니다.
              그러나 어떻게 해야 행복할 수 있냐고 물으면 답이 없어 보입니다.
            </p>
            <p>
              많이 배우면 행복할까? 많이 가지면 행복할까?<br />
              많은 것을 누리면 행복할까?
            </p>
            <p className="font-nanum-extrabold text-[#2E7D32] text-lg">여기 행복의 길이 있습니다.</p>

            <p>
              사람들은 <strong className="text-[#2E7D32]">'영원'</strong>을 소망합니다.
              천국에서 영원히 살고 싶은 마음으로 선행을 하기도 하고
              때로 고행을 하기도 합니다. 진짜 이것들이 영원히 살게 해 줄까요?
            </p>
            <p className="font-nanum-extrabold text-[#2E7D32] text-lg">여기 영원히 사는 길이 있습니다.</p>

            <blockquote className="border-l-4 border-[#FFC107] pl-4 py-2 bg-[#FFFDE7] rounded-r-lg">
              <p className="font-nanum-extrabold text-xl text-gray-800">
                "내가 곧 길이요, 진리요, 생명이니 ···"
              </p>
              <p className="text-[#2E7D32] text-sm mt-1">요한복음 14:6</p>
            </blockquote>

            <p>
              일광교회가 여러분 곁에서 행복과 영원으로 초대하겠습니다.
            </p>

            <div className="pt-4 text-right">
              <p className="text-gray-500 text-sm">일광교회 담임목사</p>
              <p className="font-nanum-extrabold text-xl text-gray-800">신 점 일</p>
            </div>
          </div>
        </div>
      </div>

      {/* 교회 사진 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-nanum-extrabold text-2xl text-center text-gray-800 mb-8">일광교회 전경</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&q=70",
              "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&q=70",
              "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=70",
              "https://images.unsplash.com/photo-1520637836993-5730c1a53f8b?w=400&q=70",
              "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=70",
              "https://images.unsplash.com/photo-1542396601-dca920ea2807?w=400&q=70",
            ].map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden aspect-video shadow-sm hover:shadow-md transition-shadow">
                <img src={src} alt={`일광교회 ${i+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 빠른 이동 */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-4">
        <Link href="/about/vision" className="flex items-center gap-4 p-6 rounded-2xl bg-[#E8F5E9] hover:bg-[#C8E6C9] transition-colors group">
          <div className="text-3xl">🌱</div>
          <div>
            <h4 className="font-nanum-extrabold text-gray-800">소개 &amp; 비전</h4>
            <p className="text-gray-500 text-sm">일광교회의 사명과 비전을 소개합니다</p>
          </div>
        </Link>
        <Link href="/about/location" className="flex items-center gap-4 p-6 rounded-2xl bg-[#FFFDE7] hover:bg-[#FFF9C4] transition-colors group">
          <div className="text-3xl">📍</div>
          <div>
            <h4 className="font-nanum-extrabold text-gray-800">오시는 길</h4>
            <p className="text-gray-500 text-sm">서울 성북구 동소문로 212-68</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
