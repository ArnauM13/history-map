import { describe, expect, it } from 'vitest'
import {
  addMonths,
  clampDate,
  eraOf,
  formatDate,
  fromStepIndex,
  isWithin,
  stepIndex,
  toDateNumber,
} from './date'

const main = eraOf('main', '2026-10-05')
const early = eraOf('early', '2026-10-05')

describe('les dates', () => {
  it("passen de text a un enter que s'ordena", () => {
    expect(toDateNumber('1914-06-28')).toBe(19140628)
  })

  it('van i tornen de la posició a la línia temporal: de mes en mes des del 1886', () => {
    expect(stepIndex('1886-01-15', main)).toBe(0)
    expect(stepIndex('1914-06-28', main)).toBe(341)
    expect(fromStepIndex(341, main)).toBe('1914-06-01')
  })

  it("i de sis en sis mesos a la secció d'abans, que s'acaba el 1885", () => {
    expect(early.max).toBe('1885-12-31')
    expect(stepIndex('1500-01-01', early)).toBe(0)
    expect(stepIndex('1500-08-20', early)).toBe(1)
    expect(fromStepIndex(1, early)).toBe('1500-07-01')
    expect(stepIndex('1885-12-31', early)).toBe(771)
  })

  it('no surten de la part del mapa on són', () => {
    expect(clampDate('1700-01-01', main)).toBe('1886-01-01')
    expect(clampDate('1914-06-28', early)).toBe('1885-12-31')
    expect(clampDate('1789-07-14', early)).toBe('1789-07-14')
  })

  it('sumen i resten mesos', () => {
    expect(addMonths('1885-12-31', 1)).toBe('1886-01-01')
    expect(addMonths('1914-06-28', -6)).toBe('1913-12-01')
  })

  it("saben si cauen dins d'un període, també d'un d'obert", () => {
    expect(isWithin('1916-01-01', '1914-07-28', '1918-11-11')).toBe(true)
    expect(isWithin('1919-01-01', '1914-07-28', '1918-11-11')).toBe(false)
    expect(isWithin('2025-01-01', '2014-02-20')).toBe(true)
  })

  it("s'escriuen en l'idioma de la pantalla", () => {
    expect(formatDate('1914-06-28', 'en', 'day')).toBe('June 28, 1914')
    expect(formatDate('1914-06-28', 'ca', 'month')).toMatch(/juny.*1914/)
  })
})
