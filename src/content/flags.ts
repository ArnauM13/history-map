import { EXACT_BORDERS_FROM, addDays, type IsoDate } from '../lib/date'
import { FLAGS } from './index'

/** Un tram de temps en què un estat va fer servir una sola bandera. */
export interface FlagPeriod {
  /** Una bandera del catàleg; `null` és «sense bandera pròpia», i `undefined`, «per documentar». */
  flag: string | null | undefined
  /** El primer dia. No el sabem per a la primera bandera de cada estat. */
  from?: IsoDate
  /** L'últim dia; sense, encara es fa servir (o la fa servir l'estat fins que desapareix). */
  until?: IsoDate
}

const histories = new Map<string, FlagPeriod[]>()

/** Totes les banderes d'un estat, per ordre. */
export function flagHistory(code: string): FlagPeriod[] {
  let history = histories.get(code)
  if (!history) {
    const entries = FLAGS.states[code] ?? []
    history = entries.map((entry, i) => ({
      flag: entry.flag,
      from: i > 0 ? addDays(entries[i - 1].until!, 1) : undefined,
      until: entry.until,
    }))
    histories.set(code, history)
  }
  return history
}

/**
 * La bandera que feia servir un estat en una data, si està documentada. La primera de cada estat
 * no té dia d'estrena: val des del 1886, on comencen les fronteres exactes. Abans, sense un
 * `from`, no se sap: la França del 1700 no duia la tricolor.
 */
export function flagOn(code: string, date: IsoDate): FlagPeriod | undefined {
  const period = flagHistory(code).find((p) => !p.until || date <= p.until)
  return period && (period.from ?? EXACT_BORDERS_FROM) <= date ? period : undefined
}

export interface FlagChange {
  code: string
  period: FlagPeriod & { flag: string; from: IsoDate }
}

/**
 * Cada vegada que un estat estrena bandera, per ordre de data. La primera bandera de cada
 * estat no hi és: no en sabem el dia, i sovint ve d'abans del 1886.
 */
export const ALL_FLAG_CHANGES: FlagChange[] = Object.keys(FLAGS.states)
  .flatMap((code) =>
    flagHistory(code)
      .filter((p): p is FlagChange['period'] => Boolean(p.flag && p.from))
      .map((period) => ({ code, period })),
  )
  .sort((a, b) => a.period.from.localeCompare(b.period.from))

export const flagChangesBetween = (start: IsoDate, end: IsoDate) =>
  ALL_FLAG_CHANGES.filter((c) => start <= c.period.from && c.period.from <= end)

export const flagUrl = (id: string) => `${import.meta.env.BASE_URL}flags/${id}.png`

export const commonsUrl = (id: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent((FLAGS.catalogue[id] ?? '').replaceAll(' ', '_'))}`

export interface FlagCredit {
  file: string
  license?: string
  artist?: string
}

let credits: Promise<Record<string, FlagCredit>> | undefined

/** La llicència i l'autor de cada imatge, que escriu `npm run data:flags`. */
export function loadFlagCredits() {
  credits ??= fetch(`${import.meta.env.BASE_URL}flags/credits.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
  return credits
}
