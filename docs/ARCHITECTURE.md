# Architecture

History Map is a **static site**: no server, no database. Everything it needs is either bundled
into the JavaScript (historical content) or served as static files (border data, fonts). It can be
hosted for free on GitHub Pages or any static host.

## Overview

```
                   build time                                   run time (browser)
 ┌──────────────────────────────────────────┐        ┌───────────────────────────────────────┐
 │ CShapes 2.0 ──► scripts/build-borders.mjs │──────► │ public/data/borders.topo.json         │
 │                 (mapshaper, topojson)     │        │ public/data/labels.geojson            │
 │                                           │        │        │ fetch                        │
 │ content/*.yaml ──► Vite (import.meta.glob)│──────► │ JS bundle ──► React UI + MapLibre map │
 │                    + zod validation       │        │                                       │
 └──────────────────────────────────────────┘        └───────────────────────────────────────┘
```

## Stack

| Piece        | Choice                      | Why                                                                          |
| ------------ | --------------------------- | ---------------------------------------------------------------------------- |
| UI           | React 19 + TypeScript       | Widely known, so easy to contribute to.                                      |
| Build        | Vite                        | Fast dev server, static output.                                              |
| Map          | MapLibre GL JS              | Open source (BSD), WebGL, filters features by date without re-uploading.     |
| Data prep    | mapshaper + topojson-client | Clipping and topology-aware simplification; TopoJSON shares borders → small. |
| Content      | YAML + zod                  | Easy to write by hand, reviewed in pull requests, validated in CI.           |
| Tests / lint | Vitest, oxlint, Prettier    |                                                                              |

There is **no base map** (no OpenStreetMap tiles): modern roads and names would be anachronistic.
The sea is the background colour, the land is the historical borders, and label fonts are
self-hosted in `public/fonts/` so the site makes no third-party requests.

## Time model

Every border feature has two integer properties, `s` (start) and `e` (end), as `YYYYMMDD`.
States still existing have `e = 99991231`. Showing the map on a date is a MapLibre filter:

```ts
;['all', ['<=', ['get', 's'], 19140628], ['>=', ['get', 'e'], 19140628]]
```

The UI keeps the date as an ISO string (`1914-06-28`) and a precision (`day`, `month`, `year`)
that only affects how it is displayed. The timeline slider moves in months; events and the
"previous/next" buttons set exact days.

## Directory layout

```
content/
  countries.yaml        names of each state by date and language
  flags.yaml            flags of each state by date (Wikimedia Commons files)
  events/*.yaml         one file per event       (id = file name)
  conflicts/*.yaml      one file per conflict    (id = file name)
public/
  data/                 generated border data (do not edit by hand)
  flags/                flag PNGs + credits.json (downloaded, do not edit by hand)
  fonts/                glyphs for map labels
scripts/
  build-borders.mjs     CShapes → public/data
  fetch-flags.mjs       Wikimedia Commons → public/flags
src/
  App.tsx               state: date, language, selection, playback, URL sync
  map/                  MapLibre map (MapView) and its style
  components/           Timeline, Sidebar, icons
  content/              YAML loading, schema (zod) and helpers
  i18n/                 UI strings and language helpers
  lib/date.ts           date utilities
```

## Key decisions

- **States are identified by Gleditsch & Ward codes** (`gwcode`), the ids used by CShapes and by
  much of the political-science literature (e.g. UCDP conflict data). Events and conflicts
  reference states by these codes.
- **Content is bundled, data is fetched.** Content is small and needs validation at build time;
  border data is bigger and cached separately by the browser.
- **Colours are computed at build time.** The build script colours a graph of neighbouring
  states (across all dates) so that neighbours never share a colour, and a state keeps its colour
  through time. Colonies take the colour of the state that rules them, with lower opacity.
- **Corrections to source data are code**, listed in `CORRECTIONS` in the build script and
  documented in [DATA.md](DATA.md), never hand-edits of the generated files.

## Adding a new map layer

1. Generate the data (a script in `scripts/`) as GeoJSON/TopoJSON with `s`/`e` dates.
2. Add a source and layers in `src/map/style.ts`.
3. Apply the date filter in `src/map/MapView.tsx`, like the borders.
4. Document the source and licence in `docs/DATA.md`.
