"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera, Save, RefreshCw, CheckCircle2, XCircle, AlertCircle,
  Eye, EyeOff, Plus, Trash2, ArrowLeft, ExternalLink,
} from "lucide-react";

interface Account {
  id: string;
  dept: string;
  handle: string;
  gradient: string;
  bio: string;
  url: string;
  accessToken: string;
  instagramUserId: string;
  tokenExpiresAt: string;
  isActive: boolean;
}

const GRADIENT_OPTIONS = [
  { label: "보라-핑크", value: "from-purple-500 to-pink-500" },
  { label: "앰버-오렌지", value: "from-amber-400 to-orange-500" },
  { label: "레드-로즈", value: "from-red-400 to-rose-500" },
  { label: "그린-틸", value: "from-green-400 to-teal-500" },
  { label: "인디고-블루", value: "from-indigo-500 to-blue-500" },
  { label: "블루-퍼플", value: "from-blue-500 to-purple-500" },
];

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function daysUntil(iso: string) {
  if (!iso) return -1;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function InstagramSettingsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    id: "", dept: "", handle: "", gradient: GRADIENT_OPTIONS[0].value, bio: "",
    accessToken: "", instagramUserId: "",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/instagram/accounts");
      if (res.ok) setAccounts(await res.json());
    } catch { /* noop */ }
    setLoading(false);
  }

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function saveAccount(account: Account) {
    setSaving(account.id);
    try {
      const res = await fetch("/api/instagram/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      if (res.ok) {
        showMsg("success", `${account.dept} 저장 완료`);
        await fetchAccounts();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "저장 실패");
      }
    } catch {
      showMsg("error", "서버 오류");
    }
    setSaving(null);
  }

  async function refreshToken(accountId: string) {
    setSaving(accountId);
    try {
      const res = await fetch("/api/instagram/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("success", `토큰 갱신 완료 (만료: ${formatDate(data.expiresAt)})`);
        await fetchAccounts();
      } else {
        showMsg("error", data.error || "갱신 실패");
      }
    } catch {
      showMsg("error", "서버 오류");
    }
    setSaving(null);
  }

  async function deleteAccount(id: string, dept: string) {
    if (!confirm(`"${dept}" 계정을 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/instagram/accounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("success", `${dept} 삭제 완료`);
        await fetchAccounts();
      } else {
        showMsg("error", "삭제 실패");
      }
    } catch {
      showMsg("error", "서버 오류");
    }
  }

  async function addAccount() {
    if (!newAccount.id || !newAccount.dept || !newAccount.handle) {
      showMsg("error", "ID, 부서명, 핸들은 필수입니다");
      return;
    }
    setSaving("new");
    try {
      const res = await fetch("/api/instagram/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (res.ok) {
        showMsg("success", `${newAccount.dept} 추가 완료`);
        setNewAccount({ id: "", dept: "", handle: "", gradient: GRADIENT_OPTIONS[0].value, bio: "", accessToken: "", instagramUserId: "" });
        setShowAddForm(false);
        await fetchAccounts();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "추가 실패");
      }
    } catch {
      showMsg("error", "서버 오류");
    }
    setSaving(null);
  }

  function updateField(id: string, field: keyof Account, value: string) {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard/settings" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-6 h-6 text-pink-500" /> 인스타그램 API 설정
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-7">부서별 Instagram Graph API 토큰을 관리합니다</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" /> 계정 추가
        </button>
      </div>

      {/* 알림 메시지 */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* 새 계정 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#2E7D32]" /> 새 계정 추가
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">계정 ID (영문, 밑줄)</label>
              <input
                type="text"
                placeholder="ilkwang_newdept"
                value={newAccount.id}
                onChange={(e) => setNewAccount({ ...newAccount, id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">부서명</label>
              <input
                type="text"
                placeholder="새 부서"
                value={newAccount.dept}
                onChange={(e) => setNewAccount({ ...newAccount, dept: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">인스타 핸들</label>
              <input
                type="text"
                placeholder="@ilkwang_newdept"
                value={newAccount.handle}
                onChange={(e) => setNewAccount({ ...newAccount, handle: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">그라디언트 색상</label>
              <select
                value={newAccount.gradient}
                onChange={(e) => setNewAccount({ ...newAccount, gradient: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              >
                {GRADIENT_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">소개글</label>
              <input
                type="text"
                placeholder="부서 소개 한 줄"
                value={newAccount.bio}
                onChange={(e) => setNewAccount({ ...newAccount, bio: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Access Token</label>
              <input
                type="password"
                placeholder="IGQV..."
                value={newAccount.accessToken}
                onChange={(e) => setNewAccount({ ...newAccount, accessToken: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Instagram User ID</label>
              <input
                type="text"
                placeholder="17841400..."
                value={newAccount.instagramUserId}
                onChange={(e) => setNewAccount({ ...newAccount, instagramUserId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={addAccount}
              disabled={saving === "new"}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm font-medium hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving === "new" ? "저장 중..." : "추가"}
            </button>
          </div>
        </div>
      )}

      {/* 계정 목록 */}
      <div className="space-y-4">
        {accounts.map((account) => {
          const days = daysUntil(account.tokenExpiresAt);
          const expired = days < 0 && account.accessToken;
          const expiringSoon = days >= 0 && days <= 7 && account.accessToken;

          return (
            <div key={account.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${account.gradient} flex items-center justify-center text-white shrink-0`}>
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{account.dept}</p>
                    <p className="text-xs text-gray-400">{account.handle}</p>
                  </div>
                  {/* 상태 뱃지 */}
                  {account.isActive ? (
                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> 연동됨
                    </span>
                  ) : account.accessToken ? (
                    <span className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                      <XCircle className="w-3 h-3" /> 만료됨
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" /> 미설정
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteAccount(account.id, account.dept)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 만료 경고 */}
              {expired && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  토큰이 만료되었습니다. Facebook 개발자 콘솔에서 새 토큰을 발급받아 주세요.
                </div>
              )}
              {expiringSoon && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                  토큰이 {days}일 후 만료됩니다. 아래 "토큰 갱신" 버튼을 눌러 연장하세요.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Access Token</label>
                  <div className="relative">
                    <input
                      type={showTokens[account.id] ? "text" : "password"}
                      value={account.accessToken}
                      onChange={(e) => updateField(account.id, "accessToken", e.target.value)}
                      placeholder="IGQV..."
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                    />
                    <button
                      onClick={() => setShowTokens((p) => ({ ...p, [account.id]: !p[account.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showTokens[account.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Instagram User ID</label>
                  <input
                    type="text"
                    value={account.instagramUserId}
                    onChange={(e) => updateField(account.id, "instagramUserId", e.target.value)}
                    placeholder="17841400..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">소개글</label>
                  <input
                    type="text"
                    value={account.bio}
                    onChange={(e) => updateField(account.id, "bio", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">토큰 만료일</label>
                  <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-600">
                    {account.tokenExpiresAt ? formatDate(account.tokenExpiresAt) : "토큰 미설정"}
                    {days > 0 && <span className="text-gray-400 ml-2">({days}일 남음)</span>}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                {account.accessToken && !expired && (
                  <button
                    onClick={() => refreshToken(account.id)}
                    disabled={saving === account.id}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${saving === account.id ? "animate-spin" : ""}`} /> 토큰 갱신
                  </button>
                )}
                <button
                  onClick={() => saveAccount(account)}
                  disabled={saving === account.id}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm font-medium hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving === account.id ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 토큰 발급 가이드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500" /> Instagram Graph API 토큰 발급 가이드
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <p><a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developers</a>에서 앱을 생성합니다.</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <p>앱에 "Instagram Graph API" 제품을 추가합니다.</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <p>Instagram 비즈니스/크리에이터 계정을 Facebook 페이지에 연결합니다.</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <p>Graph API Explorer에서 토큰을 생성한 뒤, 장기 토큰(Long-Lived Token)으로 교환합니다. 장기 토큰은 60일간 유효하며, 만료 전 갱신할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
