import { useState } from 'react'
import { flagUrl } from '../content/flags'
import { useI18n } from '../i18n'

interface Props {
  /** Catalogue id; `null` = no flag of its own; `undefined` = not documented. */
  id: string | null | undefined
  size?: 'sm' | 'md' | 'lg'
  /** Accessible description, e.g. the state's name. */
  label: string
}

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
