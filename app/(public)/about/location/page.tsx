import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { ABOUT_NAV } from "@/components/ui/StickySubNav";

export const metadata: Metadata = {
  title: "오시는길",
  description: "일광교회 오시는길 - 서울 성북구 동소문로 212-68, 지하철 4호선 길음역",
};

export default function LocationPage() {
  return (
    <div>
      <PageHero label="Location" title="오시는 길" subtitle="서울특별시 성북구 동소문로 212-68 — 4호선 길음역 인근" image="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1800&auto=format&fit=crop&q=80" />
      <StickySubNav items={ABOUT_NAV} />

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* 지도 */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-8 sm:mb-12 aspect-video bg-gray-200">
          <iframe
            src="https://maps.google.com/maps?q=서울특별시+성북구+동소문로+212-68&hl=ko&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="일광교회 지도"
          />
        </div>

        {/* 주소/연락처 */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-[#E8F5E9] rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="font-nanum-extrabold text-lg sm:text-xl text-gray-800">📍 주소</h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-keep">
              서울특별시 성북구 동소문로 212-68<br />
              <span className="text-gray-500 text-sm">(우편번호: 02723)</span>
            </p>
            <h3 className="font-nanum-extrabold text-lg sm:text-xl text-gray-800">📞 연락처</h3>
            <p className="text-gray-700">
              <a href="tel:02-927-0691" className="text-[#2E7D32] font-nanum-bold hover:underline text-lg py-2.5 inline-block">02-927-0691</a>
            </p>
          </div>

          <div className="bg-[#FFFDE7] rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="font-nanum-extrabold text-lg sm:text-xl text-gray-800">🚇 대중교통</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-nanum-bold text-[#2E7D32]">지하철</p>
                <p className="break-keep">4호선 길음역 하차 후 도보 10분</p>
              </div>
              <div>
                <p className="font-nanum-bold text-[#2E7D32]">버스</p>
                <p>간선: 152, 162, 171<br />지선: 1111, 2112, 7212</p>
              </div>
            </div>
          </div>
        </div>

        {/* 예배 시간 */}
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 sm:p-8 text-white">
          <h3 className="font-nanum-extrabold text-xl sm:text-2xl mb-4 sm:mb-6 text-center">예배 시간 안내</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: "주일 1부 예배", time: "오전 9:30" },
              { name: "주일 2부 예배", time: "오전 11:00" },
              { name: "주일 3부 예배", time: "오후 1:30" },
              { name: "새벽기도회", time: "매일 오전 5:00" },
              { name: "수요오전기도회", time: "수요일 오전 10:30" },
              { name: "수요성경공부", time: "수요일 오후 8:00" },
            ].map((s) => (
              <div key={s.name} className="bg-white/10 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-green-200 text-xs mb-1 break-keep">{s.name}</p>
                <p className="font-nanum-extrabold text-[#FFC107] text-sm sm:text-base">{s.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
