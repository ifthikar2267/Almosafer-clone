import { Suspense } from "react";
import City from "./city";

export default async function Page({ searchParams }) {
  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams || {};
  let rooms = [];
  if (params.rooms) {
    try {
      rooms = typeof params.rooms === "string" ? JSON.parse(params.rooms) : Array.isArray(params.rooms) ? params.rooms : [];
    } catch {
      rooms = [];
    }
  }
  const checkIn = params.checkIn ? new Date(params.checkIn) : null;
  const checkOut = params.checkOut ? new Date(params.checkOut) : null;

  return (
    <Suspense>
      <City
        city={params.city || ""}
        rooms={rooms}
        checkIn={checkIn}
        checkOut={checkOut}
      />
    </Suspense>
  );
}
