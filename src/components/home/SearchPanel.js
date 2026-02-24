"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useDestination } from "@/context/DestinationContext";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";

export default function SearchPanel({ onSubmit }) {
  const { destination, checkIn, setCheckIn, checkOut, setCheckOut, rooms } = useDestination();
  const [localDestination, setLocalDestination] = useState(destination || "");
  const router = useRouter();

  const handleSearch = () => {
    const adults = rooms?.reduce((s, r) => s + (r?.adults ?? 0), 0) ?? 2;
    const children = rooms?.reduce((s, r) => s + (r?.children ?? 0), 0) ?? 0;
    const payload = {
      destination: localDestination || destination,
      checkIn: checkIn || new Date(),
      checkOut: checkOut || addDays(new Date(), 1),
      rooms: rooms || [{ adults, children }],
    };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      const params = new URLSearchParams();
      if (payload.destination) params.set("city", payload.destination);
      params.set("checkIn", payload.checkIn.toISOString());
      params.set("checkOut", payload.checkOut.toISOString());
      params.set("rooms", JSON.stringify(payload.rooms));
      router.push(`/city?${params.toString()}`);
    }
  };

  return (
    <Box className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center">
      <TextField
        size="small"
        placeholder="Destination"
        value={localDestination}
        onChange={(e) => setLocalDestination(e.target.value)}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "white" } }}
      />
      <TextField
        size="small"
        type="date"
        label="Check-in"
        value={checkIn ? checkIn.toISOString().slice(0, 10) : ""}
        onChange={(e) => e.target.value && setCheckIn(new Date(e.target.value))}
        InputLabelProps={{ shrink: true }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "white" } }}
      />
      <TextField
        size="small"
        type="date"
        label="Check-out"
        value={checkOut ? checkOut.toISOString().slice(0, 10) : ""}
        onChange={(e) => e.target.value && setCheckOut(new Date(e.target.value))}
        InputLabelProps={{ shrink: true }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "white" } }}
      />
      <TextField
        size="small"
        label="Guests"
        value={rooms?.reduce((s, r) => s + (r?.adults ?? 0) + (r?.children ?? 0), 0) ?? 2}
        InputProps={{ readOnly: true }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "white" } }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ bgcolor: "#ee4056", borderRadius: "12px", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#d9364c" } }}
      >
        Search
      </Button>
    </Box>
  );
}
