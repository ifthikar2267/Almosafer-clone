"use client";

import { useState } from "react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop";

export default function HotelHero({ hotel }) {
  const [index, setIndex] = useState(0);
  const images = hotel?.images?.length ? hotel.images : [hotel?.thumbnail].filter(Boolean);
  const list = images.length ? images : [PLACEHOLDER];
  const main = list[index] || list[0];
  const thumbnails = list.slice(0, 5);
  const title = hotel?.title ?? hotel?.name ?? "";
  const star = Number(hotel?.star ?? hotel?.starRating ?? 0);
  const hotelType = hotel?.hotelType ?? hotel?.propertyType ?? "";
  const reviewScore = Number(hotel?.reviewScore ?? 0);
  const totalReviews = Number(hotel?.totalReviews ?? 0);
  const address = hotel?.address ?? hotel?.location ?? "";

  return (
    <section className="w-full">
      {/* Gallery: main image (8 columns) + thumbnails (4 columns) */}
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        {/* Main image – spans 8/12 on desktop */}
        <div className="col-span-12 md:col-span-6">
          <div className="relative overflow-hidden rounded-xl bg-gray-100">
          <div className="aspect-[21/9] md:aspect-[12/9]">
              <img
                src={main}
                alt={title}
                className="h-full w-full object-contain"
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />
            </div>
          </div>
        </div>

        {/* Thumbnails – 4/12 column on desktop */}
        <div className="col-span-12 hidden md:grid md:col-span-6 md:grid-cols-2 md:grid-rows-2 md:gap-2">
          {thumbnails.slice(1, 5).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i + 1)}
              className={`relative overflow-hidden rounded-lg bg-gray-100 transition ring-2 ring-offset-2 ${
                index === i + 1 ? "ring-[#004C5A]" : "ring-transparent"
              }`}
            >
              <div className="aspect-[4/3]">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-contain"
                  onError={(e) => (e.target.src = PLACEHOLDER)}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
