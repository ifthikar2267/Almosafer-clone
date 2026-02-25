"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { formatAED } from "@/lib/formatAED";

export default function BookingSidebar({ price, searchParams = "" }) {
  const href = "#rooms" + (searchParams ? `?${searchParams}` : "");
  const formatted = formatAED(price);

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
          href={href}
          variant="contained"
          fullWidth
          size="large"
          className="rounded-lg font-semibold normal-case"
          sx={{ bgcolor: "#ee4056", py: 1.5, "&:hover": { bgcolor: "#d9364c" } }}
        >
          Book now
        </Button>
      </div>
    </aside>
  );
}
