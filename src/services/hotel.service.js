import { HOTELS_API } from "@/config/api";
import { normalizeHotel, normalizeHotelList } from "@/lib/hotels";

const getBase = () => HOTELS_API.getBaseUrl();

function buildSearchParams({
  city,
  checkIn,
  checkOut,
  adults,
  children,
  area,
  stars,
  type,
  minPrice,
  maxPrice,
}) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (checkIn) params.set("checkin", typeof checkIn === "string" ? checkIn : checkIn.toISOString?.() ?? "");
  if (checkOut) params.set("checkout", typeof checkOut === "string" ? checkOut : checkOut.toISOString?.() ?? "");
  if (adults != null && adults !== "") params.set("adults", String(adults));
  if (children != null && children !== "") params.set("children", String(children));
  if (area != null && area !== "" && (Array.isArray(area) ? area.length > 0 : true))
    params.set("area", Array.isArray(area) ? area.join(",") : String(area));
  if (stars != null && stars !== "" && (Array.isArray(stars) ? stars.length > 0 : true))
    params.set("stars", Array.isArray(stars) ? stars.join(",") : String(stars));
  if (type != null && type !== "" && (Array.isArray(type) ? type.length > 0 : true))
    params.set("type", Array.isArray(type) ? type.join(",") : String(type));
  if (minPrice != null && minPrice !== "" && Number(minPrice) > 0) params.set("minPrice", String(minPrice));
  if (maxPrice != null && maxPrice !== "" && Number(maxPrice) > 0) params.set("maxPrice", String(maxPrice));
  return params.toString();
}

export async function searchHotels({
  city = "",
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  area,
  stars,
  type,
  minPrice,
  maxPrice,
} = {}) {
  const qs = buildSearchParams({
    city,
    checkIn,
    checkOut,
    adults,
    children,
    area,
    stars,
    type,
    minPrice,
    maxPrice,
  });
  const url = `${getBase()}/api/hotels${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.warn("searchHotels: upstream error", res.status, errBody);
      return [];
    }
    const json = await res.json();
    let normalized = normalizeHotelList(json);
    if (city && normalized.length > 0) {
      const q = city.toLowerCase().trim();
      normalized = normalized.filter(
        (h) =>
          (h.city && h.city.toLowerCase().includes(q)) ||
          (h.location && h.location.toLowerCase().includes(q)) ||
          (h.title && h.title.toLowerCase().includes(q)) ||
          (h.area && h.area.toLowerCase().includes(q))
      );
    }
    return normalized;
  } catch (err) {
    console.warn("searchHotels failed:", err?.message || err);
    return [];
  }
}

export async function getHotels() {
  try {
    const res = await fetch(`${getBase()}/api/hotels`);
    if (!res.ok) {
      console.warn("getHotels: upstream error", res.status);
      return [];
    }
    const json = await res.json();
    return normalizeHotelList(json);
  } catch (err) {
    console.warn("getHotels failed:", err?.message || err);
    return [];
  }
}

export async function getHotelById(id) {
  if (!id) return null;
  try {
    const res = await fetch(`${getBase()}/api/hotels/${id}`);
    if (res.ok) {
      const json = await res.json();
      const raw = json?.data ?? json;
      return normalizeHotel(raw);
    }
  } catch {
    // fallback below
  }
  const all = await getHotels();
  return all.find((h) => String(h._id) === String(id) || String(h.id) === String(id)) || null;
}

export async function fetchHotelFilters() {
  try {
    const res = await fetch(`${getBase()}/api/hotels/filters`);
    if (!res.ok) return { types: [], areas: [], starRatings: [], propertyTypes: [] };
    return await res.json();
  } catch (err) {
    console.warn("fetchHotelFilters failed:", err?.message || err);
    return { types: [], areas: [], starRatings: [], propertyTypes: [] };
  }
}

/**
 * Fetches unique areas from the hotels API (dashboard-hotelmanagement.vercel.app).
 * Each hotel has areas: { id, name_en, name_ar }. Returns [{ id, name }] for autocomplete.
 */
export async function fetchAreasFromHotels() {
  try {
    const res = await fetch(`${getBase()}/api/hotels`);
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data ?? json;
    const arr = Array.isArray(list) ? list : [];
    const seen = new Map();
    arr.forEach((h) => {
      const a = h.areas;
      if (a && (a.id != null || a.name_en)) {
        const id = a.id ?? a.name_en;
        const name = (a.name_en || a.name_ar || "").trim();
        if (name && !seen.has(id)) seen.set(id, { id, name, type: "area" });
      }
    });
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.warn("fetchAreasFromHotels failed:", err?.message || err);
    return [];
  }
}

export function getFilterOptionsFromHotels(hotels) {
  const areaMap = new Map();
  const typeMap = new Map();
  const starCounts = new Map();
  const chainMap = new Map();
  const amenityCounts = new Map();

  hotels.forEach((h) => {
    const aid = h.areaId != null && !Number.isNaN(Number(h.areaId)) ? Number(h.areaId) : null;
    const aname = h.area || "";
    if (aid != null) {
      const cur = areaMap.get(aid) || { id: aid, name: aname || String(aid), count: 0 };
      cur.count += 1;
      areaMap.set(aid, cur);
    }
    const tid = h.typeId != null && !Number.isNaN(Number(h.typeId)) ? Number(h.typeId) : null;
    const tname = h.propertyType || "";
    if (tid != null) {
      const cur = typeMap.get(tid) || { id: tid, name: tname || String(tid), count: 0 };
      cur.count += 1;
      typeMap.set(tid, cur);
    }
    if (h.star != null && h.star > 0) {
      starCounts.set(h.star, (starCounts.get(h.star) || 0) + 1);
    }
    const cid = h.chainId != null && !Number.isNaN(Number(h.chainId)) ? Number(h.chainId) : null;
    const cname = h.chain || "";
    if (cid != null || cname) {
      const key = cid ?? cname;
      const cur = chainMap.get(key) || { id: cid ?? key, name: cname || String(key), count: 0 };
      cur.count += 1;
      chainMap.set(key, cur);
    }
    const list = h.amenities;
    if (Array.isArray(list)) {
      list.forEach((a) => {
        const name = typeof a === "string" ? a : (a?.name ?? String(a));
        if (!name) return;
        const cur = amenityCounts.get(name) || { id: name, name, count: 0 };
        cur.count += 1;
        amenityCounts.set(name, cur);
      });
    }
  });

  return {
    areas: Array.from(areaMap.values()).sort((a, b) => (b.count || 0) - (a.count || 0)),
    propertyTypes: Array.from(typeMap.values()).sort((a, b) => (b.count || 0) - (a.count || 0)),
    types: Array.from(typeMap.values()),
    starRatings: Array.from(starCounts.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([value, count]) => ({ value, count })),
    chains: Array.from(chainMap.values()).sort((a, b) => (b.count || 0) - (a.count || 0)),
    amenities: Array.from(amenityCounts.values()).sort((a, b) => (b.count || 0) - (a.count || 0)),
  };
}

/**
 * Single-pass filter: hotel must pass price check, then every active filter (AND).
 * @param {object} hotel - Normalized hotel
 * @param {object} opts - Normalized filter options (numbers, arrays)
 */
function passesFilters(hotel, opts) {
  const price = hotel.startingPrice ?? hotel.price ?? 0;
  if (price < opts.minPrice || price > opts.maxPrice) return false;

  if (opts.hasStars && !opts.selectedStarsSet.has(Number(hotel.star))) return false;
  if (opts.hasArea && !opts.selectedAreaSet.has(hotel.areaId) && !opts.selectedAreaSet.has(hotel.area)) return false;
  if (opts.hasType && !opts.selectedTypeSet.has(hotel.typeId) && !opts.selectedTypeSet.has(hotel.propertyType)) return false;
  if (opts.hasChain && !opts.selectedChainSet.has(hotel.chainId) && !opts.selectedChainSet.has(hotel.chain)) return false;

  if (opts.hasAmenities) {
    const hotelAmenities = hotel.amenities || [];
    for (let i = 0; i < opts.selectedAmenities.length; i++) {
      const name = opts.selectedAmenities[i];
      const hasIt = hotelAmenities.some((a) => (typeof a === "string" ? a : a?.name) === name);
      if (!hasIt) return false;
    }
  }
  return true;
}

/**
 * @param {object[]} hotels - Normalized hotel list
 * @param {object} filters - Filter state
 * @param {[number, number]} [filters.priceRange] - [min, max] AED
 * @param {string[]} [filters.selectedAmenities] - Amenity names (hotel must have all)
 * @param {number[]} [filters.selectedStars] - Star ratings (hotel must match one)
 * @param {any[]} [filters.selectedArea] - Area id or name (hotel must match one)
 * @param {any[]} [filters.selectedType] - Type id or name (hotel must match one)
 * @param {any[]} [filters.selectedChain] - Chain id or name (hotel must match one)
 * @returns {object[]} Filtered array (same reference as hotels when no filters active)
 */
export function filterHotels(hotels, filters = {}) {
  const {
    priceRange = [0, Infinity],
    selectedAmenities = [],
    selectedStars = [],
    selectedArea = [],
    selectedType = [],
    selectedChain = [],
  } = filters;

  const minPrice = Number(priceRange[0]) ?? 0;
  const maxPrice =
    priceRange[1] == null || Number(priceRange[1]) === 0 || priceRange[1] === Infinity
      ? Infinity
      : Number(priceRange[1]);

  const hasStars = selectedStars.length > 0;
  const hasArea = selectedArea.length > 0;
  const hasType = selectedType.length > 0;
  const hasChain = selectedChain.length > 0;
  const hasAmenities = selectedAmenities.length > 0;
  const hasPriceFilter = minPrice > 0 || maxPrice < Infinity;

  const noFilters =
    !hasPriceFilter && !hasStars && !hasArea && !hasType && !hasChain && !hasAmenities;
  if (noFilters) return hotels;

  const opts = {
    minPrice,
    maxPrice,
    hasStars,
    hasArea,
    hasType,
    hasChain,
    hasAmenities,
    selectedAmenities,
    selectedStarsSet: new Set(selectedStars),
    selectedAreaSet: new Set(selectedArea),
    selectedTypeSet: new Set(selectedType),
    selectedChainSet: new Set(selectedChain),
  };

  return hotels.filter((h) => passesFilters(h, opts));
}

/**
 * Legacy adapter: same as filterHotels but with old param names.
 * @deprecated Prefer filterHotels({ priceRange, selectedStars, selectedArea, selectedType, selectedChain, selectedAmenities })
 */
export function applyHotelFilters(hotels, filters = {}) {
  return filterHotels(hotels, {
    priceRange: filters.priceRange,
    selectedStars: filters.starRatings,
    selectedArea: filters.areaIds,
    selectedType: filters.typeIds,
    selectedChain: filters.chainIds,
    selectedAmenities: filters.amenityNames,
  });
}

/**
 * Sort hotels in memory. Returns a new array; does not mutate.
 * - popular: rank ASC (lower rank = more popular); missing rank sorts last
 * - price: single room price ASC (Lowest Price)
 * - rating: average_rating DESC (Highest Guest Rating)
 * @param {object[]} hotels - Normalized hotel list
 * @param {string} sortBy - 'popular' | 'price' | 'rating'
 * @returns {object[]} New sorted array
 */
export function sortHotels(hotels, sortBy = "popular") {
  if (!Array.isArray(hotels) || hotels.length === 0) return [];
  const list = [...hotels];
  if (sortBy === "popular") {
    return list.sort((a, b) => {
      const ra = a.rank != null && !Number.isNaN(Number(a.rank)) ? Number(a.rank) : Infinity;
      const rb = b.rank != null && !Number.isNaN(Number(b.rank)) ? Number(b.rank) : Infinity;
      return ra - rb;
    });
  }
  if (sortBy === "price") {
    return list.sort((a, b) => (a.startingPrice ?? a.price ?? 0) - (b.startingPrice ?? b.price ?? 0));
  }
  if (sortBy === "rating") {
    return list.sort((a, b) => (b.reviewScore ?? 0) - (a.reviewScore ?? 0));
  }
  return list;
}
