import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "문의하기",
  description: "일광교회에 문의하세요. 전화, 이메일, 문자로 연락 가능합니다.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHero label="Contact" title="문의하기" subtitle="궁금하신 점이 있으시면 언제든지 연락주세요" image="https://images.unsplash.com/photo-1542396601-dca920ea2807?w=1800&auto=format&fit=crop&q=80" />

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h2 className="font-nanum-extrabold text-xl sm:text-2xl text-gray-800 mb-5 sm:mb-6">연락처 정보</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { icon: "📞", label: "전화", value: "02-927-0691", href: "tel:02-927-0691" },
                { icon: "📧", label: "이메일", value: "ilkwang@ilkwang.or.kr", href: "mailto:ilkwang@ilkwang.or.kr" },
                { icon: "📍", label: "주소", value: "서울 성북구 동소문로 212-68" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-4 bg-[#E8F5E9] rounded-xl min-h-[60px] items-center">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-nanum-bold">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-nanum-bold text-[#2E7D32] hover:underline break-all">{item.value}</a>
                    ) : (
                      <p className="font-nanum-bold text-gray-800 break-keep">{item.value}</p>
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
