"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const SERVICES = [
  { id: "transfers", label: "Airport transfer", icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-11/transfers.svg" },
  { id: "car", label: "Car rental", icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/carrental.svg" },
  { id: "activities", label: "Activities", icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/intactivities.svg" },
  { id: "packages", label: "Packages", icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/packages.svg" },
  { id: "lounges", label: "Airport lounge passes", icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/lounges.svg" },
  { id: "vip", label: "VIP meet & greet", icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/vipmeetandgreet.svg" },
  { id: "more", label: "More services", icon: "https://static-sites.almosafer.com/assets/images/svg/visual_icons/moreservices.svg" },
];

export default function ServicesGrid() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: "white" }}>
      <Box sx={{ maxWidth: "lg", mx: "auto", px: { xs: 2, md: 3 } }}>
        <Grid
          container
          spacing={2}
          sx={{
            flexWrap: { xs: "nowrap", md: "wrap" },
            overflowX: { xs: "auto", md: "visible" },
            pb: 1,
            gap: 2,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {SERVICES.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.id} sx={{ minWidth: { xs: 88, sm: 100 } }}>
              <Box
                component="button"
                type="button"
                sx={{
                  width: "100%",
                  border: 0,
                  borderRadius: "16px",
                  bgcolor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  p: 2,
                  minHeight: { xs: 96, sm: 108, md: 120 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", transform: "scale(1.03)" },
                }}
              >
                <Box
                  component="img"
                  src={item.icon}
                  alt=""
                  sx={{ width: { xs: 36, sm: 40, md: 48 }, height: { xs: 36, sm: 40, md: 48 }, objectFit: "contain", mb: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary", textAlign: "center", fontSize: { xs: "0.6875rem", sm: 12, md: 14 } }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
