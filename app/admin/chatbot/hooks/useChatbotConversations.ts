"use client";
import { useState, useCallback, useEffect } from "react";
import type { Conversation, Message } from "@/lib/chatbot-types";

function normalizeLanguage(language: string | null | undefined) {
  const value = (language || "").trim().toLowerCase();
  if (!value) return "ko";
  if (value === "kr") return "ko";
  return value;
}

export function useChatbotConversations(showToast: (msg: string) => void) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [sendingReply, setSendingReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convFilter, setConvFilter] = useState("all");
  const [convSearch, setConvSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        type: convFilter,
        search: convSearch,
      });
      const res = await fetch(`/api/admin/chatbot?${params}`);
      const data = (await res.json()) as {
        conversations?: Conversation[];
        pages?: number;
        error?: string;
      };
      if (!data.error) {
        setConversations(data.conversations || []);
        setPages(data.pages || 1);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [page, convFilter, convSearch]);

  const loadConversationMessages = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/chatbot/${id}`);
      const data = (await res.json()) as { messages?: Message[] };
      setMessages(data.messages || []);
    } catch {
      /* silent */
    }
  }, []);

  async function openConversation(conv: Conversation) {
    setSelectedConv(conv);
    setMessages([]);
    setReplyText("");
    setTargetLanguage(normalizeLanguage(conv.language));
    await loadConversationMessages(conv.id);
  }

  async function sendReply() {
    if (!replyText.trim() || !selectedConv || sendingReply) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/admin/chatbot/${selectedConv.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyText.trim(),
          targetLanguage: normalizeLanguage(targetLanguage),
        }),
      });
      const data = (await res.json()) as { sentMessage?: string; error?: string };
      if (data.error) throw new Error(data.error);
      setReplyText("");
      await loadConversationMessages(selectedConv.id);
      await loadConversations();
      showToast("답변 전송 완료");
    } catch {
      showToast("전송 실패");
    } finally {
      setSendingReply(false);
    }
  }

  useEffect(() => {
    if (!selectedConv) return;
    setTargetLanguage(normalizeLanguage(selectedConv.language));
  }, [selectedConv?.id, selectedConv?.language]);

  async function updateConvStatus(id: string, status: string) {
    await fetch(`/api/admin/chatbot/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    if (selectedConv?.id === id) {
      setSelectedConv((s) => (s ? { ...s, status } : s));
    }
    showToast("상태 변경 완료");
  }

  const filteredConvs = conversations
    .filter((c) => {
      if (convFilter === "escalated") return c.escalated === 1;
      if (convFilter === "open") return c.status === "open";
      if (convFilter === "handled") return c.status === "handled";
      if (convFilter === "resolved") return c.status === "resolved";
      return true;
    })
    .filter((c) => {
      if (!convSearch) return true;
      const q = convSearch.toLowerCase();
      return (
        (c.customer_email || "").toLowerCase().includes(q) ||
        (c.first_message || "").toLowerCase().includes(q) ||
        (c.visitor_id || "").toLowerCase().includes(q)
      );
    });

  return {
    conversations,
    selectedConv,
    setSelectedConv,
    messages,
    replyText,
    setReplyText,
    targetLanguage,
    setTargetLanguage,
    sendingReply,
    loading,
    convFilter,
    setConvFilter,
    convSearch,
    setConvSearch,
    page,
    setPage,
    pages,
    filteredConvs,
    loadConversations,
    openConversation,
    sendReply,
    updateConvStatus,
  };
}
