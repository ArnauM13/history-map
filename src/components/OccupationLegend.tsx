import { OCCUPATION_KINDS, type OccupationKind } from '../content/schema'
import { useI18n } from '../i18n'

/**
 * Què vol dir cada manera de pintar una zona, només de les que hi ha en la data. Les mostres són
 * grises perquè al mapa el color canvia: és el de qui controlava la zona.
 */
export function OccupationLegend({ kinds }: { kinds: Set<OccupationKind> }) {
  const { t } = useI18n()
  return (
    <ul className="map-legend" aria-label={t('occupationsLegend')}>
      {OCCUPATION_KINDS.filter((kind) => kinds.has(kind)).map((kind) => (
        <li key={kind}>
          <span className={`legend-swatch ${kind}`} aria-hidden="true" />
          {t(`occupation.${kind}`)}
        </li>
      ))}
    </ul>
  )
}
