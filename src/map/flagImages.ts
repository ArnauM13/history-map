import type { Map as MapLibreMap } from 'maplibre-gl'
import { flagUrl } from '../content/flags'

/** L'alçada de la bandera al mapa, en píxels CSS (`icon-size` la fa créixer amb el zoom). */
const HEIGHT = 14
const PIXEL_RATIO = 2

const pending = new WeakMap<MapLibreMap, Map<string, Promise<boolean>>>()

async function rasterize(url: string): Promise<ImageData> {
  const img = new Image()
  img.src = url
  await img.decode()
  const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.5
  const height = HEIGHT * PIXEL_RATIO
  const width = Math.round(height * aspect)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  // Un marc prim: sense, les banderes blanques (Polònia, el Japó…) es perden sobre el mapa clar.
  ctx.strokeStyle = 'rgba(40, 30, 20, 0.45)'
  ctx.lineWidth = PIXEL_RATIO
  ctx.strokeRect(1, 1, width - 2, height - 2)
  return ctx.getImageData(0, 0, width, height)
}

/**
 * Registra la bandera com a imatge del mapa, un sol cop per mapa. Torna `false` si la imatge
 * no hi és (encara no s'ha baixat amb `npm run data:flags`): llavors l'estat surt sense.
 */
export function ensureFlagImage(map: MapLibreMap, id: string): Promise<boolean> {
  let byId = pending.get(map)
  if (!byId) pending.set(map, (byId = new Map()))
  let promise = byId.get(id)
  if (!promise) {
    promise = rasterize(flagUrl(id))
      .then((image) => {
        if (!map.hasImage(id)) map.addImage(id, image, { pixelRatio: PIXEL_RATIO })
        return true
      })
      .catch(() => false)
    byId.set(id, promise)
  }
  return promise
}
