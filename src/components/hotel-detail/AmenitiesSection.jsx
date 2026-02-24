"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import { Wifi, Car, Waves, Coffee, Tv, Dumbbell, Snowflake, UtensilsCrossed } from "lucide-react";

const ICON_MAP = {
  wifi: Wifi,
  internet: Wifi,
  parking: Car,
  pool: Waves,
  restaurant: UtensilsCrossed,
  breakfast: Coffee,
  tv: Tv,
  gym: Dumbbell,
  fitness: Dumbbell,
  spa: Snowflake,
};

function getIcon(name) {
  if (!name || typeof name !== "string") return null;
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return null;
}

export default function AmenitiesSection({ amenities = [] }) {
  const [showAll, setShowAll] = useState(false);
  const list = Array.isArray(amenities) ? amenities : [];
  const INITIAL = 8;
  const visible = showAll ? list : list.slice(0, INITIAL);
  const hasMore = list.length > INITIAL;

  if (list.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
        <p className="text-gray-600">No amenities listed.</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map((item, i) => {
          const label = typeof item === "string" ? item : item?.name ?? String(item);
          const Icon = getIcon(label);
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
              {Icon ? <Icon size={20} className="text-gray-600 shrink-0" /> : <span className="w-5 h-5 rounded-full bg-gray-300 shrink-0" />}
              <span className="text-gray-700 text-sm font-medium truncate">{label}</span>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <Button
          variant="outlined"
          size="medium"
          onClick={() => setShowAll(!showAll)}
          className="mt-6 rounded-lg"
          sx={{ borderColor: "#004C5A", color: "#004C5A", "&:hover": { borderColor: "#003d47", bgcolor: "rgba(0,76,90,0.04)" } }}
        >
          {showAll ? "Show less" : "Show all amenities"}
        </Button>
      )}
    </section>
  );
}
