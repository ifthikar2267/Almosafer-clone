"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { getHotelById } from "@/services/hotel.service";
import HotelHero from "@/components/hotel-detail/HotelHero";
import HotelOverview from "@/components/hotel-detail/HotelOverview";
import AmenitiesSection from "@/components/hotel-detail/AmenitiesSection";
import RoomsSection from "@/components/hotel-detail/RoomsSection";
import BookingSidebar from "@/components/hotel-detail/BookingSidebar";
import FAQSection from "@/components/hotel-detail/FAQSection";

const RED = "#ee4056";

function getFaqList(hotel) {
  const faqSource = hotel?.raw?.faq ?? hotel?.raw?.faqs ?? hotel?.faq ?? [];
  if (Array.isArray(faqSource)) return faqSource;
  if (typeof faqSource === "object")
    return Object.entries(faqSource).map(([q, a]) => ({ question: q, answer: a }));
  return [];
}

export default function HotelDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const searchParamsString = searchParams?.toString() ? searchParams.toString() : "";

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getHotelById(id)
      .then((h) => {
        setHotel(h);
        setError(null);
      })
      .catch((err) => {
        setHotel(null);
        setError(err?.message || "Failed to load hotel");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
          <Skeleton width={120} height={28} />
        </header>
        <div className="flex gap-2 h-[400px] md:h-[480px] px-4 pt-4">
          <Skeleton variant="rectangular" className="flex-1 rounded-xl" height="100%" />
          <div className="hidden md:grid grid-cols-2 gap-2 w-[30%] max-w-[360px]">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" className="rounded-lg" height="100%" />
            ))}
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-10 pb-8">
          <Skeleton width="70%" height={40} sx={{ mb: 2 }} />
          <Skeleton width={180} height={32} sx={{ mb: 2 }} />
          <Skeleton width="60%" height={24} />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton variant="rectangular" height={120} className="rounded-xl" />
            <Skeleton variant="rectangular" height={200} className="rounded-xl" />
            <Skeleton variant="rectangular" height={280} className="rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton variant="rectangular" height={160} className="rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4">
        <Typography variant="h6" color="text.secondary">
          {error || "Hotel not found"}
        </Typography>
        <Button
          component={Link}
          href={`/hotels${searchParamsString ? `?${searchParamsString}` : ""}`}
          variant="contained"
          sx={{ bgcolor: RED, "&:hover": { bgcolor: "#d9364c" } }}
        >
          Back to hotels
        </Button>
      </div>
    );
  }

  const faqList = getFaqList(hotel);
  const description = hotel.description ?? "";
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
  const price = hotel.startingPrice ?? hotel.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link
            href={`/hotels${searchParamsString ? `?${searchParamsString}` : ""}`}
            className="text-sm font-medium text-[#004C5A] hover:underline"
          >
            ← Back to hotels
          </Link>
          <Button component={Link} href="/" variant="outlined" size="small" sx={{ borderColor: "#004C5A", color: "#004C5A" }}>
            Home
          </Button>
        </div>
      </header>

      <main>
        <HotelHero hotel={hotel} />

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24 lg:pb-12">
          <div className="lg:col-span-2">
            <HotelOverview description={description} />
            <AmenitiesSection amenities={amenities} />
            <RoomsSection rooms={rooms} searchParams={searchParamsString} />
            <div id="faq">
              <FAQSection faqList={faqList} />
            </div>
          </div>

          <BookingSidebar price={price} searchParams={searchParamsString} />
        </div>

        {/* Mobile sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div>
              <Typography variant="body2" color="text.secondary">From</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#004C5A" }}>
                {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(price)} / night
              </Typography>
            </div>
            <Button
              component={Link}
              href={`#rooms${searchParamsString ? `?${searchParamsString}` : ""}`}
              variant="contained"
              size="large"
              className="rounded-lg font-semibold px-6"
              sx={{ bgcolor: RED, "&:hover": { bgcolor: "#d9364c" } }}
            >
              Book now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
