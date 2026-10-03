import { useState } from 'react'
import { flagUrl } from '../content/flags'
import { useI18n } from '../i18n'

interface Props {
  /** Una bandera del catàleg; `null` és «sense bandera pròpia», i `undefined`, «per documentar». */
  id: string | null | undefined
  size?: 'sm' | 'md' | 'lg'
  /** El que es llegeix en comptes de la imatge: normalment, el nom de l'estat. */
  label: string
}

/**
 * Una bandera, o el forat que en marca l'absència. Si la imatge no hi és (encara no s'ha
 * baixat), es pinta el mateix forat que «per documentar» en lloc d'una icona trencada.
 */
export function Flag({ id, size = 'md', label }: Props) {
  const { t } = useI18n()
  const [failedId, setFailedId] = useState<string | null>(null)

  if (!id || failedId === id) {
    const reason = id === null ? t('noOwnFlag') : t('flagUnknown')
    return (
      <span
        className={`flag flag-${size} flag-missing`}
        role="img"
        aria-label={`${label}: ${reason}`}
        title={reason}
      >
        {id === null ? '–' : '?'}
      </span>
    )
  }
  return (
    <img
      className={`flag flag-${size}`}
      src={flagUrl(id)}
      alt={label}
      loading="lazy"
      onError={() => setFailedId(id)}
    />
  )
}
