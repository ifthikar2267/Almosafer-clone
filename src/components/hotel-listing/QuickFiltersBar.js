"use client";

const OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price", label: "Lowest Price" },
  { value: "rating", label: "Highest Guest Rating" },
];

/**
 * Quick sort filters – OTA style. Rounded-full buttons.
 * Active: bg-teal-600 text-white. Inactive: bg-gray-100 hover:bg-gray-200.
 */
export default function QuickFiltersBar({ value, onChange }) {
  return (
    <div className="mb-4 mt-3 flex flex-wrap gap-2 overflow-x-auto pb-1 md:overflow-visible">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            aria-pressed={isActive}
            className={`
              shrink-0 rounded-full px-2 py-1 text-sm font-medium transition-colors
              ${isActive ? "bg-[#E9F6F8] text-[#0C9AB0] border border-[#BDE4EA] cursor-pointer" : "bg-white text-gray-700 border border-gray-200 cursor-pointer"}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
