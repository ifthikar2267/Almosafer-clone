"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchPanel from "@/components/home/SearchPanel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function StayPage() {
  const router = useRouter();

  const handleSubmit = ({ destination, checkIn, checkOut, rooms }) => {
    const params = new URLSearchParams();
    if (destination) params.set("city", destination);
    params.set("checkIn", checkIn.toISOString());
    params.set("checkOut", checkOut.toISOString());
    params.set("rooms", JSON.stringify(rooms));
    router.push(`/city?${params.toString()}`);
  };

  return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 6, px: 2 }}>
        <Box sx={{ maxWidth: 640, mx: "auto" }}>
          <Link href="/" className="text-[#004C5A] font-medium text-sm hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Search Stays
          </Typography>
          <Box sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1 }}>
            <SearchPanel onSubmit={handleSubmit} />
          </Box>
        </Box>
      </Box>
  );
}
