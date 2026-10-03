import { describe, expect, it } from 'vitest'
import { flagChangesBetween, flagHistory, flagOn } from './flags'
import { COUNTRY_NAMES, FLAGS } from './index'

describe('flags', () => {
  it('reference only flags defined in the catalogue', () => {
    for (const [code, entries] of Object.entries(FLAGS.states)) {
      for (const { flag } of entries) {
        if (flag) expect(FLAGS.catalogue[flag], `${code} uses unknown flag "${flag}"`).toBeDefined()
      }
    }
  })

  it('are defined for known states only, in chronological order', () => {
    for (const [code, entries] of Object.entries(FLAGS.states)) {
      expect(COUNTRY_NAMES[code], `unknown state ${code}`).toBeDefined()
      const untils = entries.map((e) => e.until)
      expect(untils.at(-1), `${code}: last entry must not have "until"`).toBeUndefined()
      const dated = untils.slice(0, -1)
      expect(dated.every(Boolean), `${code}: only the last entry may omit "until"`).toBe(true)
      expect([...dated].sort(), `${code}: entries must be sorted`).toEqual(dated)
    }
  })

  it('does not leave catalogue entries unused', () => {
    const used = new Set(Object.values(FLAGS.states).flatMap((e) => e.map((x) => x.flag)))
    for (const id of Object.keys(FLAGS.catalogue))
      expect(used.has(id), `${id} is unused`).toBe(true)
  })

  it('finds the flag in use on a date', () => {
    expect(flagOn(255, '1914-06-28')?.flag).toBe('de-1867')
    expect(flagOn(255, '1925-01-01')?.flag).toBe('de-1919')
    expect(flagOn(260, '1947-01-01')?.flag).toBeNull()
    expect(flagOn(365, '1950-01-01')).toEqual({
      flag: 'su-1923',
      from: '1923-11-12',
      until: '1955-08-18',
    })
  })

  it('lists flag adoptions in a period', () => {
    const changes = flagChangesBetween('1931-01-01', '1931-12-31')
    expect(changes.map((c) => c.period.flag)).toContain('es-1931')
    expect(flagHistory(230)[1].from).toBe('1931-04-14')
  })
})
