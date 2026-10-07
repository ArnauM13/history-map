#!/usr/bin/env node
/**
 * Fa les fronteres de l'app a partir de CShapes 2.0.
 *
 *   npm run data:borders
 *
 * Passos:
 *   1. Baixa CShapes 2.0 (l'edició de Gleditsch i Ward) en TopoJSON, si no és a data-raw/.
 *   2. Ho retalla a Europa i ho simplifica (mapshaper). Ho agafa tot: CShapes comença el 1886, i
 *      el mapa també (FIRST_YEAR a src/lib/date.ts).
 *   3. Aplica les correccions de CORRECTIONS (explicades a DADES.md §1.1) a les peces ja
 *      simplificades, perquè les línies dibuixades a mà no perdin detall i les vores noves
 *      comparteixin els vèrtexs amb les dels veïns.
 *   4. Passa les dates a enters AAAAMMDD (s, e), perquè MapLibre hi pugui filtrar.
 *   5. Dona un color a cada grup (un estat i els territoris que controla) de manera que dos grups
 *      veïns que coincideixen en el temps no tinguin mai el mateix, que els colors es reparteixin
 *      i que una zona ocupada (content/occupations/) es distingeixi de l'estat ocupat.
 *   6. Calcula on va el nom de cada peça: el pol d'inaccessibilitat del seu polígon més gran.
 *
 * Deixa (al repo; la llicència és a public/data/README.md):
 *   public/data/borders.topo.json
 *   public/data/labels.geojson
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import mapshaper from 'mapshaper'
import polygonClipping from 'polygon-clipping'
import polylabel from 'polylabel'
import * as topojson from 'topojson-client'
import { parse } from 'yaml'

const SOURCE_URL =
  'https://github.com/cran/cshapes/raw/master/inst/extdata/cshapes_2_gw.topojson.xz'
const RAW_DIR = 'data-raw'
const RAW_FILE = `${RAW_DIR}/cshapes_2_gw.topojson`
const OUT_DIR = 'public/data'
const OCCUPATIONS_DIR = 'content/occupations'
const HISTORY_DIR = 'public/data/history'
/**
 * Quants colors té la paleta del mapa (PALETTE a src/map/style.ts). L'acolorit els fa servir
 * tots, repartits; si un grup té tants veïns que no n'hi ha prou, en fa servir un de més i
 * l'script avisa.
 */
const PALETTE_SIZE = 12

/** L'últim dia de CShapes 2.0. El que s'acaba aquell dia és que encara val avui. */
const DATASET_END = '2019-12-31'
const OPEN_END = 99991231
/** [oest, sud, est, nord]: Europa i el voltant, perquè no es vegi on s'acaba el mapa. */
const BBOX = [-28, 30, 78, 82]
/** Els noms van dins d'aquesta àrea més petita: el de Rússia, a la part europea, que és la que es veu. */
const LABEL_BBOX = [-25, 30, 56, 74]
const SIMPLIFY = '12%'
/**
 * Els territoris petits que se simplifiquen menys: amb el 12 %, la Franja de Gaza quedava en un
 * triangle que deixava la ciutat de Gaza a Israel.
 */
const DETAILED = ['6511', '6631']
const DETAILED_SIMPLIFY = '100%'

// ── Les correccions ──────────────────────────────────────────────────────────

/**
 * Les vores que CShapes no té, dibuixades a mà. Cada una és un polígon que tanca un territori; només
 * en compta el tros que cau dins de l'estat que es retalla, i la resta va per mar o per fora. Els
 * punts són [longitud, latitud] de les poblacions i els cims per on passava, amb un error d'uns
 * 2-5 km; d'on surt cada traçat, al comentari.
 */
const LINES = {
  /**
   * La frontera de Rapallo (12 de novembre del 1920) entre Itàlia i Iugoslàvia: de Peč, on
   * tocava Àustria, per Triglav, a l'est d'Idrija i de Postojna (Rakek, l'estació de frontera,
   * era iugoslava), fins a Snežnik i el golf de Kvarner a l'oest de Rijeka. Kastav era iugoslava.
   * Tanca l'Ístria per mar, entre la costa i Cres. Fonts: l'article i el mapa de «Treaty of
   * Rapallo (1920)».
   */
  rapallo: [
    [13.0, 46.7],
    [13.715, 46.523],
    [13.7, 46.49],
    [13.655, 46.44],
    [13.68, 46.41],
    [13.837, 46.378],
    [13.93, 46.25],
    [14.0, 46.17],
    [14.06, 46.08],
    [14.1, 46.0],
    [14.18, 45.92],
    [14.27, 45.83],
    [14.32, 45.73],
    [14.44, 45.59],
    [14.43, 45.5],
    [14.38, 45.43],
    // Entre Matulji, italiana, i Kastav; i l'Estat Lliure de Fiume, fins al Rječina.
    [14.325, 45.385],
    [14.335, 45.36],
    [14.37, 45.362],
    [14.4, 45.37],
    [14.43, 45.375],
    [14.447, 45.36],
    [14.447, 45.3],
    [14.35, 45.25],
    [14.26, 45.16],
    [14.2, 44.95],
    [14.0, 44.6],
    [13.0, 44.6],
  ],
  /**
   * L'Estat Lliure de Fiume: el corpus separatum, a l'oest del Rječina (Sušak, a l'altra riba,
   * era iugoslau), i la franja de costa que el lligava amb l'Ístria italiana, al sud de Kastav.
   * Fonts: «Free State of Fiume» i «Treaty of Rapallo (1920)», article 4.
   */
  fiume: [
    [14.33, 45.3],
    [14.335, 45.36],
    [14.37, 45.362],
    [14.4, 45.37],
    [14.43, 45.375],
    [14.447, 45.36],
    [14.447, 45.3],
  ],
  /**
   * El corpus separatum de Fiume, el terme de la ciutat abans de Rapallo: la ciutat, Kozala, Drenova
   * i Plase, uns 21 km². A l'oest s'acabava a Kantrida; la franja de costa fins a Preluka la hi va
   * afegir Rapallo. Fonts: «Corpus separatum (Fiume)» i el lot treball/lots/1919-fiume.md.
   */
  corpusSeparatum: [
    [14.39, 45.3],
    [14.39, 45.355],
    [14.4, 45.37],
    [14.43, 45.375],
    [14.447, 45.36],
    [14.447, 45.3],
  ],
  /**
   * La Dalmàcia que Itàlia va ocupar per l'armistici, fins a la línia del pacte de Londres (1915):
   * del límit de Dalmàcia amb la Lika, al Velebit, fins a la Dinara, i d'allà per la Svilaja fins
   * al cap Planka. Hi queden Zara, Benkovac, Obrovac, Knin, Drniš i Šibenik; Trogir i Split, no.
   * Fonts: «Governorate of Dalmatia» i «Treaty of London (1915)», article 5.
   */
  london: [
    [15.0, 44.6],
    [15.25, 44.4],
    [15.45, 44.32],
    [15.75, 44.25],
    [16.05, 44.2],
    [16.25, 44.12],
    [16.39, 44.06],
    [16.45, 43.93],
    [16.42, 43.8],
    [16.3, 43.68],
    [16.1, 43.56],
    [15.94, 43.49],
    [15.7, 43.4],
    [14.8, 44.0],
  ],
  /** Zara: la ciutat i el seu terme, uns 110 km², a la costa. Font: «Province of Zara». */
  zara: [
    [15.17, 44.13],
    [15.22, 44.17],
    [15.29, 44.15],
    [15.31, 44.1],
    [15.25, 44.07],
    [15.19, 44.09],
  ],
}

/**
 * On queden les illes que canvien de mans, [oest, sud, est, nord]: una illa hi va sencera si hi
 * cap sencera. Cres i Lošinj eren italianes; Krk, al costat, iugoslava. Lastovo i Palagruža, també
 * italianes, no són a CShapes.
 */
const ISLANDS = {
  cresLosinj: [14.2, 44.4, 14.56, 45.2],
  /** Sense Samos, Icària ni les Cíclades, que eren gregues. */
  dodecanese: [26.2, 35.3, 28.4, 37.45],
}

/** L'Estat Lliure de Fiume no és a CShapes: va pel QID de Wikidata, com les entitats d'abans del 1886. */
const FIUME_STATE = {
  gwcode: 'Q548114',
  country_name: 'Free State of Fiume',
  status: 'independent',
  owner: null,
  capname: 'Fiume',
}

/**
 * Fiume del 1918 al 1920, abans que Rapallo en fes l'Estat Lliure: governada pel Consiglio Nazionale,
 * i el mateix QID, perquè el nom va per dates (content/countries.yaml).
 */
const FIUME_COUNCIL = FIUME_STATE

/** La Regència Italiana del Carnaro de D'Annunzio, del 8 de setembre al 27 de desembre del 1920. */
const CARNARO = {
  gwcode: 'Q1423581',
  country_name: 'Italian Regency of Carnaro',
  status: 'independent',
  owner: null,
  capname: 'Fiume',
}

/**
 * El que Àustria-Hongria va deixar a Saint-Germain i Itàlia governava fins que Rapallo en fixés la
 * frontera: territori ocupat que no era de cap estat (DADES.md §0.1). Van pel QID de la regió i
 * del Governatorato della Dalmazia.
 */
const VENEZIA_GIULIA = {
  gwcode: 'Q958521',
  country_name: 'Julian March',
  status: 'occupied',
  owner: 'Q958521',
  capname: 'Trieste',
}
const OCCUPIED_DALMATIA = {
  gwcode: 'Q2552789',
  country_name: 'Governorate of Dalmatia',
  status: 'occupied',
  owner: 'Q2552789',
  capname: 'Zara',
}

/**
 * Els territoris que es mouen, fets amb les peces de CShapes d'abans de corregir. Cada un rep
 * l'estat d'on surt; així les vores coincideixen amb les dels veïns.
 */
const AREAS = {
  danzig: (raw) => rawState(raw, '291', '1930-01-01'),
  fiume: (raw) => intersect(mainland(rawState(raw, '345', '1930-01-01')), ring(LINES.fiume)),
  corpusSeparatum: (raw) =>
    intersect(mainland(rawState(raw, '345', '1930-01-01')), ring(LINES.corpusSeparatum)),
  rapallo: (raw) => {
    const yugoslavia = rawState(raw, '345', '1930-01-01')
    return union(
      minus(intersect(mainland(yugoslavia), ring(LINES.rapallo)), ring(LINES.fiume)),
      intersect(mainland(yugoslavia), ring(LINES.zara)),
      islandsIn(yugoslavia, ISLANDS.cresLosinj),
    )
  },
  // Zara va amb la Dalmàcia, on la governava el Governatorato.
  veneziaGiulia: (raw) => {
    const yugoslavia = rawState(raw, '345', '1930-01-01')
    return union(
      minus(intersect(mainland(yugoslavia), ring(LINES.rapallo)), ring(LINES.fiume)),
      islandsIn(yugoslavia, ISLANDS.cresLosinj),
    )
  },
  dalmatia: (raw) => intersect(mainland(rawState(raw, '345', '1930-01-01')), ring(LINES.london)),
  dodecanese: (raw) => islandsIn(rawState(raw, '350', '1930-01-01'), ISLANDS.dodecanese),
}

/**
 * On ens separem de CShapes 2.0, a consciència i explicat a DADES.md §1.1. El control de fet d'un
 * territori va en una capa a part (content/occupations/), no barrejat amb les fronteres. Les dates
 * segueixen el criteri de DADES.md §0.1: una cessió, el dia que es va signar el tractat; una
 * annexió, el dia del decret.
 *
 *   - `drop`: treu les peces d'uns estats que comencen un dia.
 *   - `extend`: allarga fins a `to` les peces d'uns estats que s'acaben el dia `end`.
 *   - `transfer`: entre `start` i `end`, un territori (AREAS) passa de `from` a `to`, que és un
 *     codi o, si l'estat no és a CShapes, les seves propietats. Sense `to`, només surt de `from`.
 *   - `continue`: les peces d'uns estats que s'acaben el dia abans de `start` continuen fins avui,
 *     amb la mateixa forma i aquest `status`, i sense dependre de ningú: un territori ocupat que
 *     no és de cap altre estat.
 */
const CORRECTIONS = [
  {
    description:
      "Crimea: la frontera reconeguda entre Rússia i Ucraïna, també després de l'annexió del 2014 (resolució 68/262 de l'ONU)",
    drop: { codes: ['365', '369'], start: '2014-03-18' },
    extend: { codes: ['365', '369'], end: '2014-03-17', to: DATASET_END },
  },
  {
    // CShapes hi suma Cisjordània, Gaza, el Golan i el Sinaí, que Israel va ocupar a la guerra dels
    // Sis Dies, i no torna el Sinaí a Egipte fins al 1979. Les formes d'abans i de després
    // coincideixen: n'hi ha prou d'allargar les del 1967.
    description:
      "Israel, després del 1967: la línia de l'armistici del 1949 (la Línia Verda); el Golan, sirià, i el Sinaí, egipci (resolució 242 de l'ONU)",
    drop: { codes: ['666', '651', '652'], start: '1967-06-10' },
    extend: { codes: ['666', '651', '652'], end: '1967-06-09', to: DATASET_END },
  },
  {
    description: 'Israel i Egipte, sense la peça del 1979: ja ve allargada de la del 1967',
    drop: { codes: ['666', '651'], start: '1979-05-26' },
  },
  {
    description:
      "Cisjordània i Gaza, després del 1967: territori palestí ocupat, no part d'Israel (resolucions 242 i 2334 de l'ONU; Tribunal Internacional de Justícia, 2004 i 2024)",
    continue: { codes: ['6511', '6631'], start: '1967-06-10', status: 'occupied' },
  },
  {
    // CShapes l'acaba el 31 d'agost del 1938, un any abans, i del 30 de setembre la posa dins
    // d'Alemanya: durant un mes no era de ningú.
    description:
      "Dàntzig: Ciutat Lliure fins que el Reich se l'annexiona, l'1 de setembre del 1939",
    extend: { codes: ['291'], end: '1938-08-31', to: '1939-08-31' },
    transfer: { area: 'danzig', from: '255', start: '1938-09-30', end: '1939-08-31' },
  },
  // CShapes fa iugoslau, de Saint-Germain a Rapallo, el que Itàlia governava i ningú no tenia
  // encara: Àustria hi havia renunciat i la frontera no es va fixar fins a Rapallo. Trieste i
  // Gorízia, que cap proposta no donava al Regne SCS, ja les fa italianes des de Saint-Germain.
  {
    description:
      'La Venezia Giulia, de Saint-Germain a Rapallo: territori ocupat per Itàlia, que no era de cap estat',
    transfer: {
      area: 'veneziaGiulia',
      from: '345',
      to: VENEZIA_GIULIA,
      start: '1919-09-10',
      end: '1920-11-11',
    },
  },
  {
    description:
      'La Dalmàcia de la línia de Londres, de Saint-Germain a Rapallo: territori ocupat per Itàlia, que no era de cap estat',
    transfer: {
      area: 'dalmatia',
      from: '345',
      to: OCCUPIED_DALMATIA,
      start: '1919-09-10',
      end: '1920-11-11',
    },
  },
  {
    description:
      "Rapallo: l'Ístria, Gorízia, el Litoral eslovè amb Postojna, Zara, Cres i Lošinj, italians fins al tractat de París",
    transfer: { area: 'rapallo', from: '345', to: '325', start: '1920-11-12', end: '1947-02-09' },
  },
  // Fiume no va ser mai austríaca ni iugoslava, com la fa CShapes: hongaresa fins que el governador
  // se'n va anar, i des del 30 d'octubre del 1918 la governa el Consiglio Nazionale.
  {
    description: "Fiume, governada pel Consiglio Nazionale des del 30 d'octubre del 1918",
    transfer: {
      area: 'corpusSeparatum',
      from: '300',
      to: FIUME_COUNCIL,
      start: '1918-10-30',
      end: '1918-11-02',
    },
  },
  {
    description: 'Fiume, del Consiglio Nazionale, i no austríaca, fins a Saint-Germain',
    transfer: {
      area: 'corpusSeparatum',
      from: '305',
      to: FIUME_COUNCIL,
      start: '1918-11-03',
      end: '1919-09-09',
    },
  },
  {
    description: 'Fiume, del Consiglio Nazionale, i no iugoslava, fins a la Regència del Carnaro',
    transfer: {
      area: 'corpusSeparatum',
      from: '345',
      to: FIUME_COUNCIL,
      start: '1919-09-10',
      end: '1920-09-07',
    },
  },
  {
    description: 'La Regència Italiana del Carnaro, proclamada el 8 de setembre del 1920',
    transfer: {
      area: 'corpusSeparatum',
      from: '345',
      to: CARNARO,
      start: '1920-09-08',
      end: '1920-11-11',
    },
  },
  {
    // Rapallo crea l'Estat Lliure, però la Regència no l'accepta i governa fins que dimiteix. La
    // franja de costa que el tractat hi afegeix va amb Fiume, que només té aquell govern.
    description:
      'La Regència del Carnaro, que no accepta Rapallo, fins que dimiteix el 28 de desembre',
    transfer: { area: 'fiume', from: '345', to: CARNARO, start: '1920-11-12', end: '1920-12-27' },
  },
  {
    description:
      "L'Estat Lliure de Fiume, de la dimissió de D'Annunzio fins que Itàlia se l'annexiona",
    transfer: {
      area: 'fiume',
      from: '345',
      to: FIUME_STATE,
      start: '1920-12-28',
      end: '1924-02-21',
    },
  },
  {
    description: 'Fiume, italiana pel tractat de Roma (decret del 22 de febrer del 1924)',
    transfer: { area: 'fiume', from: '345', to: '325', start: '1924-02-22', end: '1947-02-09' },
  },
  {
    // CShapes els fa grecs des del 1913. Els governava Itàlia des del 1912, però eren otomans fins
    // que Turquia hi va renunciar a Lausana.
    description: 'El Dodecanès, otomà fins al tractat de Lausana',
    transfer: {
      area: 'dodecanese',
      from: '350',
      to: '640',
      start: '1913-05-30',
      end: '1923-07-23',
    },
  },
  {
    description: 'El Dodecanès, italià de Lausana al tractat de París',
    transfer: {
      area: 'dodecanese',
      from: '350',
      to: '325',
      start: '1923-07-24',
      end: '1947-02-09',
    },
  },
]

const ring = (points) => [[...points, points[0]]]
const union = (...geoms) => polygonClipping.union(...geoms.filter((g) => g.length > 0))
const intersect = (a, ...others) => polygonClipping.intersection(a, ...others)
const minus = (a, ...others) => polygonClipping.difference(a, ...others.filter((g) => g.length))
const coordsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)
/** El polígon més gran: el continent, sense les illes. */
const mainland = (geom) => [geom.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a))]
const islandsIn = (geom, [w, s, e, n]) =>
  geom.filter(([outer]) => outer.every(([x, y]) => x >= w && x <= e && y >= s && y <= n))

/** Un estat de CShapes en una data (AAAA-MM-DD), tal com ve, en un sol MultiPolygon. */
function rawState(features, code, date) {
  const found = features.filter(
    (f) => f.properties.gwcode === code && f.properties.start <= date && date <= f.properties.end,
  )
  if (found.length === 0) throw new Error(`CShapes no té l'estat ${code} el ${date}`)
  return union(...found.map((f) => coordsOf(f.geometry)))
}

const shiftDay = (date, days) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * 864e5).toISOString().slice(0, 10)

/**
 * Talla en el temps les peces d'un estat que coincideixen amb [start, end] i en canvia la forma
 * dins de l'interval; fora, la deixa com era. Si `change` no torna res, la peça no es toca.
 */
function reshape(features, code, start, end, change) {
  return features.flatMap((f) => {
    const p = f.properties
    if (p.gwcode !== code || p.end < start || p.start > end) return [f]
    const changed = change(coordsOf(f.geometry))
    if (!changed) return [f]
    const geometry = { type: 'MultiPolygon', coordinates: changed }
    const pieces = []
    if (p.start < start) pieces.push({ ...f, properties: { ...p, end: shiftDay(start, -1) } })
    if (geometry.coordinates.length > 0) {
      const s = p.start < start ? start : p.start
      const e = p.end > end ? end : p.end
      pieces.push({ type: 'Feature', properties: { ...p, start: s, end: e }, geometry })
    }
    if (p.end > end) pieces.push({ ...f, properties: { ...p, start: shiftDay(end, 1) } })
    return pieces
  })
}

/** CShapes, en GeoJSON i amb les correccions de CORRECTIONS. */
function correctedFeatures(simplified) {
  let features = simplified.features.filter((f) => f.geometry)
  // El codi va en text: les entitats que no són a CShapes en porten un de Wikidata.
  for (const f of features) f.properties.gwcode = String(f.properties.gwcode)
  const areas = Object.fromEntries(
    Object.entries(AREAS).map(([name, build]) => [name, build(features)]),
  )
  for (const fix of CORRECTIONS) {
    if (fix.drop) {
      const { codes, start } = fix.drop
      features = features.filter(
        (f) => !(codes.includes(f.properties.gwcode) && f.properties.start === start),
      )
    }
    if (fix.extend) {
      const { codes, end, to } = fix.extend
      for (const f of features) {
        if (codes.includes(f.properties.gwcode) && f.properties.end === end) f.properties.end = to
      }
    }
    if (fix.continue) {
      const { codes, start, status } = fix.continue
      const before = shiftDay(start, -1)
      for (const f of [...features]) {
        const p = f.properties
        if (codes.includes(p.gwcode) && p.end === before) {
          features.push({
            ...f,
            properties: { ...p, start, end: DATASET_END, status, owner: p.gwcode },
          })
        }
      }
    }
    if (fix.transfer) {
      const { area, from, to, start, end } = fix.transfer
      const territory = areas[area]
      // Només les peces on hi era: les altres no s'han de tallar en el temps.
      features = reshape(features, from, start, end, (geom) =>
        intersect(geom, territory).length > 0 ? minus(geom, territory) : undefined,
      )
      if (typeof to === 'string') {
        features = reshape(features, to, start, end, (geom) => union(geom, territory))
      } else if (to) {
        features.push({
          type: 'Feature',
          properties: { ...to, start, end },
          geometry: { type: 'MultiPolygon', coordinates: territory },
        })
      }
    }
  }
  return { type: 'FeatureCollection', features: mergeConsecutive(features) }
}

/**
 * Ajunta les peces seguides d'un estat que han quedat iguals: Iugoslàvia perd Fiume dues vegades
 * (el 1920, amb l'Estat Lliure, i el 1924, amb Itàlia) i no ha de canviar de peça entremig.
 */
function mergeConsecutive(features) {
  const key = (f) => {
    const { start: _start, end: _end, ...rest } = f.properties
    return JSON.stringify([rest, f.geometry.coordinates])
  }
  const sorted = [...features].sort((a, b) => (a.properties.start < b.properties.start ? -1 : 1))
  const out = []
  const last = new Map()
  for (const f of sorted) {
    const k = key(f)
    const previous = last.get(k)
    if (previous && shiftDay(previous.properties.end, 1) === f.properties.start) {
      previous.properties = { ...previous.properties, end: f.properties.end }
      continue
    }
    const copy = { ...f, properties: { ...f.properties } }
    last.set(k, copy)
    out.push(copy)
  }
  return out
}

async function ensureRawData() {
  if (existsSync(RAW_FILE)) return
  mkdirSync(RAW_DIR, { recursive: true })
  console.log(`Baixant ${SOURCE_URL}`)
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`No s'ha pogut baixar: HTTP ${res.status}`)
  writeFileSync(`${RAW_FILE}.xz`, Buffer.from(await res.arrayBuffer()))
  // Node no sap descomprimir xz; l'ordre `xz` sí, i és a Linux i a macOS.
  execFileSync('xz', ['--decompress', '--force', `${RAW_FILE}.xz`])
}

/**
 * Primer es retalla i se simplifica CShapes, i després s'hi apliquen les correccions. Al revés, la
 * simplificació se menjava els detalls de les línies dibuixades a mà: el centre de Fiume queia a
 * Iugoslàvia i Kastav a Itàlia, i la costa d'Opatija perdia un tros.
 */
async function processWithMapshaper(raw, bbox) {
  const simplify = [
    '-i input.topojson name=borders',
    `-clip bbox=${bbox.join(',')} remove-slivers`,
    `-simplify variable percentage='${JSON.stringify(DETAILED)}.includes(String(gwcode)) ? "${DETAILED_SIMPLIFY}" : "${SIMPLIFY}"' keep-shapes`,
    '-o output.json format=topojson no-quantization',
  ].join(' ')
  const simplified = JSON.parse(
    (await mapshaper.applyCommands(simplify, { 'input.topojson': raw }))['output.json'],
  )
  const corrected = correctedFeatures(topojson.feature(simplified, simplified.objects.borders))
  const commands = [
    '-i input.json name=borders',
    // El codi ja va en text (correctedFeatures), com el de les entitats d'abans del 1886.
    `-each 's = +start.replace(/-/g, ""), e = end === "${DATASET_END}" ? ${OPEN_END} : +end.replace(/-/g, ""), code = String(gwcode)'`,
    '-filter-fields code,country_name,status,owner,s,e,capname',
    '-o output.json format=topojson quantization=100000',
  ].join(' ')
  const output = await mapshaper.applyCommands(commands, { 'input.json': corrected })
  return JSON.parse(output['output.json'])
}

const overlaps = (a, b) => a.s <= b.e && b.s <= a.e

/** Un estat i els territoris que controla (colònies, protectorats…) fan un sol grup: el mateix color. */
const groupOf = (p) => (p.status === 'independent' || !p.owner ? p.code : p.owner)

/**
 * Les zones de content/occupations/ es pinten amb el color de l'ocupant: França ocupada, del de
 * l'Alemanya. Per això l'ocupant no pot compartir color amb l'estat ocupat (la zona no es
 * distingiria de la resta de França) i val més que no el comparteixi amb els veïns d'aquest.
 */
function readOccupations() {
  return readdirSync(OCCUPATIONS_DIR)
    .filter((name) => name.endsWith('.yaml'))
    .flatMap((name) => {
      const zone = parse(readFileSync(`${OCCUPATIONS_DIR}/${name}`, 'utf8'))
      const s = +zone.start.replace(/-/g, '')
      return zone.control.map((p) => ({
        by: String(p.by),
        countries: zone.countries.map(String),
        s,
        e: p.until ? +p.until.replace(/-/g, '') : OPEN_END,
      }))
    })
}

/**
 * Què costa cada mena de coincidència de color. Dos veïns no poden coincidir mai; la resta es
 * paga: l'ocupant i l'ocupat (o els veïns de l'ocupat), els veïns dels veïns i, per desempatar,
 * els colors que ja surten més. Sense els dos últims, l'acolorit voraç donava el primer color a
 * mig continent: el 1914, Alemanya, Noruega i els Països Baixos eren del mateix lila.
 */
const COST = { occupied: 1000, occupiedNeighbour: 100, near: 10 }

/**
 * Els estats que no són veïns a CShapes però sí abans del 1886, on build-history.mjs els pinta
 * amb el mateix color. Es llegeixen de les fronteres d'abans del 1886 que hi ha al repo: quan les
 * correccions d'Itàlia i Grècia van canviar l'acolorit, el Regne Unit i Grècia van sortir del
 * mateix color i les illes Jòniques (britàniques del 1815 al 1864) no es distingien de Grècia.
 * Només hi compten els codis de CShapes: les entitats amb QID tenen el color a part.
 */
function historicNeighbours() {
  if (!existsSync(HISTORY_DIR)) return []
  const pairs = []
  for (const name of readdirSync(HISTORY_DIR).filter((n) => n.endsWith('.topo.json'))) {
    const topo = JSON.parse(readFileSync(`${HISTORY_DIR}/${name}`, 'utf8'))
    const geoms = topo.objects.borders.geometries
    topojson.neighbors(geoms).forEach((list, i) => {
      const a = geoms[i].properties
      for (const j of list) {
        const b = geoms[j].properties
        if (groupOf(a) !== groupOf(b) && overlaps(a, b)) pairs.push([groupOf(a), groupOf(b)])
      }
    })
  }
  return pairs
}

function assignColours(topo, occupations) {
  const geoms = topo.objects.borders.geometries
  const neighbours = topojson.neighbors(geoms)
  const adjacency = new Map()
  geoms.forEach((g) => adjacency.set(groupOf(g.properties), new Set()))
  // Els grups de cada estat, amb les dates: un ocupant només paga pels veïns de l'època.
  const pieces = new Map()
  neighbours.forEach((list, i) => {
    const a = geoms[i].properties
    for (const j of list) {
      const b = geoms[j].properties
      if (groupOf(a) !== groupOf(b) && overlaps(a, b)) {
        adjacency.get(groupOf(a)).add(groupOf(b))
        adjacency.get(groupOf(b)).add(groupOf(a))
        const key = a.code
        if (!pieces.has(key)) pieces.set(key, [])
        pieces.get(key).push({ group: groupOf(b), s: Math.max(a.s, b.s), e: Math.min(a.e, b.e) })
      }
    }
  })

  for (const [a, b] of historicNeighbours()) {
    if (adjacency.has(a) && adjacency.has(b)) {
      adjacency.get(a).add(b)
      adjacency.get(b).add(a)
    }
  }

  // Les penalitzacions, en els dos sentits: el primer dels dos que tria color ja les paga.
  const penalties = new Map([...adjacency.keys()].map((g) => [g, new Map()]))
  const penalise = (a, b, cost) => {
    if (a === b || !penalties.has(a) || !penalties.has(b) || adjacency.get(a).has(b)) return
    for (const [x, y] of [
      [a, b],
      [b, a],
    ]) {
      penalties.get(x).set(y, Math.max(penalties.get(x).get(y) ?? 0, cost))
    }
  }
  for (const [group, direct] of adjacency) {
    for (const n of direct) for (const far of adjacency.get(n)) penalise(group, far, COST.near)
  }
  const groupOfCode = new Map(geoms.map((g) => [g.properties.code, groupOf(g.properties)]))
  for (const o of occupations) {
    const occupier = groupOfCode.get(o.by)
    for (const country of o.countries) {
      penalise(occupier, groupOfCode.get(country), COST.occupied)
      for (const n of pieces.get(country) ?? []) {
        if (overlaps(n, o)) penalise(occupier, n.group, COST.occupiedNeighbour)
      }
    }
  }

  // Voraç, començant pels grups amb més veïns, que són els que tenen menys opcions.
  const order = [...adjacency.keys()].sort((x, y) => adjacency.get(y).size - adjacency.get(x).size)
  const colour = new Map()
  const usage = []
  for (const group of order) {
    const forbidden = new Set([...adjacency.get(group)].map((n) => colour.get(n)))
    const cost = (c) => {
      let total = (usage[c] ?? 0) / order.length
      for (const [other, p] of penalties.get(group)) if (colour.get(other) === c) total += p
      return total
    }
    let best = -1
    for (let c = 0; c < PALETTE_SIZE || best < 0; c++) {
      if (!forbidden.has(c) && (best < 0 || cost(c) < cost(best))) best = c
    }
    colour.set(group, best)
    usage[best] = (usage[best] ?? 0) + 1
  }
  geoms.forEach((g, i) => {
    g.id = i
    g.properties.c = colour.get(groupOf(g.properties))
  })
  return Math.max(...colour.values()) + 1
}

const ringArea = (ring) => {
  let sum = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1])
  }
  return Math.abs(sum / 2)
}

function buildLabels(topo) {
  const { features } = topojson.feature(topo, topo.objects.borders)
  return {
    type: 'FeatureCollection',
    features: features
      .filter((f) => f.geometry)
      .map((f) => {
        const polygons =
          f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
        const largest = polygons.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a))
        const [x, y] = polylabel(largest, 0.05)
        const { code, country_name, status, owner, s, e, capname } = f.properties
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [+x.toFixed(3), +y.toFixed(3)] },
          // `rank`: si dos noms es trepitgen, guanya l'estat més gran (symbol-sort-key).
          properties: {
            code,
            country_name,
            status,
            owner,
            s,
            e,
            capname,
            rank: -Math.round(ringArea(largest[0])),
          },
        }
      }),
  }
}

await ensureRawData()
const raw = readFileSync(RAW_FILE, 'utf8')
const topo = await processWithMapshaper(raw, BBOX)
const colours = assignColours(topo, readOccupations())
const labels = buildLabels(await processWithMapshaper(raw, LABEL_BBOX))

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(`${OUT_DIR}/borders.topo.json`, JSON.stringify(topo))
writeFileSync(`${OUT_DIR}/labels.geojson`, JSON.stringify(labels))

if (colours > PALETTE_SIZE) {
  console.error(`✘ Calen ${colours} colors i la paleta en té ${PALETTE_SIZE}: afegeix-ne a PALETTE`)
  process.exit(1)
}
const codes = new Set(topo.objects.borders.geometries.map((g) => g.properties.code))
console.log(
  `✔ ${topo.objects.borders.geometries.length} peces de frontera, ${codes.size} estats i territoris, ${colours} colors, ${labels.features.length} noms`,
)
