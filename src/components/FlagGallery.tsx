import { useMemo } from 'react'
import { controlOn, countryName, localize } from '../content'
import { flagChangesBetween, flagOn, type FlagPeriod } from '../content/flags'
import type { Occupation } from '../content/schema'
import { useI18n } from '../i18n'
import { addDays, formatDate, toDateNumber, yearOf, type IsoDate } from '../lib/date'
import {
  featuresOn,
  insideMultiPolygon,
  stateOn,
  useBorderData,
  type LabelCollection,
} from '../map/data'
import type { Selection } from '../selection'
import { Flag } from './Flag'
import { Icon } from './Icon'

interface Props {
  date: IsoDate
  labels: LabelCollection | null
  /** Les zones de la capa d'ocupacions en la data, si la capa és visible; si no, cap. */
  occupations: Occupation[]
  selection: Selection | null
  onSelect: (selection: Selection) => void
  onGoToDate: (date: IsoDate) => void
}

interface Card {
  key: string
  name: string
  period: FlagPeriod
  selection: Selection
}

/** La pestanya Banderes: les estrenades aquell any, i totes les que onejaven aquell dia. */
export function FlagGallery({ date, labels, occupations, selection, onSelect, onGoToDate }: Props) {
  const { lang, t, tn } = useI18n()
  const year = yearOf(date)
  const yearAgo = addDays(date, -365)
  const shapes = useBorderData()?.occupations
  const selectedGwcode = selection?.kind === 'country' ? selection.feature.gwcode : undefined

  const cards = useMemo(() => {
    if (!labels) return []
    // Un estat annexionat per un altre no tenia bandera que onegés: Àustria, del 1938 al 1945.
    const annexations = occupations.flatMap((zone) => {
      const control = controlOn(zone, date)
      const shape = shapes?.features.find((f) => f.properties.id === zone.id)
      return control?.kind === 'annexation' && shape ? [{ by: control.by, shape }] : []
    })
    const states: Card[] = featuresOn(labels, toDateNumber(date))
      .filter((f) =>
        annexations.every(
          ({ by, shape }) =>
            by === f.properties.gwcode ||
            !insideMultiPolygon(f.geometry.coordinates, shape.geometry),
        ),
      )
      .flatMap((f) => {
        const period = flagOn(f.properties.gwcode, date)
        // Un estat sense cap bandera documentada no hi surt. Un territori dependent, només si
        // en tenia una de pròpia (o cap, com l'Alemanya ocupada, que també s'explica així).
        if (!period || (period.flag === undefined && f.properties.status !== 'independent'))
          return []
        const { gwcode, country_name } = f.properties
        return [
          {
            key: String(gwcode),
            name: countryName(gwcode, date, lang, country_name),
            period,
            selection: { kind: 'country' as const, feature: f.properties },
          },
        ]
      })
    // I els territoris de la capa d'ocupacions amb bandera pròpia (l'Estat Eslovac), si no és la
    // mateixa que ja hi surt: la França de Vichy feia servir la de França.
    const shown = new Set(states.map((s) => s.period.flag))
    const zones: Card[] = occupations.flatMap((zone) =>
      zone.flag && !shown.has(zone.flag)
        ? [
            {
              key: zone.id,
              name: localize(zone.label ?? zone.title, lang),
              period: { flag: zone.flag, from: zone.start },
              selection: { kind: 'occupation' as const, id: zone.id },
            },
          ]
        : [],
    )
    return [...states, ...zones].sort((a, b) => a.name.localeCompare(b.name, lang))
  }, [labels, occupations, shapes, date, lang])

  const changes = useMemo(() => flagChangesBetween(`${year}-01-01`, `${year}-12-31`), [year])

  // Anar a un canvi és anar a la data i obrir l'estat: el que vols veure és la bandera nova.
  const goToChange = (gwcode: number, from: IsoDate) => {
    onGoToDate(from)
    const feature = stateOn(labels, gwcode, from)
    if (feature) onSelect({ kind: 'country', feature })
  }

  return (
    <>
      <section className="card-section">
        <div className="section-header">
          <Icon name="flag" />
          <h2 className="section-title">{t('flagChangesOfYear', { year })}</h2>
          {changes.length > 0 && <span className="section-count">{changes.length}</span>}
        </div>
        {changes.length === 0 ? (
          <p className="empty-state">{t('noFlagChanges')}</p>
        ) : (
          <ul className="item-list">
            {changes.map(({ gwcode, period }) => {
              const name = countryName(gwcode, period.from, lang)
              return (
                <li key={`${gwcode}-${period.from}`}>
                  <button
                    type="button"
                    className={`item-card${period.from > date ? ' is-upcoming' : ''}`}
                    aria-current={gwcode === selectedGwcode && period.from <= date}
                    onClick={() => goToChange(gwcode, period.from)}
                    title={name}
                  >
                    <Flag id={period.flag} size="sm" label={name} />
                    <span className="ic-body">
                      <span className="ic-name">{name}</span>
                      <span className="ic-detail">{formatDate(period.from, lang)}</span>
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
          <Icon name="public" />
          <h2 className="section-title">{t('flagsOn', { date: formatDate(date, lang) })}</h2>
          <span className="section-count" title={tn('statesCount', cards.length)}>
            {cards.length}
          </span>
        </div>
        <ul className="flag-grid">
          {cards.map(({ key, name, period, selection: target }) => {
            const isNew = period?.from && yearAgo < period.from && period.from <= date
            const current =
              target.kind === 'country'
                ? target.feature.gwcode === selectedGwcode
                : selection?.kind === 'occupation' && selection.id === target.id
            return (
              <li key={key}>
                <button
                  type="button"
                  className="flag-card"
                  aria-current={current}
                  onClick={() => onSelect(target)}
                >
                  <Flag id={period?.flag} label={name} />
                  <span className="ic-name">{name}</span>
                  {isNew ? (
                    <span className="chip new">{t('newFlag')}</span>
                  ) : (
                    period?.from &&
                    period.flag && (
                      <span className="ic-detail">{t('since', { year: yearOf(period.from) })}</span>
                    )
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="src-note">{t('flagsSourcesNote')}</p>
      </section>
    </>
  )
}
