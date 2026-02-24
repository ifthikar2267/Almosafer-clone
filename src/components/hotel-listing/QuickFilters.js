"use client";

import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";

const TEAL = "#0C9AB0";

const OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price", label: "Lowest Price" },
  { value: "rating", label: "Highest Guest Rating" },
];

/**
 * Quick sort filters for hotel listing. Renders above the card grid.
 * Active filter: bold text, colored border. Smooth transition on change/hover.
 * Responsive: horizontal scroll on small screens.
 */
export default function QuickFilters({ value, onChange }) {
  return (
    <Box
      className="mb-4 overflow-x-auto pb-1 md:overflow-visible"
      sx={{ "&::-webkit-scrollbar": { height: 6 } }}
    >
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v) => v != null && onChange?.(v)}
        aria-label="Quick sort filters"
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
              backgroundColor: `#E9F6F8`,
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
        {OPTIONS.map((opt) => (
          <ToggleButton key={opt.value} value={opt.value}>
            <Typography
              variant="body2"
              component="span"
              fontWeight={value === opt.value ? 700 : 500}
              sx={{ transition: "font-weight 0.2s ease" }}
            >
              {opt.label}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
