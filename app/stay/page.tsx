"use client"

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Bed, Mountain, Search, User, CalendarCheck, Tag, Globe, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import DestinationSearch from "../../component/DestinationSearch";
import Guests from "../../component/Guests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Stay ({ onSuccess }: { onSuccess?: () => void }) {

    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
     const today = new Date();
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState( new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    const [isGuestsOpen, setIsGuestsOpen] = useState(false);
    const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);
    const [isOpened, setIsOpened] = useState(false);
    const [destination, setDestination] = useState("");



    return (
        <div className="bg-white min-h-screen">
            <header className="relative flex items-center justify-center p-4 bg-[#ffffff]">
                    <button
                    onClick={() => setIsOpen(true)}
                    className="absolute right-4 text-[#004E66] md:hidden"
                    >
                    <Bars3Icon className="w-6 h-6 text-cyan-600" />
                    </button>
                    <button 
                     onClick={() => router.back()}
                     className="absolute left-4 md:hidden">
                        <ArrowLeftIcon className="h-6 w-6 text-cyan-600" />
                    </button>
                {/* Centered Logo */}
                <h1 className="text-lg p-2 text-black">Properties search</h1>
                </header>

                    <Dialog
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        className="relative z-50"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                
                    <div className="fixed inset-0 bg-white shadow-lg animate-slide-up flex flex-col p-4">
                
                        {/* Close Button */}
                        <div className="relative flex items-center mb-6">
                            <button onClick={() => setIsOpen(false)} className="absolute left-0">
                            <XMarkIcon className="w-6 h-6 text-cyan-600" />
                            </button>
                
                            {/* Centered text */}
                            <h2 className="mx-auto text-lg font-semibold text-gray-600">Options</h2>
                        </div>
                
                
                        {/* Menu Items */}
                        <nav className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                {/* Top Menu */}
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
                
                {/* Section Title */}
                <h2 className="px-2 py-2 text-lg font-semibold text-gray-600">Our Products</h2>
                
                {/* Product Menu */}
                <div className="divide-y divide-gray-200">
                    <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100">
                <span className="flex items-center gap-4 text-gray-700">
                    <Plane className="w-6 h-6 text-gray-700" /> Flights
                </span>
                <ChevronRight className="w-5 h-5 text-cyan-600" />
                </button>
                
               <Link href="/stay"> 
                <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100">
                    <span className="flex items-center gap-4 text-gray-700">
                        <Bed className="w-6 h-6 text-gray-700" /> Stays
                    </span>
                    <ChevronRight className="w-5 h-5 text-cyan-600" />
                    </button>
                </Link>
                
                <button className="w-full flex items-center justify-between gap-4 px-1 p-4 hover:bg-gray-100 border-b border-gray-200">
                <span className="flex items-center gap-4 text-gray-700">
                    <Mountain className="w-6 h-6 text-gray-700" /> Activities
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

                        <div className="max-w-md mx-auto p-4 bg-white">
                        {/* Heading */}
                        <p className="text-center text-gray-600 mb-6 text-sm">
                            More than 1 million properties at your fingertips!
                        </p>

                        {/* Card */}
                        <div className="border border-gray-300 rounded-xl p-2">
                            {/* Destination */}
                            
                            <div className="flex items-center space-x-1">
                            <span className="text-gray-500"><MapPin/></span>
                            <div
        className="p-3 flex items-center w-full cursor-pointer"
        onClick={() => setIsOpened(true)}
      >
        {destination ? (
          <div className="space-x-2">
             <p className="text-sm text-gray-500 ">Destination</p>
            <span className="text-gray-800">{destination}</span>
          </div>
        ) : (
            <div>
                 <p className="text-sm text-gray-500 ">Choose your</p>
                <span className={destination ? "text-gray-800" : "text-gray-600"}>
                    {destination || "Destination"}
                </span>
            </div>
          
        )}
      </div>

      {/* Modal */}
      <DestinationSearch
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        onSelect={setDestination}
      />
                            </div>

                            {/* Check-in / Check-out */}
                            <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 "><CalendarCheck/></span>
                                <div>
                                <p className="text-sm text-gray-500 px-2">Check in</p>
                                 <DatePicker
                                    selected={checkIn}
                                    onChange={(date) => {if (date) setCheckIn(date)}}
                                    selectsStart
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={new Date()}
                                    dateFormat="EEE dd MMM"
                                    className="outline-none focus:ring-0 focus:border-transparent text-gray-800 text-md p-2 w-full"
                                    />
                                </div>
                            </div>
                            <span className="text-gray-400 text-3xl pb-4"><ChevronRight/></span>
                            <div>
                                <p className="text-sm text-gray-500 px-10">Check out</p>
                                <DatePicker
                                selected={checkOut}
                                onChange={(date) => {
                                        if (date) setCheckOut(date);
                                    }}
                                selectsEnd
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={checkIn || new Date()}
                                 dateFormat="EEE dd MMM"
                                className="outline-none focus:ring-0 focus:border-transparent text-gray-800 text-md p-2 w-full px-10"
                                />
                            </div>
                            </div>

                            {/* Guests */}
                            <div
        className="flex items-center space-x-4 border-t border-gray-300 pt-3 cursor-pointer"
        onClick={() => setIsGuestsOpen(!isGuestsOpen)} 
      >
        <span className="text-gray-500">
          <User />
        </span>
        <div>
          <p className="text-sm text-gray-500">Guests</p>
         <p className="text-gray-800 text-md">
          {rooms.length} Room{rooms.length > 1 ? "s" : ""},{" "}
          {rooms.reduce((sum, r) => sum + r.adults, 0)} Adults
          {rooms.reduce((sum, r) => sum + r.children, 0) > 0 && (
            <> , {rooms.reduce((sum, r) => sum + r.children, 0)} Children</>
          )}
        </p>
        </div>
      </div>
       {isGuestsOpen && (
          <Guests rooms={rooms} setRooms={setRooms}           isOpened={isGuestsOpen} setIsOpened={setIsGuestsOpen}
/>
      )}
                        </div>

                        {/* Button */}
                        <button
                        onClick={() => {
                            if (destination) {
                            const city = destination.split(",")[0].trim();

                            router.push(
                                `/city?city=${encodeURIComponent(city)}&rooms=${encodeURIComponent(
                                JSON.stringify(rooms)
                                )}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`
                            );
                            onSuccess?.();
                            }
                        }}
                        className="mt-7 w-full bg-[#ee4056] text-white py-3 rounded-full font-medium flex items-center justify-center gap-3"
                        >
                        <Search /> Search stays
                        </button>


                        </div>


        </div>          
            
    )
}