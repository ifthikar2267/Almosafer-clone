"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { SideMenu } from "@/components/layout";
import { searchHotels } from "@/services/hotel.service";
import { useSearchResults } from "@/context/SearchResultsContext";

const LOGO_WHITE =
  "https://static-sites.almosafer.com/assets/images/svg/logos/almosafer-re-en-white.svg";

const TABS = [
  { id: "flights", label: "Flights", href: "#" },
  { id: "stays", label: "Stays", href: "#" },
  { id: "activities", label: "Activities", href: "#" },
];

function toDateString(d) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MIN_DATE = toDateString(new Date());
const DEFAULT_CHECK_OUT = addDays(new Date(), 1);

export default function HeroSection() {
  const router = useRouter();
  const { setSearchResults } = useSearchResults();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("stays");

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(toDateString(new Date()));
  const [checkOut, setCheckOut] = useState(toDateString(DEFAULT_CHECK_OUT));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestAnchor, setGuestAnchor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalGuests = adults + children;
  const guestLabel = totalGuests === 1 ? "1 Guest" : `${totalGuests} Guests`;

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    try {
      const checkInDate = checkIn ? new Date(checkIn) : new Date();
      const checkOutDate = checkOut ? new Date(checkOut) : addDays(checkInDate, 1);
      const hotels = await searchHotels({
        city: destination.trim() || undefined,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: Number(adults) || 2,
        children: Number(children) || 0,
      });
      setSearchResults(hotels, {
        city: destination.trim(),
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        adults: Number(adults) || 2,
        children: Number(children) || 0,
      });
      const params = new URLSearchParams();
      if (destination.trim()) params.set("city", destination.trim());
      params.set("checkIn", checkIn || toDateString(checkInDate));
      params.set("checkOut", checkOut || toDateString(checkOutDate));
      params.set("adults", String(adults));
      params.set("children", String(children));
      router.push(`/hotels?${params.toString()}`);
    } catch (err) {
      setError(err?.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInChange = (e) => {
    const value = e.target.value;
    setCheckIn(value);
    if (value && checkOut) {
      const checkOutDate = new Date(checkOut);
      const checkInDate = new Date(value);
      if (checkOutDate <= checkInDate) {
        setCheckOut(toDateString(addDays(checkInDate, 1)));
      }
    }
  };

  const minCheckOut = checkIn ? toDateString(addDays(new Date(checkIn), 1)) : MIN_DATE;

  return (
    <section className="relative min-h-[560px] md:min-h-[600px] bg-gradient-to-br from-[#033644] via-[#033644] to-[#033644] overflow-hidden">
      <div className="relative container mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-12 md:pb-16">
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-white/90 hover:text-white md:hidden"
            aria-label="Menu"
          >
            <Bars3Icon className="w-7 h-7" />
          </button>
          <div className="flex-1 flex justify-center md:justify-start md:pl-0">
            <Link href="/" className="inline-block">
              <Image src={LOGO_WHITE} alt="Almosafer" width={140} height={36} className="h-8 md:h-5 w-auto" unoptimized />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-white/90 hover:text-white text-sm font-medium hidden sm:inline">Sign in</button>
          </div>
        </header>

        <SideMenu open={isOpen} onClose={() => setIsOpen(false)} />

        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Let&apos;s book your next trip!</h1>
          <p className="text-white/85 text-sm md:text-base">Choose from over 1.5 million hotels & 450+ airlines</p>
        </div>

        <div className="flex justify-center gap-0 mb-4">
          <div className="inline-flex rounded-t-xl overflow-hidden bg-white/10 backdrop-blur-sm">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const className = `px-5 md:px-8 py-2.5 md:py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-white text-[#004e66]" : "text-white/90 hover:text-white hover:bg-white/5"
              }`;
              return (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={className}>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-black/15 p-4 md:p-6 space-y-4">
            {error && (
              <Box className="rounded-xl bg-red-50 border border-red-200 px-4 py-2">
                <Typography variant="body2" color="error">{error}</Typography>
              </Box>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3">
              <TextField
                fullWidth
                size="small"
                label="Destination"
                placeholder="City or hotel name"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                inputProps={{ "aria-label": "Destination" }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafafa" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#004C5A" },
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Check-in"
                type="date"
                value={checkIn}
                onChange={handleCheckInChange}
                inputProps={{ min: MIN_DATE, "aria-label": "Check-in" }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafafa" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#004C5A" },
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                inputProps={{ min: minCheckOut, "aria-label": "Check-out" }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafafa" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#004C5A" },
                }}
              />
              <Box>
                <Button
                  fullWidth
                  variant="outlined"
                  size="medium"
                  onClick={(e) => setGuestAnchor(e.currentTarget)}
                  aria-haspopup="true"
                  aria-label="Guests"
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "#fafafa",
                    borderColor: "divider",
                    color: "text.primary",
                    justifyContent: "space-between",
                    textTransform: "none",
                    py: 1.5,
                  }}
                >
                  <span className="text-start">{guestLabel}</span>
                  <span className="opacity-60">▼</span>
                </Button>
                <Popover
                  open={Boolean(guestAnchor)}
                  anchorEl={guestAnchor}
                  onClose={() => setGuestAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  PaperProps={{ sx: { borderRadius: "12px", mt: 1.5, minWidth: 220 } }}
                >
                  <Box className="p-4 space-y-4">
                    <Typography variant="subtitle2" fontWeight={600}>Adults</Typography>
                    <Box className="flex items-center gap-2">
                      <IconButton
                        size="small"
                        onClick={() => setAdults((a) => Math.max(0, a - 1))}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                        aria-label="Fewer adults"
                      >
                        −
                      </IconButton>
                      <Typography variant="body1" fontWeight={500}>{adults}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => setAdults((a) => Math.min(9, a + 1))}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                        aria-label="More adults"
                      >
                        +
                      </IconButton>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600}>Children</Typography>
                    <Box className="flex items-center gap-2">
                      <IconButton
                        size="small"
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                        aria-label="Fewer children"
                      >
                        −
                      </IconButton>
                      <Typography variant="body1" fontWeight={500}>{children}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => setChildren((c) => Math.min(9, c + 1))}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                        aria-label="More children"
                      >
                        +
                      </IconButton>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => setGuestAnchor(null)}
                      sx={{ bgcolor: "#004C5A", "&:hover": { bgcolor: "#033644" } }}
                    >
                      Done
                    </Button>
                  </Box>
                </Popover>
              </Box>
            </div>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              className="rounded-xl font-semibold py-3.5 md:py-4 text-base"
              sx={{
                bgcolor: "#ee4056",
                "&:hover": { bgcolor: "#d9364c" },
                textTransform: "none",
              }}
            >
              {loading ? (
                <Box className="flex items-center gap-2">
                  <CircularProgress size={22} sx={{ color: "white" }} />
                  <span>Searching…</span>
                </Box>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
