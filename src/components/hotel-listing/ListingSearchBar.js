"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays } from "date-fns";
import { MapPin, Search, CalendarDays, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchAreasFromHotels } from "@/services/hotel.service";
import { LOCATION_DATA } from "@/utils/locationData";
import { grey } from "node_modules/@mui/material/colors";

const TEAL = "#004C5A";

const groupLabels = {
  country: "Countries",
  city: "Cities",
  area: "Areas / Districts",
};

function highlightMatch(text, query) {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return (
    <>
      {before}
      <mark className="rounded bg-yellow-100 px-0.5">{match}</mark>
      {after}
    </>
  );
}

const today = new Date();
const tomorrow = addDays(today, 1);

export default function ListingSearchBar({
  destination = "",
  checkIn = today,
  checkOut = tomorrow,
  rooms: initialRooms = 1,
  adults = 2,
  children = 0,
  onSearch,
}) {
  const destContainerRef = useRef(null);

  const [dest, setDest] = useState(destination || "Dubai");
  const [apiAreas, setApiAreas] = useState([]);
  const [cin, setCin] = useState(checkIn);
  const [cout, setCout] = useState(checkOut);
  const [rooms, setRooms] = useState(initialRooms);
  const [a, setA] = useState(adults);
  const [c, setC] = useState(children);
  useEffect(() => {
    if (destination) setDest(destination);
    setCin(checkIn);
    setCout(checkOut);
    setA(adults);
    setC(children);
  }, [destination, checkIn, checkOut, adults, children]);

  useEffect(() => {
    fetchAreasFromHotels().then((areas) => setApiAreas(areas));
  }, []);

  const [guestAnchor, setGuestAnchor] = useState(null);
  const [destOpen, setDestOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(dest, 300);

  const locationOptions = useMemo(() => {
    const apiItems = apiAreas.map((a) => ({ id: a.id, name: a.name, type: "area", parent: null }));
    const merged = [...apiItems];
    LOCATION_DATA.forEach((loc) => {
      if (!merged.some((m) => m.name === loc.name && m.type === loc.type)) {
        merged.push(loc);
      }
    });
    return merged;
  }, [apiAreas]);

  const groupedResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const filtered = q
      ? locationOptions.filter((loc) => {
          const haystack = (loc.name + " " + (loc.parent ?? "")).toLowerCase();
          return haystack.includes(q);
        })
      : locationOptions;
    const byType = { country: [], city: [], area: [] };
    filtered.forEach((loc) => byType[loc.type].push(loc));
    const groups = [];
    ["country", "city", "area"].forEach((type) => {
      if (byType[type].length) groups.push({ type, label: groupLabels[type], items: byType[type] });
    });
    return groups;
  }, [debouncedQuery, locationOptions]);

  const flatResults = useMemo(
    () => groupedResults.flatMap((g) => g.items.map((item) => ({ group: g, item }))),
    [groupedResults]
  );
  const hasResults = flatResults.length > 0;

  useEffect(() => {
    if (!destOpen) return;
    function handleClickOutside(e) {
      if (destContainerRef.current && !destContainerRef.current.contains(e.target)) {
        setDestOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [destOpen]);

  const handleLocationSelect = useCallback((item) => {
    setDest(item.name);
    setDestOpen(false);
    setActiveIndex(-1);
  }, []);

  const guestLabel = `${rooms} Room${rooms !== 1 ? "s" : ""}, ${a} Adult${a !== 1 ? "s" : ""}, ${c} Child${c !== 1 ? "ren" : ""}`;

  const handleSearch = () => {
    const city = dest ? dest.split(",")[0].trim() : "";
    onSearch?.({ city, checkIn: cin, checkOut: cout, rooms, adults: a, children: c });
    setGuestAnchor(null);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      backgroundColor: "transparent",
      "& fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "none" },
      "&:hover fieldset": { border: "none" },
    },
  };

  return (
    <Box
      className="w-full"
      sx={{
        bgcolor: "white",
        py: 1,
      }}
    >
      {/* Segmented bar: area | check-in | check-out | guest | search */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr 1fr 1.3fr auto" },
          gap: 0,
          alignItems: "stretch",
          minHeight: 48,
        }}
      >
        {/* Area */}
        <Box ref={destContainerRef} sx={{ position: "relative", borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" }, overflow: "hidden" }}>
          <Box
            className="flex items-center px-3 py-2 focus-within:bg-gray-50"
            sx={{ minHeight: 48, "&:focus-within": { bgcolor: "grey.50" } }}
          >
            <MapPin size={18} style={{ color: "#6b7280", marginRight: 8, flexShrink: 0 }} />
            <input
              type="text"
              value={dest}
              onChange={(e) => {
                setDest(e.target.value);
                setDestOpen(true);
              }}
              onFocus={() => dest.trim() && setDestOpen(true)}
              onKeyDown={(e) => {
                if (!destOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                  setDestOpen(true);
                  if (flatResults.length > 0) setActiveIndex(0);
                  return;
                }
                if (!hasResults) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((p) => (p < flatResults.length - 1 ? p + 1 : 0));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((p) => (p > 0 ? p - 1 : flatResults.length - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (activeIndex >= 0 && activeIndex < flatResults.length) {
                    handleLocationSelect(flatResults[activeIndex].item);
                  } else if (flatResults[0]) handleLocationSelect(flatResults[0].item);
                } else if (e.key === "Escape") {
                  setDestOpen(false);
                  setActiveIndex(-1);
                }
              }}
              placeholder="Search"
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
              style={{ minWidth: 0 }}
            />
          </Box>
          {destOpen && dest.trim() && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 0.5,
                bgcolor: "white",
                boxShadow: 2,
                zIndex: 15,
                border: "1px solid",
                borderColor: "divider",
                maxHeight: 320,
                overflowY: "auto",
              }}
            >
              {flatResults.length === 0 ? (
                <Box sx={{ px: 2, py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No locations found.
                  </Typography>
                </Box>
              ) : (
                groupedResults.map((group) => (
                  <Box key={group.type}>
                    <Box sx={{ px: 2, py: 1, bgcolor: "grey.100", borderBottom: 1, borderColor: "divider" }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "11px" }}>
                        {group.label}
                      </Typography>
                    </Box>
                    {group.items.map((item) => {
                      const idx = flatResults.findIndex((r) => r.item.id === item.id);
                      const isActive = idx === activeIndex;
                      return (
                        <Box
                          key={item.id}
                          component="button"
                          type="button"
                          onClick={() => handleLocationSelect(item)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onMouseDown={(e) => e.preventDefault()}
                          sx={{
                            display: "block",
                            width: "100%",
                            px: 2,
                            py: 1.25,
                            cursor: "pointer",
                            border: 0,
                            bgcolor: isActive ? "rgba(13, 148, 136, 0.08)" : "transparent",
                            textAlign: "left",
                            "&:hover": { bgcolor: isActive ? "rgba(13, 148, 136, 0.08)" : "action.hover" },
                          }}
                        >
                          <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                            {highlightMatch(item.name, debouncedQuery)}
                          </Typography>
                          {item.parent && (
                            <Typography variant="caption" color="text.secondary" component="span" sx={{ display: "block", mt: 0.25 }}>
                              {highlightMatch(item.parent, debouncedQuery)}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* Check-in */}
        <Box sx={{ ...inputSx, borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" } }}>
          <DatePicker
            value={cin}
            onChange={(d) => d && setCin(d)}
            minDate={today}
            maxDate={cout}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                placeholder: "Check-in",
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0.5, borderRadius:0 }}>
                      <CalendarDays size={18} style={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  sx: { py: 0.5 },
                },
              },
            }}
          />
        </Box>

        <Box sx={{inputSx, borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" }}}>
          <DatePicker
            value={cout}
            onChange={(d) => d && setCout(d)}
            minDate={cin}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                placeholder: "Check-out",
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <CalendarDays size={18} style={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  sx: { py: 0.5 },
                },
              },
            }}
          />
        </Box>

        {/* Guest */}
        <Box sx={{ borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" } }}>
          <Button
            fullWidth
            variant="text"
            onClick={(e) => setGuestAnchor(e.currentTarget)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: 0,
              color: "text.primary",
              py: 1.25,
              px: 2,
              minHeight: 48,
              "&:hover": { bgcolor: "grey.50" },
            }}
          >
            <Users size={18} style={{ marginRight: 8, color: "#6b7280", flexShrink: 0 }} />
            <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1, textAlign: "left" }}>
              {guestLabel}
            </Typography>
          </Button>
          <Popover
            open={Boolean(guestAnchor)}
            anchorEl={guestAnchor}
            onClose={() => setGuestAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: { sx: { mt: 1.5, minWidth: 280 } },
            }}
          >
            <Stack sx={{ p: 2 }} spacing={0}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="body2" fontWeight={500}>Rooms</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={() => setRooms((x) => Math.max(1, x - 1))} sx={{ border: 1, borderColor: "grey.300", width: 32, height: 32 }}>−</IconButton>
                  <Typography variant="body2" sx={{ minWidth: 28, textAlign: "center", fontWeight: 500 }}>{rooms}</Typography>
                  <IconButton size="small" onClick={() => setRooms((x) => Math.min(5, x + 1))} sx={{ border: 1, borderColor: TEAL, color: TEAL, width: 32, height: 32 }}>+</IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="body2" fontWeight={500}>Adults</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={() => setA((x) => Math.max(1, x - 1))} sx={{ border: 1, borderColor: "grey.300", width: 32, height: 32 }}>−</IconButton>
                  <Typography variant="body2" sx={{ minWidth: 28, textAlign: "center", fontWeight: 500 }}>{a}</Typography>
                  <IconButton size="small" onClick={() => setA((x) => Math.min(9, x + 1))} sx={{ border: 1, borderColor: TEAL, color: TEAL, width: 32, height: 32 }}>+</IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
                <Typography variant="body2" fontWeight={500}>Children</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={() => setC((x) => Math.max(0, x - 1))} sx={{ border: 1, borderColor: "grey.300", width: 32, height: 32 }}>−</IconButton>
                  <Typography variant="body2" sx={{ minWidth: 28, textAlign: "center", fontWeight: 500 }}>{c}</Typography>
                  <IconButton size="small" onClick={() => setC((x) => Math.min(9, x + 1))} sx={{ border: 1, borderColor: TEAL, color: TEAL, width: 32, height: 32 }}>+</IconButton>
                </Stack>
              </Stack>
            </Stack>
          </Popover>
        </Box>

        {/* Search */}
        <Button
          variant="outlined"
          onClick={handleSearch}
          startIcon={<Search size={18} color="#0C9AB0"/>}
          sx={{
            borderColor: "#0C9AB0",
            color: "#0C9AB0",
            fontWeight: 600,
            textTransform: "none",
            minHeight: 48,
            px: { xs: 2, sm: 3 },
            "&:hover": { borderColor: "#0C9AB0", bgcolor: `${"#0C9AB0"}12`, borderWidth: 1 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
}
