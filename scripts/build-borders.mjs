#!/usr/bin/env node
/**
 * Builds the border dataset used by the web app from CShapes 2.0.
 *
 *   npm run data:borders
 *
 * Steps:
 *   1. Download CShapes 2.0 (Gleditsch & Ward version) as TopoJSON if not cached in data-raw/.
 *   2. Keep features valid from 1900 onwards, clip them to Europe and simplify (mapshaper).
 *   3. Encode dates as YYYYMMDD integers (s, e) so MapLibre can filter by date.
 *   4. Apply the manual corrections listed in CORRECTIONS (documented in docs/DATA.md).
 *   5. Assign a colour index per "group" (a state and its dependencies) so that
 *      neighbouring groups that coexist in time never share a colour.
 *   6. Compute one label point per feature (pole of inaccessibility of its largest polygon).
 *
 * Outputs (committed to the repo, see public/data/README.md for licensing):
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

const FIRST_DATE = '1900-01-01'
/** Last day covered by CShapes 2.0. Features ending that day are still valid today. */
const DATASET_END = '2019-12-31'
const OPEN_END = 99991231
/** [west, south, east, north] — Europe plus its surroundings, so the map has no visible edge. */
const BBOX = [-28, 30, 78, 82]
/** Labels are placed inside this smaller area, so that e.g. Russia is labelled in Europe. */
const LABEL_BBOX = [-25, 30, 56, 74]
const SIMPLIFY = '12%'

/**
 * Deliberate deviations from CShapes 2.0, each documented in docs/DATA.md.
 * Territories under de facto control belong in a separate layer (see docs/ROADMAP.md).
 */
const CORRECTIONS = [
  {
    description:
      'Crimea: keep the internationally recognised Russia–Ukraine border after the 2014 annexation (UN GA resolution 68/262)',
    gwcodes: [365, 369],
    dropFeaturesStarting: 20140318,
    extendFeaturesEnding: 20140317,
  },
]

async function ensureRawData() {
  if (existsSync(RAW_FILE)) return
  mkdirSync(RAW_DIR, { recursive: true })
  console.log(`Downloading ${SOURCE_URL}`)
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`)
  writeFileSync(`${RAW_FILE}.xz`, Buffer.from(await res.arrayBuffer()))
  // Node has no built-in xz decoder; the `xz` CLI is available on Linux and macOS.
  execFileSync('xz', ['--decompress', '--force', `${RAW_FILE}.xz`])
}

async function processWithMapshaper(raw, bbox) {
  const commands = [
    '-i input.topojson name=borders',
    `-filter 'end >= "${FIRST_DATE}"'`,
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

/** A state and the territories it controls (colonies, protectorates…) share a group. */
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
  // Greedy colouring, most-connected groups first.
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
        const { gwcode, country_name, status, owner, s, e } = f.properties
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [+x.toFixed(3), +y.toFixed(3)] },
          // `rank`: larger states win label collisions (used as symbol-sort-key).
          properties: {
            gwcode,
            country_name,
            status,
            owner,
            s,
            e,
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
  `✔ ${topo.objects.borders.geometries.length} border features, ${codes.size} states/territories, ${colours} colours, ${labels.features.length} labels`,
)
