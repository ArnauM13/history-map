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
 *   3. Passa les dates a enters AAAAMMDD (s, e), perquè MapLibre hi pugui filtrar.
 *   4. Aplica les correccions de CORRECTIONS (explicades a DADES.md).
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
import polylabel from 'polylabel'
import * as topojson from 'topojson-client'
import { parse } from 'yaml'

const SOURCE_URL =
  'https://github.com/cran/cshapes/raw/master/inst/extdata/cshapes_2_gw.topojson.xz'
const RAW_DIR = 'data-raw'
const RAW_FILE = `${RAW_DIR}/cshapes_2_gw.topojson`
const OUT_DIR = 'public/data'
const OCCUPATIONS_DIR = 'content/occupations'
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
 * On ens separem de CShapes 2.0, a consciència i explicat a DADES.md. El control de fet d'un
 * territori anirà en una capa a part (FULL-DE-RUTA.md), no barrejat amb les fronteres.
 */
const CORRECTIONS = [
  {
    description:
      "Crimea: la frontera reconeguda entre Rússia i Ucraïna, també després de l'annexió del 2014 (resolució 68/262 de l'ONU)",
    codes: ['365', '369'],
    dropFeaturesStarting: 20140318,
    extendFeaturesEnding: 20140317,
  },
]

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

async function processWithMapshaper(raw, bbox) {
  const commands = [
    '-i input.topojson name=borders',
    `-clip bbox=${bbox.join(',')} remove-slivers`,
    `-simplify ${SIMPLIFY} keep-shapes`,
    // El codi va en text: les entitats d'abans del 1886 (build-history.mjs) en porten un de Wikidata.
    `-each 's = +start.replace(/-/g, ""), e = end === "${DATASET_END}" ? ${OPEN_END} : +end.replace(/-/g, ""), code = String(gwcode)'`,
    '-filter-fields code,country_name,status,owner,s,e,capname',
    '-o output.json format=topojson quantization=100000',
  ].join(' ')
  const output = await mapshaper.applyCommands(commands, { 'input.topojson': raw })
  const topo = JSON.parse(output['output.json'])
  applyCorrections(topo)
  return topo
}

function applyCorrections(topo) {
  const collection = topo.objects.borders
  for (const fix of CORRECTIONS) {
    const affected = (g) => fix.codes.includes(g.properties.code)
    collection.geometries = collection.geometries.filter(
      (g) => !(affected(g) && g.properties.s === fix.dropFeaturesStarting),
    )
    for (const g of collection.geometries) {
      if (affected(g) && g.properties.e === fix.extendFeaturesEnding) g.properties.e = OPEN_END
    }
  }
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
