# The data — where it comes from, under which licence and where it falls short

[Català](DADES.md) · [Castellano](DADES.es.md) · **English**

The map combines data from different places, each with its own licence. **If you reuse anything,
check the licence of that part.**

| What | Source | Licence |
| --- | --- | --- |
| The code (`src/`, `scripts/`…) | This project | MIT |
| The texts (`content/`) | Its contributors | CC BY-SA 4.0 |
| The borders (`public/data/`) | CShapes 2.0, clipped and simplified here | CC BY-NC-SA 4.0 |
| The occupation zones (`public/data/occupations.geojson`) | CShapes 2.0, [Natural Earth](https://www.naturalearthdata.com/) and lines drawn here (§1.3) | CC BY-NC-SA 4.0 |
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
| Occupied and annexed zones (1938–1945) | CShapes borders from other dates, today's divisions from Natural Earth and hand-drawn lines (§1.3); the dates, from each zone's Wikipedia article (`content/occupations/`) | On each zone's card |
| Flag texts, events, conflicts and occupations | Written by this project from the sources they cite (§3) | On each one's card |
| Catalan and Spanish Wikipedia titles | Wikipedia's own interlanguage links (`content/wikipedia.json`) | — |
| Translations of state and capital names | This project | — |

**How it is checked.** `npm run data:sources` makes sure every cited article exists on Wikipedia
and every external link responds. The "Fonts" workflow runs it whenever the content changes and
every Monday, and fails if it finds a broken one. The tests, for their part, let no event,
conflict, occupation, state name or flag in without a source.

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
  the colours and where each name goes. Two neighbours never share a colour; on top of that, the
  twelve colours are spread out, and an occupier never takes the occupied state's, so the zone
  stands out.

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

- **Treaty borders, not occupation.** CShapes records agreed changes —the Munich Agreement, the
  First Vienna Award (1938), the Soviet annexations of 1940— but not territory taken by force, nor
  the Second Vienna Award (1940), which gave northern Transylvania to Hungary. Between 1938 and
  1945, Austria, Bohemia-Moravia and Poland are still on the map. The occupations layer explains
  it (§1.3).
- **Danzig** appears inside Germany from 30 September 1938. It was a free city until 1 September
  1939, when the Reich annexed it.
- **The Italian border of 1920 to 1947.** Istria, Fiume, the Slovene Littoral with Postojna and
  the islands of Cres and Lošinj appear inside Yugoslavia, and the Dodecanese inside Greece, when
  they were Italian. The occupations layer leaves them out of the 1941 partition of Yugoslavia;
  fixing the borders is on the [roadmap](FULL-DE-RUTA.md), §3 (in Catalan).
- **No microstates.** Andorra, Liechtenstein, Monaco, San Marino and the Vatican are not in
  CShapes.
- **Sovereignty criteria.** Some choices come from the Gleditsch & Ward list: Montenegro is part
  of Yugoslavia from 1918 to 2006, and West Germany starts in 1945, with the Allied occupation
  zones.
- **It ends in 2019.** We assume no recognised border in Europe has changed since; if one does, it
  will be added by hand.
- **Simplified geometry.** Good enough to see the continent; not to measure distances or areas.

### 1.3 The occupations layer

What was under de facto control between 1938 and 1945 goes in a separate layer that can be
hidden and paints each zone in the colour of the state that controlled it, with its name, who
controlled it and why. Each zone has a file in `content/occupations/`, with the text, the dates,
who controlled it, why (`cause`, an event with its year, taken from the zone's text) and the
source, and a shape made by `npm run data:occupations` (`scripts/build-occupations.mjs`).

**Dates.** A zone starts on the day the occupier takes control —the surrender, the armistice, the
annexation or the capture of the capital— and ends on the day it loses it: the withdrawal, the
surrender or the liberation of the capital. While the fighting went on, what the map shows is the
conflict, not the zone; front lines are not drawn. For large zones, the capital sets both dates
even if part of the zone changed hands earlier or later: occupied Ukraine runs from the capture of
Kyiv, in September 1941, to its liberation, in November 1943, although the west was only liberated
in 1944.

**Shapes** are built from pieces that already exist, so that their edges match the map's:

| From | For | Example |
| --- | --- | --- |
| A CShapes state, from the same period or another | Most zones | Austria is the Austria of 1938; Bohemia and Moravia, the Czechoslovakia of 1939 inside today's Czechia |
| Today's administrative divisions, from [Natural Earth](https://www.naturalearthdata.com/) (public domain) | Edges that followed a division that still exists | Alsace and Moselle are three departments; the Italian Social Republic, the provinces of northern Italy; Kosovo, divided by municipality |
| Lines drawn by hand (`LINES` in the script), with the source next to them | Where there is nothing else | The partition of Poland, the French demarcation line, the Second Vienna Award, Transnistria |

Hand-drawn lines are **approximate**, within some 10–20 km; today's divisions, as much as they
have moved since. Each zone's card says so, and cites Natural Earth when its divisions are used. A
test checks that no two zones with the same dates overlap.

**What is there**, in 57 zones:

- **The west and centre**: the German expansion of 1938–1939 (Austria, Bohemia and Moravia, the
  Slovak State, Memel), Trans-Olza and Hungarian Ruthenia; the partition of Poland; the occupation
  of Denmark, Norway, the Netherlands, Belgium, Eupen-Malmedy, Luxembourg and the Channel Islands,
  and that of France: the occupied zone, Vichy, Alsace and Moselle, the 1942 zones and Corsica.
- **The Balkans**: Albania; the partition of Yugoslavia (the Independent State of Croatia,
  Serbia, German and Italian Slovenia, Dalmatia, Montenegro, Kosovo and western Macedonia joined to
  Albania, Bulgarian Macedonia, Hungarian Bačka and Prekmurje) and that of Greece (the German,
  Italian and Bulgarian zones, and Crete).
- **The Danube and the East**: northern Transylvania, Bessarabia, northern Bukovina and
  Transnistria; the Baltic states, Belarus, Ukraine and Crimea, occupied from 1941 to 1944, and
  occupied Hungary in 1944.
- **Italy from 1943 to 1945**: the Italian Social Republic, Rome and central Italy, and the two
  operational zones Germany annexed in all but name.

**What is missing**:

- **Occupied Russia** from 1941 to 1943, from Smolensk to the Caucasus: it changed hands with the
  front, and will come with the front-lines layer.
- **Small pieces of the 1941 Italian annexations**: what was added to the province of Fiume
  (Sušak, Kastav, Krk and Rab) and, from the autumn, Hvar and Pag. They appear inside Croatia.

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
