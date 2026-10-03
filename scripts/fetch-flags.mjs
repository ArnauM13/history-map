#!/usr/bin/env node
/**
 * Baixa de Wikimedia Commons les banderes de content/flags.yaml.
 *
 *   npm run data:flags            # les que falten
 *   npm run data:flags -- --force # totes, de nou
 *
 * Deixa public/flags/<id>.png i public/flags/credits.json (el fitxer, la llicència i l'autor de
 * cada imatge). Els PNG els renderitza Wikimedia a partir dels SVG originals: n'hi ha que passen
 * del mega pels escuts detallats, i al mapa una bandera fa 14 px d'alçada. Si un fitxer no és a
 * Commons, desa la resta, en suggereix noms semblants i acaba amb error.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { parse } from 'yaml'

const API = 'https://commons.wikimedia.org/w/api.php'
const OUT_DIR = 'public/flags'
const CREDITS = `${OUT_DIR}/credits.json`
/** L'amplada dels PNG: una de les mides estàndard de miniatura de Wikimedia, que no en serveix d'altres. */
const WIDTH = 330
// Wikimedia demana que qui fa servir l'API s'identifiqui: https://meta.wikimedia.org/wiki/User-Agent_policy
const HEADERS = { 'User-Agent': 'HistoryMap/0.1 (https://github.com/ArnauM13/history-map)' }

const force = process.argv.includes('--force')
const { catalogue } = parse(readFileSync('content/flags.yaml', 'utf8'))
const credits = existsSync(CREDITS) ? JSON.parse(readFileSync(CREDITS, 'utf8')) : {}
mkdirSync(OUT_DIR, { recursive: true })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function get(url, attempt = 1) {
  const res = await fetch(url, { headers: HEADERS })
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(2000 * attempt)
    return get(url, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res
}

/** Treu l'HTML de les metadades de Commons («<a href=…>Autor</a>» → «Autor»). */
const plain = (html) =>
  html
    ?.replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim() || undefined

/** Demana a Commons l'adreça i la llicència de fins a 50 fitxers alhora. */
async function imageInfo(files) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: String(WIDTH),
    iiextmetadatafilter: 'LicenseShortName|Artist',
    titles: files.map((f) => `File:${f}`).join('|'),
  })
  const { query } = await (await get(`${API}?${params}`)).json()
  // Cada títol demanat, fins a la seva pàgina final: Commons normalitza noms i en redirigeix.
  const rename = new Map()
  for (const { from, to } of [...(query.normalized ?? []), ...(query.redirects ?? [])]) {
    rename.set(from, to)
  }
  const pages = new Map(query.pages.map((p) => [p.title, p]))
  const result = new Map()
  for (const file of files) {
    let title = `File:${file}`
    while (rename.has(title)) title = rename.get(title)
    const info = pages.get(title)?.imageinfo?.[0]
    if (info) result.set(file, info)
  }
  return result
}

/** Fitxers de Commons amb un nom semblant, per arreglar un nom mal escrit. */
async function similarFiles(file) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    list: 'search',
    srnamespace: '6',
    srlimit: '5',
    srsearch: file.replace(/\.svg$/, ''),
  })
  const { query } = await (await get(`${API}?${params}`)).json()
  return query.search.map((r) => r.title.replace(/^File:/, ''))
}

const wanted = Object.entries(catalogue).filter(
  ([id, file]) => force || !existsSync(`${OUT_DIR}/${id}.png`) || credits[id]?.file !== file,
)
console.log(`${Object.keys(catalogue).length} banderes al catàleg, ${wanted.length} per baixar`)

const missing = []
for (let i = 0; i < wanted.length; i += 50) {
  const batch = wanted.slice(i, i + 50)
  const infos = await imageInfo(batch.map(([, file]) => file))
  for (const [id, file] of batch) {
    const info = infos.get(file)
    if (!info?.thumburl) {
      const suggestions = await similarFiles(file).catch(() => [])
      missing.push(`${id}: "${file}"` + suggestions.map((s) => `\n      potser «${s}»?`).join(''))
      continue
    }
    const png = await (await get(info.thumburl)).arrayBuffer()
    writeFileSync(`${OUT_DIR}/${id}.png`, Buffer.from(png))
    credits[id] = {
      file,
      license: plain(info.extmetadata?.LicenseShortName?.value),
      artist: plain(info.extmetadata?.Artist?.value),
    }
    console.log(`✔ ${id}  ${file}  (${credits[id].license ?? 'llicència desconeguda'})`)
    await sleep(200)
  }
}

// Fora el que ja no és al catàleg.
for (const id of Object.keys(credits)) if (!(id in catalogue)) delete credits[id]
for (const name of readdirSync(OUT_DIR)) {
  const stale = name.endsWith('.png') && !(name.slice(0, -4) in catalogue)
  // Les primeres versions d'aquest script desaven els SVG originals.
  if (stale || name.endsWith('.svg')) unlinkSync(`${OUT_DIR}/${name}`)
}

const sorted = Object.fromEntries(Object.entries(credits).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(CREDITS, JSON.stringify(sorted, null, 2) + '\n')

if (missing.length > 0) {
  console.error(
    `\n✘ ${missing.length} fitxers que no són a Wikimedia Commons:\n  ${missing.join('\n  ')}`,
  )
  console.error('Arregla els noms a content/flags.yaml (secció catalogue).')
  process.exit(1)
}
console.log('Totes les banderes al dia.')
