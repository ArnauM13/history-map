import { createContext, useContext } from 'react'
import { LANGUAGES, MESSAGES, type Lang, type MessageKey, type Plural } from './strings'

export { LANGUAGES, LANGUAGE_NAMES, type Lang } from './strings'

export const isLang = (value: unknown): value is Lang => LANGUAGES.includes(value as Lang)

/** L'idioma del navegador si és un dels tres; si no, l'anglès, que és el que més gent llegeix. */
export function detectLanguage(): Lang {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase()
    if (isLang(base)) return base
  }
  return 'en'
}

type Vars = Record<string, string | number>

const fill = (text: string, vars?: Vars) =>
  text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars?.[name] ?? ''))

export function translator(lang: Lang) {
  const messages = MESSAGES[lang]
  const rules = new Intl.PluralRules(lang)
  return {
    t: (key: MessageKey, vars?: Vars): string => {
      const message = messages[key]
      return fill(typeof message === 'string' ? message : message.other, vars)
    },
    /** Plurals: `{count}` és `n`, i la forma la tria l'idioma. */
    tn: (key: MessageKey, n: number, vars?: Vars): string => {
      const message = messages[key] as Plural | string
      const form = typeof message === 'string' ? message : message[rules.select(n) as keyof Plural]
      return fill(form ?? (message as Plural).other, { count: n, ...vars })
    },
  }
}

export const LangContext = createContext<Lang>('en')

export function useI18n() {
  const lang = useContext(LangContext)
  return { lang, ...translator(lang) }
}

/** L'ordre en què es busca un text que no hi és en l'idioma de la pantalla. */
export const fallbackOrder = (lang: Lang): Lang[] => [lang, ...LANGUAGES.filter((l) => l !== lang)]
