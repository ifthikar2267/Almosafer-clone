"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { HOTELS_API } from "@/config/api";

// Call the deployed backend directly to avoid 404 when there is no /api/chat Next.js route.
const CHAT_API = `${HOTELS_API.externalBase}/api/chat`;

async function sendChatMessage(question, hotelId) {
  const payload = {
    question,
    hotelId: Number(hotelId),
  };

  const res = await fetch(CHAT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "Request failed");
    throw new Error(err || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data?.answer ?? "";
}

export function useChat(hotelId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text ?? "").trim();
      if (!trimmed || loading) return;

      const userMsg = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      try {
        const answer = await sendChatMessage(trimmed, hotelId);
        setMessages((prev) => [...prev, { role: "assistant", content: answer || "No response." }]);
      } catch (err) {
        setError(err?.message ?? "Something went wrong");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [hotelId]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat, messagesEndRef };
}
