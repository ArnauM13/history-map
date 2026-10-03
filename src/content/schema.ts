import { z } from 'zod'

/** YAML keeps unquoted dates as plain strings (core schema), e.g. `date: 1914-06-28`. */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date formatted as YYYY-MM-DD')

const text = z.string().trim().min(1)

/** A text in one or more of the supported languages. At least one is required. */
export const localizedText = z
  .strictObject({ ca: text.optional(), es: text.optional(), en: text.optional() })
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one language (ca, es, en) is required',
  )

/** [longitude, latitude] in WGS84 — the order used by GeoJSON. */
const lngLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])

/** Article titles per language, e.g. `en: Treaty_of_Versailles`. */
const wikipedia = z.strictObject({ ca: text.optional(), es: text.optional(), en: text.optional() })

/** Gleditsch & Ward state codes, the same ids used by the border dataset (see content/countries.yaml). */
const countries = z.array(z.number().int().positive()).default([])

export const EVENT_CATEGORIES = [
  'war',
  'treaty',
  'revolution',
  'independence',
  'political',
  'integration',
  'crisis',
] as const

export const eventSchema = z.strictObject({
  date: isoDate,
  category: z.enum(EVENT_CATEGORIES),
  title: localizedText,
  summary: localizedText,
  location: lngLat.optional(),
  countries,
  wikipedia: wikipedia.optional(),
})

export const CONFLICT_CATEGORIES = [
  'world-war',
  'interstate',
  'civil-war',
  'independence',
  'uprising',
] as const

export const conflictSchema = z
  .strictObject({
    start: isoDate,
    /** Omit for ongoing conflicts. */
    end: isoDate.optional(),
    category: z.enum(CONFLICT_CATEGORIES),
    title: localizedText,
    summary: localizedText,
    /** A representative point of the main theatre of operations. */
    location: lngLat,
    countries,
    wikipedia: wikipedia.optional(),
  })
  .refine((c) => !c.end || c.end >= c.start, '`end` must not be earlier than `start`')

const nameEntry = z.strictObject({
  /** Last day (inclusive) on which this name applies. Omit on the last entry. */
  until: isoDate.optional(),
  ca: text.optional(),
  es: text.optional(),
  en: text.optional(),
})

export const countryNamesSchema = z.record(
  z.string().regex(/^\d+$/, 'Keys must be Gleditsch & Ward codes'),
  z.union([localizedText, z.array(nameEntry).min(1)]),
)

const flagId = z.string().regex(/^[a-z0-9-]+$/, 'Flag ids use lowercase letters, digits and dashes')

const flagEntry = z.strictObject({
  /** Last day (inclusive) this flag was in use. Omit on the last entry. */
  until: isoDate.optional(),
  /** Catalogue id; `null` = no flag of its own; omitted = not documented yet. */
  flag: flagId.nullable().optional(),
})

export const flagsSchema = z.strictObject({
  /** Flag id → file name on Wikimedia Commons. */
  catalogue: z.record(flagId, z.string().regex(/\.svg$/, 'Expected an SVG file name')),
  /** Gleditsch & Ward code → flags in chronological order. */
  states: z.record(z.string().regex(/^\d+$/), z.array(flagEntry).min(1)),
})

export type LocalizedText = z.infer<typeof localizedText>
export type WikipediaTitles = z.infer<typeof wikipedia>
export type HistoricalEvent = z.infer<typeof eventSchema> & { id: string }
export type Conflict = z.infer<typeof conflictSchema> & { id: string }
export type CountryNames = z.infer<typeof countryNamesSchema>
export type Flags = z.infer<typeof flagsSchema>
