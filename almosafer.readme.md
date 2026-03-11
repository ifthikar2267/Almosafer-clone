# Almosafer Clone – Hotel Search & Booking UI

## Overview

This project is a front‑end clone of the Almosafer hotel experience, built with Next.js (App Router), Tailwind CSS, and MUI.  
It provides a modern hotel discovery interface with:

- Destination search (cities/areas)
- Date & guest selection
- Rich hotel listings with filters and sorting
- Detailed hotel pages with rooms, amenities, FAQs, and similar properties
- Optional AI Assistant integration for hotel‑specific Q&A

The app consumes a hotel management backend (`/api/hotels`) and focuses on high‑quality UX/UI for both search and detail experiences.

---

## Features

- **Hotel Listing Page**
  - Destination search (city/area)
  - Check‑in / check‑out date pickers
  - Guests & rooms selector
  - Sorting (popular, price, rating)
  - Filtering:
    - Price range
    - Star rating
    - Area
    - Property type
    - Chains / amenities
- **City Results Page**
  - Deep‑linked results using query parameters (city, dates, guests, filters)
  - Infinite scroll / “Load more” pattern for hotels
- **Hotel Detail Page**
  - Hero image gallery
  - Sticky navbar for sections (photos, rooms, amenities, overview, FAQ, similar)
  - Header summary (name, rating, property type, address)
  - Rooms & packages section
  - Amenities, overview, FAQ, and similar properties
  - Optional AI Assistant widget

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: React (JavaScript)
- **Styling**:
  - Tailwind CSS for layout and utilities
  - MUI for form controls, typography, cards, and skeletons
- **HTTP / Data**
  - `fetch` to call hotel backend:
    - `https://dashboard-hotelmanagement.vercel.app/api/hotels`
- **State & Hooks**
  - Custom hooks for fetching hotels and debounced search
  - Local component state for filters, sorting, and chat

---

## Environment Variables

Create a `.env.local` file for local development:

```bash
NEXT_PUBLIC_API_BASE_URL=https://dashboard-hotelmanagement.vercel.app
```

If you use external APIs for AI features, you may also have:

```bash
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
```

> Only `NEXT_PUBLIC_...` variables are exposed to the browser. All others are server‑side only.

---

## Installation

```bash
git clone <your-repo-url> almosafer-clone
cd almosafer-clone
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Development Workflow

1. **Hotel Listing**
   - The listing page fetches hotels from the backend and derives available filters (areas, types, ratings, chains, amenities).
   - Filters are applied in memory and/or via backend query parameters.

2. **City Page**
   - Reads query parameters (`city`, `checkIn`, `checkOut`, `adults`, `children`, filter params).
   - Uses these to call the hotels API and apply client‑side filters.

3. **Hotel Detail Page**
   - Fetches a single hotel by id from the hotel backend.
   - Renders sections (hero, header, rooms, amenities, overview, FAQs, similar properties).
   - Optionally mounts the AI Assistant widget for per‑hotel chat.

4. **Styling**
   - Use Tailwind utility classes for layout, spacing, colors.
   - Use MUI components for inputs, typography, skeletons, and layout elements where helpful.

---

## API Integration (Hotels)

The project expects a hotel API with the following behavior:

- Endpoint:  
  `GET https://dashboard-hotelmanagement.vercel.app/api/hotels`

- Response:
  - `data`: list of hotel objects
  - Each hotel includes fields like:
    - `id`, `name_en`, `address_en`, `thumbnail_url`
    - `star_rating`, `rank`
    - `areas`, `hotel_amenities`, `rooms`, `hotel_faqs`, `review_aggregates`

The UI normalizes the raw response into a consistent “hotel” shape for listings and details.

---

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Linting (if configured)
```

---

## Future Enhancements

- Add user authentication and booking flows.
- Add persisted favorites / wishlists.
- Add better error and empty states for search and detail pages.
- Deepen integration with AI Assistant:
  - Smart suggestions based on user behavior.
  - Conversation memory tied to user/session.

