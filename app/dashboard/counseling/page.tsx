"use client";
import { useState } from "react";
import { HeartHandshake, Lock, CheckCircle2, Phone, Mail, MapPin, Clock } from "lucide-react";

const CATEGORIES = [
 { value: "일반상담", desc: "일상적인 고민이나 어려움에 대한 상담입니다." },
 { value: "신앙상담", desc: "신앙과 관련된 의심, 성장, 방향성에 대한 상담입니다." },
 { value: "가정상담", desc: "가족 관계, 결혼, 자녀 양육 등에 대한 상담입니다." },
 { value: "직장·진로상담", desc: "직장 문제, 진로 고민, 미래 계획에 대한 상담입니다." },
 { value: "청년상담", desc: "청년 특화 고민 — 연애, 취업, 인간관계 등입니다." },
 { value: "기타", desc: "위 항목에 해당하지 않는 모든 상담입니다." },
];

const COUNSELING_INFO = [
 { icon: Clock, label: "상담 시간", value: "월~금 오전 9시 ~ 오후 6시", sub: "주말 예약 가능" },
 { icon: Phone, label: "전화 문의", value: "02-927-0691", sub: "사무실 직통" },
 { icon: Mail, label: "이메일", value: "care@ilkwang.or.kr", sub: "24시간 접수" },
 { icon: MapPin, label: "위치", value: "교회 2층 상담실", sub: "사전 예약 필수" },
];

const NOTICES = [
 { emoji: "", text: "모든 상담 내용은 담당 교역자만 확인하며 외부 공개 없이 철저히 비밀 보장됩니다." },
 { emoji: "", text: "접수 후 1~3일 이내 담당자가 연락드립니다. 급한 경우 전화 문의 부탁드립니다." },
 { emoji: "", text: "모든 상담은 성경적 원리와 목양적 돌봄을 기반으로 진행됩니다." },
 { emoji: "", text: "익명으로 신청하셔도 동일한 수준의 상담 서비스가 제공됩니다." },
];

export default function CounselingPage() {
 const [form, setForm] = useState({ category: "일반상담", name: "", phone: "", content: "", anonymous: false });
 const [submitted, setSubmitted] = useState(false);
 const [loading, setLoading] = useState(false);

 function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
 const { name, value, type } = e.target;
 setForm(prev => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
 }

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 await new Promise(r => setTimeout(r, 800));
 setLoading(false);
 setSubmitted(true);
 }

 if (submitted) {
 return (
 <div className="space-y-4 sm:space-y-6">
 <div>
 <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
 <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" /> 상담신청
 </h1>
 </div>
 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 text-center max-w-lg mx-auto">
 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
 </div>
 <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">상담 신청이 접수되었습니다</h2>
 <p className="text-gray-500 text-sm leading-relaxed mb-6">
 담당 교역자가 확인 후 연락드리겠습니다.<br />
 보통 1~3일 이내에 답변이 이루어집니다.
 </p>
 <button
 onClick={() => { setSubmitted(false); setForm({ category: "일반상담", name: "", phone: "", content: "", anonymous: false }); }}
 className="w-full sm:w-auto px-6 py-2.5 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
 >
 새 상담 신청
 </button>
 </div>
 </div>
 );
 }

 const selectedCategory = CATEGORIES.find(c => c.value === form.category);

 return (
 <div className="space-y-4 sm:space-y-6">
 {/* 헤더 */}
 <div>
 <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
 <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" /> 상담신청
 </h1>
 <p className="text-gray-500 text-sm mt-0.5">모든 상담 내용은 담당 교역자만 확인합니다</p>
 </div>

 {/* 히어로 배너 */}
 <div className="relative rounded-2xl overflow-hidden min-h-[100px] sm:h-40">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80"
 alt="상담"
 className="absolute inset-0 w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-[#2E7D32]/80" />
 <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-center">
 <p className="text-white/80 text-sm font-semibold mb-1"> 비밀 보장 상담</p>
 <h2 className="text-lg sm:text-xl font-bold text-white mb-1">마음을 터놓고 이야기하세요</h2>
 <p className="text-white/70 text-sm">혼자 감당하기 어려운 짐을 함께 나눕니다. 어떤 이야기든 환영합니다.</p>
 </div>
 </div>

 {/* 2-컬럼 레이아웃 */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 sm:gap-6 items-start">
 {/* 왼쪽 — 신청 폼 */}
 <div className="space-y-5">
 {/* 안내 배너 */}
 <div className="bg-gray-100 rounded-xl p-4 flex items-start gap-3 border border-gray-200">
 <Lock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
 <p className="text-sm text-gray-700 leading-relaxed">
 상담 내용은 철저히 비밀이 보장됩니다. 담당 교역자 외에는 어떤 내용도 공개되지 않습니다.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5">
 {/* 상담 유형 */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">상담 유형</label>
 <select
 name="category" value={form.category} onChange={handleChange}
 className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30"
 >
 {CATEGORIES.map(c => <option key={c.value}>{c.value}</option>)}
 </select>
 {selectedCategory && (
 <p className="text-xs text-gray-500 mt-1.5 pl-1">{selectedCategory.desc}</p>
 )}
 </div>

 {/* 익명 선택 */}
 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
 <input
 type="checkbox" id="anonymous" name="anonymous"
 checked={form.anonymous} onChange={handleChange}
 className="w-4 h-4 accent-[#2E7D32]"
 />
 <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">익명으로 신청하기</label>
 <span className="text-xs text-gray-400 ml-auto">이름·연락처 입력 불필요</span>
 </div>

 {/* 이름 + 연락처 */}
 {!form.anonymous && (
 <div className="grid sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
 <input
 type="text" name="name" value={form.name} onChange={handleChange} required={!form.anonymous}
 placeholder="이름"
 className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
 <input
 type="tel" name="phone" value={form.phone} onChange={handleChange}
 placeholder="010-0000-0000"
 className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30"
 />
 </div>
 </div>
 )}

 {/* 상담 내용 */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">
 상담 내용 <span className="text-red-500">*</span>
 </label>
 <textarea
 name="content" value={form.content} onChange={handleChange} required
 rows={7}
 placeholder="상담하고 싶은 내용을 자유롭게 작성해 주세요. 어떤 상황인지, 어떤 도움이 필요한지 구체적으로 적어주시면 더 잘 도울 수 있습니다. 모든 내용은 담당 교역자만 확인합니다."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 resize-none"
 />
 </div>

 <button
 type="submit" disabled={loading}
 className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-medium text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
 >
 {loading ? "제출 중..." : <><HeartHandshake className="w-4 h-4" /> 상담 신청하기</>}
 </button>
 </form>
 </div>

 {/* 오른쪽 — 상담 안내 */}
 <div className="space-y-4">
 {/* 연락처 정보 */}
 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
 <h3 className="font-bold text-gray-900 mb-4">상담 안내</h3>
 <div className="space-y-4">
 {COUNSELING_INFO.map((info, i) => {
 const Icon = info.icon;
 return (
 <div key={i} className="flex items-start gap-3">
 <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
 <Icon className="w-4 h-4 text-gray-500" />
 </div>
 <div>
 <p className="text-xs text-gray-500 mb-0.5">{info.label}</p>
 <p className="text-sm font-semibold text-gray-800">{info.value}</p>
 <p className="text-xs text-gray-400">{info.sub}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* 유의사항 */}
 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
 <h3 className="font-bold text-gray-900 mb-3">꼭 확인해 주세요</h3>
 <div className="space-y-3">
 {NOTICES.map((n, i) => (
 <div key={i} className="flex items-start gap-2.5">
 <span className="text-base shrink-0 mt-0.5">{n.emoji}</span>
 <p className="text-xs text-gray-600 leading-relaxed">{n.text}</p>
 </div>
 ))}
 </div>
 </div>

 {/* 성경 말씀 */}
 <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
 <p className="text-xs font-semibold text-gray-600 mb-2"> 위로의 말씀</p>
 <p className="text-sm font-medium text-gray-800 leading-relaxed">
 "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라"
 </p>
 <p className="text-xs text-gray-500 mt-2">마태복음 11:28</p>
 </div>
 </div>
 </div>
 </div>
 );
}
