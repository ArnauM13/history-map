# Les dades — d'on surten, amb quina llicència i on fallen

**Català** · [Castellano](DADES.es.md) · [English](DADES.en.md)

El mapa barreja dades de llocs diferents, i cadascuna té la seva llicència. **Si en reaprofites
alguna cosa, mira la llicència d'aquella part.**

| Què | D'on surt | Llicència |
| --- | --- | --- |
| El codi (`src/`, `scripts/`…) | Aquest projecte | MIT |
| Els textos (`content/`) | Qui hi contribueix | CC BY-SA 4.0 |
| Les fronteres (`public/data/`) | CShapes 2.0, retallat i simplificat aquí | CC BY-NC-SA 4.0 |
| Les fronteres d'abans del 1886 (`public/data/history/`) | Cliopatria, retallat, simplificat i corregit aquí (§1.4) | CC BY 4.0 |
| Les zones d'ocupació (`public/data/occupations.geojson`) | CShapes 2.0, [Natural Earth](https://www.naturalearthdata.com/) i línies dibuixades aquí (§1.3) | CC BY-NC-SA 4.0 |
| Les banderes (`public/flags/`) | Wikimedia Commons | La de cada imatge (§2) |
| Les lletres del mapa (`public/fonts/`) | Open Sans, de [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0 |
| La lletra de la interfície | Roboto ([Fontsource](https://fontsource.org/)) | OFL 1.1 |
| Les icones | [Material Symbols](https://fonts.google.com/icons) | Apache 2.0 |

---

## 0. D'on surt cada dada

Tot el que ensenya el mapa té una font, i la fitxa on surt la cita amb un enllaç.

| Què es veu | D'on surt | On es cita |
| --- | --- | --- |
| Les fronteres i les capitals | CShapes 2.0 (§1) | A la fitxa de cada estat |
| Les fronteres d'abans del 1886 | Cliopatria (§1.4) | A la fitxa de cada estat |
| El nom de cada estat en cada època | L'article de la Viquipèdia sobre l'estat amb aquell nom (`wiki` a `content/countries.yaml`) | A la fitxa de l'estat |
| El nom de cada entitat d'abans del 1886 | El títol de l'article de la Viquipèdia que en cita Cliopatria, en català i castellà, o `content/countries.yaml` pel QID (§1.4) | A la fitxa de l'estat |
| Les dates de les banderes | Els articles de la Viquipèdia sobre les banderes de cada estat (`sources` a `content/flags.yaml`) | A la fitxa de l'estat |
| Les imatges de les banderes | Wikimedia Commons (§2, `public/flags/credits.json`) | Sota cada bandera |
| Les zones ocupades i annexionades (1938-1945) | Fronteres de CShapes d'altres dates, divisions d'avui de Natural Earth i línies dibuixades a mà (§1.3); les dates, de l'article de la Viquipèdia de cada zona (`content/occupations/`) | A la fitxa de cada zona |
| Els textos de les banderes, els fets, els conflictes i les ocupacions | Escrits per aquest projecte a partir de les fonts que citen (§3) | A la fitxa de cada un |
| Els títols de la Viquipèdia en català i castellà | Els enllaços entre idiomes de la mateixa Viquipèdia (`content/wikipedia.json`) | — |
| La traducció dels noms dels estats i de les capitals | Aquest projecte | — |

**Com es comprova.** `npm run data:sources` mira que cada article citat existeixi a la Viquipèdia
i que cada enllaç extern respongui. El workflow «Fonts» el corre quan canvia el contingut i cada
dilluns, i falla si en troba un de trencat. Els tests, per la seva banda, no deixen entrar cap fet,
cap conflicte, cap ocupació, cap nom d'estat ni cap bandera sense font.

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
- **Què se'n fa** (`npm run data:borders`): s'agafa sencer, del 1886 ençà; es retalla a
  `[-28°, 30°, 78°, 82°]`, se simplifica fins al 12 % dels vèrtexs, les dates passen a enters i es
  calculen els colors i on va cada nom. Dos veïns no comparteixen mai color; a més, els dotze
  colors es reparteixen, i un ocupant no fa servir el de l'estat ocupat, perquè la zona es
  distingeixi.

Els estats s'identifiquen amb els **codis de Gleditsch i Ward** (`code`), els mateixos de
CShapes i de bona part de la ciència política (les dades de conflictes de l'UCDP, per exemple). Els
fets, els conflictes, els noms i les banderes hi fan referència amb aquests codis. Les entitats
d'abans del 1886 que no continuen cap estat de CShapes porten el QID de Wikidata (`Q207162`) com a
codi (§1.4). Els noms dels
estats i de les capitals de CShapes són en anglès; els de l'app surten de `content/countries.yaml`
i `content/capitals.yaml`, en els tres idiomes.

### 1.1 On ens en separem

| Què | Per què |
| --- | --- |
| Crimea segueix a Ucraïna després del 18 de març del 2014 | CShapes la passa a Rússia. Aquí es dibuixa la frontera reconeguda internacionalment, com fan la resolució 68/262 de l'Assemblea General de l'ONU i la majoria d'atles. L'annexió s'explica com a fet, i anirà a la capa d'ocupacions. |

Cada correcció és codi, a la llista `CORRECTIONS` de `scripts/build-borders.mjs`, i té la seva fila
aquí. Els fitxers generats no es toquen mai a mà.

### 1.2 On fallen

- **Fronteres de tractat, no d'ocupació.** CShapes recull els canvis pactats —l'acord de Munic, el
  primer arbitratge de Viena (1938), les annexions soviètiques del 1940— però no el territori pres
  per la força, ni el segon arbitratge de Viena (1940), que va donar el nord de Transsilvània a
  Hongria. Entre el 1938 i el 1945, Àustria, Bohèmia-Moràvia i Polònia hi segueixen sortint. Ho
  explica la capa d'ocupacions (§1.3).
- **Dàntzig** surt dins d'Alemanya des del 30 de setembre del 1938. Va ser ciutat lliure fins a
  l'1 de setembre del 1939, quan el Reich se la va annexionar.
- **La frontera italiana del 1920 al 1947.** L'Ístria, Fiume, el Litoral eslovè amb Postojna i
  les illes de Cres i Lošinj hi surten dins de Iugoslàvia, i el Dodecanès, dins de Grècia, quan
  eren italians. La capa d'ocupacions no els compta al repartiment de Iugoslàvia del 1941; corregir
  les fronteres és al [full de ruta](FULL-DE-RUTA.md), §3.
- **Sense microestats.** Andorra, Liechtenstein, Mònaco, San Marino i el Vaticà no són a CShapes.
- **Criteris de sobirania.** Algunes decisions són de la llista de Gleditsch i Ward: Montenegro és
  part de Iugoslàvia del 1918 al 2006, i l'Alemanya Occidental comença el 1945, amb les zones
  d'ocupació aliades.
- **S'acaba el 2019.** Es dona per fet que cap frontera reconeguda d'Europa ha canviat després;
  si en canvia alguna, s'afegirà a mà.
- **Geometria simplificada.** Per veure el continent n'hi ha prou; per mesurar distàncies o
  superfícies, no.

### 1.3 La capa d'ocupacions

El que es controlava de fet entre el 1938 i el 1945 va en una capa a part, que es pot amagar i
que pinta cada zona del color de l'estat que la controlava, amb el nom, qui la controlava i per
què. Cada zona té un fitxer a `content/occupations/`, amb el text, les dates, qui la controlava,
per què (`cause`, un fet amb l'any, tret del text de la zona) i la font, i una forma que fa
`npm run data:occupations` (`scripts/build-occupations.mjs`).

**Les dates.** Una zona comença el dia que l'ocupant en pren el control —la capitulació,
l'armistici, l'annexió o la presa de la capital— i s'acaba el dia que el perd: la retirada, la
capitulació o l'alliberament de la capital. Mentre es lluitava, el que surt al mapa és el
conflicte, no la zona; els fronts no s'hi dibuixen. A les zones grans, la capital marca totes dues
dates encara que una part canviés de mans abans o després: Ucraïna ocupada va de la presa de Kíiv,
el setembre del 1941, al seu alliberament, el novembre del 1943, tot i que l'oest no es va
alliberar fins al 1944.

**La forma** es fa amb peces que ja existeixen, perquè les vores coincideixin amb les del mapa:

| D'on | Per a què | Exemple |
| --- | --- | --- |
| Un estat de CShapes, de la mateixa època o d'una altra | La majoria de les zones | Àustria és l'Àustria del 1938; Bohèmia i Moràvia, la Txecoslovàquia del 1939 dins de la Txèquia d'avui |
| Les divisions administratives d'avui, de [Natural Earth](https://www.naturalearthdata.com/) (domini públic) | Les vores que seguien una divisió que encara existeix | Alsàcia i Mosel·la són tres departaments; la República Social Italiana, les províncies del nord d'Itàlia; Kosovo, repartit per municipis |
| Línies dibuixades a mà (`LINES` a l'script), amb la font al costat | On no hi ha res més | La partició de Polònia, la línia de demarcació francesa, el segon arbitratge de Viena, Transnístria |

Les línies dibuixades a mà són **aproximades**, amb un error d'uns 10-20 km; les divisions d'avui,
tant com s'hagin mogut des d'aleshores. La fitxa de cada zona ho diu, i cita Natural Earth si se'n
fan servir les divisions. Un test comprova que dues zones de les mateixes dates no es trepitgin.

**Què hi ha**, en 57 zones:

- **L'oest i el centre**: l'expansió alemanya del 1938-1939 (Àustria, Bohèmia i Moràvia, l'Estat
  Eslovac, Memel), Zaolzie i la Rutènia hongaresa; la partició de Polònia; l'ocupació de
  Dinamarca, Noruega, els Països Baixos, Bèlgica, Eupen-Malmedy, Luxemburg i les illes del Canal,
  i la de França: la zona ocupada, la de Vichy, Alsàcia i Mosel·la, les zones del 1942 i Còrsega.
- **Els Balcans**: Albània; el repartiment de Iugoslàvia (l'Estat Independent de Croàcia, Sèrbia,
  l'Eslovènia alemanya i la italiana, Dalmàcia, Montenegro, Kosovo i l'oest de Macedònia units a
  Albània, la Macedònia búlgara, la Bačka i el Prekmurje hongaresos) i el de Grècia (les zones
  alemanya, italiana i búlgara, i Creta).
- **El Danubi i l'Est**: el nord de Transsilvània, Bessaràbia, el nord de Bucovina i Transnístria;
  els països bàltics, Bielorússia, Ucraïna i Crimea, ocupats del 1941 al 1944, i l'Hongria ocupada
  del 1944.
- **Itàlia del 1943 al 1945**: la República Social Italiana, Roma i la Itàlia central, i les dues
  zones d'operacions que Alemanya es va annexionar de fet.

**Què hi falta**:

- **La Rússia ocupada** del 1941 al 1943, de Smolensk al Caucas: va canviar de mans amb el front, i
  anirà amb la capa dels fronts.
- **Trossos petits de les annexions italianes del 1941**: el que es va afegir a la província de
  Fiume (Sušak, Kastav, Krk i Rab) i, des de la tardor, Hvar i Pag. Surten dins de Croàcia.

### 1.4 Abans del 1886: Cliopatria

[Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria), de la Seshat Global
History Databank, dibuixa les entitats polítiques del món del 3400 aC al 2024, cadascuna amb l'any
en què comença i en què s'acaba cada forma. El mapa en fa servir les d'Europa del 1500 al 1885.

> Seshat Global History Databank. Cliopatria, versió 0.2.1. _Scientific Data_ (2025).
> https://doi.org/10.1038/s41597-025-04516-9

- **Llicència**: CC BY 4.0. Els fitxers de `public/data/history/` en són una obra derivada amb la
  mateixa llicència.
- **Què se'n fa** (`npm run data:history`, després de `npm run data:borders`, que en dona els colors):
  - Se'n treuen les agrupacions (les files entre parèntesis, que repeteixen les peces d'altres), i es
    retalla i se simplifica com CShapes.
  - Cada entitat porta el seu QID de Wikidata. Si el 1885 ocupa el mateix lloc que un estat del
    1886 de CShapes, o és a la llista `SAME_STATE`, en pren el codi i el color: el Regne de França,
    la República i els dos Imperis són el 220, com la França de CShapes. La llista hi afegeix els
    predecessors que Gleditsch i Ward ja compten com el mateix estat (Prússia, el 255; el Regne de
    Sardenya, el 325) i els que n'eren el nucli (Anglaterra, el 200; la Monarquia dels Habsburg, el 300).
  - El nom és el títol, en català i castellà, de l'article de la Viquipèdia que cita Cliopatria
    (`content/wikipedia.json`). Quan no n'hi ha, o no és el de l'entitat, el posa
    `content/countries.yaml` pel QID.
  - Va en un fitxer per segle, i l'app només baixa el segle que mira: tots junts pesen deu vegades
    les fronteres de CShapes.

**La precisió.** Cliopatria mostreja el mapa cada pocs anys —cada any en els moments moguts, cada
deu o més en els tranquils— i cada forma val fins a la mostra següent. Per això les fronteres
canvien l'1 de gener i no el dia que va passar, i un canvi pot arribar un o dos anys tard. La fitxa
de cada estat ho diu, i la línia temporal ho marca amb una franja ratllada fins al 1886. On sabem el
dia, el nom sí que canvia el dia exacte (§1.4.1).

#### 1.4.1 On ens en separem

Les correccions són codi, a `scripts/build-history.mjs`: `CORRECTIONS` canvia de qui és una peça i
fins quan; `SHAPES` torna un territori a qui era, i només el pren de qui l'ocupava, perquè no toqui
els canvis de veritat dels veïns. Cada una porta la descripció i les dates al costat.

| Què | Per què |
| --- | --- |
| Prússia, del 1809 al 1867 | Cliopatria li posa el nom de la Confederació del Rin (1809-1814), on no va entrar mai, i el de la Confederació Germànica (1815-1867), que no era un estat. La seva fila «Kingdom of Prussia» no hi fa ni 2.000 km². |
| Ocupacions comptades com a sobirania | Cliopatria dibuixa el control militar com si fos una annexió, i la mostra l'allarga. Tornen a qui eren: Viena, otomana el 1529-1533 i el 1683-1686 per dos setges que van fracassar; Moscou i Lituània, franceses el 1812-1813 per sis mesos de campanya; Viena (1805, 1809), Prússia i Varsòvia (1807-1808) i Espanya (1809-1811), franceses; París, alemany el 1870-1872; Barcelona, anglesa el 1706-1712; Saxònia, sueca i prussiana a les guerres dels Trenta Anys i dels Set Anys, i prussiana el 1815-1819 i el 1866; Bohèmia, prussiana el 1744 i el 1866; Brandenburg, sueca el 1632-1647; Llombardia, sarda el 1848. |
| Monarquies compostes | L'Àustria i la Bohèmia de Ferran I hi surten com a part d'Espanya (1529-1555); la Saxònia de l'elector que era rei de Polònia, com a Polònia (1700-1756); la Toscana dels Habsburg-Lorena, com a Àustria; Hannover, com a britànic o prussià. Eren estats a part. |
| Escòcia | Regne a part fins a l'1 de maig del 1707, menys durant el Commonwealth de Cromwell. Cliopatria la fa anglesa des del 1609 i la deixa en blanc del 1640 al 1652. |
| Revoltes de pocs mesos | L'Estat Hongarès (14 d'abril - 13 d'agost del 1849), la República de Baden (1 de juny - 23 de juliol del 1849), la Sicília del 1848 i el govern de l'Aixecament de Novembre (29 de novembre del 1830 - 21 d'octubre del 1831), amb les seves dates; la mostra els allargava fins a tres anys. Les revoltes de Nalivaiko i dels hugonots, dins del seu estat. |
| El dia del canvi de règim | França (1792, 1795, 1799, 1804, 1814, 1830, 1848, 1852, 1870), Espanya (1873, 1874), la Gran Bretanya (1707) i el Regne Unit (1801), Dinamarca i Noruega (1814), Suècia (1721), Prússia (1701), Àustria-Hongria (1867), Itàlia (1861), la Itàlia napoleònica (1805), Nàpols (1806), la Toscana (1569), Grècia (1832), Sèrbia (1882) i Romania (1862, 1881). |
| Noms i articles equivocats | «Serbs», el poble, per al Principat de Sèrbia; el comtat d'Urgell per Andorra; un «Regne de Mònaco»; els QID i els articles de la Catalunya d'avui per a la República Catalana del 1641, i de la Itàlia d'avui per a la República Italiana del 1802; l'Egipte del 1885, enllaçat a la «Cursa per l'Àfrica»; la Confederació Livoniana, a l'idioma livonià. |
| França el 1814 | Cliopatria dona 100.000 km² del voltant de París al Gran Ducat de Berg, que en feia 15.000, al Rin. |

#### 1.4.2 On fallen

- **D'any en any.** Vegeu «La precisió», a dalt.
- **Més control de fet.** Queden ocupacions que Cliopatria compta com a sobirania: les de Suècia a
  l'Alemanya del sud a la guerra dels Trenta Anys, les russes de Valàquia i Moldàvia, l'Hamburg
  francès des del 1806.
- **Estats petits d'Alemanya i d'Itàlia.** Els del Sacre Imperi van junts, amb el nom de l'Imperi,
  també els d'Itàlia fins al 1740. Alguns porten el d'un veí: Frankfurt hi surt dins de Berg i de
  Würzburg (1807-1819), Parma dins de Mòdena (1815-1847) i Lucca dins de la Toscana.
- **Vores menys fines** que les de CShapes, i amb un salt petit l'1 de gener del 1886, quan comencen
  les de CShapes. Ginebra, que era independent i és suïssa des del 1815, hi cau a l'altra banda de
  la frontera.
- **Forats.** Del 1659 al 1661, Kíiv no és de ningú.
- **Sense banderes.** Comencen el 1886: les d'abans encara no estan documentades.

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
comprovar: cada entrada enllaça com a mínim una font (la Viquipèdia val per començar). Una font que no és
la Viquipèdia va a `sources`, amb el títol, qui la publica i l'enllaç (la resolució de l'ONU sobre
Crimea, per exemple). Com s'escriuen els textos és a [CONTRIBUTING.md](CONTRIBUTING.md).
