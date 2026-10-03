/** Les propietats d'una peça de frontera, tal com les deixa scripts/build-borders.mjs. */
export interface BorderProperties {
  gwcode: number
  country_name: string
  status: string
  owner?: string | null
  /** Vigent des de (AAAAMMDD). */
  s: number
  /** Vigent fins a (AAAAMMDD; 99991231 vol dir que encara val). */
  e: number
  capname?: string
  c: number
}

export type Selection =
  | { kind: 'country'; feature: BorderProperties }
  | { kind: 'event'; id: string }
  | { kind: 'conflict'; id: string }

export const REPO_URL = 'https://github.com/ArnauM13/history-map'
