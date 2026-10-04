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
const SIMPLIFY = '12%'
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
  return { ...borderProperties(p), country_name: p.name, wiki: p.wiki, qid: p.qid }
}

// ── Tot plegat ───────────────────────────────────────────────────────────────

const rows = selectRows(await readCliopatria())
const identityOf = identities(rows)
const pieces = applyShapes(toPieces(rows, identityOf), rows, identityOf)

const cshapesTopo = JSON.parse(readFileSync(BORDERS, 'utf8'))
const cshapes = topojson.feature(cshapesTopo, cshapesTopo.objects.borders).features
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

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })
const centuries = []
for (let century = Math.floor(FIRST_YEAR / 100) * 100; century <= LAST_YEAR; century += 100) {
  const span = { s: century * 10000 + 101, e: (century + 99) * 10000 + 1231 }
  const part = await centuryTopology(topo, (g) => overlaps(g.properties, span))
  const partLabels = labels.filter((f) => overlaps(f.properties, span))
  writeFileSync(`${OUT_DIR}/${century}.topo.json`, JSON.stringify(part))
  writeFileSync(
    `${OUT_DIR}/${century}.labels.geojson`,
    JSON.stringify({ type: 'FeatureCollection', features: partLabels }),
  )
  centuries.push(`${century}: ${part.objects.borders.geometries.length}`)
}

const continued = [...new Set([...codes.values()])].sort()
console.log(
  `✔ ${topo.objects.borders.geometries.length} peces de ${new Set(pieces.map((p) => p.qid)).size} entitats, ${colours} colors, ${labels.length} noms`,
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
