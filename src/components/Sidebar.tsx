import { useEffect, useState, type ReactNode } from 'react'
import { CONFLICTS, EVENTS, countryName, localize, wikipediaUrl } from '../content'
import { commonsUrl, flagHistory, flagOn, loadFlagCredits, type FlagCredit } from '../content/flags'
import type { Conflict, HistoricalEvent } from '../content/schema'
import { useI18n } from '../i18n'
import {
  MIN_DATE,
  formatDate,
  formatDateNumber,
  fromDateNumber,
  yearOf,
  type IsoDate,
} from '../lib/date'
import { stateOn, type LabelCollection } from '../map/data'
import { REPO_URL, type BorderProperties, type Selection } from '../selection'
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
  const { t } = useI18n()
  const tabs: [SidebarTab, string][] = [
    ['flags', t('tabFlags')],
    ['history', t('tabHistory')],
  ]

  return (
    <aside className="sidebar">
      <div className="tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls="sidebar-panel"
            onClick={() => onTabChange(id)}
          >
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
        <a href={`${REPO_URL}/blob/main/docs/DATA.md`} target="_blank" rel="noopener">
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
      <section>
        <h2>{t('activeConflicts')}</h2>
        {conflicts.length === 0 ? (
          <p className="muted">{t('noActiveConflicts')}</p>
        ) : (
          <ul className="item-list">
            {conflicts.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="item conflict"
                  aria-current={selection?.kind === 'conflict' && selection.id === c.id}
                  onClick={() => onSelect({ kind: 'conflict', id: c.id })}
                >
                  <span className="item-title">{localize(c.title, lang)}</span>
                  <span className="item-meta">{conflictPeriod(c, lang, t('ongoing'))}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>{t('eventsOfYear', { year })}</h2>
        {yearEvents.length === 0 ? (
          <p className="muted">
            {t('noEventsOfYear')}{' '}
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener">
              {t('contribute')}
            </a>
          </p>
        ) : (
          <ul className="item-list">
            {yearEvents.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  className={`item event${e.date > date ? ' upcoming' : ''}`}
                  aria-current={selection?.kind === 'event' && selection.id === e.id}
                  onClick={() => onGoToEvent(e)}
                >
                  <span className="item-meta">{formatDate(e.date, lang)}</span>
                  <span className="item-title">{localize(e.title, lang)}</span>
                </button>
              </li>
            ))}
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
        // The state's borders on the current date, if it still exists then.
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
    <section className="detail" aria-live="polite">
      <button
        type="button"
        className="icon-button detail-close"
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
  const history = flagHistory(feature.gwcode).filter((p) => p.flag !== undefined)
  // Where to jump for a flag whose first day is unknown: when the state first appears.
  const firstSeen = labels?.features
    .filter((f) => f.properties.gwcode === feature.gwcode)
    .reduce((min, f) => Math.min(min, f.properties.s), Infinity)
  const firstDate =
    firstSeen && firstSeen !== Infinity && fromDateNumber(firstSeen) > MIN_DATE
      ? fromDateNumber(firstSeen)
      : MIN_DATE

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
      <dl className="facts">
        <dt>{t('status')}</dt>
        <dd>{t(statusKey)}</dd>
        {dependent && (
          <>
            <dt>{t('controlledBy')}</dt>
            <dd>{countryName(Number(feature.owner), date, lang, feature.owner ?? '')}</dd>
          </>
        )}
        {feature.capname && (
          <>
            <dt>{t('capital')}</dt>
            <dd>{feature.capname}</dd>
          </>
        )}
        <dt>{t('bordersValid')}</dt>
        <dd>
          {formatDateNumber(feature.s, lang, t('present'))} –{' '}
          {formatDateNumber(feature.e, lang, t('present'))}
        </dd>
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
                >
                  <Flag id={p.flag} size="sm" label={name} />
                  <span>
                    {p.from ? yearOf(p.from) : '…'} – {p.until ? yearOf(p.until) : t('present')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {related.length > 0 && (
        <>
          <h3>{t('relatedEvents')}</h3>
          <ul className="item-list compact">
            {related.map((e) => (
              <li key={e.id}>
                <button type="button" className="item event" onClick={() => onGoToEvent(e)}>
                  <span className="item-meta">{yearOf(e.date)}</span>
                  <span className="item-title">{localize(e.title, lang)}</span>
                </button>
              </li>
            ))}
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
        <span className="badge event">{t(`category.${event.category}`)}</span>{' '}
        {formatDate(event.date, lang)}
      </p>
      <h2 className="detail-title">{localize(event.title, lang)}</h2>
      <p>{localize(event.summary, lang)}</p>
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
        <span className="badge conflict">{t(`category.${conflict.category}`)}</span>{' '}
        {conflictPeriod(conflict, lang, t('ongoing'))}
      </p>
      <h2 className="detail-title">{localize(conflict.title, lang)}</h2>
      <p>{localize(conflict.summary, lang)}</p>
      {link && <ReadMore href={link} />}
    </>
  )
}

/** Source and licence of a flag image (images come from Wikimedia Commons). */
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
  return (
    <figcaption>
      {t('imageSource')}:{' '}
      <a href={commonsUrl(id)} target="_blank" rel="noopener">
        Wikimedia Commons
      </a>
      {credit?.license && ` · ${credit.license}`}
    </figcaption>
  )
}

function ReadMore({ href }: { href: string }) {
  const { t } = useI18n()
  return (
    <a className="read-more" href={href} target="_blank" rel="noopener">
      {t('readMore')} · Wikipedia ↗
    </a>
  )
}
