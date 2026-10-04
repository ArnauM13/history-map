# The data — where it comes from, under which licence and where it falls short

[Català](DADES.md) · [Castellano](DADES.es.md) · **English**

The map combines data from different places, each with its own licence. **If you reuse anything,
check the licence of that part.**

| What | Source | Licence |
| --- | --- | --- |
| The code (`src/`, `scripts/`…) | This project | MIT |
| The texts (`content/`) | Its contributors | CC BY-SA 4.0 |
| The borders (`public/data/`) | CShapes 2.0, clipped and simplified here | CC BY-NC-SA 4.0 |
| The flags (`public/flags/`) | Wikimedia Commons | Each image's own (§2) |
| The map lettering (`public/fonts/`) | Open Sans, from [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0 |
| The interface font | Roboto ([Fontsource](https://fontsource.org/)) | OFL 1.1 |
| The icons | [Material Symbols](https://fonts.google.com/icons) | Apache 2.0 |

---

## 0. Where each piece of data comes from

Everything the map shows has a source, and the card where it appears cites it with a link.

| What you see | Where it comes from | Where it is cited |
| --- | --- | --- |
| Borders and capitals | CShapes 2.0 (§1) | On each state's card |
| Each state's name in each period | The Wikipedia article on the state under that name (`wiki` in `content/countries.yaml`) | On the state's card |
| Flag dates | The Wikipedia articles on each state's flags (`sources` in `content/flags.yaml`) | On the state's card |
| Flag images | Wikimedia Commons (§2, `public/flags/credits.json`) | Under each flag |
| Flag texts, events and conflicts | Written by this project from the sources they cite (§3) | On each one's card |
| Catalan and Spanish Wikipedia titles | Wikipedia's own interlanguage links (`content/wikipedia.json`) | — |
| Translations of state and capital names | This project | — |

**How it is checked.** `npm run data:sources` makes sure every cited article exists on Wikipedia
and every external link responds. The "Fonts" workflow runs it whenever the content changes and
every Monday, and fails if it finds a broken one. The tests, for their part, let no event,
conflict, state name or flag in without a source.

---

## 1. Borders: CShapes 2.0

[CShapes 2.0](https://icr.ethz.ch/data/cshapes/) maps the borders of independent states and of the
territories that depended on them (colonies, protectorates, mandates, occupied territories) from
1886 to 2019, with the exact day of every change.

> Schvitz, G., Girardin, L., Rüegger, S., Weidmann, N. B., Cederman, L.-E., & Gleditsch, K. S.
> (2022). Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. _Journal of
> Conflict Resolution_, 66(1), 144–161.

- **Licence**: CC BY-NC-SA 4.0. The files in `public/data/` are a derivative work under the same
  licence: they can be shared and adapted with attribution, **but not for commercial purposes**.
- **Edition**: the Gleditsch & Ward one shipped with the [`cshapes` R package](https://github.com/cran/cshapes)
  (`cshapes_2_gw.topojson`).
- **What is done to it** (`npm run data:borders`): take all of it, from 1886 onwards; clip to
  `[-28°, 30°, 78°, 82°]`, simplify to 12 % of the vertices, turn dates into integers and work out
  the colours and where each name goes.

States are identified by their **Gleditsch & Ward codes** (`gwcode`), the same ones used by
CShapes and much of political science (UCDP conflict data, for instance). Events, conflicts, names
and flags refer to states by these codes. CShapes names states and capitals in English; the app's
names come from `content/countries.yaml` and `content/capitals.yaml`, in all three languages.

### 1.1 Where we depart from it

| What | Why |
| --- | --- |
| Crimea stays in Ukraine after 18 March 2014 | CShapes moves it to Russia. Here the internationally recognised border is drawn, as UN General Assembly resolution 68/262 and most atlases do. The annexation is explained as an event and will go in the occupations layer. |

Every correction is code, in the `CORRECTIONS` list in `scripts/build-borders.mjs`, and has its
row here. The generated files are never edited by hand.

### 1.2 Where it falls short

- **Treaty borders, not occupation.** CShapes records agreed changes —the Munich Agreement and the
  Vienna Awards (1938 and 1940), the Soviet annexations of 1940— but not territory taken by force.
  Between 1938 and 1945 the map still shows Austria, Bohemia-Moravia and Poland, and none of the
  Axis occupations. It is the biggest gap left to fill (see the [roadmap](FULL-DE-RUTA.md), in
  Catalan); meanwhile, the events and conflicts explain it.
- **No microstates.** Andorra, Liechtenstein, Monaco, San Marino and the Vatican are not in
  CShapes.
- **Sovereignty criteria.** Some choices come from the Gleditsch & Ward list: Montenegro is part
  of Yugoslavia from 1918 to 2006, and West Germany starts in 1945, with the Allied occupation
  zones.
- **It ends in 2019.** We assume no recognised border in Europe has changed since; if one does, it
  will be added by hand.
- **Simplified geometry.** Good enough to see the continent; not to measure distances or areas.

---

## 2. Flags: Wikimedia Commons

The chronology —which flag each state used and until when— belongs to this project and lives in
`content/flags.yaml`. The images come from [Wikimedia Commons](https://commons.wikimedia.org/):
`npm run data:flags` downloads them, or the "Flags" GitHub workflow does whenever the file changes.

- **Light images.** It downloads the 330 px PNG that Wikimedia renders, not the original SVG: some
  are over a megabyte because of detailed coats of arms, and on the map a flag is 14 px tall. The
  hundred flags take up less than a megabyte.
- **Licences.** Almost all are in the public domain: a flag rarely carries copyright, or it has
  expired. Some drawings of coats of arms are CC BY-SA, and the app then credits the author under
  the flag. All of them are recorded in `public/flags/credits.json`.
- **Dates.** Those of official adoption, or of first use if that came earlier.
- **Simplifications**, marked with a comment in the YAML: some short-lived variants are missing
  (Albania 1914–1946, Bulgaria 1946–1948 and 1967–1971, Hungary 1918–1919 and 1956–1957, Finland's
  red lion flag of 1917–1918). Colonies, protectorates and mandates have none yet. Occupied
  Germany (1945–1949) is shown without a flag of its own, because it had none.
- **Flags of regimes such as the Nazi or Soviet ones** are shown in their historical context and
  for educational purposes.

## 3. The texts

The events and conflicts in `content/` are written by contributors, under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Everything stated must be
verifiable: each entry links at least one source (Wikipedia is fine to start with). A source other
than Wikipedia goes in `sources`, with the title, the publisher and the link (the UN resolution on
Crimea, for instance). How the texts are written is in [CONTRIBUTING.en.md](CONTRIBUTING.en.md).
