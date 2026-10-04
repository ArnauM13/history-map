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
    [10.0, 46.5],
    [10.0, 41.0],
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

  /**
   * El costat italià de la partició d'Eslovènia del 1941, la Província de Ljubljana: Ljubljana,
   * Vrhnika, Kočevje, Novo Mesto i la Baixa Carniola; al nord, Medvode, Kamnik, Zagorje i Krško
   * van a Alemanya. Fonts: el mapa de «Province of Ljubljana» i el de «World War II in the
   * Slovene Lands».
   */
  ljubljana: [
    [13.9, 46.08],
    [14.15, 46.08],
    [14.33, 46.1],
    [14.47, 46.095],
    [14.55, 46.09],
    [14.65, 46.08],
    [14.82, 46.08],
    [14.95, 46.05],
    [15.0, 46.0],
    [15.1, 45.95],
    [15.25, 45.9],
    [15.38, 45.85],
    [15.5, 45.8],
    [15.6, 45.76],
    [15.9, 45.7],
    [15.9, 45.3],
    [13.9, 45.3],
  ],

  /**
   * La Baranja croata, entre el Drava i el Danubi, que va ocupar Hongria; Osijek, a l'altra riba,
   * queda a Croàcia. Font: el mapa de «Hungarian occupation of Yugoslav territories».
   */
  baranja: [
    [18.2, 45.95],
    [19.1, 45.95],
    [19.1, 45.52],
    [18.92, 45.54],
    [18.8, 45.56],
    [18.69, 45.57],
    [18.55, 45.62],
    [18.45, 45.67],
    [18.3, 45.72],
    [18.2, 45.78],
  ],

  /**
   * La costa dàlmata que Itàlia es va annexionar pels Tractats de Roma del 18 de maig del 1941:
   * de Zadar a Split, amb Trogir, Šibenik i les illes del davant, sense Brač, Hvar ni Pag, que
   * van quedar a Croàcia (Hvar i Pag, fins a la tardor). Fonts: el mapa de «Governorate of
   * Dalmatia» i el de «Treaties of Rome (1941)».
   */
  dalmatia: [
    [14.7, 44.3],
    [15.2, 44.35],
    [15.45, 44.2],
    [15.65, 44.05],
    [15.85, 43.85],
    [16.05, 43.7],
    [16.25, 43.62],
    [16.45, 43.58],
    [16.5, 43.52],
    [16.38, 43.45],
    [16.38, 43.32],
    [16.15, 43.3],
    [15.85, 43.5],
    [15.4, 43.7],
    [14.7, 44.0],
  ],
  /** Vis i Korčula, de la mateixa annexió. */
  dalmatianIslands: [
    [
      [15.95, 43.12],
      [16.3, 43.12],
      [16.3, 42.95],
      [15.95, 42.95],
    ],
    [
      [16.6, 43.0],
      [17.15, 43.0],
      [17.15, 42.88],
      [16.6, 42.88],
    ],
  ],

  /**
   * La zona búlgara de Grècia: a l'est de l'Estrimó, amb Serres, Drama, Kavala, Xanthi,
   * Komotiní, Thasos i Samotràcia. Font: el mapa de «Axis occupation of Greece».
   */
  struma: [
    [23.33, 41.8],
    [23.33, 41.4],
    [23.3, 41.25],
    [23.35, 41.15],
    [23.45, 41.0],
    [23.6, 40.9],
    [23.75, 40.82],
    [23.85, 40.78],
    [23.9, 40.5],
    [25.2, 40.5],
    [25.2, 40.35],
    [27.0, 40.35],
    [27.0, 41.8],
  ],

  /**
   * La franja de l'Evros, a tocar de Turquia, que es va quedar Alemanya: Orestiada i
   * Didimòtic. Font: el mapa de «Axis occupation of Greece».
   */
  evros: [
    [26.05, 41.8],
    [26.8, 41.8],
    [26.8, 40.85],
    [26.2, 40.85],
    [26.25, 41.05],
    [26.2, 41.3],
    [26.15, 41.5],
  ],

  /** Samos i Ikaria, a la zona italiana; la resta de l'Egeu Septentrional era alemanya. */
  samos: [
    [25.9, 37.95],
    [27.2, 37.95],
    [27.2, 37.4],
    [25.9, 37.4],
  ],

  /**
   * Creta, en tres: Khanià, a l'oest, on els alemanys van resistir fins al maig del 1945;
   * Réthimno i Iràklio, al centre; i Lassithi, a l'est, la part italiana. Font: «Fortress Crete».
   */
  westCrete: [
    [23.0, 36.0],
    [24.3, 36.0],
    [24.3, 35.0],
    [23.0, 35.0],
  ],
  eastCrete: [
    [25.5, 36.0],
    [26.5, 36.0],
    [26.5, 34.5],
    [25.5, 34.5],
  ],

  /**
   * La frontera del segon arbitratge de Viena (30 d'agost del 1940), que va donar a Hongria el
   * nord de Transsilvània: Oradea, Cluj, Târgu Mureș i el País dels Székely, a Hongria; Salonta,
   * Beiuș, Turda, Sighișoara i Brașov, a Romania. CShapes no la té. Font: el mapa de «Second
   * Vienna Award».
   */
  viennaAward: [
    [21.0, 46.95],
    [22.0, 46.95],
    [22.4, 46.85],
    [22.8, 46.78],
    [23.2, 46.75],
    [23.5, 46.7],
    [23.75, 46.65],
    [24.05, 46.55],
    [24.35, 46.45],
    [24.65, 46.38],
    [24.95, 46.3],
    [25.2, 46.15],
    [25.4, 45.95],
    [25.6, 45.82],
    [25.9, 45.7],
    [26.8, 45.4],
    [26.8, 48.5],
    [21.0, 48.5],
  ],

  /**
   * La Transnístria romanesa: entre el Dnièster i el Bug Meridional, de Mohiliv-Podilski i
   * Tultxin fins a la mar, amb Odessa; Vínnitsia i Mikolaiv, a l'altra banda, eren alemanyes.
   * Font: el mapa de «Transnistria Governorate».
   */
  transnistria: [
    [27.0, 48.45],
    [27.8, 48.47],
    [28.1, 48.6],
    [28.6, 48.75],
    [29.1, 48.8],
    [29.25, 48.68],
    [29.5, 48.55],
    [29.9, 48.33],
    [30.5, 48.15],
    [30.85, 48.02],
    [31.2, 47.72],
    [31.35, 47.55],
    [31.6, 47.3],
    [31.9, 47.05],
    [32.0, 46.85],
    [31.95, 46.6],
    [31.6, 45.8],
    [27.0, 45.8],
  ],

  /** Bessaràbia és a l'est del Prut, que el 1940 va quedar de frontera. */
  eastOfPrut: [
    [26.55, 48.6],
    [30.5, 48.6],
    [30.5, 45.0],
    [26.55, 45.0],
  ],

  /** Crimea, al sud de l'istme de Perekop. */
  crimea: [
    [32.3, 46.16],
    [36.8, 46.16],
    [36.8, 44.2],
    [32.3, 44.2],
  ],

  /**
   * El que Itàlia va afegir el 1941 a la província de Fiume, a més de Krk i Rab: Sušak, Kastav,
   * Bakar, Čavle, Grobnik, Fužine, Čabar, Gerovo, Crni Lug i, a Eslovènia, Osilnica, Draga i
   * Trava; Delnice i Kraljevica van quedar a Croàcia. Fonts: la llista de municipis de «Province
   * of Fiume» i «Treaties of Rome (1941)».
   */
  fiumeAnnexed: [
    [14.3, 45.3],
    [14.3, 45.5],
    [14.45, 45.66],
    [14.6, 45.72],
    [14.75, 45.66],
    [14.85, 45.58],
    [14.78, 45.47],
    [14.76, 45.38],
    [14.78, 45.3],
    [14.62, 45.28],
    [14.56, 45.27],
    [14.5, 45.25],
    [14.4, 45.29],
  ],

  /**
   * Eupen-Malmedy: els cantons d'Eupen, Malmedy i Sankt Vith, i els deu municipis de l'entorn de
   * Montzen que Alemanya s'hi va annexionar també. Font: el mapa de «Eupen-Malmedy».
   */
  eupenMalmedy: [
    [5.8, 50.78],
    [6.35, 50.78],
    [6.35, 50.1],
    [6.1, 50.12],
    [6.0, 50.25],
    [5.96, 50.38],
    [5.93, 50.5],
    [5.85, 50.6],
    [5.8, 50.66],
  ],
}

// ── La geometria ─────────────────────────────────────────────────────────────

const ring = (points) => [[...points, points[0]]]
const rings = (list) => union(...list.map(ring))
/**
 * polygon-clipping de vegades no sap tancar un anell quan dues vores gairebé es toquen (la zona
 * italiana de Grècia, quan les fronteres es corregeixen després de simplificar). Llavors es torna
 * a provar amb les coordenades arrodonides a 1e-6 graus, uns 10 cm.
 */
const clip = (op, ...geoms) => {
  try {
    return polygonClipping[op](...geoms)
  } catch {
    const rounded = (g) =>
      g.map((p) => p.map((r) => r.map(([x, y]) => [+x.toFixed(6), +y.toFixed(6)])))
    return polygonClipping[op](...geoms.map(rounded))
  }
}
const union = (...geoms) => clip('union', ...geoms.filter((g) => g.length > 0))
const intersect = (a, ...others) => clip('intersection', a, ...others)
const minus = (a, ...others) => clip('difference', a, ...others.filter((g) => g.length))

const topo = JSON.parse(readFileSync(BORDERS, 'utf8'))
const pieces = topojson.feature(topo, topo.objects.borders).features.filter((f) => f.geometry)

/** Les fronteres d'un estat de CShapes en una data (AAAA-MM-DD), com les dibuixa el mapa. */
function state(gwcode, date) {
  const day = Number(date.replaceAll('-', ''))
  const found = pieces.filter(
    (f) => f.properties.code === String(gwcode) && f.properties.s <= day && day <= f.properties.e,
  )
  if (found.length === 0) throw new Error(`CShapes no té l'estat ${gwcode} el ${date}`)
  return union(
    ...found.map((f) =>
      f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates,
    ),
  )
}

/** Les unitats de Natural Earth que es fan servir, per país (ISO de tres lletres). */
const ADMIN_COUNTRIES = [
  ...['FRA', 'ITA', 'JEY', 'GGY'],
  ...['SVN', 'HRV', 'BIH', 'SRB', 'MNE', 'MKD', 'KOS', 'GRC'],
  ...['ROU', 'UKR'],
]
let admins
/** Si la zona que s'està fent fa servir alguna unitat de Natural Earth. */
let usesAdmin = false

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
    '-i in.json -filter-fields adm0_a3,name,region -simplify interval=500 keep-shapes -o out.json format=geojson',
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

/** Els noms de les unitats d'un país que són d'unes regions: les províncies del Laci… */
const inRegions = (country, regions) =>
  admins
    .filter((f) => f.properties.adm0_a3 === country && regions.includes(f.properties.region))
    .map((f) => f.properties.name)

/** Unes unitats de Natural Earth tal com són, per a les illes que CShapes no dibuixa. */
const adminUnits = (country) => {
  usesAdmin = true
  return union(
    ...admins.filter((f) => f.properties.adm0_a3 === country).map((f) => coordsOf(f.geometry)),
  )
}

/**
 * Les illes d'una unitat de Natural Earth que cauen senceres dins de [oest, sud, est, nord]. CShapes,
 * simplificat, no en dibuixa gairebé cap de l'Adriàtic: Krk, Rab, Brač o Hvar no hi són.
 */
const islands = (country, name, [w, s, e, n]) => {
  usesAdmin = true
  const unit = admins.find((f) => f.properties.adm0_a3 === country && f.properties.name === name)
  if (!unit) throw new Error(`Natural Earth no té ${name} (${country})`)
  const found = coordsOf(unit.geometry).filter(([outer]) =>
    outer.every(([x, y]) => x >= w && x <= e && y >= s && y <= n),
  )
  if (found.length === 0) throw new Error(`Cap illa de ${name} dins de ${[w, s, e, n]}`)
  return union(...found.map((polygon) => [polygon]))
}

/**
 * La part de `base` (un estat de CShapes) que cau dins d'unes unitats de Natural Earth. La línia
 * interior és la de Natural Earth; l'exterior, la de CShapes, perquè la unitat s'eixampla abans
 * de retallar i les altres unitats del país se'n treuen després.
 */
async function within(base, country, names) {
  usesAdmin = true
  const units = admins.filter((f) => f.properties.adm0_a3 === country)
  if (names.length === 0) throw new Error(`Cap unitat de Natural Earth per a ${country}`)
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

const YUGOSLAVIA = () => state(345, '1941-01-01')
const ITALY = () => state(325, '1943-01-01')
/**
 * El que Itàlia tenia del 1920 al 1947 i ara és d'Eslovènia i Croàcia: el Litoral eslovè,
 * l'Ístria, Fiume, Cres i Lošinj. Sense Zara, que no va entrar al Litoral Adriàtic alemany.
 */
const JULIAN_MARCH = () =>
  intersect(
    minus(ITALY(), state(325, '2000-01-01')),
    ring([
      [13.0, 46.7],
      [14.7, 46.7],
      [14.7, 44.4],
      [13.0, 44.4],
    ]),
  )
const GREECE = () => state(350, '1941-01-01')
/** La Iugoslàvia del 1941 dins d'un estat d'avui: Croàcia (344), Eslovènia (349)… */
const YUGOSLAV = (gwcode) => intersect(YUGOSLAVIA(), state(gwcode, '2020-01-01'))
const YUGOSLAV_STATES = { SVN: 349, HRV: 344, BIH: 346, SRB: 340, KOS: 347, MNE: 341, MKD: 343 }
/**
 * Unes unitats de Natural Earth dins de la Iugoslàvia del 1941. Es retallen amb l'estat d'avui, i
 * no amb tota Iugoslàvia, perquè el marge de `within` no passi a la república del costat.
 */
const yugoslav = (country, names) => within(YUGOSLAV(YUGOSLAV_STATES[country]), country, names)
const BACKA = ['Severno-Backi', 'Zapadno-Backi', 'Južno-Backi']
const PREKMURJE = [
  'Moravske Toplice',
  'Šalovci',
  'Hodoš',
  'Gornji Petrovci',
  'Kuzma',
  'Lendava',
  'Dobrovnik',
  'Kobilje',
  'Rogašovci',
  'Cankova',
  'Črenšovci',
  'Puconci',
  'Grad',
  'Murska Sobota',
  'Turnišče',
  'Velika Polana',
  'Beltinci',
  'Odranci',
]
/** Les bocues de Kotor, que van anar a la Dalmàcia italiana i no al Montenegro. */
const KOTOR = ['Herceg Novi', 'Kotor', 'Tivat']
/** El nord de Kosovo, amb les mines de Trepča, el va retenir Alemanya dins de Sèrbia. */
const GERMAN_KOSOVO = [
  'Leposavić',
  'Zvečan',
  'Zubin Potok',
  'Kosovska Mitrovica',
  'Vučitrn',
  'Podujevo',
]
const BULGARIAN_KOSOVO = ['Kačanik', 'Vitina']
const BULGARIAN_SERBIA = ['Pirotski', 'Pcinjski']
/** L'oest de Macedònia, de Tetovo a Struga, que va anar a Albània; Ohrid i Skopje, a Bulgària. */
const ALBANIAN_MACEDONIA = [
  'Struga',
  'Centar župa',
  'Debar',
  'Mavrovo and Rostusa',
  'Gostivar',
  'Vevčani',
  'Jegunovce',
  'Tearce',
  'Tetovo',
  'Bogovinje',
  'Vrapcište',
  'Želino',
  'Brvenica',
  'Oslomej',
  'Zajas',
  'Kičevo',
  'Plasnica',
  'Vraneštica',
  'Drugovo',
]
const ALBANIAN_MONTENEGRO = ['Ulcinj', 'Plav', 'Rožaje']
/** Krk i Rab, que es van afegir a la província de Fiume. */
const KRK_RAB = () =>
  union(
    islands('HRV', 'Primorsko-Goranska', [14.4, 44.9, 14.85, 45.3]),
    islands('HRV', 'Primorsko-Goranska', [14.6, 44.65, 14.9, 44.9]),
  )
const FIUME_LAND = () => intersect(YUGOSLAVIA(), ring(LINES.fiumeAnnexed))
const FIUME_ANNEXED = () => union(FIUME_LAND(), KRK_RAB())
/** Les tres illes que els Tractats de Roma van deixar a Croàcia i Itàlia va ocupar al setembre. */
const PAG_BRAC_HVAR = () =>
  union(
    islands('HRV', 'Licko-Senjska', [14.7, 44.25, 15.3, 44.75]),
    islands('HRV', 'Splitsko-Dalmatinska', [16.35, 43.24, 16.95, 43.42]),
    islands('HRV', 'Splitsko-Dalmatinska', [16.3, 43.05, 17.25, 43.25]),
  )
const DALMATIA = () =>
  intersect(YUGOSLAV(344), union(ring(LINES.dalmatia), rings(LINES.dalmatianIslands)))
const CRETE = () => within(GREECE(), 'GRC', ['Kriti'])
const BULGARIAN_GREECE = () => minus(intersect(GREECE(), ring(LINES.struma)), ring(LINES.evros))
const GERMAN_GREECE = async () =>
  union(
    minus(
      await within(GREECE(), 'GRC', [
        'Kentriki Makedonia',
        'Ayion Oros',
        'Attiki',
        'Voreio Aigaio',
      ]),
      ring(LINES.struma),
      ring(LINES.samos),
    ),
    intersect(GREECE(), ring(LINES.evros)),
  )

const USSR = () => state(365, '1941-01-01')
const ROMANIA = () => state(360, '1940-01-01')
/** El que Romania va cedir a la URSS el juny del 1940: Bessaràbia, el nord de Bucovina i Herța. */
const ROMANIA_LOST = () => minus(ROMANIA(), state(360, '1940-07-01'))
/** El nord de Bucovina, aproximat amb la província de Txernivtsí d'avui. */
const BUKOVINA = async () =>
  intersect(ROMANIA_LOST(), await within(state(369, '2020-01-01'), 'UKR', ['Chernivtsi']))
const TRANSNISTRIA = () => minus(intersect(USSR(), ring(LINES.transnistria)), ROMANIA())
const CRIMEA = () => intersect(USSR(), ring(LINES.crimea))
/** La Unió Soviètica d'abans del 1939 dins d'un estat d'avui: sense el que era polonès o romanès. */
const SOVIET = (gwcode) =>
  minus(intersect(USSR(), state(gwcode, '2020-01-01')), POLAND(), CZECHOSLOVAKIA(), ROMANIA())

/**
 * Com es fa cada zona. `line` vol dir que hi ha una vora dibuixada a mà; si s'hi fan servir les
 * divisions de Natural Earth, ho detecta `within`. L'app ho ensenya a la fitxa, i en cita la font.
 */
const ZONES = {
  austria: { build: () => state(305, '1938-01-01') },
  'bohemia-moravia': {
    line: true,
    build: () => minus(intersect(CZECHOSLOVAKIA(), state(316, '2000-01-01')), ZAOLZIE()),
  },
  slovakia: { build: () => intersect(CZECHOSLOVAKIA(), state(317, '2000-01-01')) },
  'carpathian-ruthenia': { build: () => intersect(CZECHOSLOVAKIA(), state(369, '2000-01-01')) },
  'trans-olza': { line: true, build: ZAOLZIE },
  memel: { line: true, build: () => intersect(state(368, '1939-01-01'), ring(LINES.memel)) },
  albania: { build: () => state(339, '1939-01-01') },
  'occupied-poland': { line: true, build: GERMAN_POLAND },
  'annexed-poland': {
    line: true,
    build: () => intersect(GERMAN_POLAND(), ring(LINES.annexedPoland)),
  },
  'general-government': {
    line: true,
    build: () => minus(GERMAN_POLAND(), ring(LINES.annexedPoland)),
  },
  'soviet-poland': { line: true, build: SOVIET_POLAND },
  'eastern-poland': { line: true, build: SOVIET_POLAND },
  // La regió que la URSS va cedir a Lituània el 1939, aproximada amb la frontera lituana d'avui.
  vilnius: { line: true, build: () => intersect(POLAND(), LITHUANIA()) },
  denmark: { build: () => minus(state(390, '1940-01-01'), ring(LINES.northernIslands)) },
  norway: { build: () => minus(state(385, '1940-01-01'), ring(LINES.northernIslands)) },
  netherlands: { build: () => state(210, '1940-01-01') },
  belgium: {
    build: async () =>
      union(
        minus(state(211, '1940-01-01'), ring(LINES.eupenMalmedy)),
        await within(FRANCE(), 'FRA', ['Nord', 'Pas-de-Calais']),
      ),
  },
  luxembourg: { build: () => state(212, '1940-01-01') },
  'alsace-moselle': {
    // «Haute-Rhin» és com ho escriu Natural Earth.
    build: () => within(FRANCE(), 'FRA', ['Bas-Rhin', 'Haute-Rhin', 'Moselle']),
  },
  'occupied-france': {
    line: true,
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
  'vichy-france': { line: true, build: () => intersect(FRANCE(), ring(LINES.freeZone)) },
  'southern-zone': {
    line: true,
    build: async () =>
      minus(
        intersect(FRANCE(), ring(LINES.freeZone)),
        await within(FRANCE(), 'FRA', [...ITALIAN_FRANCE, ...CORSICA]),
      ),
  },
  'italian-zone': {
    build: async () =>
      intersect(ring(LINES.freeZone), await within(FRANCE(), 'FRA', ITALIAN_FRANCE)),
  },
  corsica: { build: () => within(FRANCE(), 'FRA', CORSICA) },

  // Iugoslàvia, repartida l'abril del 1941.
  croatia: {
    line: true,
    build: async () =>
      minus(
        union(YUGOSLAV(344), YUGOSLAV(346), await yugoslav('SRB', ['Sremski'])),
        await yugoslav('HRV', ['Medimurska']),
        await yugoslav('SRB', BACKA),
        ring(LINES.baranja),
        DALMATIA(),
        FIUME_ANNEXED(),
        PAG_BRAC_HVAR(),
      ),
  },
  serbia: {
    build: async () =>
      union(
        await yugoslav(
          'SRB',
          admins
            .filter((f) => f.properties.adm0_a3 === 'SRB')
            .map((f) => f.properties.name)
            .filter((name) => ![...BACKA, 'Sremski', ...BULGARIAN_SERBIA].includes(name)),
        ),
        await yugoslav('KOS', GERMAN_KOSOVO),
      ),
  },
  'german-slovenia': {
    line: true,
    build: async () =>
      minus(YUGOSLAV(349), ring(LINES.ljubljana), await yugoslav('SVN', PREKMURJE)),
  },
  ljubljana: {
    line: true,
    build: () => minus(intersect(YUGOSLAV(349), ring(LINES.ljubljana)), FIUME_LAND()),
  },
  'fiume-annexations': { line: true, build: FIUME_ANNEXED },
  'pag-brac-hvar': { build: PAG_BRAC_HVAR },
  dalmatia: {
    line: true,
    build: async () => union(DALMATIA(), await yugoslav('MNE', KOTOR)),
  },
  montenegro: {
    build: async () =>
      minus(YUGOSLAV(341), await yugoslav('MNE', [...KOTOR, ...ALBANIAN_MONTENEGRO])),
  },
  'greater-albania': {
    build: async () =>
      union(
        minus(YUGOSLAV(347), await yugoslav('KOS', [...GERMAN_KOSOVO, ...BULGARIAN_KOSOVO])),
        await yugoslav('MKD', ALBANIAN_MACEDONIA),
        await yugoslav('MNE', ALBANIAN_MONTENEGRO),
      ),
  },
  'bulgarian-macedonia': {
    build: async () =>
      union(
        minus(YUGOSLAV(343), await yugoslav('MKD', ALBANIAN_MACEDONIA)),
        await yugoslav('SRB', BULGARIAN_SERBIA),
        await yugoslav('KOS', BULGARIAN_KOSOVO),
      ),
  },
  'backa-baranja': {
    line: true,
    build: async () =>
      union(await yugoslav('SRB', BACKA), intersect(YUGOSLAV(344), ring(LINES.baranja))),
  },
  'prekmurje-medjimurje': {
    build: async () =>
      union(await yugoslav('SVN', PREKMURJE), await yugoslav('HRV', ['Medimurska'])),
  },

  // Grècia, repartida l'abril del 1941.
  'greece-german': { line: true, build: GERMAN_GREECE },
  'greece-italian': {
    line: true,
    build: async () => minus(GREECE(), await GERMAN_GREECE(), BULGARIAN_GREECE(), await CRETE()),
  },
  'greece-bulgarian': { line: true, build: BULGARIAN_GREECE },
  'western-crete': {
    line: true,
    build: async () => intersect(await CRETE(), ring(LINES.westCrete)),
  },
  'central-crete': {
    line: true,
    build: async () => minus(await CRETE(), ring(LINES.westCrete), ring(LINES.eastCrete)),
  },
  lasithi: { line: true, build: async () => intersect(await CRETE(), ring(LINES.eastCrete)) },

  // Hongria i Romania, del 1940 al 1944.
  'northern-transylvania': {
    line: true,
    build: async () =>
      intersect(
        await within(ROMANIA(), 'ROU', [
          'Satu Mare',
          'Maramures',
          'Salaj',
          'Bistrita-Nasaud',
          'Cluj',
          'Mures',
          'Harghita',
          'Covasna',
          'Bihor',
        ]),
        ring(LINES.viennaAward),
      ),
  },
  'northern-bukovina': { build: BUKOVINA },
  bessarabia: {
    // A l'est del Prut: el que queda a l'oest són engrunes de comparar dues dates de CShapes.
    build: async () => intersect(minus(ROMANIA_LOST(), await BUKOVINA()), ring(LINES.eastOfPrut)),
  },
  transnistria: { line: true, build: TRANSNISTRIA },
  hungary: { build: () => state(310, '1941-01-01') },

  // El front de l'Est: el que Alemanya va ocupar de la Unió Soviètica de després del 1940.
  estonia: { build: () => state(366, '1940-01-01') },
  latvia: { build: () => state(367, '1940-01-01') },
  lithuania: {
    line: true,
    build: () => minus(LITHUANIA(), POLAND(), ring(LINES.memel)),
  },
  // Sense el que el 1940 era letó o lituà: les fronteres soviètiques es van moure després.
  belarus: { build: () => minus(SOVIET(370), state(367, '1940-01-01'), LITHUANIA()) },
  ukraine: { line: true, build: () => minus(SOVIET(369), TRANSNISTRIA(), CRIMEA()) },
  crimea: { build: CRIMEA },

  // Itàlia, del 1943 al 1945.
  'italian-social-republic': {
    build: () =>
      within(ITALY(), 'ITA', [
        ...inRegions('ITA', [
          'Piemonte',
          "Valle d'Aosta",
          'Lombardia',
          'Liguria',
          'Emilia-Romagna',
          'Veneto',
        ]).filter((name) => name !== 'Belluno'),
      ]),
  },
  'central-italy': {
    build: () =>
      within(ITALY(), 'ITA', inRegions('ITA', ['Toscana', 'Umbria', 'Marche', 'Lazio', 'Abruzzo'])),
  },
  'alpine-foothills': {
    build: () => within(ITALY(), 'ITA', ['Bozen', 'Trento', 'Belluno']),
  },
  'adriatic-littoral': {
    line: true,
    build: async () =>
      union(
        await within(ITALY(), 'ITA', inRegions('ITA', ['Friuli-Venezia Giulia'])),
        JULIAN_MARCH(),
      ),
  },

  // L'oest: el que faltava.
  'channel-islands': { build: () => union(adminUnits('JEY'), adminUnits('GGY')) },
  'eupen-malmedy': {
    line: true,
    build: () => intersect(state(211, '1940-01-01'), ring(LINES.eupenMalmedy)),
  },
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
  usesAdmin = false
  const geometry = round(await ZONES[id].build())
  if (geometry.length === 0) throw new Error(`La zona ${id} ha quedat buida`)
  // El nom va al pol d'inaccessibilitat del tros més gran, com el dels estats.
  const largest = geometry.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a))
  const [x, y] = polylabel(largest, 0.02)
  features.push({
    type: 'Feature',
    properties: {
      id,
      // D'on surten les vores que no són de CShapes, si n'hi ha: la fitxa ho diu.
      approx: [...(ZONES[id].line ? ['line'] : []), ...(usesAdmin ? ['admin'] : [])],
      label: [+x.toFixed(3), +y.toFixed(3)],
      rank: -Math.round(ringArea(largest[0])),
    },
    geometry: { type: 'MultiPolygon', coordinates: geometry },
  })
}

writeFileSync(OUT_FILE, JSON.stringify({ type: 'FeatureCollection', features }))
console.log(`✔ ${features.length} zones a ${OUT_FILE}`)
