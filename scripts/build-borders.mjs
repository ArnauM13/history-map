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
 *      veïns que coincideixen en el temps no tinguin mai el mateix.
 *   6. Calcula on va el nom de cada peça: el pol d'inaccessibilitat del seu polígon més gran.
 *
 * Deixa (al repo; la llicència és a public/data/README.md):
 *   public/data/borders.topo.json
 *   public/data/labels.geojson
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import mapshaper from 'mapshaper'
import polylabel from 'polylabel'
import * as topojson from 'topojson-client'

const SOURCE_URL =
  'https://github.com/cran/cshapes/raw/master/inst/extdata/cshapes_2_gw.topojson.xz'
const RAW_DIR = 'data-raw'
const RAW_FILE = `${RAW_DIR}/cshapes_2_gw.topojson`
const OUT_DIR = 'public/data'

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
    gwcodes: [365, 369],
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
    `-each 's = +start.replace(/-/g, ""), e = end === "${DATASET_END}" ? ${OPEN_END} : +end.replace(/-/g, "")'`,
    '-filter-fields gwcode,country_name,status,owner,s,e,capname',
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
    const affected = (g) => fix.gwcodes.includes(g.properties.gwcode)
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
const groupOf = (p) => String(p.status === 'independent' || !p.owner ? p.gwcode : p.owner)

function assignColours(topo) {
  const geoms = topo.objects.borders.geometries
  const neighbours = topojson.neighbors(geoms)
  const adjacency = new Map()
  geoms.forEach((g) => adjacency.set(groupOf(g.properties), new Set()))
  neighbours.forEach((list, i) => {
    const a = geoms[i].properties
    for (const j of list) {
      const b = geoms[j].properties
      if (groupOf(a) !== groupOf(b) && overlaps(a, b)) {
        adjacency.get(groupOf(a)).add(groupOf(b))
        adjacency.get(groupOf(b)).add(groupOf(a))
      }
    }
  })
  // Acolorit voraç, començant pels grups amb més veïns, que són els que tenen menys opcions.
  const order = [...adjacency.keys()].sort((x, y) => adjacency.get(y).size - adjacency.get(x).size)
  const colour = new Map()
  for (const group of order) {
    const used = new Set([...adjacency.get(group)].map((n) => colour.get(n)))
    let c = 0
    while (used.has(c)) c++
    colour.set(group, c)
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
        const { gwcode, country_name, status, owner, s, e, capname } = f.properties
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [+x.toFixed(3), +y.toFixed(3)] },
          // `rank`: si dos noms es trepitgen, guanya l'estat més gran (symbol-sort-key).
          properties: {
            gwcode,
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
const colours = assignColours(topo)
const labels = buildLabels(await processWithMapshaper(raw, LABEL_BBOX))

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(`${OUT_DIR}/borders.topo.json`, JSON.stringify(topo))
writeFileSync(`${OUT_DIR}/labels.geojson`, JSON.stringify(labels))

const codes = new Set(topo.objects.borders.geometries.map((g) => g.properties.gwcode))
console.log(
  `✔ ${topo.objects.borders.geometries.length} peces de frontera, ${codes.size} estats i territoris, ${colours} colors, ${labels.features.length} noms`,
)
