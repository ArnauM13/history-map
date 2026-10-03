import { useI18n } from '../i18n'
import { Icon } from './Icon'

export interface SourceItem {
  /** Què recolza aquesta font, quan una fitxa en té de diverses («Fronteres i capital»). */
  what?: string
  /** On és: «Viquipèdia», «CShapes 2.0», l'ONU… */
  site: string
  title: string
  url: string
}

/**
 * La llista de fonts d'una fitxa. Res del que ensenya el mapa és nostre sense més: cada dada diu
 * d'on surt, i s'hi pot anar a comprovar.
 */
export function Sources({ items }: { items: SourceItem[] }) {
  const { t } = useI18n()
  const unique = items.filter((item, i) => items.findIndex((other) => other.url === item.url) === i)
  if (unique.length === 0) return null
  return (
    <>
      <h3>{t('sourcesTitle')}</h3>
      <ul className="sources">
        {unique.map((item, i) => (
          <li key={item.url}>
            {item.what && item.what !== unique[i - 1]?.what && (
              <span className="src-what">{item.what}</span>
            )}
            <a href={item.url} target="_blank" rel="noopener">
              <span className="src-site">{item.site}</span>
              <span className="src-title">{item.title}</span>
              <Icon name="open_in_new" />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
