"use client";
import { createContext, useContext, useState } from "react";

const DestinationContext = createContext(undefined);

export function DestinationProvider({ children }) {
  const today = new Date();
  const [destination, setDestination] = useState("");
  const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  );

  return (
    <DestinationContext.Provider
      value={{
        destination,
        setDestination,
        rooms,
        setRooms,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestination must be used within DestinationProvider");
  }
  return context;
}
