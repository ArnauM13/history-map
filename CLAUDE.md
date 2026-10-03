# Mapa històric d'Europa — convencions

Què és el projecte i per què, al [README.md](README.md). Aquí hi ha com està fet i com s'hi
treballa, per a persones i per a agents.

## Idioma

- **Tot en català**: la documentació, els comentaris del codi, els noms dels tests i els missatges
  de commit. La interfície i el contingut, en català, castellà i anglès.
- **Els comentaris expliquen el perquè**, no el què. Si un comentari diu el mateix que el codi,
  sobra. El bo explica una decisió amb el cas que la va fer necessària («sense el marc, les
  banderes blanques es perden sobre el mapa clar»).
- **Res de frases fetes.** Ni «millores diverses», ni «robust», ni «potent». Si no se sap dir què
  canvia, encara no està fet.

## Com està fet

Una web estàtica: React 19, TypeScript, Vite i MapLibre GL. Sense servidor, sense base de dades.
El contingut va dins del JavaScript; les fronteres i les banderes, com a fitxers.

```
content/
  countries.yaml        el nom de cada estat segons la data
  flags.yaml            les banderes de cada estat segons la data, i què volen dir
  events/*.yaml         un fitxer per fet       (l'id és el nom del fitxer)
  conflicts/*.yaml      un fitxer per conflicte
public/
  data/                 les fronteres, generades (no es toquen a mà)
  flags/                les banderes en PNG i credits.json, baixades (no es toquen a mà)
  fonts/                les lletres de les etiquetes del mapa
scripts/
  build-borders.mjs     CShapes 2.0 → public/data
  fetch-flags.mjs       Wikimedia Commons → public/flags
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

S'identifiquen amb el **codi de Gleditsch i Ward** (`gwcode`), el de CShapes. Els noms, les
banderes, els fets i els conflictes hi fan referència. Un mateix codi pot tenir noms i banderes
diferents al llarg del temps (365: Imperi Rus, Rússia soviètica, Unió Soviètica, Rússia).

### Decisions

- **El contingut s'empaqueta; les dades es baixen.** El contingut és petit i s'ha de validar en
  compilar; les fronteres pesen més i el navegador les guarda a part.
- **Els colors del mapa es calculen en generar les dades**, no a l'app: dos estats veïns no
  comparteixen mai color, i un estat el manté tota la vida. Les colònies porten el de qui les
  governa, més clar.
- **Les correccions a CShapes són codi** (`CORRECTIONS` a `build-borders.mjs`) i tenen una fila a
  [DADES.md](DADES.md). Els fitxers generats no es toquen mai a mà.
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

## Commits

En català, i el títol diu **on** i **què**: `Banderes: la línia temporal marca quan canvien`. El
cos explica el perquè i el que hi havia abans, en prosa. El que es fa de passada, a sota, en una
llista que comença amb «De pas:».
