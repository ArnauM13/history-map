import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// MapLibre busca el seu worker al costat del mòdul, i un cop empaquetat no hi és: que el posi Vite.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { useEffect, useRef, useState } from 'react'
import { countryName } from '../content'
import { flagOn } from '../content/flags'
import type { Conflict, HistoricalEvent } from '../content/schema'
import { useI18n } from '../i18n'
import { toDateNumber, type IsoDate } from '../lib/date'
import type { BorderProperties, Selection } from '../selection'
import { featuresOn, loadBorderData, type LabelCollection } from './data'
import { ensureFlagImage } from './flagImages'
import { EUROPE_BOUNDS, MAX_BOUNDS, createStyle, validOn } from './style'

const ATTRIBUTION =
  '<a href="https://icr.ethz.ch/data/cshapes/" target="_blank" rel="noopener">CShapes 2.0</a> (CC BY-NC-SA 4.0) · <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a> · <a href="https://www.wikipedia.org/" target="_blank" rel="noopener">Wikipedia</a>'

maplibregl.setWorkerUrl(workerUrl)

interface Props {
  date: IsoDate
  showFlags: boolean
  events: HistoricalEvent[]
  conflicts: Conflict[]
  selection: Selection | null
  onSelect: (selection: Selection | null) => void
}

const geojson = (map: maplibregl.Map, id: string) => map.getSource(id) as maplibregl.GeoJSONSource

export function MapView({ date, showFlags, events, conflicts, selection, onSelect }: Props) {
  const { lang, t } = useI18n()
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const labelsRef = useRef<LabelCollection | null>(null)
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
    for (const layer of ['borders-fill', 'events', 'conflicts']) {
      map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'))
      map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''))
    }

    map.on('click', (e) => {
      const [hit] = map.queryRenderedFeatures(e.point, {
        layers: ['conflicts', 'events', 'borders-fill'],
      })
      if (!hit) return onSelectRef.current(null)
      const id = String(hit.properties.id)
      if (hit.layer.id === 'conflicts') onSelectRef.current({ kind: 'conflict', id })
      else if (hit.layer.id === 'events') onSelectRef.current({ kind: 'event', id })
      else onSelectRef.current({ kind: 'country', feature: hit.properties as BorderProperties })
    })

    const styleReady = new Promise((resolve) => map.once('load', resolve))
    Promise.all([loadBorderData(), styleReady])
      .then(([{ borders, labels }]) => {
        if (mapRef.current !== map) return
        geojson(map, 'borders').setData(borders)
        // MapLibre obre el crèdit en carregar i no el plega fins que es mou el mapa: en una
        // pantalla estreta tapava una franja sencera. Hi és igualment, rere la «i».
        if (map.getContainer().clientWidth < 640) {
          map
            .getContainer()
            .querySelector('.maplibregl-ctrl-attrib')
            ?.classList.remove('maplibregl-compact-show')
        }
        labelsRef.current = labels
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

  // Les fronteres vigents en la data.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return
    const filter = validOn(toDateNumber(date))
    map.setFilter('borders-fill', filter)
    map.setFilter('borders-line', filter)
  }, [date, status])

  // Les etiquetes, amb el nom (i la bandera) que tenia cada estat en aquella data.
  useEffect(() => {
    const map = mapRef.current
    const labels = labelsRef.current
    if (!map || !labels || status !== 'ready') return
    let cancelled = false
    const features = featuresOn(labels, toDateNumber(date)).map((f) => ({
      ...f,
      properties: {
        ...f.properties,
        name: countryName(f.properties.gwcode, date, lang, f.properties.country_name),
      },
    }))
    const flags = new Map<number, string>()
    if (showFlags) {
      for (const f of features) {
        const flag = flagOn(f.properties.gwcode, date)?.flag
        if (flag) flags.set(f.properties.gwcode, flag)
      }
    }
    const ids = [...new Set(flags.values())]
    Promise.all(ids.map((id) => ensureFlagImage(map, id))).then((loaded) => {
      if (cancelled) return
      const available = new Set(ids.filter((_, i) => loaded[i]))
      geojson(map, 'labels').setData({
        type: 'FeatureCollection',
        features: features.map((f) => {
          const flag = flags.get(f.properties.gwcode)
          // `flag` només si la imatge hi és: l'estil ho mira amb ['has', 'flag'] per deixar lloc al nom.
          return flag && available.has(flag) ? { ...f, properties: { ...f.properties, flag } } : f
        }),
      })
    })
    return () => {
      cancelled = true
    }
  }, [date, lang, showFlags, status])

  // El contorn de l'estat triat.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return
    const gwcode = selection?.kind === 'country' ? selection.feature.gwcode : -1
    map.setFilter('borders-selected', [
      'all',
      ['==', ['get', 'gwcode'], gwcode],
      validOn(toDateNumber(date)),
    ])
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

  // Si el fet o el conflicte triat queda fora de la vista, s'hi va.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selection || selection.kind === 'country') return
    const item =
      selection.kind === 'event'
        ? events.find((e) => e.id === selection.id)
        : conflicts.find((c) => c.id === selection.id)
    if (item?.location && !map.getBounds().contains(item.location)) {
      map.easeTo({ center: item.location, duration: 800 })
    }
  }, [selection, events, conflicts])

  return (
    <div className="map">
      <div ref={container} className="map-canvas" />
      {status !== 'ready' && (
        <div className="map-status" role="status">
          {status === 'loading' ? t('loadingMap') : t('mapError')}
        </div>
      )}
    </div>
  )
}
