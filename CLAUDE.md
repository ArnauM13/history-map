# Mapa històric d'Europa — convencions

Què és el projecte i per què, al [README.md](README.md). Aquí hi ha com està fet i com s'hi
treballa, per a persones i per a agents.

## Idioma

- **Tot en català**: la documentació, els comentaris del codi, els noms dels tests i els missatges
  de commit. La interfície i el contingut, en català, castellà i anglès.
- **El README, CONTRIBUTING i DADES, als tres idiomes** (`README.md`, `README.es.md`,
  `README.en.md`…): són el que llegeix qui arriba de fora. Si en canvies un, canvia'ls tots tres.
  La resta de documents, en català.
- **Els comentaris expliquen el perquè**, no el què. Si un comentari diu el mateix que el codi,
  sobra. El bo explica una decisió amb el cas que la va fer necessària («sense el marc, les
  banderes blanques es perden sobre el mapa clar»).
- **Res de frases fetes.** Ni «millores diverses», ni «robust», ni «potent». Si no se sap dir què
  canvia, encara no està fet.

## La fiabilitat, primer

El mapa vol ser **una referència**: el lloc on es pot anar a comprovar com era Europa un dia
concret, amb tota la informació que hi ha aquí i allà ajuntada i contrastada. Per això, davant de
qualsevol altra cosa (que es vegi bé, que sigui ràpid, que hi hagi més dades), mana que el que es
veu sigui cert, i com més exacte millor.

- **Les fronteres, tan realistes com es pugui.** Una font que dibuixa una cosa que no va passar
  (Moscou francesa dos anys, una revolta de set setmanes que dura tres) es corregeix, amb la data
  exacta i la font al costat. El que encara no està bé es diu a [DADES.md](DADES.md).
- **Quan dues fonts no coincideixen** —en una data, en un nom, en una frontera—, no se'n tria una a
  l'atzar ni es fa la mitjana: s'investiga **per què** discrepen, a la Viquipèdia (l'article i les
  fonts que cita) i a fonts fiables (el text dels tractats, historiografia de referència). D'aquí
  surt un **criteri**, que s'apunta a [DADES.md](DADES.md) §0.1 perquè valgui per a tots els casos
  iguals, no només per al que el va fer necessari.
- **La confusió també és informació.** Si la discrepància té importància històrica (una frontera
  en disputa, una data que cada historiografia posa diferent, una sobirania que depèn de qui la
  reconeixia), es documenta: a DADES, i a la fitxa o al fet si el lector l'ha de saber.
- **Cada correcció, comprovada sobre el mapa.** Abans de donar per bona una correcció, es mira el
  resultat: a quin estat cau cada capital any per any, que no hi hagi peces que se sobreposin ni
  forats, i com queda al navegador.

## Com està fet

Una web estàtica: React 19, TypeScript, Vite i MapLibre GL. Sense servidor, sense base de dades.
El contingut va dins del JavaScript; les fronteres i les banderes, com a fitxers.

```
content/
  countries.yaml        el nom de cada estat segons la data
  capitals.yaml         el nom de les capitals de CShapes, en els tres idiomes
  wikipedia.json        els títols en català i castellà dels articles citats (generat)
  flags.yaml            les banderes de cada estat segons la data, i què volen dir
  events/*.yaml         un fitxer per fet       (l'id és el nom del fitxer)
  conflicts/*.yaml      un fitxer per conflicte
  occupations/*.yaml    un fitxer per zona ocupada o annexionada: dates, qui la controlava, text
public/
  data/                 les fronteres i les zones ocupades, generades (no es toquen a mà)
  data/history/         les fronteres d'abans del 1886, un fitxer per segle (generades)
  flags/                les banderes en PNG i credits.json, baixades (no es toquen a mà)
  fonts/                les lletres de les etiquetes del mapa
scripts/
  build-borders.mjs     CShapes 2.0 → public/data
  build-history.mjs     Cliopatria → public/data/history, amb les correccions
  build-occupations.mjs les formes de les zones ocupades: CShapes, Natural Earth i línies a mà
  fetch-flags.mjs       Wikimedia Commons → public/flags
  check-sources.mjs     comprova les fonts i treu els títols de la Viquipèdia en català i castellà
src/
  App.tsx               l'estat: data, idioma, selecció, reproducció, adreça
  map/                  el mapa (MapView), el seu estil i les dades que baixa
  components/           la línia temporal, el panell, les banderes, les icones
  content/              llegir el YAML, l'esquema (zod) i les funcions per consultar-lo
  i18n/                 els textos de la interfície
  lib/date.ts           les dates
```

### El temps

Cada peça de frontera porta `s` i `e`, dos enters AAAAMMDD (les vigents avui, `e = 99991231`).
Ensenyar el mapa d'un dia és un filtre de MapLibre: `s <= dia <= e`. La interfície guarda la data
en text ISO (`1914-06-28`) i una precisió (dia, mes o any) que només canvia com s'escriu.

### Els estats

S'identifiquen amb el **codi de Gleditsch i Ward** (`code`, en text), el de CShapes. Els noms, les
banderes, els fets i els conflictes hi fan referència. Un mateix codi pot tenir noms i banderes
diferents al llarg del temps (365: Imperi Rus, Rússia soviètica, Unió Soviètica, Rússia).

El mapa principal comença el 1886. Abans, les fronteres són de Cliopatria
(`scripts/build-history.mjs`), d'any en any, en una secció a part i experimental (`?era=early`) i en
un fitxer per segle que l'app baixa quan cal; es retallen a la terra de CShapes del 1886, perquè
la costa sigui la mateixa; a l'Europa central del 1815 al 1870, d'OpenHistoricalMap,
amb el dia de cada canvi (DADES.md §1.5). Cada peça porta el QID de Wikidata de l'entitat (`qid`):
el codi és el de Gleditsch i Ward si continua un estat de CShapes (el Regne de França és el 220), i
el QID si no. El nom va pel QID, no pel codi: el 1700, el 220 és el Regne de França.

### Decisions

- **El contingut s'empaqueta; les dades es baixen.** El contingut és petit i s'ha de validar en
  compilar; les fronteres pesen més i el navegador les guarda a part.
- **Els colors del mapa es calculen en generar les dades**, no a l'app: dos estats veïns no
  comparteixen mai color, i un estat el manté tota la vida. Les colònies porten el de qui les
  governa, més clar.
- **Les correccions a CShapes són codi** (`CORRECTIONS` a `build-borders.mjs`) i tenen una fila a
  [DADES.md](DADES.md). Els fitxers generats no es toquen mai a mà. Les de Cliopatria, també
  (`CORRECTIONS` i `SHAPES` a `build-history.mjs`), sempre amb la data exacta: la mostra d'any en
  any no ho és, i el nom i el territori han de ser de qui eren, no de qui els ocupava.
- **Les ocupacions, a part de les fronteres.** CShapes dona les pactades; el control de fet va en
  una capa pròpia (`content/occupations/`), amb el color de l'ocupant. La forma de cada zona és
  codi (`ZONES` a `build-occupations.mjs`), feta de peces de CShapes sempre que es pot perquè les
  vores coincideixin; una línia dibuixada a mà porta la font al costat i surt com a aproximada.
- **Res sense font, i la font a la vista.** Cada fet, conflicte, nom d'estat i estat amb
  banderes cita d'on surt (els tests ho exigeixen), i la fitxa ho ensenya a «Fonts». La taula
  sencera és a [DADES.md](DADES.md) §0.
- **Els títols de la Viquipèdia no s'endevinen.** Es cita el títol anglès; el workflow «Fonts»
  comprova que l'article existeix i en desa el català i el castellà a `content/wikipedia.json`,
  a partir dels enllaços entre idiomes. També obre cada font externa, i cada dilluns ho torna a
  fer.
- **Les banderes es baixen a GitHub.** El workflow «Flags» corre `npm run data:flags` quan canvia
  `content/flags.yaml` i fa un commit amb les imatges. Si un nom de fitxer no és a Commons, el
  workflow falla i en suggereix de semblants.

## Textos de la interfície

- La clau, primer al català (`src/i18n/strings.ts`); sense la mateixa clau en castellà i en
  anglès, no compila.
- Frases senceres amb `{params}`, mai trossos enganxats: l'ordre de les paraules canvia d'un idioma
  a l'altre.
- Plurals amb `tn()`, mai `n === 1 ? … : …`.
- Els tests comproven els diccionaris: mateixes claus, cap text buit, mateixos `{params}`.

## Contingut

- Fets i conflictes: dues o tres frases, neutrals, comprovables, amb l'enllaç a la Viquipèdia.
- Les dates, al calendari gregorià (la Revolució d'Octubre és el 1917-11-07).
- Les coordenades, `[longitud, latitud]`.
- El que no se sap, no s'inventa: una bandera sense documentar va sense `flag`, i un buit és
  millor que una dada falsa.

## Disseny

El de Petja, explicat a [DESIGN.md](DESIGN.md). Cap color escrit en un component: tokens.

## Abans de pujar res

```bash
npm run lint && npm run format:check && npm run typecheck && npm test && npm run build
```

I mirar-ho al navegador: un canvi d'interfície no està fet fins que s'ha vist funcionar, també en
fosc i en una pantalla estreta.

## Branques

El prefix és el nom del repo, i després què s'hi fa: `history-map/ocupacions-1938-1945`. Res de
noms d'altres projectes ni de noms generats.

## Commits

En català, i el títol diu **on** i **què**: `Banderes: la línia temporal marca quan canvien`. El
cos explica el perquè i el que hi havia abans, en prosa. El que es fa de passada, a sota, en una
llista que comença amb «De pas:».
