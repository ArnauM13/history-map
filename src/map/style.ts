import type { ExpressionSpecification, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'

/**
 * Colors d'atles de paper. L'script de fronteres dona a cada estat un índex (`c`) perquè dos
 * veïns no en comparteixin mai cap i els reparteix tots; n'hi ha d'haver tants com diu
 * PALETTE_SIZE a scripts/build-borders.mjs. Amb set, el mateix lila tornava a cada racó del mapa.
 * Cap no s'acosta al blau del mar.
 */
export const PALETTE = [
  '#e9c89b',
  '#b7d4a0',
  '#f0b49e',
  '#c6b8e3',
  '#f2dc8d',
  '#a8d5c8',
  '#dcb0c6',
  '#a9bfe3',
  '#d5dd98',
  '#d39d8a',
  '#d8b5e0',
  '#c4b98a',
]

export const COLORS = {
  sea: '#d4e4ec',
  border: '#7a6a58',
  selected: '#006874',
  label: '#3b3329',
  labelHalo: 'rgba(255, 255, 255, 0.85)',
  conflict: '#c0392b',
  event: '#d68910',
  /** La vora discontínua de les zones ocupades: més fosca que les fronteres, que van per sota. */
  occupation: '#4a3b2c',
}

export const EUROPE_BOUNDS: [[number, number], [number, number]] = [
  [-12, 34],
  [45, 71],
]
export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-45, 22],
  [76, 83],
]

/** Com es veu un estat independent i un territori dependent: el color, amb el mar al darrere. */
const OPACITY = { independent: 0.85, dependent: 0.5 }

/** Un color de la paleta barrejat amb el del mar, com queda quan es pinta amb opacitat. */
function overSea(hex: string, opacity: number) {
  const channels = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const sea = channels(COLORS.sea)
  const mixed = channels(hex).map((v, i) => Math.round(v * opacity + sea[i] * (1 - opacity)))
  return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Les zones de la capa d'ocupacions es pinten del color de qui les controlava, tal com es veu el
 * seu territori, perquè la França ocupada es llegeixi com una part més d'Alemanya: una annexió o
 * una ocupació, del color de l'estat; un estat client, més clar, com una colònia. Es pinten
 * opaques, perquè l'estat de sota no hi tregui el cap: abans s'hi veia a través de ratlles, i
 * cada zona semblava un país més.
 */
const zoneColor: ExpressionSpecification = [
  'match',
  ['get', 'kind'],
  'client',
  [
    'match',
    ['get', 'c'],
    ...PALETTE.flatMap((color, i) => [i, overSea(color, OPACITY.dependent)]),
    '#dddddd',
  ],
  [
    'match',
    ['get', 'c'],
    ...PALETTE.flatMap((color, i) => [i, overSea(color, OPACITY.independent)]),
    '#dddddd',
  ],
] as unknown as ExpressionSpecification

/**
 * Una ocupació porta, a més, unes ratlles primes del mateix color, més fosc: és de l'ocupant, però
 * no s'hi havia incorporat com una annexió.
 */
const HATCH_SIZE = 24
const HATCH_WIDTH = 2

/** Un color de la paleta, enfosquit: les ratlles s'han de veure sobre el seu propi color. */
function darken(hex: string, amount = 0.3): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return [r, g, b].map((v) => Math.round(v * (1 - amount))) as [number, number, number]
}

/** Les imatges de les ratlles: `hatch-{color}`, una per cada color de la paleta. */
export function addHatches(map: MapLibreMap) {
  PALETTE.forEach((color, c) => {
    const [r, g, b] = darken(color)
    const data = new Uint8Array(HATCH_SIZE * HATCH_SIZE * 4)
    for (let y = 0; y < HATCH_SIZE; y++) {
      for (let x = 0; x < HATCH_SIZE; x++) {
        // Diagonals que tornen a començar a cada rajola, perquè no es noti on s'ajunten.
        if ((x + y) % HATCH_SIZE >= HATCH_WIDTH) continue
        data.set([r, g, b, 150], (y * HATCH_SIZE + x) * 4)
      }
    }
    map.addImage(`hatch-${c}`, { width: HATCH_SIZE, height: HATCH_SIZE, data }, { pixelRatio: 2 })
  })
}

const fillColor: ExpressionSpecification = [
  'match',
  ['get', 'c'],
  ...PALETTE.flatMap((color, i) => [i, color]),
  '#dddddd',
] as unknown as ExpressionSpecification

const isIndependent: ExpressionSpecification = ['==', ['get', 'status'], 'independent']
const isHovered: ExpressionSpecification = ['boolean', ['feature-state', 'hover'], false]

/** Les peces vigents en una data AAAAMMDD: les que la tenen dins de [s, e]. */
export const validOn = (date: number): ExpressionSpecification => [
  'all',
  ['<=', ['get', 's'], date],
  ['>=', ['get', 'e'], date],
]

const emptyCollection = { type: 'FeatureCollection' as const, features: [] }

export function createStyle(glyphsUrl: string): StyleSpecification {
  return {
    version: 8,
    glyphs: glyphsUrl,
    sources: {
      borders: { type: 'geojson', data: emptyCollection },
      labels: { type: 'geojson', data: emptyCollection },
      occupations: { type: 'geojson', data: emptyCollection },
      conflicts: { type: 'geojson', data: emptyCollection },
      events: { type: 'geojson', data: emptyCollection },
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': COLORS.sea } },
      {
        id: 'borders-fill',
        type: 'fill',
        source: 'borders',
        filter: validOn(0),
        paint: {
          'fill-color': fillColor,
          'fill-opacity': [
            'case',
            isHovered,
            1,
            isIndependent,
            OPACITY.independent,
            OPACITY.dependent,
          ],
        },
      },
      {
        id: 'borders-line',
        type: 'line',
        source: 'borders',
        filter: validOn(0),
        paint: {
          'line-color': COLORS.border,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.4, 6, 1.2],
        },
      },
      {
        id: 'occupations-fill',
        type: 'fill',
        source: 'occupations',
        paint: { 'fill-color': zoneColor },
      },
      {
        id: 'occupations-hatch',
        type: 'fill',
        source: 'occupations',
        filter: ['==', ['get', 'kind'], 'occupation'],
        paint: { 'fill-pattern': ['concat', 'hatch-', ['to-string', ['get', 'c']]] },
      },
      {
        id: 'occupations-line',
        type: 'line',
        source: 'occupations',
        paint: {
          'line-color': COLORS.occupation,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.6, 6, 1.6],
          'line-dasharray': [3, 2],
        },
      },
      {
        id: 'occupations-selected',
        type: 'line',
        source: 'occupations',
        filter: ['==', ['get', 'id'], ''],
        paint: { 'line-color': COLORS.selected, 'line-width': 2.5 },
      },
      {
        id: 'borders-selected',
        type: 'line',
        source: 'borders',
        filter: ['==', ['get', 'gwcode'], -1],
        paint: { 'line-color': COLORS.selected, 'line-width': 2.5 },
      },
      {
        id: 'labels',
        type: 'symbol',
        source: 'labels',
        layout: {
          'icon-image': ['coalesce', ['get', 'flag'], ''],
          'icon-anchor': 'bottom',
          'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.75, 5, 1, 7, 1.3],
          'text-field': ['get', 'name'],
          'text-anchor': ['case', ['has', 'flag'], 'top', 'center'],
          'text-offset': ['case', ['has', 'flag'], ['literal', [0, 0.2]], ['literal', [0, 0]]],
          'text-font': [
            'case',
            isIndependent,
            ['literal', ['Open Sans Semibold']],
            ['literal', ['Open Sans Italic']],
          ],
          'text-size': ['interpolate', ['linear'], ['zoom'], 2, 9, 4, 11, 7, 15],
          'text-max-width': 7,
          'symbol-sort-key': ['get', 'rank'],
          'text-padding': 4,
        },
        paint: {
          'text-color': COLORS.label,
          'text-halo-color': COLORS.labelHalo,
          'text-halo-width': 1.2,
        },
      },
      {
        id: 'conflicts-halo',
        type: 'circle',
        source: 'conflicts',
        paint: {
          'circle-radius': ['case', ['get', 'selected'], 26, 18],
          'circle-color': COLORS.conflict,
          'circle-opacity': 0.18,
          'circle-blur': 0.4,
        },
      },
      {
        id: 'conflicts',
        type: 'circle',
        source: 'conflicts',
        paint: {
          'circle-radius': ['case', ['get', 'selected'], 9, 6.5],
          'circle-color': COLORS.conflict,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      },
      {
        id: 'events',
        type: 'circle',
        source: 'events',
        paint: {
          'circle-radius': ['case', ['get', 'selected'], 8, 5.5],
          'circle-color': COLORS.event,
          'circle-opacity': ['case', ['get', 'upcoming'], 0.45, 1],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': ['case', ['get', 'selected'], 3, 1.5],
          'circle-stroke-opacity': ['case', ['get', 'upcoming'], 0.45, 1],
        },
      },
    ],
  }
}
