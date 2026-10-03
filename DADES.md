# Les dades — d'on surten, amb quina llicència i on fallen

El mapa barreja dades de llocs diferents, i cadascuna té la seva llicència. **Si en reaprofites
alguna cosa, mira la llicència d'aquella part.**

| Què | D'on surt | Llicència |
| --- | --- | --- |
| El codi (`src/`, `scripts/`…) | Aquest projecte | MIT |
| Els textos (`content/`) | Qui hi contribueix | CC BY-SA 4.0 |
| Les fronteres (`public/data/`) | CShapes 2.0, retallat i simplificat aquí | CC BY-NC-SA 4.0 |
| Les banderes (`public/flags/`) | Wikimedia Commons | La de cada imatge (§2) |
| Les lletres del mapa (`public/fonts/`) | Open Sans, de [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0 |
| La lletra de la interfície | Roboto ([Fontsource](https://fontsource.org/)) | OFL 1.1 |
| Les icones | [Material Symbols](https://fonts.google.com/icons) | Apache 2.0 |

---

## 1. Les fronteres: CShapes 2.0

[CShapes 2.0](https://icr.ethz.ch/data/cshapes/) dibuixa les fronteres dels estats independents i
dels territoris que en depenien (colònies, protectorats, mandats, territoris ocupats) del 1886 al
2019, amb el dia exacte de cada canvi.

> Schvitz, G., Girardin, L., Rüegger, S., Weidmann, N. B., Cederman, L.-E., i Gleditsch, K. S.
> (2022). Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. _Journal of
> Conflict Resolution_, 66(1), 144–161.

- **Llicència**: CC BY-NC-SA 4.0. Els fitxers de `public/data/` en són una obra derivada amb la
  mateixa llicència: es poden compartir i adaptar citant-ne l'origen, **però no amb finalitat
  comercial**.
- **Edició**: la de Gleditsch i Ward que porta el [paquet `cshapes` d'R](https://github.com/cran/cshapes)
  (`cshapes_2_gw.topojson`).
- **Què se'n fa** (`npm run data:borders`): es queda el que val del 1900 ençà, es retalla a
  `[-28°, 30°, 78°, 82°]`, se simplifica fins al 12 % dels vèrtexs, les dates passen a enters i es
  calculen els colors i on va cada nom.

Els estats s'identifiquen amb els **codis de Gleditsch i Ward** (`gwcode`), els mateixos de
CShapes i de bona part de la ciència política (les dades de conflictes de l'UCDP, per exemple). Els
fets, els conflictes, els noms i les banderes hi fan referència amb aquests codis.

### 1.1 On ens en separem

| Què | Per què |
| --- | --- |
| Crimea segueix a Ucraïna després del 18 de març del 2014 | CShapes la passa a Rússia. Aquí es dibuixa la frontera reconeguda internacionalment, com fan la resolució 68/262 de l'Assemblea General de l'ONU i la majoria d'atles. L'annexió s'explica com a fet, i anirà a la capa d'ocupacions. |

Cada correcció és codi, a la llista `CORRECTIONS` de `scripts/build-borders.mjs`, i té la seva fila
aquí. Els fitxers generats no es toquen mai a mà.

### 1.2 On fallen

- **Fronteres de tractat, no d'ocupació.** CShapes recull els canvis pactats —l'acord de Munic i
  els arbitratges de Viena (1938 i 1940), les annexions soviètiques del 1940— però no el territori
  pres per la força. Entre el 1938 i el 1945 el mapa encara ensenya Àustria, Bohèmia-Moràvia i
  Polònia, i cap ocupació de l'Eix. És el forat més gran que queda per tapar (vegeu el
  [full de ruta](FULL-DE-RUTA.md)); mentrestant, ho expliquen els fets i els conflictes.
- **Sense microestats.** Andorra, Liechtenstein, Mònaco, San Marino i el Vaticà no són a CShapes.
- **Criteris de sobirania.** Algunes decisions són de la llista de Gleditsch i Ward: Montenegro és
  part de Iugoslàvia del 1918 al 2006, i l'Alemanya Occidental comença el 1945, amb les zones
  d'ocupació aliades.
- **S'acaba el 2019.** Es dona per fet que cap frontera reconeguda d'Europa ha canviat després;
  si en canvia alguna, s'afegirà a mà.
- **Geometria simplificada.** Per veure el continent n'hi ha prou; per mesurar distàncies o
  superfícies, no.

---

## 2. Les banderes: Wikimedia Commons

La cronologia —quina bandera feia servir cada estat i fins quan— és d'aquest projecte i viu a
`content/flags.yaml`. Les imatges són de [Wikimedia Commons](https://commons.wikimedia.org/): les
baixa `npm run data:flags`, o el workflow «Flags» de GitHub cada cop que el fitxer canvia.

- **Imatges lleugeres.** Es baixa el PNG de 330 px que renderitza Wikimedia, no l'SVG original:
  n'hi ha que passen del mega pels escuts detallats, i al mapa una bandera fa 14 px d'alçada. Les
  cent banderes fan menys d'un mega.
- **Llicències.** Quasi totes són de domini públic: una bandera no sol tenir drets d'autor, o ja
  han caducat. Alguns dibuixos d'escuts són CC BY-SA, i llavors l'app en cita l'autor sota la
  bandera. Totes queden apuntades a `public/flags/credits.json`.
- **Dates.** Les de l'adopció oficial, o la del primer ús si va ser abans.
- **Simplificacions**, marcades amb un comentari al YAML: falten algunes variants de poca durada
  (Albània del 1914 al 1946, Bulgària del 1946 al 1948 i del 1967 al 1971, Hongria del 1918 al
  1919 i del 1956 al 1957, el lleó vermell de Finlàndia del 1917 al 1918). Les colònies, els
  protectorats i els mandats encara no en porten cap. L'Alemanya ocupada (1945-1949) surt sense
  bandera pròpia, perquè no en tenia.
- **Les banderes de règims com el nazi o el soviètic** s'ensenyen en el seu context històric i
  amb finalitat educativa.

## 3. Els textos

Els fets i els conflictes de `content/` els escriuen els qui hi contribueixen, amb llicència
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Tot el que s'hi diu s'ha de poder
comprovar: cada entrada enllaça com a mínim una font (la Viquipèdia val per començar). Com
s'escriuen és a [CONTRIBUTING.md](CONTRIBUTING.md).
