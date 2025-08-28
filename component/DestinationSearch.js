"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Search, MapPin } from "lucide-react";

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

  // when selecting a city (from search or popular)
  const handleSelect = (city) => {
    const selected = `${city.name}, ${city.country}`;
    setQuery(selected);
    onSelect(selected);
    setResults([]);
    setIsOpened(false);
  };

  return (
    <Dialog open={isOpened} onClose={() => setIsOpened(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 top-0 bg-white shadow-lg animate-slide-up p-5 overflow-y-auto">
        
        {/* Header */}
        <div className="relative flex items-center mb-6">
          <button onClick={() => setIsOpened(false)} className="absolute left-0">
            <XMarkIcon className="w-6 h-6 text-cyan-600" />
          </button>
          <h2 className="mx-auto text-lg font-semibold text-gray-800">
            Property search
          </h2>
        </div>

        {/* Input */}
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

        {/* Popular Cities */}
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

      </div>
    </Dialog>
  );
}
