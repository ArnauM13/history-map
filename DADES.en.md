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
| Sources date a change differently | The **day it takes effect**: the proclamation or abdication, for a change of regime; the treaty, for a cession, on the day it was signed even if it came into force later, unless it sets another day for the handover; the decree, for an annexation. In the Gregorian calendar. | The French Second Republic, from 24 February 1848 to 2 December 1852; Istria, Italian from the signing of the Treaty of Rapallo (12 November 1920), not from its ratification. |
| Two states share a sovereign | **Separate states** while they keep their own institutions; one when they are united by law. | Saxony and Poland (1697-1763), Hanover and Great Britain (1714-1837) and Scotland and England (1603-1707), separate; Great Britain from 1707. |
| A state pays tribute to or is a vassal of another | **A state of its own**, if it governed itself. | Wallachia and Moldavia, under the Ottoman Empire. |
| A revolt | On the map only if it had **a government over the territory**, with that government's dates. | The Hungarian State, from 14 April to 13 August 1849; the Nalyvaiko uprising, inside the Polish-Lithuanian Commonwealth. |
| A territory is freed before the peace | It goes back to its own government **on the day that government is restored**; if the occupier does not leave, it stays the occupier's until the treaty. | Geneva, a republic from 31 December 1813; Hamburg, French until the Treaty of Paris (30 May 1814), because Davout would not give it up. |
| A ceded territory that has no owner yet | The **provisional government** that ran it, if there was one. | Belgium, from the Treaty of Paris to the Congress of Vienna: the Allies' General Government, neither France nor the Netherlands. |
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
| Danzig, a Free City until 1 September 1939 | CShapes ends it on 31 August 1938 and puts it inside Germany from 30 September 1938: for a month it belongs to no one. It is a one-year slip; the Reich annexed it on 1 September 1939. |
| The Rapallo border, from 12 November 1920 to 10 February 1947 | CShapes gives Yugoslavia what the Treaty of Rapallo gave Italy: the Slovene Littoral with Idrija and Postojna, Istria, Zara, Cres and Lošinj. It is Italian again until the Treaty of Paris. The line, from Peč to Triglav, Snežnik and the Kvarner Gulf, is drawn by hand from the article on the treaty (an error of some 2-5 km). |
| The Free State of Fiume (1920-1924) and Italian Fiume (1924-1947) | CShapes lacks the free state Rapallo created and puts it inside Yugoslavia. Here it is a state (with its Wikidata QID as code) until 22 February 1924, the decree annexing it to Italy, and Italian afterwards. Sušak, across the Rječina, stays Yugoslav. |
| The Dodecanese, Ottoman until 24 July 1923 and Italian until 10 February 1947 | CShapes makes it Greek from 1913. Italy had occupied it since 1912, but Turkey only renounced it at the Treaty of Lausanne; the Treaty of Paris ceded it to Greece. |

**The dates, where sources disagree** (§0.1: a cession goes on the day it was signed):

- **Rapallo** was signed on 12 November 1920; Italy approved it by the law of 19 December, and the
  new borders came into force in January 1921.
- **Fiume.** The Treaty of Rome is of 27 January 1924, and the ratification and the annexation
  decree, of 22 February. On 16 March, the date many books give, the king visited the city to
  proclaim the annexation: a ceremony, not the change.
- **Lausanne** was signed on 24 July 1923 and came into force on 6 August 1924.
- **Paris** was signed on 10 February 1947 and came into force on 15 September: that is when
  Yugoslavia received Pola and the Free Territory of Trieste was born. Greece administered the
  Dodecanese from 31 March 1947 and formally annexed it on 7 March 1948.

Every correction is code, in the `CORRECTIONS` list in `scripts/build-borders.mjs`, and has its
row here. New borders are made after simplifying, from CShapes' own pieces, so that they match
the neighbours' and simplification does not eat their detail (before, the centre of Fiume fell in
Yugoslavia and Kastav in Italy); a test checks where each corrected place falls, year by year. The
generated files are never edited by hand.

### 1.2 Where it falls short

- **Treaty borders, not occupation.** CShapes records agreed changes —the Munich Agreement, the
  First Vienna Award (1938), the Soviet annexations of 1940— but not territory taken by force, nor
  the Second Vienna Award (1940), which gave northern Transylvania to Hungary. Between 1938 and
  1945, Austria, Bohemia-Moravia and Poland are still on the map. The occupations layer explains
  it (§1.3).
- **The Adriatic, still half done** (§1.1 fixes the Italian border). From 1919 to 1920, when
  Istria and Fiume were occupied by Italy and the border had not yet been agreed, CShapes gives
  them to Yugoslavia, and they are left so here; D'Annunzio's Regency of Carnaro is missing too.
  From 1947 to 1954, Trieste is Italian and Koper Yugoslav, with no Free Territory of Trieste.
  Lastovo, Palagruža and Saseno, Italian from 1920 to 1947, and Kastellorizo are not in CShapes;
  and simplification wipes out almost every Adriatic island, Cres and Krk included.
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

**What is there**, in 59 zones:

- **The west and centre**: the German expansion of 1938–1939 (Austria, Bohemia and Moravia, the
  Slovak State, Memel), Trans-Olza and Hungarian Ruthenia; the partition of Poland; the occupation
  of Denmark, Norway, the Netherlands, Belgium, Eupen-Malmedy, Luxembourg and the Channel Islands,
  and that of France: the occupied zone, Vichy, Alsace and Moselle, the 1942 zones and Corsica.
- **The Balkans**: Albania; the partition of Yugoslavia (the Independent State of Croatia,
  Serbia, German and Italian Slovenia, Dalmatia, what was added to the province of Fiume —Sušak,
  Kastav, Krk and Rab—, Pag, Brač and Hvar, occupied by Italy from 7 September 1941, Montenegro,
  Kosovo and western Macedonia joined to Albania, Bulgarian Macedonia, Hungarian Bačka and
  Prekmurje) and that of Greece (the German, Italian and Bulgarian zones, and Crete). What was
  already Italian from 1920 is not in it: it is in the borders (§1.1).
- **The Danube and the East**: northern Transylvania, Bessarabia, northern Bukovina and
  Transnistria; the Baltic states, Belarus, Ukraine and Crimea, occupied from 1941 to 1944, and
  occupied Hungary in 1944.
- **Italy from 1943 to 1945**: the Italian Social Republic, Rome and central Italy, and the two
  operational zones Germany annexed in all but name.

**What is missing**:

- **Occupied Russia** from 1941 to 1943, from Smolensk to the Caucasus: it changed hands with the
  front, and will come with the front-lines layer.
- **The rest of Zone II**: on 7 September 1941 Italy took over the government of the whole
  Croatian coastal strip, not just Pag, Brač and Hvar. The strip of land still appears inside
  Croatia.
- **The German Dodecanese** from 1943 to 1945, and Zara, which after the armistice stayed under
  German protection until October 1944.

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
description and dates, checked against Wikipedia. Where Cliopatria has no good shape (the free
cities, Geneva, the Gdańsk and Toruń enclaves), `SHAPES` takes it from OpenHistoricalMap
(`OHM_SHAPES`) and, for the Catalonia France annexed in 1812, from Natural Earth's provinces.

The occupations were searched for piece by piece: a script walks a grid of points every half degree
and notes where a territory changes hands and returns to its holder within eight years. Each case
was checked on Wikipedia; those that were military control go back to whoever held them, and those
that were a real cession (Podolia, in 1672) stay.

| What | Why |
| --- | --- |
| Prussia, 1809 to 1867 | Cliopatria names it after the Confederation of the Rhine (1809-1814), which it never joined, and the German Confederation (1815-1867), which was not a state. Its "Kingdom of Prussia" row covers less than 2,000 km². |
| Occupations counted as sovereignty | Cliopatria draws military control as if it were annexation, and the sampling stretches it. Given back: Vienna, Ottoman in 1529-1533 and 1683-1686 for two sieges that failed; Moscow and Lithuania, French in 1812-1813 for a six-month campaign; Vienna (1805, 1809), Prussia and Warsaw (1807-1808) and Spain (1809-1811), French; Paris, German in 1870-1872; Barcelona, English in 1706-1712; Saxony, Swedish and Prussian in the Thirty Years' and Seven Years' Wars, and Prussian in 1815-1819 and 1866; Bohemia, Prussian in 1744 and 1866; Brandenburg, Swedish in 1632-1647; Lombardy, Sardinian in 1848. |
| The Thirty Years' War | Mainz, Frankfurt, Würzburg, Erfurt, Mecklenburg and Bremen-Verden appear Swedish from 1632 to 1647, Hamburg Danish from 1622 to 1628, and Mecklenburg, Hamburg and Lübeck Habsburg from 1629 to 1631. Sweden gained nothing until Westphalia (1648); Wallenstein's Mecklenburg was an imperial fief. All of it goes back to the Holy Roman Empire. |
| Wallachia and Moldavia | Ottoman vassals, but states of their own (§0.1). Cliopatria makes them Russian or Austrian in every war (1769-1774, 1791, 1807-1812, 1828-1834, 1849-1856). Bessarabia is Russian from the Treaty of Bucharest, 28 May 1812, not from 1807. |
| The Bohemian Revolt | From 23 May 1618 (the Defenestration of Prague) to the White Mountain, 8 November 1620, Bohemia governed itself; Cliopatria puts it inside the "Holy Roman Empire" until 1621. |
| More occupations, searched for piece by piece | Smolensk, Vilnius and Kyiv, Russian from 1654-1655 to the Truce of Andrusovo (9-2-1667), and Swedish Livonia, Russian from 1656 to 1661; Russia, with a few towns from the Smolensk War (1632-1634) and with the Swedish invasion of 1708-1709; Finland, Russian from 1713 to 1721 (the Greater Wrath); Holstein and Jutland, Habsburg in 1627-1629; Silesia, Bohemia and Bavaria, Swedish in the Thirty Years' War; Utrecht, French in 1672-1673; Savoy and Nice, French in 1691-1696 and 1702-1705; western Spain, Portuguese in 1706-1708; Bohemia and southern Germany, French in 1741-1743; in the Seven Years' War, Bohemia Prussian, East Prussia and Pomerania Russian, and Hesse and Westphalia French; the Budjak, Russian in 1769-1774 and 1791; Lower Bavaria, Austrian in 1778-1779 (at Teschen, on 13 May 1779, Austria kept only the Innviertel); south-western Germany, French in 1796; Bulgaria, Russian in 1877-1879: Ottoman until the Treaty of Berlin (13-7-1878), then the Principality of Bulgaria and Eastern Rumelia. Minorca, Spanish from 1783: Britain occupied it from 1798 to 1802, and Cliopatria gives it back to Britain from 1806 to 1819. |
| The Napoleonic period | Hanover, French in 1803-1805; Portugal, French in 1811; Spain, French in 1812-1813, when the Empire annexed only Catalonia (26 January 1812); Swedish Pomerania, French in 1812-1813; Kraków, part of the Duchy of Warsaw from Schönbrunn (14-10-1809), not from 1811; the Duchy of Warsaw, Russian from 1813 to the Congress of Vienna, when it ceased to exist; Hanover, Hesse-Kassel and Brunswick, restored in 1813-1814, which Cliopatria makes Prussian until 1815. Belgium, from the Treaty of Paris (30 May 1814) to the Congress of Vienna, belongs to the Allies' General Government (§0.1), not to France. Luxembourg and the left bank of the Rhine, not yet (§1.4.2). |
| The free cities | Hamburg, Bremen and Lübeck, free from 1806 to 1810: France occupied them, but did not annex them until 1811. Free again, Bremen and Lübeck in 1813, and Hamburg at the Treaty of Paris (30 May 1814), because Davout held it to the end. Frankfurt, an imperial city until 1806, Dalberg's (a principality and, from 16 February 1810, a grand duchy) until 1813, and free afterwards. Bremen, an imperial city, never Swedish, Danish or Hanoverian, though they held its surroundings. Cliopatria draws them shifted (Bremen and Frankfurt, a few kilometres west) or mistakes two pieces of Mecklenburg for Lübeck: the shape is OpenHistoricalMap's of 1815. |
| Gdańsk and Toruń | Polish until the second partition (23-1-1793): in 1772 Prussia took their surroundings, but not the cities. The Free City of Danzig, from 21 July 1807 to 2 January 1814, with the Napoleonic one's QID and article, not the 1920 one's. |
| Finland | Russian from the Treaty of Fredrikshamn (17 September 1809), not from Schönbrunn: the same Cliopatria sample holds both changes. |
| Geneva | A republic from 1534 to the French annexation (15 April 1798) and from 31 December 1813 to 19 May 1815, when it joined Switzerland. Cliopatria puts it inside Savoy and, from 1860, France. |
| Overlaps | Cliopatria leaves Piedmont to the Kingdom of Sardinia after the French annexation (11 September 1802), and Rome and Lazio to the Papal States after that of 17 May 1809: the two pieces overlapped. Wismar, which Sweden pawned to Mecklenburg on 26 June 1803, was Swedish and Mecklenburg's at once. |
| Composite monarchies | Ferdinand I's Austria and Bohemia appear as part of Spain (1529-1555); Saxony under the elector who was king of Poland, as Poland (1700-1756); Habsburg-Lorraine Tuscany, as Austria; Hanover, as British or Prussian. They were separate states. |
| Scotland | A separate kingdom until 1 May 1707, except under Cromwell's Commonwealth. Cliopatria makes it English from 1609 and leaves it blank from 1640 to 1652. |
| Revolts of a few months | The Hungarian State (14 April - 13 August 1849), the Republic of Baden (1 June - 23 July 1849), Sicily in 1848 and the November Uprising government (29 November 1830 - 21 October 1831), with their own dates; the sampling stretched them by up to three years. The Nalyvaiko and Huguenot revolts, inside their state. |
| Treaties, on the day they were signed | Westphalia (24-10-1648), the Pyrenees (7-11-1659), Utrecht (11-4-1713), Passarowitz (21-7-1718), Nystad (10-9-1721), Aix-la-Chapelle (18-10-1748), the partitions of Poland (5-8-1772, 23-1-1793 and 24-10-1795), Crimea (19-4-1783), Campo Formio (17-10-1797), Tilsit (9-7-1807), Schönbrunn (14-10-1809), Vienna (9-6-1815), Belgium (4-10-1830), Zurich (10-11-1859), Turin (24-3-1860), Vienna (30-10-1864), Prague (23-8-1866) and the North German Confederation (1-7-1867); and, one by one, Andrusovo (9-2-1667), Fredrikshamn (17-9-1809) and Berlin (13-7-1878). Cliopatria puts them on 1 January of the sample year, and the second and third partitions of Poland a year early. Every state that exchanges territory changes on the same day, including those outside the treaty's area (in 1809, Sweden, which loses Finland). |
| The day a regime changes | France (1792, 1795, 1799, 1804, 1814, 1830, 1848, 1852, 1870), Spain (1873, 1874), Great Britain (1707) and the United Kingdom (1801), Denmark and Norway (1814), Sweden (1721), Prussia (1701), Austria-Hungary (1867), Italy (1861), Napoleonic Italy (1805), Naples (1806), Tuscany (1569), Greece (1832), Serbia (1882) and Romania (1862, 1881). |
| Wrong names and articles | "Serbs", the people, for the Principality of Serbia; the County of Urgell for Andorra; a "Kingdom of Monaco"; present-day Catalonia's QID and article for the 1641 Catalan Republic, and present-day Italy's for the 1802 Italian Republic; 1885 Egypt linked to the "Scramble for Africa"; the Livonian Confederation, to the Livonian language; the 1920 Free City of Danzig for the Napoleonic one; a "Kingdom of Hanover" in 1803, when it became one in 1814. |
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
- **Kyiv from 1654 to 1667.** It had a Russian garrison from 1654, but the Polish-Lithuanian
  Commonwealth did not cede it until the Truce of Andrusovo, and then only for two years: the
  Eternal Peace of 1686 made it final. The map follows sovereignty: Polish until Andrusovo, and
  Russian from then on.
- **Belgium in 1815.** William of Orange proclaimed himself king on 16 March, and the Congress of
  Vienna joined it to the Netherlands on 9 June. The map uses 9 June, as for the Congress's other
  changes.
- **Frankfurt from 1813 to 1815.** Wikipedia has it free from 1813; OpenHistoricalMap, from 9 July
  1815, when its pre-Napoleonic constitution came back. The map makes it free from 1 January 1814,
  when there was no grand duke any more.

#### 1.4.2 Where it falls short

- **Year by year**, wherever no treaty or regime has its date set. See "Precision", above.
- **More de facto control**, where there is no good shape to give the territory back:
  - **Luxembourg and the left bank of the Rhine**, French until the Congress of Vienna, when from
    the Treaty of Paris (30 May 1814) they belonged to the Allies' provisional governments.
  - **Podolia**, Ottoman from the Treaty of Buczacz (1672) to that of Karlowitz (1699): Cliopatria
    makes it Ottoman only from 1673 to 1676.
  - **Sardinia and Sicily**, Spanish from 1718 to 1720, when Spain had reconquered them but the
    Treaty of Utrecht gave them to Austria and Savoy.
  - **Poland from 1706 to 1713**, with the king Sweden installed (Stanisław I) as if it were another
    state.
  - **The Time of Troubles** (1610-1618), with western Russia Polish; **Piedmont** in 1799, French;
    **Lorraine** in the 18th century, between France and the duke.
- **Small states outside 1815-1870.** Those of the Holy Roman Empire go together, under the
  Empire's name, including the Italian ones until 1740. The free cities are there (§1.4.1), but not
  the rest of the Grand Duchy of Frankfurt (Aschaffenburg, Fulda, Hanau): Würzburg and Berg show
  instead.
- **Coarser outlines** than CShapes's, with a small jump on 1 January 1886, when CShapes's start.
- **Gaps.** The Cossack Hetmanate, which ruled central Ukraine from 1648, is not in Cliopatria:
  from 1653 to 1661 that area belongs to nobody. The steppe, south of Russia, is blank until the
  Russian Empire reaches it.
- **Overlapping pieces**, small ones: Spain and Naples in Sicily (1762), Spain, Austria and Savoy
  in Sardinia and Sicily (1721), the County of Foix and the House of Bourbon inside France
  (1540-1563).
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
  Russia's western border did not move from 1815 to 1914, and there CShapes rules. The outline of
  the Free City of Kraków is missing two stretches, one in the north and the one along the
  Vistula, which runs through the city, and the centre was left out: they are stitched with a
  straight line (`OHM.repair`), off by one or two kilometres.
- **Names**, from Wikidata (the English name and the Wikipedia article), translated like the rest
  (§1.4), or from `content/countries.yaml`.
- **Downloaded once** (`npm run data:history`), into `data-raw/`: a few hundred MB.

Where it falls short:

- **Thuringia before 1826.** OHM lacks Saxe-Gotha-Altenburg, Saxe-Hildburghausen and
  Saxe-Coburg-Saalfeld before the reorganisation of 12 November 1826. Instead of what Cliopatria
  says (Prussia, Bavaria, Berg), the map says what is known: **the Ernestine duchies**, not told
  apart.

---

## 2. Flags: Wikimedia Commons

The chronology —which flag each state used and until when— belongs to this project and lives in
`content/flags.yaml`. The images come from [Wikimedia Commons](https://commons.wikimedia.org/):
`npm run data:flags` downloads them, or the "Flags" GitHub workflow does whenever the file changes.

- **Light images.** It downloads the 330 px PNG that Wikimedia renders, not the original SVG: some
  are over a megabyte because of detailed coats of arms, and on the map a flag is 14 px tall. The
  hundred and sixty flags take up a megabyte and a half.
- **Licences.** Almost all are in the public domain: a flag rarely carries copyright, or it has
  expired. Some drawings of coats of arms are CC BY-SA, and the app then credits the author under
  the flag. All of them are recorded in `public/flags/credits.json`.
- **Dates.** Those of official adoption, or of first use if that came earlier.
- **When sources disagree**, the date is the day the law, decree or constitution took effect
  (§0.1), and the YAML comment gives the other source's date. Dates not found on Wikipedia come
  from [Flags of the World](https://www.fotw.info/), which cites the decrees. The current cases:
  - **Finland**: the blue cross from the law of 29 May 1918 (Wikipedia says the 28th, the day
    Parliament voted it). The red lion from when it was first hoisted, on 28 December 1917.
  - **Bulgaria**: the decree of 27 January 1948 approved the first communist emblem; Wikipedia uses
    it as the date of the second, and Flags of the World says the first lasted two more months,
    with no day given. The decree is used. The 1967 change is from the decree of 7 December
    (Wikipedia says 5 January, unsourced).
  - **Albania**: the kingdom's flag from the Statute of 1 December 1928 (Flags of the World says
    22 November, and a decree of August 1929 fixed the design). Commons has a 1928–1934 version
    without Skanderbeg's helmet that Flags of the World does not record: in 1934 only the red was
    lightened, and the map uses the helmeted flag for the whole kingdom. From 26 July to
    7 September 1943 it is not known which flag the state used, and there is a gap.
  - **Hungary**: the Kossuth arms return to the flag with the revolution, on 23 October 1956
    (Commons says officially on 12 November). The flag with the hole was never official.
  - **China**: the Kuomintang flag from when Manchuria joined the Nanjing government (29 December
    1928), which had used it since 1927 where it ruled. The Qing dynasty's rectangular dragon flag
    was used by the navy from 1881 and became the national flag in 1888 or 1889, and is shown from
    1886.
- **Simplifications**, marked with a comment in the YAML: Afghanistan before 1929, when the flags
  of the emirate and of Amanullah's kingdom changed often and without exact dates; Iraq's first
  flag (1921–1924) and that of the Arab Federation (1958). Colonies, protectorates and mandates
  have none yet (British India had no national flag), nor do Bukhara, Khiva, Bosnia and
  Herzegovina under Austria-Hungary, Palestine, Gaza, the West Bank and Kashmir. Occupied Germany
  (1945–1949) is shown without a flag of its own, because it had none.
- **Flags of regimes such as the Nazi or Soviet ones** are shown in their historical context and
  for educational purposes.

## 3. The texts

The events and conflicts in `content/` are written by contributors, under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Everything stated must be
verifiable: each entry links at least one source (Wikipedia is fine to start with). A source other
than Wikipedia goes in `sources`, with the title, the publisher and the link (the UN resolution on
Crimea, for instance). How the texts are written is in [CONTRIBUTING.en.md](CONTRIBUTING.en.md).
