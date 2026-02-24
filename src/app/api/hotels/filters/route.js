import { getSupabase, hasSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * GET /api/hotels/filters
 * Returns dynamic filter options with counts from Supabase.
 * Tables: property_types, areas, hotels (with property_type_id, area_id, star_rating).
 * Fallback: empty arrays when Supabase is not configured.
 */
export async function GET() {
  if (!hasSupabase()) {
    return NextResponse.json({
      types: [],
      areas: [],
      starRatings: [],
      propertyTypes: [],
    });
  }

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        types: [],
        areas: [],
        starRatings: [],
        propertyTypes: [],
      });
    }

    const [typesRes, areasRes, hotelsRes] = await Promise.all([
      supabase.from("property_types").select("id, name").order("name"),
      supabase.from("areas").select("id, name").order("name"),
      supabase.from("hotels").select("id, property_type_id, area_id, star_rating"),
    ]);

    const types = typesRes.data || [];
    const areas = areasRes.data || [];
    const hotels = hotelsRes.data || [];

    const countBy = (key) => {
      const map = {};
      hotels.forEach((h) => {
        const v = h[key];
        if (v != null && v !== "") {
          const k = String(v);
          map[k] = (map[k] || 0) + 1;
        }
      });
      return map;
    };

    const typeCounts = countBy("property_type_id");
    const areaCounts = countBy("area_id");
    const starCounts = countBy("star_rating");

    const typesWithCount = types.map((t) => ({
      id: t.id,
      name: t.name || "Unknown",
      count: typeCounts[String(t.id)] || 0,
    }));

    const areasWithCount = areas.map((a) => ({
      id: a.id,
      name: a.name || "Unknown",
      count: areaCounts[String(a.id)] || 0,
    }));

    const starRatings = Object.entries(starCounts)
      .map(([value, count]) => ({ value: Number(value), count }))
      .filter((s) => !Number.isNaN(s.value) && s.value > 0)
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      types: typesWithCount,
      areas: areasWithCount,
      starRatings,
      propertyTypes: typesWithCount,
    });
  } catch (err) {
    console.error("Filters API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch filters", types: [], areas: [], starRatings: [], propertyTypes: [] },
      { status: 500 }
    );
  }
}
