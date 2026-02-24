# Almosafer Clone – Architecture

## Stack

- **Next.js** (App Router), **JavaScript** (no TypeScript), **Tailwind CSS**, **Material UI**
- **APIs:** External hotel API proxied via Next.js routes

## Data flow

1. **Config** (`src/config/api.js`)  
   - `HOTELS_API.getBaseUrl()` – in browser uses same-origin `/api`; on server uses `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://dashboard-hotelmanagement.vercel.app`).  
   - All hotel requests go through the app’s `/api/hotels` and `/api/hotels/[id]` so the frontend never talks to the external host directly from the client.

2. **Normalizers** (`src/lib/hotels/`)  
   - `normalizeHotel(raw)` – maps external API shape (e.g. `name_en`, `thumbnail_url`, `rooms[].room_packages[].base_price`, `star_rating`, `areas`, `property_types`, etc.) to a stable UI shape: `_id`, `title`, `startingPrice`, `star`, `propertyType`, `reviewScore`, `totalReviews`, `amenities`, `area`, `areaId`, `typeId`, `chain`, `images`, etc.  
   - `normalizeHotelList(response)` – normalizes the list from `GET /api/hotels` (handles `response.data` or raw array).

3. **Service** (`src/services/hotel.service.js`)  
   - `searchHotels(params)` – GET `/api/hotels` with optional `city`, `checkIn`, `checkOut`, `adults`, `children`; returns normalized list.  
   - `getHotelById(id)` – GET `/api/hotels/[id]`; returns normalized hotel.  
   - `getFilterOptionsFromHotels(hotels)` – derives areas, property types, star ratings from a normalized list for client-side filter options.  
   - `fetchHotelFilters()` – optional; calls `/api/hotels/filters` if you use a dedicated filters API.

4. **Hooks** (`src/hooks/useHotelSearch.js`)  
   - Holds search params (city, dates, guests, and optional area, stars, type, minPrice, maxPrice), calls `searchHotels`, exposes `hotels`, `loading`, `error`, `search(override)`, and `filterOptions` from `getFilterOptionsFromHotels(hotels)`.  
   - Can be used when you want one place to own params + loading + filter options; the city page can alternatively use `searchHotels` directly and sync with URL (current approach).

5. **Pages**  
   - **Home** (`/`) – Hero + search (destination, dates, guests) → links to `/stay`.  
   - **Stay** (`/stay`) – Search panel; onSubmit builds query and navigates to `/city?city=…&checkIn=…&checkOut=…&adults=…&children=…`.  
   - **City** (`/city`) – Reads URL params (city, area, stars, type, minPrice, maxPrice, adults, children, checkIn, checkOut). Calls `searchHotels` with city, dates, guests only. Applies **client-side filtering** by area, star rating, type, and price (using normalized `areaId`, `typeId`, `star`, `startingPrice`). Renders `FilterSidebar` + `HotelList` with pagination.  
   - **Hotel detail** (`/hotel/[id]`) – Uses `getHotelById(id)` and the same normalized shape for a single hotel.

## API usage

- **GET /api/hotels** – Proxied to external `GET .../api/hotels`; query params (city, checkin, checkout, adults, children) forwarded. Response is normalized via `normalizeHotelList`.  
- **GET /api/hotels/[id]** – Proxied to external `GET .../api/hotels/[id]`; response normalized via `normalizeHotel`.  
- **GET /api/hotels/filters** – Optional; used if you have a dedicated filters endpoint (e.g. Supabase stub). Filter options can also be derived from the search result list via `getFilterOptionsFromHotels(hotels)`.

## Dynamic filtering

- Filters (area, star rating, property type, price range) are driven by **URL** on the city page (`area`, `stars`, `type`, `minPrice`, `maxPrice`).  
- Listing is fetched once with **city + dates + guests**; then the normalized list is filtered **client-side** by `areaId`, `typeId`, `star`, and price so that changing filters does not trigger a new network request.  
- `FilterSidebar` gets `filterOptions` either from the filters API or from the current result set; the city page uses the result set to compute `maxPrice` for the price slider.

## Folder structure (relevant)

- `src/config/` – API base URL and env.  
- `src/lib/hotels/` – Normalizers (single source of truth for API → UI shape).  
- `src/services/` – Hotel API client (search, getById, filter options).  
- `src/hooks/` – `useHotelSearch` (optional central search + filter state).  
- `src/app/` – App Router pages and API routes.  
- `src/components/` – Home (hero, search, deals), hotel-listing (header, filters, list, card).  
- `src/context/` – e.g. `DestinationContext` for shared destination state.
