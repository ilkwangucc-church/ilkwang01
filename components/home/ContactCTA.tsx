import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-[#F8FAF8] rounded-2xl p-10 text-center shadow-sm">
          <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            VISIT US
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-[#1a2744]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="w-5 h-5 text-[#2E7D32]" />
              주일 오전 9:30 · 11:00 · 오후 1:30
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="w-5 h-5 text-[#2E7D32]" />
              서울 성북구 동소문로 212-68
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#1a2744] mb-2">
            일광교회로 오세요
          </h2>
          <p className="text-gray-500 mb-8">
            처음 방문하시는 분도 환영합니다. 언제든지 문을 두드려 주세요.
          </p>
          <a
            href="tel:02-927-0691"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors text-base tracking-wide"
          >
            <Phone className="w-5 h-5" />
            02-927-0691
          </a>
        </div>
      </div>
    </section>
  );
}
