"use client";

import { useState, useMemo, useCallback } from "react";
import Typography from "@mui/material/Typography";
import { sortHotels } from "@/services/hotel.service";
import HotelCardSkeleton from "./HotelCardSkeleton";
import EmptyResultsState from "./EmptyResultsState";
import QuickFiltersBar from "./QuickFiltersBar";
import HotelGrid from "./HotelGrid";

export default function HotelList({
  hotels = [],
  searchParams = "",
  loading = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = "No hotels found",
  emptySubtext = "Try changing your destination, dates, or filters.",
  onReset,
  skeletonCount = 6,
  gridLayout = true,
  sortBy: controlledSortBy,
  onSortChange,
  showResultCount = true,
}) {
  const [internalSortBy, setInternalSortBy] = useState("popular");
  const sortBy = controlledSortBy ?? internalSortBy;
  const setSortBy = useCallback(
    (v) => {
      if (onSortChange) onSortChange(v);
      else setInternalSortBy(v);
    },
    [onSortChange]
  );

  const sortedHotels = useMemo(() => sortHotels(hotels, sortBy), [hotels, sortBy]);

  if (loading) {
    return (
      <div className={gridLayout ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4 pt-4"}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <EmptyResultsState
        title={emptyMessage}
        subtext={emptySubtext}
        actionLabel="Reset search"
        onAction={onReset}
      />
    );
  }

  return (
    <>
      {showResultCount && (
        <Typography variant="body2" color="text.secondary" className="mb-3 text-start" sx={{ fontWeight: 500 }}>
          {sortedHotels.length} propert{sortedHotels.length === 1 ? "y" : "ies"} found
        </Typography>
      )}

      <QuickFiltersBar value={sortBy} onChange={setSortBy} />

      <div className="transition-opacity duration-200">
        <HotelGrid hotels={sortedHotels} searchParams={searchParams} />
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center pb-8 pt-6">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-lg border-2 border-teal-600 px-6 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
