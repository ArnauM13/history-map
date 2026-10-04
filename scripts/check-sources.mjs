#!/usr/bin/env node
/**
 * Comprova les fonts del contingut i en tradueix els títols de la Viquipèdia.
 *
 *   npm run data:sources            # els títols nous i tots els enllaços externs
 *   npm run data:sources -- --force # també els títols que ja s'havien comprovat
 *
 * Tot el que ensenya el mapa cita un article de la Viquipèdia anglesa: els fets, els conflictes i
 * les ocupacions (`wikipedia.en`), el nom de cada estat en cada època (`wiki` a countries.yaml), les
 * entitats d'abans del 1886 (`wiki` a public/data/history, que hi posa Cliopatria) i les dates de
 * les banderes (`sources` a flags.yaml). L'script:
 *
 *   1. Comprova que cada article existeix.
 *   2. En busca el títol en català i en castellà (els enllaços entre idiomes de l'article anglès)
 *      i el desa a content/wikipedia.json, perquè l'app enllaci la Viquipèdia de qui la llegeix.
 *   3. Obre cada font externa (`sources[].url`) i comprova que respon.
 *
 * Si un article no existeix o un enllaç no respon, ho diu i acaba amb error.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { parse } from 'yaml'

const API = 'https://en.wikipedia.org/w/api.php'
// La Viquipèdia demana que qui fa servir l'API s'identifiqui.
const HEADERS = { 'User-Agent': 'HistoryMap/0.1 (https://github.com/ArnauM13/history-map)' }
const LANGS = ['ca', 'es']
const MAP_FILE = 'content/wikipedia.json'
const HISTORY_DIR = 'public/data/history'
const force = process.argv.includes('--force')

const read = (path) => parse(readFileSync(path, 'utf8'))
const yamlFiles = (dir) =>
  readdirSync(dir)
    .filter((name) => name.endsWith('.yaml'))
    .map((name) => `${dir}/${name}`)

// ── Què se cita ──────────────────────────────────────────────────────────────

/** Article → on se cita, per poder dir d'on ve un títol que no existeix. */
const cited = new Map()
const cite = (title, where) => cited.set(title, [...(cited.get(title) ?? []), where])
const urls = []

for (const path of ['events', 'conflicts', 'occupations'].flatMap((dir) =>
  yamlFiles(`content/${dir}`),
)) {
  const item = read(path)
  if (item.wikipedia?.en) cite(item.wikipedia.en, path)
  for (const source of item.sources ?? []) urls.push({ url: source.url, where: path })
}
for (const [code, value] of Object.entries(read('content/countries.yaml'))) {
  for (const entry of Array.isArray(value) ? value : [value]) {
    if (entry.wiki) cite(entry.wiki, `countries.yaml ${code}`)
  }
}
for (const [code, titles] of Object.entries(read('content/flags.yaml').sources ?? {})) {
  for (const title of titles) cite(title, `flags.yaml ${code}`)
}
// El nom en català i castellà d'aquestes entitats és el títol de l'article: per això hi són.
for (const name of readdirSync(HISTORY_DIR).filter((n) => n.endsWith('.labels.geojson'))) {
  const { features } = JSON.parse(readFileSync(`${HISTORY_DIR}/${name}`, 'utf8'))
  for (const { properties: p } of features) {
    // Sense article anglès, el nom i la font els posa content/countries.yaml pel QID.
    if (p.wiki) cite(p.wiki, `${HISTORY_DIR}/${name} ${p.qid}`)
  }
}

// ── La Viquipèdia ────────────────────────────────────────────────────────────

async function get(params, attempt = 1) {
  const res = await fetch(`${API}?${new URLSearchParams(params)}`, { headers: HEADERS })
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
    return get(params, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * Per a fins a 50 articles anglesos: `null` si no existeixen, i si existeixen, el títol de
 * l'article equivalent en un idioma (o `undefined` si no n'hi ha).
 */
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
    result.set(title, !page || page.missing ? null : page.langlinks?.[0]?.title)
  }
  return result
}

const known = JSON.parse(readFileSync(MAP_FILE, 'utf8'))
const map = {}
const missing = []
const pending = [...cited.keys()].filter((title) => force || !(title in known))

for (let i = 0; i < pending.length; i += 50) {
  const batch = pending.slice(i, i + 50)
  const found = Object.fromEntries(
    await Promise.all(LANGS.map(async (lang) => [lang, await langlinks(batch, lang)])),
  )
  for (const title of batch) {
    if (found.ca.get(title) === null) {
      missing.push(`«${title}» (${cited.get(title).join(', ')})`)
      continue
    }
    known[title] = Object.fromEntries(
      LANGS.filter((lang) => found[lang].get(title)).map((lang) => [lang, found[lang].get(title)]),
    )
  }
}
// Només el que encara se cita, per ordre: el fitxer el llegeix l'app.
for (const title of [...cited.keys()].sort((a, b) => a.localeCompare(b))) {
  if (known[title]) map[title] = known[title]
}
writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n')
console.log(
  `✔ ${cited.size} articles citats, ${pending.length} comprovats ara, ${Object.keys(map).length} al mapa`,
)

// ── Les fonts externes ───────────────────────────────────────────────────────

const broken = []
for (const { url, where } of urls) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    })
    if (res.status >= 400) broken.push(`${url} — HTTP ${res.status} (${where})`)
  } catch (error) {
    broken.push(`${url} — ${error.cause?.code ?? error.name} (${where})`)
  }
}
console.log(`✔ ${urls.length - broken.length} de ${urls.length} fonts externes responen`)

if (missing.length > 0) {
  console.error(`\n✘ Articles que no són a la Viquipèdia anglesa:\n  ${missing.join('\n  ')}`)
}
if (broken.length > 0) console.error(`\n✘ Fonts que no responen:\n  ${broken.join('\n  ')}`)
if (missing.length > 0 || broken.length > 0) process.exit(1)
