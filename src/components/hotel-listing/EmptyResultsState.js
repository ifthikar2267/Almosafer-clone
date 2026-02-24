"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { SearchX } from "lucide-react";

/**
 * No-results / empty state with clear typography hierarchy. RTL-ready.
 */
export default function EmptyResultsState({
  title = "No hotels found",
  subtext = "Try changing your destination, dates, or filters.",
  actionLabel = "Reset filters",
  onAction,
  className = "",
}) {
  return (
    <Box
      className={`flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 ps-6 pe-6 text-center ${className}`}
      sx={{ minHeight: 280 }}
    >
      <Box
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400"
        aria-hidden
      >
        <SearchX size={32} strokeWidth={1.5} />
      </Box>
      <Typography variant="h6" fontWeight={700} color="text.primary" className="mb-2" sx={{ fontSize: "1.125rem" }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-6 max-w-sm">
        {subtext}
      </Typography>
      {onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          className="rounded-lg font-semibold transition-transform duration-200 hover:scale-[1.02]"
          sx={{ bgcolor: "#ee4056", "&:hover": { bgcolor: "#d9364c" } }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
