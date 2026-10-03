# Data sources, licences and known limitations

History Map combines data from different sources, each with its own licence. **If you reuse
anything from this repository, check the licence of that specific part.**

| Part                               | Source                                                                     | Licence         |
| ---------------------------------- | -------------------------------------------------------------------------- | --------------- |
| Code (`src/`, `scripts/`…)         | This project                                                               | MIT             |
| Texts (`content/`)                 | This project's contributors                                                | CC BY-SA 4.0    |
| Borders (`public/data/`)           | CShapes 2.0, processed by this project                                     | CC BY-NC-SA 4.0 |
| Map label glyphs (`public/fonts/`) | Open Sans, via [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0      |

## Borders: CShapes 2.0

[CShapes 2.0](https://icr.ethz.ch/data/cshapes/) maps the borders of independent states and
dependent territories (colonies, protectorates, mandates, occupied territories) from 1886 to
2019, with the exact dates of every change.

> Schvitz, G., Girardin, L., Rüegger, S., Weidmann, N. B., Cederman, L.-E., & Gleditsch, K. S.
> (2022). Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. _Journal of
> Conflict Resolution_, 66(1), 144–161.

- **Licence**: CC BY-NC-SA 4.0. The processed files in `public/data/` are a derivative work under
  the same licence: they can be shared and adapted with attribution, **not for commercial use**.
- **Version used**: the Gleditsch & Ward edition distributed with the
  [`cshapes` R package](https://github.com/cran/cshapes) (`cshapes_2_gw.topojson`).
- **Processing** (`npm run data:borders`): keep features valid from 1900, clip to
  `[-28°, 30°, 78°, 82°]`, simplify to 12 % of vertices, encode dates as integers and compute
  colours and label positions.

### Corrections applied

| Correction                                  | Reason                                                                                                                                                                                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crimea stays in Ukraine after 18 March 2014 | CShapes assigns Crimea to Russia. We show the internationally recognised border, in line with UN General Assembly resolution 68/262 and most atlases. The annexation is explained as an event and will be drawn in the planned de facto layer. |

### Known limitations

- **Treaty borders, not military occupations.** CShapes records changes settled by agreements —
  the Munich Agreement and the Vienna Awards (1938, 1940), the Soviet annexations of 1940 — but
  not territory taken by force. So between 1938 and 1945 the map still shows Austria,
  Bohemia-Moravia and Poland, and none of the Axis occupations. This is the main gap to close
  (see "Phase 2" in the [roadmap](ROADMAP.md)); in the meantime, events and conflicts explain
  what happened.
- **No microstates**: Andorra, Liechtenstein, Monaco, San Marino and Vatican City are not part of
  CShapes.
- **Coded by sovereignty**: some coding choices follow the Gleditsch & Ward state list, e.g.
  Montenegro is part of Yugoslavia from 1918 until 2006, and West Germany starts in 1945 (as the
  Allied occupation zones).
- **Data ends in 2019.** We assume no recognised border in Europe has changed since; changes
  after 2019 will be added by hand.
- **Simplified geometry**: fine for a continental view, not for measuring distances or areas.

## Historical content

Event and conflict texts in `content/` are original works by the project's contributors, licensed
under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Facts must be verifiable:
each entry should link to at least one reliable source (Wikipedia is acceptable as a starting
point). See [CONTRIBUTING.md](../CONTRIBUTING.md).
