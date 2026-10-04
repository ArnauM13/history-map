import type { FeatureCollection, MultiPolygon, Point, Position } from 'geojson'
import { useEffect, useState } from 'react'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { toDateNumber, type IsoDate } from '../lib/date'
import type { BorderProperties } from '../selection'

export type LabelCollection = FeatureCollection<Point, BorderProperties>

/** Una zona de la capa d'ocupacions, tal com la deixa scripts/build-occupations.mjs. */
export interface OccupationProperties {
  /** El nom del fitxer de content/occupations/, que en té els textos i les dates. */
  id: string
  /** D'on surten les vores que no són de CShapes: `line`, dibuixades a mà; `admin`, divisions d'avui. */
  approx: 'line' | 'admin' | null
  /** On va el nom: [longitud, latitud]. */
  label: [number, number]
  /** Com el `rank` dels estats: si dos noms es trepitgen, guanya la zona més gran. */
  rank: number
}

export type OccupationCollection = FeatureCollection<MultiPolygon, OccupationProperties>

export interface BorderData {
  borders: FeatureCollection
  /** Un punt per peça de frontera, amb les mateixes propietats: on va el nom. */
  labels: LabelCollection
  occupations: OccupationCollection
}

let data: Promise<BorderData> | undefined

/** Les fronteres es baixen un sol cop: el mapa i la galeria comparteixen la mateixa promesa. */
export function loadBorderData(): Promise<BorderData> {
  data ??= (async () => {
    const base = import.meta.env.BASE_URL
    const [topo, labels, occupations] = await Promise.all([
      fetch(`${base}data/borders.topo.json`).then((r) => r.json() as Promise<Topology>),
      fetch(`${base}data/labels.geojson`).then((r) => r.json() as Promise<LabelCollection>),
      fetch(`${base}data/occupations.geojson`).then(
        (r) => r.json() as Promise<OccupationCollection>,
      ),
    ])
    const borders = feature(topo, topo.objects.borders as GeometryCollection) as FeatureCollection
    return { borders, labels, occupations }
  })()
  data.catch(() => (data = undefined))
  return data
}

/** Les fronteres, les etiquetes i les zones, o `null` mentre arriben. */
export function useBorderData(): BorderData | null {
  const [data, setData] = useState<BorderData | null>(null)
  useEffect(() => {
    let active = true
    loadBorderData()
      .then((d) => active && setData(d))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])
  return data
}

/** Els punts de les etiquetes, o `null` mentre arriben. */
export const useLabels = (): LabelCollection | null => useBorderData()?.labels ?? null

/** Les peces vigents en una data AAAAMMDD. */
export const featuresOn = (labels: LabelCollection, date: number) =>
  labels.features.filter((f) => f.properties.s <= date && date <= f.properties.e)

/** La peça d'un estat en una data: el que es fa servir per triar-lo des d'una llista. */
export const stateOn = (labels: LabelCollection | null, gwcode: number, date: IsoDate) =>
  labels &&
  featuresOn(labels, toDateNumber(date)).find((f) => f.properties.gwcode === gwcode)?.properties

function inRing([x, y]: Position, ring: Position[]) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Si un punt cau dins d'un multipolígon: per saber quins noms d'estat tapa una zona. */
export const insideMultiPolygon = (point: Position, geometry: MultiPolygon) =>
  geometry.coordinates.some(
    ([outer, ...holes]) => inRing(point, outer) && !holes.some((hole) => inRing(point, hole)),
  )
