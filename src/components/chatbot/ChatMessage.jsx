"use client";

export default function ChatMessage({ role, content, onRelatedClick }) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  let body = content;
  let related = [];

  if (
    isAssistant &&
    typeof content === "string" &&
    content.toLowerCase().includes("related questions:")
  ) {
    const lower = content.toLowerCase();
    const marker = "related questions:";
    const idx = lower.indexOf(marker);
    const mainText = content.slice(0, idx).trimEnd();
    const section = content.slice(idx + marker.length).trim();

    body = mainText;

    if (section) {
      const lines = section.split("\n").map((l) => l.trim());
      for (const line of lines) {
        if (!line) continue;
        const cleaned = line.replace(/^[-•\d.)\s]+/, "").trim();
        if (cleaned) related.push(cleaned);
      }
    }
  }

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-opacity duration-200 ${
          isUser
            ? "bg-[#0C9AB0] text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        {body && (
          <p className="whitespace-pre-wrap break-words">{body}</p>
        )}

        {isAssistant && related.length > 0 && (
          <div className="mt-2 space-y-1 text-sm">
            <div className="text-gray-900 font-bold">Related questions:</div>
            {related.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onRelatedClick && onRelatedClick(q)}
                className="block w-full text-left text-[#0C9AB0] underline underline-offset-2 hover:text-[#0a7f93] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
