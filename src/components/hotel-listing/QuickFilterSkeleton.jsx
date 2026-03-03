"use client";

const PILL_COUNT = 6;

export default function QuickFilterSkeleton() {
  return (
    <div className="mb-4 mt-3">
      {/* Result count line */}
      <div className="mb-3 h-5 w-36 animate-pulse rounded-md bg-gray-200" aria-hidden />
      {/* Pill-shaped quick filter buttons */}
      <div className="flex gap-3 overflow-x-auto pb-1 md:overflow-visible">
        {Array.from({ length: PILL_COUNT }, (_, i) => (
          <div
            key={i}
            className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-gray-200 md:w-32"
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
