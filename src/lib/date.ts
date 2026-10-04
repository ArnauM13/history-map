/**
 * Les dates són text ISO (AAAA-MM-DD) a la interfície i enters AAAAMMDD a les dades del mapa:
 * així els filtres de MapLibre les comparen com a números.
 */
export type IsoDate = string

/**
 * El primer any del mapa: fins al 1885 les fronteres són de Cliopatria (scripts/build-history.mjs,
 * que porta el mateix FIRST_YEAR), i des del 1886, de CShapes 2.0.
 */
export const FIRST_YEAR = 1500
export const MIN_DATE: IsoDate = `${FIRST_YEAR}-01-01`
/**
 * El primer dia de CShapes. Abans, les fronteres canvien d'any en any, no el dia que va passar, i
 * no sabem quan es va estrenar la primera bandera de cada estat.
 */
export const EXACT_BORDERS_FROM: IsoDate = '1886-01-01'
/** El final de les fronteres que encara valen avui. */
export const OPEN_END = 99991231

const pad = (n: number) => String(n).padStart(2, '0')

export function yearOf(iso: IsoDate) {
  return Number(iso.slice(0, 4))
}

export const toDateNumber = (iso: IsoDate) => Number(iso.replaceAll('-', ''))

export const fromDateNumber = (value: number): IsoDate => {
  const s = String(value)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

export const isValidIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

export function todayIso(now = new Date()): IsoDate {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/**
 * La línia temporal va a dos ritmes: abans del 1886, a passos de sis mesos, perquè les fronteres
 * hi canvien d'any en any; després, de mes en mes. Tota a passos d'un mes, del 1886 a avui en
 * quedava només una quarta part, i és on hi ha més per veure.
 */
const SLOW_STEP_MONTHS = 6
const SLOW_MONTHS = (yearOf(EXACT_BORDERS_FROM) - FIRST_YEAR) * 12
const SLOW_STEPS = SLOW_MONTHS / SLOW_STEP_MONTHS

const monthsSinceStart = (iso: IsoDate) => {
  const [y, m] = iso.split('-').map(Number)
  return (y - FIRST_YEAR) * 12 + (m - 1)
}

const fromMonths = (months: number): IsoDate =>
  `${FIRST_YEAR + Math.floor(months / 12)}-${pad((months % 12) + 1)}-01`

/** La posició d'una data a la línia temporal, en passos des del gener de FIRST_YEAR. */
export function stepIndex(iso: IsoDate): number {
  const months = monthsSinceStart(iso)
  return months < SLOW_MONTHS
    ? Math.floor(months / SLOW_STEP_MONTHS)
    : SLOW_STEPS + (months - SLOW_MONTHS)
}

/** El primer dia del pas `index` de la línia temporal. */
export function fromStepIndex(index: number): IsoDate {
  return fromMonths(
    index < SLOW_STEPS ? index * SLOW_STEP_MONTHS : SLOW_MONTHS + (index - SLOW_STEPS),
  )
}

/** L'1 del mes que és `months` mesos abans o després. */
export const addMonths = (iso: IsoDate, months: number): IsoDate =>
  fromMonths(monthsSinceStart(iso) + months)

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
