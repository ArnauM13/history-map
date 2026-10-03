# Historical Map of Europe

[Català](README.md) · [Castellano](README.es.md) · **English**

**Europe from 1900 to today, on a map that moves: the borders, the flags and what happened.**

Pick a date and the map shows you Europe on that day: which states existed and what they were
called, which flag each one flew, which wars were being fought and what happened that year.

![Europe on 28 June 1914](.github/captura.png)

---

## 1. The problem

The history of 20th-century Europe is usually told with four maps —1914, 1919, 1945 and 1991— and
whatever happens in between is left to the imagination.

- **Loose snapshots.** Between 1918 and 1922 Europe changes every few months. Four maps can't show
  that; a map that moves can.
- **Everything apart.** One article for each state, another for each war and another for each
  flag. What was happening at the same time is never seen together.
- **Changing names.** The Russian Empire, Soviet Russia, the Soviet Union and Russia occupy the
  same place on the map. Unless someone tells you, they look like four countries.

## 2. What it offers

| | |
| --- | --- |
| **Any day** | The borders on any date from 1900 to today, with the exact day of every change. |
| **Every flag in its time** | Each state flies the flag it had that day, and its card shows all of them. |
| **What happened at the same time** | Ongoing conflicts and the year's events, next to the map and on the timeline. |
| **Nothing without a source** | Every card says where each piece of data comes from: borders, names, flags, events. |

## 3. Who it is for

- **History lovers.** They want to watch Austria-Hungary come apart month by month, or see when
  Spain changed its flag and why.
- **Teachers and students.** They need a map that can be moved in class and a link that opens the
  exact date they are talking about.
- **Flag collectors.** They will find the chronology of Europe's flags, with the image, the date
  and the source.

---

## 4. What it does

### 4.1 The map — Europe on a date

The borders in force that day, with the name each state had at the time. Colonies, protectorates
and occupied territories are told apart from independent states. Click a state to open its card.

### 4.2 The timeline — a century, month by month

It moves month by month, plays by itself (a century in about three minutes) and jumps from one
key date to the next. Below it are the conflicts, as bars, and the marks of the events or of the
flag changes, depending on the tab you have open.

### 4.3 Flags — all of them, and when they changed

On the map, every state carries its flag next to its name. The Flags tab shows all the flags
flying that day and the ones adopted that year. A state's card shows every flag it has had, and
picking one takes you to the date it arrived. The ones with the most history come with two
sentences on what they mean and why they changed.

### 4.4 Events and conflicts — what happened

The conflicts ongoing on the date and the events of the year, each with two or three sentences
and a link to Wikipedia, in your language, to keep reading.

### 4.5 Three languages and a link

Catalan, Spanish and English: the interface, the names of states and capitals, the events, the
conflicts and the flag texts. The address keeps the date and the language
(`?d=1914-06-28&lang=en`): whoever gets it opens the same map.

## 5. Principles

1. **The date rules.** What you see —borders, names, flags, conflicts— is what was true that day,
   not today.
2. **Nothing without a source.** Every card lists its sources, and every source links to where it
   can be checked: borders and capitals to CShapes; state names and flag dates to Wikipedia; images
   to Wikimedia Commons; events to Wikipedia and official sources. Every Monday a workflow checks
   that all of them still exist.
3. **Neutral and short.** Two or three sentences that explain; the debate is in the sources.
4. **The content belongs to everyone.** Adding an event or fixing a flag means editing a text
   file, no programming needed.
5. **A static website.** No server, no accounts, nothing to maintain but the content.

## 6. What it doesn't do (on purpose)

- **It isn't an encyclopaedia.** Two or three sentences and the Wikipedia link; the rest is well
  explained there.
- **It doesn't draw occupations or front lines, for now.** Borders are those set by treaties.
  Between 1938 and 1945, Austria and Poland are still on the map (see [DADES.en.md](DADES.en.md)).
  The occupations layer is on the [roadmap](FULL-DE-RUTA.md) (in Catalan).
- **It asks you for nothing.** No account, no cookies, no personal data.
- **It can't be used commercially.** The CShapes borders are CC BY-NC-SA.

---

## 7. Running it

Requires Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type-checks and builds the site into `dist/` |
| `npm test` | Tests, which also validate every content file |
| `npm run lint` | oxlint |
| `npm run format` | Prettier |
| `npm run data:borders` | Rebuilds `public/data/` from CShapes 2.0 |
| `npm run data:flags` | Downloads the flags listed in `content/flags.yaml` |
| `npm run data:sources` | Checks the sources and translates the Wikipedia titles |

## 8. Contributing

What it needs most is content: events, conflicts, flag dates. No programming required; it's a
short YAML file. [CONTRIBUTING.en.md](CONTRIBUTING.en.md) explains how.

## 9. Licences

- **Code**: [MIT](LICENSE).
- **Texts** in `content/`: [CC BY-SA 4.0](content/README.md).
- **Flags**: images from [Wikimedia Commons](https://commons.wikimedia.org/), almost all in the
  public domain; each one's licence is in `public/flags/credits.json` and in the app, under the
  flag.
- **Borders**: derived from [CShapes 2.0](https://icr.ethz.ch/data/cshapes/) (ETH Zurich and
  University of Konstanz), CC BY-NC-SA 4.0: **non-commercial use only**.

---

*The rest of the documentation is in Catalan: the design in [DESIGN.md](DESIGN.md), what comes
next in [FULL-DE-RUTA.md](FULL-DE-RUTA.md) and the code conventions in [CLAUDE.md](CLAUDE.md). The
data sources and their limitations are in [DADES.en.md](DADES.en.md).*
