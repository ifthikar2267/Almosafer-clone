"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ChatMessage from "./ChatMessage";
import AILogo from "@/constants/AILogo";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 shadow-sm flex items-center gap-2">
        <p className="text-gray-500 text-bold">fetching hotel details</p>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 mt-1" />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 mt-1"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 mt-1"
          style={{ animationDelay: "0.3s" }}
        />
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
  const [isMaximized, setIsMaximized] = useState(false);
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

  // Track which message index is the last assistant message
  const lastAssistantIndex = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0) return -1;
    let idx = -1;
    messages.forEach((m, i) => {
      if (m && m.role === "assistant" && typeof m.content === "string") {
        idx = i;
      }
    });
    return idx;
  }, [messages]);

  if (!open) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[100] bg-black/20 transition-opacity duration-300 md:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Chat container (minimized + maximized) */}
      <div
        className={[
          "fixed z-[100] flex flex-col bg-white",
          "transition-all duration-300 ease-in-out transform-gpu",
          "shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
          isMaximized
            ? "top-0 left-0 right-0 bottom-0 m-auto h-[90vh] w-[90vw] rounded-2xl opacity-100 md:w-[85vw]"
            : "inset-x-0 bottom-0 top-auto rounded-t-2xl opacity-100 md:inset-auto md:bottom-6 md:right-6 md:h-[560px] md:w-[400px] md:rounded-2xl md:shadow-xl",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Chat"
      >
        {/* Header */}
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
              onClick={() => setIsMaximized((v) => !v)}
              className="rounded-lg cursor-pointer p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? (
                // Minimize icon
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Maximize icon
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
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

        {/* Messages + inline related questions */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-500">Ask me anything about {name}.</p>
          )}

          <div className="space-y-3">
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                onRelatedClick={(q) => setInput(q)}
              />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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