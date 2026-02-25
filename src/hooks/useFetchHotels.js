"use client";

import { useState, useEffect, useCallback } from "react";
import { HOTELS_API } from "@/config/api";
import { normalizeHotelList } from "@/lib/hotels";

const HOTELS_URL = "https://dashboard-hotelmanagement.vercel.app/api/hotels";

/**
 * In the browser we use same-origin /api/hotels (Next.js proxy) to avoid CORS.
 * On server we can call the external URL directly.
 */
function getFetchUrl() {
  if (typeof window !== "undefined") {
    const base = HOTELS_API.getBaseUrl();
    return base ? `${base}/api/hotels` : "/api/hotels";
  }
  return HOTELS_URL;
}

/**
 * Reusable fetch for hotels: loading, error, and data state.
 * Uses useEffect + useState + async/await with proper error handling.
 *
 * @param {object} options
 * @param {boolean} [options.enabled=true] - If false, skips the fetch.
 * @returns {{ hotels: array, loading: boolean, error: Error | null, refetch: function }}
 */
export function useFetchHotels(options = {}) {
  const { enabled = true } = options;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = getFetchUrl();
      const res = await fetch(url);
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }
      const json = await res.json();
      const normalized = normalizeHotelList(json);
      setHotels(Array.isArray(normalized) ? normalized : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchHotels();
  }, [enabled, fetchHotels]);

  return { hotels, loading, error, refetch: fetchHotels };
}

export default useFetchHotels;
