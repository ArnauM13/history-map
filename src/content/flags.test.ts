import { describe, expect, it } from 'vitest'
import { flagChangesBetween, flagHistory, flagOn } from './flags'
import { COUNTRY_NAMES, FLAGS } from './index'

describe('les banderes', () => {
  it('són totes al catàleg', () => {
    for (const [code, entries] of Object.entries(FLAGS.states)) {
      for (const { flag } of entries) {
        if (flag)
          expect(
            FLAGS.catalogue[flag],
            `${code} fa servir «${flag}», que no és al catàleg`,
          ).toBeDefined()
      }
    }
  })

  it("són d'estats que existeixen, i per ordre", () => {
    for (const [code, entries] of Object.entries(FLAGS.states)) {
      expect(COUNTRY_NAMES[code], `l'estat ${code} no existeix`).toBeDefined()
      const untils = entries.map((e) => e.until)
      expect(untils.at(-1), `${code}: l'última bandera no porta until`).toBeUndefined()
      const dated = untils.slice(0, -1)
      expect(dated.every(Boolean), `${code}: només l'última pot anar sense until`).toBe(true)
      expect([...dated].sort(), `${code}: les banderes han d'anar per ordre`).toEqual(dated)
    }
  })

  it('només expliquen banderes del catàleg', () => {
    for (const id of Object.keys(FLAGS.about)) {
      expect(FLAGS.catalogue[id], `el text de ${id} no té bandera`).toBeDefined()
    }
  })

  it('no deixen cap bandera del catàleg sense fer servir', () => {
    const used = new Set(Object.values(FLAGS.states).flatMap((e) => e.map((x) => x.flag)))
    for (const id of Object.keys(FLAGS.catalogue))
      expect(used.has(id), `ningú no fa servir ${id}`).toBe(true)
  })

  it("troben la bandera d'un estat en una data", () => {
    expect(flagOn(255, '1914-06-28')?.flag).toBe('de-1867')
    expect(flagOn(255, '1925-01-01')?.flag).toBe('de-1919')
    expect(flagOn(260, '1947-01-01')?.flag).toBeNull()
    expect(flagOn(365, '1950-01-01')).toEqual({
      flag: 'su-1923',
      from: '1923-11-12',
      until: '1955-08-18',
    })
  })

  it('llisten les banderes estrenades en un període', () => {
    const changes = flagChangesBetween('1931-01-01', '1931-12-31')
    expect(changes.map((c) => c.period.flag)).toContain('es-1931')
    expect(flagHistory(230)[1].from).toBe('1931-04-14')
  })

  it("citen d'on surten les dates de cada estat amb banderes", () => {
    for (const [code, entries] of Object.entries(FLAGS.states)) {
      if (entries.some((e) => e.flag)) {
        expect(
          FLAGS.sources[code]?.length,
          `${code} no cita d'on surten les seves banderes`,
        ).toBeTruthy()
      }
    }
  })
})
