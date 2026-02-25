"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { formatAED } from "@/lib/formatAED";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";

export default function SimilarPropertyCard({ property, searchParams = "" }) {
  const imageUrl =
    property?.thumbnail || property?.images?.[0] || PLACEHOLDER_IMAGE;
  const name = property?.title ?? property?.name ?? "Property";
  const price = property?.price ?? property?.base_price ?? 0;
  const oldPrice = property?.oldPrice ?? property?.first_price ?? null;
  const reviewScore = Number(property?.reviewScore ?? 0);
  const starRating = Number(property?.star ?? property?.starRating ?? 0);
  const propertyType = property?.propertyType ?? property?.hotelType ?? "Hotel";
  const address =
    property?.address ?? property?.location ?? property?.city ?? "";
  const id = property?._id ?? property?.id;
  const priceDropPercent =
    oldPrice && price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  const href = `/hotels/${id}${searchParams ? `?${searchParams}` : ""}`;

  return (
    <Card
      elevation={0}
      className="flex h-100px shrink-0 snap-start flex-col cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md w-[85%] sm:w-[60%] md:w-[48%] lg:w-[30%] xl:w-[23%]"
      sx={{ minWidth: 280 }}
      component={Link}
      href={href}
    >
      <div className="relative shrink-0">
        <CardMedia
          component="img"
          height="160"
          image={imageUrl}
          alt={name}
          className="object-cover"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          sx={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            height: "180px",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Typography
          variant="subtitle1"
          fontWeight={700}
          className="line-clamp-2 text-gray-900"
          component="h3"
        >
          {name}
        </Typography>
        {reviewScore > 0 && (
          <div
            className="ml-auto shrink-0 rounded-md bg-[#22c55e] px-2 py-1 text-sm font-bold text-white"
            aria-label={`Rating ${reviewScore}`}
          >
            {reviewScore.toFixed(1)}
          </div>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
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
            {propertyType}
          </Typography>
          {starRating > 0 && (
            <Rating
              value={starRating}
              readOnly
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={{ "& .MuiRating-iconFilled": { color: "#fbbf24" } }}
            />
          )}
        </div>
        {address && (
          <div className="mt-1.5 flex items-start gap-1 text-gray-600">
            <LocationOnIcon sx={{ fontSize: 18, mt: 0.25 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              className="line-clamp-1"
            >
              {address}
            </Typography>
          </div>
        )}

        {priceDropPercent != null && oldPrice != null && (
          <div className="mt-2 space-y-0.5">
            <Typography
              variant="caption"
              sx={{ color: "#22c55e", fontWeight: 600 }}
            >
              Price has dropped by {priceDropPercent}%
            </Typography>
            <div className="flex items-baseline gap-2">
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  textDecoration: "line-through",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {formatAED(oldPrice)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: "#0C9AB0" }}
              >
                {formatAED(price)}
              </Typography>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Typography
            variant="body1"
            fontWeight={700}
            sx={{ color: "#0C9AB0" }}
          >
            {formatAED(price)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Avg. per night (incl. VAT)
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="medium"
            className="mt-2 rounded-full font-semibold normal-case"
            sx={{
              bgcolor: "#ee4056",
              py: 1.25,
              "&:hover": { bgcolor: "#d9364c" },
            }}
          >
            See rooms
          </Button>
        </div>
      </div>
    </Card>
  );
}
