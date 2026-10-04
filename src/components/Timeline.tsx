import { useMemo } from 'react'
import { CONFLICTS, EVENTS, KEY_DATES, countryName, localize } from '../content'
import { ALL_FLAG_CHANGES } from '../content/flags'
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
import type { SidebarTab } from './Sidebar'
import { Icon } from './Icon'

interface Props {
  date: IsoDate
  precision: Precision
  maxDate: IsoDate
  playing: boolean
  /** La pestanya del panell decideix què marca la línia i entre quines dates salta. */
  tab: SidebarTab
  selectedGwcode?: number
  onChange: (date: IsoDate, precision: Precision) => void
  onTogglePlay: () => void
  onSelectConflict: (id: string) => void
}

/** Cada conflicte al primer carril on no en trepitja cap altre. */
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
  tab,
  selectedGwcode,
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

  // Les marques van als anys rodons, no cada deu anys des del primer: 1890, 1900…, no 1886, 1896…
  const decades = []
  for (let y = Math.ceil(FIRST_YEAR / 10) * 10; y <= yearOf(maxDate); y += 10) decades.push(y)

  // A Banderes, les dates clau són els canvis de bandera: tots, o només els de l'estat triat,
  // que és el que vols recórrer quan mires com ha canviat la d'un país.
  const flagChanges =
    tab === 'flags' && selectedGwcode !== undefined
      ? ALL_FLAG_CHANGES.filter((c) => c.gwcode === selectedGwcode)
      : ALL_FLAG_CHANGES
  const keyDates =
    tab === 'flags' ? [...new Set(flagChanges.map((c) => c.period.from))].sort() : KEY_DATES

  const goToMonth = (index: number) =>
    onChange(fromMonthIndex(Math.min(max, Math.max(0, index))), 'month')
  const previousKeyDate = [...keyDates].reverse().find((d) => d < date)
  const nextKeyDate = keyDates.find((d) => d > date && d <= maxDate)

  return (
    <section className="timeline" aria-label={t('timeline')}>
      <div className="timeline-controls">
        <button
          type="button"
          className="icon-btn"
          onClick={() => previousKeyDate && onChange(previousKeyDate, 'day')}
          disabled={!previousKeyDate}
          aria-label={t('prevEvent')}
          title={t('prevEvent')}
        >
          <Icon name="skip_previous" />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => goToMonth(current - 1)}
          disabled={current <= 0}
          aria-label={t('prevMonth')}
          title={t('prevMonth')}
        >
          <Icon name="chevron_left" />
        </button>
        <button
          type="button"
          className="icon-btn primary"
          onClick={onTogglePlay}
          aria-label={playing ? t('pause') : t('play')}
          aria-pressed={playing}
          title={playing ? t('pause') : t('play')}
        >
          <Icon name={playing ? 'pause' : 'play_arrow'} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => goToMonth(current + 1)}
          disabled={current >= max}
          aria-label={t('nextMonth')}
          title={t('nextMonth')}
        >
          <Icon name="chevron_right" />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => nextKeyDate && onChange(nextKeyDate, 'day')}
          disabled={!nextKeyDate}
          aria-label={t('nextEvent')}
          title={t('nextEvent')}
        >
          <Icon name="skip_next" />
        </button>
        <output className="timeline-date" aria-live="polite">
          {formatDate(date, lang, precision)}
        </output>
      </div>

      <div className="timeline-track">
        <div className="timeline-strip" style={{ height: `${laneCount * 7 + 10}px` }}>
          {tab === 'flags'
            ? flagChanges.map(({ gwcode, period }) => (
                <span
                  key={`${gwcode}-${period.from}`}
                  className={`timeline-tick flag${gwcode === selectedGwcode ? ' is-selected' : ''}`}
                  style={{ left: pct(period.from) }}
                  title={`${formatDate(period.from, lang)} · ${countryName(gwcode, period.from, lang)}`}
                />
              ))
            : EVENTS.map((event) => (
                <span
                  key={event.id}
                  className="timeline-tick"
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
              className={year % 20 === 0 ? undefined : 'is-minor'}
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
