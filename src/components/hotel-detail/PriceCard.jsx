"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const RED = "#ee4056";

export default function PriceCard({ price, searchParams = "" }) {
  const formatted = price != null
    ? new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 0 }).format(price)
    : "—";

  return (
    <Box
      className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-md"
      sx={{ minWidth: 280 }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        From
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ color: "#004C5A", mb: 1 }}>
        {formatted}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Total for 1 night (incl. VAT)
      </Typography>
      <Button
        component={Link}
        href="#rooms"
        variant="contained"
        fullWidth
        size="large"
        className="rounded-lg font-semibold normal-case"
        sx={{ bgcolor: RED, py: 1.5, "&:hover": { bgcolor: "#d9364c" } }}
      >
        Book now
      </Button>
    </Box>
  );
}
