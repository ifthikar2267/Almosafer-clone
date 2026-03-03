"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { LOCATION_DATA } from "@/utils/locationData";

const groupLabels = {
  country: "Countries",
  city: "Cities",
  area: "Areas / Districts",
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function highlightMatch(text, query) {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="rounded bg-yellow-100 px-0.5">{match}</mark>
      {after}
    </>
  );
}

export function LocationSearch({ className, onLocationChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const debouncedQuery = useDebounce(inputValue, 300);
  const isSearching = inputValue !== debouncedQuery;
  const containerRef = useRef(null);

  const groupedResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];

    const filtered = LOCATION_DATA.filter((loc) => {
      const haystack = (loc.name + " " + (loc.parent ?? "")).toLowerCase();
      return haystack.includes(q);
    });

    const byType = {
      country: [],
      city: [],
      area: [],
    };

    filtered.forEach((loc) => {
      byType[loc.type].push(loc);
    });

    const groups = [];
    ["country", "city", "area"].forEach((type) => {
      if (byType[type].length) {
        groups.push({
          type,
          label: groupLabels[type],
          items: byType[type],
        });
      }
    });

    return groups;
  }, [debouncedQuery]);

  const flatResults = useMemo(
    () =>
      groupedResults.flatMap((group) =>
        group.items.map((item) => ({ group, item }))
      ),
    [groupedResults]
  );

  const hasResults = flatResults.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = useCallback(
    (item) => {
      setSelectedLocation(item);
      setInputValue(item.name);
      setIsOpen(false);
      setActiveIndex(-1);

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      const slug = item.id || slugify(item.name);
      params.set("location", slug);
      params.set("type", item.type);

      router.push(`?${params.toString()}`, { scroll: false });
      onLocationChange?.(item);
    },
    [onLocationChange, router, searchParams]
  );

  const handleKeyDown = (event) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true);
      if (flatResults.length > 0) setActiveIndex(0);
      return;
    }

    if (!hasResults) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev < flatResults.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : flatResults.length - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatResults.length) {
        handleSelect(flatResults[activeIndex].item);
      } else if (flatResults[0]) {
        handleSelect(flatResults[0].item);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const showDropdown =
    isOpen && (isSearching || hasResults) && inputValue.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative mb-3 w-full max-w-xl ${className ?? ""}`}
    >
      {/* Sidebar-style: light grey, rounded, search icon left – like Property Name filter */}
      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm focus-within:border-gray-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 md:text-base">
        <Search
          className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500 md:h-5 md:w-5"
          aria-hidden="true"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (inputValue.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="location-search-listbox"
          aria-activedescendant={
            activeIndex >= 0 && flatResults[activeIndex]
              ? `location-option-${flatResults[activeIndex].item.id}`
              : undefined
          }
        />
        {inputValue && (
          <button
            type="button"
            className="ml-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Clear location search"
            onClick={() => {
              setInputValue("");
              setIsOpen(false);
              setActiveIndex(-1);
            }}
          >
            <X className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="location-search-listbox"
          role="listbox"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
        >
          {isSearching && (
            <div className="px-4 py-3 text-xs text-gray-400 md:text-sm">
              Searching…
            </div>
          )}

          {!isSearching && !hasResults && (
            <div className="px-4 py-3 text-xs text-gray-500 md:text-sm">
              No locations found.
            </div>
          )}

          {!isSearching &&
            groupedResults.map((group) => {
              if (!group.items.length) return null;

              return (
                <div
                  key={group.type}
                  className="border-t border-gray-100 first:border-t-0"
                >
                  <div className="bg-gray-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 md:text-xs">
                    {group.label}
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {group.items.map((item) => {
                      const flatIndex = flatResults.findIndex(
                        (row) => row.item.id === item.id
                      );
                      const isActive = flatIndex === activeIndex;

                      return (
                        <li
                          key={item.id}
                          id={`location-option-${item.id}`}
                          role="option"
                          aria-selected={isActive}
                          className={`cursor-pointer px-4 py-2.5 text-sm md:text-[15px] ${
                            isActive
                              ? "bg-teal-50 text-teal-900"
                              : "bg-white text-gray-900 hover:bg-gray-50"
                          }`}
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => {
                            if (flatIndex >= 0) setActiveIndex(flatIndex);
                          }}
                          onClick={() => handleSelect(item)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {highlightMatch(item.name, debouncedQuery)}
                            </span>
                            {item.parent && (
                              <span className="text-xs text-gray-500">
                                {highlightMatch(item.parent, debouncedQuery)}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </div>
      )}

      {selectedLocation && (
        <p className="mt-1 text-xs text-gray-500 md:text-sm">
          Showing results for{" "}
          <span className="font-medium">{selectedLocation.name}</span>
        </p>
      )}
    </div>
  );
}

export default LocationSearch;

