import { describe, expect, it } from 'vitest'
import { formatDate, fromMonthIndex, isWithin, monthIndex, toDateNumber } from './date'

describe('les dates', () => {
  it("passen de text a un enter que s'ordena", () => {
    expect(toDateNumber('1914-06-28')).toBe(19140628)
  })

  it('van i tornen del número de mes de la línia temporal', () => {
    expect(monthIndex('1900-01-15')).toBe(0)
    expect(monthIndex('1914-06-28')).toBe(173)
    expect(fromMonthIndex(173)).toBe('1914-06-01')
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
