"use client";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-opacity duration-200 ${
          isUser
            ? "bg-[#0C9AB0] text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
