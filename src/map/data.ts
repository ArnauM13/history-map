import type { FeatureCollection, Point } from 'geojson'
import { useEffect, useState } from 'react'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { toDateNumber, type IsoDate } from '../lib/date'
import type { BorderProperties } from '../selection'

export type LabelCollection = FeatureCollection<Point, BorderProperties>

export interface BorderData {
  borders: FeatureCollection
  /** One point per border feature, with the same properties. */
  labels: LabelCollection
}

let data: Promise<BorderData> | undefined

/** Loads the border dataset once; later calls share the same promise. */
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

/** Label points of all border features, or null while loading. */
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

/** Features valid on a YYYYMMDD date. */
export const featuresOn = (labels: LabelCollection, date: number) =>
  labels.features.filter((f) => f.properties.s <= date && date <= f.properties.e)

/** Border feature of a state on a date, used to select it. */
export const stateOn = (labels: LabelCollection | null, gwcode: number, date: IsoDate) =>
  labels &&
  featuresOn(labels, toDateNumber(date)).find((f) => f.properties.gwcode === gwcode)?.properties
