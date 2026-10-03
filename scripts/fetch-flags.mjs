#!/usr/bin/env node
/**
 * Downloads the flags listed in content/flags.yaml from Wikimedia Commons.
 *
 *   npm run data:flags            # download missing flags
 *   npm run data:flags -- --force # download all flags again
 *
 * Writes public/flags/<id>.svg and public/flags/credits.json (file, licence and author of each
 * image). Exits with an error if some files could not be found on Commons, after saving the rest.
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
// Wikimedia asks API clients to identify themselves: https://meta.wikimedia.org/wiki/User-Agent_policy
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

/** Strips HTML tags from Commons metadata ("<a href=…>Author</a>" → "Author"). */
const plain = (html) =>
  html
    ?.replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim() || undefined

/** Queries Commons for the download URL and licence of up to 50 files at once. */
async function imageInfo(files) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiextmetadatafilter: 'LicenseShortName|Artist',
    titles: files.map((f) => `File:${f}`).join('|'),
  })
  const { query } = await (await get(`${API}?${params}`)).json()
  // Map every requested title to its final page, following normalisations and redirects.
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

const wanted = Object.entries(catalogue).filter(
  ([id, file]) => force || !existsSync(`${OUT_DIR}/${id}.svg`) || credits[id]?.file !== file,
)
console.log(`${Object.keys(catalogue).length} flags in the catalogue, ${wanted.length} to download`)

const missing = []
for (let i = 0; i < wanted.length; i += 50) {
  const batch = wanted.slice(i, i + 50)
  const infos = await imageInfo(batch.map(([, file]) => file))
  for (const [id, file] of batch) {
    const info = infos.get(file)
    if (!info) {
      missing.push(`${id}: "${file}"`)
      continue
    }
    const svg = await (await get(info.url)).text()
    writeFileSync(`${OUT_DIR}/${id}.svg`, svg)
    credits[id] = {
      file,
      license: plain(info.extmetadata?.LicenseShortName?.value),
      artist: plain(info.extmetadata?.Artist?.value),
    }
    console.log(`✔ ${id}  ${file}  (${credits[id].license ?? 'licence unknown'})`)
    await sleep(200)
  }
}

// Forget flags that are no longer in the catalogue.
for (const id of Object.keys(credits)) if (!(id in catalogue)) delete credits[id]
for (const name of readdirSync(OUT_DIR)) {
  if (name.endsWith('.svg') && !(name.slice(0, -4) in catalogue)) unlinkSync(`${OUT_DIR}/${name}`)
}

const sorted = Object.fromEntries(Object.entries(credits).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(CREDITS, JSON.stringify(sorted, null, 2) + '\n')

if (missing.length > 0) {
  console.error(
    `\n✘ ${missing.length} files not found on Wikimedia Commons:\n  ${missing.join('\n  ')}`,
  )
  console.error('Fix their names in content/flags.yaml (catalogue section).')
  process.exit(1)
}
console.log('All flags are up to date.')
