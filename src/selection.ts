/**
 * Les propietats d'una peça de frontera, tal com les deixen scripts/build-borders.mjs i, abans
 * del 1886, scripts/build-history.mjs.
 */
export interface BorderProperties {
  /**
   * L'estat: el codi de Gleditsch i Ward ("220") o, si no continua cap estat de CShapes, el QID
   * de Wikidata ("Q207162"). Els noms, les banderes i els fets s'hi refereixen.
   */
  code: string
  /** El nom en anglès que porta la font: el de recanvi, si no n'hi ha cap de traduït. */
  country_name?: string
  status: string
  owner?: string | null
  /** Vigent des de (AAAAMMDD). */
  s: number
  /** Vigent fins a (AAAAMMDD; 99991231 vol dir que encara val). */
  e: number
  capname?: string
  c: number
  /** Abans del 1886: l'entitat de Cliopatria, que pot ser un règim d'un mateix estat. */
  qid?: string
  /** Abans del 1886: l'article de la Viquipèdia anglesa sobre l'entitat. */
  wiki?: string
}

export type Selection =
  | { kind: 'country'; feature: BorderProperties }
  | { kind: 'event'; id: string }
  | { kind: 'conflict'; id: string }
  | { kind: 'occupation'; id: string }

export const REPO_URL = 'https://github.com/ArnauM13/history-map'

/** Un document del repo en l'idioma de la pantalla: el català és l'original, sense sufix. */
export const docUrl = (name: string, lang: string) =>
  `${REPO_URL}/blob/main/${name}${lang === 'ca' ? '' : `.${lang}`}.md`
