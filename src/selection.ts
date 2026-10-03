/** Properties of a border feature, as produced by scripts/build-borders.mjs. */
export interface BorderProperties {
  gwcode: number
  country_name: string
  status: string
  owner?: string | null
  /** Valid from (YYYYMMDD). */
  s: number
  /** Valid until (YYYYMMDD, 99991231 = still valid). */
  e: number
  capname?: string
  c: number
}

export type Selection =
  | { kind: 'country'; feature: BorderProperties }
  | { kind: 'event'; id: string }
  | { kind: 'conflict'; id: string }

export const REPO_URL = 'https://github.com/ArnauM13/history-map'
