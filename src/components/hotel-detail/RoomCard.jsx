"use client";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Bed, Maximize2, Eye, User } from "lucide-react";
import { formatAED } from "@/lib/formatAED";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop";

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

function RoomOptionCard({ room, pkg, adults, searchParams, isLowestPrice }) {
  const price = pkg?.base_price ?? pkg?.price ?? 0;
  const mealBoard =
    pkg?.name_en ?? pkg?.name ?? pkg?.meal_board ?? "Room only";
  const cancellation =
    pkg?.cancellation_policy ??
    (pkg?.free_cancellation ? "Free cancellation" : "");
  const name = room?.name_en ?? room?.name ?? room?.room_type ?? "Room";
  const bedding = room?.bedding ?? room?.beds ?? room?.bed_type ?? "";
  const view = room?.view ?? room?.view_type ?? "";

  const titleParts = [name];
  if (bedding) titleParts.push(bedding);
  if (view) titleParts.push(view);
  const title = titleParts.join(" – ");

  const hasFreeCancellation =
    pkg?.free_cancellation || /free cancellation/i.test(String(cancellation));

  return (
    <div className="grid grid-cols-12 gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md md:gap-6 md:p-6">
      {/* LEFT – col-span-7 */}
      <div className="col-span-12 md:col-span-7 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {hasFreeCancellation && (
          <p className="text-sm text-emerald-600">Free cancellation</p>
        )}
        <p className="text-sm text-gray-600">{mealBoard}</p>
        <p className="text-xs text-gray-500">1 room · {adults} adults</p>
      </div>

      {/* MIDDLE – col-span-2 */}
      <div className="col-span-12 flex items-center md:col-span-2 md:border-l md:border-gray-200 md:pl-6">
        <div className="flex items-center gap-2">
          <User size={18} className="shrink-0 text-gray-500" />
          <span className="text-sm text-gray-600">Fits {adults}</span>
        </div>
      </div>

      {/* RIGHT – col-span-3 */}
      <div className="col-span-12 flex flex-col justify-center gap-2 border-t border-gray-100 pt-4 md:col-span-3 md:border-l md:border-gray-200 md:border-t-0 md:pl-6 md:pt-0 md:text-right">
        {isLowestPrice && (
          <span className="text-xs font-medium text-emerald-600">
            Lowest price
          </span>
        )}
        <p className="text-xl font-bold text-emerald-600">
          {formatAED(price)}
        </p>
        <p className="text-xs text-gray-500">Total for 1 night (incl. VAT)</p>
        <div className="mt-2 w-full md:w-auto md:flex md:justify-end">
          <Button
            component="a"
            href={`#rooms${searchParams ? `?${searchParams}` : ""}`}
            variant="contained"
            fullWidth
            size="medium"
            className="rounded-full font-semibold normal-case"
            sx={{
              bgcolor: "#ee4056",
              py: 1.25,
              "&:hover": { bgcolor: "#d9364c" },
            }}
          >
            Book now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RoomCard({ room, searchParams = "" }) {
  const packages = getPackages(room);
  const adults = room?.max_adults ?? room?.adults ?? 2;
  const img = getRoomImage(room);
  const name = room?.name_en ?? room?.name ?? room?.room_type ?? "Room";
  const bedding = room?.bedding ?? room?.beds ?? room?.bed_type ?? "";
  const view = room?.view ?? room?.view_type ?? "";
  const size = room?.size_sqm ?? room?.size ?? "";

  let minPrice = Infinity;
  packages.forEach((p) => {
    const pPrice = p?.base_price ?? p?.price ?? 0;
    if (pPrice > 0 && pPrice < minPrice) minPrice = pPrice;
  });
  if (!Number.isFinite(minPrice)) minPrice = 0;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="space-y-6 p-4 md:p-6">
        {/* Room header: image + details */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-44 md:w-56">
            <img
              src={img}
              alt={name}
              className="h-full w-full object-cover"
              onError={(e) => (e.target.src = PLACEHOLDER)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
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
        </div>

        {/* Room options (one card per package) */}
        {packages.length > 0 && (
          <div className="space-y-4">
            <Typography
              variant="subtitle2"
              fontWeight={600}
              className="text-gray-900"
            >
              Select an option
            </Typography>
            <div className="space-y-4">
              {packages.map((pkg, pkgIdx) => {
                const price = pkg?.base_price ?? pkg?.price ?? 0;
                const isLowestPrice =
                  minPrice > 0 && price === minPrice && price > 0;
                return (
                  <RoomOptionCard
                    key={pkgIdx}
                    room={room}
                    pkg={pkg}
                    adults={adults}
                    searchParams={searchParams}
                    isLowestPrice={isLowestPrice}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
