"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import SlideUpDialog from "@/components/ui/SlideUpDialog";

export default function DestinationSearch({ setIsOpened, isOpened, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const cities = [
    { id: 1, name: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
    { id: 2, name: "Manama", country: "Bahrain", countryCode: "BH" },
    { id: 3, name: "Cairo", country: "Egypt", countryCode: "EG" },
    { id: 4, name: "Makkah", country: "Saudi Arabia", countryCode: "SA" },
    { id: 5, name: "Istanbul", country: "Turkey", countryCode: "TR" },
  ];

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.country.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (city) => {
    const selected = `${city.name}, ${city.country}`;
    setQuery(selected);
    onSelect(selected);
    setResults([]);
    setIsOpened(false);
  };

  return (
    <SlideUpDialog
      open={isOpened}
      onClose={() => setIsOpened(false)}
      title="Property search"
    >
      <div className="relative w-85 mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl p-2 pl-10 text-gray-700 text-md bg-gray-100 outline-none"
          placeholder="Where are you going?"
        />

        {results.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 text-gray-600 overflow-y-auto z-10">
            {results.map((city) => (
              <li
                key={city.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(city)}
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="px-2 text-black font-medium">Stays are available in these 5 cities</h2>
        <ul className="mt-3 space-y-2">
          {cities.map((city) => (
            <li
              key={city.id}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(city)}
            >
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{city.name}, {city.country}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideUpDialog>
  );
}
