import { describe, expect, it } from 'vitest'
import {
  CAPITALS,
  COUNTRY_NAMES,
  CONFLICTS,
  EVENTS,
  FLAGS,
  KEY_DATES,
  OCCUPATIONS,
  activeOccupations,
  capitalName,
  contentErrors,
  controlOn,
  countryName,
  wikipediaLink,
} from './index'
// Les fronteres, tal com les rep l'app: els noms de capital hi surten en anglès.
import labelsRaw from '../../public/data/labels.geojson?raw'
// Les zones de la capa d'ocupacions, tal com les deixa scripts/build-occupations.mjs.
import occupationsRaw from '../../public/data/occupations.geojson?raw'

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

  it('cita una font per a cada fet i cada conflicte', () => {
    for (const item of [...EVENTS, ...CONFLICTS]) {
      expect(
        item.wikipedia?.en || item.sources.length > 0,
        `${item.id} no cita cap font`,
      ).toBeTruthy()
    }
  })

  it("cita un article per a cada nom d'estat", () => {
    for (const [code, entry] of Object.entries(COUNTRY_NAMES)) {
      for (const name of Array.isArray(entry) ? entry : [entry]) {
        expect(name.wiki, `${code} (${name.ca ?? name.en}) no cita cap article`).toBeTruthy()
      }
    }
  })

  it("troba el títol de la Viquipèdia en l'idioma de la pantalla", () => {
    expect(wikipediaLink('Treaty of Versailles', 'ca')?.title).toBe('Tractat de Versalles')
    expect(wikipediaLink('Treaty of Versailles', 'en')?.url).toBe(
      'https://en.wikipedia.org/wiki/Treaty_of_Versailles',
    )
    expect(wikipediaLink({ en: 'Brexit', ca: 'Brexit (ca)' }, 'ca')?.title).toBe('Brexit (ca)')
  })

  it("cita una font per a cada ocupació, i només parla d'estats que existeixen", () => {
    const known = new Set(Object.keys(COUNTRY_NAMES).map(Number))
    for (const zone of OCCUPATIONS) {
      expect(
        zone.wikipedia?.en || zone.sources.length > 0,
        `${zone.id} no cita cap font`,
      ).toBeTruthy()
      for (const code of [...zone.countries, ...zone.control.map((p) => p.by)]) {
        expect(known.has(code), `${zone.id} parla de l'estat ${code}, que no existeix`).toBe(true)
      }
      if (zone.flag) {
        expect(
          FLAGS.catalogue[zone.flag],
          `${zone.id}: «${zone.flag}» no és al catàleg`,
        ).toBeDefined()
      }
    }
  })

  it('dibuixa cada ocupació, i només les que tenen text', () => {
    const shapes = JSON.parse(occupationsRaw).features.map(
      (f: { properties: { id: string } }) => f.properties.id,
    )
    expect([...shapes].sort()).toEqual(OCCUPATIONS.map((o) => o.id).sort())
  })

  it('troba qui controlava una zona en una data', () => {
    const albania = OCCUPATIONS.find((o) => o.id === 'albania')!
    expect(controlOn(albania, '1940-01-01')?.by).toBe(325)
    expect(controlOn(albania, '1944-01-01')).toMatchObject({ by: 255, from: '1943-09-09' })
    expect(controlOn(albania, '1945-01-01')).toBeUndefined()
    const ids = activeOccupations('1942-01-01').map((o) => o.id)
    expect(ids).toContain('general-government')
    expect(ids).not.toContain('occupied-poland')
    expect(KEY_DATES).toContain('1939-10-26')
  })
})
