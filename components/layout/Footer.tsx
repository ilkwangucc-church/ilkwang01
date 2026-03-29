import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import Logo from "./Logo";

const aboutLinks = [
  { label: "인사말", href: "/about" },
  { label: "교회역사", href: "/about/history" },
  { label: "섬기는 사람들", href: "/about/pastor" },
  { label: "교회비전", href: "/about/vision" },
  { label: "오시는길", href: "/about/location" },
];

const worshipLinks = [
  { label: "예배안내", href: "/worship" },
  { label: "설교영상", href: "/worship/sermons" },
];

const newsLinks = [
  { label: "공지사항", href: "/news" },
  { label: "행사안내", href: "/news/events" },
  { label: "갤러리", href: "/news/gallery" },
];

const youthLinks = [
  { label: "주일학교", href: "/youth/sunday" },
  { label: "청년부", href: "/youth/young-adults" },
  { label: "중고등부", href: "/youth/teens" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a2744] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">

        {/* Col 1: Logo + About + Contact */}
        <div className="md:w-64 shrink-0">
          <div className="mb-2">
            <Logo size="md" variant="light" />
          </div>
          <p className="text-sm text-gray-400 leading-tight mb-5">
            대한예수교장로회(합동) 소속<br />
            1971년 설립된 서울 성북구 일광교회
          </p>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#6dbf73] shrink-0 mt-0.5" />
              <span>서울 성북구 길음동<br />(4호선 길음역 인근)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#6dbf73] shrink-0" />
              <a href="tel:02-927-0691" className="hover:text-white">02-927-0691</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#6dbf73] shrink-0" />
              <a href="mailto:ilkwang@ilkwang.or.kr" className="hover:text-white">ilkwang@ilkwang.or.kr</a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-4 h-4 text-[#6dbf73] shrink-0 flex items-center justify-center text-xs">▶</span>
              <a
                href="https://www.youtube.com/@ilkwangucc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                유튜브 채널
              </a>
            </li>
          </ul>
        </div>

        {/* Nav cols: 교회소개 / 예배말씀 / 다음세대+커뮤니티 / 교회소식 */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-[120px] ml-auto pr-[30px]">

          {/* 교회소개 */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-5">
              교회소개
            </h4>
            <ul className="space-y-2.5 text-sm">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 예배/말씀 */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-5">
              예배/말씀
            </h4>
            <ul className="space-y-2.5 text-sm">
              {worshipLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 다음세대 + 커뮤니티 */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-5">
              다음세대
            </h4>
            <ul className="space-y-2.5 text-sm mb-7">
              {youthLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-5">
              커뮤니티
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                  블로그
                </Link>
              </li>
            </ul>
          </div>

          {/* 교회소식 */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-5">
              교회소식
            </h4>
            <ul className="space-y-2.5 text-sm">
              {newsLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} 일광교회. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:text-gray-300">문의하기</Link>
            <Link href="/admin" className="hover:text-gray-300">관리자</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
