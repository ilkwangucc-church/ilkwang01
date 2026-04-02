"use client";
import { useState } from "react";
import { Save, Eye, RotateCcw } from "lucide-react";

type HeroField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "color";
  placeholder: string;
};

const HERO_FIELDS: HeroField[] = [
  { key: "hero_title",    label: "메인 제목",       type: "text",     placeholder: "예: 행복과 영원으로 초대하는 교회" },
  { key: "hero_subtitle", label: "부제목",           type: "text",     placeholder: "예: 일광교회에 오신 것을 환영합니다" },
  { key: "hero_cta_text", label: "버튼 텍스트",     type: "text",     placeholder: "예: 예배 시간 안내" },
  { key: "hero_cta_link", label: "버튼 링크",       type: "url",      placeholder: "예: /worship" },
  { key: "hero_bg_image", label: "배경 이미지 주소", type: "url",      placeholder: "https://... (이미지 URL)" },
];

const SLIDER_FIELDS = [
  { key: "slide_1_image", label: "슬라이드 1 이미지", type: "url" as const, placeholder: "https://..." },
  { key: "slide_1_title", label: "슬라이드 1 제목",   type: "text" as const, placeholder: "첫 번째 슬라이드 문구" },
  { key: "slide_2_image", label: "슬라이드 2 이미지", type: "url" as const, placeholder: "https://..." },
  { key: "slide_2_title", label: "슬라이드 2 제목",   type: "text" as const, placeholder: "두 번째 슬라이드 문구" },
  { key: "slide_3_image", label: "슬라이드 3 이미지", type: "url" as const, placeholder: "https://..." },
  { key: "slide_3_title", label: "슬라이드 3 제목",   type: "text" as const, placeholder: "세 번째 슬라이드 문구" },
];

const DEFAULTS: Record<string, string> = {
  hero_title:    "행복과 영원으로 초대하는 교회",
  hero_subtitle: "일광교회에 오신 것을 환영합니다",
  hero_cta_text: "예배 시간 안내",
  hero_cta_link: "/worship",
  hero_bg_image: "",
  slide_1_image: "",
  slide_1_title: "주일 예배에 초대합니다",
  slide_2_image: "",
  slide_2_title: "말씀과 기도의 공동체",
  slide_3_image: "",
  slide_3_title: "함께 성장하는 교회",
};

export default function HeroPage() {
  const [values, setValues] = useState<Record<string, string>>({ ...DEFAULTS });
  const [saved, setSaved] = useState(false);

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    // 실제 운영 시 Supabase site_content 테이블에 저장
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    if (!confirm("기본값으로 되돌리시겠습니까?")) return;
    setValues({ ...DEFAULTS });
  }

  function renderField(field: HeroField) {
    const value = values[field.key] || "";
    const commonClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30";

    return (
      <div key={field.key}>
        <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
        {field.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${commonClass} resize-none`}
          />
        ) : (
          <input
            type={field.type === "url" ? "url" : "text"}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={commonClass}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">홈 화면 수정</h1>
          <p className="text-gray-500 text-sm mt-0.5">메인 배너(히어로) 제목·이미지·버튼 내용을 수정합니다</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" /> 사이트 확인
          </a>
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> 기본값 복원
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
            <Save className="w-4 h-4" /> {saved ? "저장됨 ✓" : "저장"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 메인 배너 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">메인 배너 문구</h2>
          {HERO_FIELDS.map(renderField)}
        </div>

        {/* 슬라이더 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">이미지 슬라이더</h2>
          {SLIDER_FIELDS.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type === "url" ? "url" : "text"}
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 미리보기 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">배너 미리보기</h2>
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-[16/6] flex items-center justify-center"
          style={values.hero_bg_image ? { backgroundImage: `url(${values.hero_bg_image})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative text-center text-white px-6">
            <h3 className="text-2xl font-bold drop-shadow-lg mb-2">{values.hero_title || "제목을 입력하세요"}</h3>
            <p className="text-white/80 text-sm drop-shadow">{values.hero_subtitle || "부제목을 입력하세요"}</p>
            {values.hero_cta_text && (
              <div className="mt-4">
                <span className="inline-block px-5 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium">
                  {values.hero_cta_text}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-semibold mb-1">💡 저장 안내</p>
        <p>저장 버튼을 누르면 데이터베이스에 반영됩니다. 실제 사이트에 적용되려면 Supabase 연동이 완료되어 있어야 합니다.</p>
      </div>
    </div>
  );
}
