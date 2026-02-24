"use client";

import Link from "next/link";
import Image from "next/image";

const HEADER_TEAL = "#004C5A";
const LOGO_WHITE =
  "https://static-sites.almosafer.com/assets/images/svg/logos/almosafer-re-en-white.svg";

export default function ListingHeader() {
  return (
    <header
      className="sticky top-0 z-50 w-full shadow-md"
      style={{ backgroundColor: HEADER_TEAL }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={LOGO_WHITE} alt="Almosafer" width={140} height={36} className="h-8 w-auto" unoptimized />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="text-sm text-white/95 hover:text-white">
            Retrieve my trip
          </Link>
          <a href="tel:+966554400000" className="hidden text-sm text-white/95 hover:text-white md:inline">
            +966554400000
          </a>
          <button
            type="button"
            className="rounded-lg border-0 bg-white px-4 py-2 text-sm font-semibold shadow-sm text-[#004C5A] hover:bg-white/95"
          >
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
}
