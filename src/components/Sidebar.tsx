import { useEffect, useState, type ReactNode } from 'react'
import {
  CONFLICTS,
  EVENTS,
  FLAGS,
  OCCUPATIONS,
  capitalName,
  controlOn,
  controlPeriods,
  countryName,
  localize,
  occupationEnd,
  stateName,
  stateWiki,
  wikipediaLink,
} from '../content'
import { commonsUrl, flagHistory, flagOn, loadFlagCredits, type FlagCredit } from '../content/flags'
import type {
  Conflict,
  ExternalSource,
  HistoricalEvent,
  Occupation,
  WikipediaTitles,
} from '../content/schema'
import type { Lang } from '../i18n'
import { useI18n } from '../i18n'
import {
  EXACT_BORDERS_FROM,
  OPEN_END,
  formatDate,
  fromDateNumber,
  yearOf,
  type IsoDate,
} from '../lib/date'
import { stateOn, useBorderData, type LabelCollection } from '../map/data'
import { REPO_URL, docUrl, type BorderProperties, type Selection } from '../selection'
import { Flag } from './Flag'
import { FlagGallery } from './FlagGallery'
import { Icon } from './Icon'
import { Sources, type SourceItem } from './Sources'

export type SidebarTab = 'flags' | 'history'

interface Props {
  date: IsoDate
  tab: SidebarTab
  labels: LabelCollection | null
  selection: Selection | null
  yearEvents: HistoricalEvent[]
  conflicts: Conflict[]
  /** Les zones de la capa d'ocupacions que valen en la data. */
  occupations: Occupation[]
  /** Si la capa d'ocupacions és visible: llavors la galeria de banderes també en té en compte. */
  showOccupations: boolean
  onTabChange: (tab: SidebarTab) => void
  onSelect: (selection: Selection | null) => void
  onGoToEvent: (event: HistoricalEvent) => void
  onGoToDate: (date: IsoDate) => void
}

export function Sidebar({
  date,
  tab,
  labels,
  selection,
  yearEvents,
  conflicts,
  occupations,
  showOccupations,
  onTabChange,
  onSelect,
  onGoToEvent,
  onGoToDate,
}: Props) {
  const { lang, t } = useI18n()
  const tabs = [
    { id: 'flags', label: t('tabFlags'), icon: 'flag' },
    { id: 'history', label: t('tabHistory'), icon: 'history' },
  ] as const

  return (
    <aside className="sidebar">
      <div className={`segmented${tab === 'history' ? ' second' : ''}`} role="tablist">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls="sidebar-panel"
            onClick={() => onTabChange(id)}
          >
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </div>

      {selection && (
        <Detail
          date={date}
          labels={labels}
          selection={selection}
          onClose={() => onSelect(null)}
          onSelect={onSelect}
          onGoToEvent={onGoToEvent}
          onGoToDate={onGoToDate}
        />
      )}

      <div id="sidebar-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="panel">
        {tab === 'flags' ? (
          <FlagGallery
            date={date}
            labels={labels}
            occupations={showOccupations ? occupations : []}
            selection={selection}
            onSelect={onSelect}
            onGoToDate={onGoToDate}
          />
        ) : (
          <HistoryPanel
            date={date}
            selection={selection}
            yearEvents={yearEvents}
            conflicts={conflicts}
            occupations={occupations}
            onSelect={onSelect}
            onGoToEvent={onGoToEvent}
          />
        )}
      </div>

      <footer className="sidebar-footer">
        <a href={docUrl('DADES', lang)} target="_blank" rel="noopener">
          {t('sources')}
        </a>
        <a href={REPO_URL} target="_blank" rel="noopener">
          {t('sourceCode')}
        </a>
      </footer>
    </aside>
  )
}

function HistoryPanel({
  date,
  selection,
  yearEvents,
  conflicts,
  occupations,
  onSelect,
  onGoToEvent,
}: Pick<
  Props,
  'date' | 'selection' | 'yearEvents' | 'conflicts' | 'occupations' | 'onSelect' | 'onGoToEvent'
>) {
  const { lang, t } = useI18n()
  const year = yearOf(date)

  return (
    <>
      <section className="card-section">
        <div className="section-header">
          <Icon name="swords" />
          <h2 className="section-title">{t('activeConflicts')}</h2>
          {conflicts.length > 0 && <span className="section-count">{conflicts.length}</span>}
        </div>
        {conflicts.length === 0 ? (
          <p className="empty-state">{t('noActiveConflicts')}</p>
        ) : (
          <ul className="item-list">
            {conflicts.map((c) => {
              const title = localize(c.title, lang)
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className="item-card conflict"
                    aria-current={selection?.kind === 'conflict' && selection.id === c.id}
                    onClick={() => onSelect({ kind: 'conflict', id: c.id })}
                    title={title}
                  >
                    <span className="ic-icon">
                      <Icon name="swords" />
                    </span>
                    <span className="ic-body">
                      <span className="ic-name">{title}</span>
                      <span className="ic-detail">{conflictPeriod(c, lang, t('ongoing'))}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="card-section">
        <div className="section-header">
          <Icon name="calendar_month" />
          <h2 className="section-title">{t('eventsOfYear', { year })}</h2>
          {yearEvents.length > 0 && <span className="section-count">{yearEvents.length}</span>}
        </div>
        {yearEvents.length === 0 ? (
          <p className="empty-state">
            {t('noEventsOfYear')}{' '}
            <a href={docUrl('CONTRIBUTING', lang)} target="_blank" rel="noopener">
              {t('contribute')}
            </a>
          </p>
        ) : (
          <ul className="item-list">
            {yearEvents.map((e) => {
              const title = localize(e.title, lang)
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    className={`item-card event${e.date > date ? ' is-upcoming' : ''}`}
                    aria-current={selection?.kind === 'event' && selection.id === e.id}
                    onClick={() => onGoToEvent(e)}
                    title={title}
                  >
                    <span className="ic-icon">
                      <Icon name="calendar_month" />
                    </span>
                    <span className="ic-body">
                      <span className="ic-name">{title}</span>
                      <span className="ic-detail">{formatDate(e.date, lang)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Només quan n'hi ha: fora del 1938-1945, la secció seria buida gairebé sempre. */}
      {occupations.length > 0 && (
        <section className="card-section">
          <div className="section-header">
            <Icon name="fence" />
            <h2 className="section-title">{t('occupationsTitle')}</h2>
            <span className="section-count">{occupations.length}</span>
          </div>
          <ul className="item-list">
            {occupations.map((o) => {
              const title = localize(o.title, lang)
              const control = controlOn(o, date)!
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    className="item-card occupation"
                    aria-current={selection?.kind === 'occupation' && selection.id === o.id}
                    onClick={() => onSelect({ kind: 'occupation', id: o.id })}
                    title={title}
                  >
                    <span className="ic-icon">
                      <Icon name="fence" />
                    </span>
                    <span className="ic-body">
                      <span className="ic-name">{title}</span>
                      <span className="ic-detail">
                        {t(`zoneOnMap.${control.kind}`, {
                          by: countryName(control.by, date, lang),
                        })}
                      </span>
                      <span className="ic-detail">{localize(control.cause, lang)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}

const conflictPeriod = (c: Conflict, lang: string, ongoing: string) =>
  `${formatDate(c.start, lang)} – ${c.end ? formatDate(c.end, lang) : ongoing}`

interface DetailProps {
  date: IsoDate
  labels: LabelCollection | null
  selection: Selection
  onClose: () => void
  onSelect: (selection: Selection | null) => void
  onGoToEvent: (event: HistoricalEvent) => void
  onGoToDate: (date: IsoDate) => void
}

function Detail({
  date,
  labels,
  selection,
  onClose,
  onSelect,
  onGoToEvent,
  onGoToDate,
}: DetailProps) {
  const { t } = useI18n()
  let content: ReactNode = null
  if (selection.kind === 'country') {
    content = (
      <CountryDetail
        date={date}
        labels={labels}
        // Les fronteres que tenia l'estat en la data d'ara, que poden no ser les del clic.
        feature={stateOn(labels, selection.feature.code, date) ?? selection.feature}
        onGoToEvent={onGoToEvent}
        onGoToDate={onGoToDate}
      />
    )
  } else if (selection.kind === 'event') {
    const event = EVENTS.find((e) => e.id === selection.id)
    if (event) content = <EventDetail event={event} />
  } else if (selection.kind === 'conflict') {
    const conflict = CONFLICTS.find((c) => c.id === selection.id)
    if (conflict) content = <ConflictDetail conflict={conflict} />
  } else {
    const zone = OCCUPATIONS.find((o) => o.id === selection.id)
    if (zone)
      content = <OccupationDetail zone={zone} date={date} labels={labels} onSelect={onSelect} />
  }
  if (!content) return null
  return (
    <section className="card-section detail" aria-live="polite">
      <button
        type="button"
        className="icon-btn detail-close"
        onClick={onClose}
        aria-label={t('close')}
        title={t('close')}
      >
        <Icon name="close" />
      </button>
      {content}
    </section>
  )
}

function CountryDetail({
  date,
  labels,
  feature,
  onGoToEvent,
  onGoToDate,
}: {
  date: IsoDate
  labels: LabelCollection | null
  feature: BorderProperties
  onGoToEvent: (event: HistoricalEvent) => void
  onGoToDate: (date: IsoDate) => void
}) {
  const { lang, t } = useI18n()
  const name = stateName(feature, date, lang)
  const owner =
    feature.status !== 'independent' && feature.owner && feature.owner !== feature.code
      ? feature.owner
      : undefined
  // Qui el governava, amb el nom que tenia aleshores: el 1840, l'Algèria francesa és de la
  // Monarquia de Juliol.
  const ownerPiece = owner ? stateOn(labels, owner, date) : undefined
  const statusKey = `status.${feature.status}` as Parameters<typeof t>[0]
  const related = EVENTS.filter((e) => e.countries.includes(feature.code))
  const current = flagOn(feature.code, date)
  const about = current?.flag ? localize(FLAGS.about[current.flag], lang) : ''
  const history = flagHistory(feature.code).filter((p) => p.flag !== undefined)
  // Abans del 1886, les fronteres són de Cliopatria, que les dona any a any, o d'OpenHistoricalMap,
  // que té el dia de cada canvi.
  const fromOhm = feature.src === 'ohm'
  const approximate = feature.qid !== undefined && !fromOhm

  // Quan surt l'estat al mapa per primer i per últim cop. La primera bandera no té dia
  // d'estrena, i l'última de l'Alemanya nazi no «arriba fins avui»: s'acaba amb l'estat.
  const spans = labels?.features.filter((f) => f.properties.code === feature.code) ?? []
  const firstSeen = Math.min(...spans.map((f) => f.properties.s))
  const lastSeen = Math.max(...spans.map((f) => f.properties.e))
  // La primera bandera val des del 1886, encara que l'estat surti abans (el 220 és el Regne de
  // França des del 1500).
  const firstDate =
    spans.length > 0 && fromDateNumber(firstSeen) > EXACT_BORDERS_FROM
      ? fromDateNumber(firstSeen)
      : EXACT_BORDERS_FROM
  const endLabel = (until?: IsoDate) =>
    until
      ? yearOf(until)
      : spans.length > 0 && lastSeen < OPEN_END
        ? yearOf(fromDateNumber(lastSeen))
        : t('present')

  return (
    <>
      <p className="detail-kicker">{t('country')}</p>
      <h2 className="detail-title">{name}</h2>
      {current && (
        <figure className="detail-flag">
          <Flag id={current.flag} size="lg" label={name} />
          {current.flag && <FlagCaption id={current.flag} />}
        </figure>
      )}
      {about && <p className="flag-about">{about}</p>}
      <dl className="facts">
        <div>
          <dt>{t('status')}</dt>
          <dd>{t(statusKey)}</dd>
        </div>
        {owner && (
          <div>
            <dt>{t('controlledBy')}</dt>
            <dd>
              {ownerPiece
                ? stateName(ownerPiece, date, lang)
                : countryName(owner, date, lang, owner)}
            </dd>
          </div>
        )}
        {feature.capname && (
          <div>
            <dt>{t('capital')}</dt>
            <dd>{capitalName(feature.capname, lang)}</dd>
          </div>
        )}
        <div>
          <dt>{t('bordersValid')}</dt>
          <dd>
            {yearOf(fromDateNumber(feature.s))} –{' '}
            {feature.e >= OPEN_END ? t('present') : yearOf(fromDateNumber(feature.e))}
          </dd>
        </div>
      </dl>
      {approximate && <p className="src-note">{t('bordersApprox')}</p>}
      {history.length > 1 && feature.qid === undefined && (
        <>
          <h3>{t('flagHistory')}</h3>
          <ul className="flag-history">
            {history.map((p) => (
              <li key={p.from ?? 'first'}>
                <button
                  type="button"
                  aria-current={p === current}
                  onClick={() => onGoToDate(p.from ?? firstDate)}
                  title={p.from ? formatDate(p.from, lang) : undefined}
                >
                  <Flag id={p.flag} size="sm" label={name} />
                  {p.from ? yearOf(p.from) : '…'} – {endLabel(p.until)}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <Sources
        items={[
          fromOhm
            ? { what: t('sourceBordersOnly'), ...ohmSource(feature.osm) }
            : approximate
              ? { what: t('sourceBordersOnly'), ...CLIOPATRIA_SOURCE }
              : { what: t('sourceBorders'), ...CSHAPES_SOURCE },
          ...wikipediaSource(stateWiki(feature, date), lang, t('wikipedia'), t('sourceName')),
          // Les banderes només són documentades des del 1886.
          ...(feature.qid !== undefined ? [] : (FLAGS.sources[feature.code] ?? [])).flatMap(
            (title) => wikipediaSource(title, lang, t('wikipedia'), t('sourceFlags')),
          ),
        ]}
      />
      {related.length > 0 && (
        <>
          <h3>{t('relatedEvents')}</h3>
          <ul className="item-list">
            {related.map((e) => {
              const title = localize(e.title, lang)
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    className="item-card event"
                    onClick={() => onGoToEvent(e)}
                    title={title}
                  >
                    <span className="ic-body">
                      <span className="ic-name">{title}</span>
                      <span className="ic-detail">{formatDate(e.date, lang)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}

/** CShapes és la font de les fronteres i de les capitals de tot el mapa. */
const CSHAPES_SOURCE = {
  site: 'CShapes 2.0',
  title: 'Schvitz et al. (2022)',
  url: 'https://icr.ethz.ch/data/cshapes/',
}

/** Les fronteres d'abans del 1886. */
const CLIOPATRIA_SOURCE = {
  site: 'Cliopatria (Seshat)',
  title: 'Scientific Data (2025)',
  url: 'https://doi.org/10.1038/s41597-025-04516-9',
}

/** Una versió d'un estat a OpenHistoricalMap: la relació, amb les seves dates i les seves fonts. */
const ohmSource = (osm?: string) => ({
  site: 'OpenHistoricalMap',
  title: osm ? osm.replace('relation/', 'relation ') : 'CC0',
  url: `https://www.openhistoricalmap.org/${osm ?? ''}`,
})

/** Les divisions administratives d'avui, d'on surten algunes vores de les zones ocupades. */
const NATURAL_EARTH_SOURCE = {
  site: 'Natural Earth',
  title: 'Admin 1 – States, Provinces',
  url: 'https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/',
}

/** El front de la guerra russoucraïnesa, dia a dia des de l'abril del 2022. */
const DEEPSTATE_SOURCE = {
  site: 'DeepStateMap',
  title: 'deepstatemap.live',
  url: 'https://deepstatemap.live/',
}

/** La Viquipèdia, en l'idioma de la pantalla si es pot, com a font. */
function wikipediaSource(
  source: WikipediaTitles | string | undefined,
  lang: Lang,
  site: string,
  what?: string,
): SourceItem[] {
  const link = wikipediaLink(source, lang)
  return link ? [{ what, site: link.lang === lang ? site : `${site} (${link.lang})`, ...link }] : []
}

const externalSources = (sources: ExternalSource[]): SourceItem[] =>
  sources.map((s) => ({ site: s.publisher ?? new URL(s.url).hostname, title: s.title, url: s.url }))

function EventDetail({ event }: { event: HistoricalEvent }) {
  const { lang, t } = useI18n()
  return (
    <>
      <p className="detail-kicker">
        <span className="chip event">{t(`category.${event.category}`)}</span>
        {formatDate(event.date, lang)}
      </p>
      <h2 className="detail-title">{localize(event.title, lang)}</h2>
      <p className="detail-text">{localize(event.summary, lang)}</p>
      <Sources
        items={[
          ...wikipediaSource(event.wikipedia, lang, t('wikipedia')),
          ...externalSources(event.sources),
        ]}
      />
    </>
  )
}

function ConflictDetail({ conflict }: { conflict: Conflict }) {
  const { lang, t } = useI18n()
  return (
    <>
      <p className="detail-kicker">
        <span className="chip conflict">{t(`category.${conflict.category}`)}</span>
        {conflictPeriod(conflict, lang, t('ongoing'))}
      </p>
      <h2 className="detail-title">{localize(conflict.title, lang)}</h2>
      <p className="detail-text">{localize(conflict.summary, lang)}</p>
      <Sources
        items={[
          ...wikipediaSource(conflict.wikipedia, lang, t('wikipedia')),
          ...externalSources(conflict.sources),
        ]}
      />
    </>
  )
}

function OccupationDetail({
  zone,
  date,
  labels,
  onSelect,
}: {
  zone: Occupation
  date: IsoDate
  labels: LabelCollection | null
  onSelect: (selection: Selection | null) => void
}) {
  const { lang, t } = useI18n()
  const periods = controlPeriods(zone)
  // Si la data ja no és dins de la zona, la fitxa en parla com era al principi o al final.
  const current =
    controlOn(zone, date) ?? (date < zone.start ? periods[0] : periods[periods.length - 1])
  // Els noms, els d'una data del tram: l'Alemanya de l'annexió d'Àustria és l'Alemanya nazi,
  // també si la fitxa s'obre el 1950.
  const at =
    date < current.from
      ? current.from
      : current.until && date > current.until
        ? current.until
        : date
  const end = occupationEnd(zone)
  const title = localize(zone.title, lang)
  const shape = useBorderData()?.occupations.features.find((f) => f.properties.id === zone.id)
  const approx = shape?.properties.approx ?? []
  const front = shape?.properties.front
  const periodYears = (p: (typeof periods)[number]) =>
    `${yearOf(p.from)} – ${p.until ? yearOf(p.until) : t('present')}`

  return (
    <>
      <p className="detail-kicker">
        <span className="chip occupation">{t(`occupation.${current.kind}`)}</span>
        {formatDate(zone.start, lang)} – {end ? formatDate(end, lang) : t('ongoing')}
      </p>
      <h2 className="detail-title">{title}</h2>
      {zone.flag && (
        <figure className="detail-flag">
          <Flag id={zone.flag} size="lg" label={title} />
          <FlagCaption id={zone.flag} />
        </figure>
      )}
      <dl className="facts">
        <div>
          <dt>{t('controlledBy')}</dt>
          <dd>{countryName(current.by, at, lang)}</dd>
        </div>
        <div>
          <dt>{t('cause')}</dt>
          <dd>{localize(current.cause, lang)}</dd>
        </div>
        <div>
          <dt>{t('territoryOf')}</dt>
          <dd>
            {zone.countries.map((code, i) => {
              const name = countryName(code, at, lang)
              // L'estat, si en aquella data surt al mapa: llavors se'n pot obrir la fitxa.
              const feature = stateOn(labels, code, date)
              return (
                <span key={code}>
                  {i > 0 && ', '}
                  {feature ? (
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => onSelect({ kind: 'country', feature })}
                    >
                      {name}
                    </button>
                  ) : (
                    name
                  )}
                </span>
              )
            })}
          </dd>
        </div>
      </dl>
      <p className="detail-text">{localize(zone.summary, lang)}</p>
      {periods.length > 1 && (
        <>
          <h3>{t('controlHistory')}</h3>
          <dl className="facts">
            {periods.map((p) => (
              <div key={p.from} aria-current={p === current}>
                <dt>{periodYears(p)}</dt>
                <dd>
                  {countryName(p.by, p.from, lang)} · {t(`occupation.${p.kind}`)}
                  <span className="fact-note">{localize(p.cause, lang)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
      {front && <p className="src-note">{t('zoneFront', { date: formatDate(front, lang) })}</p>}
      {approx.length > 0 && (
        <p className="src-note">
          {t(
            approx.length > 1
              ? 'zoneApproxBoth'
              : approx[0] === 'line'
                ? 'zoneApproxLine'
                : 'zoneApproxAdmin',
          )}
        </p>
      )}
      <Sources
        items={[
          ...wikipediaSource(zone.wikipedia, lang, t('wikipedia'), t('sourceZoneText')),
          ...externalSources(zone.sources).map((s) => ({ what: t('sourceZoneText'), ...s })),
          { what: t('sourceZoneBorders'), ...CSHAPES_SOURCE },
          ...(front ? [{ what: t('sourceZoneFront'), ...DEEPSTATE_SOURCE }] : []),
          ...(approx.includes('admin')
            ? [{ what: t('sourceZoneBorders'), ...NATURAL_EARTH_SOURCE }]
            : []),
        ]}
      />
    </>
  )
}

/** D'on surt la imatge. Si la llicència demana citar l'autor (CC BY-SA), se'l cita. */
function FlagCaption({ id }: { id: string }) {
  const { t } = useI18n()
  const [credit, setCredit] = useState<FlagCredit | undefined>()
  useEffect(() => {
    let active = true
    loadFlagCredits().then((credits) => active && setCredit(credits[id]))
    return () => {
      active = false
    }
  }, [id])
  const publicDomain = credit?.license === 'Public domain'
  return (
    <figcaption>
      {t('imageSource')}: {credit?.artist && !publicDomain && `${credit.artist} · `}
      <a href={commonsUrl(id)} target="_blank" rel="noopener">
        Wikimedia Commons
      </a>
      {credit?.license && ` · ${publicDomain ? t('publicDomain') : credit.license}`}
    </figcaption>
  )
}
