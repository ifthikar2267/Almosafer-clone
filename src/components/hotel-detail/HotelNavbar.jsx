"use client";

import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const TAB_LABELS = [
  "Photos",
  "Room Choices",
  "Amenities",
  "About the property",
  "FAQs",
  "Similar properties",
];

export default function HotelNavbar({ value = 0, onChange }) {
  const [internalValue, setInternalValue] = useState(0);
  const activeValue = value ?? internalValue;
  const handleChange = onChange ?? ((_, v) => setInternalValue(v));

  return (
    <Box className="border-b border-gray-200 bg-white shadow-sm" sx={{
    position: "sticky",
    top: 60,
    zIndex: 100,
  }}>
      <div className="mx-auto max-w-7xl px-4 md:px-20">
        <Tabs
          value={activeValue}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minHeight: 48,
              color: "#6b7280",
            },
            "& .Mui-selected": {
              color: "#1976d2",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
              height: 3,
            },
            "& .MuiTabs-flexContainer": {
              gap: 0,
            },
          }}
        >
          {TAB_LABELS.map((label, i) => (
            <Tab key={label} label={label} id={`hotel-tab-${i}`} />
          ))}
        </Tabs>
      </div>
    </Box>
  );
}
