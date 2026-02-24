"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Filter } from "lucide-react";
import { useFetchHotels } from "@/hooks/useFetchHotels";
import { useSearchResults } from "@/context/SearchResultsContext";
import { getFilterOptionsFromHotels, filterHotels } from "@/services/hotel.service";
import {
  FilterSidebar,
  FilterChips,
  HotelCardSkeleton,
  EmptyResultsState,
  HotelList,
} from "@/components/hotel-listing";

const TEAL = "#0d9488";

export default function HotelsPage() {
  const { consumePreFetchedHotels } = useSearchResults();
  const [preFetchedHotels, setPreFetchedHotels] = useState(null);
  const { hotels: fetchedHotels, loading: fetchLoading, error, refetch } = useFetchHotels();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fromContext = consumePreFetchedHotels();
    if (fromContext && Array.isArray(fromContext)) setPreFetchedHotels(fromContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawHotels = preFetchedHotels !== null ? preFetchedHotels : fetchedHotels;
  const loading = preFetchedHotels !== null ? false : fetchLoading;
  const displayError = preFetchedHotels !== null ? null : error;

  const handleRefetch = useCallback(() => {
    setPreFetchedHotels(null);
    refetch();
  }, [refetch]);

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStarRatings, setSelectedStarRatings] = useState([]);
  const [selectedChains, setSelectedChains] = useState([]);
  const [selectedAmenityNames, setSelectedAmenityNames] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 999999]);

  const maxPrice = useMemo(() => {
    const prices = rawHotels.map((h) => h.startingPrice ?? h.price ?? 0).filter((n) => n > 0);
    return prices.length === 0 ? 10000 : Math.max(10000, Math.ceil(Math.max(...prices) / 500) * 500);
  }, [rawHotels]);

  const filterOptions = useMemo(() => getFilterOptionsFromHotels(rawHotels), [rawHotels]);

  const filteredHotels = useMemo(
    () =>
      filterHotels(rawHotels, {
        priceRange,
        selectedStars: selectedStarRatings,
        selectedArea: selectedAreas,
        selectedType: selectedTypes,
        selectedChain: selectedChains,
        selectedAmenities: selectedAmenityNames,
      }),
    [
      rawHotels,
      priceRange,
      selectedStarRatings,
      selectedAreas,
      selectedTypes,
      selectedChains,
      selectedAmenityNames,
    ]
  );

  const handleAreaChange = useCallback((v) => setSelectedAreas(Array.isArray(v) ? v : []), []);
  const handleTypeChange = useCallback((v) => setSelectedTypes(Array.isArray(v) ? v : []), []);
  const handleStarRatingChange = useCallback((v) => setSelectedStarRatings(Array.isArray(v) ? v : []), []);
  const handleChainChange = useCallback((v) => setSelectedChains(Array.isArray(v) ? v : []), []);
  const handleAmenityChange = useCallback((v) => setSelectedAmenityNames(Array.isArray(v) ? v : []), []);

  const clearAllFilters = useCallback(() => {
    setSelectedAreas([]);
    setSelectedTypes([]);
    setSelectedStarRatings([]);
    setSelectedChains([]);
    setSelectedAmenityNames([]);
    setPriceRange([0, maxPrice]);
    setDrawerOpen(false);
  }, [maxPrice]);

  const removeArea = useCallback((name) => setSelectedAreas((prev) => prev.filter((a) => a !== name)), []);
  const removeType = useCallback((name) => setSelectedTypes((prev) => prev.filter((t) => t !== name)), []);
  const removeChain = useCallback((name) => setSelectedChains((prev) => prev.filter((c) => c !== name)), []);
  const removeStar = useCallback((value) => setSelectedStarRatings((prev) => prev.filter((s) => s !== value)), []);
  const removeAmenity = useCallback((name) => setSelectedAmenityNames((prev) => prev.filter((n) => n !== name)), []);

  const sidebarContent = (
    <Box className="p-4 md:p-0">
      <FilterSidebar
        staysCount={filteredHotels.length}
        cityName="All destinations"
        selectedAreas={selectedAreas}
        selectedTypes={selectedTypes}
        selectedStarRatings={selectedStarRatings}
        selectedChains={selectedChains}
        selectedAmenityNames={selectedAmenityNames}
        onAreaChange={handleAreaChange}
        onTypeChange={handleTypeChange}
        onStarRatingChange={handleStarRatingChange}
        onChainChange={handleChainChange}
        onAmenityChange={handleAmenityChange}
        onClearAll={clearAllFilters}
        filterOptions={filterOptions}
      />
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Mobile: filter bar + drawer */}
        <Box
          className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden"
          sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Hotels
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Filter size={18} />}
            onClick={() => setDrawerOpen(true)}
            className="rounded-full"
            sx={{ borderColor: TEAL, color: TEAL, "&:hover": { borderColor: TEAL, bgcolor: "#f0fdfa" } }}
          >
            Filters {filteredHotels.length > 0 && `(${filteredHotels.length})`}
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
            <div>{sidebarContent}</div>
          </aside>

          <main className="min-w-0 md:col-span-9">
            {displayError && (
              <Box className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <Typography color="error" variant="body2" className="mb-2">
                  {displayError.message}
                </Typography>
                <Button variant="outlined" color="error" size="small" onClick={handleRefetch}>
                  Retry
                </Button>
              </Box>
            )}

            {!loading && (
              <>
                <Typography variant="subtitle2" className="mb-2 text-gray-600" sx={{ fontWeight: 600 }}>
                  {filteredHotels.length} propert{filteredHotels.length === 1 ? "y" : "ies"} found
                </Typography>
                <FilterChips
                  selectedAreas={selectedAreas}
                  selectedTypes={selectedTypes}
                  selectedChains={selectedChains}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <HotelList
                hotels={filteredHotels}
                searchParams=""
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
