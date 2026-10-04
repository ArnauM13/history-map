import { describe, expect, it } from 'vitest'
import { addMonths, formatDate, fromStepIndex, isWithin, stepIndex, toDateNumber } from './date'

describe('les dates', () => {
  it("passen de text a un enter que s'ordena", () => {
    expect(toDateNumber('1914-06-28')).toBe(19140628)
  })

  it('van i tornen de la posició a la línia temporal: de sis en sis mesos fins al 1886', () => {
    expect(stepIndex('1500-01-01')).toBe(0)
    expect(stepIndex('1500-08-20')).toBe(1)
    expect(fromStepIndex(1)).toBe('1500-07-01')
    expect(stepIndex('1885-12-31')).toBe(771)
    expect(stepIndex('1886-01-15')).toBe(772)
    expect(stepIndex('1914-06-28')).toBe(772 + 341)
    expect(fromStepIndex(772 + 341)).toBe('1914-06-01')
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
