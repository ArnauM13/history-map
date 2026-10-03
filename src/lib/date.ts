/**
 * Dates are handled as ISO strings (YYYY-MM-DD) in the UI and as YYYYMMDD integers
 * in the map data, so MapLibre filter expressions can compare them numerically.
 */
export type IsoDate = string

export const FIRST_YEAR = 1900
export const MIN_DATE: IsoDate = `${FIRST_YEAR}-01-01`
/** Sentinel used in the border data for "still valid today". */
export const OPEN_END = 99991231

const pad = (n: number) => String(n).padStart(2, '0')

export const toDateNumber = (iso: IsoDate) => Number(iso.replaceAll('-', ''))

export const isValidIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

export const yearOf = (iso: IsoDate) => Number(iso.slice(0, 4))

export function todayIso(now = new Date()): IsoDate {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Months elapsed since January of FIRST_YEAR — the unit of the timeline slider. */
export function monthIndex(iso: IsoDate): number {
  const [y, m] = iso.split('-').map(Number)
  return (y - FIRST_YEAR) * 12 + (m - 1)
}

export function fromMonthIndex(index: number): IsoDate {
  return `${FIRST_YEAR + Math.floor(index / 12)}-${pad((index % 12) + 1)}-01`
}

export const clampDate = (iso: IsoDate, max: IsoDate): IsoDate =>
  iso < MIN_DATE ? MIN_DATE : iso > max ? max : iso

/** True if `date` falls inside [start, end]; a missing end means "ongoing". */
export const isWithin = (date: IsoDate, start: IsoDate, end?: IsoDate) =>
  start <= date && (end === undefined || date <= end)

export type Precision = 'day' | 'month' | 'year'

export function formatDate(iso: IsoDate, locale: string, precision: Precision = 'day'): string {
  const [y, m, d] = iso.split('-').map(Number)
  const options: Intl.DateTimeFormatOptions =
    precision === 'year'
      ? { year: 'numeric' }
      : precision === 'month'
        ? { year: 'numeric', month: 'long' }
        : { year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  )
}

/** Formats a YYYYMMDD number from the border data. */
export function formatDateNumber(value: number, locale: string, openLabel: string): string {
  if (value >= OPEN_END) return openLabel
  const s = String(value)
  return formatDate(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`, locale)
}
