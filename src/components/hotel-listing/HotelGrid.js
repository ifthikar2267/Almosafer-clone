"use client";

import HotelCard from "./HotelCard";

/**
 * Grid of hotel cards. Smooth re-render via key on list.
 */
export default function HotelGrid({ hotels = [], searchParams = "" }) {
  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-200 sm:grid-cols-1 lg:grid-cols-1">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel._id ?? hotel.id}
          hotel={hotel}
          searchParams={searchParams}
        />
      ))}
    </div>
  );
}
