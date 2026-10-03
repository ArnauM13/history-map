import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl'

/**
 * "Paper atlas" palette. The border build script assigns each state a colour index (`c`)
 * so that neighbours never share a colour; keep at least as many colours as it reports.
 */
export const PALETTE = ['#e9c89b', '#b7d4a0', '#f0b49e', '#c6b8e3', '#f2dc8d', '#a8d5c8', '#dcb0c6']

export const COLORS = {
  sea: '#d4e4ec',
  border: '#7a6a58',
  selected: '#1f2a44',
  label: '#3b3329',
  labelHalo: 'rgba(255, 255, 255, 0.85)',
  conflict: '#c0392b',
  event: '#d68910',
}

export const EUROPE_BOUNDS: [[number, number], [number, number]] = [
  [-12, 34],
  [45, 71],
]
export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-45, 22],
  [76, 83],
]

const fillColor: ExpressionSpecification = [
  'match',
  ['get', 'c'],
  ...PALETTE.flatMap((color, i) => [i, color]),
  '#dddddd',
] as unknown as ExpressionSpecification

const isIndependent: ExpressionSpecification = ['==', ['get', 'status'], 'independent']
const isHovered: ExpressionSpecification = ['boolean', ['feature-state', 'hover'], false]

/** Features whose validity period [s, e] contains the given YYYYMMDD date. */
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
