"use client";

import { createContext, useContext, useState, useCallback } from "react";

const SearchResultsContext = createContext(undefined);

export function SearchResultsProvider({ children }) {
  const [preFetchedHotels, setPreFetchedHotels] = useState(null);
  const [searchParams, setSearchParamsState] = useState(null);

  const setSearchResults = useCallback((hotels, params) => {
    setPreFetchedHotels(Array.isArray(hotels) ? hotels : null);
    setSearchParamsState(params && typeof params === "object" ? params : null);
  }, []);

  const consumePreFetchedHotels = useCallback(() => {
    const hotels = preFetchedHotels;
    setPreFetchedHotels(null);
    setSearchParamsState(null);
    return hotels;
  }, [preFetchedHotels]);

  return (
    <SearchResultsContext.Provider
      value={{
        preFetchedHotels,
        searchParams,
        setSearchResults,
        consumePreFetchedHotels,
      }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
}

export function useSearchResults() {
  const context = useContext(SearchResultsContext);
  if (context === undefined) {
    throw new Error("useSearchResults must be used within SearchResultsProvider");
  }
  return context;
}
