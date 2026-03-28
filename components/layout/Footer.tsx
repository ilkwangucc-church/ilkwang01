import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import Logo from "./Logo";

const quickLinks = [
  { label: "인사말", href: "/about" },
  { label: "교회역사", href: "/about/history" },
  { label: "예배안내", href: "/worship" },
  { label: "설교영상", href: "/worship/sermons" },
  { label: "공지사항", href: "/news" },
  { label: "행사안내", href: "/news/events" },
];

const usefulLinks = [
  { label: "온라인 헌금", href: "/offering" },
  { label: "오시는길", href: "/about/location" },
  { label: "커뮤니티", href: "/blog" },
  { label: "나눔게시판", href: "/resources/board" },
  { label: "문의하기", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Logo + About */}
        <div className="md:col-span-1">
          <div className="mb-5">
            <Logo size="md" variant="dark" />
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            대한예수교장로회(합동) 소속<br />
            1971년 설립된 서울 성북구 일광교회
          </p>
          <p className="text-sm font-bold text-[#1a2744]">02-927-0691</p>
        </div>

        {/* Col 2: Worship Times */}
        <div>
          <h4 className="font-black text-[#1a2744] text-sm uppercase tracking-widest mb-5">
            주일 예배
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li className="flex justify-between">
              <span>1부 예배</span><span className="text-[#2E7D32] font-semibold">09:30</span>
            </li>
            <li className="flex justify-between">
              <span>2부 예배</span><span className="text-[#2E7D32] font-semibold">11:00</span>
            </li>
            <li className="flex justify-between">
              <span>3부 예배</span><span className="text-[#2E7D32] font-semibold">13:30</span>
            </li>
            <li className="flex justify-between">
              <span>새벽기도</span><span className="text-[#2E7D32] font-semibold">매일 05:00</span>
            </li>
            <li className="flex justify-between">
              <span>수요기도회</span><span className="text-[#2E7D32] font-semibold">수 10:30</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <h4 className="font-black text-[#1a2744] text-sm uppercase tracking-widest mb-5">
            빠른 이동
          </h4>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-500 hover:text-[#2E7D32] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact + CTA */}
        <div>
          <h4 className="font-black text-[#1a2744] text-sm uppercase tracking-widest mb-5">
            연락처
          </h4>
          <ul className="space-y-3 text-sm text-gray-500 mb-8">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              서울 성북구 길음동<br />(4호선 길음역 인근)
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#2E7D32]" />
              <a href="tel:02-927-0691" className="hover:text-[#2E7D32]">02-927-0691</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#2E7D32]" />
              <a href="mailto:ilkwang@ilkwang.or.kr" className="hover:text-[#2E7D32]">ilkwang@ilkwang.or.kr</a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-4 h-4 text-[#2E7D32] shrink-0">▶</span>
              <a
                href="https://www.youtube.com/@ilkwangucc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E7D32]"
              >
                유튜브 채널
              </a>
            </li>
          </ul>

          <div>
            <p className="text-[#1a2744] font-black text-lg leading-tight mb-3">
              하나님 안에서<br />새 삶을 시작하세요
            </p>
            <Link
              href="/offering"
              className="inline-block px-5 py-2.5 bg-[#2E7D32] text-white text-sm font-bold rounded hover:bg-[#1B5E20] transition-colors"
            >
              온라인 헌금
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-[#F8FAF8]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <p>© {new Date().getFullYear()} 일광교회. All rights reserved.</p>
          <div className="flex gap-5">
            {usefulLinks.slice(-2).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gray-600">
                {l.label}
              </Link>
            ))}
            <Link href="/admin" className="hover:text-gray-600">관리자</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
