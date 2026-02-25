"use client";

import { useState } from "react";
import Link from "next/link";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const NAV_BG = "#003143";

export default function TopNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <header className="w-full sticky top-0 z-50" style={{ backgroundColor: NAV_BG }}>
      <nav className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 text-white md:h-16 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="sr-only">Almosafer</span>
            <img
              src="https://static-sites.almosafer.com/assets/images/svg/logos/almosafer-re-en-white.svg"
              alt="Almosafer"
              className="h-6 w-auto md:h-6 md:px-15"
            />
          </Link>
        </div>

        {/* Right: Desktop actions */}
        <div className="hidden items-center gap-6 text-sm md:flex md:px-10">
          {/* Currency */}
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition"
          >
            <span>AED</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7L10 12L15 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Language */}
          <button
            type="button"
            className="text-sm font-medium text-white/90 hover:text-white transition"
          >
            العربية
          </button>

          {/* Retrieve my trip */}
          <Link
            href="/trips/retrieve"
            className="text-sm font-medium text-white/90 hover:text-white transition"
          >
            Retrieve my trip
          </Link>

          {/* WhatsApp + phone */}
          <a
            href="https://wa.me/966554400000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full">
            <WhatsAppIcon sx={{ color: "#ffff" }} fontSize="small" />
            </span>
            <span className="whitespace-nowrap">+966554400000</span>
          </a>

          {/* Sign in */}
          <Link
            href="/auth/signin"
            className="rounded-full border border-white px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0E3A43]"
          >
            Sign in
          </Link>
        </div>

        {/* Right: Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-1 text-white md:hidden"
          onClick={toggleMobile}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileOpen ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden origin-top transform bg-[${NAV_BG}] text-white transition-all duration-200 ease-out ${
          mobileOpen
            ? "max-h-96 opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 px-4 pb-4 pt-2 text-sm">
          {/* Currency + language row */}
          <div className="flex items-center justify-between gap-4 pb-2">
            <button
              type="button"
              className="flex items-center gap-1 font-medium text-white/90 hover:text-white transition"
            >
              <span>AED</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7L10 12L15 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="font-medium text-white/90 hover:text-white transition"
            >
              العربية
            </button>
          </div>

          <div className="h-px bg-white/10" />

          <Link
            href="/trips/retrieve"
            className="block py-1.5 font-medium text-white/90 hover:text-white transition"
            onClick={() => setMobileOpen(false)}
          >
            Retrieve my trip
          </Link>

          <a
            href="https://wa.me/966554400000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-1.5 font-medium text-white/90 hover:text-white transition"
            onClick={() => setMobileOpen(false)}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-white"
              >
                <path
                  d="M12 3C7.582 3 4 6.582 4 11c0 1.38.352 2.673 1.029 3.835L4 21l6.304-1.999A7.92 7.92 0 0 0 12 19c4.418 0 8-3.582 8-8s-3.582-8-8-8Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.8 13.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-1-.5-.5-.8-1.1-.9-1.3-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1 0-.2 0-.3 0-.1-.4-1.1-.6-1.5-.2-.4-.3-.3-.4-.3h-.3c-.1 0-.3.1-.4.2-.1.1-.5.5-.5 1.2 0 .7.5 1.3.6 1.4.1.1 1 1.5 2.4 2.1.3.1.6.2.8.3.3.1.5.1.7.1.2 0 .7-.2.8-.5.1-.3.1-.6.1-.7 0-.1-.1-.1-.3-.2Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="whitespace-nowrap">+966554400000</span>
          </a>

          <Link
            href="/auth/signin"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-white px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0E3A43]"
            onClick={() => setMobileOpen(false)}
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

