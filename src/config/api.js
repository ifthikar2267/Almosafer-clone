/**
 * API configuration for the hotel booking frontend.
 * Uses same-origin /api in browser (Next.js proxy), direct URL on server.
 */
const EXTERNAL_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dashboard-hotelmanagement.vercel.app";

export const HOTELS_API = {
  /** Base URL for client (empty = same origin) and server (external) */
  getBaseUrl: () =>
    typeof window !== "undefined" ? "" : EXTERNAL_BASE,
  /** Full base URL for external reference (e.g. server proxy) */
  externalBase: EXTERNAL_BASE,
};

export default HOTELS_API;
