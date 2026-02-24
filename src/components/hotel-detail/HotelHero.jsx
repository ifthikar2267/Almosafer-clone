"use client";

import { useState } from "react";
import Rating from "@mui/material/Rating";
import { MapPin } from "lucide-react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop";

export default function HotelHero({ hotel }) {
  const [index, setIndex] = useState(0);
  const images = hotel?.images?.length ? hotel.images : [hotel?.thumbnail].filter(Boolean);
  const list = images.length ? images : [PLACEHOLDER];
  const main = list[index] || list[0];
  const thumbnails = list.slice(0, 5);
  const title = hotel?.title ?? hotel?.name ?? "";
  const star = Number(hotel?.star ?? hotel?.starRating ?? 0);
  const reviewScore = Number(hotel?.reviewScore ?? 0);
  const totalReviews = Number(hotel?.totalReviews ?? 0);
  const address = hotel?.address ?? hotel?.location ?? "";

  return (
    <section className="w-full">
      {/* Gallery: 70% main + 30% grid of 4 */}
      <div className="flex gap-2 h-[400px] md:h-[480px]">
        <div className="flex-1 min-w-0 relative rounded-xl overflow-hidden bg-gray-200">
          <img
            src={main}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
        </div>
        <div className="hidden md:grid grid-cols-2 gap-2 w-[30%] max-w-[360px] shrink-0">
          {thumbnails.slice(1, 5).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i + 1)}
              className={`relative rounded-lg overflow-hidden bg-gray-200 transition ring-2 ring-offset-2 ${
                index === i + 1 ? "ring-[#004C5A]" : "ring-transparent"
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover min-h-0"
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title, rating, address - large premium spacing */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-10 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {star > 0 && (
            <Rating
              value={star}
              readOnly
              size="medium"
              sx={{ "& .MuiRating-iconFilled": { color: "#fbbf24" } }}
            />
          )}
          {reviewScore > 0 && (
            <span className="inline-flex items-center rounded-lg px-3 py-1.5 bg-[#22c55e] text-white font-semibold text-sm">
              {reviewScore.toFixed(1)} · {totalReviews} rating{totalReviews !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {address && (
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={22} className="shrink-0 mt-0.5" />
            <p className="text-base">{address}</p>
          </div>
        )}
      </div>
    </section>
  );
}
