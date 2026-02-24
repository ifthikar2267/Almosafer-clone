const VIEWED_HOTELS_KEY = "viewedHotels";
const MAX_VIEWED = 50;

export function getViewedHotelIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VIEWED_HOTELS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addViewedHotelId(id) {
  if (typeof window === "undefined" || !id) return;
  try {
    const ids = getViewedHotelIds();
    const next = [String(id), ...ids.filter((x) => x !== String(id))].slice(0, MAX_VIEWED);
    localStorage.setItem(VIEWED_HOTELS_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn("viewedHotels save failed:", e);
  }
}

export function isHotelViewed(id) {
  return getViewedHotelIds().includes(String(id));
}
