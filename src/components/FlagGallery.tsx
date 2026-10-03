import { useMemo } from 'react'
import { countryName } from '../content'
import { flagChangesBetween, flagOn } from '../content/flags'
import { useI18n } from '../i18n'
import { addDays, formatDate, toDateNumber, yearOf, type IsoDate } from '../lib/date'
import { featuresOn, stateOn, type LabelCollection } from '../map/data'
import type { BorderProperties } from '../selection'
import { Flag } from './Flag'
import { Icon } from './Icon'

interface Props {
  date: IsoDate
  labels: LabelCollection | null
  selectedGwcode?: number
  onSelectCountry: (feature: BorderProperties) => void
  onGoToDate: (date: IsoDate) => void
}

/** La pestanya Banderes: les estrenades aquell any, i totes les que onejaven aquell dia. */
export function FlagGallery({ date, labels, selectedGwcode, onSelectCountry, onGoToDate }: Props) {
  const { lang, t, tn } = useI18n()
  const year = yearOf(date)
  const yearAgo = addDays(date, -365)

  const states = useMemo(() => {
    if (!labels) return []
    return (
      featuresOn(labels, toDateNumber(date))
        .map((f) => ({
          feature: f.properties,
          name: countryName(f.properties.gwcode, date, lang, f.properties.country_name),
          period: flagOn(f.properties.gwcode, date),
        }))
        // Un estat sense cap bandera documentada no hi surt. Un territori dependent, només si
        // en tenia una de pròpia (o cap, com l'Alemanya ocupada, que també s'explica així).
        .filter(
          ({ feature, period }) =>
            period && (period.flag !== undefined || feature.status === 'independent'),
        )
        .sort((a, b) => a.name.localeCompare(b.name, lang))
    )
  }, [labels, date, lang])

  const changes = useMemo(() => flagChangesBetween(`${year}-01-01`, `${year}-12-31`), [year])

  // Anar a un canvi és anar a la data i obrir l'estat: el que vols veure és la bandera nova.
  const goToChange = (gwcode: number, from: IsoDate) => {
    onGoToDate(from)
    const feature = stateOn(labels, gwcode, from)
    if (feature) onSelectCountry(feature)
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
          <span className="section-count" title={tn('statesCount', states.length)}>
            {states.length}
          </span>
        </div>
        <ul className="flag-grid">
          {states.map(({ feature, name, period }) => {
            const isNew = period?.from && yearAgo < period.from && period.from <= date
            return (
              <li key={feature.gwcode}>
                <button
                  type="button"
                  className="flag-card"
                  aria-current={feature.gwcode === selectedGwcode}
                  onClick={() => onSelectCountry(feature)}
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
      </section>
    </>
  )
}
