"use client";

export default function SideFilterSkeleton() {
  return (
    <div className="hidden md:block">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200" />
          <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
        </div>
        <div className="mb-4 h-4 w-48 animate-pulse rounded-md bg-gray-200" />

        {/* Price range section */}
        <div className="mb-6">
          <div className="mb-2 h-4 w-24 animate-pulse rounded-md bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Star rating section */}
        <div className="mb-6">
          <div className="mb-3 h-4 w-28 animate-pulse rounded-md bg-gray-200" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-gray-200" />
                <div className="h-4 flex-1 animate-pulse rounded-md bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Property type section */}
        <div className="mb-6">
          <div className="mb-3 h-4 w-24 animate-pulse rounded-md bg-gray-200" />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Amenities list */}
        <div>
          <div className="mb-3 h-4 w-20 animate-pulse rounded-md bg-gray-200" />
          <div className="max-h-48 space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-gray-200" />
                <div className="h-4 flex-1 animate-pulse rounded-md bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
