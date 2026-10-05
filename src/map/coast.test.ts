import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { describe, expect, it } from 'vitest'
import { insideMultiPolygon } from './data'
// Les fronteres d'abans del 1886, tal com les deixa scripts/build-history.mjs.
import topo1700 from '../../public/data/history/1700.topo.json?raw'

type Piece = Feature<Polygon | MultiPolygon, { code: string; s: number; e: number }>

const topo = JSON.parse(topo1700) as Topology
const pieces = (feature(topo, topo.objects.borders as GeometryCollection) as FeatureCollection)
  .features as Piece[]

const DAY = 17000601

function stateAt(point: Position) {
  const hit = pieces.find(
    ({ geometry, properties: p }) =>
      p.s <= DAY &&
      DAY <= p.e &&
      insideMultiPolygon(
        point,
        geometry.type === 'Polygon'
          ? { type: 'MultiPolygon', coordinates: [geometry.coordinates] }
          : geometry,
      ),
  )
  return hit?.properties.code
}

describe("la costa d'abans del 1886", () => {
  it('és la de CShapes: els estats ja no surten al mar', () => {
    // Punts de mar que la costa de Cliopatria donava a algú.
    expect(stateAt([-9.1, 39.7])).toBeUndefined() // davant de Peniche
    expect(stateAt([-4.9, 48.5])).toBeUndefined() // davant de Brest
    expect(stateAt([-5.7, 50.2])).toBeUndefined() // davant de Cornualla
  })

  it("dona a l'estat que hi toca la terra que la costa de Cliopatria deixava fora", () => {
    expect(stateAt([3.1, 39.3])).toBe('230') // el sud de Mallorca, d'Espanya
    expect(stateAt([0.1, 53.6])).toBe('200') // Holderness, d'Anglaterra
    expect(stateAt([6, 59.3])).toBe('390') // la costa de Rogaland, de Dinamarca-Noruega
  })
})
