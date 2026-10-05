import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { describe, expect, it } from 'vitest'
import { insideMultiPolygon } from './data'
// Les fronteres d'abans del 1886, tal com les deixa scripts/build-history.mjs.
import topo1600 from '../../public/data/history/1600.topo.json?raw'
import topo1700 from '../../public/data/history/1700.topo.json?raw'

type Piece = Feature<Polygon | MultiPolygon, { code: string; s: number; e: number }>

const piecesOf = (raw: string) => {
  const topo = JSON.parse(raw) as Topology
  return (feature(topo, topo.objects.borders as GeometryCollection) as FeatureCollection)
    .features as Piece[]
}
const pieces = [...piecesOf(topo1600), ...piecesOf(topo1700)]

/** El codi de l'estat que té un punt en una data AAAAMMDD, o `undefined` si no és de ningú. */
function stateAt(point: Position, date: number) {
  const hit = pieces.find(
    ({ geometry, properties: p }) =>
      p.s <= date &&
      date <= p.e &&
      insideMultiPolygon(
        point,
        geometry.type === 'Polygon'
          ? { type: 'MultiPolygon', coordinates: [geometry.coordinates] }
          : geometry,
      ),
  )
  return hit?.properties.code
}

describe('els buits de les guerres', () => {
  it('donen el territori a qui el tenia abans, no el deixen en blanc', () => {
    // Orel, al Període Tumultuós, amb els polonesos a Moscou: continua sent russa (DADES.md §0.1).
    expect(stateAt([36.08, 52.97], 16100701)).toBe('365')
    // Kíiv, a la guerra de Khmelnitski i al Diluvi: de la República de les Dues Nacions.
    expect(stateAt([30.52, 50.45], 16600701)).toBe('Q172107')
    // Derry, a la guerra dels Nou Anys: anglesa.
    expect(stateAt([-7.31, 55.0], 16000701)).toBe('200')
  })
})
