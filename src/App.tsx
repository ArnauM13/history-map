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
  EXACT_BORDERS_FROM,
  clampDate,
  eraOf,
  fromStepIndex,
  isValidIsoDate,
  stepIndex,
  todayIso,
  yearOf,
  type Era,
  type EraId,
  type IsoDate,
  type Precision,
} from './lib/date'
import { useHistoryFor, useLabels } from './map/data'
import { MapView } from './map/MapView'
import type { Selection } from './selection'

/** On s'obre cada part del mapa. */
const DEFAULT_DATES: Record<EraId, IsoDate> = {
  // El dia de Sarajevo: l'Europa dels imperis, just abans que s'esquerdi.
  main: '1914-06-28',
  // L'Acta Final del Congrés de Viena: l'Europa que surt de Napoleó.
  early: '1815-06-09',
}
/**
 * Mil·lisegons per pas quan la línia es reprodueix: un segle passa en uns tres minuts des del 1886,
 * i en mig minut a la secció d'abans, on cada pas és de sis mesos.
 */
const PLAY_INTERVAL = 150

/** Una data dins de la part, o on s'obre la part si cau fora. */
const dateIn = (date: IsoDate, era: Era) =>
  clampDate(date, era) === date ? date : DEFAULT_DATES[era.id]

function initialState(today: IsoDate) {
  const params = new URLSearchParams(location.search)
  const d = params.get('d') ?? ''
  const lang = params.get('lang')
  // Les adreces d'abans que hi hagués la secció (?d=1700-01-01) obren la secció d'abans del 1886.
  const eraId: EraId =
    params.get('era') === 'early' || (isValidIsoDate(d) && d < EXACT_BORDERS_FROM)
      ? 'early'
      : 'main'
  const era = eraOf(eraId, today)
  return {
    eraId,
    date: isValidIsoDate(d) ? clampDate(d, era) : DEFAULT_DATES[eraId],
    lang: isLang(lang) ? lang : detectLanguage(),
    showFlags: params.get('flags') !== '0',
    showOccupations: params.get('occ') !== '0',
  }
}

export default function App() {
  const today = useMemo(() => todayIso(), [])
  const [initial] = useState(() => initialState(today))
  const [eraId, setEraId] = useState<EraId>(initial.eraId)
  const era = useMemo(() => eraOf(eraId, today), [eraId, today])
  const early = eraId === 'early'
  const [lang, setLang] = useState<Lang>(initial.lang)
  const [date, setDate] = useState<IsoDate>(initial.date)
  const [precision, setPrecision] = useState<Precision>('day')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [playing, setPlaying] = useState(false)
  const [showFlags, setShowFlags] = useState(initial.showFlags)
  const [showOccupations, setShowOccupations] = useState(initial.showOccupations)
  const [tab, setTab] = useState<SidebarTab>('flags')
  const labels = useLabels()
  const historyStatus = useHistoryFor(date)
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
    if (early) params.set('era', 'early')
    else params.delete('era')
    if (showFlags) params.delete('flags')
    else params.set('flags', '0')
    if (showOccupations) params.delete('occ')
    else params.set('occ', '0')
    history.replaceState(null, '', `?${params}`)
  }, [date, lang, early, showFlags, showOccupations])

  useEffect(() => {
    document.documentElement.lang = lang
    const { t } = translator(lang)
    document.title = early ? `${t('earlyTitle')} · ${t('appTitle')}` : t('appTitle')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('metaDescription'))
  }, [lang, early])

  // Reproduir: un pas a cada tic, fins al final de la part. Si el segle que ve encara no ha
  // arribat, s'espera.
  const waiting = historyStatus !== 'ready'
  useEffect(() => {
    if (!playing || waiting) return
    const id = setInterval(() => {
      setPrecision('month')
      setDate((d) => fromStepIndex(Math.min(stepIndex(d, era) + 1, stepIndex(era.max, era)), era))
    }, PLAY_INTERVAL)
    return () => clearInterval(id)
  }, [playing, waiting, era])

  const atEnd = stepIndex(date, era) >= stepIndex(era.max, era)
  if (playing && atEnd) setPlaying(false)

  const changeDate = useCallback(
    (next: IsoDate, nextPrecision: Precision) => {
      setDate(clampDate(next, era))
      setPrecision(nextPrecision)
    },
    [era],
  )

  const togglePlay = () => {
    if (!playing && atEnd) changeDate(era.min, 'month')
    setPlaying(!playing)
  }

  /** Canvia de part del mapa: la data es queda si hi cap, i la fitxa oberta, no. */
  const switchEra = (next: EraId) => {
    setPlaying(false)
    setSelection(null)
    setEraId(next)
    setDate(dateIn(date, eraOf(next, today)))
    setPrecision('day')
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
            <h1>
              {early ? t('earlyTitle') : t('appTitle')}
              {early && <span className="badge">{t('experimental')}</span>}
            </h1>
            <p className="subtitle">{early ? t('earlySubtitle') : t('appSubtitle')}</p>
          </div>
          <div className="header-actions">
            <a
              className="era-link"
              href={`?era=${early ? 'main' : 'early'}&lang=${lang}`}
              aria-label={early ? t('mainLinkLabel') : t('earlyLinkLabel')}
              onClick={(e) => {
                e.preventDefault()
                switchEra(early ? 'main' : 'early')
              }}
            >
              <Icon name={early ? 'arrow_back' : 'history_edu'} />
              {early ? t('mainLink') : t('earlyLink')}
            </a>
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
          </div>
        </header>

        <main className="map-area">
          <MapView
            date={date}
            historyStatus={historyStatus}
            showFlags={!early && showFlags}
            showOccupations={!early && showOccupations}
            events={yearEvents}
            conflicts={conflicts}
            selection={selection}
            onSelect={setSelection}
          />
          {early ? (
            // Abans del 1886 no hi ha banderes documentades ni ocupacions: en lloc dels
            // interruptors, què és aquesta secció i per què no és com la resta.
            <p className="map-notice">
              <Icon name="experiment" />
              {t('earlyNotice')}
            </p>
          ) : (
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
          )}
          {!early && showOccupations && occupations.length > 0 && (
            <OccupationLegend kinds={new Set(occupations.map((o) => controlOn(o, date)!.kind))} />
          )}
        </main>

        <Timeline
          date={date}
          precision={precision}
          era={era}
          playing={playing}
          tab={tab}
          selectedCode={selection?.kind === 'country' ? selection.feature.code : undefined}
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
