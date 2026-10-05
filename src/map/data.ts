import type { Feature, FeatureCollection, MultiPolygon, Point, Position } from 'geojson'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { feature, merge } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { EXACT_BORDERS_FROM, FIRST_YEAR, toDateNumber, yearOf, type IsoDate } from '../lib/date'
import type { BorderProperties } from '../selection'

/** `rank`: si dos noms es trepitgen, guanya l'estat més gran (scripts/build-borders.mjs). */
export type LabelCollection = FeatureCollection<Point, BorderProperties & { rank: number }>

/** Una zona de la capa d'ocupacions, tal com la deixa scripts/build-occupations.mjs. */
export interface OccupationProperties {
  /** El nom del fitxer de content/occupations/, que en té els textos i les dates. */
  id: string
  /** D'on surten les vores que no són de CShapes: `line`, dibuixades a mà; `admin`, divisions d'avui. */
  approx: ('line' | 'admin')[]
  /** El dia de la instantània de DeepStateMap d'on surt el front (la guerra russoucraïnesa). */
  front?: IsoDate
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
  /**
   * Tota la terra del mapa: el fons sobre el qual es pinten els estats. On en una data no hi ha
   * cap estat (l'estepa del 1550, que Cliopatria no dona a ningú), es veu la terra, no el mar.
   */
  land: MultiPolygon
}

/** El final de les peces que encara valen avui (scripts/build-borders.mjs). */
const OPEN_END = 99991231

let data: Promise<BorderData> | undefined

/** Les fronteres de CShapes es baixen un sol cop: el mapa i la galeria comparteixen la promesa. */
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
    const object = topo.objects.borders as GeometryCollection
    const borders = feature(topo, object) as FeatureCollection
    // Les fronteres d'avui cobreixen tota la terra, i amb els mateixos arcs: la costa del fons
    // és la mateixa que la dels estats.
    const land = merge(
      topo,
      object.geometries.filter((g) => (g.properties as { e: number }).e === OPEN_END) as Parameters<
        typeof merge
      >[1],
    )
    return { borders, labels, occupations, land }
  })()
  data.catch(() => (data = undefined))
  return data
}

// ── Abans del 1886 ───────────────────────────────────────────────────────────

/**
 * Les fronteres d'abans del 1886 (scripts/build-history.mjs) van en un fitxer per segle, que es
 * baixa quan la línia temporal hi entra: tots junts pesen deu vegades les de CShapes.
 */
interface HistoryPart {
  borders: Feature[]
  labels: LabelCollection['features']
}

const historyRequests = new Map<number, Promise<HistoryPart>>()
const historyParts = new Map<number, HistoryPart>()
const historyListeners = new Set<() => void>()
/** Puja cada cop que arriba un segle: el que han de mirar el mapa i el panell per refer-se. */
let historyVersion = 0

const EXACT_YEAR = yearOf(EXACT_BORDERS_FROM)

/** El segle que cal per ensenyar un any (el 1700 per al 1789), o cap des del 1886. */
export const centuryOf = (year: number): number | undefined =>
  year >= EXACT_YEAR ? undefined : Math.floor(Math.max(year, FIRST_YEAR) / 100) * 100

export function loadHistory(century: number): Promise<HistoryPart> {
  let request = historyRequests.get(century)
  if (!request) {
    const base = `${import.meta.env.BASE_URL}data/history/${century}`
    request = Promise.all([
      fetch(`${base}.topo.json`).then((r) => r.json() as Promise<Topology>),
      fetch(`${base}.labels.geojson`).then((r) => r.json() as Promise<LabelCollection>),
    ]).then(([topo, labels]) => ({
      borders: (feature(topo, topo.objects.borders as GeometryCollection) as FeatureCollection)
        .features,
      labels: labels.features,
    }))
    historyRequests.set(century, request)
    request.then(
      (part) => {
        historyParts.set(century, part)
        historyVersion++
        historyListeners.forEach((listener) => listener())
      },
      // Si falla, el proper cop que calgui es torna a demanar.
      () => historyRequests.delete(century),
    )
  }
  return request
}

const subscribeHistory = (listener: () => void) => {
  historyListeners.add(listener)
  return () => historyListeners.delete(listener)
}

/** Un número que canvia cada cop que arriba un segle. */
export const useHistoryVersion = () => useSyncExternalStore(subscribeHistory, () => historyVersion)

/**
 * Baixa el segle d'una data, i el del costat si s'hi acosta, perquè reproduir la línia no
 * s'aturi a cada canvi de segle. Diu si el de la data ja hi és, o si no s'ha pogut baixar.
 */
export function useHistoryFor(date: IsoDate): 'ready' | 'loading' | 'error' {
  useHistoryVersion()
  const year = yearOf(date)
  const century = centuryOf(year)
  const [failed, setFailed] = useState<number | undefined>()
  useEffect(() => {
    if (century === undefined) return
    let active = true
    loadHistory(century).catch(() => active && setFailed(century))
    const near = centuryOf(year % 100 >= 90 ? year + 10 : year - 10)
    if (near !== undefined && near !== century) loadHistory(near).catch(() => {})
    return () => {
      active = false
    }
  }, [century, year])
  if (century === undefined || historyParts.has(century)) return 'ready'
  return failed === century ? 'error' : 'loading'
}

/** Una peça que va de dos segles surt als dos fitxers, amb el mateix identificador. */
function uniqueById<T extends Feature>(features: T[]): T[] {
  const seen = new Set<string | number | undefined>()
  return features.filter((f) => !seen.has(f.id) && seen.add(f.id))
}

let combined: { base: BorderData; version: number; data: BorderData } | undefined

/** Les fronteres de CShapes amb les dels segles d'abans que ja s'han baixat. */
export function withHistory(base: BorderData): BorderData {
  if (combined?.base === base && combined.version === historyVersion) return combined.data
  const parts = [...historyParts.entries()].sort(([a], [b]) => a - b).map(([, part]) => part)
  const data =
    parts.length === 0
      ? base
      : {
          ...base,
          borders: {
            ...base.borders,
            features: [...base.borders.features, ...uniqueById(parts.flatMap((p) => p.borders))],
          },
          labels: {
            ...base.labels,
            features: [...base.labels.features, ...uniqueById(parts.flatMap((p) => p.labels))],
          },
        }
  combined = { base, version: historyVersion, data }
  return data
}

/** Les fronteres, les etiquetes i les zones, o `null` mentre arriben. */
export function useBorderData(): BorderData | null {
  const [data, setData] = useState<BorderData | null>(null)
  useHistoryVersion()
  useEffect(() => {
    let active = true
    loadBorderData()
      .then((d) => active && setData(d))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])
  return data && withHistory(data)
}

/** Els punts de les etiquetes, o `null` mentre arriben. */
export const useLabels = (): LabelCollection | null => useBorderData()?.labels ?? null

/**
 * Les peces vigents en una data AAAAMMDD, una per estat. Abans del 1886, Cliopatria en dona de
 * vegades dues d'un mateix estat alhora (la Rússia del 1812 i la Besaràbia que acabava de
 * guanyar): el nom va a la més gran, i l'estat surt un sol cop a la galeria.
 */
export function featuresOn(labels: LabelCollection, date: number) {
  const byCode = new Map<string, LabelCollection['features'][number]>()
  for (const f of labels.features) {
    if (f.properties.s > date || date > f.properties.e) continue
    const known = byCode.get(f.properties.code)
    if (!known || f.properties.rank < known.properties.rank) byCode.set(f.properties.code, f)
  }
  return [...byCode.values()]
}

/** La peça d'un estat en una data: el que es fa servir per triar-lo des d'una llista. */
export const stateOn = (labels: LabelCollection | null, code: string, date: IsoDate) =>
  labels &&
  featuresOn(labels, toDateNumber(date)).find((f) => f.properties.code === code)?.properties

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
