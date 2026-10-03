import { useMemo } from 'react'
import { countryName } from '../content'
import { flagChangesBetween, flagOn } from '../content/flags'
import { useI18n } from '../i18n'
import { addDays, formatDate, toDateNumber, yearOf, type IsoDate } from '../lib/date'
import { featuresOn, stateOn, type LabelCollection } from '../map/data'
import type { BorderProperties } from '../selection'
import { Flag } from './Flag'

interface Props {
  date: IsoDate
  labels: LabelCollection | null
  selectedGwcode?: number
  onSelectCountry: (feature: BorderProperties) => void
  onGoToDate: (date: IsoDate) => void
}

export function FlagGallery({ date, labels, selectedGwcode, onSelectCountry, onGoToDate }: Props) {
  const { lang, t } = useI18n()
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
        // States without any flag history are left out; dependent territories are shown only
        // when they had a flag of their own (or explicitly none, like occupied Germany).
        .filter(
          ({ feature, period }) =>
            period && (period.flag !== undefined || feature.status === 'independent'),
        )
        .sort((a, b) => a.name.localeCompare(b.name, lang))
    )
  }, [labels, date, lang])

  const changes = useMemo(() => flagChangesBetween(`${year}-01-01`, `${year}-12-31`), [year])

  const goToChange = (gwcode: number, from: IsoDate) => {
    onGoToDate(from)
    const feature = stateOn(labels, gwcode, from)
    if (feature) onSelectCountry(feature)
  }

  return (
    <>
      <section>
        <h2>{t('flagChangesOfYear', { year })}</h2>
        {changes.length === 0 ? (
          <p className="muted">{t('noFlagChanges')}</p>
        ) : (
          <ul className="item-list">
            {changes.map(({ gwcode, period }) => {
              const name = countryName(gwcode, period.from, lang)
              return (
                <li key={`${gwcode}-${period.from}`}>
                  <button
                    type="button"
                    className={`item flag-change${period.from > date ? ' upcoming' : ''}`}
                    onClick={() => goToChange(gwcode, period.from)}
                  >
                    <Flag id={period.flag} size="sm" label={name} />
                    <span>
                      <span className="item-meta">{formatDate(period.from, lang)}</span>
                      <span className="item-title">{name}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section>
        <h2>{t('flagsOn', { date: formatDate(date, lang) })}</h2>
        <p className="muted">{t('statesCount', { count: states.length })}</p>
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
                  <span className="flag-card-name">{name}</span>
                  {isNew ? (
                    <span className="badge new">{t('newFlag')}</span>
                  ) : (
                    period?.from &&
                    period.flag && (
                      <span className="item-meta">{t('since', { year: yearOf(period.from) })}</span>
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
