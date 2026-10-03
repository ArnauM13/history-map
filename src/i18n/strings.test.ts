import { describe, expect, it } from 'vitest'
import { translator } from './index'
import { LANGUAGES, MESSAGES } from './strings'

const params = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
const forms = (message: unknown) =>
  typeof message === 'string' ? [message] : Object.values(message as Record<string, string>)

describe('els diccionaris', () => {
  const keys = Object.keys(MESSAGES.ca).sort()

  it.each(LANGUAGES)('%s té les mateixes claus que el català', (lang) => {
    expect(Object.keys(MESSAGES[lang]).sort()).toEqual(keys)
  })

  it.each(LANGUAGES)('%s no té cap text buit i fa servir els mateixos {params}', (lang) => {
    for (const key of keys) {
      const source = forms(MESSAGES.ca[key as keyof typeof MESSAGES.ca])
      for (const [i, text] of forms(MESSAGES[lang][key as keyof typeof MESSAGES.ca]).entries()) {
        expect(text.trim(), `${lang}.${key}`).not.toBe('')
        expect(params(text), `${lang}.${key}`).toEqual(params(source[i] ?? source[0]))
      }
    }
  })

  it("tria la forma del plural segons l'idioma", () => {
    expect(translator('ca').tn('statesCount', 1)).toBe('1 estat')
    expect(translator('ca').tn('statesCount', 36)).toBe('36 estats')
    expect(translator('en').tn('statesCount', 1)).toBe('1 state')
  })
})
