/**
 * Supabase stub. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable.
 */
export function hasSupabase() {
  return !!(
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_SUPABASE_URL &&
    process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabase() {
  return null;
}
