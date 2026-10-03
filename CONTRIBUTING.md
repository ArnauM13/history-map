# Com s'hi contribueix

**Català** · [Castellano](CONTRIBUTING.es.md) · [English](CONTRIBUTING.en.md)

Gràcies per voler-hi posar les mans. Hi ha tres maneres d'ajudar:

1. **Contingut**: fets, conflictes, noms d'estats i banderes. No cal programar.
2. **Dades**: arreglar una frontera o dibuixar la capa d'ocupacions (vegeu el
   [full de ruta](FULL-DE-RUTA.md), §3).
3. **Codi**: funcionalitats, disseny, accessibilitat.

Si no saps per on començar, mira els *issues* amb l'etiqueta `content`, o obre'n un i en parlem.

## Posar-lo en marxa

```bash
git clone https://github.com/ArnauM13/history-map.git
cd history-map
npm install
npm run dev
```

Abans d'obrir una *pull request*:

```bash
npm run lint && npm run typecheck && npm test && npm run format
```

## Afegir un fet

Un fitxer nou a `content/events/`, amb el nom `AAAA-MM-DD-nom-curt.yaml`. El nom del fitxer és el
seu identificador.

```yaml
date: 1919-06-28 # AAAA-MM-DD, calendari gregorià
category: treaty # war | treaty | revolution | independence | political | integration | crisis
location: [2.120, 48.805] # [longitud, latitud]; opcional, posa una marca al mapa
countries: [255, 220, 200] # els estats que hi surten, amb el codi de content/countries.yaml
title:
  ca: Tractat de Versalles
  es: Tratado de Versalles
  en: Treaty of Versailles
summary:
  ca: >-
    Dues o tres frases: què va passar i per què importa.
  es: >-
    …
  en: >-
    …
wikipedia: # el títol de l'article en anglès; el català i el castellà els afegeix el workflow
  en: Treaty of Versailles
```

N'hi ha prou amb el títol de l'article de la Viquipèdia anglesa: quan el canvi arriba a GitHub, el
workflow «Wikipedia» busca l'article en català i en castellà i n'hi afegeix el títol. En local,
`npm run data:wikipedia` fa el mateix.

## Afegir un conflicte

Un fitxer a `content/conflicts/nom-curt.yaml`. Els mateixos camps que un fet, menys la data:

```yaml
start: 1936-07-17
end: 1939-04-01 # sense `end`, el conflicte és obert
category: civil-war # world-war | interstate | civil-war | independence | uprising
location: [-3.7, 40.4] # obligatori: un punt del front principal
```

## Banderes

`content/flags.yaml` té tres parts:

```yaml
catalogue: # identificador → nom del fitxer a Wikimedia Commons
  es-1931: Flag of Spain (1931–1939).svg

about: # opcional: què vol dir i per què va arribar, en dues o tres frases
  es-1931:
    ca: >-
      La Segona República va canviar la franja vermella de baix per una de morada…

states: # codi de l'estat → les seves banderes, per ordre
  "230":
    - { until: 1931-04-13, flag: es-1785 } # until = l'últim dia que es va fer servir
    - { until: 1939-03-31, flag: es-1931 }
    - { flag: es } # l'última no porta until
```

- El nom del fitxer, exactament com surt a la pàgina de la bandera a Wikimedia Commons (el que va
  després de `File:`).
- `flag: null` vol dir que l'estat no en tenia de pròpia aquells anys; una entrada sense `flag`,
  que encara no està documentada.
- No cal baixar res: quan el canvi arriba a GitHub, el workflow «Flags» baixa les imatges a
  `public/flags/` i en fa un commit. En local, `npm run data:flags` fa el mateix.
- A la *pull request*, digues d'on surten les dates.

## Noms d'estats i de capitals

`content/countries.yaml` dona el nom de cada estat al llarg del temps. Si un estat surt amb un nom
que no li tocava en aquella data, és aquí. Les capitals vénen de CShapes en anglès i es tradueixen
a `content/capitals.yaml`. El codi d'un estat és a `public/data/labels.geojson` (`gwcode`).

## Com s'escriu

- **Neutral.** Explica què va passar; si alguna cosa està en disputa, digues qui la disputa.
- **Curt.** Dues o tres frases. El detall, a les fonts.
- **Comprovable.** Tot el que dius ha de ser a les fonts que enllaces.
- **Amb les teves paraules.** No copiïs d'altres llocs: els textos es publiquen amb CC BY-SA 4.0.
- **En els tres idiomes, si pots.** Amb un n'hi ha prou: el que falti es llegirà en un altre, i
  algú altre ho traduirà.

## Fronteres

`public/data/` no es toca a mà: el fa `npm run data:borders`. Una correcció a CShapes va a la
llista `CORRECTIONS` de `scripts/build-borders.mjs`, amb la seva fila i la font a
[DADES.md](DADES.md).

## Codi

Les convencions són a [CLAUDE.md](CLAUDE.md) i el disseny, a [DESIGN.md](DESIGN.md). En resum:
comentaris i commits en català, textos de la interfície als tres idiomes, cap color fora dels
tokens, i tot comprovat al navegador abans de pujar-ho.

## Les *pull requests*

- Una cosa per *pull request*; explica què canvia i com ho has comprovat.
- Si és contingut, les fonts, si no són ja al fitxer.
- En contribuir-hi, acceptes que el codi es publiqui amb llicència MIT i els textos amb CC BY-SA
  4.0.
