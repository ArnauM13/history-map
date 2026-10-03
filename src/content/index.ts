import { parse } from 'yaml'
import { z } from 'zod'
import { fallbackOrder, type Lang } from '../i18n'
import { isWithin, type IsoDate } from '../lib/date'
import {
  conflictSchema,
  countryNamesSchema,
  eventSchema,
  flagsSchema,
  type Conflict,
  type HistoricalEvent,
  type LocalizedText,
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
const singleFiles = import.meta.glob<string>(['/content/countries.yaml', '/content/flags.yaml'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Content errors are collected (and checked by the test suite) instead of crashing the app. */
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
export const COUNTRY_NAMES = loadFile('/content/countries.yaml', countryNamesSchema, {})
export const FLAGS = loadFile('/content/flags.yaml', flagsSchema, { catalogue: {}, states: {} })

if (contentErrors.length > 0)
  console.error('Invalid content files:\n\n' + contentErrors.join('\n\n'))

/** Picks the text in the requested language, falling back to any other available one. */
export function localize(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return ''
  for (const l of fallbackOrder(lang)) if (text[l]) return text[l]
  return ''
}

export function wikipediaUrl(titles: WikipediaTitles | undefined, lang: Lang): string | undefined {
  if (!titles) return undefined
  const l = fallbackOrder(lang).find((candidate) => titles[candidate])
  if (!l) return undefined
  return `https://${l}.wikipedia.org/wiki/${encodeURIComponent(titles[l]!.replaceAll(' ', '_'))}`
}

/** Name of a state or territory on a given date (names change: Russian Empire → USSR → Russia…). */
export function countryName(gwcode: number, date: IsoDate, lang: Lang, fallback = ''): string {
  const entry = COUNTRY_NAMES[String(gwcode)]
  if (!entry) return fallback
  if (!Array.isArray(entry)) return localize(entry, lang) || fallback
  const current = entry.find((e) => !e.until || date <= e.until) ?? entry[entry.length - 1]
  return localize(current, lang) || fallback
}

export const activeConflicts = (date: IsoDate) =>
  CONFLICTS.filter((c) => isWithin(date, c.start, c.end))

export const eventsOfYear = (year: number) =>
  EVENTS.filter((e) => e.date.startsWith(String(year).padStart(4, '0')))

/** Key dates the timeline can jump between: events and conflict starts/ends. */
export const KEY_DATES: IsoDate[] = [
  ...new Set([
    ...EVENTS.map((e) => e.date),
    ...CONFLICTS.flatMap((c) => (c.end ? [c.start, c.end] : [c.start])),
  ]),
].sort()
