import Link from "next/link";
import { Phone, MapPin, Mail, Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">일</div>
            <div>
              <p className="text-xs text-gray-400">행복과 영원으로 초대하는</p>
              <p className="font-bold text-white text-lg leading-tight">일광교회</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            대한예수교장로회(합동) 소속 교회로<br />
            1971년 설립된 성북구 도암동 지역 교회입니다.<br />
            하나님 중심 · 성경 중심 · 교회 중심
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">연락처</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              <a href="tel:02-927-0691" className="hover:text-white">02-927-0691</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>서울 성북구 길음동<br />(지하철 4호선 길음역 인근)</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500" />
              <a href="mailto:ilkwang@ilkwang.or.kr" className="hover:text-white">ilkwang@ilkwang.or.kr</a>
            </li>
            <li className="flex items-center gap-2">
              <Video className="w-4 h-4 text-green-500" />
              <a href="https://www.youtube.com/@ilwangucc" target="_blank" rel="noopener noreferrer" className="hover:text-white">유튜브 채널</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">예배 안내</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li className="flex justify-between"><span>주일 1부 예배</span><span className="text-white">오전 9:30</span></li>
            <li className="flex justify-between"><span>주일 2부 예배</span><span className="text-white">오전 11:00</span></li>
            <li className="flex justify-between"><span>주일 3부 예배</span><span className="text-white">오후 1:30</span></li>
            <li className="flex justify-between"><span>새벽기도회</span><span className="text-white">매일 오전 5:00</span></li>
            <li className="flex justify-between"><span>수요오전기도회</span><span className="text-white">수 오전 10:30</span></li>
            <li className="flex justify-between"><span>수요성경공부</span><span className="text-white">수 오후 8:00</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} 일광교회. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/admin" className="hover:text-gray-300">관리자</Link>
            <Link href="/contact" className="hover:text-gray-300">문의하기</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
