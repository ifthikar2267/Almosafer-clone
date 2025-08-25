"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Plane, Bed, Mountain, Search, User, CalendarCheck, Tag, Repeat, Train, Car, Globe, MapPin, DollarSign, ChevronRight } from "lucide-react";


export default function Home() {

   const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="bg-white min-h-screen font-sans overflow-y-auto no-scrollbar">
      {/* Header */}
       <header className="relative flex items-center justify-center p-4 bg-[#e6f4f7] shadow-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-4 text-[#004E66] md:hidden"
        >
          <Bars3Icon className="w-6 h-6 text-cyan-600" />
        </button>
      {/* Centered Logo */}
      <Image
        src="/Headerlogo.png"
        alt="Logo"
        width={135}
        height={60}
        priority
      />
    </header>

    {/* Bottom Sheet Menu */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-x-0 bottom-0 max-h-[100vh] bg-white shadow-lg p-6 animate-slide-up overflow-y-auto">

          {/* Close Button */}
          <div className="relative flex items-center mb-6">
            {/* Close button on the left */}
            <button onClick={() => setIsOpen(false)} className="absolute left-0">
              <XMarkIcon className="w-6 h-6 text-cyan-600" />
            </button>

            {/* Centered text */}
            <h2 className="mx-auto text-lg font-semibold text-gray-600">Options</h2>
          </div>


          {/* Menu Items */}
          <nav className="space-y-4 space-y-4 overflow-y-auto h-[500px] no-scrollbar">
  {/* Top Menu */}
  <div className="divide-y divide-gray-200">
    <button className="w-full flex items-center justify-between px-1 p-4 hover:bg-gray-100">
      <span className="flex items-center gap-4 text-gray-700">
        <Search className="w-6 h-6 text-gray-700" /> Home
      </span>
      <ChevronRight className="w-5 h-5 text-cyan-600" />
    </button>

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
  <span className="flex items-center gap-4 text-gray-700text-gray-700">
    <Tag className="w-6 h-6 text-gray-700text-gray-700" /> Offers
  </span>
  <ChevronRight className="w-5 h-5 text-cyan-600" />
</button>

  </div>

  {/* Section Title */}
  <h2 className="px-2 py-2 text-lg font-semibold text-gray-600">Our Products</h2>

  {/* Product Menu */}
  <div className="divide-y divide-gray-200">
    <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100">
  <span className="flex items-center gap-4 text-gray-700text-gray-700">
    <Plane className="w-6 h-6 text-gray-700text-gray-700" /> Flights
  </span>
  <ChevronRight className="w-5 h-5 text-cyan-600" />
</button>

<button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100">
  <span className="flex items-center gap-4 text-gray-700text-gray-700">
    <Bed className="w-6 h-6 text-gray-700text-gray-700" /> Stays
  </span>
  <ChevronRight className="w-5 h-5 text-cyan-600" />
</button>

<button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100 border-b border-gray-200">
  <span className="flex items-center gap-4 text-gray-700text-gray-700">
    <Mountain className="w-6 h-6 text-gray-700text-gray-700" /> Activities
  </span>
  <ChevronRight className="w-5 h-5 text-cyan-600" />
</button>

  </div>

  {/* Section Title */}
  <h2 className="px-2 py-2 text-lg font-semibold text-gray-600">Settings</h2>

  {/* Settings Menu */}
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

      {/* Greeting */}
      <section className="relative p-4 bg-[#e6f4f7]">
        <h2 className="text-md text-black font-bold">Hi there</h2>
        <p className="text-gray-600 text-sm">What will you explore next?</p>

        {/* Sign in on the right */}
      <button className="absolute right-4 top-7 text-cyan-600 font-medium">
       <p className="text-sm"> Sign in </p>
      </button>
      </section>

      {/* Main options */}
      <section className="grid grid-cols-3 gap-3 p-4 bg-[#e6f4f7]">
        <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
          <Plane className="w-6 h-6 text-black" />
          <span className="mt-2 text-sm text-gray-800">Flights</span>
        </div>
        <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
          <Bed className="w-6 h-6 text-black" />
          <span className="mt-2 text-sm text-gray-800">Stays</span>
        </div>
        <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm relative">
          <Mountain className="w-6 h-6 text-black" />
          <span className="mt-2 text-sm text-gray-800">Activities</span>
          <span className="absolute -top-2 right-8 bg-green-500 text-white  text-xs px-2 py-1 rounded-sm">
            New
          </span>
        </div>
      </section>

      {/* More services */}
      <section className="p-4 bg-white">
        <h3 className="text-base text-black mb-5">More services</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
            <Repeat className="w-6 h-6 text-black" />
            <span className="mt-2 text-xs font-medium text-center text-gray-800">
              Airport transfer
            </span>
          </div>
          <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
           <Train className="w-6 h-6 text-black" />
            <span className="mt-2 text-xs font-medium text-center text-gray-800">
              Haramain Railway
            </span>
          </div>
          <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
           <Car className="w-6 h-6 text-black" />
            <span className="mt-2 text-xs font-medium text-center text-gray-800">
              Car rental
            </span>
          </div>
          <div className="rounded-xl bg-white p-6 flex flex-col items-center shadow-sm text-black">
            ⋯
            <span className="mt-2 text-xs font-medium text-center text-gray-800">
              See more
            </span>
          </div>
        </div>
      </section>

      {/* Deals */}
      <section >
        <div className="flex items-center justify-between  p-4">
          <h3 className="text-base text-black">
            Top summer deals for you
          </h3>
          <button className="text-cyan-600 text-sm font-medium">View all</button>
        </div>

        <div className="overflow-x-auto flex gap-4 no-scrollbar p-4">
          {/* Deal Card 1 */}
          <div className="min-w-[250px] rounded-xl bg-white shadow-md overflow-hidden">
            <div>
              <Image
                src="/hiking.jpg"
                alt="Logo"
                width={270}
                height={30}
                priority
              />
            </div>
            <div className="p-4">
              <p className="font-medium text-black">Summer bliss after the buzz</p>
              <p className="text-sm text-gray-600">
                Quieter escapes with up to ﷼ 5,000 OFF
              </p>
            </div>
          </div>

          {/* Deal Card 2 */}
          <div className="min-w-[250px] rounded-xl bg-white shadow-md overflow-hidden">
            <div>
              <Image
                src="/MANALI.jpg"
                alt="Logo"
                width={270}
                height={30}
                priority
              />
            </div>
            <div className="p-4">
              <p className="font-medium text-black">Enjoy your stay</p>
              <p className="text-sm text-gray-600">
                Discounts on top-rated hotels worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
