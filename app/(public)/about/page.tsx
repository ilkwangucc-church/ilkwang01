import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "인사말 | 일광교회",
  description: "일광교회 담임목사 신점일 목사의 인사말과 약력을 소개합니다.",
};

const submenu = [
  { label: "인사말",   href: "/about" },
  { label: "소개&비전", href: "/about/vision" },
  { label: "섬기는 사람들", href: "/about/pastor" },
  { label: "예배안내", href: "/about/worship-info" },
  { label: "오시는길", href: "/about/location" },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero label="Greeting" title="담임목사 인사말" subtitle="행복과 영원으로 초대하는 일광교회" image="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1800&auto=format&fit=crop&q=80" />

      {/* 서브메뉴 */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto">
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

      {/* ── 인사말 본문 ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-[2fr_3fr] gap-12 xl:gap-20 items-start">

          {/* 목사님 사진 */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] bg-gray-100 relative">
              <Image
                src="/pastor.jpg"
                alt="담임목사 신점일"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 인사말 텍스트 — 우측 정렬 */}
          <div className="space-y-5 text-gray-700 leading-loose text-right">
            <h3 className="font-nanum-extrabold text-2xl text-gray-800">
              "행복과 영원으로 초대하는 교회"
            </h3>

            <p>
              사람들의 소원은 어린이나 어른이나{" "}
              <strong className="text-[#2E7D32]">'행복'</strong>입니다.
              그러나 어떻게 해야 행복할 수 있냐고 물으면 답이 없어 보입니다.
            </p>
            <p>
              많이 배우면 행복할까? 많이 가지면 행복할까?<br />
              많은 것을 누리면 행복할까?
            </p>
            <p className="font-nanum-extrabold text-[#2E7D32] text-lg">
              여기 행복의 길이 있습니다.
            </p>

            <p>
              사람들은 <strong className="text-[#2E7D32]">'영원'</strong>을 소망합니다.
              천국에서 영원히 살고 싶은 마음으로 선행을 하기도 하고
              때로 고행을 하기도 합니다. 진짜 이것들이 영원히 살게 해 줄까요?
            </p>
            <p className="font-nanum-extrabold text-[#2E7D32] text-lg">
              여기 영원히 사는 길이 있습니다.
            </p>

            <blockquote className="border-r-4 border-l-0 border-[#FFC107] pr-4 pl-0 py-2 bg-[#FFFDE7] rounded-l-lg text-right">
              <p className="font-nanum-extrabold text-xl text-gray-800">
                "내가 곧 길이요, 진리요, 생명이니 ···"
              </p>
              <p className="text-[#2E7D32] text-sm mt-1">요한복음 14:6</p>
            </blockquote>

            <p>
              일광교회가 여러분 곁에서 행복과 영원으로 초대하겠습니다.
            </p>

            <div className="pt-4">
              <p className="text-gray-500 text-sm">일광교회 담임목사</p>
              <p className="font-nanum-extrabold text-2xl text-gray-800">신 점 일</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 학력 및 경력 ── */}
      <div className="bg-[#F8FAF8] py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-nanum-extrabold text-2xl text-center text-gray-800 mb-10">
            학력 및 경력
          </h2>
          <div className="grid md:grid-cols-2 gap-8 xl:gap-16">
            {/* 학력 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-nanum-extrabold text-[#2E7D32] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs font-bold">학</span>
                학력
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] mt-0.5">▸</span>
                  총신대학교 신학과 졸업 (B.A.)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] mt-0.5">▸</span>
                  총신대학교 신학대학원 졸업 (M.Div.)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] mt-0.5">▸</span>
                  합동신학대학원대학교 목회학 박사 수료 (D.Min.)
                </li>
              </ul>
            </div>
            {/* 경력 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-nanum-extrabold text-[#2E7D32] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs font-bold">경</span>
                경력
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">▸</span>
                  전) 서울동노회 청년부 연합 수련회 강사
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">▸</span>
                  전) 합동 총회 국내선교부 협력 목사
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] mt-0.5">▸</span>
                  현) 일광교회 담임목사
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] mt-0.5">▸</span>
                  현) 성북노회 임원
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
