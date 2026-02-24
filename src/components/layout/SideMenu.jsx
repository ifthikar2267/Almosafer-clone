"use client";

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Plane, Bed, Mountain, Search, User, CalendarCheck, Tag, Globe, MapPin, DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * Shared bottom sheet / slide-up menu (Options) used on Home and Stay pages.
 */
export default function SideMenu({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 bg-white shadow-lg animate-slide-up flex flex-col p-4">
        <div className="relative flex items-center mb-6">
          <button onClick={onClose} className="absolute left-0">
            <XMarkIcon className="w-6 h-6 text-cyan-600" />
          </button>
          <h2 className="mx-auto text-lg font-semibold text-gray-600">Options</h2>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
          <div className="divide-y divide-gray-200">
            <Link href="/">
              <button className="w-full flex items-center justify-between px-1 p-4 hover:bg-gray-100">
                <span className="flex items-center gap-4 text-gray-700">
                  <Search className="w-6 h-6 text-gray-700" /> Home
                </span>
                <ChevronRight className="w-5 h-5 text-cyan-600" />
              </button>
            </Link>
            <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100">
              <span className="flex items-center gap-4 text-gray-700">
                <User className="w-6 h-6 text-gray-700" /> Profile
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
            <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100">
              <span className="flex items-center gap-4 text-gray-700">
                <CalendarCheck className="w-6 h-6 text-gray-700" /> Bookings
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
            <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100 border-b border-gray-200">
              <span className="flex items-center gap-4 text-gray-700">
                <Tag className="w-6 h-6 text-gray-700" /> Offers
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
          </div>

          <h2 className="px-2 py-2 text-lg font-semibold text-gray-600">Our Products</h2>
          <div className="divide-y divide-gray-200">
            <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100 hover:shadow-sm transition">
              <span className="flex items-center gap-4 text-gray-700">
                <Plane className="w-6 h-6 text-gray-700" /> Flights
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
            <Link href="/">
              <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100 hover:shadow-sm transition">
                <span className="flex items-center gap-4 text-gray-700">
                  <Bed className="w-6 h-6 text-gray-700" /> Stays
                </span>
                <ChevronRight className="w-5 h-5 text-cyan-600" />
              </button>
            </Link>
            <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100 border-b border-gray-200 hover:shadow-sm transition">
              <span className="flex items-center gap-4 text-gray-700">
                <Mountain className="w-6 h-6 text-gray-700" /> Activities
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
          </div>

          <h2 className="px-2 py-2 text-lg font-semibold text-gray-600">Settings</h2>
          <div className="divide-y divide-gray-200">
            <button className="w-full flex items-center gap-4 px-1 p-4 hover:bg-gray-100 justify-between">
              <span className="flex items-center gap-4 text-gray-700">
                <Globe className="w-6 h-6 text-gray-700" /> Change language
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
            <button className="w-full flex items-center gap-4 px-1 p-4 hover:bg-gray-100 justify-between">
              <span className="flex items-center gap-4 text-gray-700">
                <MapPin className="w-6 h-6 text-gray-700" /> Country
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
            <button className="w-full flex items-center gap-4 px-1 p-4 hover:bg-gray-100 border-b border-gray-200 justify-between">
              <span className="flex items-center gap-4 text-gray-700">
                <DollarSign className="w-6 h-6 text-gray-700" /> Display currency
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-600" />
            </button>
          </div>
        </nav>
      </div>
    </Dialog>
  );
}
