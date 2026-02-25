"use client";

import RoomCard from "./RoomCard";

export default function RoomsSection({ rooms = [], searchParams = "" }) {
  const list = Array.isArray(rooms) ? rooms : [];

  if (list.length === 0) {
    return (
      <section id="rooms" className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Room Choices</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">No room information available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Room Choices</h2>
        <div className="space-y-6">
          {list.map((room, i) => (
            <RoomCard key={i} room={room} searchParams={searchParams} />
          ))}
        </div>
      </div>
    </section>
  );
}
