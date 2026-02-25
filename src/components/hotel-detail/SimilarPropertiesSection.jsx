"use client";

import Typography from "@mui/material/Typography";
import SimilarPropertyCard from "./SimilarPropertyCard";

/**
 * Filters properties by same type as current and excludes current property.
 * Falls back to "exclude current only" when no same-type matches.
 * @param {Object} currentProperty - Current hotel/property
 * @param {Array} properties - All candidate properties
 * @param {number} [limit=8] - Max number to show
 * @returns {Array}
 */
export function getSimilarProperties(currentProperty, properties, limit = 8) {
  if (!currentProperty || !Array.isArray(properties) || properties.length === 0) {
    return [];
  }
  const currentId = String(currentProperty._id ?? currentProperty.id ?? "").trim();
  const currentType = (currentProperty.propertyType ?? currentProperty.hotelType ?? "Hotel").toString().trim();

  const excludeCurrent = (item) => {
    const itemId = String(item._id ?? item.id ?? "").trim();
    return itemId !== currentId;
  };

  let similar = properties.filter((item) => {
    const itemType = (item.propertyType ?? item.hotelType ?? "Hotel").toString().trim();
    return itemType === currentType && excludeCurrent(item);
  });

  if (similar.length === 0) {
    similar = properties.filter(excludeCurrent);
  }

  return similar.slice(0, limit);
}

export default function SimilarPropertiesSection({
  currentProperty,
  properties = [],
  searchParams = "",
  limit = 8,
  title = "Similar properties",
}) {
  const similar = getSimilarProperties(currentProperty, properties, limit);

  if (similar.length === 0) {
    return null;
  }

  return (
    <section id="similar" className="border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Typography
          variant="h6"
          fontWeight={700}
          className="mb-6 text-gray-900"
          component="h2"
        >
          {title}
        </Typography>

       <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 sm:mb-4">
  {similar.map((property) => (
    <SimilarPropertyCard
      key={property._id ?? property.id}
      property={property}
      searchParams={searchParams}
    />
  ))}
</div>
      </div>
    </section>
  );
}
