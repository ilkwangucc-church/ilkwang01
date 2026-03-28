import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오시는길",
  description: "일광교회 오시는길 - 서울 성북구 동소문로 212-68, 지하철 4호선 길음역",
};

export default function LocationPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#F9A825] text-sm font-nanum-bold tracking-widest uppercase mb-2">Location</p>
          <h1 className="font-nanum-extrabold text-4xl md:text-5xl">오시는 길</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 지도 */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-12 aspect-video bg-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.8!2d127.0267!3d37.5935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbcf0!2z7ISc7Jq47Yq567OE7IucIOyEseuCqOq1rCDrtoTshozroZzroZwgMjEyLTY4!5e0!3m2!1sko!2skr!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="일광교회 지도"
          />
        </div>

        {/* 주소/연락처 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#E8F5E9] rounded-2xl p-6 space-y-4">
            <h3 className="font-nanum-extrabold text-xl text-gray-800">📍 주소</h3>
            <p className="text-gray-700 leading-relaxed">
              서울특별시 성북구 동소문로 212-68<br />
              <span className="text-gray-500 text-sm">(우편번호: 02723)</span>
            </p>
            <h3 className="font-nanum-extrabold text-xl text-gray-800">📞 연락처</h3>
            <p className="text-gray-700">
              <a href="tel:02-927-0691" className="text-[#2E7D32] font-nanum-bold hover:underline">02-927-0691</a>
            </p>
          </div>

          <div className="bg-[#FFFDE7] rounded-2xl p-6 space-y-4">
            <h3 className="font-nanum-extrabold text-xl text-gray-800">🚇 대중교통</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-nanum-bold text-[#2E7D32]">지하철</p>
                <p>4호선 길음역 하차 후 도보 10분</p>
              </div>
              <div>
                <p className="font-nanum-bold text-[#2E7D32]">버스</p>
                <p>간선: 152, 162, 171<br />지선: 1111, 2112, 7212</p>
              </div>
            </div>
          </div>
        </div>

        {/* 예배 시간 */}
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-8 text-white">
          <h3 className="font-nanum-extrabold text-2xl mb-6 text-center">예배 시간 안내</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "주일 1부 예배", time: "오전 9:30" },
              { name: "주일 2부 예배", time: "오전 11:00" },
              { name: "주일 3부 예배", time: "오후 1:30" },
              { name: "새벽기도회", time: "매일 오전 5:00" },
              { name: "수요오전기도회", time: "수요일 오전 10:30" },
              { name: "수요성경공부", time: "수요일 오후 8:00" },
            ].map((s) => (
              <div key={s.name} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-green-200 text-xs mb-1">{s.name}</p>
                <p className="font-nanum-extrabold text-[#F9A825]">{s.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
