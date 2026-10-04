# The data — where it comes from, under which licence and where it falls short

[Català](DADES.md) · [Castellano](DADES.es.md) · **English**

The map combines data from different places, each with its own licence. **If you reuse anything,
check the licence of that part.**

| What | Source | Licence |
| --- | --- | --- |
| The code (`src/`, `scripts/`…) | This project | MIT |
| The texts (`content/`) | Its contributors | CC BY-SA 4.0 |
| The borders (`public/data/`) | CShapes 2.0, clipped and simplified here | CC BY-NC-SA 4.0 |
| The borders before 1886 (`public/data/history/`) | Cliopatria and, from 1815 to 1870 in central Europe, OpenHistoricalMap, clipped, simplified and corrected here (§1.4, §1.5) | CC BY 4.0 |
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
| Borders before 1886 | Cliopatria (§1.4) and OpenHistoricalMap (§1.5) | On each state's card |
| Each state's name in each period | The Wikipedia article on the state under that name (`wiki` in `content/countries.yaml`) | On the state's card |
| Each entity's name before 1886 | The Catalan and Spanish title of the Wikipedia article Cliopatria cites, or `content/countries.yaml` by QID (§1.4) | On the state's card |
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

### 0.1 When sources disagree

The map aims to be a reference. When two sources say different things —a date, a name, a border—,
we find out why, in Wikipedia and the sources it cites, in the text of treaties and in standard
historiography, and settle on a rule that holds for every similar case. The current rules:

| When | Rule | Example |
| --- | --- | --- |
| A source gives a state territory another state was occupying in a war | The map draws **sovereignty**: the territory belongs to whoever held it until a treaty or a formal annexation changes hands. The long 20th-century occupations go in the occupations layer (§1.3). | Moscow in 1812 is Russian; Hamburg is French from the 1811 annexation, not from the 1806 occupation. |
| Sources date a change differently | The **day it takes effect**: the proclamation or abdication, for a change of regime; the treaty, for a cession, unless it sets another date; the decree, for an annexation. In the Gregorian calendar. | The French Second Republic, from 24 February 1848 to 2 December 1852. |
| Two states share a sovereign | **Separate states** while they keep their own institutions; one when they are united by law. | Saxony and Poland (1697-1763), Hanover and Great Britain (1714-1837) and Scotland and England (1603-1707), separate; Great Britain from 1707. |
| A state pays tribute to or is a vassal of another | **A state of its own**, if it governed itself. | Wallachia and Moldavia, under the Ottoman Empire. |
| A revolt | On the map only if it had **a government over the territory**, with that government's dates. | The Hungarian State, from 14 April to 13 August 1849; the Nalyvaiko uprising, inside the Polish-Lithuanian Commonwealth. |
| The name | The one the state had **at the time**, as each language's Wikipedia calls it. | In 1700, the Kingdom of France; in 1810, the First French Empire. |

If the disagreement matters historically (a disputed border, a date each historiography sets
differently, a sovereignty that depended on who recognised it), it is documented too, here and on
the card if the reader needs to know. The corrections that follow from these rules are in §1.1 and
§1.4.1.

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

States are identified by their **Gleditsch & Ward codes** (`code`), the same ones used by
CShapes and much of political science (UCDP conflict data, for instance). Events, conflicts, names
and flags refer to states by these codes. Entities before 1886 that do not continue any CShapes
state use their Wikidata QID (`Q207162`) as their code (§1.4). CShapes names states and capitals in English; the app's
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

### 1.4 Before 1886: Cliopatria

[Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria), from the Seshat Global
History Databank, maps the world's political entities from 3400 BCE to 2024, each with the year
every shape starts and ends. The map uses Europe's, from 1500 to 1885.

> Seshat Global History Databank. Cliopatria, version 0.2.1. _Scientific Data_ (2025).
> https://doi.org/10.1038/s41597-025-04516-9

- **Licence**: CC BY 4.0. The files in `public/data/history/` are a derivative work under the same
  licence.
- **What is done to it** (`npm run data:history`, after `npm run data:borders`, which provides the
  colours):
  - The groupings (the rows in brackets, which repeat other rows' pieces) are dropped, and it is
    clipped and simplified like CShapes.
  - Each entity carries its Wikidata QID. If in 1885 it covers the same place as a CShapes state of
    1886, or it is on the `SAME_STATE` list, it takes that state's code and colour: the Kingdom of
    France, the Republic and both Empires are 220, like CShapes's France. The list adds the
    predecessors Gleditsch & Ward already count as the same state (Prussia, 255; the Kingdom of
    Sardinia, 325) and those that were its core (England, 200; the Habsburg Monarchy, 300).
  - The name is the Catalan and Spanish title of the Wikipedia article Cliopatria cites
    (`content/wikipedia.json`). When there is none, or it is not about the entity,
    `content/countries.yaml` sets it by QID.
  - It comes in one file per century, and the app only downloads the century on screen: together
    they weigh ten times CShapes's borders.

**Precision.** Cliopatria samples the map every few years —every year in turbulent times, every ten
or more in quiet ones— and each shape holds until the next sample. So borders change on 1 January
rather than on the day it happened, and a change can arrive a year or two late. Each state's card
says so, and the timeline marks it with a hatched band up to 1886. Where we know the day, the name
does change on the exact day (§1.4.1).

#### 1.4.1 Where we depart from it

Corrections are code, in `scripts/build-history.mjs`, and follow the rules in §0.1: `CORRECTIONS`
changes who a piece belongs to and until when; `SHAPES` gives a territory back to its owner, taking
it only from whoever occupied it, so that the neighbours' real changes are left alone;
`TRANSITIONS` puts the great treaties' changes on the day they were signed. Each one carries its
description and dates, checked against Wikipedia.

| What | Why |
| --- | --- |
| Prussia, 1809 to 1867 | Cliopatria names it after the Confederation of the Rhine (1809-1814), which it never joined, and the German Confederation (1815-1867), which was not a state. Its "Kingdom of Prussia" row covers less than 2,000 km². |
| Occupations counted as sovereignty | Cliopatria draws military control as if it were annexation, and the sampling stretches it. Given back: Vienna, Ottoman in 1529-1533 and 1683-1686 for two sieges that failed; Moscow and Lithuania, French in 1812-1813 for a six-month campaign; Vienna (1805, 1809), Prussia and Warsaw (1807-1808) and Spain (1809-1811), French; Paris, German in 1870-1872; Barcelona, English in 1706-1712; Saxony, Swedish and Prussian in the Thirty Years' and Seven Years' Wars, and Prussian in 1815-1819 and 1866; Bohemia, Prussian in 1744 and 1866; Brandenburg, Swedish in 1632-1647; Lombardy, Sardinian in 1848. |
| The Thirty Years' War | Mainz, Frankfurt, Würzburg, Erfurt, Mecklenburg and Bremen-Verden appear Swedish from 1632 to 1647, Hamburg Danish from 1622 to 1628, and Mecklenburg, Hamburg and Lübeck Habsburg from 1629 to 1631. Sweden gained nothing until Westphalia (1648); Wallenstein's Mecklenburg was an imperial fief. All of it goes back to the Holy Roman Empire. |
| Wallachia and Moldavia | Ottoman vassals, but states of their own (§0.1). Cliopatria makes them Russian or Austrian in every war (1769-1774, 1791, 1807-1812, 1828-1834, 1849-1856). Bessarabia is Russian from the Treaty of Bucharest, 28 May 1812, not from 1807. |
| The Bohemian Revolt | From 23 May 1618 (the Defenestration of Prague) to the White Mountain, 8 November 1620, Bohemia governed itself; Cliopatria puts it inside the "Holy Roman Empire" until 1621. |
| The Hanseatic cities | Hamburg and Bremen, free from 1806 to 1810: France occupied them, but did not annex them until 1811. Lübeck the other way round: Cliopatria leaves it free when it was French (1811-1813). |
| Composite monarchies | Ferdinand I's Austria and Bohemia appear as part of Spain (1529-1555); Saxony under the elector who was king of Poland, as Poland (1700-1756); Habsburg-Lorraine Tuscany, as Austria; Hanover, as British or Prussian. They were separate states. |
| Scotland | A separate kingdom until 1 May 1707, except under Cromwell's Commonwealth. Cliopatria makes it English from 1609 and leaves it blank from 1640 to 1652. |
| Revolts of a few months | The Hungarian State (14 April - 13 August 1849), the Republic of Baden (1 June - 23 July 1849), Sicily in 1848 and the November Uprising government (29 November 1830 - 21 October 1831), with their own dates; the sampling stretched them by up to three years. The Nalyvaiko and Huguenot revolts, inside their state. |
| Treaties, on the day they were signed | Westphalia (24-10-1648), the Pyrenees (7-11-1659), Utrecht (11-4-1713), Passarowitz (21-7-1718), Nystad (10-9-1721), Aix-la-Chapelle (18-10-1748), the partitions of Poland (5-8-1772, 23-1-1793 and 24-10-1795), Crimea (19-4-1783), Campo Formio (17-10-1797), Tilsit (9-7-1807), Schönbrunn (14-10-1809), Vienna (9-6-1815), Belgium (4-10-1830), Zurich (10-11-1859), Turin (24-3-1860), Vienna (30-10-1864), Prague (23-8-1866) and the North German Confederation (1-7-1867). Cliopatria puts them on 1 January of the sample year, and the second and third partitions of Poland a year early. Every state that exchanges territory changes on the same day, including those outside the treaty's area (in 1809, Sweden, which loses Finland). |
| The day a regime changes | France (1792, 1795, 1799, 1804, 1814, 1830, 1848, 1852, 1870), Spain (1873, 1874), Great Britain (1707) and the United Kingdom (1801), Denmark and Norway (1814), Sweden (1721), Prussia (1701), Austria-Hungary (1867), Italy (1861), Napoleonic Italy (1805), Naples (1806), Tuscany (1569), Greece (1832), Serbia (1882) and Romania (1862, 1881). |
| Wrong names and articles | "Serbs", the people, for the Principality of Serbia; the County of Urgell for Andorra; a "Kingdom of Monaco"; present-day Catalonia's QID and article for the 1641 Catalan Republic, and present-day Italy's for the 1802 Italian Republic; 1885 Egypt linked to the "Scramble for Africa"; the Livonian Confederation, to the Livonian language. |
| France in 1814 | Cliopatria gives 100,000 km² around Paris to the Grand Duchy of Berg, which had 15,000, on the Rhine. |
| Alsace and Lorraine | French until the Treaty of Frankfurt (10 May 1871), not until 1 January. |

**Genuine disagreements** between reliable sources, and the rule taken:

- **The third partition of Poland.** The three powers agreed on 24 October 1795, and the treaty that
  closed it is dated 26 January 1797. The map uses 1795: that is when the Polish-Lithuanian
  Commonwealth ceased to exist in fact, and the king abdicated a month later.
- **The German Empire.** The accession treaties of Bavaria, Württemberg, Baden and Hesse came into
  force on 1 January 1871; the emperor was proclaimed on 18 January, and the Empire's constitution
  is dated 4 May, the date OpenHistoricalMap uses. The map uses 1 January, when the southern states
  stopped being independent.

#### 1.4.2 Where it falls short

- **Year by year**, wherever no treaty or regime has its date set. See "Precision", above.
- **More de facto control.** Some brief occupations are still counted as sovereignty, mostly in the
  Napoleonic period (Brussels in 1814) and on the eastern borders.
- **Small states outside 1815-1870.** Those of the Holy Roman Empire go together, under the
  Empire's name, including the Italian ones until 1740. Before 1815, Frankfurt appears inside Berg
  and Würzburg, and the shapes of Bremen and Lübeck sit a few kilometres off the cities. From 1815
  to 1870 OpenHistoricalMap fixes it (§1.5).
- **Gdańsk and Toruń**, Prussian from 1772: they stayed Polish until 1793. Cliopatria does not set
  them apart from their surroundings, which did pass to Prussia in 1772.
- **Finland**, Swedish until 14 October 1809 (Schönbrunn), whereas the Treaty of Fredrikshamn is
  dated 17 September: the same Cliopatria sample holds both changes.
- **Coarser outlines** than CShapes's, with a small jump on 1 January 1886, when CShapes's start.
  Geneva, independent and Swiss since 1815, falls on the wrong side of the border.
- **Gaps.** From 1659 to 1661, Kyiv belongs to nobody.
- **No flags.** They start in 1886: earlier ones are not documented yet.

### 1.5 Central Europe, 1815 to 1870: OpenHistoricalMap

Cliopatria does not tell the German Confederation's small states apart: it puts Kassel inside
Hanover, Frankfurt inside Hesse-Darmstadt, Mainz inside Frankfurt and Gotha inside Prussia.
[OpenHistoricalMap](https://www.openhistoricalmap.org/) (OHM, public domain CC0) has all of them,
with the day of each change and their Wikidata QID. Between 9 June 1815 (the Congress of Vienna)
and 31 December 1870 (the German Empire), wherever there is OHM, OHM rules, and Cliopatria fills
the rest.

- **What is taken**: the German Confederation's states, Austria and Prussia included, the North
  German Confederation, the Italian states, Liechtenstein, Luxembourg, Monaco and San Marino, and
  the revolutionary governments that governed a territory (Milan and Venice in 1848, Sicily in
  1848-1849, the United Provinces of Central Italy, Garibaldi in 1860). The neighbours stay with
  Cliopatria: OHM has errors there that Cliopatria does not.
- **Where OHM is corrected**: Prussia from 1829 to 1834 reaches 13,000 km² into Russian Poland.
  Russia's western border did not move from 1815 to 1914, and there CShapes rules.
- **Names**, from Wikidata (the English name and the Wikipedia article), translated like the rest
  (§1.4), or from `content/countries.yaml`.
- **Downloaded once** (`npm run data:history`), into `data-raw/`: a few hundred MB.

Where it falls short:

- **Thuringia before 1826.** OHM lacks Saxe-Gotha-Altenburg, Saxe-Hildburghausen and
  Saxe-Coburg-Saalfeld before the reorganisation of 12 November 1826. Instead of what Cliopatria
  says (Prussia, Bavaria, Berg), the map says what is known: **the Ernestine duchies**, not told
  apart.
- **Kraków.** OHM's shape of the Free City does not close properly and leaves the city centre out;
  where it is missing, Cliopatria shows through.

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
