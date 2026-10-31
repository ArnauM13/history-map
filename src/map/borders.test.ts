import type { Feature, Geometry, Position } from 'geojson'
import * as topojson from 'topojson-client'
import type { Topology } from 'topojson-specification'
import { describe, expect, it } from 'vitest'
import bordersRaw from '../../public/data/borders.topo.json?raw'

type Props = { code: string; s: number; e: number }

const topo = JSON.parse(bordersRaw) as Topology
const pieces = (
  topojson.feature(topo, topo.objects.borders) as unknown as {
    features: Feature<Geometry, Props>[]
  }
).features.filter((f) => f.geometry)

const inRing = ([x, y]: Position, ring: Position[]) => {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** A quin estat cau un punt un dia: el codi, o «·» si no és de ningú (o és al mar). */
function stateAt(point: Position, date: string) {
  const day = Number(date.replaceAll('-', ''))
  const found = pieces.filter((f) => {
    const g = f.geometry
    if (f.properties.s > day || day > f.properties.e) return false
    const polygons =
      g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []
    return polygons.some(
      ([outer, ...holes]) => inRing(point, outer) && !holes.some((h) => inRing(point, h)),
    )
  })
  return found.map((f) => f.properties.code).join('+') || '·'
}

// Les correccions de build-borders.mjs (DADES.md §1.1), comprovades després de simplificar: abans,
// la simplificació deixava el centre de Fiume a Iugoslàvia i Kastav a Itàlia.
describe('les fronteres corregides', () => {
  const cases: [string, Position, [string, string][]][] = [
    [
      'Fiume',
      [14.44, 45.33],
      [
        ['1918-10-29', '300'],
        ['1918-10-30', 'Q548114'],
        ['1919-09-10', 'Q548114'],
        ['1920-09-07', 'Q548114'],
        ['1920-09-08', 'Q1423581'],
        ['1920-11-12', 'Q1423581'],
        ['1920-12-27', 'Q1423581'],
        ['1920-12-28', 'Q548114'],
        ['1924-02-21', 'Q548114'],
        ['1924-02-22', '325'],
        ['1947-02-09', '325'],
        ['1947-02-10', '345'],
      ],
    ],
    ['Sušak', [14.455, 45.327], [['1930-01-01', '345']]],
    // La franja de costa que Rapallo va afegir a Fiume: abans, del Regne SCS, com la dona CShapes.
    [
      'Preluka',
      [14.36, 45.35],
      [
        ['1920-11-11', '345'],
        ['1920-11-12', 'Q1423581'],
        ['1920-12-28', 'Q548114'],
      ],
    ],
    [
      'Koper',
      [13.73, 45.55],
      [
        ['1919-09-09', '305'],
        ['1919-09-10', 'Q958521'],
        ['1920-11-11', 'Q958521'],
        ['1920-11-12', '325'],
      ],
    ],
    [
      'Zara',
      [15.24, 44.12],
      [
        ['1919-09-10', 'Q2552789'],
        ['1920-11-12', '325'],
      ],
    ],
    [
      'Šibenik',
      [15.9, 43.735],
      [
        ['1919-09-09', '305'],
        ['1919-09-10', 'Q2552789'],
        ['1920-11-11', 'Q2552789'],
        ['1920-11-12', '345'],
      ],
    ],
    ['Trogir', [16.25, 43.52], [['1920-01-01', '345']]],
    [
      'Kastav',
      [14.349, 45.3725],
      [
        ['1921-01-01', '345'],
        ['1941-01-01', '345'],
      ],
    ],
    [
      'Opatija',
      [14.305, 45.338],
      [
        ['1910-01-01', '300'],
        ['1930-01-01', '325'],
        ['2000-01-01', '344'],
      ],
    ],
    [
      'Postojna',
      [14.21, 45.78],
      [
        ['1930-01-01', '325'],
        ['1950-01-01', '345'],
      ],
    ],
    [
      'Rodes',
      [28.0, 36.2],
      [
        ['1920-01-01', '640'],
        ['1930-01-01', '325'],
        ['1950-01-01', '350'],
      ],
    ],
    [
      'Dàntzig',
      [18.65, 54.35],
      [
        ['1938-09-15', '291'],
        ['1939-08-31', '291'],
        ['1939-09-01', '255'],
      ],
    ],
  ]
  for (const [name, point, expected] of cases) {
    it(`posen ${name} on era`, () => {
      for (const [date, code] of expected)
        expect(stateAt(point, date), `${name}, ${date}`).toBe(code)
    })
  }
})
