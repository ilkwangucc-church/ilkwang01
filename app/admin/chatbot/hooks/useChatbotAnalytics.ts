"use client";
import { useState, useCallback } from "react";
import type { Analytics } from "@/lib/chatbot-types";

export function useChatbotAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/admin/chatbot/analytics?days=30");
      const data = (await res.json()) as Analytics & { error?: string };
      if (!data.error && typeof data.total_conversations === "number") {
        setAnalytics(data);
      }
    } catch {
      /* silent */
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  return { analytics, analyticsLoading, loadAnalytics };
}
