import { useMemo } from 'react'
import { CONFLICTS, EVENTS, KEY_DATES, countryName, localize } from '../content'
import { ALL_FLAG_CHANGES } from '../content/flags'
import { useI18n } from '../i18n'
import {
  addMonths,
  formatDate,
  fromStepIndex,
  isWithin,
  stepIndex,
  yearOf,
  type Era,
  type IsoDate,
  type Precision,
} from '../lib/date'
import type { SidebarTab } from './Sidebar'
import { Icon } from './Icon'

interface Props {
  date: IsoDate
  precision: Precision
  /** La part del mapa: la línia només va de la primera a l'última data d'aquesta part. */
  era: Era
  playing: boolean
  /** La pestanya del panell decideix què marca la línia i entre quines dates salta. */
  tab: SidebarTab
  selectedCode?: string
  onChange: (date: IsoDate, precision: Precision) => void
  onTogglePlay: () => void
  onSelectConflict: (id: string) => void
}

/** Cada conflicte de la part del mapa al primer carril on no en trepitja cap altre. */
function useConflictLanes({ min, max }: Era) {
  return useMemo(() => {
    const laneEnds: string[] = []
    const inside = CONFLICTS.filter((c) => c.start <= max && (c.end ?? max) >= min)
    return inside.map((conflict) => {
      const end = conflict.end ?? max
      let lane = laneEnds.findIndex((laneEnd) => laneEnd < conflict.start)
      if (lane === -1) lane = laneEnds.length
      laneEnds[lane] = end
      return { conflict, lane, end }
    })
  }, [min, max])
}

export function Timeline({
  date,
  precision,
  era,
  playing,
  tab,
  selectedCode,
  onChange,
  onTogglePlay,
  onSelectConflict,
}: Props) {
  const { lang, t } = useI18n()
  const max = stepIndex(era.max, era)
  const current = stepIndex(date, era)
  const pct = (iso: IsoDate) => `${(stepIndex(iso, era) / max) * 100}%`
  const lanes = useConflictLanes(era)
  const laneCount = Math.max(1, ...lanes.map((l) => l.lane + 1))
  const inEra = (iso: IsoDate) => isWithin(iso, era.min, era.max)

  // Les marques van als anys rodons: 1890, 1900…, no 1886, 1896… En una pantalla estreta només hi
  // caben les grosses (majorTicks): cada vint anys, o cada segle a la secció d'abans del 1886.
  const decades: { year: number; minor: boolean }[] = []
  const first = Math.ceil(yearOf(era.min) / era.ticks) * era.ticks
  for (let y = first; y <= yearOf(era.max); y += era.ticks) {
    decades.push({ year: y, minor: y % era.majorTicks !== 0 })
  }

  // A Banderes, les dates clau són els canvis de bandera: tots, o només els de l'estat triat,
  // que és el que vols recórrer quan mires com ha canviat la d'un país.
  const flagChanges = ALL_FLAG_CHANGES.filter(
    (c) =>
      inEra(c.period.from) &&
      (tab !== 'flags' || selectedCode === undefined || c.code === selectedCode),
  )
  const events = EVENTS.filter((e) => inEra(e.date))
  const keyDates = (
    tab === 'flags' ? [...new Set(flagChanges.map((c) => c.period.from))].sort() : KEY_DATES
  ).filter(inEra)

  const goToStep = (index: number) =>
    onChange(fromStepIndex(Math.min(max, Math.max(0, index)), era), 'month')
  // Els botons van de mes en mes també abans del 1886, on un pas de la línia en són sis.
  const goToMonth = (months: number) => {
    const next = addMonths(date, months)
    if (inEra(next)) onChange(next, 'month')
  }
  const previousKeyDate = [...keyDates].reverse().find((d) => d < date)
  const nextKeyDate = keyDates.find((d) => d > date)

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
          disabled={addMonths(date, -1) < era.min}
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
          {tab === 'flags'
            ? flagChanges.map(({ code, period }) => (
                <span
                  key={`${code}-${period.from}`}
                  className={`timeline-tick flag${code === selectedCode ? ' is-selected' : ''}`}
                  style={{ left: pct(period.from) }}
                  title={`${formatDate(period.from, lang)} · ${countryName(code, period.from, lang)}`}
                />
              ))
            : events.map((event) => (
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
