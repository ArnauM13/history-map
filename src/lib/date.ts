/**
 * Les dates són text ISO (AAAA-MM-DD) a la interfície i enters AAAAMMDD a les dades del mapa:
 * així els filtres de MapLibre les comparen com a números.
 */
export type IsoDate = string

/** El primer any de CShapes 2.0: d'abans no hi ha fronteres. */
export const FIRST_YEAR = 1886
export const MIN_DATE: IsoDate = `${FIRST_YEAR}-01-01`
/** El final de les fronteres que encara valen avui. */
export const OPEN_END = 99991231

const pad = (n: number) => String(n).padStart(2, '0')

export const toDateNumber = (iso: IsoDate) => Number(iso.replaceAll('-', ''))

export const fromDateNumber = (value: number): IsoDate => {
  const s = String(value)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

export const isValidIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

export const yearOf = (iso: IsoDate) => Number(iso.slice(0, 4))

export function todayIso(now = new Date()): IsoDate {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Mesos des del gener de FIRST_YEAR: la unitat de la línia temporal. */
export function monthIndex(iso: IsoDate): number {
  const [y, m] = iso.split('-').map(Number)
  return (y - FIRST_YEAR) * 12 + (m - 1)
}

export function fromMonthIndex(index: number): IsoDate {
  return `${FIRST_YEAR + Math.floor(index / 12)}-${pad((index % 12) + 1)}-01`
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export const clampDate = (iso: IsoDate, max: IsoDate): IsoDate =>
  iso < MIN_DATE ? MIN_DATE : iso > max ? max : iso

/** Si `date` cau dins de [start, end]; sense final, encara dura. */
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

/** Una data AAAAMMDD de les fronteres, en text. */
export function formatDateNumber(value: number, locale: string, openLabel: string): string {
  if (value >= OPEN_END) return openLabel
  return formatDate(fromDateNumber(value), locale)
}
