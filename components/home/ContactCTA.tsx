import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#F9A825] to-[#FFD54F]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-nanum-extrabold text-3xl md:text-4xl text-gray-900 mb-4">
              일광교회와 함께하세요
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              교회 방문이 처음이시거나 궁금하신 점이 있으시면 언제든지 연락해 주세요.
              따뜻하게 맞이하겠습니다.
            </p>
            <div className="flex gap-3">
              <Link
                href="/about/location"
                className="px-6 py-3 bg-[#2E7D32] text-white font-nanum-bold rounded-full hover:bg-[#1B5E20] transition-colors"
              >
                오시는 길
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-800 font-nanum-bold rounded-full hover:bg-gray-50 transition-colors"
              >
                문의하기
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Phone, label: "전화", value: "02-927-0691", href: "tel:02-927-0691" },
              { icon: MapPin, label: "주소", value: "서울 성북구 길음동 (길음역 인근)", href: "/about/location" },
              { icon: Mail, label: "이메일", value: "ilkwang@ilkwang.or.kr", href: "mailto:ilkwang@ilkwang.or.kr" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 bg-white/70 backdrop-blur rounded-xl p-4 hover:bg-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-nanum-bold">{item.label}</p>
                  <p className="text-gray-800 font-nanum-bold">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
