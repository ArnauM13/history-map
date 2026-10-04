#!/usr/bin/env node
/**
 * Fa les zones de la capa d'ocupacions: el territori que es controlava de fet i que les fronteres
 * de CShapes no ensenyen, perquè només recullen les pactades (l'annexió d'Àustria, el Govern
 * General, la França de Vichy…).
 *
 *   npm run data:occupations
 *
 * Cada zona es fa amb peces que ja tenen forma, perquè les vores coincideixin amb les del mapa:
 *   - un estat de CShapes en una data, també d'una altra època: Bohèmia i Moràvia és la
 *     Txecoslovàquia del 1939 dins de la Txèquia d'avui;
 *   - els departaments i les regions d'avui (Natural Earth), on la frontera interior era la
 *     mateixa: Alsàcia i Mosel·la són tres departaments francesos;
 *   - les línies de demarcació dibuixades a mà (LINES), on no hi ha res més. Són aproximades, i
 *     la zona ho diu.
 *
 * Els textos, les dates i les fonts de cada zona són a content/occupations/; aquí només la forma.
 * Fa servir les fronteres que deixa `npm run data:borders`, que han d'existir.
 *
 * Deixa (al repo; la llicència és la de les fronteres, a public/data/README.md):
 *   public/data/occupations.geojson
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import mapshaper from 'mapshaper'
import polygonClipping from 'polygon-clipping'
import polylabel from 'polylabel'
import * as topojson from 'topojson-client'

const BORDERS = 'public/data/borders.topo.json'
const CONTENT_DIR = 'content/occupations'
const OUT_FILE = 'public/data/occupations.geojson'
const NE_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson'
const NE_FILE = 'data-raw/ne_10m_admin_1_states_provinces.geojson'
/**
 * Quant s'eixampla una unitat de Natural Earth abans de retallar-la amb un estat de CShapes. Les
 * dues fonts no dibuixen igual la frontera exterior; sense el marge, entre la zona i el veí hi
 * quedaria una franja sense ratllar.
 */
const ADMIN_MARGIN = '8km'

// ── Les línies dibuixades a mà ───────────────────────────────────────────────

/**
 * Cada línia és un polígon que tanca un costat de la demarcació; només en compta el tram que
 * passa per dins de l'estat que es talla, i la resta va per fora, lluny. Els punts són
 * [longitud, latitud] de les poblacions per on passava, amb l'error d'un dibuix a mà
 * (uns 10-20 km). D'on surt cada traçat, al comentari.
 */
const LINES = {
  /**
   * El costat soviètic de la partició de Polònia, pel tractat germanosoviètic del 28 de setembre
   * del 1939: el canal d'Augustów, el Pisa, el Narew, el Bug i el San fins a la serralada.
   * Fonts: «German–Soviet Frontier Treaty» i el mapa de «Occupation of Poland (1939–1945)».
   */
  sovietPoland: [
    [23.75, 56.5],
    [23.75, 54.1],
    // El canal d'Augustów: Suwałki i Sejny, al nord, van a Alemanya; Augustów, a la URSS.
    [23.65, 53.95],
    [23.4, 53.9],
    [23.15, 53.87],
    [22.98, 53.84],
    [22.8, 53.8],
    [22.45, 53.82],
    // Per Prússia Oriental fins al Pisa, i el Pisa avall fins al Narew a Nowogród.
    [21.9, 53.5],
    [21.86, 53.44],
    [21.85, 53.33],
    [21.88, 53.23],
    // Per terra fins al Bug: Łomża i Zambrów, soviètiques; Ostrołęka i Ostrów, alemanyes.
    [21.92, 53.1],
    [22.0, 52.95],
    [22.06, 52.8],
    [22.08, 52.7],
    // El Bug amunt: Brest i Włodawa, soviètiques; Hrubieszów, alemanya.
    [22.2, 52.66],
    [22.32, 52.67],
    [22.45, 52.57],
    [22.58, 52.45],
    [22.66, 52.4],
    [22.85, 52.36],
    [23.04, 52.33],
    [23.15, 52.25],
    [23.22, 52.19],
    [23.45, 52.15],
    [23.62, 52.08],
    [23.65, 51.95],
    [23.6, 51.91],
    [23.62, 51.8],
    [23.55, 51.76],
    [23.6, 51.65],
    [23.55, 51.55],
    [23.65, 51.4],
    [23.7, 51.3],
    [23.8, 51.17],
    [23.95, 51.05],
    [24.08, 50.92],
    [24.15, 50.85],
    [24.1, 50.72],
    [24.15, 50.58],
    [24.2, 50.47],
    // Del Bug al San per terra: Bełżec, alemanya; Rawa Ruska i Lubaczów, soviètiques.
    [23.95, 50.43],
    [23.7, 50.38],
    [23.55, 50.3],
    [23.2, 50.25],
    [22.95, 50.2],
    [22.8, 50.12],
    [22.85, 50.0],
    [22.83, 49.95],
    // El San amunt des de Przemyśl, partida en dues, fins a la font: Sanok, partida també.
    [22.78, 49.79],
    [22.65, 49.77],
    [22.55, 49.78],
    [22.39, 49.83],
    [22.23, 49.82],
    [22.17, 49.75],
    [22.18, 49.65],
    [22.21, 49.56],
    [22.33, 49.47],
    [22.45, 49.39],
    [22.55, 49.33],
    [22.62, 49.22],
    [22.7, 49.0],
    [22.7, 47.0],
    [30.0, 47.0],
    [30.0, 56.5],
  ],

  /**
   * El que Alemanya es va annexionar de la Polònia ocupada (Danzig-Prússia Occidental, el
   * Wartheland, l'Alta Silèsia oriental i Ciechanów), separat del Govern General pel decret del
   * 8 d'octubre del 1939. Fonts: el mapa de «Polish areas annexed by Nazi Germany» i el de
   * «General Government».
   */
  annexedPoland: [
    [14.0, 55.5],
    [24.5, 55.5],
    [24.5, 53.0],
    // Ostrów Mazowiecka i Wyszków, al Govern General; Różan i Pułtusk, annexionades.
    [22.03, 52.87],
    [21.85, 52.88],
    [21.65, 52.85],
    [21.5, 52.78],
    [21.35, 52.68],
    [21.2, 52.58],
    [21.05, 52.51],
    [20.9, 52.45],
    [20.7, 52.44],
    [20.5, 52.4],
    [20.19, 52.39],
    // Sochaczew, Łowicz, Tomaszów, Piotrków i Częstochowa, al Govern General; Kutno, Łódź,
    // Brzeziny, Bełchatów i Wieluń, annexionades.
    [20.1, 52.33],
    [19.95, 52.27],
    [19.85, 52.15],
    [19.8, 52.03],
    [19.78, 51.9],
    [19.85, 51.8],
    [19.88, 51.7],
    [19.82, 51.6],
    [19.7, 51.5],
    [19.6, 51.42],
    [19.52, 51.3],
    [19.4, 51.15],
    [19.28, 51.05],
    [19.1, 50.92],
    [18.98, 50.84],
    [19.05, 50.72],
    // Zawiercie, Olkusz, Chrzanów, Wadowice i Żywiec, annexionades; Cracòvia, al Govern General.
    [19.2, 50.62],
    [19.38, 50.56],
    [19.55, 50.45],
    [19.65, 50.35],
    [19.62, 50.2],
    [19.55, 50.1],
    [19.58, 49.98],
    [19.57, 49.85],
    [19.6, 49.72],
    [19.52, 49.57],
    [19.45, 49.3],
    [14.0, 49.3],
  ],

  /**
   * La línia de demarcació entre la França ocupada i la zona lliure, de l'armistici del 22 de juny
   * del 1940: de la frontera espanyola a Arnéguy, per Langon, Angoulême, el Cher (Chenonceau,
   * Vierzon), Moulins, Digoin i Chalon-sur-Saône, fins a la frontera suïssa. Fonts: «Zone libre»
   * i el mapa de «German military administration in occupied France during World War II».
   */
  freeZone: [
    [-1.28, 43.05],
    [-1.1, 43.25],
    [-0.85, 43.42],
    [-0.62, 43.55],
    [-0.4, 43.68],
    [-0.2, 43.85],
    [-0.12, 44.05],
    [-0.18, 44.3],
    [-0.2, 44.5],
    [-0.1, 44.7],
    [-0.02, 44.85],
    [0.1, 45.0],
    [0.15, 45.2],
    [0.2, 45.4],
    [0.28, 45.6],
    [0.45, 45.85],
    [0.6, 46.05],
    [0.62, 46.25],
    [0.68, 46.45],
    [0.7, 46.7],
    [0.7, 46.95],
    [0.9, 47.15],
    [1.07, 47.3],
    [1.2, 47.32],
    [1.38, 47.27],
    [1.8, 47.27],
    [2.07, 47.22],
    [2.4, 47.25],
    [2.7, 47.15],
    [2.95, 47.0],
    [3.1, 46.85],
    [3.3, 46.6],
    [3.6, 46.5],
    [3.95, 46.48],
    [4.2, 46.55],
    [4.5, 46.68],
    [4.85, 46.78],
    [5.1, 46.75],
    [5.35, 46.72],
    [5.6, 46.75],
    [5.85, 46.6],
    [5.8, 46.45],
    [5.83, 46.25],
    // El país de Gex, al nord de Ginebra, queda a la zona ocupada; el Chablais, a la lliure.
    [5.98, 46.13],
    [6.12, 46.14],
    [6.22, 46.2],
    [6.25, 46.5],
    [9.0, 46.5],
    [9.0, 41.0],
    [-2.0, 41.0],
    [-2.0, 43.05],
  ],

  /**
   * Zaolzie, el tros de la Silèsia de Cieszyn que Polònia va prendre a Txecoslovàquia l'octubre
   * del 1938: de Bohumín a Jablunkov, a l'oest del riu Olza. Font: «Trans-Olza».
   */
  zaolzie: [
    [18.3, 49.97],
    [18.95, 49.97],
    [18.95, 49.4],
    [18.62, 49.4],
    [18.55, 49.6],
    [18.47, 49.7],
    [18.42, 49.78],
    [18.37, 49.86],
    [18.3, 49.9],
  ],

  /**
   * El territori de Memel: al nord del Niemen, fins a l'antiga frontera entre Prússia i Rússia,
   * de Nemirseta a Smalininkai. CShapes no el posa dins de l'Alemanya d'abans del 1920, i cal
   * dibuixar-lo. Font: el mapa de «Klaipėda Region».
   */
  memel: [
    [20.8, 55.95],
    [21.07, 55.86],
    [21.22, 55.8],
    [21.3, 55.7],
    [21.4, 55.55],
    [21.62, 55.42],
    [21.68, 55.3],
    [21.95, 55.22],
    [22.15, 55.15],
    [22.4, 55.08],
    [22.6, 55.06],
    [22.6, 54.9],
    [20.8, 54.9],
  ],

  /** Svalbard i les illes de l'Atlàntic no eren dins de les ocupacions de Noruega i Dinamarca. */
  northernIslands: [
    [-30, 72],
    [40, 72],
    [40, 85],
    [-30, 85],
  ],
}

// ── La geometria ─────────────────────────────────────────────────────────────

const ring = (points) => [[...points, points[0]]]
const union = (...geoms) => polygonClipping.union(...geoms.filter((g) => g.length > 0))
const intersect = (a, ...others) => polygonClipping.intersection(a, ...others)
const minus = (a, ...others) => polygonClipping.difference(a, ...others.filter((g) => g.length))

const topo = JSON.parse(readFileSync(BORDERS, 'utf8'))
const pieces = topojson.feature(topo, topo.objects.borders).features.filter((f) => f.geometry)

/** Les fronteres d'un estat de CShapes en una data (AAAA-MM-DD), com les dibuixa el mapa. */
function state(gwcode, date) {
  const day = Number(date.replaceAll('-', ''))
  const found = pieces.filter(
    (f) => f.properties.gwcode === gwcode && f.properties.s <= day && day <= f.properties.e,
  )
  if (found.length === 0) throw new Error(`CShapes no té l'estat ${gwcode} el ${date}`)
  return union(
    ...found.map((f) =>
      f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates,
    ),
  )
}

/** Les unitats de Natural Earth que es fan servir, per país (ISO de tres lletres). */
const ADMIN_COUNTRIES = ['FRA']
let admins

async function loadAdmins() {
  if (!existsSync(NE_FILE)) {
    console.log(`Baixant ${NE_URL}`)
    const res = await fetch(NE_URL)
    if (!res.ok) throw new Error(`No s'ha pogut baixar Natural Earth: HTTP ${res.status}`)
    mkdirSync('data-raw', { recursive: true })
    writeFileSync(NE_FILE, Buffer.from(await res.arrayBuffer()))
  }
  const all = JSON.parse(readFileSync(NE_FILE, 'utf8'))
  const features = all.features.filter((f) => ADMIN_COUNTRIES.includes(f.properties.adm0_a3))
  // Simplificades, i junts els veïns: dues unitats que es toquen comparteixen la mateixa línia.
  const out = await mapshaper.applyCommands(
    '-i in.json -filter-fields adm0_a3,name -simplify interval=500 keep-shapes -o out.json format=geojson',
    { 'in.json': { type: 'FeatureCollection', features } },
  )
  admins = JSON.parse(out['out.json']).features
}

const coordsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)

async function buffer(geom, radius) {
  const out = await mapshaper.applyCommands(
    `-i in.json -buffer radius=${radius} -o out.json format=geojson`,
    {
      'in.json': {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'MultiPolygon', coordinates: geom },
          },
        ],
      },
    },
  )
  // Sense propietats, mapshaper torna una GeometryCollection en comptes de features.
  const { geometries } = JSON.parse(out['out.json'])
  return union(...geometries.map(coordsOf))
}

/**
 * La part de `base` (un estat de CShapes) que cau dins d'unes unitats de Natural Earth. La línia
 * interior és la de Natural Earth; l'exterior, la de CShapes, perquè la unitat s'eixampla abans
 * de retallar i les altres unitats del país se'n treuen després.
 */
async function within(base, country, names) {
  const units = admins.filter((f) => f.properties.adm0_a3 === country)
  const missing = names.filter((name) => !units.some((f) => f.properties.name === name))
  if (missing.length > 0) throw new Error(`Natural Earth no té ${missing.join(', ')} (${country})`)
  const inside = units
    .filter((f) => names.includes(f.properties.name))
    .map((f) => coordsOf(f.geometry))
  const outside = units
    .filter((f) => !names.includes(f.properties.name))
    .map((f) => coordsOf(f.geometry))
  return minus(intersect(base, await buffer(union(...inside), ADMIN_MARGIN)), union(...outside))
}

// ── Les zones ────────────────────────────────────────────────────────────────

const FRANCE = () => state(220, '1940-01-01')
const POLAND = () => state(290, '1939-01-01')
const CZECHOSLOVAKIA = () => state(315, '1939-01-01')
const LITHUANIA = () => state(368, '2000-01-01')
const GERMAN_POLAND = () => minus(POLAND(), ring(LINES.sovietPoland))
/** Sense Vílnius, que la URSS va cedir a Lituània i és una zona a part. */
const SOVIET_POLAND = () => minus(intersect(POLAND(), ring(LINES.sovietPoland)), LITHUANIA())
const ZAOLZIE = () =>
  intersect(state(315, '1938-01-01'), state(316, '2000-01-01'), ring(LINES.zaolzie))
const ITALIAN_FRANCE = [
  'Alpes-Maritimes',
  'Alpes-de-Haute-Provence',
  'Hautes-Alpes',
  'Var',
  'Drôme',
  'Isère',
  'Savoie',
  'Haute-Savoie',
]
const CORSICA = ['Haute-Corse', 'Corse-du-Sud']

/**
 * Com es fa cada zona. `approx` diu d'on surten les vores que no són de CShapes: `line`, d'una
 * línia dibuixada a mà; `admin`, de les divisions d'avui. L'app ho ensenya a la fitxa.
 */
const ZONES = {
  austria: { build: () => state(305, '1938-01-01') },
  'bohemia-moravia': {
    approx: 'line',
    build: () => minus(intersect(CZECHOSLOVAKIA(), state(316, '2000-01-01')), ZAOLZIE()),
  },
  slovakia: { build: () => intersect(CZECHOSLOVAKIA(), state(317, '2000-01-01')) },
  'carpathian-ruthenia': { build: () => intersect(CZECHOSLOVAKIA(), state(369, '2000-01-01')) },
  'trans-olza': { approx: 'line', build: ZAOLZIE },
  memel: { approx: 'line', build: () => intersect(state(368, '1939-01-01'), ring(LINES.memel)) },
  albania: { build: () => state(339, '1939-01-01') },
  'occupied-poland': { approx: 'line', build: GERMAN_POLAND },
  'annexed-poland': {
    approx: 'line',
    build: () => intersect(GERMAN_POLAND(), ring(LINES.annexedPoland)),
  },
  'general-government': {
    approx: 'line',
    build: () => minus(GERMAN_POLAND(), ring(LINES.annexedPoland)),
  },
  'soviet-poland': { approx: 'line', build: SOVIET_POLAND },
  'eastern-poland': { approx: 'line', build: SOVIET_POLAND },
  // La regió que la URSS va cedir a Lituània el 1939, aproximada amb la frontera lituana d'avui.
  vilnius: { approx: 'line', build: () => intersect(POLAND(), LITHUANIA()) },
  denmark: { build: () => minus(state(390, '1940-01-01'), ring(LINES.northernIslands)) },
  norway: { build: () => minus(state(385, '1940-01-01'), ring(LINES.northernIslands)) },
  netherlands: { build: () => state(210, '1940-01-01') },
  belgium: {
    approx: 'admin',
    build: async () =>
      union(state(211, '1940-01-01'), await within(FRANCE(), 'FRA', ['Nord', 'Pas-de-Calais'])),
  },
  luxembourg: { build: () => state(212, '1940-01-01') },
  'alsace-moselle': {
    approx: 'admin',
    // «Haute-Rhin» és com ho escriu Natural Earth.
    build: () => within(FRANCE(), 'FRA', ['Bas-Rhin', 'Haute-Rhin', 'Moselle']),
  },
  'occupied-france': {
    approx: 'line',
    build: async () =>
      minus(
        FRANCE(),
        ring(LINES.freeZone),
        await within(FRANCE(), 'FRA', [
          'Nord',
          'Pas-de-Calais',
          'Bas-Rhin',
          'Haute-Rhin',
          'Moselle',
        ]),
      ),
  },
  'vichy-france': { approx: 'line', build: () => intersect(FRANCE(), ring(LINES.freeZone)) },
  'southern-zone': {
    approx: 'line',
    build: async () =>
      minus(
        intersect(FRANCE(), ring(LINES.freeZone)),
        await within(FRANCE(), 'FRA', [...ITALIAN_FRANCE, ...CORSICA]),
      ),
  },
  'italian-zone': {
    approx: 'admin',
    build: async () =>
      intersect(ring(LINES.freeZone), await within(FRANCE(), 'FRA', ITALIAN_FRANCE)),
  },
  corsica: { build: () => within(FRANCE(), 'FRA', CORSICA) },
}

// ── La sortida ───────────────────────────────────────────────────────────────

const ringArea = (r) => {
  let sum = 0
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    sum += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1])
  }
  return Math.abs(sum / 2)
}

/**
 * Per sota d'això (en graus², uns 15 km²), un tros és una engruna de retallar dues fonts que no
 * dibuixen igual la mateixa frontera, no un territori: es llença.
 */
const SLIVER = 0.002

const round = (geom) =>
  geom
    .filter((polygon) => ringArea(polygon[0]) >= SLIVER)
    .map((polygon) =>
      polygon
        .map((r) => r.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]))
        .filter((r) => r.length >= 4),
    )
    .filter((polygon) => polygon.length > 0)

const ids = readdirSync(CONTENT_DIR)
  .filter((name) => name.endsWith('.yaml'))
  .map((name) => name.replace(/\.yaml$/, ''))
const withoutShape = ids.filter((id) => !ZONES[id])
const withoutContent = Object.keys(ZONES).filter((id) => !ids.includes(id))
if (withoutShape.length > 0 || withoutContent.length > 0) {
  if (withoutShape.length > 0) console.error(`✘ Sense forma a ZONES: ${withoutShape.join(', ')}`)
  if (withoutContent.length > 0)
    console.error(`✘ Sense fitxer a ${CONTENT_DIR}: ${withoutContent.join(', ')}`)
  process.exit(1)
}

await loadAdmins()
const features = []
for (const id of ids.sort()) {
  const geometry = round(await ZONES[id].build())
  if (geometry.length === 0) throw new Error(`La zona ${id} ha quedat buida`)
  // El nom va al pol d'inaccessibilitat del tros més gran, com el dels estats.
  const largest = geometry.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a))
  const [x, y] = polylabel(largest, 0.02)
  features.push({
    type: 'Feature',
    properties: {
      id,
      approx: ZONES[id].approx ?? null,
      label: [+x.toFixed(3), +y.toFixed(3)],
      rank: -Math.round(ringArea(largest[0])),
    },
    geometry: { type: 'MultiPolygon', coordinates: geometry },
  })
}

writeFileSync(OUT_FILE, JSON.stringify({ type: 'FeatureCollection', features }))
console.log(`✔ ${features.length} zones a ${OUT_FILE}`)
