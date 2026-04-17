"use client";
import { useState, useCallback } from "react";
import type { Settings } from "@/lib/chatbot-types";

declare global {
  interface Window {
    ChatNote?: {
      reload?: () => void;
      open?: () => void;
      close?: () => void;
      toggle?: () => void;
    };
  }
}

export function useChatbotSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chatbot/settings");
      const data = (await res.json()) as { settings?: Settings; error?: string };
      if (!data.error && data.settings) setSettings(data.settings);
    } catch {
      /* silent */
    }
  }, []);

  async function saveSettings() {
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/admin/chatbot/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      await loadSettings();
      showToast("설정 저장 완료");
      if (typeof window !== "undefined") {
        window.ChatNote?.reload?.();
        localStorage.setItem("nrc_cfg_ts", Date.now().toString());
      }
    } catch (err) {
      showToast("저장 실패: " + (err instanceof Error ? err.message : "오류"));
    } finally {
      setSettingsSaving(false);
    }
  }

  return {
    settings,
    setSettings,
    settingsSaving,
    toast,
    showToast,
    loadSettings,
    saveSettings,
  };
}
