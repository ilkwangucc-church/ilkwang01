import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "일광교회에 문의하세요. 전화, 이메일, 문자로 연락 가능합니다.",
};

export default function ContactPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#FFC107] text-sm font-nanum-bold tracking-widest uppercase mb-2">Contact</p>
          <h1 className="font-nanum-extrabold text-4xl md:text-5xl">문의하기</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-nanum-extrabold text-2xl text-gray-800 mb-6">연락처 정보</h2>
            <div className="space-y-4">
              {[
                { icon: "📞", label: "전화", value: "02-927-0691", href: "tel:02-927-0691" },
                { icon: "📧", label: "이메일", value: "ilkwang@ilkwang.or.kr", href: "mailto:ilkwang@ilkwang.or.kr" },
                { icon: "📍", label: "주소", value: "서울 성북구 동소문로 212-68" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-4 bg-[#E8F5E9] rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 font-nanum-bold">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-nanum-bold text-[#2E7D32] hover:underline">{item.value}</a>
                    ) : (
                      <p className="font-nanum-bold text-gray-800">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
