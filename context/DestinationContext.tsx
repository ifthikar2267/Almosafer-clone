"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Room = {
  adults: number;
  children: number;
};

type DestinationContextType = {
  destination: string;
  setDestination: (value: string) => void;
  rooms: Room[];
  setRooms: (value: Room[]) => void;
  checkIn: Date | null;
  setCheckIn: (value: Date | null) => void;
  checkOut: Date | null;
  setCheckOut: (value: Date | null) => void;
};

const DestinationContext = createContext<DestinationContextType | undefined>(
  undefined
);

export function DestinationProvider({ children }: { children: ReactNode }) {
  const today = new Date();

  const [destination, setDestination] = useState("");
  const [rooms, setRooms] = useState<Room[]>([{ adults: 2, children: 0 }]);
  const [checkIn, setCheckIn] = useState<Date | null>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(
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
