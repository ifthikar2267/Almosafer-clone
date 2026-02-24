# Almosafer-clone – Refactor Summary

This document describes the structural refactor only. **No business logic, API logic, or functionality was changed.**

---

## New folder structure

```
Almosafer-clone/
├── src/
│   ├── app/                    # Next.js App Router (moved from /app)
│   │   ├── api/
│   │   │   ├── cities/
│   │   │   └── posts/
│   │   ├── city/
│   │   ├── hotel/[id]/
│   │   ├── stay/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.js
│   │   │   ├── SideMenu.jsx
│   │   │   └── index.js
│   │   └── ui/
│   │       ├── SlideUpDialog.js
│   │       └── index.js
│   ├── features/
│   │   ├── booking/
│   │   │   └── components/
│   │   │       └── Guests.js
│   │   └── search/
│   │       └── components/
│   │           ├── DestinationSearch.js
│   │           └── StayPage.js
│   ├── context/                # (moved from /context)
│   │   └── DestinationContext.tsx
│   ├── models/                 # (moved from /models)
│   │   └── postModel.js
│   ├── utils/                  # (moved from /utils)
│   │   └── connectMongo.js
│   ├── services/               # placeholder for future API layer
│   ├── hooks/                  # placeholder for shared hooks
│   ├── constants/              # placeholder for app constants
│   └── styles/                 # placeholder for shared styles
├── scripts/
├── tsconfig.json               # paths: "@/*" -> "./src/*"
├── next.config.ts
└── package.json
```

---

## List of moved files

| From | To |
|------|----|
| `app/*` | `src/app/*` |
| `context/DestinationContext.tsx` | `src/context/DestinationContext.tsx` |
| `utils/connectMongo.js` | `src/utils/connectMongo.js` |
| `models/postModel.js` | `src/models/postModel.js` |
| `component/Footer.js` | `src/components/layout/Footer.js` |
| `component/Guests.js` | `src/features/booking/components/Guests.js` |
| `component/DestinationSearch.js` | `src/features/search/components/DestinationSearch.js` |
| `component/StayPage.js` | `src/features/search/components/StayPage.js` |

**New files (no prior location):**

- `src/components/ui/SlideUpDialog.js` – shared slide-up dialog wrapper
- `src/components/layout/SideMenu.jsx` – shared Options menu (extracted from Home + Stay)
- `src/components/ui/index.js`, `src/components/layout/index.js`

---

## Duplicate / centralized pieces

1. **Slide-up Dialog**  
   Previously: each of `Guests.js`, `DestinationSearch.js`, and `StayPage.js` had its own `Dialog` + overlay + slide-up panel.  
   Now: one **`SlideUpDialog`** in `src/components/ui/SlideUpDialog.js` used by all three (with optional `title` and `variant="full" | "bottom"`).

2. **Options (Side) menu**  
   Previously: same large menu (Dialog + nav) duplicated in `app/page.tsx` and `app/stay/page.tsx`.  
   Now: single **`SideMenu`** in `src/components/layout/SideMenu.jsx`; both pages use `<SideMenu open={...} onClose={...} />`.

3. **Old `component/` folder**  
   Removed after moving its contents into `src/components` and `src/features`.

---

## Updated import examples

**Layout & UI**

```js
import { SideMenu, Footer } from "@/components/layout";
import SlideUpDialog from "@/components/ui/SlideUpDialog";
```

**Features**

```js
import Guests from "@/features/booking/components/Guests";
import DestinationSearch from "@/features/search/components/DestinationSearch";
import StayPage from "@/features/search/components/StayPage";
```

**Context**

```js
import { useDestination, DestinationProvider } from "@/context/DestinationContext";
```

**Utils & models (e.g. in API routes)**

```js
import connectDB from "@/utils/connectMongo";
import PostModel from "@/models/postModel";
```

**App-to-app (e.g. StayPage wrapping Stay)**

```js
import Stay from "@/app/stay/page";
```

---

## Tsconfig

- **Path alias:** `"@/*": ["./src/*"]` so all imports above resolve under `src/`.

---

## What was not changed

- No conversion from JavaScript to TypeScript.
- No changes to API handlers, DB connection, or models logic.
- No changes to component behavior (only structure and imports).
- Existing TypeScript/lint issues (e.g. `city/page.tsx` `searchParams` type, `no-img-element`) were left as-is.

---

## Quick reference – where things live now

| Concern | Location |
|--------|----------|
| Reusable UI (dialogs, buttons, inputs) | `src/components/ui/` |
| Layout (header, footer, side menu) | `src/components/layout/` |
| Search (destination, stay sheet) | `src/features/search/components/` |
| Booking (guests/rooms) | `src/features/booking/components/` |
| App pages & API routes | `src/app/` |
| Global state (destination, dates, rooms) | `src/context/` |
| DB connection | `src/utils/` |
| Data models | `src/models/` |
