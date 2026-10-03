# Contributing

[Català](CONTRIBUTING.md) · [Castellano](CONTRIBUTING.es.md) · **English**

Thanks for wanting to lend a hand. There are three ways to help:

1. **Content**: events, conflicts, state names and flags. No programming needed.
2. **Data**: fixing a border or drawing the occupations layer (see the
   [roadmap](FULL-DE-RUTA.md), §3, in Catalan).
3. **Code**: features, design, accessibility.

If you don't know where to start, look at the issues labelled `content`, or open one and we'll
talk.

## Getting it running

```bash
git clone https://github.com/ArnauM13/history-map.git
cd history-map
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run lint && npm run typecheck && npm test && npm run format
```

## Adding an event

A new file in `content/events/`, named `YYYY-MM-DD-short-name.yaml`. The file name is its id.

```yaml
date: 1919-06-28 # YYYY-MM-DD, Gregorian calendar
category: treaty # war | treaty | revolution | independence | political | integration | crisis
location: [2.120, 48.805] # [longitude, latitude]; optional, puts a marker on the map
countries: [255, 220, 200] # the states involved, by their code in content/countries.yaml
title:
  ca: Tractat de Versalles
  es: Tratado de Versalles
  en: Treaty of Versailles
summary:
  ca: >-
    …
  es: >-
    …
  en: >-
    Two or three sentences: what happened and why it matters.
wikipedia: # the main source: the English Wikipedia article title
  en: Treaty of Versailles
sources: # optional: other sources, with title, publisher and link
  - title: The Versailles Treaty, June 28, 1919
    publisher: The Avalon Project, Yale Law School
    url: https://…
```

**No event without a source.** At least the English Wikipedia title or one entry in `sources` is
required (the tests let nothing in without one). No need to look up the Catalan or Spanish title:
when your change reaches GitHub, the "Fonts" workflow checks that the article exists, gets its
title in the other languages (`content/wikipedia.json`) and opens every link in `sources` to check
it responds. Locally, `npm run data:sources` does the same.

## Adding a conflict

A file in `content/conflicts/short-name.yaml`. The same fields as an event, except the date:

```yaml
start: 1936-07-17
end: 1939-04-01 # without `end`, the conflict is ongoing
category: civil-war # world-war | interstate | civil-war | independence | uprising
location: [-3.7, 40.4] # required: a point on the main front
```

## Flags

`content/flags.yaml` has three parts:

```yaml
catalogue: # id → file name on Wikimedia Commons
  es-1931: Flag of Spain (1931–1939).svg

about: # optional: what it means and why it came about, in two or three sentences
  es-1931:
    en: >-
      The Second Republic replaced the lower red stripe with a purple one…

states: # state code → its flags, in order
  "230":
    - { until: 1931-04-13, flag: es-1785 } # until = the last day it was used
    - { until: 1939-03-31, flag: es-1931 }
    - { flag: es } # the last one has no until

sources: # where the dates come from: English Wikipedia articles
  "230": [Flag of Spain]
```

- The file name exactly as it appears on the flag's page on Wikimedia Commons (what comes after
  `File:`).
- `flag: null` means the state had no flag of its own in those years; an entry without `flag`
  means it isn't documented yet.
- No need to download anything: when your change reaches GitHub, the "Flags" workflow downloads
  the images into `public/flags/` and commits them. Locally, `npm run data:flags` does the same.
- The dates must come from somewhere: the state's article in `sources`, or one you add.

## State and capital names

`content/countries.yaml` gives the name of each state over time. If a state shows a name it didn't
have on that date, this is the place. Each name cites the English Wikipedia article on the state
under that name (`wiki: Russian Empire`). Capitals come from CShapes in English and are translated in
`content/capitals.yaml`. A state's code is in `public/data/labels.geojson` (`gwcode`).

## How to write

- **Neutral.** Say what happened; if something is disputed, say who disputes it.
- **Short.** Two or three sentences. The detail belongs in the sources.
- **Verifiable.** Everything you write must be in the sources you link.
- **In your own words.** Don't copy from elsewhere: texts are published under CC BY-SA 4.0.
- **In all three languages, if you can.** One is enough: what's missing will be read in another,
  and someone will translate it.

## Borders

`public/data/` is never edited by hand: `npm run data:borders` generates it. A correction to
CShapes goes into the `CORRECTIONS` list in `scripts/build-borders.mjs`, with its row and source in
[DADES.en.md](DADES.en.md).

## Code

The conventions are in [CLAUDE.md](CLAUDE.md) and the design in [DESIGN.md](DESIGN.md) (both in
Catalan). In short: comments and commits in Catalan, interface texts in all three languages, no
colour outside the tokens, and everything checked in the browser before pushing.

## Pull requests

- One thing per pull request; explain what changes and how you checked it.
- For content, the sources, if they aren't in the file already.
- By contributing, you agree that the code is published under the MIT licence and the texts under
  CC BY-SA 4.0.
