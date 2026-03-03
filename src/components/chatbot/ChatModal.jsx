"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import AILogo from "@/constants/AILogo";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatModal({
  open,
  onClose,
  messages,
  loading,
  error,
  sendMessage,
  clearChat,
  messagesEndRef,
  name = "Hotel Assistant",
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/20 transition-opacity duration-300 md:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-x-0 bottom-0 top-auto z-[100] flex flex-col rounded-t-2xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)] transition-transform duration-300 md:inset-auto md:bottom-6 md:right-6 md:top-auto md:h-[560px] md:w-[400px] md:rounded-2xl md:shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Chat"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={AILogo} alt="AI Logo" className="h-8 w-8 object-contain" aria-hidden />
            <span className="font-semibold text-gray-900">Hotel Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg cursor-pointer px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg cursor-pointer p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-500">Ask me anything about {name}.</p>
          )}
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="shrink-0 border-t border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#0C9AB0] focus:ring-1 focus:ring-[#0C9AB0] disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-[#0C9AB0] cursor-pointer px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0C9AB0] disabled:opacity-50 disabled:hover:bg-teal-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
