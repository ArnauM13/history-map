# 2006-montenegro-kosovo

**Pregunta**: que Sèrbia, Montenegro i Kosovo no quedin mai en blanc i comencin el dia que es van
proclamar.

**Abast**: les peces de CShapes del 345, el 340, el 341 i el 347 del 2006 al 2008. No hi entren
l'administració de l'ONU a Kosovo del 1999 al 2008 (lot `1999-kosovo-unmik`) ni les banderes.

**Estat**: tancat — recerca, integració i comprovació fetes el 2026-11-01.

## Context

DADES.md §0.1 (el dia que té efecte: la proclamació) i §1.1. `CORRECTIONS` i `AREAS` a
`scripts/build-borders.mjs`; `src/map/borders.test.ts`.

## Troballes

- Una auditoria de tot el mapa del 2000 ençà (una graella de 0,25°, el dia de cada canvi de peça i
  l'endemà) només troba forats aquí; cap sobreposició.
- CShapes posa les dates del reconeixement: Montenegro el 2006-06-12 (la Unió Europea el reconeix
  aquell dia), Sèrbia el 2006-06-06 i Kosovo el 2008-02-20. La peça de Sèrbia i Montenegro s'acaba
  el 2006-06-02. Entremig, Podgorica no és de ningú del 3 a l'11 de juny, Belgrad del 3 al 5 i
  Prixtina del 17 al 19 de febrer del 2008.
- 2006-06-03 — el parlament de Montenegro declara la independència, després del referèndum del 21
  de maig (55,5 % a favor). 2006-06-05 — el parlament serbi declara Sèrbia successora de la unió
  estatal (font: «Serbia and Montenegro»; Oficina Europea de Patents, *Official Journal* 2007,
  p. 406).
- 2008-02-17 — declaració d'independència de Kosovo (font: «2008 Kosovo declaration of
  independence»).

## Decisions

- Les dates, les de la proclamació (§0.1, ja escrit). Sèrbia i Montenegro dura a Sèrbia els dies 3
  i 4 de juny: fins al 5 no hi ha cap estat serbi proclamat.
- Kosovo, peça pròpia des del 2008-02-17, com a CShapes; la disputa ja la diu el fet.

## Fet

- `build-borders.mjs`: l'operació `begin` (canvia el dia que comencen unes peces), l'àrea
  `montenegro` i tres correccions. Test amb Podgorica, Belgrad i Prixtina.
- DADES (tres idiomes): la fila de §1.1 i el que falta a les fronteres d'avui, a §1.2.

## Relleu

Tancat. El que va sortir de l'auditoria són els altres lots de l'encàrrec «El segle XXI».
