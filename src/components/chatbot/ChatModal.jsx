"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ChatMessage from "./ChatMessage";
import AILogo from "@/constants/AILogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 shadow-sm flex items-center gap-2">
        <p className="text-gray-500 text-bold">fetching property details</p>
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

  // Voice states
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");

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

  /* Voice Search */
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice search. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();

    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      sendMessage(transcript);

      // clear input after sending
      setInput("");
    };

    recognition.onerror = () => {
      alert("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const relatedQuestions = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0) return [];

    const assistantMessages = messages.filter(
      (m) => m && m.role === "assistant" && typeof m.content === "string"
    );
    if (assistantMessages.length === 0) return [];

    const lastAnswer = assistantMessages[assistantMessages.length - 1].content;
    if (!lastAnswer) return [];

    const lower = lastAnswer.toLowerCase();
    const marker = "related questions:";
    const idx = lower.indexOf(marker);
    if (idx === -1) return [];

    const section = lastAnswer.slice(idx + marker.length).trim();
    if (!section) return [];

    const lines = section.split("\n").map((l) => l.trim());
    const qs = [];

    for (const line of lines) {
      if (!line) continue;
      const cleaned = line.replace(/^[-•\d.)\s]+/, "").trim();
      if (cleaned) qs.push(cleaned);
    }

    return qs;
  }, [messages]);

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

      {/* Chat container */}
      <div
        className={[
          "fixed z-[100] flex flex-col bg-white",
          "transition-all duration-300 ease-in-out transform-gpu",
          "shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
          isMaximized
            ? "top-0 left-0 right-0 bottom-0 m-auto h-[90vh] w-[90vw] rounded-2xl opacity-100 md:w-[85vw]"
            : "inset-x-0 bottom-0 top-auto rounded-t-2xl opacity-100 md:inset-auto md:bottom-6 md:right-6 md:h-[560px] md:w-[400px] md:rounded-2xl md:shadow-xl",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src={AILogo}
              alt="AI Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="font-semibold text-gray-900">
              Hotel Assistant
            </span>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMaximized((v) => !v)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              ⛶
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-500">
              Ask me anything about {name}.
            </p>
          )}

          <div className="space-y-3">
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                onRelatedClick={(q) => sendMessage(q)}
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
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-gray-200 bg-white p-4"
        >
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0C9AB0] focus:ring-1 focus:ring-[#0C9AB0]"
            />

            {/* Voice Button */}
            <button
              type="button"
              onClick={startVoiceSearch}
              disabled={listening}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-gray-600 hover:bg-gray-100"
            >
              <FontAwesomeIcon
                icon={faMicrophone}
                className={listening ? "text-red-500" : ""}
              />
            </button>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-[#0C9AB0] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0C9AB0] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}