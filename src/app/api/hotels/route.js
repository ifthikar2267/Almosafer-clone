import { getSupabase, hasSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const EXTERNAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dashboard-hotelmanagement.vercel.app";

function normalizeSupabaseHotel(row) {
  if (!row) return null;
  const images = Array.isArray(row.images) ? row.images : row.image_url ? [row.image_url] : [];
  const price = Number(row.price ?? row.starting_price ?? 0);
  return {
    id: row.id,
    _id: String(row.id),
    name_en: row.name_en ?? row.name ?? "",
    title: row.name_en ?? row.name ?? "",
    city: row.city ?? "Dubai",
    country: row.country ?? "United Arab Emirates",
    address_en: row.address_en ?? row.address ?? row.city,
    location: row.address_en ?? row.address ?? row.city ?? row.city,
    images,
    star_rating: row.star_rating ?? row.star ?? 0,
    star: row.star_rating ?? row.star ?? 0,
    price,
    startingPrice: price,
    average_rating: row.average_rating ?? row.review_score ?? 0,
    reviewScore: row.average_rating ?? row.review_score ?? 0,
    total_reviews: row.total_reviews ?? 0,
    totalReviews: row.total_reviews ?? 0,
    free_cancellation: Boolean(row.free_cancellation),
    freeCancellation: Boolean(row.free_cancellation),
    property_type: row.property_type ?? row.property_type_name,
    propertyType: row.property_type ?? row.property_type_name ?? "Hotel",
    area_id: row.area_id,
    property_type_id: row.property_type_id,
  };
}

/**
 * GET /api/hotels
 * Query params: city, checkin, checkout, adults, children, area, stars, type, minPrice, maxPrice
 * When Supabase is configured: filters with .eq(), .in(), .gte(), .lte()
 * Otherwise: proxy to external API with same params
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url || "", "http://localhost");
  const city = searchParams.get("city") || "";
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";
  const adults = searchParams.get("adults") || "";
  const children = searchParams.get("children") || "";
  const area = searchParams.get("area") || "";
  const stars = searchParams.get("stars") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  if (hasSupabase()) {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase not initialized");

      let query = supabase.from("hotels").select("*");

      if (area) {
        const ids = area.split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length === 1) query = query.eq("area_id", ids[0]);
        else if (ids.length > 1) query = query.in("area_id", ids);
      }
      if (stars) {
        const values = stars.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
        if (values.length === 1) query = query.eq("star_rating", values[0]);
        else if (values.length > 1) query = query.in("star_rating", values);
      }
      if (type) {
        const ids = type.split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length === 1) query = query.eq("property_type_id", ids[0]);
        else if (ids.length > 1) query = query.in("property_type_id", ids);
      }
      const min = minPrice ? Number(minPrice) : NaN;
      const max = maxPrice ? Number(maxPrice) : NaN;
      if (!Number.isNaN(min) && min > 0) query = query.gte("price", min);
      if (!Number.isNaN(max) && max > 0) query = query.lte("price", max);
      if (city && city.trim()) query = query.ilike("city", `%${city.trim()}%`);

      const { data, error } = await query.order("id");

      if (error) {
        console.error("Supabase hotels error:", error);
        return NextResponse.json(
          { error: error.message, data: [] },
          { status: 500 }
        );
      }

      const list = (data || []).map(normalizeSupabaseHotel).filter(Boolean);
      return NextResponse.json({ data: list });
    } catch (err) {
      console.error("Hotels Supabase error:", err);
      return NextResponse.json(
        { error: "Failed to fetch hotels", data: [] },
        { status: 500 }
      );
    }
  }

  const query = new URLSearchParams();
  if (city) query.set("city", city);
  if (checkin) query.set("checkin", checkin);
  if (checkout) query.set("checkout", checkout);
  if (adults) query.set("adults", adults);
  if (children) query.set("children", children);
  const qs = query.toString();
  const url = `${EXTERNAL_BASE}/api/hotels${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Hotels proxy upstream error:", res.status, text?.slice(0, 200));
      return NextResponse.json(
        { error: "Failed to fetch hotels", status: res.status },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Hotels proxy error:", err.message || err);
    return NextResponse.json(
      { error: "Failed to fetch hotels", detail: err.message },
      { status: 502 }
    );
  }
}
