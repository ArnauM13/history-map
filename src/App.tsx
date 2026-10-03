import { useCallback, useEffect, useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Timeline } from './components/Timeline'
import { activeConflicts, eventsOfYear } from './content'
import type { HistoricalEvent } from './content/schema'
import {
  LANGUAGES,
  LANGUAGE_NAMES,
  LangContext,
  detectLanguage,
  isLang,
  translator,
  type Lang,
} from './i18n'
import {
  MIN_DATE,
  clampDate,
  fromMonthIndex,
  isValidIsoDate,
  monthIndex,
  todayIso,
  yearOf,
  type IsoDate,
  type Precision,
} from './lib/date'
import { MapView } from './map/MapView'
import type { Selection } from './selection'

const DEFAULT_DATE = '1914-06-28'
/** Milliseconds per month while playing the timeline. */
const PLAY_INTERVAL = 150

function initialState(maxDate: IsoDate) {
  const params = new URLSearchParams(location.search)
  const d = params.get('d') ?? ''
  const lang = params.get('lang')
  return {
    date: isValidIsoDate(d) ? clampDate(d, maxDate) : DEFAULT_DATE,
    lang: isLang(lang) ? lang : detectLanguage(),
  }
}

export default function App() {
  const maxDate = useMemo(() => todayIso(), [])
  const [initial] = useState(() => initialState(maxDate))
  const [lang, setLang] = useState<Lang>(initial.lang)
  const [date, setDate] = useState<IsoDate>(initial.date)
  const [precision, setPrecision] = useState<Precision>('day')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [playing, setPlaying] = useState(false)
  const t = translator(lang)

  const year = yearOf(date)
  const yearEvents = useMemo(() => eventsOfYear(year), [year])
  const conflicts = useMemo(() => activeConflicts(date), [date])

  // Keep the URL shareable: ?d=1914-06-28&lang=ca
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    params.set('d', date)
    params.set('lang', lang)
    history.replaceState(null, '', `?${params}`)
  }, [date, lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translator(lang)('appTitle')
  }, [lang])

  // Playback: advance one month per tick until today.
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setPrecision('month')
      setDate((d) => fromMonthIndex(Math.min(monthIndex(d) + 1, monthIndex(maxDate))))
    }, PLAY_INTERVAL)
    return () => clearInterval(id)
  }, [playing, maxDate])

  const atEnd = monthIndex(date) >= monthIndex(maxDate)
  if (playing && atEnd) setPlaying(false)

  const changeDate = useCallback((next: IsoDate, nextPrecision: Precision) => {
    setDate(next < MIN_DATE ? MIN_DATE : next)
    setPrecision(nextPrecision)
  }, [])

  const togglePlay = () => {
    if (!playing && atEnd) changeDate(MIN_DATE, 'month')
    setPlaying(!playing)
  }

  const goToEvent = useCallback(
    (event: HistoricalEvent) => {
      setPlaying(false)
      changeDate(event.date, 'day')
      setSelection({ kind: 'event', id: event.id })
    },
    [changeDate],
  )

  return (
    <LangContext.Provider value={lang}>
      <div className="app">
        <header className="app-header">
          <div>
            <h1>{t('appTitle')}</h1>
            <p className="subtitle">{t('appSubtitle')}</p>
          </div>
          <label className="language">
            <span className="visually-hidden">{t('language')}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_NAMES[l]}
                </option>
              ))}
            </select>
          </label>
        </header>

        <main className="map-area">
          <MapView
            date={date}
            events={yearEvents}
            conflicts={conflicts}
            selection={selection}
            onSelect={setSelection}
          />
        </main>

        <Timeline
          date={date}
          precision={precision}
          maxDate={maxDate}
          playing={playing}
          onChange={changeDate}
          onTogglePlay={togglePlay}
          onSelectConflict={(id) => setSelection({ kind: 'conflict', id })}
        />

        <Sidebar
          date={date}
          selection={selection}
          yearEvents={yearEvents}
          conflicts={conflicts}
          onSelect={setSelection}
          onGoToEvent={goToEvent}
        />
      </div>
    </LangContext.Provider>
  )
}
