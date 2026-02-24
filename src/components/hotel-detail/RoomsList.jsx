"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { User, Maximize2, Bed, Camera } from "lucide-react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop";
const formatAED = (n) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(n ?? 0);

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

export default function RoomsList({ rooms = [], hotelId }) {
  const list = Array.isArray(rooms) ? rooms : [];
  if (list.length === 0) {
    return (
      <Box id="rooms" className="rounded-xl border border-gray-200 bg-white p-6">
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Room choices
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No room information available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box id="rooms" className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <Typography variant="h6" fontWeight={700} sx={{ px: 3, pt: 3, pb: 2 }}>
        Room choices
      </Typography>
      <div className="divide-y divide-gray-100">
        {list.map((room, roomIdx) => {
          const packages = getPackages(room);
          const name = room?.name_en ?? room?.name ?? room?.room_type ?? "Room";
          const bedding = room?.bedding ?? room?.beds ?? room?.bed_type ?? "";
          const view = room?.view ?? room?.view_type ?? "";
          const size = room?.size_sqm ?? room?.size ?? "";
          const adults = room?.max_adults ?? room?.adults ?? 2;
          const img = getRoomImage(room);

          return (
            <Box key={roomIdx} className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 w-full md:w-48 aspect-video md:aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                  <img src={img} alt={name} className="w-full h-full object-cover" onError={(e) => (e.target.src = PLACEHOLDER)} />
                  <Box
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-white text-xs"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    <Camera size={12} /> 1
                  </Box>
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="subtitle1" fontWeight={700} className="mb-2">
                    {name}
                  </Typography>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {adults} Adults
                    </span>
                    {size && (
                      <span className="flex items-center gap-1">
                        <Maximize2 size={14} /> Size: {size}m²
                      </span>
                    )}
                    {bedding && (
                      <span className="flex items-center gap-1">
                        <Bed size={14} /> {bedding}
                      </span>
                    )}
                    {view && <span>{view}</span>}
                  </div>
                  <Typography component="a" href="#more" variant="body2" sx={{ color: "#0ea5e9", fontWeight: 500 }}>
                    More room info
                  </Typography>

                  <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                    Select an option
                  </Typography>
                  <div className="space-y-3">
                    {packages.map((pkg, pkgIdx) => {
                      const price = pkg.base_price ?? pkg.price ?? 0;
                      const mealBoard = pkg.name_en ?? pkg.name ?? pkg.meal_board ?? "Room only";
                      const cancellation = pkg.cancellation_policy ?? pkg.free_cancellation ? "Free cancellation" : "";

                      return (
                        <Box
                          key={pkgIdx}
                          className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-[#004C5A]/40 hover:shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <Typography variant="body1" fontWeight={600}>
                                {mealBoard}
                              </Typography>
                              {cancellation && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {cancellation}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                1 room · {adults} Adults
                              </Typography>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-end">
                                <Typography variant="h6" fontWeight={700} sx={{ color: "#004C5A" }}>
                                  {formatAED(price)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Total for 1 night (incl. VAT)
                                </Typography>
                              </div>
                              <Button
                                variant="contained"
                                size="medium"
                                className="rounded-lg font-semibold normal-case"
                                sx={{ bgcolor: "#ee4056", "&:hover": { bgcolor: "#d9364c" } }}
                              >
                                Book now
                              </Button>
                            </div>
                          </div>
                        </Box>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Box>
          );
        })}
      </div>
    </Box>
  );
}
