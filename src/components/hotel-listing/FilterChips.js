"use client";

import Chip from "@mui/material/Chip";

/**
 * Active filter chips above results. Each chip removable; "Clear all" when multiple.
 */
export default function FilterChips({
  selectedAreas = [],
  selectedTypes = [],
  selectedChains = [],
  selectedStarRatings = [],
  selectedAmenityNames = [],
  onRemoveArea,
  onRemoveType,
  onRemoveChain,
  onRemoveStar,
  onRemoveAmenity,
  onClearAll,
}) {
  const chips = [];

  selectedAreas.forEach((name) => {
    chips.push({ key: `area-${name}`, label: name, onRemove: () => onRemoveArea?.(name) });
  });
  selectedTypes.forEach((name) => {
    chips.push({ key: `type-${name}`, label: name, onRemove: () => onRemoveType?.(name) });
  });
  selectedChains.forEach((name) => {
    chips.push({ key: `chain-${name}`, label: name, onRemove: () => onRemoveChain?.(name) });
  });
  selectedStarRatings.forEach((value) => {
    chips.push({
      key: `star-${value}`,
      label: `${value} stars`,
      onRemove: () => onRemoveStar?.(value),
    });
  });
  selectedAmenityNames.forEach((name) => {
    chips.push({ key: `amenity-${name}`, label: name, onRemove: () => onRemoveAmenity?.(name) });
  });

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map(({ key, label, onRemove }) => (
        <Chip
          key={key}
          label={label}
          onDelete={onRemove}
          size="small"
          className="rounded-full"
          sx={{
            bgcolor: "#f0fdfa",
            color: "#0d9488",
            border: "1px solid #99f6e4",
            "& .MuiChip-deleteIcon": { color: "#0d9488", "&:hover": { color: "#0f766e" } },
          }}
        />
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-medium text-teal-600 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
