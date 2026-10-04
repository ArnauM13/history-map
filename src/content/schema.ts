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

/**
 * L'article de la Viquipèdia que fa de font, pel títol anglès (`en: Treaty of Versailles`). Els
 * títols en català i castellà els posa content/wikipedia.json; aquí només cal si es volen forçar.
 */
const wikipedia = z.strictObject({ ca: text.optional(), es: text.optional(), en: text.optional() })

/** Una font que no és la Viquipèdia: un document, un llibre, una pàgina oficial. */
export const externalSource = z.strictObject({
  title: text,
  url: z.url({ protocol: /^https$/ }),
  /** Qui la publica: l'ONU, el BOE, una universitat… */
  publisher: text.optional(),
})

const sources = z.array(externalSource).default([])

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
  sources,
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
    sources,
  })
  .refine((c) => !c.end || c.end >= c.start, 'El final no pot ser abans del començament')

const flagId = z
  .string()
  .regex(/^[a-z0-9-]+$/, "L'identificador d'una bandera va en minúscules, xifres i guions")

/**
 * Com es controlava un territori que les fronteres reconegudes no donen a qui el tenia: annexionat
 * (incorporat a l'estat que el prenia, com Àustria al Reich), ocupat (sota administració militar o
 * civil de l'ocupant) o un estat client (un govern propi, però sotmès, com l'Estat Eslovac).
 */
export const OCCUPATION_KINDS = ['annexation', 'occupation', 'client'] as const

const controlPeriod = z.strictObject({
  /** L'últim dia d'aquest tram. Només l'últim pot anar sense, si encara dura. */
  until: isoDate.optional(),
  /** Qui el controlava: un codi de Gleditsch i Ward. */
  by: z.number().int().positive(),
  kind: z.enum(OCCUPATION_KINDS),
  /**
   * Per què: el fet que el va posar sota aquest control, en poques paraules («Armistici francès,
   * 1940»). Va al mapa, sota el nom de la zona; la resta de la història, a `summary`.
   */
  cause: localizedText,
})

export const occupationSchema = z
  .strictObject({
    /** El primer dia: la capitulació, l'armistici, l'annexió o la presa de la capital. */
    start: isoDate,
    /** Qui el controlava i com, per ordre: Albània va ser italiana i després alemanya. */
    control: z.array(controlPeriod).min(1),
    title: localizedText,
    /** El nom que va al mapa, si el títol hi és massa llarg. */
    label: localizedText.optional(),
    summary: localizedText,
    /** De quins estats era el territori segons les fronteres reconegudes. */
    countries,
    /** Una bandera del catàleg, si el territori en feia servir una de pròpia (l'Estat Eslovac). */
    flag: flagId.optional(),
    wikipedia: wikipedia.optional(),
    sources,
  })
  .refine(
    (o) => o.control.slice(0, -1).every((p) => p.until),
    "Només l'últim tram de `control` pot anar sense `until`",
  )
  .refine((o) => {
    const untils = o.control.flatMap((p) => (p.until ? [p.until] : []))
    return untils.every((u, i) => u >= (i === 0 ? o.start : untils[i - 1]))
  }, "Els trams de `control` han d'anar per ordre, i després de `start`")

/** Un nom, i l'article de la Viquipèdia (en anglès) que explica l'estat amb aquell nom. */
const nameEntry = z.strictObject({
  /** L'últim dia que va valer aquest nom. L'última entrada no en porta. */
  until: isoDate.optional(),
  ca: text.optional(),
  es: text.optional(),
  en: text.optional(),
  wiki: text.optional(),
})

export const countryNamesSchema = z.record(
  z.string().regex(/^\d+$/, 'La clau és un codi de Gleditsch i Ward'),
  z.union([nameEntry.omit({ until: true }), z.array(nameEntry).min(1)]),
)

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
  /** D'on surten les dates: codi → títols d'articles de la Viquipèdia anglesa. */
  sources: z.record(z.string().regex(/^\d+$/), z.array(text).min(1)).default({}),
})

export type LocalizedText = z.infer<typeof localizedText>
export type WikipediaTitles = z.infer<typeof wikipedia>
export type ExternalSource = z.infer<typeof externalSource>
export type HistoricalEvent = z.infer<typeof eventSchema> & { id: string }
export type Conflict = z.infer<typeof conflictSchema> & { id: string }
export type Occupation = z.infer<typeof occupationSchema> & { id: string }
export type OccupationKind = (typeof OCCUPATION_KINDS)[number]
export type CountryNames = z.infer<typeof countryNamesSchema>
export type Flags = z.infer<typeof flagsSchema>
