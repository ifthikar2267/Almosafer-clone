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

  return (
  <section className="w-full">

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:grid gap-[2px] max-h-[670px] grid-cols-[1fr_0.5fr_0.5fr]">

        {/* Main Image */}
        <div className="relative h-[670px]">
          <img
            src={main}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
        </div>

        {/* Thumbnail 1 */}
        <div className="relative h-[670px]">
          {thumbnails[1] && (
            <img
              src={thumbnails[1]}
              className="h-full w-full object-cover"
              onError={(e) => (e.target.src = PLACEHOLDER)}
            />
          )}
        </div>

        {/* Thumbnail 2 & 3 */}
        <div className="grid grid-rows-2 gap-[2px] h-[670px]">
          {thumbnails.slice(2, 4).map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                className="h-full w-full object-cover"
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden">
        <div className="relative w-full">
          <img
            src={main}
            alt={title}
            className="w-full h-[300px] object-cover"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
        </div>

        {/* Thumbnails Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto p-2">
          {list.map((src, i) => (
            <img
              key={i}
              src={src}
              onClick={() => setIndex(i)}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                index === i ? "border-black" : "border-transparent"
              }`}
              onError={(e) => (e.target.src = PLACEHOLDER)}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
