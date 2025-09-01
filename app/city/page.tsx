import { Suspense } from "react";
import City from "./city";

type Room = {
  adults: number;
  children: number;
};

export default function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const rooms: Room[] = searchParams.rooms ? JSON.parse(searchParams.rooms) : [];
  const checkIn: Date | null = searchParams.checkIn ? new Date(searchParams.checkIn) : null;
  const checkOut: Date | null = searchParams.checkOut ? new Date(searchParams.checkOut) : null;

  return (
    <Suspense fallback={<div className="bg-white text-red-800 font-bold text-xl h-screen w-screen flex items-center justify-center">Loading city...</div>}>
      <City
        city={searchParams.city || ""}
        rooms={rooms}
        checkIn={checkIn}
        checkOut={checkOut}
      />
    </Suspense>
  );
}
