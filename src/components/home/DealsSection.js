"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const DEALS = [
  { code: "VACATION", title: "$1,000 on stays", desc: "Your dream escape awaits" },
  { code: "TRAVEL", title: "$500 on flights", desc: "Book with exclusive savings" },
  { code: "UMRAH", title: "Up to 10% OFF Umrah", desc: "Exclusive Umrah offers" },
];

export default function DealsSection() {
  return (
    <Box component="section" sx={{ py: 6, bgcolor: "grey.50" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box className="mb-6 flex items-center justify-between">
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            Special deals for you
          </Typography>
          <Typography
            component={Link}
            href="/city"
            sx={{ fontSize: 14, fontWeight: 600, color: "#004C5A", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            View all
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
          {DEALS.map((deal) => (
            <Box
              key={deal.code}
              component={Link}
              href="/city"
              sx={{
                minWidth: 280,
                borderRadius: 2,
                bgcolor: "white",
                boxShadow: 1,
                p: 2,
                border: "1px solid",
                borderColor: "grey.200",
                textDecoration: "none",
                color: "inherit",
                "&:hover": { boxShadow: 2 },
              }}
            >
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                Code {deal.code}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5 }}>
                {deal.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {deal.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
