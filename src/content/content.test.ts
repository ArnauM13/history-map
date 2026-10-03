import { describe, expect, it } from 'vitest'
import {
  CAPITALS,
  COUNTRY_NAMES,
  CONFLICTS,
  EVENTS,
  capitalName,
  contentErrors,
  countryName,
} from './index'
// Les fronteres, tal com les rep l'app: els noms de capital hi surten en anglès.
import labelsRaw from '../../public/data/labels.geojson?raw'

describe('el contingut', () => {
  it('es llegeix sencer, sense cap fitxer mal escrit', () => {
    expect(contentErrors).toEqual([])
  })

  it('té fets i conflictes', () => {
    expect(EVENTS.length).toBeGreaterThan(0)
    expect(CONFLICTS.length).toBeGreaterThan(0)
  })

  it("només parla d'estats que són a content/countries.yaml", () => {
    const known = new Set(Object.keys(COUNTRY_NAMES).map(Number))
    for (const item of [...EVENTS, ...CONFLICTS]) {
      for (const code of item.countries) {
        expect(known.has(code), `${item.id} parla de l'estat ${code}, que no existeix`).toBe(true)
      }
    }
  })

  it("dona els noms d'un estat per ordre de data", () => {
    for (const [code, entry] of Object.entries(COUNTRY_NAMES)) {
      if (!Array.isArray(entry)) continue
      const untils = entry.map((e) => e.until)
      expect(untils.at(-1), `${code}: l'últim nom no porta until`).toBeUndefined()
      const dated = untils.slice(0, -1)
      expect(dated.every(Boolean), `${code}: només l'últim nom pot anar sense until`).toBe(true)
      expect([...dated].sort(), `${code}: els noms han d'anar per ordre`).toEqual(dated)
    }
  })

  it('troba el nom que tenia un estat en una data', () => {
    expect(countryName(365, '1910-01-01', 'en')).toBe('Russian Empire')
    expect(countryName(365, '1950-01-01', 'ca')).toBe('Unió Soviètica')
    expect(countryName(365, '2000-01-01', 'es')).toBe('Rusia')
  })

  it('tradueix totes les capitals de les fronteres als tres idiomes', () => {
    const labels = JSON.parse(labelsRaw)
    const capitals = new Set<string>(
      labels.features.map((f: { properties: { capname?: string } }) => f.properties.capname),
    )
    for (const name of capitals) {
      if (!name) continue
      for (const lang of ['ca', 'es', 'en'] as const) {
        expect(CAPITALS[name]?.[lang], `${name} en ${lang}`).toBeTruthy()
      }
    }
    expect(capitalName('Kiev', 'ca')).toBe('Kíiv')
    expect(capitalName('Bukarest', 'en')).toBe('Bucharest')
  })
})
