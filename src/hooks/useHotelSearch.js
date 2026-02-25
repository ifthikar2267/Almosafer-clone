"use client";

import { useState, useCallback, useEffect } from "react";
import { searchHotels, getFilterOptionsFromHotels } from "@/services/hotel.service";

/**
 * Hook for hotel search: holds search params, fetches hotels, and exposes
 * loading state, list, and dynamic filter options derived from results.
 */
export function useHotelSearch(initialParams = {}) {
  const [params, setParams] = useState({
    city: initialParams.city ?? "",
    checkIn: initialParams.checkIn ?? null,
    checkOut: initialParams.checkOut ?? null,
    adults: initialParams.adults ?? 2,
    children: initialParams.children ?? 0,
    area: initialParams.area ?? [],
    stars: initialParams.stars ?? [],
    type: initialParams.type ?? [],
    minPrice: initialParams.minPrice ?? null,
    maxPrice: initialParams.maxPrice ?? null,
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = useCallback(async (override = {}) => {
    const next = { ...params, ...override };
    setParams(next);
    setLoading(true);
    setError(null);
    try {
      const list = await searchHotels({
        city: next.city,
        checkIn: next.checkIn,
        checkOut: next.checkOut,
        adults: next.adults,
        children: next.children,
        area: next.area?.length ? next.area : undefined,
        stars: next.stars?.length ? next.stars : undefined,
        type: next.type?.length ? next.type : undefined,
        minPrice: next.minPrice ?? undefined,
        maxPrice: next.maxPrice ?? undefined,
      });
      setHotels(list);
    } catch (err) {
      setError(err?.message || "Search failed");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    search({
      city: initialParams.city ?? "",
      checkIn: initialParams.checkIn ?? null,
      checkOut: initialParams.checkOut ?? null,
      adults: initialParams.adults ?? 2,
      children: initialParams.children ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterOptions = getFilterOptionsFromHotels(hotels);

  return {
    params,
    setParams,
    hotels,
    loading,
    error,
    search,
    filterOptions,
  };
}
