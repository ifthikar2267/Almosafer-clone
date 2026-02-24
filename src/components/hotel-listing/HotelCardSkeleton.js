"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

/**
 * Loading skeleton for HotelCard (row layout: image left, content center, rating/price right).
 */
export default function HotelCardSkeleton() {
  return (
    <Box
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white md:flex-row"
      sx={{ minHeight: 200 }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: 208,
          flexShrink: 0,
          "@media (min-width: 768px)": { width: 224, height: 176, minWidth: 224 },
        }}
      />
      <Box className="flex min-w-0 flex-1 flex-col justify-between p-4" sx={{ gap: 1.5 }}>
        <Skeleton variant="text" width="85%" height={22} />
        <Skeleton variant="text" width="20%" height={18} />
        <Skeleton variant="rounded" width={100} height={20} sx={{ my: 0.5 }} />
        <Skeleton variant="text" width="70%" height={16} />
      </Box>
      <Box className="flex flex-row items-center justify-between gap-4 border-t border-gray-100 p-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:border-s md:w-44 md:shrink-0">
        <Box className="flex flex-col items-end">
          <Skeleton variant="text" width={56} height={14} />
          <Skeleton variant="rounded" width={48} height={28} sx={{ mt: 0.5 }} />
          <Skeleton variant="text" width={80} height={12} sx={{ mt: 0.5 }} />
        </Box>
        <Box className="flex flex-col items-end">
          <Skeleton variant="text" width={64} height={28} />
          <Skeleton variant="text" width={120} height={14} sx={{ mt: 0.25 }} />
          <Skeleton variant="rounded" width={100} height={36} sx={{ mt: 1.5 }} />
        </Box>
      </Box>
    </Box>
  );
}
