"use client";

import Grid from "@mui/material/Grid";
import { Bed, Eye, Maximize2, User } from "lucide-react";
import { formatAED } from "@/lib/formatAED";
import { CheckCircle, XCircle, Star } from "lucide-react";

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
    return typeof first === "string" ? first : (first?.url ?? PLACEHOLDER);
  }
  if (typeof imgs === "string") return imgs;
  return PLACEHOLDER;
}

export default function RoomCard({ room, searchParams = "" }) {
  const packages = getPackages(room);
  const adults = room?.max_adults ?? room?.adults ?? 2;
  const name = room?.name_en ?? room?.name ?? room?.room_type ?? "Room";
  const bedding = room?.bedding ?? room?.beds ?? room?.bed_type ?? "";
  const view = room?.view ?? room?.view_type ?? "";
  const size = room?.size_sqm ?? room?.size ?? "";
  const img = getRoomImage(room);
  const headerTitleParts = [];
  if (name) headerTitleParts.push(name);
  if (bedding) headerTitleParts.push(bedding);
  if (view) headerTitleParts.push(view);
  const headerTitle = headerTitleParts.join(" - ") || name;

  const imageCount = Array.isArray(room?.images) ? room.images.length : 0;

  let minPrice = Infinity;
  packages.forEach((p) => {
    const v = p?.base_price ?? p?.price ?? 0;
    if (v > 0 && v < minPrice) minPrice = v;
  });
  if (!Number.isFinite(minPrice)) minPrice = 0;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="p-4 md:p-6">
        {/* CARD HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-36 md:w-52">
            <img
              src={img}
              alt={name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
            {imageCount > 1 && (
              <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                {imageCount} photos
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-base font-semibold text-gray-900 md:text-lg">
              {headerTitle}
            </h2>
            <div className="space-y-1 text-xs text-gray-600 md:text-sm">
              <div className="flex items-center gap-1.5">
                <User size={15} className="shrink-0 text-gray-500" />
                <span>{adults} Adults</span>
              </div>
              {bedding && (
                <div className="flex items-center gap-1.5">
                  <Bed size={15} className="shrink-0 text-gray-500" />
                  <span>{bedding}</span>
                </div>
              )}
              {view && (
                <div className="flex items-center gap-1.5">
                  <Eye size={15} className="shrink-0 text-gray-500" />
                  <span>{view}</span>
                </div>
              )}
              {size && (
                <div className="flex items-center gap-1.5">
                  <Maximize2 size={15} className="shrink-0 text-gray-500" />
                  <span>{size} m²</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD BODY – ROOM OPTIONS (4-COLUMN GRID USING MUI GRID + TAILWIND) */}
        {packages.length > 0 ? (
          <div className="mt-6 rounded-xl bg-gray-50">
            {/* Header row labels */}
            <Grid
              container
              className="w-full border-b border-gray-200 px-4 py-3 text-xs font-medium text-gray-500 md:px-6 md:text-sm"
              justifyContent="space-between"
            >
              <Grid item xs={12} md={3}>
                Select an option
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                className="mt-2 text-center md:mt-0 md:text-center"
              >
                Guests
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                className="mt-1 text-left md:mt-0 md:text-left"
              >
                Total for 1 room
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                className="mt-1 text-left md:mt-0 md:text-right"
              >
                {/* CTA column label intentionally empty */}
              </Grid>
            </Grid>

            {/* Package rows */}
            {packages.map((pkg, idx) => {
              const basePrice = Number(pkg?.base_price ?? pkg?.price ?? 0) || 0;
              const firstPriceRaw =
                pkg?.first_price != null ? Number(pkg.first_price) : null;
              const oldPriceCandidate =
                pkg?.old_price != null ? Number(pkg.old_price) : null;

              let oldPrice = null;
              let newPrice = basePrice;
              let discountPercent = null;

              // Prefer first_price semantics if present
              if (firstPriceRaw != null && firstPriceRaw > 0) {
                if (firstPriceRaw < basePrice) {
                  // Price has dropped: base_price was original, first_price is discounted
                  oldPrice = basePrice;
                  newPrice = firstPriceRaw;
                  discountPercent = Math.round(
                    ((basePrice - firstPriceRaw) / basePrice) * 100,
                  );
                } else if (firstPriceRaw > basePrice) {
                  // Fallback: treat first_price as original
                  oldPrice = firstPriceRaw;
                  newPrice = basePrice;
                  discountPercent = Math.round(
                    ((firstPriceRaw - basePrice) / firstPriceRaw) * 100,
                  );
                }
              } else if (oldPriceCandidate != null && oldPriceCandidate > 0) {
                if (oldPriceCandidate > basePrice) {
                  oldPrice = oldPriceCandidate;
                  newPrice = basePrice;
                  discountPercent = Math.round(
                    ((oldPriceCandidate - basePrice) / oldPriceCandidate) * 100,
                  );
                }
              }

              const title =
                pkg?.name_en ?? pkg?.name ?? pkg?.meal_board ?? "Room only";
              const cancellation =
                pkg?.cancellation_policy ??
                (pkg?.free_cancellation ? "Free cancellation" : "");
              const hasFreeCancellation =
                pkg?.free_cancellation ||
                /free cancellation/i.test(String(cancellation));

              // Column 1 bullet details
              const bulletItems = [];
              if (cancellation) bulletItems.push(String(cancellation));

              const mealCodeSource =
                pkg?.board_code ??
                pkg?.board_type ??
                pkg?.meal_board ??
                title ??
                "";
              const mealCode = String(mealCodeSource).toUpperCase();
              if (/\bRO\b|ROOM ONLY/i.test(mealCode)) {
                bulletItems.push("No breakfast included");
              } else if (/\bBB\b|BREAKFAST/i.test(mealCode)) {
                bulletItems.push("Breakfast included");
              }

              if (pkg?.points_text) {
                bulletItems.push(pkg.points_text);
              }

              if (pkg?.almosafer_points || pkg?.shukran_points) {
                const pointsParts = [];
                if (pkg?.almosafer_points) {
                  pointsParts.push(`${pkg.almosafer_points} Almosafer points`);
                }
                if (pkg?.shukran_points) {
                  pointsParts.push(`${pkg.shukran_points} Shukrans`);
                }
                bulletItems.push(pointsParts.join(" · "));
              }

              const isLowestPrice =
                minPrice > 0 && basePrice === minPrice && basePrice > 0;

              return (
                <Grid
                  key={idx}
                  container
                  alignItems="stretch"
                  justifyContent="space-between"
                  className=" w-full
    border-t border-gray-200
    px-4 py-4
    md:px-6
    grid
    grid-cols-1
    md:grid-cols-[1fr_120px_180px_140px]
    gap-4
    items-center"
                >
                  {/* COLUMN 1 – Select an option / package info */}
                  <Grid item xs={12} md className="flex">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {title}
                      </p>
                      {hasFreeCancellation && (
                        <p className="text-xs font-medium text-emerald-600">
                          Free cancellation
                        </p>
                      )}
                      {bulletItems.length > 0 && (
                        <ul className="space-y-1 text-sm text-gray-700">
                          {bulletItems.map((item, i) => {
                            const text = item.toLowerCase();

                            const isNegative =
                              text.includes("non-refundable") ||
                              text.includes("no breakfast");

                            const isPositive =
                              text.includes("refundable") ||
                              text.includes("breakfast included");

                            return (
                              <li
                                key={i}
                                className="flex items-start gap-2 leading-snug"
                              >
                                {isNegative ? (
                                  <XCircle
                                    size={16}
                                    className="mt-[2px] shrink-0 text-red-500"
                                  />
                                ) : isPositive ? (
                                  <CheckCircle
                                    size={16}
                                    className="mt-[2px] shrink-0 text-green-500"
                                  />
                                ) : (
                                  <Star
                                    size={16}
                                    className="mt-[2px] shrink-0 text-gray-400"
                                  />
                                )}

                                <span>{item}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-500 md:justify-start md:gap-3">
                        <button
                          type="button"
                          className="text-[11px] font-medium text-teal-600"
                        >
                          Learn more
                        </button>
                        <span>1 room · {adults} Adults</span>
                      </div>
                    </div>
                  </Grid>

                  {/* COLUMN 2 – Guests */}
                  <Grid
                    item
                    xs={12}
                    md="auto"
                    className="flex items-center justify-center"
                  >
                    <div className="flex items-center gap-2">
                      <User size={18} className="shrink-0 text-gray-500" />
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        Fits {adults}
                      </span>
                    </div>
                  </Grid>

                  {/* COLUMN 3 – Total for 1 room */}
                  <Grid item xs={12} md="auto" className="flex items-center">
                    <div className="flex flex-col items-start gap-1 text-left">
                      {isLowestPrice && !discountPercent && (
                        <span className="inline-flex rounded-full bg-emerald-500 px-2 py-[2px] text-[11px] font-semibold text-white">
                          Lowest price
                        </span>
                      )}
                      {discountPercent != null && discountPercent > 0 && (
                        <span className="text-[12px] md:text-left font-semibold text-[#319E37]">
                          Price has dropped by {discountPercent}%
                        </span>
                      )}
                      {oldPrice != null && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatAED(oldPrice)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-[#319E37] md:text-xl">
                        {formatAED(newPrice)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Total for 1 night (incl. VAT)
                      </p>
                    </div>
                  </Grid>

                  {/* COLUMN 4 – Book button */}
                  <Grid
                    item
                    xs={12}
                    md="auto"
                    className="flex items-center justify-end"
                  >
                    <div className="flex justify-stretch md:justify-end">
                      <a
                        href={`#rooms${searchParams ? `?${searchParams}` : ""}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-[#EF4500] px-4 py-2.5 text-sm font-semibold text-white md:w-auto"
                      >
                        Book now
                      </a>
                    </div>
                  </Grid>
                </Grid>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No packages available for this room.
          </div>
        )}
      </div>
    </article>
  );
}
