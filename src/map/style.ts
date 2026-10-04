import type { ExpressionSpecification, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'

/**
 * Colors d'atles de paper. L'script de fronteres dona a cada estat un índex (`c`) perquè dos
 * veïns no en comparteixin mai cap; n'hi ha d'haver, com a mínim, tants com els que diu l'script.
 */
export const PALETTE = ['#e9c89b', '#b7d4a0', '#f0b49e', '#c6b8e3', '#f2dc8d', '#a8d5c8', '#dcb0c6']

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

/**
 * Les zones de la capa d'ocupacions es pinten amb el color de qui les controla: una annexió, plena
 * (Àustria es veu com una part més d'Alemanya); una ocupació, ratllada espessa; un estat client,
 * ratllada clara. Les ratlles deixen veure el color de l'estat de sota, que és de qui era.
 */
const HATCHES = { occupation: 7, client: 3 } as const
const HATCH_SIZE = 24

/** Un color de la paleta, enfosquit: les ratlles han de destacar sobre un altre color pastís. */
function darken(hex: string, amount = 0.35): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return [r, g, b].map((v) => Math.round(v * (1 - amount))) as [number, number, number]
}

/** Les imatges de les ratlles: `hatch-{manera}-{color}`, una per cada color de la paleta. */
export function addHatches(map: MapLibreMap) {
  PALETTE.forEach((color, c) => {
    const [r, g, b] = darken(color)
    for (const [kind, width] of Object.entries(HATCHES)) {
      const data = new Uint8Array(HATCH_SIZE * HATCH_SIZE * 4)
      for (let y = 0; y < HATCH_SIZE; y++) {
        for (let x = 0; x < HATCH_SIZE; x++) {
          // Diagonals que tornen a començar a cada rajola, perquè no es noti on s'ajunten.
          if ((x + y) % HATCH_SIZE >= width) continue
          data.set([r, g, b, 230], (y * HATCH_SIZE + x) * 4)
        }
      }
      map.addImage(
        `hatch-${kind}-${c}`,
        { width: HATCH_SIZE, height: HATCH_SIZE, data },
        { pixelRatio: 2 },
      )
    }
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
          'fill-opacity': ['case', isHovered, 1, isIndependent, 0.85, 0.5],
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
        filter: ['==', ['get', 'kind'], 'annexation'],
        paint: { 'fill-color': fillColor, 'fill-opacity': 0.85 },
      },
      {
        id: 'occupations-hatch',
        type: 'fill',
        source: 'occupations',
        filter: ['!=', ['get', 'kind'], 'annexation'],
        paint: {
          'fill-pattern': ['concat', 'hatch-', ['get', 'kind'], '-', ['to-string', ['get', 'c']]],
        },
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
