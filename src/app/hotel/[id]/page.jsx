"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getHotelById } from "@/services/hotel.service";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { MapPin } from "lucide-react";

const formatAED = (n) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(n ?? 0);

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getHotelById(id)
      .then(setHotel)
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 p-4">
        <Typography variant="h6" color="text.secondary">Hotel not found</Typography>
        <Button component={Link} href="/city" variant="contained" sx={{ bgcolor: "#ee4056", "&:hover": { bgcolor: "#d9364c" } }}>
          Back to search
        </Button>
      </div>
    );
  }

  const imageUrl = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop";

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/city" className="text-[#004C5A] font-medium text-sm hover:underline">
          ← Back to results
        </Link>
        <Button component={Link} href="/" variant="outlined" size="small" sx={{ borderColor: "#004C5A", color: "#004C5A" }}>
          Home
        </Button>
      </header>
      <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
        <img
          src={imageUrl}
          alt={hotel.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          {hotel.title}
        </Typography>
        {hotel.location && (
          <Box className="flex items-center gap-1 text-gray-600 mb-2">
            <MapPin size={18} />
            <Typography variant="body2">{hotel.location}</Typography>
          </Box>
        )}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {hotel.propertyType || "Hotel"} {hotel.star ? ` · ${hotel.star} stars` : ""}
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#004C5A" }}>
          {formatAED(hotel.startingPrice ?? hotel.price)} per night
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.5, bgcolor: "#ee4056", "&:hover": { bgcolor: "#d9364c" } }}
        >
          Book now
        </Button>
      </Box>
    </div>
  );
}
