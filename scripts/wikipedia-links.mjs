#!/usr/bin/env node
/**
 * Completa els enllaços a la Viquipèdia en català i en castellà dels fets i dels conflictes.
 *
 *   npm run data:wikipedia
 *
 * Qui escriu un fet sol saber el títol de l'article en anglès; el de les altres Viquipèdies no
 * cal endevinar-lo: la Viquipèdia anglesa diu quin és a través dels enllaços entre idiomes
 * (langlinks). L'script l'afegeix al YAML, a sobre de `en:`, i no toca res més del fitxer.
 * Si un títol anglès no existeix, ho diu i acaba amb error.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { parse, stringify } from 'yaml'

const API = 'https://en.wikipedia.org/w/api.php'
// La Viquipèdia demana que qui fa servir l'API s'identifiqui.
const HEADERS = { 'User-Agent': 'HistoryMap/0.1 (https://github.com/ArnauM13/history-map)' }
const LANGS = ['ca', 'es']

const files = ['content/events', 'content/conflicts'].flatMap((dir) =>
  readdirSync(dir)
    .filter((name) => name.endsWith('.yaml'))
    .map((name) => `${dir}/${name}`),
)

const entries = files
  .map((path) => {
    const text = readFileSync(path, 'utf8')
    return { path, text, wikipedia: parse(text).wikipedia ?? {} }
  })
  .filter(({ wikipedia }) => wikipedia.en && LANGS.some((lang) => !wikipedia[lang]))

async function get(params, attempt = 1) {
  const res = await fetch(`${API}?${new URLSearchParams(params)}`, { headers: HEADERS })
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
    return get(params, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** El títol d'un article en un altre idioma, per a fins a 50 articles anglesos alhora. */
async function langlinks(titles, lang) {
  const { query } = await get({
    action: 'query',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    prop: 'langlinks',
    lllang: lang,
    lllimit: 'max',
    titles: titles.join('|'),
  })
  // Cada títol demanat, fins a la pàgina final: la Viquipèdia normalitza i redirigeix.
  const rename = new Map()
  for (const { from, to } of [...(query.normalized ?? []), ...(query.redirects ?? [])]) {
    rename.set(from, to)
  }
  const pages = new Map(query.pages.map((p) => [p.title, p]))
  const result = new Map()
  for (const title of titles) {
    let final = title
    while (rename.has(final)) final = rename.get(final)
    const page = pages.get(final)
    result.set(title, page?.missing ? null : (page?.langlinks?.[0]?.title ?? undefined))
  }
  return result
}

/** Un títol com a valor YAML: sense cometes si es pot, i si no, les simples que vol Prettier. */
const yamlValue = (title) => stringify(title, { singleQuote: true, lineWidth: 0 }).trim()

const missing = []
let updated = 0
for (let i = 0; i < entries.length; i += 50) {
  const batch = entries.slice(i, i + 50)
  const titles = batch.map(({ wikipedia }) => wikipedia.en)
  const found = Object.fromEntries(
    await Promise.all(LANGS.map(async (lang) => [lang, await langlinks(titles, lang)])),
  )
  for (const { path, text, wikipedia } of batch) {
    if (found.ca.get(wikipedia.en) === null) {
      missing.push(`${path}: «${wikipedia.en}»`)
      continue
    }
    const lines = LANGS.filter((lang) => !wikipedia[lang] && found[lang].get(wikipedia.en)).map(
      (lang) => `  ${lang}: ${yamlValue(found[lang].get(wikipedia.en))}`,
    )
    if (lines.length === 0) continue
    writeFileSync(path, text.replace(/^wikipedia:\n/m, `wikipedia:\n${lines.join('\n')}\n`))
    updated++
    console.log(`✔ ${path}  ${lines.map((l) => l.trim()).join(' · ')}`)
  }
}

console.log(`${updated} fitxers amb enllaços nous, de ${entries.length} que en podien tenir.`)
if (missing.length > 0) {
  console.error(`\n✘ Articles que no són a la Viquipèdia anglesa:\n  ${missing.join('\n  ')}`)
  process.exit(1)
}
