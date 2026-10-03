import type { FeatureCollection, Point } from 'geojson'
import { useEffect, useState } from 'react'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { toDateNumber, type IsoDate } from '../lib/date'
import type { BorderProperties } from '../selection'

export type LabelCollection = FeatureCollection<Point, BorderProperties>

export interface BorderData {
  borders: FeatureCollection
  /** Un punt per peça de frontera, amb les mateixes propietats: on va el nom. */
  labels: LabelCollection
}

let data: Promise<BorderData> | undefined

/** Les fronteres es baixen un sol cop: el mapa i la galeria comparteixen la mateixa promesa. */
export function loadBorderData(): Promise<BorderData> {
  data ??= (async () => {
    const base = import.meta.env.BASE_URL
    const [topo, labels] = await Promise.all([
      fetch(`${base}data/borders.topo.json`).then((r) => r.json() as Promise<Topology>),
      fetch(`${base}data/labels.geojson`).then((r) => r.json() as Promise<LabelCollection>),
    ])
    const borders = feature(topo, topo.objects.borders as GeometryCollection) as FeatureCollection
    return { borders, labels }
  })()
  data.catch(() => (data = undefined))
  return data
}

/** Els punts de les etiquetes, o `null` mentre arriben. */
export function useLabels(): LabelCollection | null {
  const [labels, setLabels] = useState<LabelCollection | null>(null)
  useEffect(() => {
    let active = true
    loadBorderData()
      .then((d) => active && setLabels(d.labels))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])
  return labels
}

/** Les peces vigents en una data AAAAMMDD. */
export const featuresOn = (labels: LabelCollection, date: number) =>
  labels.features.filter((f) => f.properties.s <= date && date <= f.properties.e)

/** La peça d'un estat en una data: el que es fa servir per triar-lo des d'una llista. */
export const stateOn = (labels: LabelCollection | null, gwcode: number, date: IsoDate) =>
  labels &&
  featuresOn(labels, toDateNumber(date)).find((f) => f.properties.gwcode === gwcode)?.properties
