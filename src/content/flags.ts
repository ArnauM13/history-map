import { addDays, type IsoDate } from '../lib/date'
import { FLAGS } from './index'

/** A period during which a state used one flag. */
export interface FlagPeriod {
  /** Catalogue id; `null` = no flag of its own; `undefined` = not documented. */
  flag: string | null | undefined
  /** First day of use, unknown for the first period of a state. */
  from?: IsoDate
  /** Last day of use; undefined = still in use. */
  until?: IsoDate
}

const histories = new Map<number, FlagPeriod[]>()

/** All the flags a state used, in chronological order. */
export function flagHistory(gwcode: number): FlagPeriod[] {
  let history = histories.get(gwcode)
  if (!history) {
    const entries = FLAGS.states[String(gwcode)] ?? []
    history = entries.map((entry, i) => ({
      flag: entry.flag,
      from: i > 0 ? addDays(entries[i - 1].until!, 1) : undefined,
      until: entry.until,
    }))
    histories.set(gwcode, history)
  }
  return history
}

/** The flag a state used on a given date, if documented. */
export const flagOn = (gwcode: number, date: IsoDate): FlagPeriod | undefined =>
  flagHistory(gwcode).find((p) => !p.until || date <= p.until)

/** Flag adoptions within [start, end], across all states. */
export function flagChangesBetween(start: IsoDate, end: IsoDate) {
  const changes: { gwcode: number; period: FlagPeriod & { from: IsoDate } }[] = []
  for (const code of Object.keys(FLAGS.states)) {
    for (const period of flagHistory(Number(code))) {
      if (period.flag && period.from && start <= period.from && period.from <= end) {
        changes.push({ gwcode: Number(code), period: { ...period, from: period.from } })
      }
    }
  }
  return changes.sort((a, b) => a.period.from.localeCompare(b.period.from))
}

export const flagUrl = (id: string) => `${import.meta.env.BASE_URL}flags/${id}.png`

export const commonsUrl = (id: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent((FLAGS.catalogue[id] ?? '').replaceAll(' ', '_'))}`

export interface FlagCredit {
  file: string
  license?: string
  artist?: string
}

let credits: Promise<Record<string, FlagCredit>> | undefined

/** Licence and author of each flag image, written by `npm run data:flags`. */
export function loadFlagCredits() {
  credits ??= fetch(`${import.meta.env.BASE_URL}flags/credits.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
  return credits
}
