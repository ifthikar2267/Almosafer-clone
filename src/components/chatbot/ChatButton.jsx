"use client";

import AILogo from "@/constants/AILogo";

export default function ChatButton({ onClick, ariaLabel = "Open chat" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="fixed bottom-24 right-6 z-110 cursor-pointer flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 md:bottom-6 animate-bounce-slow"
    >
      {/* Glow effect */}
      <span className="absolute h-full cursor-pointer w-full rounded-full bg-teal-400 opacity-20 blur-xl animate-pulse" />

      {/* Logo */}
      <img
        src={AILogo}
        alt="AI Logo"
        className="relative h-9 w-9 object-contain transition-transform duration-500 hover:rotate-12"
      />
    </button>
  );
}

