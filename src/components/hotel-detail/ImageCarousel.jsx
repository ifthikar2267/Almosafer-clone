"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Camera } from "lucide-react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop";

export default function ImageCarousel({ images = [], alt = "Hotel" }) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : [PLACEHOLDER];
  const current = list[index] || list[0];

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-200 md:col-span-2 md:row-span-2">
          <img
            src={current}
            alt={`${alt} ${index + 1}`}
            className="h-full w-full object-cover transition-opacity duration-200"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
        </div>
        {list.slice(1, 5).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i + 1)}
            className={`relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-200 transition ring-2 ring-offset-2 ${
              index === i + 1 ? "ring-[#004C5A] cursor-pointer" : "ring-transparent"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" onError={(e) => (e.target.src = PLACEHOLDER)} />
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 shrink-0 rounded-full transition-all ${
                index === i ? "w-6 bg-[#004C5A]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
        {list.length > 1 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Camera size={18} />}
            className="rounded-lg normal-case"
            sx={{ bgcolor: "rgba(0,0,0,0.6)", "&:hover": { bgcolor: "rgba(0,0,0,0.75)" } }}
          >
            See all photos
          </Button>
        )}
      </div>
    </section>
  );
}
