import { describe, expect, it } from 'vitest'
import { stateName, stateWiki } from '../content'
import { LANGUAGES } from '../i18n'
import type { LabelCollection } from './data'
// Les fronteres d'abans del 1886, tal com les deixa scripts/build-history.mjs.
import labels1500 from '../../public/data/history/1500.labels.geojson?raw'
import labels1600 from '../../public/data/history/1600.labels.geojson?raw'
import labels1700 from '../../public/data/history/1700.labels.geojson?raw'
import labels1800 from '../../public/data/history/1800.labels.geojson?raw'

const pieces = [labels1500, labels1600, labels1700, labels1800].flatMap(
  (raw) => (JSON.parse(raw) as LabelCollection).features,
)

describe("les fronteres d'abans del 1886", () => {
  it('van del 1500 al 1885, on comença CShapes', () => {
    for (const { properties: p } of pieces) {
      expect(p.s).toBeGreaterThanOrEqual(15000101)
      expect(p.e).toBeLessThanOrEqual(18851231)
      expect(p.s, `${p.country_name}: comença després d'acabar`).toBeLessThanOrEqual(p.e)
    }
  })

  it('porten un codi, un QID de Wikidata i un article que en fa de font', () => {
    for (const { properties: p } of pieces) {
      expect(p.code, `${p.country_name} no té codi`).toMatch(/^(\d+|Q\d+)$/)
      expect(p.qid, `${p.country_name} no té QID`).toMatch(/^Q\d+$/)
      expect(stateWiki(p, '1700-01-01'), `${p.country_name} no cita cap article`).toBeTruthy()
    }
  })

  it('tenen nom en els tres idiomes', () => {
    for (const { properties: p } of pieces) {
      for (const lang of LANGUAGES) {
        expect(stateName(p, '1700-01-01', lang), `${p.qid} no té nom`).not.toBe(p.code)
      }
    }
  })

  it("diuen el règim, no només l'estat: la França del 1700 és el Regne de França", () => {
    const at = (year: number) =>
      pieces.find(
        ({ properties: p }) =>
          p.code === '220' && p.s <= year * 10000 + 101 && year * 10000 + 101 <= p.e,
      )!.properties
    expect(stateName(at(1700), '1700-01-01', 'ca')).toBe('Regne de França')
    expect(stateName(at(1810), '1810-01-01', 'es')).toBe('Primer Imperio francés')
    expect(stateName(at(1860), '1860-01-01', 'en')).toBe('Second French Empire')
  })
})
