"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Lightweight onboarding / announcement popup for hotel detail pages.
 *
 * Props:
 * - logoUrl: string (required)
 * - titleText: string (required)
 * - descriptionText?: string
 * - autoCloseTime?: number (ms, default 4000)
 */
export default function HotelIntroPopup({
  logoUrl,
  titleText,
  descriptionText,
  autoCloseTime = 20000,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);
  const FADE_MS = 300;

  // Mount and show with a slight delay for smoother entrance.
  useEffect(() => {
    setMounted(true);
    const showTimer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(showTimer);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    const hideTimer = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(hideTimer);
  }, [FADE_MS]);

  // Auto-close after configured time.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      const hideTimer = setTimeout(() => setMounted(false), FADE_MS);
      return () => clearTimeout(hideTimer);
    }, autoCloseTime);
    return () => clearTimeout(timer);
  }, [visible, autoCloseTime, FADE_MS]);

  // Close when clicking outside of the bubble.
  useEffect(() => {
    if (!visible) return;

    const handleClick = (event) => {
      const target = event.target;
      if (!containerRef.current || !target) return;
      if (!containerRef.current.contains(target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [visible, close]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex justify-center px-4 md:bottom-10 md:justify-end md:px-8">
      <div
        ref={containerRef}
        className={`pointer-events-auto flex max-w-md flex-col items-end gap-3 transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {/* Text bubble */}
        <div className="relative max-w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl md:max-w-sm">
          {/* Tail */}
          <div className="absolute -bottom-2 right-8 h-3 w-3 rotate-45 bg-slate-900" />

          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="absolute right-2 top-2 rounded-full p-1 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close intro message"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
            </svg>
          </button>

          <div className="pr-5">
            <p className="font-medium leading-snug">{titleText}</p>
            {descriptionText && (
              <p className="mt-1 text-xs leading-snug text-slate-200">
                {descriptionText}
              </p>
            )}
          </div>
        </div>

        {/* Logo circle (anchor) */}
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center">
          </div>
        </div>
      </div>
    </div>
  );
}

