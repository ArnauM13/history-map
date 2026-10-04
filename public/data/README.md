# Les fronteres

Les fa `npm run data:borders` (`scripts/build-borders.mjs`), i les zones de la capa d'ocupacions
(`occupations.geojson`), `npm run data:occupations` (`scripts/build-occupations.mjs`). No es toquen
a mà. Algunes vores de les zones surten de [Natural Earth](https://www.naturalearthdata.com/), de
domini públic.

Derivades de **CShapes 2.0** (ETH Zuric i Universitat de Constança): Schvitz et al. (2022),
_Mapping the International System, 1886–2019: The CShapes 2.0 Dataset_, Journal of Conflict
Resolution 66(1). https://icr.ethz.ch/data/cshapes/

Llicència [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca): cal citar-ne
l'origen, no es poden fer servir amb finalitat comercial i les adaptacions van amb la mateixa
llicència. El que s'hi ha canviat és a `DADES.md`.

Les d'abans del 1886 (`history/`) les fa `npm run data:history` (`scripts/build-history.mjs`), i
són derivades de **Cliopatria** (Seshat Global History Databank), versió 0.2.1:
https://github.com/Seshat-Global-History-Databank/cliopatria ·
https://doi.org/10.1038/s41597-025-04516-9. Llicència
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ca): cal citar-ne l'origen. Les
correccions són a `DADES.md` §1.4.
