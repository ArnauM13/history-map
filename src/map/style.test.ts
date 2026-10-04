import { describe, expect, it } from 'vitest'
import borders from '../../public/data/borders.topo.json?raw'
import { PALETTE } from './style'

describe('la paleta del mapa', () => {
  it('té un color per a cada índex que donen les fronteres', () => {
    const topo = JSON.parse(borders)
    const used = new Set<number>(
      topo.objects.borders.geometries.map((g: { properties: { c: number } }) => g.properties.c),
    )
    for (const c of used) expect(PALETTE[c], `l'índex ${c} no és a PALETTE`).toBeDefined()
  })

  it('no repeteix cap color', () => {
    expect(new Set(PALETTE).size).toBe(PALETTE.length)
  })
})
