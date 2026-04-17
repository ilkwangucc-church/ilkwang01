"use client";
import type { Settings } from "@/lib/chatbot-types";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  settingsSaving: boolean;
  saveSettings: () => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1.5">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    />
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-9 rounded cursor-pointer border"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono"
      />
    </div>
  );
}

export function SettingsTab({ settings, setSettings, settingsSaving, saveSettings }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 왼쪽: 위젯/봇 설정 */}
      <div className="bg-white rounded-lg border p-5 space-y-4">
        <div className="text-sm font-semibold text-gray-900">위젯 · 봇 설정</div>

        <div>
          <Label>봇 이름</Label>
          <TextInput
            value={settings.bot_name ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, bot_name: v }))}
            placeholder="일광안내"
          />
        </div>

        <div>
          <Label>환영 메시지</Label>
          <TextInput
            value={settings.welcome_message ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, welcome_message: v }))}
            placeholder="안녕하세요! 무엇을 도와드릴까요?"
          />
        </div>

        <div>
          <Label>버블 라벨</Label>
          <TextInput
            value={settings.bubble_label ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, bubble_label: v }))}
            placeholder="채팅 상담"
          />
        </div>

        <div>
          <Label>자동 인사 버블 (홈)</Label>
          <TextInput
            value={settings.bot_greeting ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, bot_greeting: v }))}
            placeholder="일광교회 방문을 환영합니다 👋"
          />
        </div>

        <div>
          <Label>프로액티브 메시지</Label>
          <TextInput
            value={settings.proactive_message ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, proactive_message: v }))}
            placeholder="질문이 있으신가요?"
          />
        </div>

        <div>
          <Label>프로액티브 딜레이 (초)</Label>
          <TextInput
            value={settings.proactive_delay ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, proactive_delay: v }))}
            placeholder="8"
          />
        </div>

        <div>
          <Label>이메일 수집 안내문</Label>
          <TextInput
            value={settings.email_collection_msg ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, email_collection_msg: v }))}
            placeholder=""
          />
        </div>

        <div className="space-y-2.5">
          <div>
            <Label>기본 색상</Label>
            <ColorInput
              value={settings.primary_color || "#1A2744"}
              onChange={(v) => setSettings((s) => ({ ...s, primary_color: v }))}
            />
          </div>
          <div>
            <Label>보조 색상</Label>
            <ColorInput
              value={settings.secondary_color || "#2E3F6B"}
              onChange={(v) => setSettings((s) => ({ ...s, secondary_color: v }))}
            />
          </div>
          <div>
            <Label>헤더 배경색</Label>
            <ColorInput
              value={settings.header_bg_color || "#1A2744"}
              onChange={(v) => setSettings((s) => ({ ...s, header_bg_color: v }))}
            />
          </div>
          <div>
            <Label>사용자 버블색</Label>
            <ColorInput
              value={settings.user_bubble_color || "#1A2744"}
              onChange={(v) => setSettings((s) => ({ ...s, user_bubble_color: v }))}
            />
          </div>
          <div>
            <Label>봇 버블색</Label>
            <ColorInput
              value={settings.bot_bubble_color || "#F1F4F9"}
              onChange={(v) => setSettings((s) => ({ ...s, bot_bubble_color: v }))}
            />
          </div>
        </div>

        <div>
          <Label>봇 프로필 이미지 URL</Label>
          <TextInput
            value={settings.bot_profile_image_url ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, bot_profile_image_url: v }))}
            placeholder="https://..."
          />
        </div>

        <div>
          <Label>봇 로고 이미지 URL</Label>
          <TextInput
            value={settings.bot_logo_url ?? ""}
            onChange={(v) => setSettings((s) => ({ ...s, bot_logo_url: v }))}
            placeholder="https://..."
          />
        </div>

        <div>
          <Label>활성화</Label>
          <select
            value={settings.enabled ?? "true"}
            onChange={(e) => setSettings((s) => ({ ...s, enabled: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="true">켜짐</option>
            <option value="false">꺼짐</option>
          </select>
        </div>

        <button
          onClick={saveSettings}
          disabled={settingsSaving}
          className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
        >
          {settingsSaving ? "저장 중..." : "설정 저장"}
        </button>
      </div>

      {/* 오른쪽 */}
      <div className="space-y-5">
        <div className="bg-white rounded-lg border p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-900">언어 · 동작 설정</div>

          <div>
            <Label>기본 언어</Label>
            <select
              value={settings.default_language ?? "ko"}
              onChange={(e) => setSettings((s) => ({ ...s, default_language: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              {["ko", "en", "ja", "zh", "vi", "th", "id", "es", "fr", "de", "pt", "it", "ru", "ar", "hi", "ms", "nl", "pl", "tr", "uk"].map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>언어 자동 감지</Label>
            <select
              value={settings.auto_detect_language ?? "1"}
              onChange={(e) => setSettings((s) => ({ ...s, auto_detect_language: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="1">켜짐</option>
              <option value="0">꺼짐</option>
            </select>
          </div>

          <div>
            <Label>이메일 수집</Label>
            <select
              value={settings.email_collection_enabled ?? "0"}
              onChange={(e) => setSettings((s) => ({ ...s, email_collection_enabled: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="1">켜짐</option>
              <option value="0">꺼짐</option>
            </select>
          </div>

          <div>
            <Label>섹션 체류 감지 시간</Label>
            <select
              value={settings.section_dwell_time ?? "2000"}
              onChange={(e) => setSettings((s) => ({ ...s, section_dwell_time: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="1000">1초</option>
              <option value="2000">2초 (기본)</option>
              <option value="4000">4초</option>
              <option value="6000">6초</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-5 space-y-3">
          <div className="text-sm font-semibold text-gray-900">AI 지식베이스 (추가 컨텍스트)</div>
          <textarea
            value={settings.custom_knowledge_base ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, custom_knowledge_base: e.target.value }))}
            placeholder="교회 관련 추가 정보를 입력하세요. AI가 방문자 질문에 활용합니다."
            rows={12}
            className="w-full border rounded-lg px-3 py-2 text-xs font-mono leading-relaxed"
          />
          <button
            onClick={saveSettings}
            disabled={settingsSaving}
            className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
          >
            {settingsSaving ? "저장 중..." : "지식베이스 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
