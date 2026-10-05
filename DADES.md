# Les dades — d'on surten, amb quina llicència i on fallen

**Català** · [Castellano](DADES.es.md) · [English](DADES.en.md)

El mapa barreja dades de llocs diferents, i cadascuna té la seva llicència. **Si en reaprofites
alguna cosa, mira la llicència d'aquella part.**

| Què | D'on surt | Llicència |
| --- | --- | --- |
| El codi (`src/`, `scripts/`…) | Aquest projecte | MIT |
| Els textos (`content/`) | Qui hi contribueix | CC BY-SA 4.0 |
| Les fronteres (`public/data/`) | CShapes 2.0, retallat i simplificat aquí | CC BY-NC-SA 4.0 |
| Les fronteres d'abans del 1886 (`public/data/history/`) | Cliopatria i, del 1815 al 1870 a l'Europa central, OpenHistoricalMap, retallats, simplificats i corregits aquí (§1.4, §1.5) | CC BY 4.0 |
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
| Les fronteres d'abans del 1886 | Cliopatria (§1.4) i OpenHistoricalMap (§1.5) | A la fitxa de cada estat |
| El nom de cada estat en cada època | L'article de la Viquipèdia sobre l'estat amb aquell nom (`wiki` a `content/countries.yaml`) | A la fitxa de l'estat |
| El nom de cada entitat d'abans del 1886 | El títol de l'article de la Viquipèdia que en cita Cliopatria, en català i castellà, o `content/countries.yaml` pel QID (§1.4) | A la fitxa de l'estat |
| Les dates de les banderes | Els articles de la Viquipèdia sobre les banderes de cada estat (`sources` a `content/flags.yaml`) | A la fitxa de l'estat |
| Les imatges de les banderes | Wikimedia Commons (§2, `public/flags/credits.json`) | Sota cada bandera |
| Les zones ocupades i annexionades (1938-1945 i, a l'Orient Pròxim, des del 1967) | Fronteres de CShapes d'altres dates, divisions d'avui de Natural Earth i línies dibuixades a mà (§1.3); les dates, de l'article de la Viquipèdia de cada zona (`content/occupations/`) | A la fitxa de cada zona |
| Els textos de les banderes, els fets, els conflictes i les ocupacions | Escrits per aquest projecte a partir de les fonts que citen (§3) | A la fitxa de cada un |
| Els títols de la Viquipèdia en català i castellà | Els enllaços entre idiomes de la mateixa Viquipèdia (`content/wikipedia.json`) | — |
| La traducció dels noms dels estats i de les capitals | Aquest projecte | — |

**Com es comprova.** `npm run data:sources` mira que cada article citat existeixi a la Viquipèdia
i que cada enllaç extern respongui. El workflow «Fonts» el corre quan canvia el contingut i cada
dilluns, i falla si en troba un de trencat. Els tests, per la seva banda, no deixen entrar cap fet,
cap conflicte, cap ocupació, cap nom d'estat ni cap bandera sense font.

### 0.1 Quan les fonts no coincideixen

El mapa vol ser una referència. Quan dues fonts diuen coses diferents —una data, un nom, una
frontera—, s'investiga per què, a la Viquipèdia i a les fonts que cita, al text dels tractats i a
historiografia de referència, i se'n treu un criteri que val per a tots els casos iguals. Els
criteris d'ara:

| Quan | Criteri | Exemple |
| --- | --- | --- |
| Una font dona a un estat el territori que un altre ocupava en una guerra | El mapa dibuixa la **sobirania**: el territori és de qui el tenia fins que un tractat o una annexió formal el canvia de mans. Les ocupacions llargues del segle XX van a la capa d'ocupacions (§1.3). | Moscou el 1812 és russa; Hamburg és francesa des de l'annexió del 1811, no des de l'ocupació del 1806. |
| Les fonts posen el canvi en dates diferents | El **dia que té efecte**: la proclamació o l'abdicació, per a un canvi de règim; el tractat, per a una cessió, el dia que es va signar encara que entrés en vigor més tard, si no fixa un altre dia per al traspàs; el decret, per a una annexió. Al calendari gregorià. | La Segona República francesa, del 24 de febrer del 1848 al 2 de desembre del 1852; l'Ístria, italiana des que es va signar el tractat de Rapallo (12 de novembre del 1920), no des de la ratificació. |
| Dos estats tenen el mateix sobirà | **Estats separats** mentre mantenen institucions pròpies; un de sol quan s'uneixen per llei. | Saxònia i Polònia (1697-1763), Hannover i la Gran Bretanya (1714-1837) i Escòcia i Anglaterra (1603-1707), separats; la Gran Bretanya des del 1707. |
| Un estat paga tribut o és vassall d'un altre | **Estat propi**, si es governava sol. | Valàquia i Moldàvia, sota l'Imperi Otomà. |
| Una revolta | Al mapa, només si va tenir **un govern sobre el territori**, i amb les dates d'aquest govern. | L'Estat Hongarès, del 14 d'abril al 13 d'agost del 1849; la revolta de Nalivaiko, dins de la República de les Dues Nacions. |
| Un territori es deslliura abans de la pau | Torna al seu govern **el dia que es restaura**; si l'ocupant no se'n va, segueix sent seu fins al tractat. | Ginebra, república des del 31 de desembre del 1813; Hamburg, francesa fins al tractat de París (30 de maig del 1814), perquè Davout no la va deixar. |
| Un territori cedit que encara no té amo | El **govern provisional** que el governava, si n'hi ha. | Bèlgica, del tractat de París al Congrés de Viena: el Govern General dels aliats, no França ni els Països Baixos. |
| Una annexió per la força, després del 1945, que l'ONU declara nul·la | **No canvia la sobirania**: el territori continua sent de qui era, i l'annexió va a la capa d'ocupacions. La Carta de l'ONU prohibeix guanyar territori per la força, i la resolució 242 ho repeteix per al 1967. | Jerusalem Est (1980), el Golan (1981) i Crimea (2014). |
| Un territori ocupat que no era de cap altre estat | **Peça pròpia**, amb el seu nom i l'estatus de territori ocupat; l'ocupant, a la capa d'ocupacions. | Cisjordània i Gaza des del 1967, i des del 15 de novembre del 1988 amb el nom de Palestina, l'estat que s'hi va proclamar i que reconeixen 157 dels 193 membres de l'ONU. |
| El nom | El que tenia l'estat **aleshores**, com l'anomena la Viquipèdia de cada idioma. | El 1700, el Regne de França; el 1810, el Primer Imperi Francès. |

Si la discrepància té importància històrica (una frontera en disputa, una data que cada
historiografia posa diferent, una sobirania que depèn de qui la reconeixia), també es documenta, aquí
i a la fitxa si el lector l'ha de saber. Les correccions que en surten són a §1.1 i §1.4.1.

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
| Dàntzig, Ciutat Lliure fins a l'1 de setembre del 1939 | CShapes l'acaba el 31 d'agost del 1938 i la posa dins d'Alemanya des del 30 de setembre del 1938: durant un mes no és de ningú. És una errada d'un any; el Reich se la va annexionar l'1 de setembre del 1939. |
| La frontera de Rapallo, del 12 de novembre del 1920 al 10 de febrer del 1947 | CShapes dona a Iugoslàvia el que el tractat de Rapallo va donar a Itàlia: el Litoral eslovè amb Idrija i Postojna, l'Ístria, Zara, Cres i Lošinj. Torna a ser italià fins al tractat de París. La línia, de Peč a Triglav, Snežnik i el golf de Kvarner, és dibuixada a mà a partir de l'article sobre el tractat (uns 2-5 km d'error). |
| L'Estat Lliure de Fiume (1920-1924) i Fiume italiana (1924-1947) | CShapes no té l'estat lliure que va crear Rapallo, i el posa dins de Iugoslàvia. Aquí és un estat (amb el QID de Wikidata com a codi) fins al 22 de febrer del 1924, el decret d'annexió a Itàlia, i després italià. Sušak, a l'altra riba del Rječina, segueix iugoslava. |
| El Dodecanès, otomà fins al 24 de juliol del 1923 i italià fins al 10 de febrer del 1947 | CShapes el fa grec des del 1913. Itàlia l'ocupava des del 1912, però Turquia no hi va renunciar fins al tractat de Lausana; el tractat de París el va cedir a Grècia. |
| Israel, des del 10 de juny del 1967, dins de la Línia Verda | CShapes hi suma Cisjordània, Jerusalem Est, Gaza, el Golan i el Sinaí, que Israel va ocupar a la guerra dels Sis Dies, i el Sinaí no el torna a Egipte fins al 1979. Aquí Israel queda dins de la línia dels armisticis del 1949, com la dibuixen l'ONU (resolucions 242 i 2334) i el Tribunal Internacional de Justícia (2004 i 2024); el Golan és de Síria i el Sinaí, d'Egipte. El control israelià va a la capa d'ocupacions (§1.3). |
| Cisjordània i Gaza continuen després del 1967 | CShapes les fa desaparèixer dins d'Israel. Aquí continuen amb la forma del 1967, com a territori ocupat i sense dependre de cap estat: fins al 1988, amb el nom de Cisjordània i de Franja de Gaza; des del 15 de novembre del 1988, el de Palestina. Jordània s'havia annexionat Cisjordània el 1950, però gairebé ningú ho va reconèixer, i hi va renunciar el 31 de juliol del 1988. |

**Les dates, quan les fonts discrepen** (§0.1: una cessió va el dia que es va signar):

- **Rapallo** es va signar el 12 de novembre del 1920; Itàlia el va aprovar per la llei del 19 de
  desembre, i els nous límits van entrar en vigor el gener del 1921.
- **Fiume.** El tractat de Roma és del 27 de gener del 1924, i la ratificació i el decret d'annexió,
  del 22 de febrer. El 16 de març, la data que donen molts llibres, el rei la va visitar per
  proclamar l'annexió: una cerimònia, no el canvi.
- **Lausana** es va signar el 24 de juliol del 1923 i va entrar en vigor el 6 d'agost del 1924.
- **París** es va signar el 10 de febrer del 1947 i va entrar en vigor el 15 de setembre: és quan
  Iugoslàvia va rebre Pola i va néixer el Territori Lliure de Trieste. Grècia va administrar el
  Dodecanès des del 31 de març del 1947 i se'l va annexionar formalment el 7 de març del 1948.

Cada correcció és codi, a la llista `CORRECTIONS` de `scripts/build-borders.mjs`, i té la seva fila
aquí. Les vores noves es fan després de simplificar, amb les peces de CShapes, perquè coincideixin
amb les dels veïns i la simplificació no se'n mengi els detalls (abans, el centre de Fiume queia a
Iugoslàvia i Kastav a Itàlia); un test comprova on cau cada lloc corregit, any per any. Els
fitxers generats no es toquen mai a mà.

### 1.2 On fallen

- **Fronteres de tractat, no d'ocupació.** CShapes recull els canvis pactats —l'acord de Munic, el
  primer arbitratge de Viena (1938), les annexions soviètiques del 1940— però no el territori pres
  per la força, ni el segon arbitratge de Viena (1940), que va donar el nord de Transsilvània a
  Hongria. Entre el 1938 i el 1945, Àustria, Bohèmia-Moràvia i Polònia hi segueixen sortint. Ho
  explica la capa d'ocupacions (§1.3).
- **L'Adriàtic, encara a mitges** (§1.1 en corregeix la frontera italiana). Del 1919 al 1920,
  quan l'Ístria i Fiume eren ocupades per Itàlia i encara no s'havia pactat la frontera, CShapes
  les dona a Iugoslàvia, i aquí es deixa així; tampoc no hi ha la Regència del Carnaro de
  D'Annunzio. Del 1947 al 1954, Trieste surt italiana i Koper iugoslava, sense el Territori Lliure
  de Trieste. Lastovo, Palagruža i Saseno, italianes del 1920 al 1947, i Kastellorizo, no són a
  CShapes; i la simplificació esborra gairebé totes les illes de l'Adriàtic, també Cres i Krk.
- **Sense microestats.** Andorra, Liechtenstein, Mònaco, San Marino i el Vaticà no són a CShapes.
- **Criteris de sobirania.** Algunes decisions són de la llista de Gleditsch i Ward: Montenegro és
  part de Iugoslàvia del 1918 al 2006, i l'Alemanya Occidental comença el 1945, amb les zones
  d'ocupació aliades.
- **S'acaba el 2019.** Es dona per fet que cap frontera reconeguda d'Europa ha canviat després;
  si en canvia alguna, s'afegirà a mà.
- **Geometria simplificada.** Per veure el continent n'hi ha prou; per mesurar distàncies o
  superfícies, no. Gaza i Cisjordània no se simplifiquen: al 12 %, Gaza quedava en un triangle
  que deixava la ciutat de Gaza a Israel.
- **La Línia Verda, a uns quants quilòmetres.** CShapes la dibuixa amb pocs punts, i Qalqilya i
  Tulkarem, que toquen la línia, hi queden a la banda israeliana. Natural Earth la té més ben
  dibuixada, però hi posa Jerusalem Est dins d'Israel. Corregir-la és al
  [full de ruta](FULL-DE-RUTA.md), §3.

### 1.3 La capa d'ocupacions

El que es controlava de fet en les ocupacions llargues —entre el 1938 i el 1945, i els territoris
que ocupa Israel des del 1967— va en una capa a part, que es pot amagar i
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

**Què hi ha**, en 63 zones:

- **L'oest i el centre**: l'expansió alemanya del 1938-1939 (Àustria, Bohèmia i Moràvia, l'Estat
  Eslovac, Memel), Zaolzie i la Rutènia hongaresa; la partició de Polònia; l'ocupació de
  Dinamarca, Noruega, els Països Baixos, Bèlgica, Eupen-Malmedy, Luxemburg i les illes del Canal,
  i la de França: la zona ocupada, la de Vichy, Alsàcia i Mosel·la, les zones del 1942 i Còrsega.
- **Els Balcans**: Albània; el repartiment de Iugoslàvia (l'Estat Independent de Croàcia, Sèrbia,
  l'Eslovènia alemanya i la italiana, Dalmàcia, el que es va afegir a la província de Fiume
  —Sušak, Kastav, Krk i Rab—, Pag, Brač i Hvar, ocupades per Itàlia des del 7 de setembre del
  1941, Montenegro, Kosovo i l'oest de Macedònia units a Albània, la Macedònia búlgara, la Bačka i
  el Prekmurje hongaresos) i el de Grècia (les zones alemanya, italiana i búlgara, i Creta). El que
  ja era italià des del 1920 no hi entra: és a les fronteres (§1.1).
- **El Danubi i l'Est**: el nord de Transsilvània, Bessaràbia, el nord de Bucovina i Transnístria;
  els països bàltics, Bielorússia, Ucraïna i Crimea, ocupats del 1941 al 1944, i l'Hongria ocupada
  del 1944.
- **Itàlia del 1943 al 1945**: la República Social Italiana, Roma i la Itàlia central, i les dues
  zones d'operacions que Alemanya es va annexionar de fet.
- **L'Orient Pròxim, des del 1967**: Cisjordània amb Jerusalem Est, la Franja de Gaza fins a la
  retirada israeliana del 12 de setembre del 2005, el Golan, annexionat el 1981, i el Sinaí fins a
  la guerra del Yom Kippur. Les dates, de l'article de la Viquipèdia de cada zona; les formes, de
  CShapes: Cisjordània i Gaza són les seves peces, i el Golan i el Sinaí, el que CShapes treu de
  Síria i d'Egipte el 1967.

**Què hi falta**:

- **La Rússia ocupada** del 1941 al 1943, de Smolensk al Caucas: va canviar de mans amb el front, i
  anirà amb la capa dels fronts.
- **La resta de la Zona II**: el 7 de setembre del 1941 Itàlia va prendre el govern de tota la
  franja de la costa croata, no només de Pag, Brač i Hvar. La franja de terra encara surt dins de
  Croàcia.
- **El Dodecanès alemany** del 1943 al 1945, i Zara, que després de l'armistici va quedar sota
  protecció alemanya fins a l'octubre del 1944.
- **El Sinaí del 1973 al 1982.** Egipte va recuperar la riba oriental del canal a la guerra del
  Yom Kippur, i Israel es va retirar de la resta per etapes (1974, 1975, 1979-1980) fins al 25
  d'abril del 1982. Calen les línies de cada acord; fins aleshores, el Sinaí surt egipci sense
  ocupació.
- **Gaza després del 2005.** Sense soldats a dins, la zona s'acaba, però l'ONU i el Tribunal
  Internacional de Justícia la consideren encara ocupada, perquè Israel en controla les
  fronteres, l'espai aeri i el mar: per això la peça de Gaza continua sent un territori ocupat.
  La part que ocupa l'exèrcit israelià des de la guerra del 2023 tampoc no hi és: el front es
  mou i no hi ha cap línia pactada amb una font fiable.
- **Les àrees A i B de Cisjordània** (acords d'Oslo, 1995), que governa l'Autoritat Nacional
  Palestina: són desenes de taques, i Israel hi entra quan vol; Cisjordània surt sencera com a
  ocupada, com la tracta l'ONU.
- **Les ocupacions israelianes curtes o fora del mapa**: el Sinaí i Gaza del 1956 al 1957, el
  sud del Líban del 1982 al 2000 i la zona d'amortiment del Golan, que Israel va ocupar el
  desembre del 2024.

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

Les correccions són codi, a `scripts/build-history.mjs`, i segueixen els criteris de §0.1:
`CORRECTIONS` canvia de qui és una peça i fins quan; `SHAPES` torna un territori a qui era, i només
el pren de qui l'ocupava, perquè no toqui els canvis de veritat dels veïns; `TRANSITIONS` posa el
canvi dels tractats grans el dia que es van signar. Cada una porta la descripció i les dates al
costat, comprovades a la Viquipèdia. On Cliopatria no té la forma bona (les ciutats lliures,
Ginebra, els enclavaments de Gdańsk i Toruń), `SHAPES` la pren d'OpenHistoricalMap (`OHM_SHAPES`)
i, per a la Catalunya que França es va annexionar el 1812, de les províncies de Natural Earth.

Les ocupacions s'han buscat peça a peça: un script recorre una graella de punts cada mig grau i
apunta on un territori canvia de mans i torna a qui el tenia en menys de vuit anys. Cada cas s'ha
mirat a la Viquipèdia; els que eren control militar tornen a qui eren, i els que eren una cessió de
veritat (Podòlia, el 1672) es queden.

| Què | Per què |
| --- | --- |
| Prússia, del 1809 al 1867 | Cliopatria li posa el nom de la Confederació del Rin (1809-1814), on no va entrar mai, i el de la Confederació Germànica (1815-1867), que no era un estat. La seva fila «Kingdom of Prussia» no hi fa ni 2.000 km². |
| Ocupacions comptades com a sobirania | Cliopatria dibuixa el control militar com si fos una annexió, i la mostra l'allarga. Tornen a qui eren: Viena, otomana el 1529-1533 i el 1683-1686 per dos setges que van fracassar; Moscou i Lituània, franceses el 1812-1813 per sis mesos de campanya; Viena (1805, 1809), Prússia i Varsòvia (1807-1808) i Espanya (1809-1811), franceses; París, alemany el 1870-1872; Barcelona, anglesa el 1706-1712; Saxònia, sueca i prussiana a les guerres dels Trenta Anys i dels Set Anys, i prussiana el 1815-1819 i el 1866; Bohèmia, prussiana el 1744 i el 1866; Brandenburg, sueca el 1632-1647; Llombardia, sarda el 1848. |
| La guerra dels Trenta Anys | Magúncia, Frankfurt, Würzburg, Erfurt, Mecklenburg i Bremen-Verden hi surten suecs del 1632 al 1647, Hamburg danès del 1622 al 1628, i Mecklenburg, Hamburg i Lübeck dels Habsburg del 1629 al 1631. Suècia no en guanya res fins a Westfàlia (1648); el Mecklenburg de Wallenstein era un feu imperial. Tot torna al Sacre Imperi. |
| Valàquia i Moldàvia | Vassalls otomans, però estats propis (§0.1). Cliopatria les fa russes o austríaques a cada guerra (1769-1774, 1791, 1807-1812, 1828-1834, 1849-1856). Besaràbia és russa des del tractat de Bucarest, el 28 de maig del 1812, no des del 1807. |
| La revolta bohèmia | Del 23 de maig del 1618 (la defenestració de Praga) a la Muntanya Blanca, el 8 de novembre del 1620, Bohèmia es governa sola; Cliopatria la posa dins del «Sacre Imperi» fins al 1621. |
| Més ocupacions, buscades peça a peça | Smolensk, Vílnius i Kíiv, russos del 1654-1655 a la treva d'Andrusovo (9-2-1667), i la Livònia sueca, russa del 1656 al 1661; Rússia, amb unes quantes viles de la guerra de Smolensk (1632-1634) i amb la invasió sueca del 1708-1709; Finlàndia, russa del 1713 al 1721 (la Gran Ira); Holstein i Jutlàndia, dels Habsburg el 1627-1629; Silèsia, Bohèmia i Baviera, sueques a la guerra dels Trenta Anys; Utrecht, francesa el 1672-1673; Savoia i Niça, franceses el 1691-1696 i el 1702-1705; l'oest d'Espanya, portuguès el 1706-1708; Bohèmia i el sud d'Alemanya, francesos el 1741-1743; a la guerra dels Set Anys, Bohèmia prussiana, la Prússia Oriental i la Pomerània russes i Hessen i la Westfàlia franceses; el Budjak, rus el 1769-1774 i el 1791; la Baixa Baviera, austríaca el 1778-1779 (a Teschen, el 13 de maig del 1779, Àustria només es queda l'Innviertel); el sud-oest d'Alemanya, francès el 1796; Bulgària, russa el 1877-1879: otomana fins al tractat de Berlín (13-7-1878), i després el Principat de Bulgària i la Rumèlia Oriental. Menorca, espanyola des del 1783: la Gran Bretanya la va ocupar del 1798 al 1802, i Cliopatria la hi torna a posar del 1806 al 1819. |
| L'època napoleònica | Hannover, francès el 1803-1805; Portugal, francès el 1811; Espanya, francesa el 1812-1813, quan l'Imperi només es va annexionar Catalunya (26 de gener del 1812); la Pomerània sueca, francesa el 1812-1813; Cracòvia, del Gran Ducat de Varsòvia des de Schönbrunn (14-10-1809) i no el 1811; el Gran Ducat de Varsòvia, rus del 1813 al Congrés de Viena, quan va deixar d'existir; Hannover, Hessen-Kassel i Brunsvic, restaurats el 1813-1814 i que Cliopatria fa prussians fins al 1815. Bèlgica, del tractat de París (30 de maig del 1814) al Congrés de Viena, és del Govern General dels aliats (§0.1), no de França. Luxemburg i l'esquerra del Rin, no (§1.4.2). |
| Les ciutats lliures | Hamburg, Bremen i Lübeck, lliures del 1806 al 1810: França les ocupa, però no se les annexiona fins al 1811. Lliures de nou, Bremen i Lübeck, el 1813, i Hamburg, al tractat de París (30 de maig del 1814), perquè Davout la va defensar fins al final. Frankfurt, ciutat imperial fins al 1806, de Dalberg (principat i, des del 16 de febrer del 1810, gran ducat) fins al 1813, i lliure després. Bremen, ciutat imperial, mai sueca, danesa ni de Hannover, que en tenien el voltant. Cliopatria les dibuixa desplaçades (Bremen i Frankfurt, uns quilòmetres a l'oest) o confon Lübeck amb dos trossos de Mecklenburg: la forma és la d'OpenHistoricalMap del 1815. |
| Gdańsk i Toruń | Poloneses fins a la segona partició (23-1-1793): el 1772 Prússia es queda el voltant, però no les ciutats. La Ciutat Lliure de Dàntzig, del 21 de juliol del 1807 al 2 de gener del 1814, i amb el QID i l'article de la napoleònica, no de la del 1920. |
| Finlàndia | Russa des del tractat de Fredrikshamn (17 de setembre del 1809), no des del de Schönbrunn: la mateixa mostra de Cliopatria recull els dos canvis. |
| Ginebra | República del 1534 a l'annexió francesa (15 d'abril del 1798) i del 31 de desembre del 1813 al 19 de maig del 1815, quan entra a Suïssa. Cliopatria la posa dins de Savoia i, des del 1860, de França. |
| Encavalcaments | Cliopatria deixa el Piemont al Regne de Sardenya després de l'annexió francesa (11 de setembre del 1802), i Roma i el Laci als Estats Pontificis després de la del 17 de maig del 1809: les dues peces se sobreposaven. Wismar, que Suècia va empenyorar a Mecklenburg el 26 de juny del 1803, hi era sueca i de Mecklenburg alhora. |
| Monarquies compostes | L'Àustria i la Bohèmia de Ferran I hi surten com a part d'Espanya (1529-1555); la Saxònia de l'elector que era rei de Polònia, com a Polònia (1700-1756); la Toscana dels Habsburg-Lorena, com a Àustria; Hannover, com a britànic o prussià. Eren estats a part. |
| Escòcia | Regne a part fins a l'1 de maig del 1707, menys durant el Commonwealth de Cromwell. Cliopatria la fa anglesa des del 1609 i la deixa en blanc del 1640 al 1652. |
| Revoltes de pocs mesos | L'Estat Hongarès (14 d'abril - 13 d'agost del 1849), la República de Baden (1 de juny - 23 de juliol del 1849), la Sicília del 1848 i el govern de l'Aixecament de Novembre (29 de novembre del 1830 - 21 d'octubre del 1831), amb les seves dates; la mostra els allargava fins a tres anys. Les revoltes de Nalivaiko i dels hugonots, dins del seu estat. |
| Els tractats, el dia que es van signar | Westfàlia (24-10-1648), els Pirineus (7-11-1659), Utrecht (11-4-1713), Passarowitz (21-7-1718), Nystad (10-9-1721), Aquisgrà (18-10-1748), les particions de Polònia (5-8-1772, 23-1-1793 i 24-10-1795), Crimea (19-4-1783), Campo Formio (17-10-1797), Tilsit (9-7-1807), Schönbrunn (14-10-1809), Viena (9-6-1815), Bèlgica (4-10-1830), Zuric (10-11-1859), Torí (24-3-1860), Viena (30-10-1864), Praga (23-8-1866) i la Confederació d'Alemanya del Nord (1-7-1867); i, d'un en un, Andrusovo (9-2-1667), Fredrikshamn (17-9-1809) i Berlín (13-7-1878). Cliopatria els posa l'1 de gener de la mostra, i la segona i la tercera partició de Polònia, un any abans. Canvien el mateix dia tots els estats que s'intercanvien territori, també els de fora de la zona del tractat (el 1809, Suècia, que perd Finlàndia). |
| El dia del canvi de règim | França (1792, 1795, 1799, 1804, 1814, 1830, 1848, 1852, 1870), Espanya (1873, 1874), la Gran Bretanya (1707) i el Regne Unit (1801), Dinamarca i Noruega (1814), Suècia (1721), Prússia (1701), Àustria-Hongria (1867), Itàlia (1861), la Itàlia napoleònica (1805), Nàpols (1806), la Toscana (1569), Grècia (1832), Sèrbia (1882) i Romania (1862, 1881). |
| Noms i articles equivocats | «Serbs», el poble, per al Principat de Sèrbia; el comtat d'Urgell per Andorra; un «Regne de Mònaco»; els QID i els articles de la Catalunya d'avui per a la República Catalana del 1641, i de la Itàlia d'avui per a la República Italiana del 1802; l'Egipte del 1885, enllaçat a la «Cursa per l'Àfrica»; la Confederació Livoniana, a l'idioma livonià; la Ciutat Lliure de Dàntzig del 1920 per a la napoleònica; un «Regne de Hannover» el 1803, quan ho va ser des del 1814. |
| França el 1814 | Cliopatria dona 100.000 km² del voltant de París al Gran Ducat de Berg, que en feia 15.000, al Rin. |
| Alsàcia i Lorena | Franceses fins al tractat de Frankfurt (10 de maig del 1871), no fins a l'1 de gener. |

**Discrepàncies que ho són de veritat**, entre fonts fiables, i el criteri que se n'ha pres:

- **La tercera partició de Polònia.** Les tres potències s'hi posen d'acord el 24 d'octubre del 1795,
  i el tractat que la tanca és del 26 de gener del 1797. El mapa fa servir el 1795: és quan la
  República de les Dues Nacions deixa d'existir de fet, i el rei abdica un mes després.
- **L'Imperi Alemany.** Els tractats d'adhesió de Baviera, Württemberg, Baden i Hessen van entrar en
  vigor l'1 de gener del 1871; l'emperador es va proclamar el 18 de gener, i la constitució de
  l'Imperi és del 4 de maig, la data que fa servir OpenHistoricalMap. El mapa fa servir l'1 de
  gener, quan els estats del sud deixen de ser independents.
- **Kíiv del 1654 al 1667.** Hi ha una guarnició russa des del 1654, però la República de les Dues
  Nacions no el cedeix fins a la treva d'Andrusovo, i encara per dos anys: la pau perpètua del 1686
  ho fa definitiu. El mapa segueix la sobirania: polonès fins a Andrusovo, i rus des d'aleshores.
- **Bèlgica el 1815.** Guillem d'Orange s'hi proclama rei el 16 de març, i el Congrés de Viena la
  uneix als Països Baixos el 9 de juny. El mapa fa servir el 9 de juny, com per a la resta de
  canvis del Congrés.
- **Frankfurt del 1813 al 1815.** La Viquipèdia la fa lliure des del 1813; OpenHistoricalMap, des
  del 9 de juliol del 1815, quan torna la constitució d'abans de Napoleó. El mapa la fa lliure des
  de l'1 de gener del 1814, quan ja no hi ha gran duc.

#### 1.4.2 On fallen

- **D'any en any**, on no hi ha un tractat o un règim amb la data posada. Vegeu «La precisió», a dalt.
- **Més control de fet**, on no hi ha una forma bona per tornar el territori a qui era:
  - **Luxemburg i l'esquerra del Rin**, francesos fins al Congrés de Viena, quan des del tractat de
    París (30 de maig del 1814) eren dels governs provisionals dels aliats.
  - **Podòlia**, otomana del tractat de Buczacz (1672) al de Karlowitz (1699): Cliopatria només la
    fa otomana del 1673 al 1676.
  - **Sardenya i Sicília**, espanyoles del 1718 al 1720, quan Espanya les havia reconquerit però el
    tractat d'Utrecht les donava a Àustria i a Savoia.
  - **Polònia del 1706 al 1713**, amb el rei que va posar Suècia (Estanislau I) com si fos un altre
    estat.
  - **El Període Tumultuós** (1610-1618), amb l'oest de Rússia polonès; **el Piemont** del 1799,
    francès; **Lorena** al segle XVIII, entre França i el duc.
- **Estats petits fora del 1815-1870.** Els del Sacre Imperi van junts, amb el nom de l'Imperi,
  també els d'Itàlia fins al 1740. Les ciutats lliures sí que hi són (§1.4.1), però no la resta del
  Gran Ducat de Frankfurt (Aschaffenburg, Fulda, Hanau): hi surten Würzburg i Berg.
- **Vores menys fines** que les de CShapes, i amb un salt petit l'1 de gener del 1886, quan comencen
  les de CShapes.
- **Forats.** L'Hetmanat cosac, que governava la Ucraïna central des del 1648, no és a Cliopatria:
  del 1653 al 1661 aquella zona no és de ningú. L'estepa, al sud de Rússia, és en blanc fins que hi
  arriba l'Imperi Rus.
- **Peces que se sobreposen**, petites: Espanya i Nàpols a Sicília (1762), Espanya, Àustria i Savoia
  a Sardenya i Sicília (1721), el comtat de Foix i la casa de Borbó dins de França (1540-1563).
- **Sense banderes.** Comencen el 1886: les d'abans encara no estan documentades.

### 1.5 L'Europa central del 1815 al 1870: OpenHistoricalMap

Cliopatria no distingeix bé els estats petits de la Confederació Germànica: posa Kassel dins de
Hannover, Frankfurt dins de Hessen-Darmstadt, Magúncia dins de Frankfurt i Gotha dins de Prússia.
[OpenHistoricalMap](https://www.openhistoricalmap.org/) (OHM, domini públic CC0) els té tots, amb
el dia de cada canvi i el QID de Wikidata. Entre el 9 de juny del 1815 (el Congrés de Viena) i el 31
de desembre del 1870 (l'Imperi Alemany), allà on hi ha OHM mana OHM, i Cliopatria omple la resta.

- **Què se n'agafa**: els estats de la Confederació Germànica, Àustria i Prússia incloses, la
  Confederació d'Alemanya del Nord, els d'Itàlia, Liechtenstein, Luxemburg, Mònaco i San Marino, i
  els governs revolucionaris que van governar un territori (Milà i Venècia el 1848, Sicília el
  1848-1849, les Províncies Unides de la Itàlia Central, Garibaldi el 1860). Els veïns segueixen
  sent de Cliopatria: OHM hi té errors que Cliopatria no té.
- **On s'hi corregeix OHM**: la Prússia del 1829 al 1834 s'endinsa 13.000 km² a la Polònia russa.
  La frontera occidental de Rússia no es va moure del 1815 al 1914, i allà mana CShapes. A la vora
  de la Ciutat Lliure de Cracòvia li falten dos trams, un al nord i el del Vístula, que passa per la
  ciutat, i el centre en quedava fora: es cusen amb una recta (`OHM.repair`), amb un error d'un o
  dos quilòmetres.
- **Els noms**, de Wikidata (el nom anglès i l'article de la Viquipèdia), traduïts com els altres
  (§1.4), o de `content/countries.yaml`.
- **Es baixa un sol cop** (`npm run data:history`), a `data-raw/`: són uns quants centenars de MB.

On falla:

- **Turíngia abans del 1826.** OHM no té Saxònia-Gotha-Altenburg, Saxònia-Hildburghausen ni
  Saxònia-Coburg-Saalfeld abans de la reorganització del 12 de novembre del 1826. En comptes de
  posar-hi el que diu Cliopatria (Prússia, Baviera, Berg), el mapa diu el que se'n sap: **els
  ducats ernestins**, sense separar-los.

---

## 2. Les banderes: Wikimedia Commons

La cronologia —quina bandera feia servir cada estat i fins quan— és d'aquest projecte i viu a
`content/flags.yaml`. Les imatges són de [Wikimedia Commons](https://commons.wikimedia.org/): les
baixa `npm run data:flags`, o el workflow «Flags» de GitHub cada cop que el fitxer canvia.

- **Imatges lleugeres.** Es baixa el PNG de 330 px que renderitza Wikimedia, no l'SVG original:
  n'hi ha que passen del mega pels escuts detallats, i al mapa una bandera fa 14 px d'alçada. Les
  cent seixanta banderes fan un mega i mig.
- **Llicències.** Quasi totes són de domini públic: una bandera no sol tenir drets d'autor, o ja
  han caducat. Alguns dibuixos d'escuts són CC BY-SA, i llavors l'app en cita l'autor sota la
  bandera. Totes queden apuntades a `public/flags/credits.json`.
- **Dates.** Les de l'adopció oficial, o la del primer ús si va ser abans.
- **Quan les fonts no coincideixen**, es fa servir el dia que té efecte la llei, el decret o la
  constitució (§0.1), i el comentari del YAML diu quina altra data dona l'altra font. Les dates que
  no són a la Viquipèdia surten de [Flags of the World](https://www.fotw.info/), que cita els
  decrets. Els casos d'ara:
  - **Finlàndia**: la creu blava, des de la llei del 29 de maig del 1918 (la Viquipèdia diu el 28,
    el dia que la va votar el Parlament). El lleó vermell, des que es va hissar per primer cop, el
    28 de desembre del 1917.
  - **Bulgària**: el decret del 27 de gener del 1948 va aprovar el primer escut comunista; la
    Viquipèdia el fa servir com a data del segon, i Flags of the World diu que el primer va durar
    dos mesos més, sense dia. Es pren el decret. El canvi del 1967 és del decret del 7 de desembre
    (la Viquipèdia diu el 5 de gener, sense font).
  - **Albània**: la bandera del regne, des de l'Estatut de l'1 de desembre del 1928 (Flags of the
    World diu el 22 de novembre, i el dibuix el va fixar un decret de l'agost del 1929). Commons en
    té una versió del 1928 al 1934 sense el casc d'Skanderbeg que Flags of the World no recull: el
    1934 només es va aclarir el vermell, i el mapa fa servir la del casc per a tot el regne. Del
    26 de juliol al 7 de setembre del 1943 no se sap quina bandera feia servir l'Estat, i hi ha un
    buit.
  - **Hongria**: l'escut de Kossuth torna a la bandera amb la revolució, el 23 d'octubre del 1956
    (Commons diu que oficialment, el 12 de novembre). La bandera amb el forat no va ser mai
    oficial.
  - **La Xina**: la bandera del Kuomintang, des que la Manxúria s'adhereix al govern de Nanquín (el
    29 de desembre del 1928), que la feia servir des del 1927 on governava. El drac rectangular de
    la dinastia Qing es feia servir a la marina des del 1881 i va ser nacional el 1888 o el 1889, i
    surt des del 1886.
- **Simplificacions**, marcades amb un comentari al YAML: l'Afganistan abans del 1929, quan les
  banderes de l'emirat i del regne d'Amanullah canviaven sovint i sense dates exactes; la primera
  bandera de l'Iraq (1921-1924) i la de la Federació Àrab (1958). Les colònies, els protectorats i
  els mandats encara no en porten cap (l'Índia britànica no tenia bandera nacional), ni Bukharà,
  Khiva, Bòsnia i Hercegovina sota Àustria-Hongria, Palestina, Gaza, Cisjordània i el Caixmir.
  L'Alemanya ocupada (1945-1949) surt sense bandera pròpia, perquè no en tenia.
- **Les banderes de règims com el nazi o el soviètic** s'ensenyen en el seu context històric i
  amb finalitat educativa.

## 3. Els textos

Els fets i els conflictes de `content/` els escriuen els qui hi contribueixen, amb llicència
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Tot el que s'hi diu s'ha de poder
comprovar: cada entrada enllaça com a mínim una font (la Viquipèdia val per començar). Una font que no és
la Viquipèdia va a `sources`, amb el títol, qui la publica i l'enllaç (la resolució de l'ONU sobre
Crimea, per exemple). Com s'escriuen els textos és a [CONTRIBUTING.md](CONTRIBUTING.md).
