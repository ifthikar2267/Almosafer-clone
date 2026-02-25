"use client";

import { useState } from "react";

const TRUNCATE_LENGTH = 320;

export default function HotelOverview({ description = "" }) {
  const [expanded, setExpanded] = useState(false);
  const text = String(description).trim();
  const shouldTruncate = text.length > TRUNCATE_LENGTH;
  const display = shouldTruncate && !expanded ? `${text.slice(0, TRUNCATE_LENGTH)}...` : text;

  if (!text) {
    return (
      <section className="py-12 px-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About this hotel</h2>
        <p className="text-gray-600">No description available.</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About this hotel</h2>
      <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{display}</p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-[#004C5A] font-semibold hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </section>
  );
}
