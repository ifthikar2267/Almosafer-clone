"use client";

import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";

const TEAL = "#004C5A";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price", label: "Lowest Price" },
  { value: "rating", label: "Highest Guest Rating" },
];

/**
 * Quick sort bar for hotel listing. Active option: bold, colored border, smooth hover.
 * Mobile: horizontal scrollable row. Optional sticky.
 */
export default function SortTabs({ value, onChange, sticky = false }) {
  return (
    <Box
      className={`mb-4 flex overflow-x-auto pb-1 md:overflow-visible ${sticky ? "sticky top-0 z-[1] bg-gray-50 pt-2 pb-2 -mx-1 px-1 md:top-24" : ""}`}
      sx={{ "&::-webkit-scrollbar": { height: 6 } }}
    >
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v) => v != null && onChange?.(v)}
        aria-label="Sort results"
        className="flex shrink-0 gap-2 md:flex-wrap"
        sx={{
          gap: 0.5,
          "& .MuiToggleButtonGroup-grouped": {
            border: "2px solid transparent",
            borderRadius: "9999px !important",
            py: 1.25,
            px: 3,
            textTransform: "none",
            transition: "border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease",
            "&.Mui-selected": {
              backgroundColor: `${TEAL}12`,
              color: TEAL,
              borderColor: TEAL,
              "& .MuiTypography-root": { fontWeight: 700 },
              "&:hover": {
                backgroundColor: `${TEAL}18`,
                borderColor: TEAL,
              },
            },
            "&:not(.Mui-selected)": {
              backgroundColor: "#fff",
              color: "#6b7280",
              borderColor: "#e5e7eb",
              "&:hover": {
                backgroundColor: "#f9fafb",
                color: "#374151",
                borderColor: "#d1d5db",
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <ToggleButton key={opt.value} value={opt.value}>
            <Typography variant="body2" component="span" fontWeight={value === opt.value ? 700 : 500}>
              {opt.label}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
