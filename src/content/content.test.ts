import { describe, expect, it } from 'vitest'
import { COUNTRY_NAMES, CONFLICTS, EVENTS, contentErrors, countryName } from './index'

describe('content files', () => {
  it('are all valid', () => {
    expect(contentErrors).toEqual([])
  })

  it('include events and conflicts', () => {
    expect(EVENTS.length).toBeGreaterThan(0)
    expect(CONFLICTS.length).toBeGreaterThan(0)
  })

  it('only reference states defined in content/countries.yaml', () => {
    const known = new Set(Object.keys(COUNTRY_NAMES).map(Number))
    for (const item of [...EVENTS, ...CONFLICTS]) {
      for (const code of item.countries) {
        expect(known.has(code), `${item.id} references unknown state ${code}`).toBe(true)
      }
    }
  })

  it('date historical names in chronological order', () => {
    for (const [code, entry] of Object.entries(COUNTRY_NAMES)) {
      if (!Array.isArray(entry)) continue
      const untils = entry.map((e) => e.until)
      expect(untils.at(-1), `${code}: last entry must not have "until"`).toBeUndefined()
      const dated = untils.slice(0, -1)
      expect(dated.every(Boolean), `${code}: only the last entry may omit "until"`).toBe(true)
      expect([...dated].sort(), `${code}: entries must be sorted`).toEqual(dated)
    }
  })

  it('resolves historical names by date', () => {
    expect(countryName(365, '1910-01-01', 'en')).toBe('Russian Empire')
    expect(countryName(365, '1950-01-01', 'ca')).toBe('Unió Soviètica')
    expect(countryName(365, '2000-01-01', 'es')).toBe('Rusia')
  })
})
