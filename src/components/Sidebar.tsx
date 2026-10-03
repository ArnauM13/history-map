import { useEffect, useState, type ReactNode } from 'react'
import {
  CONFLICTS,
  EVENTS,
  FLAGS,
  capitalName,
  countryName,
  localize,
  wikipediaUrl,
} from '../content'
import { commonsUrl, flagHistory, flagOn, loadFlagCredits, type FlagCredit } from '../content/flags'
import type { Conflict, HistoricalEvent } from '../content/schema'
import { useI18n } from '../i18n'
import { MIN_DATE, OPEN_END, formatDate, fromDateNumber, yearOf, type IsoDate } from '../lib/date'
import { stateOn, type LabelCollection } from '../map/data'
import { REPO_URL, docUrl, type BorderProperties, type Selection } from '../selection'
import { Flag } from './Flag'
import { FlagGallery } from './FlagGallery'
import { Icon } from './Icon'

export type SidebarTab = 'flags' | 'history'

interface Props {
  date: IsoDate
  tab: SidebarTab
  labels: LabelCollection | null
  selection: Selection | null
  yearEvents: HistoricalEvent[]
  conflicts: Conflict[]
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
          onGoToEvent={onGoToEvent}
          onGoToDate={onGoToDate}
        />
      )}

      <div id="sidebar-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="panel">
        {tab === 'flags' ? (
          <FlagGallery
            date={date}
            labels={labels}
            selectedGwcode={selection?.kind === 'country' ? selection.feature.gwcode : undefined}
            onSelectCountry={(feature) => onSelect({ kind: 'country', feature })}
            onGoToDate={onGoToDate}
          />
        ) : (
          <HistoryPanel
            date={date}
            selection={selection}
            yearEvents={yearEvents}
            conflicts={conflicts}
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
  onSelect,
  onGoToEvent,
}: Pick<Props, 'date' | 'selection' | 'yearEvents' | 'conflicts' | 'onSelect' | 'onGoToEvent'>) {
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
  onGoToEvent: (event: HistoricalEvent) => void
  onGoToDate: (date: IsoDate) => void
}

function Detail({ date, labels, selection, onClose, onGoToEvent, onGoToDate }: DetailProps) {
  const { t } = useI18n()
  let content: ReactNode = null
  if (selection.kind === 'country') {
    content = (
      <CountryDetail
        date={date}
        labels={labels}
        // Les fronteres que tenia l'estat en la data d'ara, que poden no ser les del clic.
        feature={stateOn(labels, selection.feature.gwcode, date) ?? selection.feature}
        onGoToEvent={onGoToEvent}
        onGoToDate={onGoToDate}
      />
    )
  } else if (selection.kind === 'event') {
    const event = EVENTS.find((e) => e.id === selection.id)
    if (event) content = <EventDetail event={event} />
  } else {
    const conflict = CONFLICTS.find((c) => c.id === selection.id)
    if (conflict) content = <ConflictDetail conflict={conflict} />
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
  const name = countryName(feature.gwcode, date, lang, feature.country_name)
  const dependent =
    feature.status !== 'independent' && feature.owner && feature.owner !== String(feature.gwcode)
  const statusKey = `status.${feature.status}` as Parameters<typeof t>[0]
  const related = EVENTS.filter((e) => e.countries.includes(feature.gwcode))
  const current = flagOn(feature.gwcode, date)
  const about = current?.flag ? localize(FLAGS.about[current.flag], lang) : ''
  const history = flagHistory(feature.gwcode).filter((p) => p.flag !== undefined)

  // Quan surt l'estat al mapa per primer i per últim cop. La primera bandera no té dia
  // d'estrena, i l'última de l'Alemanya nazi no «arriba fins avui»: s'acaba amb l'estat.
  const spans = labels?.features.filter((f) => f.properties.gwcode === feature.gwcode) ?? []
  const firstSeen = Math.min(...spans.map((f) => f.properties.s))
  const lastSeen = Math.max(...spans.map((f) => f.properties.e))
  const firstDate =
    spans.length > 0 && fromDateNumber(firstSeen) > MIN_DATE ? fromDateNumber(firstSeen) : MIN_DATE
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
        {dependent && (
          <div>
            <dt>{t('controlledBy')}</dt>
            <dd>{countryName(Number(feature.owner), date, lang, feature.owner ?? '')}</dd>
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
      {history.length > 1 && (
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

function EventDetail({ event }: { event: HistoricalEvent }) {
  const { lang, t } = useI18n()
  const link = wikipediaUrl(event.wikipedia, lang)
  return (
    <>
      <p className="detail-kicker">
        <span className="chip event">{t(`category.${event.category}`)}</span>
        {formatDate(event.date, lang)}
      </p>
      <h2 className="detail-title">{localize(event.title, lang)}</h2>
      <p className="detail-text">{localize(event.summary, lang)}</p>
      {link && <ReadMore href={link} />}
    </>
  )
}

function ConflictDetail({ conflict }: { conflict: Conflict }) {
  const { lang, t } = useI18n()
  const link = wikipediaUrl(conflict.wikipedia, lang)
  return (
    <>
      <p className="detail-kicker">
        <span className="chip conflict">{t(`category.${conflict.category}`)}</span>
        {conflictPeriod(conflict, lang, t('ongoing'))}
      </p>
      <h2 className="detail-title">{localize(conflict.title, lang)}</h2>
      <p className="detail-text">{localize(conflict.summary, lang)}</p>
      {link && <ReadMore href={link} />}
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

function ReadMore({ href }: { href: string }) {
  const { t } = useI18n()
  return (
    <a className="read-more" href={href} target="_blank" rel="noopener">
      {t('readMore')}
      <Icon name="open_in_new" />
    </a>
  )
}
