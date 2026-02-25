"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ListingHeader, FilterSidebar, HotelList } from "@/components/hotel-listing";
import { searchHotels, getFilterOptionsFromHotels, filterHotels } from "@/services/hotel.service";

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

  return (
    <div className="min-h-screen bg-white">
      <ListingHeader />
      <Container maxWidth="xl" className="px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-24 self-start">
              <FilterSidebar
                staysCount={sortedList.length}
                cityName={city}
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
                filterOptions={filterOptions}
                filterValueKey="id"
              />
            </div>
          </aside>
          <main className="col-span-1 md:col-span-9">
            <HotelList
              hotels={displayedList}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={() => setPage((p) => p + 1)}
              searchParams={searchParamsUrl?.toString() || ""}
            />
          </main>
        </div>
      </Container>
    </div>
  );
}
