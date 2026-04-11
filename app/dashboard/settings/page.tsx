import { Metadata } from "next";
import { Settings, CheckCircle2, XCircle, Mail, MessageSquare, Video, Key } from "lucide-react";

export const metadata: Metadata = { title: "사이트 설정 | 관리자" };

const SITE_URL = "https://ilkwang.org";

const SERVICES = [
  {
    name: "Brevo (이메일)",
    key: "BREVO_API_KEY",
    desc: "비밀번호 찾기 / 알림 이메일 자동 발송",
    icon: Mail,
    color: "bg-blue-50 text-blue-600",
    connected: true,
    note: "연동 완료 — noreply@ilkwang.or.kr",
  },
  {
    name: "YouTube API",
    key: "YOUTUBE_API_KEY",
    desc: "ilkwangucc 채널 설교 영상 자동 연동",
    icon: Video,
    color: "bg-red-50 text-red-600",
    connected: false,
    note: "YOUTUBE_API_KEY 환경변수 필요",
  },
  {
    name: "Coolsms (문자)",
    key: "COOLSMS_API_KEY",
    desc: "문의 접수 시 SMS 자동 전송",
    icon: MessageSquare,
    color: "bg-green-50 text-green-600",
    connected: false,
    note: "COOLSMS_API_KEY / SECRET 환경변수 필요",
  },
];

const ENV_GUIDE = `# 일광교회 환경변수 설정 가이드

# ── Brevo (이메일) ─────────────────────────────
BREVO_API_KEY=xkeysib-xxx...
BREVO_FROM_EMAIL=noreply@ilkwang.or.kr
BREVO_FROM_NAME=일광교회
NEXT_PUBLIC_BASE_URL=${SITE_URL}

# ── YouTube API ────────────────────────────────
YOUTUBE_API_KEY=AIzaSy...
YOUTUBE_CHANNEL_ID=UCxxx...

# ── Coolsms (문자) ─────────────────────────────
COOLSMS_API_KEY=xxx
COOLSMS_API_SECRET=xxx
COOLSMS_SENDER=02-927-0691

# ── 캐시 재검증 ────────────────────────────────
REVALIDATION_SECRET=ilkwang-cache-2026

# ── Next Auth ──────────────────────────────────
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=${SITE_URL}`;

const SITE_INFO = [
  { label: "사이트 이름",  value: "일광교회" },
  { label: "사이트 URL",   value: SITE_URL },
  { label: "관리자 이메일", value: "admin@ilkwang.or.kr" },
  { label: "발신 이메일",   value: "noreply@ilkwang.or.kr" },
  { label: "교회 연락처",   value: "02-927-0691" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600" /> 사이트 설정
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">일반 설정 및 외부 서비스 연동 관리</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 외부 서비스 연동 현황 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-500" /> 외부 서비스 연동 현황
          </h2>
          <div className="space-y-4">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                      {s.connected
                        ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                        : <XCircle className="w-4 h-4 text-red-400" />
                      }
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{s.desc}</p>
                    <p className={`text-xs font-medium ${s.connected ? "text-green-600" : "text-gray-400"}`}>{s.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 사이트 기본 정보 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-bold text-gray-900 mb-4">사이트 기본 정보</h2>
          <div className="space-y-3">
            {SITE_INFO.map((f) => (
              <div key={f.label}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input
                  type="text"
                  defaultValue={f.value}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm font-medium hover:bg-[#1B5E20] transition-colors w-full">
            설정 저장
          </button>
        </div>
      </div>

      {/* 환경변수 가이드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="font-bold text-gray-900 mb-2">.env.local / Vercel 환경변수 설정 가이드</h2>
        <p className="text-xs text-gray-500 mb-4">
          아래 키들을 Vercel 프로젝트의 Environment Variables에 등록하거나
          로컬에서는 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">.env.local</code> 파일에 설정하세요.
        </p>
        <pre className="text-xs bg-gray-900 text-green-400 p-5 rounded-xl overflow-x-auto leading-relaxed whitespace-pre">
          {ENV_GUIDE}
        </pre>
      </div>

      {/* Brevo 안내 */}
      <div className="bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] p-5 flex items-start gap-4">
        <Mail className="w-5 h-5 text-[#2E7D32] mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-[#2E7D32] mb-1">Brevo 이메일 서비스 연동 완료</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            비밀번호 찾기 이메일이 Brevo를 통해 자동 발송됩니다.
            Brevo 대시보드에서 발송 로그 및 통계를 확인할 수 있습니다.
            추가 이메일 기능(문의 접수 알림 등)이 필요하면 관리자에게 요청하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
