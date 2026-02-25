"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

export default function AmenitiesList({ amenities = [] }) {
  const list = Array.isArray(amenities) ? amenities : [];
  if (list.length === 0) {
    return (
      <Box className="py-4">
        <Typography variant="body2" color="text.secondary">
          No amenities listed.
        </Typography>
      </Box>
    );
  }
  return (
    <Box className="flex flex-wrap gap-2 py-2">
      {list.map((item, i) => (
        <Chip
          key={i}
          label={typeof item === "string" ? item : item?.name ?? String(item)}
          size="medium"
          sx={{
            borderRadius: "9999px",
            bgcolor: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            "& .MuiChip-label": { fontWeight: 500 },
          }}
        />
      ))}
    </Box>
  );
}
