"use client";
// app/admin/chatbot/page.tsx — 일광교회 챗봇 관리 (n0008 super-admin/chatbot 포팅)
import { useEffect, useState } from "react";
import type { Tab } from "@/lib/chatbot-types";

import { useChatbotSettings } from "./hooks/useChatbotSettings";
import { useChatbotConversations } from "./hooks/useChatbotConversations";
import { useChatbotAnalytics } from "./hooks/useChatbotAnalytics";
import { useChatbotTickets } from "./hooks/useChatbotTickets";

import { OverviewTab } from "./components/OverviewTab";
import { InboxTab } from "./components/InboxTab";
import { TicketsTab } from "./components/TicketsTab";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { SettingsTab } from "./components/SettingsTab";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "개요" },
  { id: "inbox", label: "받은 메시지" },
  { id: "tickets", label: "티켓" },
  { id: "analytics", label: "분석" },
  { id: "settings", label: "설정" },
];

export default function ChatbotAdminPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const settingsHook = useChatbotSettings();
  const convHook = useChatbotConversations(settingsHook.showToast);
  const analyticsHook = useChatbotAnalytics();
  const ticketsHook = useChatbotTickets(settingsHook.showToast);

  useEffect(() => {
    if (tab === "inbox" || tab === "overview") convHook.loadConversations();
    if (tab === "overview" || tab === "analytics") analyticsHook.loadAnalytics();
    if (tab === "tickets") ticketsHook.loadTickets();
    if (tab === "settings") settingsHook.loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div>
      {settingsHook.toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#2E7D32] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg">
          {settingsHook.toast}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-1">챗봇 관리</h1>
      <p className="text-sm text-gray-500 mb-6">
        일광교회 AI 챗봇 · 다국어 지원 · 티켓 · 에스컬레이션 · 분석
      </p>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              convHook.setSelectedConv(null);
            }}
            className={`px-5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px ${
              tab === id
                ? "border-[#2E7D32] text-[#2E7D32] font-bold"
                : "border-transparent text-gray-500 font-medium hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab analytics={analyticsHook.analytics} />}

      {tab === "inbox" && (
        <InboxTab
          filteredConvs={convHook.filteredConvs}
          selectedConv={convHook.selectedConv}
          setSelectedConv={convHook.setSelectedConv}
          messages={convHook.messages}
          replyText={convHook.replyText}
          setReplyText={convHook.setReplyText}
          targetLanguage={convHook.targetLanguage}
          setTargetLanguage={convHook.setTargetLanguage}
          sendingReply={convHook.sendingReply}
          loading={convHook.loading}
          convFilter={convHook.convFilter}
          setConvFilter={convHook.setConvFilter}
          convSearch={convHook.convSearch}
          setConvSearch={convHook.setConvSearch}
          page={convHook.page}
          setPage={convHook.setPage}
          pages={convHook.pages}
          openConversation={convHook.openConversation}
          sendReply={convHook.sendReply}
          updateConvStatus={convHook.updateConvStatus}
          loadConversations={convHook.loadConversations}
        />
      )}

      {tab === "tickets" && (
        <TicketsTab tickets={ticketsHook.tickets} updateTicket={ticketsHook.updateTicket} />
      )}

      {tab === "analytics" && (
        <AnalyticsTab
          analytics={analyticsHook.analytics}
          analyticsLoading={analyticsHook.analyticsLoading}
        />
      )}

      {tab === "settings" && (
        <SettingsTab
          settings={settingsHook.settings}
          setSettings={settingsHook.setSettings}
          settingsSaving={settingsHook.settingsSaving}
          saveSettings={settingsHook.saveSettings}
        />
      )}
    </div>
  );
}
