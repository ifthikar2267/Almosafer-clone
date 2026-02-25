"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays, format } from "date-fns";
import { MapPin, CalendarDays, Users, Search } from "lucide-react";

const TEAL = "#004C5A";

const DESTINATION_OPTIONS = [
  "Dubai, United Arab Emirates",
  "Cairo, Egypt",
  "Manama, Bahrain",
  "Istanbul, Turkey",
  "Makkah, Saudi Arabia",
];

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
  const [dest, setDest] = useState(destination || "Dubai");
  const [cin, setCin] = useState(checkIn);
  const [cout, setCout] = useState(checkOut);
  const [rooms, setRooms] = useState(initialRooms);
  const [a, setA] = useState(adults);
  const [c, setC] = useState(children);
  const [guestAnchor, setGuestAnchor] = useState(null);
  const [destOpen, setDestOpen] = useState(false);

  const guestLabel = `${rooms} Room${rooms !== 1 ? "s" : ""}, ${a} Adult${a !== 1 ? "s" : ""}, ${c} Child${c !== 1 ? "ren" : ""}`;
  const filteredDest = dest
    ? DESTINATION_OPTIONS.filter((d) => d.toLowerCase().includes(dest.toLowerCase()))
    : DESTINATION_OPTIONS;

  const handleSearch = () => {
    const city = dest ? dest.split(",")[0].trim() : "";
    onSearch?.({ city, checkIn: cin, checkOut: cout, rooms, adults: a, children: c });
    setGuestAnchor(null);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#fff",
      "&.Mui-focused fieldset": { borderColor: TEAL },
      "&:hover fieldset": { borderColor: TEAL },
    },
  };

  return (
    <Box className="w-full rounded-xl border border-gray-200 bg-white shadow-md" sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr 1fr 1.3fr auto" },
          gap: { xs: 1.5, sm: 1.5 },
          alignItems: "end",
        }}
      >
        <Box sx={{ ...inputSx, position: "relative" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="City or hotel"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            onFocus={() => setDestOpen(true)}
            onBlur={() => setTimeout(() => setDestOpen(false), 200)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <MapPin size={18} style={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
              sx: { py: 0.5 },
            }}
          />
          {destOpen && filteredDest.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 0.5,
                bgcolor: "white",
                borderRadius: 1,
                boxShadow: 2,
                zIndex: 15,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {filteredDest.slice(0, 5).map((opt) => (
                <Box
                  key={opt}
                  component="button"
                  type="button"
                  onClick={() => {
                    setDest(opt);
                    setDestOpen(false);
                  }}
                  sx={{
                    display: "block",
                    width: "100%",
                    px: 2,
                    py: 1.25,
                    cursor: "pointer",
                    border: 0,
                    bgcolor: "transparent",
                    textAlign: "left",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Typography variant="body2">{opt}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={inputSx}>
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

        <Box sx={inputSx}>
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

        <Box>
          <Button
            fullWidth
            variant="outlined"
            onClick={(e) => setGuestAnchor(e.currentTarget)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "grey.300",
              color: "text.primary",
              py: 1.25,
              px: 2,
              minHeight: 40,
              "&:hover": { borderColor: TEAL, bgcolor: `${TEAL}08` },
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
              paper: { sx: { borderRadius: 2, mt: 1.5, minWidth: 280 } },
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

        <Button
          variant="outlined"
          onClick={handleSearch}
          startIcon={<Search size={18} />}
          sx={{
            borderColor: TEAL,
            color: TEAL,
            py: 1.25,
            px: { xs: 2, sm: 3 },
            borderRadius: "10px",
            fontWeight: 600,
            textTransform: "none",
            minHeight: 40,
            "&:hover": { borderColor: TEAL, bgcolor: `${TEAL}12`, borderWidth: 2 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
}
