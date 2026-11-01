# 2000-territoris-que-falten

**Pregunta**: que les illes i els territoris que CShapes no té o que la simplificació s'empassa
surtin amb el seu estat, des del dia que ho van ser.

**Abast**: Svalbard (Noruega; el tractat és del 1920-02-09 i la sobirania té efecte el
1925-08-14, quan entra en vigor), la Terra de Francesc Josep (decret soviètic del 1926-04-15),
Jan Mayen, les Fèroe i la costa est de Grenlàndia (Dinamarca) dins del retall `[-28°, 30°, 78°,
82°]`, i les Åland (Finlàndia), que hi són però es perden en simplificar. Tot el període, no
només el segle XXI. Les dates, per comprovar.

**Estat**: obert — 1. Pla, 2026-11-01.

## Context

DADES.md §1.2 («Les fronteres d'avui, a mitges»). Les formes, de Natural Earth (domini públic),
com fa `build-occupations.mjs`, afegides amb `transfer` o com a peces noves a `build-borders.mjs`;
les Åland, potser amb un `DETAILED` com Gaza.

## Relleu

Primer: comprovar que el raw de CShapes no les té (Noruega s'acaba a 71,2° N i Rússia a 77,7° N),
triar el fitxer de Natural Earth i fixar les dates amb font.
