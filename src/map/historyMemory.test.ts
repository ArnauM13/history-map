import { afterEach, describe, expect, it, vi } from 'vitest'
import { keepHistory, loadHistory, withHistory, type BorderData } from './data'

const topology = {
  type: 'Topology',
  objects: { borders: { type: 'GeometryCollection', geometries: [] } },
  arcs: [],
}

/** Un segle amb una sola peça, perquè es vegi quin segle hi és. */
const piece = (century: number) => ({
  type: 'Feature',
  id: century,
  geometry: { type: 'Point', coordinates: [0, 0] },
  properties: { s: century * 10000 + 101, e: century * 10000 + 1231 },
})

const base = {
  borders: { type: 'FeatureCollection', features: [] },
  labels: { type: 'FeatureCollection', features: [] },
} as unknown as BorderData

function stubFetch() {
  const fetch = vi.fn((url: string) => {
    const century = Number(/(\d{4})\./.exec(url)![1])
    const body = url.endsWith('.topo.json')
      ? { ...topology, objects: { borders: { type: 'GeometryCollection', geometries: [] } } }
      : { type: 'FeatureCollection', features: [piece(century)] }
    return Promise.resolve({ json: () => Promise.resolve(body) })
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}

const labelCenturies = () =>
  withHistory(base).labels.features.map((f) => Math.floor(f.properties.s / 1e6) * 100)

afterEach(() => {
  keepHistory([])
  vi.unstubAllGlobals()
})

describe('els segles d’abans del 1886, a memòria', () => {
  it('només hi queden els que el mapa necessita', async () => {
    stubFetch()
    keepHistory([1500, 1600])
    await Promise.all([loadHistory(1500), loadHistory(1600)])
    expect(labelCenturies()).toEqual([1500, 1600])

    keepHistory([1600, 1700])
    await loadHistory(1700)
    expect(labelCenturies()).toEqual([1600, 1700])
  })

  it('un segle que arriba quan la línia ja ha passat de llarg no s’hi queda', async () => {
    stubFetch()
    keepHistory([1500])
    const late = loadHistory(1500)
    keepHistory([1800])
    await late
    expect(labelCenturies()).toEqual([])
  })

  it('un segle descartat es torna a demanar si cal', async () => {
    const fetch = stubFetch()
    keepHistory([1500])
    await loadHistory(1500)
    keepHistory([])
    keepHistory([1500])
    await loadHistory(1500)
    expect(fetch).toHaveBeenCalledTimes(4)
    expect(labelCenturies()).toEqual([1500])
  })
})
