#!/usr/bin/env node
/**
 * Fa les fronteres d'abans del 1886 a partir de Cliopatria, on CShapes ja no arriba.
 *
 *   npm run data:history
 *
 * Cal haver fet abans `npm run data:borders`: en llegeix els colors, perquè un estat que continua
 * el 1886 (França, l'Imperi Otomà…) mantingui el seu, i les fronteres del 1886, per saber quin
 * estat de CShapes continua cada entitat de Cliopatria.
 *
 * Passos:
 *   1. Baixa Cliopatria (Seshat), si no és a data-raw/, i se'n queda les entitats que toquen
 *      Europa entre FIRST_YEAR i el 1885. Les files entre parèntesis («(Habsburg Monarchy)») són
 *      agrupacions d'altres files: es deixen, perquè taparien les seves peces.
 *   2. Aplica CORRECTIONS: les entitats que Cliopatria allarga fins a la mostra següent o que
 *      porten un nom o un article equivocat (explicades a DADES.md).
 *   3. Dona a cada peça un codi: el de Gleditsch i Ward si continua un estat de CShapes (el que hi
 *      ha a sota el 1886, o SAME_STATE), o el QID de Wikidata si no.
 *   4. Ho retalla i ho simplifica com build-borders.mjs, i hi posa colors i noms de la mateixa
 *      manera: dos veïns no en comparteixen mai, i un estat el manté tota la vida.
 *   5. Ho parteix per segles: l'app només baixa el segle que mira.
 *
 * Deixa (al repo; la llicència és a public/data/README.md):
 *   public/data/history/{segle}.topo.json
 *   public/data/history/{segle}.labels.geojson
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import mapshaper from 'mapshaper'
import polygonClipping from 'polygon-clipping'
import osmtogeojson from 'osmtogeojson'
import polylabel from 'polylabel'
import * as topojson from 'topojson-client'

const SOURCE_URL =
  'https://github.com/Seshat-Global-History-Databank/cliopatria/raw/v0.2.1/cliopatria.geojson.zip'
const RAW_DIR = 'data-raw'
const RAW_ZIP = `${RAW_DIR}/cliopatria.geojson.zip`
const BORDERS = 'public/data/borders.topo.json'
const BORDER_LABELS = 'public/data/labels.geojson'
const OUT_DIR = 'public/data/history'

/** El primer any del mapa: el mateix FIRST_YEAR de src/lib/date.ts. */
const FIRST_YEAR = 1500
/** L'últim any abans de CShapes, que comença l'1 de gener del 1886. */
const LAST_YEAR = 1885
const LAST_DAY = LAST_YEAR * 10000 + 1231
/** Com a build-borders.mjs, perquè el 1885 i el 1886 es vegin igual. */
const BBOX = [-28, 30, 78, 82]
const LABEL_BBOX = [-25, 30, 56, 74]
/**
 * Per distància, no per percentatge: amb OHM, que té molt més detall, un percentatge treia vores a
 * les zones de Cliopatria, i Nàpols i Niça quedaven al mar.
 */
const SIMPLIFY = 'interval=2500'
const PALETTE_SIZE = 12
/** Els identificadors de les peces de CShapes són 0, 1, 2…; els d'aquí comencen més amunt. */
const ID_OFFSET = 1_000_000

/**
 * Les entitats de Cliopatria que són el mateix estat que un codi de Gleditsch i Ward (o que una
 * altra entitat), a més de les que ho són perquè el 1885 ocupen el mateix lloc que l'estat de
 * CShapes del 1886. Porten el mateix color i la mateixa fitxa. Gleditsch i Ward ja fan servir
 * el 255 per a Prússia i el 325 per al Regne de Sardenya des del 1816.
 */
const SAME_STATE = {
  Q207162: '220', // Regne de França
  Q58296: '220', // Primera República Francesa
  Q219817: '220', // Directori
  Q877619: '220', // Consolat
  Q71084: '220', // Primer Imperi Francès
  Q58326: '220', // Segona República Francesa
  Q71092: '220', // Segon Imperi Francès
  Q179876: '200', // Regne d'Anglaterra
  Q330362: '200', // Commonwealth d'Anglaterra
  Q174193: '200', // Regne Unit de la Gran Bretanya i Irlanda
  Q170072: '210', // Províncies Unides
  Q188553: '210', // República Batava
  Q206696: '225', // República Helvètica
  // L'Imperi Suec, no: va tocar els Habsburg a la guerra dels Trenta Anys, i el 1886 Suècia i
  // Àustria-Hongria porten el mateix color.
  Q34: '380', // Regne de Suècia
  Q62651: '390', // Dinamarca-Noruega
  Q35: '390', // Dinamarca
  Q66504140: '300', // Monarquia dels Habsburg
  Q131964: '300', // Imperi Austríac
  Q157367: '255', // Brandenburg-Prússia
  Q27306: '255', // Regne de Prússia
  Q150981: '255', // Confederació d'Alemanya del Nord
  Q200229: '325', // Casa de Savoia
  Q2577303: '325', // Regne de Sardenya
  Q165154: '325', // Regne de Sardenya, amb el QID que fa servir OpenHistoricalMap
  Q170770: '365', // Gran Principat de Moscou
  Q186096: '365', // Tsarat Rus
  Q684030: '340', // Principat de Sèrbia
  Q16086793: '340', // Sèrbia revolucionària
  Q241748: '340', // Regne de Sèrbia
  Q209065: '350', // Regne de Grècia
}

/** Territoris d'un altre estat: van del seu color, més clar, com les colònies de CShapes. */
const DEPENDENT = {
  'Spanish Empire': '230', // les places del nord d'Àfrica
  'Portuguese Empire': '235',
  'Portuguese Africa': '235',
  'English Colonial Empire': '200', // Tànger
  'British Colonial Empire': '200',
  'French Algeria': '220',
  'French Africa': '220',
  'British Africa': '200', // Egipte, com a CShapes el 1886
  'Ottoman Tripolitania': '640',
}

/**
 * On va el nom d'un estat, si el polígon més gran no és el bo: el de Dinamarca, des que perd
 * Noruega, és Islàndia, que CShapes dona a part com a colònia.
 */
const LABEL_HINTS = {
  390: [9.2, 56.1], // Jutlàndia
}

/**
 * On ens separem de Cliopatria. Cliopatria mostreja el mapa cada pocs anys i cada fila val fins a
 * la mostra següent: la República de Baden, que va durar set setmanes del 1849, hi dura fins al
 * 1852. I algunes files porten el nom o l'article d'una altra cosa («Serbs», el poble, per al
 * Principat de Sèrbia).
 *
 * Cada correcció troba unes files (`qid`, i `name` si el QID en té de diferents) i les reparteix
 * per `periods`: cada tram, fins a `until` (inclòs), és de l'entitat que diu `set`. Sense `set`,
 * la fila es queda com és. `set` pot ser un QID que ja és a Cliopatria (n'agafa el nom i l'article
 * de la fila més propera en el temps) o una entitat sencera. Les vores no es toquen: només a qui
 * són i fins quan.
 */
const CORRECTIONS = [
  // ── Revoltes i governs de pocs mesos, que la mostra allarga ─────────────────
  {
    description: "L'Estat Hongarès del 1849: del 14 d'abril a la rendició de Világos (13 d'agost)",
    qid: 'Q28513',
    name: 'Hungarian Nationalists',
    periods: [
      { until: '1849-04-13', set: 'Q131964' },
      {
        until: '1849-08-13',
        set: { qid: 'Q18331029', name: 'Hungarian State', wiki: 'Hungarian State' },
      },
      { set: 'Q131964' },
    ],
  },
  {
    description: 'La República de Baden: del govern provisional (1 de juny del 1849) a Rastatt',
    qid: 'Q690821',
    periods: [{ until: '1849-05-31', set: 'Q186320' }, { until: '1849-07-23' }, { set: 'Q186320' }],
  },
  {
    description: 'La Sicília independent de la revolució del 1848, no «els nacionalistes italians»',
    qid: 'Q6093359',
    periods: [
      { until: '1848-01-11', set: 'Q180393' },
      {
        set: {
          qid: 'Q2708273',
          name: 'Kingdom of Sicily (1848–1849)',
          wiki: 'Sicilian revolution of 1848',
        },
      },
    ],
  },
  {
    description:
      "L'Aixecament de Novembre: el govern polonès del 29 de novembre del 1830 a l'octubre del 1831",
    qid: 'Q1026',
    periods: [
      { until: '1830-11-28', set: 'Q34266' },
      {
        until: '1831-10-21',
        set: {
          qid: 'Q462964',
          name: 'Kingdom of Poland (November Uprising)',
          wiki: 'November Uprising',
        },
      },
      { set: 'Q34266' },
    ],
  },
  {
    description:
      "L'aixecament de Nalivaiko va ser una revolta dins de la República de les Dues Nacions",
    qid: 'Q2560470',
    periods: [{ set: 'Q172107' }],
  },
  {
    description:
      'Brandenburg-Prússia és el Regne de Prússia des de la coronació de Frederic I (18 de gener del 1701)',
    qid: 'Q157367',
    periods: [{ until: '1701-01-17' }, { set: 'Q27306' }],
  },
  {
    description:
      "Florència és un gran ducat des de la butlla de Pius V (27 d'agost del 1569), no una república",
    qid: 'Q148540',
    periods: [{ until: '1569-08-26' }, { set: 'Q154849' }],
  },
  {
    description: 'Les revoltes hugonotes van ser dins del Regne de França',
    qid: 'Q101935',
    periods: [{ set: 'Q207162' }],
  },
  {
    description:
      "Besaràbia va ser una província de l'Imperi Rus des del tractat de Bucarest (1812)",
    qid: 'Q174994',
    periods: [{ set: 'Q34266' }],
  },
  {
    description: "La revolta catalana: el QID i l'article són els de la Catalunya d'avui",
    qid: 'Q5705',
    periods: [
      {
        set: {
          qid: 'Q42345047',
          name: 'Catalan Republic',
          wiki: 'Catalan Republic (1640–1641)',
        },
      },
    ],
  },

  {
    description:
      'Prússia: del 1809 al 1814 Cliopatria li posa el nom de la Confederació del Rin, on no va entrar mai (la seva fila «Kingdom of Prussia» no fa ni 2.000 km²)',
    qid: 'Q154741',
    periods: [{ set: 'Q27306' }],
  },
  {
    description:
      'Prússia: del 1815 al 1867 Cliopatria li posa el nom de la Confederació Germànica, que no era un estat; hi cau Königsberg, que no en formava part',
    qid: 'Q151624',
    periods: [{ set: 'Q27306' }],
  },

  {
    description:
      'França el 1814: Cliopatria dona 100.000 km² del voltant de París al Gran Ducat de Berg, que en feia 15.000 al Rin',
    qid: 'Q249428',
    periods: [
      { until: '1813-12-31' },
      { until: '1814-04-05', set: 'Q71084' },
      {
        until: '1814-12-31',
        set: {
          qid: 'Q207162',
          name: 'Bourbon Kingdom of France',
          wiki: 'Bourbon Restoration in France',
        },
      },
      {},
    ],
  },
  {
    description: "Anglaterra i Escòcia formen la Gran Bretanya l'1 de maig del 1707, no el 1709",
    qid: 'Q179876',
    periods: [{ until: '1707-04-30' }, { set: 'Q23666' }],
  },

  // ── Noms i articles equivocats ──────────────────────────────────────────────
  {
    description: "Sèrbia: «Serbs» és el poble; l'estat va ser revolucionari, principat i regne",
    qid: 'Q127885',
    periods: [
      {
        until: '1813-10-07',
        set: { qid: 'Q16086793', name: 'Revolutionary Serbia', wiki: 'Revolutionary Serbia' },
      },
      {
        until: '1882-03-05',
        set: { qid: 'Q684030', name: 'Principality of Serbia', wiki: 'Principality of Serbia' },
      },
      { set: 'Q241748' },
    ],
  },
  {
    description: 'Sèrbia va ser regne des del 6 de març del 1882, no des del 1880',
    qid: 'Q241748',
    periods: [
      {
        until: '1882-03-05',
        set: { qid: 'Q684030', name: 'Principality of Serbia', wiki: 'Principality of Serbia' },
      },
      {},
    ],
  },
  {
    description: 'Grècia és regne des de la Conferència de Londres (7 de maig del 1832)',
    qid: 'Q528546',
    periods: [
      { until: '1832-05-06' },
      { set: { qid: 'Q209065', name: 'Kingdom of Greece', wiki: 'Kingdom of Greece' } },
    ],
  },
  {
    description: "La Gran Bretanya i Irlanda formen el Regne Unit des de l'1 de gener del 1801",
    qid: 'Q23666',
    periods: [
      { until: '1800-12-31' },
      {
        set: {
          qid: 'Q174193',
          name: 'United Kingdom of Great Britain and Ireland',
          wiki: 'United Kingdom of Great Britain and Ireland',
        },
      },
    ],
  },
  {
    description: 'Dinamarca i Noruega se separen pel tractat de Kiel (14 de gener del 1814)',
    qid: 'Q62651',
    periods: [{ until: '1814-01-14' }, { set: { qid: 'Q35', name: 'Denmark', wiki: 'Denmark' } }],
  },
  {
    description: "L'Imperi Suec s'acaba amb el tractat de Nystad (10 de setembre del 1721)",
    qid: 'Q215443',
    periods: [{ until: '1721-09-10' }, { set: 'Q34' }],
  },
  {
    description:
      'Nàpols és borbònic fins que Josep Bonaparte en pren la corona (30 de març del 1806)',
    qid: 'Q48779892',
    periods: [
      {
        until: '1806-03-29',
        set: { qid: 'Q173065', name: 'Kingdom of Naples', wiki: 'Kingdom of Naples' },
      },
      {},
    ],
  },
  {
    description:
      "La República Italiana napoleònica (QID i article de la Itàlia d'avui), regne des del 17 de març del 1805",
    qid: 'Q38',
    periods: [
      {
        until: '1805-03-16',
        set: { qid: 'Q723118', name: 'Italian Republic', wiki: 'Italian Republic (Napoleonic)' },
      },
      {
        set: {
          qid: 'Q223936',
          name: 'Kingdom of Italy (Napoleonic)',
          wiki: 'Kingdom of Italy (Napoleonic)',
        },
      },
    ],
  },
  {
    description: "El comtat d'Urgell de Cliopatria és Andorra",
    qid: 'Q1514510',
    periods: [{ set: { qid: 'Q228', name: 'Andorra', wiki: 'Andorra' } }],
  },
  {
    description: 'Mònaco és un principat, no un regne',
    qid: 'Q235',
    periods: [{ set: { qid: 'Q235', name: 'Principality of Monaco', wiki: 'Monaco' } }],
  },
  {
    description: "Els estats petits del Sacre Imperi: al mapa, el nom de l'Imperi",
    qid: 'Q12548',
    periods: [{ set: { qid: 'Q12548', name: 'Holy Roman Empire', wiki: 'Holy Roman Empire' } }],
  },
  {
    description: 'Ratisbona: «Regensberg» és una errada',
    qid: 'Q701969',
    periods: [
      {
        set: {
          qid: 'Q701969',
          name: 'Principality of Regensburg',
          wiki: 'Principality of Regensburg',
        },
      },
    ],
  },
  {
    description:
      'Les Illes Jòniques, protectorat britànic des del tractat de París (5 de novembre del 1815)',
    qid: 'Q1077630',
    periods: [
      { until: '1815-11-04' },
      {
        set: {
          qid: 'Q1063498',
          name: 'United States of the Ionian Islands',
          wiki: 'United States of the Ionian Islands',
          owner: '200',
        },
      },
    ],
  },

  // ── Els règims, amb el dia del canvi: les fronteres no canvien, el nom sí ───
  {
    description: 'França: la monarquia cau el 21 de setembre del 1792',
    qid: 'Q58296',
    periods: [{ until: '1792-09-20', set: 'Q207162' }, { until: '1795-11-01' }, { set: 'Q219817' }],
  },
  {
    description: 'França: el Directori acaba amb el cop del 18 de brumari (9 de novembre del 1799)',
    qid: 'Q219817',
    periods: [{ until: '1799-11-09' }, { set: 'Q877619' }],
  },
  {
    description: "França: l'Imperi es proclama el 18 de maig del 1804",
    qid: 'Q877619',
    periods: [{ until: '1804-05-17' }, { set: 'Q71084' }],
  },
  {
    description: "França: Napoleó abdica el 6 d'abril del 1814",
    qid: 'Q71084',
    periods: [
      { until: '1814-04-05' },
      {
        set: {
          qid: 'Q207162',
          name: 'Bourbon Kingdom of France',
          wiki: 'Bourbon Restoration in France',
        },
      },
    ],
  },
  {
    description: "França: la Revolució de Juliol (9 d'agost del 1830) porta la Monarquia de Juliol",
    qid: 'Q207162',
    name: 'Bourbon Kingdom of France',
    periods: [
      { until: '1830-08-08' },
      { set: { qid: 'Q207162', name: 'July Monarchy', wiki: 'July Monarchy' } },
    ],
  },
  {
    description:
      'França: la Segona República va del 24 de febrer del 1848 al 2 de desembre del 1852',
    qid: 'Q58326',
    periods: [
      {
        until: '1848-02-23',
        set: { qid: 'Q207162', name: 'July Monarchy', wiki: 'July Monarchy' },
      },
      { until: '1852-12-01' },
      { set: 'Q71092' },
    ],
  },
  {
    description: 'França: el Segon Imperi cau el 4 de setembre del 1870',
    qid: 'Q71092',
    periods: [{ until: '1870-09-03' }, { set: 'Q70802' }],
  },
  {
    description:
      "Espanya: la Primera República va de l'11 de febrer del 1873 al 29 de desembre del 1874",
    qid: 'Q497777',
    periods: [{ until: '1873-02-10', set: 'Q29' }, { until: '1874-12-29' }, { set: 'Q29' }],
  },
  {
    description: 'Àustria-Hongria neix amb el Compromís (30 de març del 1867)',
    qid: 'Q131964',
    periods: [{ until: '1867-03-29' }, { set: 'Q28513' }],
  },
  {
    description: "El Regne d'Itàlia es proclama el 17 de març del 1861",
    qid: 'Q2577303',
    periods: [{ until: '1861-03-16' }, { set: 'Q172579' }],
  },
]

/**
 * Territoris que Cliopatria dona a qui els ocupava, o a ningú. Cliopatria dibuixa sovint el
 * control militar com si fos sobirania, i la mostra l'allarga: Moscou hi és francesa el 1812 i
 * el 1813, per cinc setmanes d'ocupació, i Viena, otomana del 1683 al 1686, per un setge que va
 * fracassar.
 *
 * Cada correcció diu que, entre `from` i `until`, el territori que tenia un estat en un altre
 * moment (`shape`: les files d'un QID en un any) era de `qid`. Se'l treu a les peces de
 * `takeFrom`, i només a aquestes, perquè no toqui els canvis de veritat dels veïns, i el que se'ls
 * treu se suma a les de `qid`; amb `fill`, la forma sencera, també on no hi havia ningú. Si `qid`
 * no té cap peça en aquell període, n'hi fa una amb el nom de la fila més propera.
 */
const SHAPES = [
  {
    description:
      'Àustria i Bohèmia, de Ferran I, no de Carles V; i el setge de Viena del 1529 va fracassar',
    qid: 'Q66504140',
    shape: [
      { qid: 'Q66504140', year: 1528 },
      { qid: 'Q42585', year: 1528 },
    ],
    takeFrom: ['Q29', 'Q12560'],
    from: '1529-01-01',
    until: '1555-12-31',
  },
  {
    description:
      'Brandenburg i Saxònia, ocupats per Suècia a la guerra dels Trenta Anys, però no annexionats',
    qid: 'Q157367',
    shape: [{ qid: 'Q157367', year: 1631 }],
    takeFrom: ['Q215443'],
    from: '1632-01-01',
    until: '1647-12-31',
  },
  {
    description:
      'Brandenburg i Saxònia, ocupats per Suècia a la guerra dels Trenta Anys, però no annexionats',
    qid: 'Q156199',
    shape: [{ qid: 'Q156199', year: 1631 }],
    takeFrom: ['Q215443'],
    from: '1632-01-01',
    until: '1647-12-31',
  },
  {
    description: 'El setge de Viena del 1683 va fracassar',
    qid: 'Q66504140',
    shape: [{ qid: 'Q66504140', year: 1682 }],
    takeFrom: ['Q12560'],
    from: '1683-01-01',
    until: '1686-12-31',
  },
  {
    description:
      'Escòcia va ser un regne a part fins al 1707, menys durant el Commonwealth de Cromwell',
    qid: 'Q230791',
    shape: [{ qid: 'Q230791', year: 1608 }],
    takeFrom: ['Q179876', 'Q330362'],
    // Del 1640 al 1652, Cliopatria no hi posa ningú: la forma sencera, també on no hi ha res.
    fill: true,
    from: '1609-01-01',
    until: '1652-12-31',
  },
  {
    description: 'Escòcia, de la Restauració (1660) a la unió amb Anglaterra (1707)',
    qid: 'Q230791',
    shape: [{ qid: 'Q230791', year: 1608 }],
    takeFrom: ['Q179876', 'Q330362'],
    fill: true,
    from: '1661-01-01',
    until: '1707-04-30',
  },
  {
    description:
      'Saxònia: el seu elector va ser rei de Polònia (1697-1763), però era un estat a part',
    qid: 'Q156199',
    shape: [{ qid: 'Q156199', year: 1699 }],
    takeFrom: ['Q172107'],
    from: '1700-01-01',
    until: '1756-12-31',
  },
  {
    description:
      "Catalunya, de l'arxiduc Carles fins al 1714: els aliats l'ajudaven, però no era terra anglesa",
    qid: 'Q600093',
    shape: [{ qid: 'Q600093', year: 1705 }],
    takeFrom: ['Q179876', 'Q23666', 'Q8680'],
    from: '1706-01-01',
    until: '1712-12-31',
  },
  {
    description: 'Bohèmia: Prússia hi va entrar el 1744, però no se la va quedar',
    qid: 'Q66504140',
    shape: [{ qid: 'Q66504140', year: 1743 }],
    takeFrom: ['Q27306'],
    from: '1744-01-01',
    until: '1747-12-31',
  },
  {
    description: 'Saxònia, ocupada per Prússia a la guerra dels Set Anys, però no annexionada',
    qid: 'Q156199',
    shape: [{ qid: 'Q156199', year: 1763 }],
    takeFrom: ['Q27306', 'Q66504140'],
    from: '1757-01-01',
    until: '1762-12-31',
  },
  {
    description: 'La Toscana dels Habsburg-Lorena era un gran ducat a part, no terra austríaca',
    qid: 'Q154849',
    shape: [{ qid: 'Q154849', year: 1848 }],
    takeFrom: ['Q66504140'],
    from: '1738-01-01',
    until: '1798-12-31',
  },
  {
    description: 'Àustria: Viena ocupada a la tardor del 1805',
    qid: 'Q66504140',
    shape: [{ qid: 'Q66504140', year: 1804 }],
    takeFrom: ['Q71084'],
    from: '1805-01-01',
    until: '1805-12-31',
  },
  {
    description: 'Prússia després de Tilsit (1807): ocupada, però no annexionada',
    qid: 'Q27306',
    shape: [{ qid: 'Q154741', year: 1809 }],
    takeFrom: ['Q71084'],
    from: '1807-01-01',
    until: '1808-12-31',
  },
  {
    description: 'El Gran Ducat de Varsòvia, creat a Tilsit (22 de juliol del 1807)',
    qid: 'Q152115',
    shape: [{ qid: 'Q152115', year: 1809 }],
    takeFrom: ['Q71084'],
    from: '1807-07-22',
    until: '1808-12-31',
  },
  {
    description: "Àustria: Viena ocupada del maig a l'octubre del 1809",
    qid: 'Q131964',
    shape: [{ qid: 'Q131964', year: 1811 }],
    takeFrom: ['Q71084'],
    from: '1809-01-01',
    until: '1810-12-31',
  },
  {
    description: "Espanya: el regne de Josep Bonaparte no era part de l'Imperi Francès",
    qid: 'Q29',
    shape: [{ qid: 'Q29', year: 1808 }],
    takeFrom: ['Q71084'],
    from: '1809-01-01',
    until: '1811-12-31',
  },
  {
    description: "Rússia: l'exèrcit de Napoleó hi va ser del juny al desembre del 1812",
    qid: 'Q34266',
    shape: [{ qid: 'Q34266', year: 1811 }],
    takeFrom: ['Q71084'],
    from: '1812-01-01',
    until: '1813-12-31',
  },
  {
    description: 'Saxònia, que el 1815 va perdre el nord, però no va desaparèixer dins de Prússia',
    qid: 'Q153015',
    shape: [{ qid: 'Q153015', year: 1820 }],
    takeFrom: ['Q27306'],
    from: '1815-01-01',
    until: '1819-12-31',
  },
  {
    description:
      'Hannover, regne propi des del 1814, en unió personal amb el Regne Unit fins al 1837',
    qid: 'Q164079',
    shape: [{ qid: 'Q164079', year: 1840 }],
    takeFrom: ['Q27306', 'Q174193'],
    from: '1815-01-01',
    until: '1839-12-31',
  },
  {
    description:
      "La Toscana, també després del 1815 i durant l'ocupació austríaca del 1849 al 1855",
    qid: 'Q154849',
    shape: [{ qid: 'Q154849', year: 1848 }],
    takeFrom: ['Q131964'],
    from: '1814-01-01',
    until: '1858-12-31',
  },
  {
    description: "Llombardia, en revolta el 1848, va tornar a Àustria a l'agost",
    qid: 'Q131964',
    shape: [{ qid: 'Q131964', year: 1847 }],
    takeFrom: ['Q2577303'],
    from: '1848-01-01',
    until: '1848-12-31',
  },
  {
    description: 'Bohèmia, ocupada per Prússia el 1866 però no annexionada',
    qid: 'Q131964',
    shape: [{ qid: 'Q131964', year: 1864 }],
    takeFrom: ['Q27306'],
    from: '1866-01-01',
    until: '1867-03-29',
  },
  {
    description: 'Bohèmia, ocupada per Prússia el 1866 però no annexionada',
    qid: 'Q28513',
    shape: [{ qid: 'Q131964', year: 1864 }],
    takeFrom: ['Q27306'],
    from: '1867-03-30',
    until: '1867-12-31',
  },
  {
    description: 'Saxònia, ocupada per Prússia el 1866 però no annexionada',
    qid: 'Q153015',
    shape: [{ qid: 'Q153015', year: 1868 }],
    takeFrom: ['Q27306'],
    from: '1866-01-01',
    until: '1867-12-31',
  },
  {
    description: "França el 1870: el nord ocupat no era de la Confederació d'Alemanya del Nord",
    qid: 'Q71092',
    shape: [{ qid: 'Q71092', year: 1869 }],
    takeFrom: ['Q150981'],
    from: '1870-01-01',
    until: '1870-09-03',
  },
  {
    description: "França el 1870: el nord ocupat no era de la Confederació d'Alemanya del Nord",
    qid: 'Q70802',
    shape: [{ qid: 'Q71092', year: 1869 }],
    takeFrom: ['Q150981'],
    from: '1870-09-04',
    until: '1870-12-31',
  },
  {
    description:
      'França el 1871 i el 1872: ocupada fins al 1873, però només va perdre Alsàcia i Lorena',
    qid: 'Q70802',
    shape: [{ qid: 'Q70802', year: 1873 }],
    takeFrom: ['Q43287'],
    from: '1871-01-01',
    until: '1872-12-31',
  },
  // ── Investigades amb la Viquipèdia, segons el criteri de DADES.md §0.1 ──────
  {
    description:
      'La revolta bohèmia: els estats de Bohèmia es governen sols de la defenestració de Praga (23 de maig del 1618) a la Muntanya Blanca (8 de novembre del 1620)',
    qid: 'Q42585',
    shape: [{ qid: 'Q42585', year: 1528 }],
    takeFrom: ['Q66504140', 'Q12548'],
    from: '1618-05-23',
    until: '1620-11-08',
  },
  {
    description: 'Bohèmia torna als Habsburg després de la Muntanya Blanca, no al «Sacre Imperi»',
    qid: 'Q66504140',
    shape: [{ qid: 'Q66504140', year: 1618 }],
    takeFrom: ['Q12548', 'Q42585'],
    from: '1620-11-09',
    until: '1621-12-31',
  },
  {
    description:
      "Hamburg i el nord d'Alemanya, dins del Sacre Imperi: ni danesos (1622-1628) ni dels Habsburg (1629-1631); el Mecklenburg de Wallenstein era un feu imperial",
    qid: 'Q12548',
    shape: [{ qid: 'Q12548', year: 1618 }],
    takeFrom: ['Q62651', 'Q66504140'],
    from: '1622-01-01',
    until: '1631-12-31',
  },
  {
    description:
      'Les ocupacions sueques de la guerra dels Trenta Anys (Magúncia, Frankfurt, Würzburg, Mecklenburg, Bremen-Verden…): Suècia no en guanya res fins a Westfàlia, el 1648',
    qid: 'Q12548',
    shape: [{ qid: 'Q12548', year: 1618 }],
    takeFrom: ['Q215443'],
    from: '1632-01-01',
    until: '1647-12-31',
  },
  {
    description: 'Valàquia, vassall otomà ocupat per Rússia a la guerra del 1768-1774',
    qid: 'Q171393',
    shape: [{ qid: 'Q171393', year: 1775 }],
    takeFrom: ['Q34266'],
    from: '1772-01-01',
    until: '1774-12-31',
  },
  {
    description: 'Moldàvia, vassall otomà ocupat per Rússia a la guerra del 1768-1774',
    qid: 'Q10957559',
    shape: [{ qid: 'Q10957559', year: 1775 }],
    takeFrom: ['Q34266'],
    from: '1769-01-01',
    until: '1774-12-31',
  },
  {
    description: 'Valàquia i Moldàvia, ocupades per Àustria i Rússia a la guerra del 1787-1792',
    qid: 'Q171393',
    shape: [{ qid: 'Q171393', year: 1792 }],
    takeFrom: ['Q34266', 'Q66504140'],
    from: '1791-01-01',
    until: '1791-12-31',
  },
  {
    description: 'Valàquia i Moldàvia, ocupades per Àustria i Rússia a la guerra del 1787-1792',
    qid: 'Q10957559',
    shape: [{ qid: 'Q10957559', year: 1792 }],
    takeFrom: ['Q34266', 'Q66504140'],
    from: '1791-01-01',
    until: '1791-12-31',
  },
  {
    description:
      'Valàquia, ocupada per Rússia del 1806 al tractat de Bucarest (28 de maig del 1812)',
    qid: 'Q171393',
    shape: [{ qid: 'Q171393', year: 1812 }],
    takeFrom: ['Q34266'],
    from: '1807-01-01',
    until: '1811-12-31',
  },
  {
    description:
      'Moldàvia, amb Besaràbia, fins al tractat de Bucarest (28 de maig del 1812), que la dona a Rússia',
    qid: 'Q10957559',
    shape: [{ qid: 'Q10957559', year: 1806 }],
    takeFrom: ['Q34266'],
    from: '1807-01-01',
    until: '1812-05-27',
  },
  {
    description: 'Moldàvia, sense Besaràbia, després del tractat de Bucarest',
    qid: 'Q10957559',
    shape: [{ qid: 'Q10957559', year: 1814 }],
    takeFrom: ['Q34266'],
    from: '1812-05-28',
    until: '1813-12-31',
  },
  {
    description:
      'Valàquia i Moldàvia, sota administració russa del 1828 al 1834, però vassalls otomans',
    qid: 'Q171393',
    shape: [{ qid: 'Q171393', year: 1834 }],
    takeFrom: ['Q34266'],
    from: '1828-01-01',
    until: '1833-12-31',
  },
  {
    description:
      'Valàquia i Moldàvia, sota administració russa del 1828 al 1834, però vassalls otomans',
    qid: 'Q10957559',
    shape: [{ qid: 'Q10957559', year: 1834 }],
    takeFrom: ['Q34266'],
    from: '1828-01-01',
    until: '1833-12-31',
  },
  {
    description:
      'Valàquia i Moldàvia, ocupades per Rússia (1848-1851, 1853-1854) i per Àustria (1854-1857)',
    qid: 'Q171393',
    shape: [{ qid: 'Q171393', year: 1857 }],
    takeFrom: ['Q34266', 'Q131964'],
    from: '1849-01-01',
    until: '1856-12-31',
  },
  {
    description:
      'Valàquia i Moldàvia, ocupades per Rússia (1848-1851, 1853-1854) i per Àustria (1854-1857)',
    qid: 'Q10957559',
    shape: [{ qid: 'Q10957559', year: 1848 }],
    takeFrom: ['Q34266', 'Q131964'],
    from: '1849-01-01',
    until: '1856-12-31',
  },
  {
    description:
      "Hamburg, ciutat lliure des del 1806: França l'ocupa aquell any, però no se l'annexiona fins al 1811",
    qid: 'Q1055',
    shape: [{ qid: 'Q1055', year: 1815 }],
    takeFrom: ['Q71084'],
    from: '1806-01-01',
    until: '1810-12-31',
  },
  {
    description: "Bremen, ciutat lliure fins a l'annexió francesa del 1811",
    qid: 'Q474779',
    shape: [{ qid: 'Q474779', year: 1815 }],
    takeFrom: ['Q71084'],
    from: '1807-01-01',
    until: '1810-12-31',
  },
  {
    description:
      "Alsàcia i Lorena, franceses fins al tractat de Frankfurt (10 de maig del 1871), no des de l'1 de gener",
    qid: 'Q70802',
    shape: [{ qid: 'Q71092', year: 1869 }],
    takeFrom: ['Q43287'],
    from: '1871-01-01',
    until: '1871-05-09',
  },
  {
    description: 'Lübeck, annexionada per França del 1811 al 1813, que Cliopatria deixa lliure',
    qid: 'Q71084',
    shape: [{ qid: 'Q950240', year: 1815 }],
    takeFrom: ['Q950240'],
    from: '1811-01-01',
    until: '1813-12-31',
  },
]

/**
 * Els tractats grans, el dia que es van signar. Cliopatria dibuixa el mapa de després del tractat
 * des de l'1 de gener de l'any de la mostra: el de Westfàlia, deu mesos abans d'hora. Les peces
 * dels estats que canvien aquell any dins de `bbox` ([oest, sud, est, nord]) passen a començar el
 * dia del tractat, i les d'abans, a acabar la vigília. `sample` és l'any de la mostra de
 * Cliopatria que el recull, que de vegades és el d'abans (la segona partició de Polònia surt el
 * 1792).
 */
const TRANSITIONS = [
  { description: 'Pau de Westfàlia', date: '1648-10-24', sample: 1648, bbox: [3, 45, 24, 56] },
  { description: 'Pau dels Pirineus', date: '1659-11-07', sample: 1659, bbox: [-2, 41, 5, 51.5] },
  { description: "Tractat d'Utrecht", date: '1713-04-11', sample: 1713, bbox: [-10, 35, 20, 53] },
  {
    description: 'Tractat de Passarowitz',
    date: '1718-07-21',
    sample: 1718,
    bbox: [14, 42, 26, 47],
  },
  { description: 'Tractat de Nystad', date: '1721-09-10', sample: 1721, bbox: [18, 54, 32, 62] },
  {
    description: "Tractat d'Aquisgrà",
    date: '1748-10-18',
    sample: 1748,
    bbox: [6, 43, 18, 52],
  },
  {
    description: 'Primera partició de Polònia',
    date: '1772-08-05',
    sample: 1772,
    bbox: [14, 48, 33, 58],
  },
  {
    description: 'Annexió de Crimea per Rússia',
    date: '1783-04-19',
    sample: 1783,
    bbox: [32, 44, 37, 47],
  },
  {
    description:
      'Segona partició de Polònia (tractat entre Prússia i Rússia); Cliopatria la posa el 1792',
    date: '1793-01-23',
    sample: 1792,
    bbox: [14, 45, 33, 58],
  },
  {
    description:
      "Tercera partició de Polònia: l'acord del 24 d'octubre del 1795 (el tractat final és del 26 de gener del 1797); Cliopatria la posa el 1794",
    date: '1795-10-24',
    sample: 1794,
    bbox: [14, 48, 33, 58],
  },
  {
    description: 'Tractat de Campo Formio',
    date: '1797-10-17',
    sample: 1797,
    bbox: [2, 43, 16, 52],
  },
  { description: 'Tractats de Tilsit', date: '1807-07-09', sample: 1807, bbox: [6, 49, 28, 57] },
  {
    description: 'Tractat de Schönbrunn',
    date: '1809-10-14',
    sample: 1809,
    bbox: [9, 43, 26, 52],
  },
  {
    description: 'Acta final del Congrés de Viena',
    date: '1815-06-09',
    sample: 1815,
    bbox: [-5, 40, 30, 60],
  },
  {
    description: 'Independència de Bèlgica',
    date: '1830-10-04',
    sample: 1830,
    bbox: [2, 49, 7, 52],
  },
  { description: 'Tractat de Zúric', date: '1859-11-10', sample: 1859, bbox: [8, 44, 12, 47] },
  {
    description: 'Tractat de Torí: Niça i Savoia, i les annexions de la Itàlia central',
    date: '1860-03-24',
    sample: 1860,
    bbox: [6, 42, 13, 47],
  },
  { description: 'Tractat de Viena', date: '1864-10-30', sample: 1864, bbox: [8, 53, 12, 56] },
  { description: 'Pau de Praga', date: '1866-08-23', sample: 1866, bbox: [5, 44, 24, 56] },
  {
    description:
      "La Confederació d'Alemanya del Nord, que neix l'1 de juliol del 1867; Cliopatria la posa el 1868",
    date: '1867-07-01',
    sample: 1868,
    bbox: [5, 47, 23, 56],
  },
]

// ── Les dades ────────────────────────────────────────────────────────────────

const toNumber = (iso) => Number(iso.replaceAll('-', ''))
const shiftDay = (n, days) => {
  const s = String(n)
  const d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8) + days))
  return Number(d.toISOString().slice(0, 10).replaceAll('-', ''))
}
const nextDay = (n) => shiftDay(n, 1)
const previousDay = (n) => shiftDay(n, -1)

async function readCliopatria() {
  if (!existsSync(RAW_ZIP)) {
    mkdirSync(RAW_DIR, { recursive: true })
    console.log(`Baixant ${SOURCE_URL}`)
    const res = await fetch(SOURCE_URL)
    if (!res.ok) throw new Error(`No s'ha pogut baixar: HTTP ${res.status}`)
    writeFileSync(RAW_ZIP, Buffer.from(await res.arrayBuffer()))
  }
  // Node no sap descomprimir zip; l'ordre `unzip` sí, i és a Linux i a macOS.
  const name = execFileSync('unzip', ['-Z1', RAW_ZIP], { encoding: 'utf8' })
    .split('\n')
    .find((n) => n.endsWith('.geojson'))
  const raw = execFileSync('unzip', ['-p', RAW_ZIP, name], { maxBuffer: 1 << 30 })
  return JSON.parse(raw)
}

/** Si un polígon toca el requadre: n'hi ha prou amb els vèrtexs, que són milers. */
function touches(geometry, [w, s, e, n]) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polygons.some((p) => p[0].some(([x, y]) => x >= w && x <= e && y >= s && y <= n))
}

/** Les files que valen: dins del període i d'Europa, i sense les agrupacions. */
function selectRows(collection) {
  return collection.features.filter(
    ({ properties: p, geometry }) =>
      geometry &&
      p.Type === 'POLITY' &&
      !p.Name.startsWith('(') &&
      p.ToYear >= FIRST_YEAR &&
      p.FromYear <= LAST_YEAR &&
      touches(geometry, BBOX),
  )
}

/** Qui és cada QID, fila a fila, per poder-hi tornar una peça corregida. */
function identities(rows) {
  const byQid = new Map()
  for (const { properties: p } of rows) {
    if (!byQid.has(p.Wikidata)) byQid.set(p.Wikidata, [])
    byQid.get(p.Wikidata).push({ name: p.Name, wiki: p.Wikipedia, from: p.FromYear, to: p.ToYear })
  }
  return (qid, year) => {
    const known = byQid.get(qid)
    if (!known) throw new Error(`CORRECTIONS: ${qid} no és a Cliopatria; cal donar-ne el nom`)
    const distance = (r) => (year < r.from ? r.from - year : year > r.to ? year - r.to : 0)
    const nearest = known.reduce((a, b) => (distance(b) < distance(a) ? b : a))
    return { qid, name: nearest.name, wiki: nearest.wiki }
  }
}

/** Les peces, amb les dates i qui són, i les correccions ja aplicades. */
function toPieces(rows, identityOf) {
  const used = new Set()
  const pieces = rows.flatMap(({ properties: p, geometry }) => {
    const base = {
      qid: p.Wikidata,
      name: p.Name,
      wiki: p.Wikipedia,
      s: Math.max(p.FromYear, FIRST_YEAR) * 10000 + 101,
      e: Math.min(p.ToYear * 10000 + 1231, LAST_DAY),
    }
    const fix = CORRECTIONS.find((c) => c.qid === p.Wikidata && (!c.name || c.name === p.Name))
    if (!fix) return [{ ...base, geometry }]
    used.add(fix)
    const out = []
    let start = toNumber(`${FIRST_YEAR}-01-01`)
    for (const period of fix.periods) {
      const end = period.until ? toNumber(period.until) : Infinity
      const s = Math.max(base.s, start)
      const e = Math.min(base.e, end)
      if (s <= e) {
        const set =
          typeof period.set === 'string'
            ? identityOf(period.set, Math.floor(s / 10000))
            : (period.set ?? {})
        out.push({ ...base, ...set, s, e, geometry })
      }
      if (end === Infinity) break
      start = nextDay(end)
    }
    return out
  })
  for (const fix of CORRECTIONS) {
    if (!used.has(fix)) throw new Error(`CORRECTIONS: «${fix.description}» no troba cap fila`)
  }
  return pieces
}

const toMulti = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)
const fromMulti = (coordinates) =>
  coordinates.length > 0 ? { type: 'MultiPolygon', coordinates } : null

function bboxOf(multi) {
  const box = [Infinity, Infinity, -Infinity, -Infinity]
  for (const polygon of multi) {
    for (const [x, y] of polygon[0]) {
      box[0] = Math.min(box[0], x)
      box[1] = Math.min(box[1], y)
      box[2] = Math.max(box[2], x)
      box[3] = Math.max(box[3], y)
    }
  }
  return box
}
const multiArea = (multi) => multi.reduce((sum, [outer]) => sum + ringArea(outer), 0)
const touch = (a, b) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]

/** Els trossos de [from, until] que no cobreix cap dels intervals. */
function gaps(intervals, from, until) {
  const out = []
  let cursor = from
  for (const [s, e] of [...intervals].sort((a, b) => a[0] - b[0])) {
    if (s > cursor) out.push([cursor, previousDay(s)])
    cursor = Math.max(cursor, nextDay(e))
  }
  if (cursor <= until) out.push([cursor, until])
  return out
}

/** Aplica SHAPES: cada territori, a qui era, i només dins de les dates de la correcció. */
function applyShapes(pieces, rows, identityOf) {
  let out = pieces
  for (const fix of SHAPES) {
    const shapeRows = fix.shape.flatMap(({ qid, year }) => {
      const found = rows.filter(
        ({ properties: p }) => p.Wikidata === qid && p.FromYear <= year && year <= p.ToYear,
      )
      if (found.length === 0) throw new Error(`SHAPES: ${qid} no té cap fila el ${year}`)
      return found
    })
    const shape = polygonClipping.union(...shapeRows.map((r) => toMulti(r.geometry)))
    const box = bboxOf(shape)
    const from = toNumber(fix.from)
    const until = toNumber(fix.until)
    const inWindow = (p) => p.s <= until && p.e >= from
    const isOwner = (p) => p.qid === fix.qid
    const isTaken = (p) => fix.takeFrom.includes(p.qid) && touch(bboxOf(toMulti(p.geometry)), box)

    // El que es treu a l'ocupant, i només això, torna a qui era: si se li sumés tota la forma,
    // es menjaria els veïns que hagin canviat de veritat (la Toscana, dins l'Àustria del 1847).
    const takenParts = out
      .filter((p) => inWindow(p) && isTaken(p))
      .map((p) => polygonClipping.intersection(toMulti(p.geometry), shape))
      .filter((part) => part.length > 0)
    const taken = fix.fill ? shape : takenParts.length ? polygonClipping.union(...takenParts) : []
    if (taken.length === 0) throw new Error(`SHAPES: «${fix.description}» no treu res a ningú`)

    // Se suma a la peça més gran de l'estat, no a totes: la Rússia del 1812 en té dues (la
    // Besaràbia acabada de guanyar), i les dues s'haurien quedat el mateix territori.
    const owners = out.filter((p) => inWindow(p) && isOwner(p))
    const size = (p) => multiArea(toMulti(p.geometry))
    const receives = (piece) =>
      owners.every(
        (other) =>
          other === piece || other.s > piece.e || other.e < piece.s || size(other) <= size(piece),
      )

    const covered = []
    const next = []
    for (const piece of out) {
      if (!inWindow(piece) || (!isOwner(piece) && !isTaken(piece))) {
        next.push(piece)
        continue
      }
      // El que cau fora de les dates es queda com era.
      if (piece.s < from) next.push({ ...piece, e: previousDay(from) })
      if (piece.e > until) next.push({ ...piece, s: nextDay(until) })
      const inside = { ...piece, s: Math.max(piece.s, from), e: Math.min(piece.e, until) }
      inside.geometry = fromMulti(
        !isOwner(piece)
          ? polygonClipping.difference(toMulti(piece.geometry), shape)
          : receives(piece)
            ? polygonClipping.union(toMulti(piece.geometry), taken)
            : toMulti(piece.geometry),
      )
      if (isOwner(piece)) covered.push([inside.s, inside.e])
      if (inside.geometry) next.push(inside)
    }
    for (const [s, e] of gaps(covered, from, until)) {
      const identity = identityOf(fix.qid, Math.floor(s / 10000))
      next.push({ ...identity, s, e, geometry: fromMulti(taken) })
    }
    out = next
  }
  return out
}

/** Graus quadrats: uns 800 km² a la latitud d'Europa. */
const EXCHANGE_MIN = 0.1

/** Aplica TRANSITIONS: el canvi, el dia del tractat i no l'1 de gener de la mostra. */
function applyTransitions(pieces) {
  for (const t of TRANSITIONS) {
    const start = t.sample * 10000 + 101
    const lastBefore = (t.sample - 1) * 10000 + 1231
    const day = toNumber(t.date)
    // Tots els trossos d'un estat que canvia, també els de fora del requadre: si no, la mateixa
    // frontera canviaria en dos dies diferents a banda i banda.
    const area = [
      [
        [t.bbox[0], t.bbox[1]],
        [t.bbox[2], t.bbox[1]],
        [t.bbox[2], t.bbox[3]],
        [t.bbox[0], t.bbox[3]],
        [t.bbox[0], t.bbox[1]],
      ],
    ]
    const inArea = (p) =>
      touch(bboxOf(toMulti(p.geometry)), t.bbox) &&
      polygonClipping.intersection(toMulti(p.geometry), area).length > 0
    // Els estats de la zona que canvien aquell any, i tots els que s'intercanvien territori amb
    // ells: el 1809, Rússia és a la zona de Schönbrunn i guanya Finlàndia a Suècia, que no hi
    // és; si només es mogués Rússia, Finlàndia quedaria en blanc del gener a l'octubre.
    const before = pieces.filter((p) => p.e === lastBefore)
    const after = pieces.filter((p) => p.s === start)
    const changing = new Set([...before, ...after].filter(inArea).map((p) => p.qid))
    const exchanges = []
    for (const b of before) {
      for (const a of after) {
        if (a.qid === b.qid || !touch(bboxOf(toMulti(a.geometry)), bboxOf(toMulti(b.geometry))))
          continue
        const shared = polygonClipping.intersection(toMulti(a.geometry), toMulti(b.geometry))
        // Menys d'uns 800 km² no és un canvi de mans: Cliopatria torna a dibuixar una mica
        // diferent la mateixa frontera d'una mostra a l'altra (França i els Països Baixos, el 1830).
        if (multiArea(shared) > EXCHANGE_MIN) exchanges.push([a.qid, b.qid, multiArea(shared)])
      }
    }
    for (let grew = true; grew;) {
      grew = false
      for (const [x, y] of exchanges) {
        if (changing.has(x) !== changing.has(y)) {
          changing.add(x)
          changing.add(y)
          grew = true
        }
      }
    }
    // Un estat que aquell any ja canvia abans del tractat per una altra raó (la República
    // Francesa el setembre del 1792) es queda amb les seves dates.
    const keep = new Set(pieces.filter((p) => p.s === start && p.e < day).map((p) => p.qid))
    for (const qid of keep) {
      // Si s'intercanviava territori amb un estat que sí que es mou, quedaria un forat o una
      // peça repetida fins al dia del tractat: val més no posar-hi el tractat.
      if (changing.has(qid) && exchanges.some(([x, y]) => (x === qid || y === qid) && x !== y)) {
        throw new Error(
          `TRANSITIONS: «${t.description}» xoca amb les dates pròpies de ${qid}: ${JSON.stringify(exchanges.filter((e) => e.includes(qid)))}`,
        )
      }
      changing.delete(qid)
    }
    for (const p of pieces) {
      if (!changing.has(p.qid)) continue
      if (p.s === start) p.s = day
      if (p.e === lastBefore) p.e = previousDay(day)
      if (p.s > p.e) {
        throw new Error(`TRANSITIONS: «${t.description}» deixa ${p.qid} sense dies (${p.s}-${p.e})`)
      }
    }
  }
  return pieces
}

// ── OpenHistoricalMap ────────────────────────────────────────────────────────

/**
 * A l'Europa central del 1815 al 1867, Cliopatria no distingeix els estats petits: posa Kassel a
 * Hannover, Frankfurt a Hessen-Darmstadt i Gotha dins de Prússia. OpenHistoricalMap (CC0) els té
 * tots, amb el dia de cada canvi. Allà on n'hi ha, mana OHM; la resta, Cliopatria.
 *
 * Hi entren els estats de la Confederació Germànica i els d'Itàlia, també els governs
 * revolucionaris que van governar un territori (Milà i Venècia el 1848, Garibaldi el 1860). En
 * queden fora els veïns, que segueixen sent de Cliopatria: OHM hi té errors que Cliopatria no té
 * (l'Imperi Otomà s'endinsa a Àustria, Suècia es queda la Pomerània després del 1815).
 */
const OHM = {
  url: 'https://overpass-api.openhistoricalmap.org/api/interpreter',
  file: `${RAW_DIR}/ohm-confederacio.json`,
  from: '1815-06-09',
  // Fins a l'Imperi Alemany. OHM el fa començar amb la constitució del 4 de maig del 1871, però els
  // tractats d'adhesió dels estats del sud van entrar en vigor l'1 de gener (DADES.md §0.1).
  until: '1870-12-31',
  // [sud, oest, nord, est], com a Overpass.
  bbox: [36, 5, 56, 24],
  exclude: [
    'Q12560', // Imperi Otomà
    'Q221457', // Regne de Polònia
    'Q34266', // Imperi Rus
    'Q15864', // Països Baixos
    'Q29999', // Països Baixos
    'Q376009', // Ducat de Limburg: un tros dels Països Baixos
    'Q31', // Bèlgica
    'Q207162', // França
    'Q71092', // França
    'Q218272', // Algèria francesa
    'Q35', // Dinamarca
    'Q878461', // Dinamarca
    'Q62589', // Suècia-Noruega
    'Q39', // Suïssa
    'Q7886026', // Suïssa
    'Q3324486', // Montenegro
    'Q779011', // Montenegro
    'Q6744657', // Malta
    'Q3038', // Heligoland, colònia britànica
  ],
  // Les que OHM no lliga a Wikidata.
  qids: {
    'Hohenzollern-Hechingen': 'Q673865',
    'Hohenzollern-Sigmaringen': 'Q157013',
    'Provisional government of Milan': 'Q623164',
  },
}

const UA = { 'User-Agent': 'HistoryMap/0.1 (https://github.com/ArnauM13/history-map)' }

async function overpass(query) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(OHM.url, {
      method: 'POST',
      headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: query }),
    })
    if (res.ok) return res.json()
    if (attempt >= 4) throw new Error(`OpenHistoricalMap: HTTP ${res.status}`)
    await new Promise((resolve) => setTimeout(resolve, 10_000 * attempt))
  }
}

/** Una data d'OHM («1845», «1860-10», «1815-06-09»), com a enter AAAAMMDD. */
const ohmDate = (value) => {
  const [y, m = '01', d = '01'] = value.split('-')
  return Number(`${y}${m.padStart(2, '0')}${d.padStart(2, '0')}`)
}

/** El nom anglès i l'article de la Viquipèdia anglesa d'un QID, de Wikidata. */
async function wikidataNames(qids) {
  const out = {}
  for (const qid of qids) {
    const res = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`, {
      headers: UA,
    })
    if (!res.ok) throw new Error(`Wikidata ${qid}: HTTP ${res.status}`)
    const entity = Object.values((await res.json()).entities)[0]
    out[qid] = { name: entity.labels?.en?.value, wiki: entity.sitelinks?.enwiki?.title }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  return out
}

/**
 * Les versions dels estats d'OHM que valen entre OHM.from i OHM.until, amb la geometria. Es
 * baixen un cop, a data-raw/: pesen uns quants centenars de MB.
 */
async function readOhm() {
  if (!existsSync(OHM.file)) {
    const [s, w, n, e] = OHM.bbox
    console.log('Baixant els estats de la Confederació Germànica i d’Itàlia d’OpenHistoricalMap')
    const listed = await overpass(
      `[out:json][timeout:300];relation["boundary"="administrative"]["admin_level"="2"]["start_date"~"^1[78]"](${s},${w},${n},${e});out tags;`,
    )
    const from = toNumber(OHM.from)
    const until = toNumber(OHM.until)
    const wanted = listed.elements.filter(({ tags: t }) => {
      const qid = t.wikidata ?? OHM.qids[t['name:en'] ?? t.name]
      return (
        qid &&
        !OHM.exclude.includes(qid) &&
        ohmDate(t.start_date) <= until &&
        (!t.end_date || ohmDate(t.end_date) > from)
      )
    })
    const raw = await overpass(
      `[out:json][timeout:600];relation(id:${wanted.map((r) => r.id).join(',')});out geom;`,
    )
    const qids = [
      ...new Set(wanted.map(({ tags: t }) => t.wikidata ?? OHM.qids[t['name:en'] ?? t.name])),
    ]
    writeFileSync(OHM.file, JSON.stringify({ raw, names: await wikidataNames(qids) }))
  }
  const { raw, names } = JSON.parse(readFileSync(OHM.file, 'utf8'))
  const from = toNumber(OHM.from)
  const until = toNumber(OHM.until)
  const features = osmtogeojson(raw, { flatProperties: true }).features.filter(
    (f) => f.id.startsWith('relation/') && /Polygon/.test(f.geometry?.type ?? ''),
  )
  const versions = []
  for (const { geometry, properties: t, id } of features) {
    const qid = t.wikidata ?? OHM.qids[t['name:en'] ?? t.name]
    const s = Math.max(ohmDate(t.start_date), from)
    const e = Math.min(t.end_date ? previousDay(ohmDate(t.end_date)) : until, until)
    // OHM també té errors de dates: una versió de l'Imperi Francès s'hi acaba abans de començar.
    if (s > e) {
      console.warn(`  OHM: ${id} (${t.name}) s'acaba abans de començar; no hi entra`)
      continue
    }
    versions.push({ qid, osm: id, ...names[qid], s, e, geometry })
  }
  // A la resolució d'OHM, cada resta trigaria minuts; amb la de Cliopatria, n'hi ha prou.
  const output = await mapshaper.applyCommands(
    '-i input.json -simplify interval=250 keep-shapes -o output.json format=geojson',
    {
      'input.json': {
        type: 'FeatureCollection',
        features: versions.map(({ geometry }, k) => ({
          type: 'Feature',
          geometry,
          properties: { k },
        })),
      },
    },
  )
  for (const f of JSON.parse(output['output.json']).features)
    versions[f.properties.k].geometry = f.geometry
  return versions
}

/**
 * On la frontera no va canviar fins al 1886, mana CShapes, que és la font més precisa del mapa.
 * La Prússia d'OHM del 1829 al 1834 s'endinsa 13.000 km² a la Polònia russa; la Polònia d'OHM i
 * CShapes coincideixen. La frontera occidental de Rússia no es mou del 1815 al 1914.
 */
function fixOhmWithCShapes(versions, cshapes) {
  const day = toNumber(`${LAST_YEAR + 1}-01-01`)
  const russia = polygonClipping.union(
    ...cshapes
      .filter(
        (f) =>
          f.geometry &&
          f.properties.code === '365' &&
          f.properties.s <= day &&
          day <= f.properties.e,
      )
      .map((f) => toMulti(f.geometry)),
  )
  const box = bboxOf(russia)
  for (const v of versions) {
    if (!touch(bboxOf(toMulti(v.geometry)), box)) continue
    v.geometry = fromMulti(polygonClipping.difference(toMulti(v.geometry), russia))
  }
  return versions.filter((v) => v.geometry)
}

/**
 * Posa les versions d'OHM al lloc de Cliopatria. Per a cada tram entre dos canvis d'OHM, es treu
 * de les peces de Cliopatria el territori que cobreix OHM aquell tram, i s'hi afegeixen les d'OHM.
 */
function applyOhm(pieces, versions) {
  const from = toNumber(OHM.from)
  const until = toNumber(OHM.until)
  const cuts = [...new Set([from, ...versions.flatMap((v) => [v.s, nextDay(v.e)]), nextDay(until)])]
    .filter((d) => d >= from && d <= nextDay(until))
    .sort((a, b) => a - b)
  const out = pieces.filter((p) => p.e < from || p.s > until)
  // El que cau fora de la finestra, com era.
  for (const p of pieces) {
    if (p.e < from || p.s > until) continue
    if (p.s < from) out.push({ ...p, e: previousDay(from) })
    if (p.e > until) out.push({ ...p, s: nextDay(until) })
  }
  // Les peces que OHM no toca mai (Rússia, l'Imperi Otomà) no cal retallar-les a cada tram.
  const all = polygonClipping.union(...versions.map((v) => toMulti(v.geometry)))
  const allBox = bboxOf(all)
  const touched = new Set(
    pieces.filter(
      (p) =>
        p.e >= from &&
        p.s <= until &&
        touch(bboxOf(toMulti(p.geometry)), allBox) &&
        polygonClipping.intersection(toMulti(p.geometry), all).length > 0,
    ),
  )
  for (let i = 0; i < cuts.length - 1; i++) {
    const s = cuts[i]
    const e = previousDay(cuts[i + 1])
    const covered = versions.filter((v) => v.s <= e && v.e >= s)
    const union = covered.length
      ? polygonClipping.union(...covered.map((v) => toMulti(v.geometry)))
      : []
    const box = bboxOf(union)
    for (const p of pieces) {
      if (p.e < s || p.s > e) continue
      const geometry =
        union.length && touched.has(p) && touch(bboxOf(toMulti(p.geometry)), box)
          ? fromMulti(polygonClipping.difference(toMulti(p.geometry), union))
          : p.geometry
      if (geometry) out.push({ ...p, s: Math.max(p.s, s), e: Math.min(p.e, e), geometry })
    }
  }
  for (const v of versions) {
    out.push({
      qid: v.qid,
      name: v.name,
      wiki: v.wiki,
      s: v.s,
      e: v.e,
      geometry: v.geometry,
      src: 'ohm',
      osm: v.osm,
    })
  }
  return splitErnestine(out)
}

/**
 * OHM no té Saxònia-Gotha-Altenburg, Saxònia-Hildburghausen ni Saxònia-Coburg-Saalfeld abans de
 * la reorganització del 1826, i Cliopatria hi posa trossos de Prússia, de Baviera i de Berg. On queda aquest buit, el mapa
 * diu el que se'n sap: que eren els ducats ernestins, sense separar-los.
 */
const THURINGIA = [9.8, 50.1, 12.6, 51.5]
const ERNESTINE = { qid: 'Q672502', name: 'Ernestine duchies', wiki: 'Ernestine duchies' }

function splitErnestine(pieces) {
  const from = toNumber(OHM.from)
  const reorganised = toNumber('1826-11-12')
  return pieces.flatMap((p) => {
    if (p.src || p.s < from || p.s >= reorganised) return [p]
    const inside = (polygon) => {
      const [w, s, e, n] = bboxOf([polygon])
      const [x, y] = [(w + e) / 2, (s + n) / 2]
      return x >= THURINGIA[0] && x <= THURINGIA[2] && y >= THURINGIA[1] && y <= THURINGIA[3]
    }
    const parts = toMulti(p.geometry)
    const thuringian = parts.filter(inside)
    if (thuringian.length === 0) return [p]
    const rest = parts.filter((polygon) => !inside(polygon))
    return [
      {
        ...p,
        ...ERNESTINE,
        e: Math.min(p.e, previousDay(reorganised)),
        geometry: fromMulti(thuringian),
      },
      ...(p.e >= reorganised ? [{ ...p, s: reorganised, geometry: p.geometry }] : []),
      ...(rest.length
        ? [{ ...p, e: Math.min(p.e, previousDay(reorganised)), geometry: fromMulti(rest) }]
        : []),
    ]
  })
}

// ── Els codis ────────────────────────────────────────────────────────────────

const ringArea = (ring) => {
  let sum = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1])
  }
  return Math.abs(sum / 2)
}

function inRing([x, y], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const polygonsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)
const inside = (point, g) =>
  polygonsOf(g).some(
    ([outer, ...holes]) => inRing(point, outer) && !holes.some((h) => inRing(point, h)),
  )

/**
 * El punt on va el nom: el pol d'inaccessibilitat del polígon més gran o, si l'estat en porta
 * un a LABEL_HINTS i cau dins de la peça, aquell.
 */
function labelPoint(geometry, code) {
  const polygons = polygonsOf(geometry)
  const largest = polygons.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a))
  const hint = LABEL_HINTS[code]
  const hinted = hint && polygons.find((p) => inside(hint, { type: 'Polygon', coordinates: p }))
  const [x, y] = hinted ? hint : polylabel(largest, 0.05)
  return { point: [+x.toFixed(3), +y.toFixed(3)], area: ringArea((hinted ?? largest)[0]) }
}

/**
 * El codi de cada QID. Si una entitat hi és el 1885, i el seu nom cau dins d'un estat independent
 * de CShapes del 1886 i el d'aquell estat dins d'ella, és aquell estat: el Segon Reich de
 * Cliopatria és l'Alemanya de CShapes. Els dos sentits, perquè Mònaco cau dins de França i
 * França no cap dins de Mònaco. Els punts són els de la peça retallada a Europa: el Portugal de
 * Cliopatria porta Angola, que és més gran.
 */
function assignCodes(pieces, cshapes, cshapesLabels, labelGeometries) {
  const day = toNumber(`${LAST_YEAR + 1}-01-01`)
  const valid = (p) => p.s <= day && day <= p.e && p.status === 'independent'
  const states = cshapes.filter((f) => f.geometry && valid(f.properties))
  const stateLabels = new Map(
    cshapesLabels.features
      .filter((f) => valid(f.properties))
      .map((f) => [f.properties.code, f.geometry.coordinates]),
  )
  const codes = new Map(Object.entries(SAME_STATE))
  for (const [k, piece] of pieces.entries()) {
    if (piece.e !== LAST_DAY || codes.has(piece.qid) || !labelGeometries.has(k)) continue
    const geometry = labelGeometries.get(k)
    const { point } = labelPoint(geometry)
    const state = states.find(
      (f) =>
        inside(point, f.geometry) &&
        stateLabels.has(f.properties.code) &&
        inside(stateLabels.get(f.properties.code), geometry),
    )
    if (state) codes.set(piece.qid, state.properties.code)
  }
  for (const piece of pieces) {
    piece.code = codes.get(piece.qid) ?? piece.qid
    piece.owner = piece.owner ?? DEPENDENT[piece.name] ?? piece.code
    piece.status = piece.owner === piece.code ? 'independent' : 'colony'
  }
  return codes
}

// ── Els colors ───────────────────────────────────────────────────────────────

const overlaps = (a, b) => a.s <= b.e && b.s <= a.e
const groupOf = (p) => (p.status === 'independent' ? p.code : p.owner)

/**
 * Com a build-borders.mjs: dos grups veïns no comparteixen mai color, els veïns dels veïns
 * millor que no, i els colors es reparteixen. Els estats que continuen el 1886 ja en porten un.
 */
function assignColours(topo, fixed) {
  const geoms = topo.objects.borders.geometries
  const neighbours = topojson.neighbors(geoms)
  const adjacency = new Map(geoms.map((g) => [groupOf(g.properties), new Set()]))
  neighbours.forEach((list, i) => {
    const a = geoms[i].properties
    for (const j of list) {
      const b = geoms[j].properties
      if (groupOf(a) !== groupOf(b) && overlaps(a, b)) {
        adjacency.get(groupOf(a)).add(groupOf(b))
        adjacency.get(groupOf(b)).add(groupOf(a))
      }
    }
  })
  const colour = new Map()
  for (const group of adjacency.keys()) if (fixed.has(group)) colour.set(group, fixed.get(group))

  const clashes = []
  for (const [group, near] of adjacency) {
    for (const other of near) {
      if (group < other && colour.has(group) && colour.get(group) === colour.get(other)) {
        clashes.push(`${group} i ${other}`)
      }
    }
  }

  const usage = []
  for (const c of colour.values()) usage[c] = (usage[c] ?? 0) + 1
  const order = [...adjacency.keys()]
    .filter((g) => !colour.has(g))
    .sort((x, y) => adjacency.get(y).size - adjacency.get(x).size)
  for (const group of order) {
    const forbidden = new Set([...adjacency.get(group)].map((n) => colour.get(n)))
    const far = new Set(
      [...adjacency.get(group)].flatMap((n) => [...adjacency.get(n)].map((m) => colour.get(m))),
    )
    const cost = (c) => (usage[c] ?? 0) / order.length + (far.has(c) ? 10 : 0)
    let best = -1
    for (let c = 0; c < PALETTE_SIZE || best < 0; c++) {
      if (!forbidden.has(c) && (best < 0 || cost(c) < cost(best))) best = c
    }
    colour.set(group, best)
    usage[best] = (usage[best] ?? 0) + 1
  }
  for (const g of geoms) g.properties.c = colour.get(groupOf(g.properties))
  return { colours: Math.max(...colour.values()) + 1, clashes }
}

// ── Els fitxers ──────────────────────────────────────────────────────────────

async function simplify(pieces, bbox) {
  const input = {
    type: 'FeatureCollection',
    features: pieces.map(({ geometry, ...properties }, k) => ({
      type: 'Feature',
      geometry,
      properties: { ...properties, k },
    })),
  }
  const output = await mapshaper.applyCommands(
    [
      '-i input.json',
      `-clip bbox=${bbox.join(',')} remove-slivers`,
      `-simplify ${SIMPLIFY} keep-shapes`,
      '-rename-layers borders',
      '-o output.json format=topojson quantization=100000',
    ].join(' '),
    { 'input.json': input },
  )
  return JSON.parse(output['output.json'])
}

/**
 * La topologia d'un segle, amb les peces ja simplificades. Es torna a fer per a cada segle: amb
 * els quatre junts, cada vora quedava partida allà on algun veí d'algun any canviava, i el fitxer
 * de cada segle duia tres vegades més arcs.
 */
async function centuryTopology(topo, keep) {
  const features = topojson
    .feature(topo, {
      type: 'GeometryCollection',
      geometries: topo.objects.borders.geometries.filter(keep),
    })
    .features.map((f) => ({ ...f, properties: { ...f.properties, id: f.id } }))
  const output = await mapshaper.applyCommands(
    '-i input.json -rename-layers borders -o output.json format=topojson quantization=100000 id-field=id',
    { 'input.json': { type: 'FeatureCollection', features } },
  )
  const part = JSON.parse(output['output.json'])
  for (const g of part.objects.borders.geometries) {
    delete g.properties.id
    delete g.properties.FID
  }
  return part
}

/**
 * El que necessita el mapa per pintar i filtrar cada peça. El nom, l'article i el QID van només a
 * les etiquetes, que és on els busca l'app: repetits a cada peça, eren dos terços del fitxer.
 */
function borderProperties({ code, status, owner, s, e, c }) {
  return status === 'independent' ? { code, status, s, e, c } : { code, status, owner, s, e, c }
}

/**
 * Cliopatria fa una fila nova cada cop que canvia alguna cosa d'una entitat, i sovint la forma és
 * la mateixa; les correccions també parteixen files sense tocar-ne la forma. Al mapa, dues peces
 * seguides del mateix estat i amb els mateixos arcs són una sola: el fitxer pesava el doble.
 */
function mergeUnchanged(geometries) {
  const runs = new Map()
  for (const g of geometries) {
    const { code, status, owner, c } = g.properties
    const key = JSON.stringify([code, status, owner, c, g.type, g.arcs])
    if (!runs.has(key)) runs.set(key, [])
    runs.get(key).push(g)
  }
  const merged = []
  for (const run of runs.values()) {
    run.sort((a, b) => a.properties.s - b.properties.s)
    let current = run[0]
    for (const g of run.slice(1)) {
      if (g.properties.s <= nextDay(current.properties.e)) {
        current.properties.e = Math.max(current.properties.e, g.properties.e)
      } else {
        merged.push(current)
        current = g
      }
    }
    merged.push(current)
  }
  return merged.sort((a, b) => a.id - b.id)
}

function labelProperties(p) {
  // `country_name`, com a les peces de CShapes: el nom de recanvi si no n'hi ha cap de traduït.
  // `src`, la font de les fronteres, si no és Cliopatria: la fitxa la cita.
  const out = { ...borderProperties(p), country_name: p.name, wiki: p.wiki, qid: p.qid }
  return p.src ? { ...out, src: p.src, osm: p.osm } : out
}

// ── Tot plegat ───────────────────────────────────────────────────────────────

const rows = selectRows(await readCliopatria())
const identityOf = identities(rows)
const cshapesTopo = JSON.parse(readFileSync(BORDERS, 'utf8'))
const cshapes = topojson.feature(cshapesTopo, cshapesTopo.objects.borders).features
const pieces = applyOhm(
  applyTransitions(applyShapes(toPieces(rows, identityOf), rows, identityOf)),
  fixOhmWithCShapes(await readOhm(), cshapes),
)

const fixedColours = new Map(cshapes.map((f) => [groupOfCShapes(f.properties), f.properties.c]))
function groupOfCShapes(p) {
  return p.status === 'independent' || !p.owner ? p.code : p.owner
}

// Els noms, sobre les peces retallades a la part d'Europa que es veu (com a build-borders.mjs).
const labelTopo = await simplify(pieces, LABEL_BBOX)
const labelGeometries = new Map(
  topojson
    .feature(labelTopo, labelTopo.objects.borders)
    .features.filter((f) => f.geometry)
    .map((f) => [f.properties.k, f.geometry]),
)
const cshapesLabels = JSON.parse(readFileSync(BORDER_LABELS, 'utf8'))
const codes = assignCodes(pieces, cshapes, cshapesLabels, labelGeometries)

const topo = await simplify(pieces, BBOX)
topo.objects.borders.geometries.forEach((g, i) => {
  g.id = ID_OFFSET + i
  Object.assign(g.properties, pieces[g.properties.k])
  delete g.properties.geometry
})
const { colours, clashes } = assignColours(topo, fixedColours)
const colourOf = new Map(
  topo.objects.borders.geometries.map((g) => [g.properties.k, g.properties.c]),
)
const idOf = new Map(topo.objects.borders.geometries.map((g) => [g.properties.k, g.id]))
for (const g of topo.objects.borders.geometries) g.properties = borderProperties(g.properties)
topo.objects.borders.geometries = mergeUnchanged(topo.objects.borders.geometries)

const labels = [...labelGeometries]
  .filter(([k]) => idOf.has(k))
  .map(([k, geometry]) => {
    const piece = { ...pieces[k], c: colourOf.get(k) }
    const { point, area } = labelPoint(geometry, piece.code)
    return {
      type: 'Feature',
      id: idOf.get(k),
      geometry: { type: 'Point', coordinates: point },
      properties: { ...labelProperties(piece), rank: -Math.round(area) },
    }
  })

/**
 * Com mergeUnchanged, per als noms: dos noms seguits del mateix estat, al mateix punt i amb les
 * mateixes dades, són un de sol. Els trams d'OHM partien cada peça de Cliopatria en desenes.
 */
function mergeLabels(features) {
  const runs = new Map()
  for (const f of features) {
    const { s: _s, e: _e, ...rest } = f.properties
    const key = JSON.stringify([rest, f.geometry.coordinates])
    if (!runs.has(key)) runs.set(key, [])
    runs.get(key).push(f)
  }
  const merged = []
  for (const run of runs.values()) {
    run.sort((a, b) => a.properties.s - b.properties.s)
    let current = run[0]
    for (const f of run.slice(1)) {
      if (f.properties.s <= nextDay(current.properties.e)) {
        current.properties.e = Math.max(current.properties.e, f.properties.e)
      } else {
        merged.push(current)
        current = f
      }
    }
    merged.push(current)
  }
  return merged.sort((a, b) => a.id - b.id)
}
const mergedLabels = mergeLabels(labels)

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })
const centuries = []
for (let century = Math.floor(FIRST_YEAR / 100) * 100; century <= LAST_YEAR; century += 100) {
  const span = { s: century * 10000 + 101, e: (century + 99) * 10000 + 1231 }
  const part = await centuryTopology(topo, (g) => overlaps(g.properties, span))
  const partLabels = mergedLabels.filter((f) => overlaps(f.properties, span))
  writeFileSync(`${OUT_DIR}/${century}.topo.json`, JSON.stringify(part))
  writeFileSync(
    `${OUT_DIR}/${century}.labels.geojson`,
    JSON.stringify({ type: 'FeatureCollection', features: partLabels }),
  )
  centuries.push(`${century}: ${part.objects.borders.geometries.length}`)
}

const continued = [...new Set([...codes.values()])].sort()
console.log(
  `✔ ${topo.objects.borders.geometries.length} peces de ${new Set(pieces.map((p) => p.qid)).size} entitats, ${colours} colors, ${mergedLabels.length} noms`,
)
console.log(`  Per segles: ${centuries.join(', ')}`)
console.log(`  Continuen un estat de CShapes: ${continued.join(', ')}`)
if (readdirSync(OUT_DIR).length === 0) process.exit(1)
if (clashes.length > 0) {
  console.error(
    `✘ Aquests estats tenen el mateix color de CShapes i són veïns abans del 1886: ${clashes.join('; ')}. Treu-ne un de SAME_STATE.`,
  )
  process.exit(1)
}
if (colours > PALETTE_SIZE) {
  console.error(`✘ Calen ${colours} colors i la paleta en té ${PALETTE_SIZE}: afegeix-ne a PALETTE`)
  process.exit(1)
}
