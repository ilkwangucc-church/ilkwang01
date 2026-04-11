import { Metadata } from "next";

export const metadata: Metadata = { title: "사이트 설정 | 관리자" };

const SITE_URL = "https://ilkwang.org";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사이트 설정</h1>
        <p className="text-gray-500 text-sm mt-0.5">일반 설정 및 외부 서비스 연동 관리</p>
      </div>

      {/* API 키 상태 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">외부 서비스 연동 상태</h2>
        {[
          { name: "Brevo (이메일)", status: "연동완료 ✅", desc: "비밀번호 찾기 / 알림 이메일 자동 발송", color: "text-green-600" },
          { name: "YouTube API", status: "미연동", desc: "ilwangucc 채널 자동 연동", color: "text-red-500" },
          { name: "Coolsms (문자)", status: "미연동", desc: "컨택폼 SMS 자동전송", color: "text-red-500" },
        ].map((s) => (
          <div key={s.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
            <div>
              <p className="font-medium text-sm text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </div>
            <span className={`text-xs font-semibold ${s.color}`}>{s.status}</span>
          </div>
        ))}
        <p className="text-xs text-gray-400">
          연동하려면 <code className="bg-gray-100 px-1 rounded">.env.local</code> 파일에 API 키를 설정하세요.
        </p>
      </div>

      {/* 관리자 계정 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">관리자 계정</h2>
        <div className="space-y-3">
          {[
            { label: "관리자 이메일", value: "admin@ilkwang.or.kr" },
            { label: "사이트 이름", value: "일광교회" },
            { label: "사이트 URL", value: SITE_URL },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
              <input type="text" defaultValue={f.value}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
            </div>
          ))}
        </div>
        <button className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          설정 저장
        </button>
      </div>

      {/* .env 가이드 */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">.env.local 설정 가이드</h3>
        <pre className="text-xs text-gray-600 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto leading-relaxed">
{`# ── Brevo (이메일) ─────────────────────────────
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
REVALIDATION_SECRET=ilkwang-cache-2026`}
        </pre>
      </div>
    </div>
  );
}
