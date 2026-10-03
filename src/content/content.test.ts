import { describe, expect, it } from 'vitest'
import { COUNTRY_NAMES, CONFLICTS, EVENTS, contentErrors, countryName } from './index'

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
})
