import { useMemo } from 'react'
import { CONFLICTS, EVENTS, KEY_DATES, countryName, localize } from '../content'
import { ALL_FLAG_CHANGES } from '../content/flags'
import { useI18n } from '../i18n'
import {
  EXACT_BORDERS_FROM,
  FIRST_YEAR,
  MIN_DATE,
  addMonths,
  formatDate,
  fromStepIndex,
  stepIndex,
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
  selectedCode?: string
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
  selectedCode,
  onChange,
  onTogglePlay,
  onSelectConflict,
}: Props) {
  const { lang, t } = useI18n()
  const max = stepIndex(maxDate)
  const current = stepIndex(date)
  const pct = (iso: IsoDate) => `${(stepIndex(iso) / max) * 100}%`
  const lanes = useConflictLanes(maxDate)
  const laneCount = Math.max(1, ...lanes.map((l) => l.lane + 1))

  // Les marques van als anys rodons: 1890, 1900…, no 1886, 1896… Abans del 1886, on cada pas és
  // de sis mesos, cada cinquanta anys. En una pantalla estreta només hi caben les grosses: cada vint
  // anys des del 1886 i, abans, el 1500 i el 1800; amb els quatre segles, s'enganxaven.
  const exactYear = yearOf(EXACT_BORDERS_FROM)
  const decades: { year: number; minor: boolean }[] = []
  for (let y = Math.ceil(FIRST_YEAR / 50) * 50; y < exactYear; y += 50) {
    decades.push({ year: y, minor: (y - FIRST_YEAR) % 300 !== 0 })
  }
  for (let y = Math.ceil(exactYear / 10) * 10; y <= yearOf(maxDate); y += 10) {
    decades.push({ year: y, minor: y % 20 !== 0 })
  }

  // A Banderes, les dates clau són els canvis de bandera: tots, o només els de l'estat triat,
  // que és el que vols recórrer quan mires com ha canviat la d'un país.
  const flagChanges =
    tab === 'flags' && selectedCode !== undefined
      ? ALL_FLAG_CHANGES.filter((c) => c.code === selectedCode)
      : ALL_FLAG_CHANGES
  const keyDates =
    tab === 'flags' ? [...new Set(flagChanges.map((c) => c.period.from))].sort() : KEY_DATES

  const goToStep = (index: number) =>
    onChange(fromStepIndex(Math.min(max, Math.max(0, index))), 'month')
  // Els botons van de mes en mes també abans del 1886, on un pas de la línia en són sis.
  const goToMonth = (months: number) => {
    const next = addMonths(date, months)
    if (next >= MIN_DATE && next <= maxDate) onChange(next, 'month')
  }
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
          onClick={() => goToMonth(-1)}
          disabled={addMonths(date, -1) < MIN_DATE}
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
          onClick={() => goToMonth(1)}
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
          <span
            className="timeline-approx"
            style={{ width: pct(EXACT_BORDERS_FROM) }}
            title={t('timelineApprox')}
          />
          {tab === 'flags'
            ? flagChanges.map(({ code, period }) => (
                <span
                  key={`${code}-${period.from}`}
                  className={`timeline-tick flag${code === selectedCode ? ' is-selected' : ''}`}
                  style={{ left: pct(period.from) }}
                  title={`${formatDate(period.from, lang)} · ${countryName(code, period.from, lang)}`}
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
          onChange={(e) => goToStep(Number(e.target.value))}
          aria-label={t('timeline')}
          aria-valuetext={formatDate(date, lang, 'month')}
        />
        <div className="timeline-decades">
          {decades.map(({ year, minor }) => (
            <button
              type="button"
              key={year}
              className={minor ? 'is-minor' : undefined}
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
