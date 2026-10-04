import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// MapLibre busca el seu worker al costat del mòdul, i un cop empaquetat no hi és: que el posi Vite.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { useEffect, useRef, useState } from 'react'
import { OCCUPATIONS, controlOn, countryName, localize, stateName } from '../content'
import { flagOn } from '../content/flags'
import type { Conflict, HistoricalEvent } from '../content/schema'
import { translator, useI18n } from '../i18n'
import { toDateNumber, type IsoDate } from '../lib/date'
import type { BorderProperties, Selection } from '../selection'
import {
  featuresOn,
  insideMultiPolygon,
  loadBorderData,
  useHistoryVersion,
  withHistory,
  type BorderData,
  type LabelCollection,
  type OccupationCollection,
} from './data'
import { ensureFlagImage } from './flagImages'
import { EUROPE_BOUNDS, MAX_BOUNDS, addHatches, createStyle, validOn } from './style'

const ATTRIBUTION =
  '<a href="https://icr.ethz.ch/data/cshapes/" target="_blank" rel="noopener">CShapes 2.0</a> (CC BY-NC-SA 4.0) · <a href="https://github.com/Seshat-Global-History-Databank/cliopatria" target="_blank" rel="noopener">Cliopatria</a> (CC BY 4.0) · <a href="https://www.openhistoricalmap.org/" target="_blank" rel="noopener">OpenHistoricalMap</a> · <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a> · <a href="https://www.wikipedia.org/" target="_blank" rel="noopener">Wikipedia</a>'

maplibregl.setWorkerUrl(workerUrl)

interface Props {
  date: IsoDate
  /** Si les fronteres del segle de la data (abans del 1886) ja han arribat. */
  historyStatus: 'ready' | 'loading' | 'error'
  showFlags: boolean
  showOccupations: boolean
  events: HistoricalEvent[]
  conflicts: Conflict[]
  selection: Selection | null
  onSelect: (selection: Selection | null) => void
}

const geojson = (map: maplibregl.Map, id: string) => map.getSource(id) as maplibregl.GeoJSONSource

const ZONES = new Map(OCCUPATIONS.map((o) => [o.id, o]))

/** Les zones de la capa d'ocupacions que valen en una data, amb qui les controlava i com. */
function zonesOn(collection: OccupationCollection, date: IsoDate) {
  return collection.features.flatMap((feature) => {
    const zone = ZONES.get(feature.properties.id)
    const period = zone && controlOn(zone, date)
    return zone && period ? [{ feature, zone, period }] : []
  })
}

const ZONE_LAYERS = ['occupations-fill', 'occupations-hatch']

/** Més que el `rank` de l'estat més gran: el que se li resta passa una etiqueta davant de tot un grup. */
const ZONE_PRIORITY = 10_000

export function MapView({
  date,
  historyStatus,
  showFlags,
  showOccupations,
  events,
  conflicts,
  selection,
  onSelect,
}: Props) {
  const { lang, t } = useI18n()
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const baseRef = useRef<BorderData | null>(null)
  const labelsRef = useRef<LabelCollection | null>(null)
  const occupationsRef = useRef<OccupationCollection | null>(null)
  /** El color de cada estat (l'índex `c` de la paleta), per pintar les zones del de qui les controla. */
  const coloursRef = useRef(new Map<string, number>())
  const historyVersion = useHistoryVersion()
  const onSelectRef = useRef(onSelect)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  // El mapa es crea un sol cop; la resta d'efectes només en canvien les dades i els filtres.
  useEffect(() => {
    const glyphs = `${location.origin}${import.meta.env.BASE_URL}fonts/{fontstack}/{range}.pbf`
    const map = new maplibregl.Map({
      container: container.current!,
      style: createStyle(glyphs),
      bounds: EUROPE_BOUNDS,
      maxBounds: MAX_BOUNDS,
      renderWorldCopies: false,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: { compact: true, customAttribution: ATTRIBUTION },
    })
    map.touchZoomRotate.disableRotation()
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
    mapRef.current = map

    let hovered: string | number | undefined
    const setHover = (id: string | number | undefined) => {
      if (hovered !== undefined)
        map.setFeatureState({ source: 'borders', id: hovered }, { hover: false })
      hovered = id
      if (id !== undefined) map.setFeatureState({ source: 'borders', id }, { hover: true })
    }
    map.on('mousemove', 'borders-fill', (e) => setHover(e.features?.[0]?.id))
    map.on('mouseleave', 'borders-fill', () => setHover(undefined))
    for (const layer of ['borders-fill', ...ZONE_LAYERS, 'events', 'conflicts']) {
      map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'))
      map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''))
    }

    map.on('click', (e) => {
      const [hit] = map.queryRenderedFeatures(e.point, {
        layers: ['conflicts', 'events', ...ZONE_LAYERS, 'borders-fill'],
      })
      if (!hit) return onSelectRef.current(null)
      const id = String(hit.properties.id)
      if (hit.layer.id === 'conflicts') onSelectRef.current({ kind: 'conflict', id })
      else if (hit.layer.id === 'events') onSelectRef.current({ kind: 'event', id })
      else if (ZONE_LAYERS.includes(hit.layer.id)) onSelectRef.current({ kind: 'occupation', id })
      else onSelectRef.current({ kind: 'country', feature: hit.properties as BorderProperties })
    })

    const styleReady = new Promise((resolve) => map.once('load', resolve))
    map.once('load', () => addHatches(map))
    Promise.all([loadBorderData(), styleReady])
      .then(([data]) => {
        if (mapRef.current !== map) return
        baseRef.current = data
        occupationsRef.current = data.occupations
        // MapLibre obre el crèdit en carregar i no el plega fins que es mou el mapa: en una
        // pantalla estreta tapava una franja sencera. Hi és igualment, rere la «i».
        if (map.getContainer().clientWidth < 640) {
          map
            .getContainer()
            .querySelector('.maplibregl-ctrl-attrib')
            ?.classList.remove('maplibregl-compact-show')
        }
        setStatus('ready')
      })
      .catch((error: unknown) => {
        console.error(error)
        setStatus('error')
      })

    return () => {
      mapRef.current = null
      map.remove()
    }
  }, [])

  // Les fronteres: les de CShapes i les dels segles d'abans que ja han arribat.
  useEffect(() => {
    const map = mapRef.current
    const base = baseRef.current
    if (!map || !base || status !== 'ready') return
    const { borders, labels } = withHistory(base)
    geojson(map, 'borders').setData(borders)
    for (const f of borders.features) {
      const { code, c } = f.properties as BorderProperties
      if (!coloursRef.current.has(code)) coloursRef.current.set(code, c)
    }
    labelsRef.current = labels
  }, [historyVersion, status])

  // Les fronteres vigents en la data.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return
    const filter = validOn(toDateNumber(date))
    map.setFilter('borders-fill', filter)
    map.setFilter('borders-line', filter)
  }, [date, status])

  // Les zones de la capa d'ocupacions, del color de qui les controlava.
  useEffect(() => {
    const map = mapRef.current
    const occupations = occupationsRef.current
    if (!map || !occupations || status !== 'ready') return
    const zones = showOccupations ? zonesOn(occupations, date) : []
    geojson(map, 'occupations').setData({
      type: 'FeatureCollection',
      features: zones.map(({ feature, period }) => ({
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          id: feature.properties.id,
          kind: period.kind,
          c: coloursRef.current.get(period.by) ?? 0,
        },
      })),
    })
  }, [date, showOccupations, status])

  // Les etiquetes, amb el nom (i la bandera) que tenia cada estat en aquella data. On hi ha una
  // zona ocupada, el nom de la zona substitueix el de l'estat que queda a sota. Si no hi caben
  // tots, primer els ocupants, després les zones i després la resta: les zones porten el color
  // de l'ocupant, i sense el seu nom el 1942 hi havia mig continent rosa i cap «Alemanya».
  useEffect(() => {
    const map = mapRef.current
    const labels = labelsRef.current
    const occupations = occupationsRef.current
    if (!map || !labels || !occupations || status !== 'ready') return
    let cancelled = false
    const zones = showOccupations ? zonesOn(occupations, date) : []
    const occupiers = new Set(zones.map(({ period }) => period.by))
    const states = featuresOn(labels, toDateNumber(date))
      .filter((f) =>
        zones.every(({ feature }) => !insideMultiPolygon(f.geometry.coordinates, feature.geometry)),
      )
      .map((f) => ({
        type: 'Feature' as const,
        geometry: f.geometry,
        properties: {
          ...f.properties,
          name: stateName(f.properties, date, lang),
          rank: f.properties.rank - (occupiers.has(f.properties.code) ? 2 * ZONE_PRIORITY : 0),
        },
        flagId: flagOn(f.properties.code, date)?.flag,
      }))
    const zoneLabels = zones.map(({ feature, zone, period }) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: feature.properties.label },
      // `status` diferent d'«independent»: el nom va en cursiva, com el dels territoris dependents.
      properties: {
        name: localize(zone.label ?? zone.title, lang),
        // Sota el nom, qui la controlava i com, i per què: el que el color sol no diu.
        controlledBy: translator(lang).t(`zoneOnMap.${period.kind}`, {
          by: countryName(period.by, date, lang),
        }),
        cause: localize(period.cause, lang),
        status: 'zone',
        rank: feature.properties.rank - ZONE_PRIORITY,
      },
      flagId: zone.flag,
    }))
    const features = [...states, ...zoneLabels]
    const ids = showFlags ? [...new Set(features.flatMap((f) => (f.flagId ? [f.flagId] : [])))] : []
    Promise.all(ids.map((id) => ensureFlagImage(map, id))).then((loaded) => {
      if (cancelled) return
      const available = new Set(ids.filter((_, i) => loaded[i]))
      geojson(map, 'labels').setData({
        type: 'FeatureCollection',
        features: features.map(({ flagId, ...f }) =>
          // `flag` només si la imatge hi és: l'estil ho mira amb ['has', 'flag'] per deixar lloc al nom.
          flagId && available.has(flagId)
            ? { ...f, properties: { ...f.properties, flag: flagId } }
            : f,
        ),
      })
    })
    return () => {
      cancelled = true
    }
  }, [date, lang, showFlags, showOccupations, status, historyVersion])

  // El contorn de l'estat triat.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return
    const code = selection?.kind === 'country' ? selection.feature.code : ''
    map.setFilter('borders-selected', [
      'all',
      ['==', ['get', 'code'], code],
      validOn(toDateNumber(date)),
    ])
    const zone = selection?.kind === 'occupation' ? selection.id : ''
    map.setFilter('occupations-selected', ['==', ['get', 'id'], zone])
  }, [selection, date, status])

  // Les marques dels fets de l'any i dels conflictes oberts.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return
    const isSelected = (kind: Selection['kind'], id: string) =>
      selection?.kind === kind && 'id' in selection && selection.id === id
    geojson(map, 'conflicts').setData({
      type: 'FeatureCollection',
      features: conflicts.map((c) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: c.location },
        properties: { id: c.id, selected: isSelected('conflict', c.id) },
      })),
    })
    geojson(map, 'events').setData({
      type: 'FeatureCollection',
      features: events
        .filter((e) => e.location)
        .map((e) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: e.location! },
          properties: { id: e.id, selected: isSelected('event', e.id), upcoming: e.date > date },
        })),
    })
  }, [events, conflicts, selection, date, status])

  // Si el fet, el conflicte o la zona triats queden fora de la vista, s'hi va.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selection || selection.kind === 'country') return
    const location =
      selection.kind === 'event'
        ? events.find((e) => e.id === selection.id)?.location
        : selection.kind === 'conflict'
          ? conflicts.find((c) => c.id === selection.id)?.location
          : occupationsRef.current?.features.find((f) => f.properties.id === selection.id)
              ?.properties.label
    if (location && !map.getBounds().contains(location)) {
      map.easeTo({ center: location, duration: 800 })
    }
  }, [selection, events, conflicts])

  return (
    <div className="map">
      <div ref={container} className="map-canvas" />
      {(status !== 'ready' || historyStatus !== 'ready') && (
        <div className="map-status" role="status">
          {status === 'error' || historyStatus === 'error' ? t('mapError') : t('loadingMap')}
        </div>
      )}
    </div>
  )
}
