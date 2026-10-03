import type { ReactNode } from 'react'
import { CONFLICTS, EVENTS, countryName, localize, wikipediaUrl } from '../content'
import type { Conflict, HistoricalEvent } from '../content/schema'
import { useI18n } from '../i18n'
import { formatDate, formatDateNumber, yearOf, type IsoDate } from '../lib/date'
import { REPO_URL, type BorderProperties, type Selection } from '../selection'
import { Icon } from './Icon'

interface Props {
  date: IsoDate
  selection: Selection | null
  yearEvents: HistoricalEvent[]
  conflicts: Conflict[]
  onSelect: (selection: Selection | null) => void
  onGoToEvent: (event: HistoricalEvent) => void
}

export function Sidebar({ date, selection, yearEvents, conflicts, onSelect, onGoToEvent }: Props) {
  const { lang, t } = useI18n()
  const year = yearOf(date)

  return (
    <aside className="sidebar">
      {selection && (
        <Detail
          date={date}
          selection={selection}
          onClose={() => onSelect(null)}
          onGoToEvent={onGoToEvent}
        />
      )}

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

const conflictPeriod = (c: Conflict, lang: string, ongoing: string) =>
  `${formatDate(c.start, lang)} – ${c.end ? formatDate(c.end, lang) : ongoing}`

interface DetailProps {
  date: IsoDate
  selection: Selection
  onClose: () => void
  onGoToEvent: (event: HistoricalEvent) => void
}

function Detail({ date, selection, onClose, onGoToEvent }: DetailProps) {
  const { t } = useI18n()
  let content: ReactNode = null
  if (selection.kind === 'country') {
    content = <CountryDetail date={date} feature={selection.feature} onGoToEvent={onGoToEvent} />
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
  feature,
  onGoToEvent,
}: {
  date: IsoDate
  feature: BorderProperties
  onGoToEvent: (event: HistoricalEvent) => void
}) {
  const { lang, t } = useI18n()
  const name = countryName(feature.gwcode, date, lang, feature.country_name)
  const dependent =
    feature.status !== 'independent' && feature.owner && feature.owner !== String(feature.gwcode)
  const statusKey = `status.${feature.status}` as Parameters<typeof t>[0]
  const related = EVENTS.filter((e) => e.countries.includes(feature.gwcode))

  return (
    <>
      <p className="detail-kicker">{t('country')}</p>
      <h2 className="detail-title">{name}</h2>
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

function ReadMore({ href }: { href: string }) {
  const { t } = useI18n()
  return (
    <a className="read-more" href={href} target="_blank" rel="noopener">
      {t('readMore')} · Wikipedia ↗
    </a>
  )
}
