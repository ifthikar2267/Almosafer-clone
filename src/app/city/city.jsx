"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Filter } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ListingSearchBar,
  FilterSidebar,
  FilterChips,
  HotelList,
  SideFilterSkeleton,
  QuickFilterSkeleton,
  HotelCardSkeleton,
} from "@/components/hotel-listing";
import { searchHotels, getFilterOptionsFromHotels, filterHotels } from "@/services/hotel.service";

const TEAL = "#0d9488";

const PAGE_SIZE = 10;

function parseArrayParam(str) {
  if (!str || typeof str !== "string") return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseNumberParam(str) {
  if (str == null || str === "") return null;
  const n = Number(str);
  return Number.isNaN(n) ? null : n;
}

export default function City({ city: initialCity, rooms, checkIn: initialCheckIn, checkOut: initialCheckOut }) {
  const router = useRouter();
  const pathname = usePathname() || "/city";
  const searchParamsUrl = useSearchParams();

  const [page, setPage] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const area = searchParamsUrl?.get("area") || "";
  const stars = searchParamsUrl?.get("stars") || "";
  const type = searchParamsUrl?.get("type") || "";
  const chainParam = searchParamsUrl?.get("chain") || "";
  const amenitiesParam = searchParamsUrl?.get("amenities") || "";
  const minPriceParam = searchParamsUrl?.get("minPrice") || "";
  const maxPriceParam = searchParamsUrl?.get("maxPrice") || "";
  const city = searchParamsUrl?.get("city") || initialCity || "";

  const selectedAreaIds = useMemo(() => {
    const parsed = parseArrayParam(area);
    const nums = parsed.map(Number).filter((n) => !Number.isNaN(n));
    return nums.length ? nums : parsed.map((s) => s.trim()).filter(Boolean);
  }, [area]);
  const selectedTypeIds = useMemo(() => {
    const parsed = parseArrayParam(type);
    const nums = parsed.map(Number).filter((n) => !Number.isNaN(n));
    return nums.length ? nums : parsed.map((s) => s.trim()).filter(Boolean);
  }, [type]);
  const selectedStarRatings = useMemo(() => parseArrayParam(stars).map(Number).filter((n) => !Number.isNaN(n)), [stars]);
  const selectedChainIds = useMemo(() => {
    const parsed = parseArrayParam(chainParam);
    const nums = parsed.map(Number).filter((n) => !Number.isNaN(n));
    return nums.length ? nums : parsed.map((s) => s.trim()).filter(Boolean);
  }, [chainParam]);
  const selectedAmenityNames = useMemo(() => parseArrayParam(amenitiesParam), [amenitiesParam]);
  const priceMin = parseNumberParam(minPriceParam);
  const priceMax = parseNumberParam(maxPriceParam);
  const priceRange = useMemo(() => [priceMin ?? 0, priceMax ?? 999999], [priceMin, priceMax]);

  const adults = useMemo(() => {
    const a = searchParamsUrl?.get("adults");
    if (a != null && a !== "") return Number(a) || 2;
    if (Array.isArray(rooms)) return rooms.reduce((s, r) => s + (r.adults || 0), 0) || 2;
    return 2;
  }, [searchParamsUrl, rooms]);

  const children = useMemo(() => {
    const c = searchParamsUrl?.get("children");
    if (c != null && c !== "") return Number(c) || 0;
    if (Array.isArray(rooms)) return rooms.reduce((s, r) => s + (r.children || 0), 0) || 0;
    return 0;
  }, [searchParamsUrl, rooms]);

  const checkIn = useMemo(() => {
    const c = searchParamsUrl?.get("checkIn") || initialCheckIn;
    return c ? new Date(c) : new Date();
  }, [searchParamsUrl, initialCheckIn]);

  const checkOut = useMemo(() => {
    const c = searchParamsUrl?.get("checkOut") || initialCheckOut;
    return c ? new Date(c) : new Date(Date.now() + 86400000);
  }, [searchParamsUrl, initialCheckOut]);

  const maxPrice = useMemo(() => {
    const prices = hotels.map((h) => h.startingPrice ?? h.price ?? 0).filter((n) => n > 0);
    return prices.length === 0 ? 10000 : Math.max(10000, Math.ceil(Math.max(...prices) / 500) * 500);
  }, [hotels]);

  const filterOptions = useMemo(() => getFilterOptionsFromHotels(hotels), [hotels]);

  const selectedAreaLabels = useMemo(() => {
    return selectedAreaIds.map((id) => {
      const a = filterOptions.areas?.find((x) => x.id == id || x.name === id);
      return a?.name ?? String(id);
    });
  }, [selectedAreaIds, filterOptions.areas]);

  const selectedTypeLabels = useMemo(() => {
    return selectedTypeIds.map((id) => {
      const t = filterOptions.propertyTypes?.find((x) => x.id == id || x.name === id);
      return t?.name ?? String(id);
    });
  }, [selectedTypeIds, filterOptions.propertyTypes]);

  const selectedChainLabels = useMemo(() => {
    return selectedChainIds.map((id) => {
      const c = filterOptions.chains?.find((x) => x.id == id || x.name === id);
      return c?.name ?? String(id);
    });
  }, [selectedChainIds, filterOptions.chains]);

  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParamsUrl?.toString() || "");
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else if (Array.isArray(value)) params.set(key, value.join(","));
      else params.set(key, String(value));
    });
    params.delete("page");
    return params.toString();
  }, [searchParamsUrl]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchHotels({
        city: city || undefined,
        checkIn,
        checkOut,
        adults,
        children,
      });
      setHotels(result);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [city, checkIn, checkOut, adults, children]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const sortedList = useMemo(
    () =>
      filterHotels(hotels, {
        priceRange: [priceMin ?? 0, priceMax ?? 999999],
        selectedStars: selectedStarRatings,
        selectedArea: selectedAreaIds,
        selectedType: selectedTypeIds,
        selectedChain: selectedChainIds,
        selectedAmenities: selectedAmenityNames,
      }),
    [
      hotels,
      priceMin,
      priceMax,
      selectedAreaIds,
      selectedStarRatings,
      selectedTypeIds,
      selectedChainIds,
      selectedAmenityNames,
    ]
  );

  const displayedList = useMemo(() => sortedList.slice(0, page * PAGE_SIZE), [sortedList, page]);
  const hasMore = sortedList.length > displayedList.length;

  const handleAreaChange = useCallback((v) => router.push(`${pathname}?${updateUrl({ area: v?.length ? v.join(",") : undefined })}`), [pathname, updateUrl, router]);
  const handleTypeChange = useCallback((v) => router.push(`${pathname}?${updateUrl({ type: v?.length ? v.join(",") : undefined })}`), [pathname, updateUrl, router]);
  const handleStarRatingChange = useCallback((v) => router.push(`${pathname}?${updateUrl({ stars: v?.length ? v.join(",") : undefined })}`), [pathname, updateUrl, router]);
  const handleChainChange = useCallback((v) => router.push(`${pathname}?${updateUrl({ chain: v?.length ? v.join(",") : undefined })}`), [pathname, updateUrl, router]);
  const handleAmenityChange = useCallback((v) => router.push(`${pathname}?${updateUrl({ amenities: v?.length ? v.join(",") : undefined })}`), [pathname, updateUrl, router]);
  const handlePriceRangeChange = useCallback((v) => {
    const [min, max] = v;
    router.push(`${pathname}?${updateUrl({ minPrice: min || undefined, maxPrice: max >= 999999 ? undefined : max })}`);
  }, [pathname, updateUrl, router]);

  const handleSearch = useCallback(
    ({ city: searchCity, checkIn: searchCheckIn, checkOut: searchCheckOut, rooms: searchRooms, adults: searchAdults, children: searchChildren }) => {
      const params = new URLSearchParams(searchParamsUrl?.toString() || "");
      if (searchCity) params.set("city", searchCity);
      else params.delete("city");
      if (searchCheckIn) params.set("checkIn", searchCheckIn.toISOString?.() || String(searchCheckIn));
      if (searchCheckOut) params.set("checkOut", searchCheckOut.toISOString?.() || String(searchCheckOut));
      if (searchAdults != null) params.set("adults", String(searchAdults));
      if (searchChildren != null) params.set("children", String(searchChildren));
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParamsUrl]
  );

  const clearAllFilters = useCallback(() => {
    router.push(`${pathname}?${updateUrl({ area: undefined, type: undefined, stars: undefined, chain: undefined, amenities: undefined, minPrice: undefined, maxPrice: undefined })}`);
    setDrawerOpen(false);
  }, [pathname, updateUrl, router]);

  const removeArea = useCallback(
    (label) => {
      const idToRemove = selectedAreaIds.find((id) => {
        const a = filterOptions.areas?.find((x) => x.id == id || x.name === id);
        return (a?.name ?? String(id)) === label;
      });
      if (idToRemove != null) {
        const next = selectedAreaIds.filter((a) => a !== idToRemove);
        router.push(`${pathname}?${updateUrl({ area: next.length ? next.join(",") : undefined })}`);
      }
    },
    [pathname, updateUrl, router, selectedAreaIds, filterOptions.areas]
  );
  const removeType = useCallback(
    (label) => {
      const idToRemove = selectedTypeIds.find((id) => {
        const t = filterOptions.propertyTypes?.find((x) => x.id == id || x.name === id);
        return (t?.name ?? String(id)) === label;
      });
      if (idToRemove != null) {
        const next = selectedTypeIds.filter((t) => t !== idToRemove);
        router.push(`${pathname}?${updateUrl({ type: next.length ? next.join(",") : undefined })}`);
      }
    },
    [pathname, updateUrl, router, selectedTypeIds, filterOptions.propertyTypes]
  );
  const removeChain = useCallback(
    (label) => {
      const idToRemove = selectedChainIds.find((id) => {
        const c = filterOptions.chains?.find((x) => x.id == id || x.name === id);
        return (c?.name ?? String(id)) === label;
      });
      if (idToRemove != null) {
        const next = selectedChainIds.filter((c) => c !== idToRemove);
        router.push(`${pathname}?${updateUrl({ chain: next.length ? next.join(",") : undefined })}`);
      }
    },
    [pathname, updateUrl, router, selectedChainIds, filterOptions.chains]
  );
  const removeStar = useCallback((value) => router.push(`${pathname}?${updateUrl({ stars: selectedStarRatings.filter((s) => s !== value).join(",") || undefined })}`), [pathname, updateUrl, router, selectedStarRatings]);
  const removeAmenity = useCallback((name) => router.push(`${pathname}?${updateUrl({ amenities: selectedAmenityNames.filter((n) => n !== name).join(",") || undefined })}`), [pathname, updateUrl, router, selectedAmenityNames]);

  const sidebarContent = (
    <Box className="p-4 md:p-0">
      <FilterSidebar
        staysCount={sortedList.length}
        cityName={city || "All destinations"}
        selectedAreas={selectedAreaIds}
        selectedTypes={selectedTypeIds}
        selectedStarRatings={selectedStarRatings}
        selectedChains={selectedChainIds}
        selectedAmenityNames={selectedAmenityNames}
        onAreaChange={handleAreaChange}
        onTypeChange={handleTypeChange}
        onStarRatingChange={handleStarRatingChange}
        onChainChange={handleChainChange}
        onAmenityChange={handleAmenityChange}
        onClearAll={clearAllFilters}
        filterOptions={filterOptions}
        filterValueKey="id"
      />
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky search bar: sits below navbar (h-13=52px mobile, md:h-16=64px desktop) */}
      <div className="sticky z-[40] w-full bg-gray-50 py-2 top-[52px] md:top-16">
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
          <ListingSearchBar
            destination={city}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            children={children}
            onSearch={handleSearch}
          />
        </Box>
      </div>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Mobile: filter bar + drawer */}
        <Box
          className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden"
          sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            {city || "Hotels"}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Filter size={18} />}
            onClick={() => setDrawerOpen(true)}
            className="rounded-full"
            sx={{ borderColor: TEAL, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: "#f0fdfa" } }}
          >
            Filters {sortedList.length > 0 && `(${sortedList.length})`}
          </Button>
        </Box>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: "min(100vw - 32px, 360px)",
              maxWidth: 360,
              borderRadius: "0 12px 12px 0",
              maxHeight: "100%",
              height: "100%",
            },
          }}
        >
          <Box className="flex flex-col h-full">
            <Box className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4">
              <Typography variant="h6" fontWeight={700}>
                Filters
              </Typography>
              <IconButton aria-label="Close filters" onClick={() => setDrawerOpen(false)} size="small">
                <span className="text-xl leading-none">×</span>
              </IconButton>
            </Box>
            <Box className="flex-1 overflow-y-auto">{sidebarContent}</Box>
            <Box className="sticky bottom-0 shrink-0 border-t border-gray-200 bg-white p-4">
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full font-semibold normal-case"
                sx={{ bgcolor: TEAL, py: 1.5, "&:hover": { bgcolor: "#0f766e" } }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Main layout: Desktop sidebar + results */}
        <div className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-12 md:gap-6 md:px-6 md:py-6">
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-24 self-start">
              {loading ? <SideFilterSkeleton /> : sidebarContent}
            </div>
          </aside>
          <main className="min-w-0 md:col-span-9">
            {!loading && (
              <>
                <Typography variant="subtitle2" className="mb-2 text-gray-600" sx={{ fontWeight: 600 }}>
                  {sortedList.length} propert{sortedList.length === 1 ? "y" : "ies"} found
                </Typography>
                <FilterChips
                  selectedAreas={selectedAreaLabels}
                  selectedTypes={selectedTypeLabels}
                  selectedChains={selectedChainLabels}
                  selectedStarRatings={selectedStarRatings}
                  selectedAmenityNames={selectedAmenityNames}
                  onRemoveArea={removeArea}
                  onRemoveType={removeType}
                  onRemoveChain={removeChain}
                  onRemoveStar={removeStar}
                  onRemoveAmenity={removeAmenity}
                  onClearAll={clearAllFilters}
                />
              </>
            )}
            {loading ? (
              <>
                <QuickFilterSkeleton />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <HotelCardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : (
              <HotelList
                hotels={displayedList}
                loading={false}
                hasMore={hasMore}
                onLoadMore={() => setPage((p) => p + 1)}
                searchParams={searchParamsUrl?.toString() || ""}
                emptyMessage="No hotels found"
                emptySubtext="Try adjusting your filters or search in a different area."
                onReset={clearAllFilters}
                showResultCount={false}
              />
            )}
          </main>
        </div>
      </Box>
    </div>
  );
}
