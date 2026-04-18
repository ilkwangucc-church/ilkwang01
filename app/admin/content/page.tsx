import { Metadata } from "next";
import { Edit, Save } from "lucide-react";

export const metadata: Metadata = { title: "콘텐츠 관리 | 관리자" };

const sections = [
  {
    key: "hero",
    label: "메인 히어로 섹션",
    fields: [
      { name: "hero_title", label: "메인 제목", value: "행복과 영원으로 초대하는 교회" },
      { name: "hero_subtitle", label: "부제목", value: "일광교회에 오신 것을 환영합니다" },
      { name: "hero_cta", label: "CTA 버튼 텍스트", value: "예배 안내 보기" },
    ],
  },
  {
    key: "about",
    label: "교회소개 섹션",
    fields: [
      { name: "about_title", label: "소개 제목", value: "일광교회를 소개합니다" },
      { name: "about_desc", label: "소개 본문", value: "1971년 설립된 일광교회는 성북구 돈암동에 위치한..." },
      { name: "about_quote", label: "강조 인용구", value: "하나님 중심 · 성경 중심 · 교회 중심" },
    ],
  },
  {
    key: "contact",
    label: "연락처 정보",
    fields: [
      { name: "phone", label: "전화번호", value: "02-927-0691" },
      { name: "address", label: "주소", value: "서울 성북구 동소문로 212-68" },
      { name: "email", label: "이메일", value: "ilkwang@ilkwang.or.kr" },
    ],
  },
  {
    key: "worship",
    label: "예배 시간",
    fields: [
      { name: "worship_1", label: "1부 예배", value: "주일 오전 9:30" },
      { name: "worship_2", label: "2부 예배", value: "주일 오전 11:00" },
      { name: "worship_3", label: "오후예배", value: "주일 오후 1:30" },
      { name: "worship_dawn", label: "새벽기도회", value: "매일 오전 5:00" },
    ],
  },
];

export default function ContentAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">콘텐츠 관리 (CMS)</h1>
        <p className="text-gray-500 text-sm mt-0.5">사이트 텍스트와 정보를 직접 수정합니다</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        Supabase 연동 후 실시간 저장 기능이 활성화됩니다. 현재는 미리보기 모드입니다.
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.key} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">{section.label}</h2>
              <button className="flex items-center gap-1.5 text-sm text-[#2E7D32] hover:underline font-medium">
                <Save className="w-4 h-4" />
                저장
              </button>
            </div>
            <div className="p-6 space-y-4">
              {section.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">{field.label}</label>
                  {field.value.length > 60 ? (
                    <textarea
                      defaultValue={field.value}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
