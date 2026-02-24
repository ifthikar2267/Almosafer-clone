"use client";

import Button from "@mui/material/Button";
import { Bed, Maximize2, Eye, User } from "lucide-react";
import { formatAED } from "@/lib/formatAED";

const PLACEHOLDER = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop";

function getPackages(room) {
  const p = room?.room_packages ?? room?.packages ?? [];
  return Array.isArray(p) ? p : [];
}

function getRoomImage(room) {
  const imgs = room?.images ?? room?.image_url;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    return typeof first === "string" ? first : first?.url ?? PLACEHOLDER;
  }
  if (typeof imgs === "string") return imgs;
  return PLACEHOLDER;
}

export default function RoomCard({ room, searchParams = "" }) {
  const packages = getPackages(room);
  const name = room?.name_en ?? room?.name ?? room?.room_type ?? "Room";
  const bedding = room?.bedding ?? room?.beds ?? room?.bed_type ?? "";
  const view = room?.view ?? room?.view_type ?? "";
  const size = room?.size_sqm ?? room?.size ?? "";
  const adults = room?.max_adults ?? room?.adults ?? 2;
  const img = getRoomImage(room);

  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Column 1: Room image */}
        <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
        </div>

        {/* Column 2: Room details */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{name}</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            {bedding && (
              <li className="flex items-center gap-2">
                <Bed size={16} className="shrink-0 text-gray-500" />
                {bedding}
              </li>
            )}
            {view && (
              <li className="flex items-center gap-2">
                <Eye size={16} className="shrink-0 text-gray-500" />
                {view}
              </li>
            )}
            {size && (
              <li className="flex items-center gap-2">
                <Maximize2 size={16} className="shrink-0 text-gray-500" />
                {size} m²
              </li>
            )}
            <li className="flex items-center gap-2">
              <User size={16} className="shrink-0 text-gray-500" />
              {adults} Adults
            </li>
          </ul>
        </div>

        {/* Column 3: Room packages */}
        <div className="flex flex-col gap-0">
          {packages.map((pkg, pkgIdx) => {
            const price = pkg.base_price ?? pkg.price ?? 0;
            const mealBoard = pkg.name_en ?? pkg.name ?? pkg.meal_board ?? "Room only";
            const cancellation = pkg.cancellation_policy ?? (pkg.free_cancellation ? "Free cancellation" : "");

            return (
              <div key={pkgIdx}>
                {pkgIdx > 0 && <hr className="my-4 border-gray-100" />}
                <div className="flex flex-col gap-2">
                  <p className="text-base font-semibold text-gray-900">{mealBoard}</p>
                  {cancellation && <p className="text-sm text-gray-500">{cancellation}</p>}
                  <div className="mt-1">
                    <p className="text-xl font-bold text-[#004C5A]">{formatAED(price)}</p>
                    <p className="text-xs text-gray-500">Base price · 1 night (incl. VAT)</p>
                  </div>
                  <Button
                    component="a"
                    href={`#rooms${searchParams ? `?${searchParams}` : ""}`}
                    variant="contained"
                    fullWidth
                    size="medium"
                    className="rounded-lg font-semibold normal-case mt-2"
                    sx={{ bgcolor: "#ee4056", "&:hover": { bgcolor: "#d9364c" } }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
