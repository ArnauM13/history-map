import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icon } from './components/Icon'
import { OccupationLegend } from './components/OccupationLegend'
import { Sidebar, type SidebarTab } from './components/Sidebar'
import { Timeline } from './components/Timeline'
import { activeConflicts, activeOccupations, controlOn, eventsOfYear } from './content'
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
import { useLabels } from './map/data'
import { MapView } from './map/MapView'
import type { Selection } from './selection'

/** El dia de Sarajevo: l'Europa dels imperis, just abans que s'esquerdi. */
const DEFAULT_DATE = '1914-06-28'
/** Mil·lisegons per mes quan la línia es reprodueix: un segle passa en uns tres minuts. */
const PLAY_INTERVAL = 150

function initialState(maxDate: IsoDate) {
  const params = new URLSearchParams(location.search)
  const d = params.get('d') ?? ''
  const lang = params.get('lang')
  return {
    date: isValidIsoDate(d) ? clampDate(d, maxDate) : DEFAULT_DATE,
    lang: isLang(lang) ? lang : detectLanguage(),
    showFlags: params.get('flags') !== '0',
    showOccupations: params.get('occ') !== '0',
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
  const [showFlags, setShowFlags] = useState(initial.showFlags)
  const [showOccupations, setShowOccupations] = useState(initial.showOccupations)
  const [tab, setTab] = useState<SidebarTab>('flags')
  const labels = useLabels()
  const { t } = translator(lang)

  const year = yearOf(date)
  const yearEvents = useMemo(() => eventsOfYear(year), [year])
  const conflicts = useMemo(() => activeConflicts(date), [date])
  const occupations = useMemo(() => activeOccupations(date), [date])

  // L'adreça es pot compartir: ?d=1914-06-28&lang=ca obre el mateix mapa a qui la rebi.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    params.set('d', date)
    params.set('lang', lang)
    if (showFlags) params.delete('flags')
    else params.set('flags', '0')
    if (showOccupations) params.delete('occ')
    else params.set('occ', '0')
    history.replaceState(null, '', `?${params}`)
  }, [date, lang, showFlags, showOccupations])

  useEffect(() => {
    document.documentElement.lang = lang
    const { t } = translator(lang)
    document.title = t('appTitle')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('metaDescription'))
  }, [lang])

  // Reproduir: un mes a cada tic, fins avui.
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

  const goToDate = useCallback(
    (next: IsoDate) => {
      setPlaying(false)
      changeDate(next, 'day')
    },
    [changeDate],
  )

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
          <label className="lang">
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
            showFlags={showFlags}
            showOccupations={showOccupations}
            events={yearEvents}
            conflicts={conflicts}
            selection={selection}
            onSelect={setSelection}
          />
          <div className="map-toggles">
            <button
              type="button"
              className="map-toggle"
              aria-pressed={showFlags}
              aria-label={t('showFlagsLabel')}
              onClick={() => setShowFlags(!showFlags)}
            >
              <Icon name={showFlags ? 'flag_fill' : 'flag'} />
              {t('showFlags')}
            </button>
            <button
              type="button"
              className="map-toggle"
              aria-pressed={showOccupations}
              aria-label={t('showOccupationsLabel')}
              onClick={() => setShowOccupations(!showOccupations)}
            >
              <Icon name={showOccupations ? 'layers_fill' : 'layers'} />
              {t('showOccupations')}
            </button>
          </div>
          {showOccupations && occupations.length > 0 && (
            <OccupationLegend kinds={new Set(occupations.map((o) => controlOn(o, date)!.kind))} />
          )}
        </main>

        <Timeline
          date={date}
          precision={precision}
          maxDate={maxDate}
          playing={playing}
          tab={tab}
          selectedGwcode={selection?.kind === 'country' ? selection.feature.gwcode : undefined}
          onChange={changeDate}
          onTogglePlay={togglePlay}
          onSelectConflict={(id) => setSelection({ kind: 'conflict', id })}
        />

        <Sidebar
          date={date}
          tab={tab}
          labels={labels}
          selection={selection}
          yearEvents={yearEvents}
          conflicts={conflicts}
          occupations={occupations}
          showOccupations={showOccupations}
          onTabChange={setTab}
          onSelect={setSelection}
          onGoToEvent={goToEvent}
          onGoToDate={goToDate}
        />
      </div>
    </LangContext.Provider>
  )
}
