/**
 * Normalizes a single hotel from the external API into a stable UI shape.
 * API shape: id, name_en, thumbnail_url, rooms[].room_packages[].base_price,
 * star_rating, address_en, property_types, review_aggregates, hotel_amenities, areas, chains.
 */

function extractImageUrl(img) {
  if (!img) return "";
  if (typeof img === "string") return img;
  const u = img?.url ?? img?.url?.url ?? img?.url?.url?.url ?? img?.url?.url?.url?.url;
  return typeof u === "string" ? u : extractImageUrl(u);
}

function getImages(raw) {
  const out = [];
  if (raw.thumbnail_url) out.push(raw.thumbnail_url);
  const list = raw.images;
  if (Array.isArray(list)) {
    list.forEach((item) => {
      const url = extractImageUrl(item);
      if (url && !out.includes(url)) out.push(url);
    });
  }
  if (out.length === 0 && raw.image_url) {
    try {
      const parsed = typeof raw.image_url === "string" ? JSON.parse(raw.image_url) : raw.image_url;
      const u = extractImageUrl(parsed);
      if (u) out.push(u);
    } catch {
      // ignore
    }
  }
  return out.length ? out : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"];
}

function getSingleRoomPrice(raw) {
  const rooms = raw.rooms;
  if (!Array.isArray(rooms) || rooms.length === 0) return Number(raw.price) || 0;
  let min = Infinity;
  rooms.forEach((room) => {
    const packages = room.room_packages;
    if (Array.isArray(packages)) {
      packages.forEach((p) => {
        const price = p.base_price ?? p.price;
        if (typeof price === "number" && price < min) min = price;
      });
    }
  });
  return Number.isFinite(min) ? min : Number(raw.price) || 0;
}

function getReviewInfo(raw) {
  const agg = raw.review_aggregates;
  if (agg && typeof agg === "object") {
    return {
      averageRating: Number(agg.average_rating) || 0,
      totalReviews: Number(agg.total_reviews) || 0,
    };
  }
  return { averageRating: 0, totalReviews: 0 };
}

function getAmenities(raw) {
  const list = raw.hotel_amenities;
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => item?.amenities?.name_en || item?.name_en)
    .filter(Boolean);
}

/**
 * @param {object} raw - Hotel object from GET /api/hotels or GET /api/hotels/[id]
 * @returns {object} Normalized hotel for UI (listing and detail)
 */
export function normalizeHotel(raw) {
  if (!raw) return null;
  const price = getSingleRoomPrice(raw);
  const { averageRating, totalReviews } = getReviewInfo(raw);
  const areaName = raw.areas?.name_en || raw.area?.name_en || raw.city || "";
  const chainName = raw.chains?.name_en || raw.chain?.name_en || "";
  const propertyType = raw.property_types?.name_en || raw.property_type || "Hotel";

  return {
    id: raw.id,
    _id: String(raw.id ?? raw._id),
    name: raw.name_en ?? raw.name ?? "",
    title: raw.name_en ?? raw.name ?? "",
    address: raw.address_en ?? raw.address ?? areaName,
    location: raw.address_en ?? raw.address ?? areaName,
    city: raw.city ?? areaName,
    country: raw.country ?? "",
    thumbnail: raw.thumbnail_url || getImages(raw)[0],
    images: getImages(raw),
    price,
    startingPrice: price,
    starRating: raw.star_rating ?? raw.star ?? 0,
    star: raw.star_rating ?? raw.star ?? 0,
    hotelType: propertyType,
    propertyType,
    reviewScore: averageRating,
    totalReviews,
    rank: raw.rank != null && !Number.isNaN(Number(raw.rank)) ? Number(raw.rank) : null,
    amenities: getAmenities(raw),
    area: areaName,
    areaId: raw.area_id,
    chain: chainName,
    chainId: raw.chain_id,
    typeId: raw.type_id,
    description: raw.description_en ?? raw.description ?? "",
    freeCancellation: Boolean(raw.free_cancellation),
    rooms: raw.rooms,
    raw,
  };
}

/**
 * Normalize list from API response (data array or full response).
 */
export function normalizeHotelList(response) {
  const list = response?.data ?? response;
  const arr = Array.isArray(list) ? list : [];
  return arr.map(normalizeHotel).filter(Boolean);
}
