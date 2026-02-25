"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const DEFAULT_ADDRESS = "3 El Thawra Council St Zamalek";
const DEFAULT_RATING = 8.4;
const DEFAULT_LABEL = "Very good";
const DEFAULT_COUNT = "1001 ratings";
const SCORES = [
  { label: "Cleanliness", value: 8.6 },
  { label: "Location", value: 9.0 },
  { label: "Service", value: 8.4 },
];

export default function HotelHeader({
  name = "Hotel Name",
  propertyType = "Hotel",
  starRating = 5,
  address = DEFAULT_ADDRESS,
  rating = DEFAULT_RATING,
  ratingLabel = DEFAULT_LABEL,
  ratingCount = DEFAULT_COUNT,
  scores = SCORES,
}) {
  return (
    <Box className="border-b border-gray-200 bg-white px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Left */}
          <div className="min-w-0 flex-1 space-y-3">
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              className="text-gray-900"
              sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" } }}
            >
              {name}
            </Typography>
            <div className="flex flex-wrap items-center gap-2 mt-2">
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
            <div className="flex items-start gap-2 text-gray-600">
              <LocationOnIcon sx={{ fontSize: 20, mt: 0.25, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {address}
              </Typography>
            </div>
          </div>

          {/* Right – Rating card */}
          <Card
            className="w-full shrink-0 rounded-lg border border-gray-200 bg-gray-50 shadow-sm md:w-72"
            elevation={0}
            sx={{ p: 2 }}
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#22c55e" }}
              >
                {rating}
              </Typography>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {ratingLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ratingCount}
              </Typography>
            </div>
            <Box className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 border-t border-gray-200 pt-3">
              {scores.map(({ label, value }) => (
                <div key={label} className="flex items-baseline gap-1">
                  <Typography variant="caption" fontWeight={600} color="text.primary">
                    {label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {value}
                  </Typography>
                </div>
              ))}
            </Box>
          </Card>
        </div>
      </div>
    </Box>
  );
}
