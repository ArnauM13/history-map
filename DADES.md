# Les dades — d'on surten, amb quina llicència i on fallen

**Català** · [Castellano](DADES.es.md) · [English](DADES.en.md)

El mapa barreja dades de llocs diferents, i cadascuna té la seva llicència. **Si en reaprofites
alguna cosa, mira la llicència d'aquella part.**

| Què | D'on surt | Llicència |
| --- | --- | --- |
| El codi (`src/`, `scripts/`…) | Aquest projecte | MIT |
| Els textos (`content/`) | Qui hi contribueix | CC BY-SA 4.0 |
| Les fronteres (`public/data/`) | CShapes 2.0, retallat i simplificat aquí | CC BY-NC-SA 4.0 |
| Les zones d'ocupació (`public/data/occupations.geojson`) | CShapes 2.0, [Natural Earth](https://www.naturalearthdata.com/) i línies dibuixades aquí (§1.3) | CC BY-NC-SA 4.0 |
| Les banderes (`public/flags/`) | Wikimedia Commons | La de cada imatge (§2) |
| Les lletres del mapa (`public/fonts/`) | Open Sans, de [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0 |
| La lletra de la interfície | Roboto ([Fontsource](https://fontsource.org/)) | OFL 1.1 |
| Les icones | [Material Symbols](https://fonts.google.com/icons) | Apache 2.0 |

---

## 0. D'on surt cada dada

Tot el que ensenya el mapa té una font, i la fitxa on surt la cita amb un enllaç.

| Què es veu | D'on surt | On es cita |
| --- | --- | --- |
| Les fronteres i les capitals | CShapes 2.0 (§1) | A la fitxa de cada estat |
| El nom de cada estat en cada època | L'article de la Viquipèdia sobre l'estat amb aquell nom (`wiki` a `content/countries.yaml`) | A la fitxa de l'estat |
| Les dates de les banderes | Els articles de la Viquipèdia sobre les banderes de cada estat (`sources` a `content/flags.yaml`) | A la fitxa de l'estat |
| Les imatges de les banderes | Wikimedia Commons (§2, `public/flags/credits.json`) | Sota cada bandera |
| Les zones ocupades i annexionades (1938-1945) | Fronteres de CShapes d'altres dates, divisions d'avui de Natural Earth i línies dibuixades a mà (§1.3); les dates, de l'article de la Viquipèdia de cada zona (`content/occupations/`) | A la fitxa de cada zona |
| Els textos de les banderes, els fets, els conflictes i les ocupacions | Escrits per aquest projecte a partir de les fonts que citen (§3) | A la fitxa de cada un |
| Els títols de la Viquipèdia en català i castellà | Els enllaços entre idiomes de la mateixa Viquipèdia (`content/wikipedia.json`) | — |
| La traducció dels noms dels estats i de les capitals | Aquest projecte | — |

**Com es comprova.** `npm run data:sources` mira que cada article citat existeixi a la Viquipèdia
i que cada enllaç extern respongui. El workflow «Fonts» el corre quan canvia el contingut i cada
dilluns, i falla si en troba un de trencat. Els tests, per la seva banda, no deixen entrar cap fet,
cap conflicte, cap ocupació, cap nom d'estat ni cap bandera sense font.

---

## 1. Les fronteres: CShapes 2.0

[CShapes 2.0](https://icr.ethz.ch/data/cshapes/) dibuixa les fronteres dels estats independents i
dels territoris que en depenien (colònies, protectorats, mandats, territoris ocupats) del 1886 al
2019, amb el dia exacte de cada canvi.

> Schvitz, G., Girardin, L., Rüegger, S., Weidmann, N. B., Cederman, L.-E., i Gleditsch, K. S.
> (2022). Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. _Journal of
> Conflict Resolution_, 66(1), 144–161.

- **Llicència**: CC BY-NC-SA 4.0. Els fitxers de `public/data/` en són una obra derivada amb la
  mateixa llicència: es poden compartir i adaptar citant-ne l'origen, **però no amb finalitat
  comercial**.
- **Edició**: la de Gleditsch i Ward que porta el [paquet `cshapes` d'R](https://github.com/cran/cshapes)
  (`cshapes_2_gw.topojson`).
- **Què se'n fa** (`npm run data:borders`): es queda el que val del 1900 ençà, es retalla a
  `[-28°, 30°, 78°, 82°]`, se simplifica fins al 12 % dels vèrtexs, les dates passen a enters i es
  calculen els colors i on va cada nom.

Els estats s'identifiquen amb els **codis de Gleditsch i Ward** (`gwcode`), els mateixos de
CShapes i de bona part de la ciència política (les dades de conflictes de l'UCDP, per exemple). Els
fets, els conflictes, els noms i les banderes hi fan referència amb aquests codis. Els noms dels
estats i de les capitals de CShapes són en anglès; els de l'app surten de `content/countries.yaml`
i `content/capitals.yaml`, en els tres idiomes.

### 1.1 On ens en separem

| Què | Per què |
| --- | --- |
| Crimea segueix a Ucraïna després del 18 de març del 2014 | CShapes la passa a Rússia. Aquí es dibuixa la frontera reconeguda internacionalment, com fan la resolució 68/262 de l'Assemblea General de l'ONU i la majoria d'atles. L'annexió s'explica com a fet, i anirà a la capa d'ocupacions. |

Cada correcció és codi, a la llista `CORRECTIONS` de `scripts/build-borders.mjs`, i té la seva fila
aquí. Els fitxers generats no es toquen mai a mà.

### 1.2 On fallen

- **Fronteres de tractat, no d'ocupació.** CShapes recull els canvis pactats —l'acord de Munic, el
  primer arbitratge de Viena (1938), les annexions soviètiques del 1940— però no el territori pres
  per la força, ni el segon arbitratge de Viena (1940), que va donar el nord de Transsilvània a
  Hongria. Entre el 1938 i el 1945, Àustria, Bohèmia-Moràvia i Polònia hi segueixen sortint. Ho
  explica la capa d'ocupacions (§1.3), que encara no és sencera.
- **Dàntzig** surt dins d'Alemanya des del 30 de setembre del 1938. Va ser ciutat lliure fins a
  l'1 de setembre del 1939, quan el Reich se la va annexionar.
- **Sense microestats.** Andorra, Liechtenstein, Mònaco, San Marino i el Vaticà no són a CShapes.
- **Criteris de sobirania.** Algunes decisions són de la llista de Gleditsch i Ward: Montenegro és
  part de Iugoslàvia del 1918 al 2006, i l'Alemanya Occidental comença el 1945, amb les zones
  d'ocupació aliades.
- **S'acaba el 2019.** Es dona per fet que cap frontera reconeguda d'Europa ha canviat després;
  si en canvia alguna, s'afegirà a mà.
- **Geometria simplificada.** Per veure el continent n'hi ha prou; per mesurar distàncies o
  superfícies, no.

### 1.3 La capa d'ocupacions

El que es controlava de fet entre el 1938 i el 1945 va en una capa a part, ratllada i que es pot
amagar. Cada zona té un fitxer a `content/occupations/`, amb el text, les dates, qui la controlava
i la font, i una forma que fa `npm run data:occupations` (`scripts/build-occupations.mjs`).

**Les dates.** Una zona comença el dia que l'ocupant en pren el control —la capitulació,
l'armistici, l'annexió o la presa de la capital— i s'acaba el dia que el perd: la retirada, la
capitulació o l'alliberament de la capital. Mentre es lluitava, el que surt al mapa és el
conflicte, no la zona; els fronts no s'hi dibuixen.

**La forma** es fa amb peces que ja existeixen, perquè les vores coincideixin amb les del mapa:

| D'on | Per a què | Exemple |
| --- | --- | --- |
| Un estat de CShapes, de la mateixa època o d'una altra | La majoria de les zones | Àustria és l'Àustria del 1938; Bohèmia i Moràvia, la Txecoslovàquia del 1939 dins de la Txèquia d'avui |
| Les divisions administratives d'avui, de [Natural Earth](https://www.naturalearthdata.com/) (domini públic) | Les vores que seguien una divisió que encara existeix | Alsàcia i Mosel·la són tres departaments; la zona italiana de França, vuit |
| Línies dibuixades a mà (`LINES` a l'script), amb la font al costat | On no hi ha res més | La partició de Polònia, la línia de demarcació francesa, Memel, Zaolzie |

Les línies dibuixades a mà són **aproximades**, amb un error d'uns 10-20 km; les divisions d'avui,
tant com s'hagin mogut des d'aleshores. La fitxa de cada zona ho diu.

**Què hi ha.** L'expansió alemanya del 1938-1939 (Àustria, Bohèmia i Moràvia, l'Estat Eslovac,
Memel), Zaolzie i la Rutènia hongaresa; la partició de Polònia, també l'est ocupat per Alemanya
del 1941 al 1944; Albània; l'ocupació de Dinamarca, Noruega, els Països Baixos, Bèlgica i
Luxemburg, i la de França: la zona ocupada, la de Vichy, Alsàcia i Mosel·la, les zones del 1942 i
Còrsega.

**Què hi falta**, i és la feina que ve:

- **Iugoslàvia i Grècia**, repartides el 1941 entre Alemanya, Itàlia, Hongria i Bulgària.
- **El nord de Transsilvània**, hongarès del 1940 al 1944, i les annexions búlgares.
- **El front de l'Est**: els països bàltics, Bielorússia, Ucraïna i Rússia ocupats del 1941 al
  1944, i Transnístria. Les zones depenien del front, i aniran amb la capa dels fronts.
- **Itàlia del 1943 al 1945**: la República Social Italiana i les zones que Alemanya es va
  annexionar de fet.
- Els territoris petits: les illes del Canal i Eupen-Malmedy.

---

## 2. Les banderes: Wikimedia Commons

La cronologia —quina bandera feia servir cada estat i fins quan— és d'aquest projecte i viu a
`content/flags.yaml`. Les imatges són de [Wikimedia Commons](https://commons.wikimedia.org/): les
baixa `npm run data:flags`, o el workflow «Flags» de GitHub cada cop que el fitxer canvia.

- **Imatges lleugeres.** Es baixa el PNG de 330 px que renderitza Wikimedia, no l'SVG original:
  n'hi ha que passen del mega pels escuts detallats, i al mapa una bandera fa 14 px d'alçada. Les
  cent banderes fan menys d'un mega.
- **Llicències.** Quasi totes són de domini públic: una bandera no sol tenir drets d'autor, o ja
  han caducat. Alguns dibuixos d'escuts són CC BY-SA, i llavors l'app en cita l'autor sota la
  bandera. Totes queden apuntades a `public/flags/credits.json`.
- **Dates.** Les de l'adopció oficial, o la del primer ús si va ser abans.
- **Simplificacions**, marcades amb un comentari al YAML: falten algunes variants de poca durada
  (Albània del 1914 al 1946, Bulgària del 1946 al 1948 i del 1967 al 1971, Hongria del 1918 al
  1919 i del 1956 al 1957, el lleó vermell de Finlàndia del 1917 al 1918). Les colònies, els
  protectorats i els mandats encara no en porten cap. L'Alemanya ocupada (1945-1949) surt sense
  bandera pròpia, perquè no en tenia.
- **Les banderes de règims com el nazi o el soviètic** s'ensenyen en el seu context històric i
  amb finalitat educativa.

## 3. Els textos

Els fets i els conflictes de `content/` els escriuen els qui hi contribueixen, amb llicència
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Tot el que s'hi diu s'ha de poder
comprovar: cada entrada enllaça com a mínim una font (la Viquipèdia val per començar). Una font que no és
la Viquipèdia va a `sources`, amb el títol, qui la publica i l'enllaç (la resolució de l'ONU sobre
Crimea, per exemple). Com s'escriuen els textos és a [CONTRIBUTING.md](CONTRIBUTING.md).
