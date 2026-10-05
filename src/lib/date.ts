/**
 * Les dates són text ISO (AAAA-MM-DD) a la interfície i enters AAAAMMDD a les dades del mapa:
 * així els filtres de MapLibre les comparen com a números.
 */
export type IsoDate = string

/**
 * El primer dia de CShapes, i el de la part principal del mapa: des d'aquí, les fronteres canvien
 * el dia que va passar.
 */
export const EXACT_BORDERS_FROM: IsoDate = '1886-01-01'
/**
 * El primer any de la secció d'abans del 1886: fins al 1885 les fronteres són de Cliopatria
 * (scripts/build-history.mjs, que porta el mateix FIRST_YEAR).
 */
export const FIRST_YEAR = 1500

/**
 * Les dues parts del mapa. La principal va del 1886 a avui, amb CShapes, i és la que ha de ser
 * una referència. La d'abans del 1886 és una secció a part i experimental: les fronteres hi
 * canvien d'any en any, no el dia que va passar, i encara n'hi ha moltes per corregir.
 */
export type EraId = 'main' | 'early'

export interface Era {
  id: EraId
  min: IsoDate
  max: IsoDate
  /**
   * Quants mesos és un pas de la línia temporal. A la secció d'abans, sis: de mes en mes, quatre
   * segles eren gairebé cinc mil passos, i reproduir-los durava dotze minuts.
   */
  stepMonths: number
  /** Cada quants anys hi ha una marca a la línia, i cada quants una de les que caben al mòbil. */
  ticks: number
  majorTicks: number
}

export function eraOf(id: EraId, today: IsoDate): Era {
  return id === 'main'
    ? { id, min: EXACT_BORDERS_FROM, max: today, stepMonths: 1, ticks: 10, majorTicks: 20 }
    : {
        id,
        min: `${FIRST_YEAR}-01-01`,
        max: addDays(EXACT_BORDERS_FROM, -1),
        stepMonths: 6,
        ticks: 50,
        majorTicks: 100,
      }
}

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

const monthsOf = (iso: IsoDate) => {
  const [y, m] = iso.split('-').map(Number)
  return y * 12 + (m - 1)
}

const fromMonths = (months: number): IsoDate =>
  `${Math.floor(months / 12)}-${pad((months % 12) + 1)}-01`

/** La posició d'una data a la línia temporal d'una part del mapa, en passos des del principi. */
export const stepIndex = (iso: IsoDate, era: Era): number =>
  Math.floor((monthsOf(iso) - monthsOf(era.min)) / era.stepMonths)

/** El primer dia del pas `index` de la línia temporal. */
export const fromStepIndex = (index: number, era: Era): IsoDate =>
  fromMonths(monthsOf(era.min) + index * era.stepMonths)

/** L'1 del mes que és `months` mesos abans o després. */
export const addMonths = (iso: IsoDate, months: number): IsoDate =>
  fromMonths(monthsOf(iso) + months)

export function addDays(iso: IsoDate, days: number): IsoDate {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export const clampDate = (iso: IsoDate, era: Era): IsoDate =>
  iso < era.min ? era.min : iso > era.max ? era.max : iso

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
