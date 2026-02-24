const EXTERNAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dashboard-hotelmanagement.vercel.app";

export async function GET(_req, { params }) {
  const resolved = typeof params?.then === "function" ? await params : params || {};
  const id = resolved.id;
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const res = await fetch(`${EXTERNAL_BASE}/api/hotels/${id}`);
    if (!res.ok) throw new Error("External API error");
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("Hotel proxy error:", err);
    return Response.json(
      { error: "Failed to fetch hotel" },
      { status: 502 }
    );
  }
}
