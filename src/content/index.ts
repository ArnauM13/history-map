import { parse } from 'yaml'
import { z } from 'zod'
import { fallbackOrder, type Lang } from '../i18n'
import { addDays, isWithin, type IsoDate } from '../lib/date'
import type { BorderProperties } from '../selection'
import {
  conflictSchema,
  capitalsSchema,
  countryNamesSchema,
  eventSchema,
  flagsSchema,
  occupationSchema,
  type Conflict,
  type HistoricalEvent,
  type LocalizedText,
  type Occupation,
  type WikipediaTitles,
} from './schema'

const eventFiles = import.meta.glob<string>('/content/events/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const conflictFiles = import.meta.glob<string>('/content/conflicts/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const occupationFiles = import.meta.glob<string>('/content/occupations/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const singleFiles = import.meta.glob<string>(
  ['/content/countries.yaml', '/content/flags.yaml', '/content/capitals.yaml'],
  { query: '?raw', import: 'default', eager: true },
)

type WikipediaMap = Record<string, { ca?: string; es?: string }>

/** El títol en català i castellà de cada article anglès citat: el genera `npm run data:sources`. */
const WIKIPEDIA = (Object.values(
  import.meta.glob<WikipediaMap>('/content/wikipedia.json', { eager: true, import: 'default' }),
)[0] ?? {}) as WikipediaMap

/** Un fitxer mal escrit no tomba l'app: l'error s'apunta aquí, i els tests no el deixen passar. */
export const contentErrors: string[] = []

function loadCollection<T>(files: Record<string, string>, schema: z.ZodType<T>) {
  const items: (T & { id: string })[] = []
  for (const [path, raw] of Object.entries(files)) {
    const id = path
      .split('/')
      .pop()!
      .replace(/\.yaml$/, '')
    try {
      const result = schema.safeParse(parse(raw))
      if (result.success) items.push({ ...result.data, id })
      else contentErrors.push(`${path}\n${z.prettifyError(result.error)}`)
    } catch (error) {
      contentErrors.push(`${path}\n${String(error)}`)
    }
  }
  return items
}

function loadFile<T>(path: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const result = schema.safeParse(parse(singleFiles[path] ?? ''))
    if (result.success) return result.data
    contentErrors.push(`${path}\n${z.prettifyError(result.error)}`)
  } catch (error) {
    contentErrors.push(`${path}\n${String(error)}`)
  }
  return fallback
}

export const EVENTS: HistoricalEvent[] = loadCollection(eventFiles, eventSchema).sort((a, b) =>
  a.date.localeCompare(b.date),
)
export const CONFLICTS: Conflict[] = loadCollection(conflictFiles, conflictSchema).sort((a, b) =>
  a.start.localeCompare(b.start),
)
export const OCCUPATIONS: Occupation[] = loadCollection(occupationFiles, occupationSchema).sort(
  (a, b) => a.start.localeCompare(b.start),
)
export const COUNTRY_NAMES = loadFile('/content/countries.yaml', countryNamesSchema, {})
export const CAPITALS = loadFile('/content/capitals.yaml', capitalsSchema, {})
export const FLAGS = loadFile('/content/flags.yaml', flagsSchema, {
  catalogue: {},
  about: {},
  states: {},
  sources: {},
})

if (contentErrors.length > 0)
  console.error('Invalid content files:\n\n' + contentErrors.join('\n\n'))

/** El text en l'idioma de la pantalla o, si no hi és, en un altre dels tres. */
export function localize(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return ''
  for (const l of fallbackOrder(lang)) if (text[l]) return text[l]
  return ''
}

export interface WikipediaLink {
  /** L'idioma de la Viquipèdia on porta l'enllaç, que pot no ser el de la pantalla. */
  lang: Lang
  title: string
  url: string
}

/**
 * L'article de la Viquipèdia en l'idioma de la pantalla, o en un altre si no n'hi ha. N'hi ha
 * prou amb el títol anglès: el català i el castellà surten de content/wikipedia.json.
 */
export function wikipediaLink(
  source: WikipediaTitles | string | undefined,
  lang: Lang,
): WikipediaLink | undefined {
  if (!source) return undefined
  const titles = typeof source === 'string' ? { en: source } : source
  for (const l of fallbackOrder(lang)) {
    const title = titles[l] ?? (l === 'en' ? undefined : titles.en && WIKIPEDIA[titles.en]?.[l])
    if (title) {
      const url = `https://${l}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`
      return { lang: l, title, url }
    }
  }
  return undefined
}

/** El nom d'un estat en una data: l'Imperi Rus, la Unió Soviètica i Rússia són el mateix codi. */
function nameOn(code: string, date: IsoDate) {
  const entry = COUNTRY_NAMES[code]
  if (!entry || !Array.isArray(entry)) return entry
  return entry.find((e) => !e.until || date <= e.until) ?? entry[entry.length - 1]
}

export function countryName(code: string, date: IsoDate, lang: Lang, fallback = ''): string {
  return localize(nameOn(code, date), lang) || fallback
}

/** La font del nom: l'article de la Viquipèdia sobre l'estat tal com era en aquella data. */
export const countryWiki = (code: string, date: IsoDate) => nameOn(code, date)?.wiki

/**
 * El títol d'un article com a nom: sense la precisió entre parèntesis («Regne d'Itàlia
 * (1861-1946)»), ni l'àncora que hi deixen alguns enllaços entre idiomes («Trípoli otomana#top»).
 */
const plainTitle = (title: string | undefined) =>
  title?.replace(/#.*$/, '').replace(/\s*\([^)]*\)$/, '') || undefined

type NamedPiece = Pick<BorderProperties, 'code' | 'country_name' | 'qid' | 'wiki'>

/**
 * El nom d'una peça del mapa. Abans del 1886, el de l'entitat de Cliopatria, que diu el règim: el
 * 1700 és el Regne de França, no «França». Si content/countries.yaml en porta el QID, mana; si
 * no, el nom és el títol de l'article de la Viquipèdia en català o castellà, que treu
 * `npm run data:sources`, i el de Cliopatria en anglès.
 */
export function stateName(piece: NamedPiece, date: IsoDate, lang: Lang): string {
  if (!piece.qid) return countryName(piece.code, date, lang, piece.country_name)
  const entry = nameOn(piece.qid, date)
  if (entry) return localize(entry, lang)
  const titles = piece.wiki ? WIKIPEDIA[piece.wiki] : undefined
  return (
    localize(
      {
        ca: plainTitle(titles?.ca),
        es: plainTitle(titles?.es),
        en: plainTitle(piece.country_name),
      },
      lang,
    ) || piece.code
  )
}

/** La font del nom d'una peça: l'article que l'explica tal com era en aquella data. */
export const stateWiki = (piece: NamedPiece, date: IsoDate) =>
  piece.qid ? (nameOn(piece.qid, date)?.wiki ?? piece.wiki) : countryWiki(piece.code, date)

/** La capital en l'idioma de la pantalla; si no està traduïda, tal com ve de CShapes. */
export const capitalName = (capname: string, lang: Lang) =>
  localize(CAPITALS[capname], lang) || capname

export const activeConflicts = (date: IsoDate) =>
  CONFLICTS.filter((c) => isWithin(date, c.start, c.end))

/** Un tram de control d'una zona, amb el primer dia ja calculat. */
export type ControlPeriod = Occupation['control'][number] & { from: IsoDate }

/** Qui va controlar una zona i com, tram a tram: cada un comença l'endemà de l'anterior. */
export const controlPeriods = (zone: Occupation): ControlPeriod[] =>
  zone.control.map((p, i) => ({
    ...p,
    from: i === 0 ? zone.start : addDays(zone.control[i - 1].until!, 1),
  }))

/** Qui controlava la zona en una data, o res si aquell dia no hi era. */
export const controlOn = (zone: Occupation, date: IsoDate) =>
  controlPeriods(zone).find((p) => isWithin(date, p.from, p.until))

/** L'últim dia de la zona; sense, encara dura. */
export const occupationEnd = (zone: Occupation) => zone.control.at(-1)!.until

export const activeOccupations = (date: IsoDate) => OCCUPATIONS.filter((o) => controlOn(o, date))

export const eventsOfYear = (year: number) =>
  EVENTS.filter((e) => e.date.startsWith(String(year).padStart(4, '0')))

/**
 * Les dates on salta la línia temporal a la pestanya Fets: els fets, l'inici i el final dels
 * conflictes, i cada canvi de les ocupacions.
 */
export const KEY_DATES: IsoDate[] = [
  ...new Set([
    ...EVENTS.map((e) => e.date),
    ...CONFLICTS.flatMap((c) => (c.end ? [c.start, c.end] : [c.start])),
    ...OCCUPATIONS.flatMap((o) =>
      controlPeriods(o).flatMap((p) => (p.until ? [p.from, p.until] : [p.from])),
    ),
  ]),
].sort()
