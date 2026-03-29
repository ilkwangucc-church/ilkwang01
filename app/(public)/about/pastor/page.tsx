import { Metadata } from "next";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "섬기는 사람들 | 일광교회",
  description: "일광교회를 함께 섬기는 교역자 및 직원을 소개합니다.",
};

const submenu = [
  { label: "인사말",       href: "/about" },
  { label: "소개&비전",    href: "/about/vision" },
  { label: "섬기는 사람들", href: "/about/pastor" },
  { label: "예배안내",     href: "/about/worship-info" },
  { label: "오시는길",     href: "/about/location" },
];

// 8개 빈 카드 (관리자에서 채울 예정)
const staffSlots = Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }));

export default function PastorPage() {
  return (
    <div>
      <PageHero label="Our Team" title="섬기는 사람들" subtitle="일광교회를 함께 섬기는 교역자 및 직원을 소개합니다" image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&auto=format&fit=crop&q=80" />

      {/* 서브메뉴 */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto">
          {submenu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`py-4 px-5 text-sm font-nanum-bold whitespace-nowrap border-b-2 transition-colors ${
                m.href === "/about/pastor"
                  ? "border-[#2E7D32] text-[#2E7D32]"
                  : "border-transparent text-gray-500 hover:text-[#2E7D32]"
              }`}
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 직원 소개 그리드 */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-center text-gray-500 mb-12">
          일광교회를 함께 섬기는 교역자 및 직원을 소개합니다.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {staffSlots.map(({ id }) => (
            <div
              key={id}
              className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-dashed border-gray-200 hover:border-[#2E7D32] hover:shadow-md transition-all"
            >
              {/* 사진 자리 */}
              <div className="w-24 h-24 rounded-full bg-[#F8FAF8] border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <UserCircle2 className="w-12 h-12 text-gray-300" />
              </div>

              {/* 이름 자리 */}
              <div className="h-4 w-20 bg-gray-100 rounded-full mb-2" />

              {/* 직책 자리 */}
              <div className="h-3 w-16 bg-gray-100 rounded-full mb-1" />
              <div className="h-3 w-12 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          * 직원 정보는 관리자 페이지에서 등록할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
