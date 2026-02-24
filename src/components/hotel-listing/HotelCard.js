"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { MapPin } from "lucide-react";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";

const formatAED = (amount) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const RATING_LEVELS = [
  { min: 9.5, max: 10.0, labelEn: "Superb", labelAr: "رائع" },
  {
    min: 8.5,
    max: 9.4,
    color: "#129911",
    labelEn: "Excellent",
    labelAr: "ممتاز",
  },
  {
    min: 7.5,
    max: 8.4,
    color: "#71bc4c",
    labelEn: "Very good",
    labelAr: "جيد جدا",
  },
  { min: 6.5, max: 7.4, labelEn: "Good", labelAr: "جيد" },
  {
    min: 6.0,
    max: 6.4,
    color: "#f5a623",
    labelEn: "Average",
    labelAr: "متوسط",
  },
  { min: 0, max: 5.9, labelEn: "Fair", labelAr: "مقبول" },
];

function getRatingDetails(score) {
  const numericScore = Number(score);
  if (isNaN(numericScore)) return null;

  return (
    RATING_LEVELS.find(
      (level) => numericScore >= level.min && numericScore <= level.max,
    ) || null
  );
}

/**
 * Hotel card – Almosafer-style row layout: image left, details center, rating + price + CTA right.
 * Displays average rating (green pill), total reviews, and price highlight.
 */
export default function HotelCard({ hotel, searchParams = "" }) {
  const imageUrl = hotel.thumbnail || hotel.images?.[0] || PLACEHOLDER_IMAGE;
  const title = hotel.title ?? hotel.name ?? "Hotel";
  const price = hotel.startingPrice ?? hotel.price ?? 0;
  const reviewScore = Number(hotel.reviewScore ?? hotel.averageRating ?? 0);
  const totalReviews = Number(hotel.totalReviews ?? 0);
  const starRating = Number(hotel.star ?? hotel.starRating) || 0;
  const hotelType = hotel.propertyType ?? hotel.hotelType ?? "Hotel";
  const address =
    hotel.address ??
    hotel.location ??
    [hotel.city, hotel.country].filter(Boolean).join(", ") ??
    "";

  const href = `/hotels/${hotel._id ?? hotel.id}${searchParams ? `?${searchParams}` : ""}`;
  const ratingDetails = getRatingDetails(reviewScore);
  const showRatingBlock = reviewScore > 0 || totalReviews > 0;

  return (
    <Box
      component={Link}
      href={href}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white no-underline text-inherit md:flex-row"
      sx={{
        color: "inherit",
        textDecoration: "none",
      }}
    >
      {/* Image — left on desktop */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100 md:h-56 md:w-56 md:min-w-[14rem]">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-105"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      {/* Center — name, type, stars, address, amenities */}
      <Box className="flex min-w-0 flex-1 flex-col justify-between p-4 text-start">
        <div>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 600,
              color: "#333333",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Box className="flex items-center flex-wrap mb-2 gap-2">
            {/* LEFT → Hotel Type */}
            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                lineHeight: "16px",
                fontWeight: 600,
                color: "rgb(12, 154, 176)",
                display: "inline-flex",
                alignItems: "center",
                px: 1,
                py: 0.5,
                borderRadius: "4px",
                backgroundColor: "rgb(233, 246, 248)",
              }}
            >
              {hotelType}
            </Typography>

            {/* RIGHT → Star Rating */}
            {starRating > 0 && (
              <Rating
                name="read-only"
                value={starRating}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": { color: "#fbbf24" },
                }}
              />
            )}
          </Box>
          {address && (
            <Box className="flex items-start gap-1.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
              <Typography
                variant="body2"
                color="text.secondary"
                className="line-clamp-2"
              >
                {address}
              </Typography>
            </Box>
          )}
        </div>
      </Box>
      {/* Right — rating pill, total reviews, price, CTA */}
     <Box className="flex flex-col gap-4 border-l border-gray-200 p-6">

  {/* Row 1 → Review + Rating */}
  {(showRatingBlock) && (
    <Box className="flex items-center gap-3">
      
      {/* LEFT → Label + Reviews */}
      <Box className="flex flex-col">
        {ratingDetails && (
          <Typography
            sx={{
              m: 0,
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              color: "rgb(12, 154, 176)",
            }}
          >
            {ratingDetails.labelEn}
          </Typography>
        )}

        {totalReviews > 0 && (
          <Typography color="text.secondary" sx={{ fontSize: "12px"}}>
            {totalReviews} Guest review{totalReviews !== 1 ? "s" : ""}
          </Typography>
        )}
      </Box>

      {/* RIGHT → Avg Rating */}
      <Box
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "4px",
          backgroundColor: "rgb(18, 153, 17)",
          minWidth: "40px",
          height: "40px",
        }}
      >
        <Typography sx={{ fontSize: "18px", lineHeight: 1 }}>
          {reviewScore > 0 ? Number(reviewScore).toFixed(1) : "—"}
        </Typography>
      </Box>

    </Box>
  )}

  {/* Row 2 → Price Section (NOW BELOW) */}
  <Box className="flex flex-col items-end">
    <Typography
      fontWeight={600}
      sx={{ color: "#0C9AB0;", fontSize: "16px", pt: 5}}
    >
      {formatAED(price)}
    </Typography>

    <Typography variant="caption" color="text.secondary">
      Avg. per night (incl. VAT)
    </Typography>

    <Box
      component="span"
      className="inline-flex items-center justify-center rounded-2xl font-semibold py-2 px-10 mt-2 w-full md:w-auto bg-[#ee4056] text-white text-sm"
      sx={{
        bgcolor: "#EF4550",
        "&:hover": { bgcolor: "#D23241" },
      }}
    >
      See rooms
    </Box>
  </Box>

</Box>
    </Box>
  );
}
