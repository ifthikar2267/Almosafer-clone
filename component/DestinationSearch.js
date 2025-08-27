"use client";

import { useState, useEffect } from "react";

export default function DestinationSearch() {
  const [query, setQuery] = useState("Dubai, AE");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/cities?q=${query}`);
      const data = await res.json();
      setResults(data.data || []);
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-72">
       <span className="text-gray-500 text-sm">Destination</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full outline-none focus:ring-0 focus:border-transparent text-gray-800 text-md"
      />
      {results.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 text-gray-600 overflow-y-auto z-10">
          {results.map((city) => (
            <li
              key={city.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(`${city.name}, ${city.countryCode}`);
                setResults([]);
              }}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
