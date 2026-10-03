import { createContext, useContext } from 'react'
import { LANGUAGES, MESSAGES, type Lang, type MessageKey } from './strings'

export { LANGUAGES, LANGUAGE_NAMES, type Lang } from './strings'

export const isLang = (value: unknown): value is Lang => LANGUAGES.includes(value as Lang)

export function detectLanguage(): Lang {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase()
    if (isLang(base)) return base
  }
  return 'en'
}

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string

export function translator(lang: Lang): Translate {
  return (key, vars) =>
    (MESSAGES[lang][key] ?? key).replace(/\{(\w+)\}/g, (_, name: string) =>
      String(vars?.[name] ?? ''),
    )
}

export const LangContext = createContext<Lang>('en')

export function useI18n() {
  const lang = useContext(LangContext)
  return { lang, t: translator(lang) }
}

/** Order in which content languages are tried when a text is missing in the UI language. */
export const fallbackOrder = (lang: Lang): Lang[] => [lang, ...LANGUAGES.filter((l) => l !== lang)]
