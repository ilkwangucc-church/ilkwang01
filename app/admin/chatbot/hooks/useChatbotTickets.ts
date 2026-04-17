"use client";
import { useState, useCallback } from "react";
import type { Ticket } from "@/lib/chatbot-types";

export function useChatbotTickets(showToast: (msg: string) => void) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chatbot/tickets");
      const data = (await res.json()) as { tickets?: Ticket[]; error?: string };
      if (!data.error) setTickets(data.tickets || []);
    } catch {
      /* silent */
    }
  }, []);

  async function updateTicket(id: number, status: string) {
    await fetch(`/api/admin/chatbot/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    showToast("티켓 상태 변경 완료");
  }

  return { tickets, loadTickets, updateTicket };
}
