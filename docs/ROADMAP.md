# Roadmap

The goal is a map where anyone can **see how Europe changed** and **understand why**. Borders
are the canvas; the value is in the history told on top of them.

Scope for now: **Europe, 1900 – today**. Earlier periods may come later (see phase 5).

## Phase 0 — Foundations ✅

- [x] Static web app: React + TypeScript + Vite + MapLibre GL JS.
- [x] Dated borders 1900 – today from CShapes 2.0, clipped and simplified for Europe.
- [x] Historical names of states by date, in Catalan, Spanish and English.
- [x] Month-by-month timeline with playback and jumps between key dates.
- [x] Content model for events and conflicts (YAML, validated in CI).
- [x] Seed content: 25 events and 13 conflicts.
- [x] Trilingual UI (ca / es / en) and shareable URLs.
- [x] CI (lint, format, types, tests, build) and deployment to GitHub Pages.

## Phase 1 — Flags 🏳️ (in progress)

- [x] Chronology of national flags for ~70 states (`content/flags.yaml`), images from
      Wikimedia Commons downloaded automatically by a GitHub workflow.
- [x] Flags on the map, next to each state's name (can be switched off).
- [x] Flag gallery for any date, with the flags adopted that year.
- [x] Each state's card shows its flag and all the flags it used over time.
- [ ] Complete the simplified periods (see [DATA.md](DATA.md#flags-wikimedia-commons)) and the
      states at the map edges (Egypt, Syria, Iraq…).
- [ ] A short text per flag: what it means and why it changed (e.g. Spain 1931, Germany 1919).
- [ ] Flags of colonies, protectorates and short-lived states.
- [ ] "Flag quiz" mode: guess the state from its flag on a given date.

## Phase 2 — A complete first version

Content

- [ ] ~100 key events and ~30 conflicts covering the whole period, in the three languages.
- [ ] A short profile per state (what it was, how it was born, how it ended).
- [ ] Review of all texts by people with a history background.

Experience

- [ ] Search for states, events and conflicts.
- [ ] Shareable links to a selected event, conflict or state (`?sel=event:…`).
- [ ] **Guided stories**: step-by-step narratives that move the map and the timeline
      (e.g. _The Great War_, _The Iron Curtain_, _The break-up of Yugoslavia_).
- [ ] Keyboard shortcuts and an accessibility review (contrast, screen readers).
- [ ] Translated map attribution and a proper "About / sources" page.

## Phase 3 — The de facto layer (the big data task)

CShapes, like most border datasets, records borders **settled by treaties** and ignores military
occupations. That is a sound basis, but it leaves out much of what makes the 20th century
understandable. This phase adds a separate, clearly labelled overlay of territories under _de
facto_ control:

- [ ] 1938 – 1945: Anschluss, Protectorate of Bohemia and Moravia, partition of Poland and the
      General Government, Vichy France and occupied zones, Independent State of Croatia, Axis
      occupations in the Balkans and the USSR…
- [ ] 1917 – 1923: short-lived states of the Russian Civil War, Fiume, Memel, plebiscite areas.
- [ ] Post-1990 disputed territories: Crimea, Donbas, Transnistria, Abkhazia, South Ossetia,
      Northern Cyprus, Nagorno-Karabakh.
- [ ] Data format: dated GeoJSON features with `kind` (occupation, annexation, puppet state,
      disputed) and `controlledBy`, drawn as a hatched layer that can be toggled.
- [ ] Possible sources: [historical-basemaps](https://github.com/aourednik/historical-basemaps)
      (GPL-3.0), Natural Earth disputed areas (public domain), manual digitisation from
      public-domain maps.

## Phase 4 — More ways to read the map

- [ ] **Alliances and blocs** colour mode: Triple Entente vs Central Powers, Allies vs Axis,
      NATO vs Warsaw Pact, EEC/EU membership over time.
- [ ] Front lines at key moments of the world wars.
- [ ] Capitals and major cities, with renamings (Petrograd → Leningrad → Saint Petersburg).
- [ ] Internal divisions where they matter (Soviet and Yugoslav republics, German states).
- [ ] Quiz / classroom mode for teachers.

## Phase 5 — Beyond

- [ ] Extend back to the 19th century (CShapes starts in 1886; other sources for 1815 – 1886).
- [ ] Vector tiles (PMTiles) if the data grows beyond what a single file can hold.
- [ ] Offline support (PWA).
- [ ] An editing interface so historians can contribute without Git.

Ideas and priorities are discussed in GitHub issues — feel free to open one.
