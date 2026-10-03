import { z } from 'zod'

/** El YAML deixa les dates sense cometes com a text (`date: 1914-06-28`), que és el que volem. */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Una data va com a AAAA-MM-DD')

const text = z.string().trim().min(1)

/** Un text en un o més dels tres idiomes. El que falti es llegeix en un altre. */
export const localizedText = z
  .strictObject({ ca: text.optional(), es: text.optional(), en: text.optional() })
  .refine((value) => Object.keys(value).length > 0, 'Cal com a mínim un idioma (ca, es o en)')

/** [longitud, latitud]: l'ordre del GeoJSON, que és el contrari del que ensenyen els mapes web. */
const lngLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])

/** El títol de l'article a cada Viquipèdia, p. ex. `en: Treaty of Versailles`. */
const wikipedia = z.strictObject({ ca: text.optional(), es: text.optional(), en: text.optional() })

/** Codis de Gleditsch i Ward: els mateixos de les fronteres i de content/countries.yaml. */
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
    /** Sense `end`, el conflicte és obert. */
    end: isoDate.optional(),
    category: z.enum(CONFLICT_CATEGORIES),
    title: localizedText,
    summary: localizedText,
    /** Un punt del front principal: on el mapa hi posa la marca. */
    location: lngLat,
    countries,
    wikipedia: wikipedia.optional(),
  })
  .refine((c) => !c.end || c.end >= c.start, 'El final no pot ser abans del començament')

const nameEntry = z.strictObject({
  /** L'últim dia que va valer aquest nom. L'última entrada no en porta. */
  until: isoDate.optional(),
  ca: text.optional(),
  es: text.optional(),
  en: text.optional(),
})

export const countryNamesSchema = z.record(
  z.string().regex(/^\d+$/, 'La clau és un codi de Gleditsch i Ward'),
  z.union([localizedText, z.array(nameEntry).min(1)]),
)

const flagId = z
  .string()
  .regex(/^[a-z0-9-]+$/, "L'identificador d'una bandera va en minúscules, xifres i guions")

const flagEntry = z.strictObject({
  /** L'últim dia que es va fer servir. L'última entrada no en porta. */
  until: isoDate.optional(),
  /** Una bandera del catàleg; `null` és «sense bandera pròpia», i sense camp, «per documentar». */
  flag: flagId.nullable().optional(),
})

/** El nom de la capital tal com el porta CShapes (en anglès) → el nom en els tres idiomes. */
export const capitalsSchema = z.record(z.string(), localizedText)

export const flagsSchema = z.strictObject({
  /** Identificador → nom del fitxer a Wikimedia Commons. */
  catalogue: z.record(flagId, z.string().regex(/\.(svg|png)$/i, "Ha de ser un fitxer d'imatge")),
  /** Què vol dir una bandera i per què va arribar: dues o tres frases, no més. */
  about: z.record(flagId, localizedText).default({}),
  /** Codi de Gleditsch i Ward → les banderes que va fer servir, per ordre. */
  states: z.record(z.string().regex(/^\d+$/), z.array(flagEntry).min(1)),
})

export type LocalizedText = z.infer<typeof localizedText>
export type WikipediaTitles = z.infer<typeof wikipedia>
export type HistoricalEvent = z.infer<typeof eventSchema> & { id: string }
export type Conflict = z.infer<typeof conflictSchema> & { id: string }
export type CountryNames = z.infer<typeof countryNamesSchema>
export type Flags = z.infer<typeof flagsSchema>
