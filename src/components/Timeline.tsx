import { useMemo } from 'react'
import { CONFLICTS, EVENTS, KEY_DATES, localize } from '../content'
import { useI18n } from '../i18n'
import {
  FIRST_YEAR,
  formatDate,
  fromMonthIndex,
  monthIndex,
  yearOf,
  type IsoDate,
  type Precision,
} from '../lib/date'
import { Icon } from './Icon'

interface Props {
  date: IsoDate
  precision: Precision
  maxDate: IsoDate
  playing: boolean
  onChange: (date: IsoDate, precision: Precision) => void
  onTogglePlay: () => void
  onSelectConflict: (id: string) => void
}

/** Greedily assigns conflicts to lanes so that bars never overlap. */
function useConflictLanes(maxDate: IsoDate) {
  return useMemo(() => {
    const laneEnds: string[] = []
    return CONFLICTS.map((conflict) => {
      const end = conflict.end ?? maxDate
      let lane = laneEnds.findIndex((laneEnd) => laneEnd < conflict.start)
      if (lane === -1) lane = laneEnds.length
      laneEnds[lane] = end
      return { conflict, lane, end }
    })
  }, [maxDate])
}

export function Timeline({
  date,
  precision,
  maxDate,
  playing,
  onChange,
  onTogglePlay,
  onSelectConflict,
}: Props) {
  const { lang, t } = useI18n()
  const max = monthIndex(maxDate)
  const current = monthIndex(date)
  const pct = (iso: IsoDate) => `${(monthIndex(iso) / max) * 100}%`
  const lanes = useConflictLanes(maxDate)
  const laneCount = Math.max(1, ...lanes.map((l) => l.lane + 1))

  const decades = []
  for (let y = FIRST_YEAR; y <= yearOf(maxDate); y += 10) decades.push(y)

  const goToMonth = (index: number) =>
    onChange(fromMonthIndex(Math.min(max, Math.max(0, index))), 'month')
  const previousKeyDate = [...KEY_DATES].reverse().find((d) => d < date)
  const nextKeyDate = KEY_DATES.find((d) => d > date && d <= maxDate)

  return (
    <section className="timeline" aria-label={t('timeline')}>
      <div className="timeline-controls">
        <button
          type="button"
          className="icon-button"
          onClick={() => previousKeyDate && onChange(previousKeyDate, 'day')}
          disabled={!previousKeyDate}
          title={t('prevEvent')}
          aria-label={t('prevEvent')}
        >
          <Icon name="first" />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => goToMonth(current - 1)}
          disabled={current <= 0}
          title={t('prevMonth')}
          aria-label={t('prevMonth')}
        >
          <Icon name="prev" />
        </button>
        <button
          type="button"
          className="icon-button primary"
          onClick={onTogglePlay}
          title={playing ? t('pause') : t('play')}
          aria-label={playing ? t('pause') : t('play')}
          aria-pressed={playing}
        >
          <Icon name={playing ? 'pause' : 'play'} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => goToMonth(current + 1)}
          disabled={current >= max}
          title={t('nextMonth')}
          aria-label={t('nextMonth')}
        >
          <Icon name="next" />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => nextKeyDate && onChange(nextKeyDate, 'day')}
          disabled={!nextKeyDate}
          title={t('nextEvent')}
          aria-label={t('nextEvent')}
        >
          <Icon name="last" />
        </button>
        <output className="timeline-date" aria-live="polite">
          {formatDate(date, lang, precision)}
        </output>
      </div>

      <div className="timeline-track">
        <div className="timeline-strip" style={{ height: `${laneCount * 7 + 10}px` }}>
          {EVENTS.map((event) => (
            <span
              key={event.id}
              className="timeline-event"
              style={{ left: pct(event.date) }}
              title={`${formatDate(event.date, lang)} · ${localize(event.title, lang)}`}
            />
          ))}
          {lanes.map(({ conflict, lane, end }) => (
            <button
              type="button"
              key={conflict.id}
              className="timeline-conflict"
              style={{
                left: pct(conflict.start),
                width: `max(4px, calc(${pct(end)} - ${pct(conflict.start)}))`,
                top: `${8 + lane * 7}px`,
              }}
              title={localize(conflict.title, lang)}
              aria-label={localize(conflict.title, lang)}
              onClick={() => onSelectConflict(conflict.id)}
            />
          ))}
        </div>
        <input
          type="range"
          className="timeline-range"
          min={0}
          max={max}
          step={1}
          value={current}
          onChange={(e) => goToMonth(Number(e.target.value))}
          aria-label={t('timeline')}
          aria-valuetext={formatDate(date, lang, 'month')}
        />
        <div className="timeline-decades">
          {decades.map((year) => (
            <button
              type="button"
              key={year}
              style={{ left: pct(`${year}-01-01`) }}
              onClick={() => onChange(`${year}-01-01`, 'year')}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
