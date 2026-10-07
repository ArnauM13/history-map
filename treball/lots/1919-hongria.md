# 1919-hongria

**Pregunta**: què va controlar cada estat a l'Hongria històrica del 1918 a Trianon.

**Abast**: la República Soviètica Hongaresa, l'avanç romanès fins a Budapest, la República del
Banat, l'ocupació txecoslovaca i sèrbia, i la República Eslovaca dels Consells. La recerca hi
afegeix el que continua després de Trianon per les mateixes causes: la retirada romanesa del
Tiszántúl (fins al març del 1920) i la Baranya sèrbia, fins a l'agost del 1921. No hi entren:
Croàcia-Eslavònia ([1918-iugoslavia](1918-iugoslavia.md)), Fiume ([1919-fiume](1919-fiume.md)),
Sopron i el Burgenland ([1920-plebiscits](1920-plebiscits.md), vegeu «Pendent») ni la Rutènia
subcarpàtica (lot nou, a «Pendent»).

**Estat**: integrar — fase 2 (recerca) feta el 2026-10-07.

## Context

- DADES §0.1: la sobirania (fila 1), el dia que té efecte (fila 2), la revolta amb govern (fila
  5), la guerra per fases (fila 11) i el nom (fila 12). DADES §1.3: les dates d'una zona (la
  capital marca l'inici i el final) i les formes (peces de CShapes, divisions de Natural Earth,
  línies a mà amb font).
- `content/countries.yaml`: el 310 té un sol nom, «Hongria», per a tota la seva vida.
- `content/flags.yaml`: el 310 ja canvia de bandera el 1918-11-28, el 1919-03-20, el 1919-08-01 i
  el 1919-08-08; no forma part d'aquest lot, però els noms que es proposen hi han de casar.
- `scripts/build-occupations.mjs`: ja hi ha `slovakia` (CShapes 315 ∩ 317), `backa-baranja`,
  `prekmurje-medjimurje` i `northern-transylvania` (comtats romanesos de Natural Earth). A
  `ADMIN_COUNTRIES` hi ha ROU, SRB, HRV i SVN, però no HUN ni SVK.

### Què dona CShapes ara (consultat a `public/data/borders.topo.json`)

Peces: 300 fins al 1918-11-02; 310 del 1918-11-03 al 1918-11-30, del 1918-12-01 al 1919-09-09,
del 1919-09-10 al 1920-06-03 i del 1920-06-04 ençà; 315 des del 1918-11-11.

| Lloc | 18-11-03 → 18-11-10 | 18-11-11 → 20-06-03 | Des de 20-06-04 |
| --- | --- | --- | --- |
| Budapest, Debrecen, Szeged, Pécs, Baja, Miskolc, Sopron | 310 | 310 | 310 |
| Pozsony, Kassa, Eperjes | **cap estat** | **315** | 315 |
| Ungvár, Munkács | **cap estat** | **315** | 315 |
| Kolozsvár, Nagyvárad, Arad, Temesvár, Brassó, Máramarossziget | 310 | 310 | 360 |
| Újvidék, Szabadka, Čakovec, Murska Sobota | 310 | 310 | 345 |
| Kismarton (Burgenland) | **305** | **305** | 305 |
| Praga, Brno (fora de l'abast) | **cap estat** | 315 | 315 |

Tres errors: Eslovàquia i la Rutènia queden en blanc vuit dies i després són txecoslovaques
abans que ningú les controlés (Pozsony, el 1919-01-01; la Rutènia, l'abril del 1919); el
Burgenland és austríac des del 1918, tres anys abans del traspàs; i, al revés, Transsilvània, el
Banat i la Bačka surten hongareses fins a Trianon sense cap rastre de l'ocupació. CShapes
dibuixa, doncs, dos criteris alhora: a Eslovàquia, el control (avançat); a la resta, la sobirania.

## Troballes

Cada font té un número, que remet a la llista de [Fonts](#fonts), al final.

### Els règims de Budapest (els noms del 310)

- 1918-10-31 — Revolució dels Asters: Károlyi, al govern. [2] [12]
- 1918-11-13 — Carles IV renuncia a governar. [1]
- 1918-11-16 — República Popular d'Hongria («Magyar Népköztársaság»), nom oficial des d'aquest
  dia. [12]
- 1919-03-20 — Vix lliura la nota que demana la retirada a la zona neutral; Károlyi dimiteix. [1]
- 1919-03-21 — República Soviètica d'Hongria. [12] [13]
- 1919-08-01 — Kun i el Consell de Govern Revolucionari dimiteixen; Peidl forma govern. [3] [13]
- 1919-08-02 — El govern Peidl restaura la República Popular. [3] [13] ([12] posa la
  restauració l'1 d'agost.)
- 1919-08-06 — Cop de Friedrich; el 7, l'arxiduc Josep August es proclama regent. [3] [14]
- 1919-08-08 — Comença la República Hongaresa («Magyar Köztársaság»). [12] [14]
- 1919-11-16 — Horthy entra a Budapest amb l'Exèrcit Nacional. [3] [14]
- 1920-02-29 — El parlament restaura la monarquia: Regne d'Hongria. [14] [15] L'1 de març hi
  elegeix Horthy regent. [4]
- 1920-06-04 — Trianon, signat; ratificat per Hongria el 1920-11-16; en vigor el 1921-07-26. [16]

### L'armistici de Belgrad i l'ocupació sèrbia (el sud)

- 1918-11-13 — Armistici de Belgrad. Línia de demarcació: el curs alt del Someș, Bistrița, el
  Mureș fins a la Tisza, i d'allà a Szabadka (Subotica), Baja i Pécs, fins al Drava. Els aliats
  ocupen el que queda al sud i a l'est; **l'administració civil, també al sud de la línia, es
  deixa a Hongria**. [1]
- 1918-11-09 — Una unitat sèrbia pren Újvidék (Novi Sad) sense resistència; el 10, Vršac. [1]
- 1918-11-13 — Els serbis ocupen Szabadka; el 14, Pécs; el 15, Temesvár (Timișoara), Orșova i
  Lugoj; el 16, Zombor (Sombor) i Senta; el 21, la part d'Arad al sud del Mureș. [1] (citant
  Krizman 1970)
- 1918-11-25 — L'assemblea de Novi Sad proclama la unió del Banat, la Bačka i la Baranja amb
  Sèrbia. [1] [11]
- 1918-12-24 — L'Estat SCS ocupa el Muraköz (Međimurje), comtat de Zala, al nord de la línia. [1]
- 1919-08-12 — Les forces iugoslaves ocupen el Muravidék (Prekmurje). [3]
- 1921-08-14 — A Pécs es proclama la República Serbohongaresa de Baranya-Baja, sobre la zona que
  encara ocupava el Regne SCS; es dissol el 20. [10] Del 21 al 25 d'agost, Hongria en pren
  possessió, com volia Trianon. [10] [11]

### El Banat

- 1918-10-31 — República del Banat, a Temesvár (Bartha en dona aquest dia com a oficial; altres
  testimonis, el 2 de novembre). [8]
- 1918-11-12 — L'exèrcit serbi entra al Banat; el 17, el coronel Čolović pren Temesvár; la
  república, des del 16, «només existeix sobre el paper». [8] ([1] posa Temesvár el 15.)
- 1918-12-03 — 15.000 soldats francesos ocupen Temesvár; el 27 de gener del 1919, els francesos
  controlen tot el Banat oriental, com a zona tampó entre serbis i romanesos. [8] [3]
- 1919-07-27 — Les tropes sèrbies deixen Temesvár; els francesos s'hi queden fins al traspàs. [3]
- 1919-08-03 — L'exèrcit romanès entra a Temesvár. [3] [9]

### Romania

- 1918-11-13 — La 7a divisió romanesa entra a Transsilvània; el 7 de desembre, Brassó; el 24 de
  desembre, Kolozsvár (Cluj); el 22 de gener del 1919, tot fins al Mureș. [2] El 17 de gener,
  Máramarossziget. [3] Del 16 al 29 de gener, a Csucsa (Ciucea), l'avanç s'atura. [3] A l'abril, les
  divisions romaneses són a Nagybánya (Baia Mare), Zilah (Zalău) i Bánffyhunyad (Huedin). [2] El
  mapa de [20] dibuixa aquest límit del control hongarès al març del 1919.
- 1918-12-01 — Assemblea d'Alba Iulia: la unió de Transsilvània i el Banat amb Romania. [8]
- 1919-02-26 — La conferència de pau fixa la zona neutral; [2] diu que se'n va informar Hongria el
  28 de febrer. [1] [3]
- 1919-04-16 — Ofensiva romanesa; el 19, Nagykároly (Carei); el 20, Nagyvárad (Oradea); el 23,
  Debrecen; **el vespre de l'1 de maig, tota la riba est de la Tisza**. [2] El 17 de maig, Arad,
  que tenien els francesos. [3]
- 1919-07-20 — Ofensiva hongaresa a l'altra banda de la Tisza; el 24, la contraofensiva
  romanesa; la nit del 29 al 30, els romanesos travessen la Tisza. [2]
- 1919-08-03 — Tres esquadrons romanesos entren a Budapest; fins al migdia del 4 hi ha 400
  soldats. [2] [1] i [3] posen l'entrada de l'exèrcit el 1919-08-04.
- 1919-08-18 — Romania ocupa Veszprém i Győr. [3]
- 1919-10-02 → 11-14 — Romania es retira de la Transdanúbia. [3]
- 1919-11-14 — Els romanesos deixen Budapest; Bandholtz ho comunica el 15. [3] [17]
- 1919-11-23 — Romania acaba la retirada a la línia de la Tisza. [3] Bandholtz: els romanesos «determined to hold line of the Tisza River». [17]
- 1920-02-25 — Comença la retirada del Tiszántúl; **acaba el 30 de març**. [4] [18] dona el 28.

### Txecoslovàquia i la República Eslovaca dels Consells

- 1918-11-25 — Línia de demarcació provisional txecoslovaca: Pozsony, el Danubi, l'Ipeľ, l'Uh i el
  pas d'Uzsok. [6]
- 1918-12-28 — Els txecoslovacs prenen Eperjes (Prešov); el 29, Kassa (Košice). [5] [6]
- 1919-01-01 — Les legions entren a Pozsony (Bratislava), entre l'1 i el 2 de gener. [3] [5] [6]
  El 12 de gener, Ungvár. [3] El 20 de gener, tot Eslovàquia. [6]
- 1919-05-02 → 05-20 — Els txecoslovacs tenen Miskolc, al sud de la línia. [5]
- 1919-06-06 — L'Exèrcit Roig hongarès pren Kassa; el 10, Eperjes. [5] [6] [7]
- 1919-06-12 — La conferència de pau fixa la frontera eslovacohongaresa (l'art. 27 de Trianon);
  Clemenceau la comunica el 13. [6] [3]
- 1919-06-16 — República Eslovaca dels Consells, a Eperjes. [7] [5] Armistici el 24 de juny;
  acord de retirada a Pozsony el 29; la retirada, de l'1 al **7 de juliol**, fins a la línia del
  12 de juny. [7] [3]
- 1919-12-08 → 12-18 — Els txecoslovacs deixen Balassagyarmat, Salgótarján i Ózd, al sud de la
  línia; Sátoraljaújhely, el març del 1920. [3] [4]
- La Rutènia: Ungvár, txecoslovaca des del 1919-01-12 [3]; la resta, des del 27 d'abril del 1919
  [19]; l'est, amb Máramarossziget i la línia de Jasina, romanès, amb una línia de contacte que
  Pellé fixa el 9 de maig. [19] No s'ha trobat quan Romania en va lliurar la part txecoslovaca.

### Discrepàncies

| Què | Fonts | Per què | Criteri |
| --- | --- | --- | --- |
| De qui és Eslovàquia, Transsilvània o la Bačka del 1918 a Trianon | CShapes: Eslovàquia, txecoslovaca des del 1918-11-11; la resta, hongaresa fins a Trianon | L'armistici deixa l'administració a Hongria i les línies són de demarcació [1]; Hongria no renuncia a res fins a Trianon [16]. Les proclamacions d'unió (Martin, Novi Sad, Alba Iulia) no les reconeix l'estat que perd el territori, i els aliats esperen el tractat. CShapes barreja els dos criteris. | **Sobirania hongaresa fins al 1920-06-03** (§0.1, fila 1) i el control, a la capa d'ocupacions (decisió 1). ⇒ |
| Quan entren els romanesos a Budapest | 3 d'agost [2] [13]; 4 d'agost [1] [3] | El 3 al vespre hi entren tres esquadrons de cavalleria; el gros de l'exèrcit, el 4. | **1919-08-04**: el dia que l'ocupant en pren el control amb l'exèrcit (§1.3). |
| Quan entren els serbis a Temesvár | 15 de novembre [1, citant Krizman]; 17 de novembre [8] | [8] dona el nom del coronel i la cerimònia; [1], una nota de Krizman. No s'ha pogut llegir Krizman. | **1918-11-15** com a final de la República del Banat (des del 16 «només sobre el paper» [8], i les dues fonts hi caben); l'inici de la zona sèrbia del Banat, el mateix dia. |
| Quan neix la República del Banat | 31 d'octubre o 2 de novembre [8] | Bartha dona el 31 com a data oficial; altres testimonis, l'assemblea del 2. | **1918-10-31** (el dia que en dona el seu fundador). |
| Quan s'acaba l'ocupació romanesa del Tiszántúl | 30 de març [4]; 28 de març [18] | [4] és una cronologia de la Viquipèdia sense nota per a aquest dia; [18] és el resum d'un article acadèmic. Les fonts hongareses de la cerca (no llegides) diuen el 30. | **1920-03-30**, provisional: a confirmar amb Ormos o Romsics. |
| Quan es restaura la monarquia | 29 de febrer [14] [15]; 1 de març [4] | La llei I del 1920 és del 29; l'1 de març el parlament elegeix el regent. | **1920-02-29** (§0.1, fila 2: la llei). |
| Quan s'acaba la República Soviètica | 1 d'agost (Kun dimiteix) [3] [13]; la República Popular, restaurada l'1 [12] o el 2 [3] [13] | Kun dimiteix l'1 al vespre; el govern Peidl en canvia el nom l'endemà. | Soviètica **fins al 1919-08-01**, com la bandera de `flags.yaml`. |
| La zona neutral | 26 de febrer [1] [3]; 28 de febrer [2]; la nota, el 19 [2] o el 20 de març [1] | Decisió (26), notificació a París (28) i lliurament a Károlyi (20). | Per al fet: **1919-03-20**, el lliurament. No mou cap zona. |
| Quan s'acaba l'ocupació sèrbia de Pécs | Dissolució de la república el 20 d'agost [10]; reintegració del 21 al 25 [10] [11] | La república es dissol quan els serbis se'n van; Hongria entra els dies següents. | **Fins al 1921-08-20**. El dia que l'exèrcit hongarès entra a Pécs, pendent. |

## Decisions

Proposades per a la integració. Les marcades amb ⇒ són criteri nou o canvi per a DADES §0.1.

1. ⇒ **Hongria és sobirana de tota l'Hongria històrica fins al 1920-06-03** (sense Croàcia-Eslavònia
   ni Fiume, d'altres lots). Les línies del 1918-1919 eren de demarcació, l'armistici hi deixava
   l'administració hongaresa [1] i Hongria no hi renuncia fins a Trianon [16]; és el mateix que el
   lot 1919-fiume va fer amb la Venezia Giulia (austríaca fins a Saint-Germain). El control dels
   estats veïns va a la capa d'ocupacions. Proposta de fila per a §0.1: «Un estat nou que
   administra un territori d'un imperi que es desfà, abans del tractat que l'hi dona → el
   territori és de l'estat vell fins al tractat; l'estat nou, a la capa d'ocupacions. Exemple:
   Eslovàquia i Transsilvània, hongareses fins a Trianon.» **Cal decidir-ho alhora amb
   [1918-iugoslavia](1918-iugoslavia.md) i [1919-polonia](1919-polonia.md)**: Croàcia hi és
   diferent, perquè tenia un parlament propi, que el 1918-10-29 va trencar amb Hongria (vegeu aquell lot).
   Correccions a `build-borders.mjs` (`CORRECTIONS`):
   - Eslovàquia i la Rutènia: **310 del 1918-11-03 al 1920-06-03** (ara, en blanc fins al
     1918-11-10 i 315 des de l'11). La peça és el 315 del 1920-06-04 menys les terres txeques (el
     315 menys el que era 300-Àustria; o 317 + 369 d'avui, com fa `slovakia`).
   - El Burgenland: CShapes el dona a Àustria des del 1918-11-03; ha de ser 310 com a mínim fins al
     1920-06-03. El que ve després (Trianon, la Lajtabánság, el traspàs del 1921-08-28, Sopron) és
     de [1920-plebiscits](1920-plebiscits.md): cal afegir-ho al seu abast.
2. **Els noms del 310** (`content/countries.yaml`; §0.1, fila 12). Els títols català i castellà,
   de `npm run data:sources`; aquí, les etiquetes proposades i l'article anglès:
   - fins al 1918-11-15: Regne d'Hongria · Reino de Hungría · Kingdom of Hungary — `Kingdom of Hungary`
   - 1918-11-16 → 1919-03-20: República Popular d'Hongria · República Popular de Hungría ·
     Hungarian People's Republic — `First Hungarian Republic` (Q516160)
   - 1919-03-21 → 1919-08-01: República Soviètica d'Hongria · República Soviética Húngara ·
     Hungarian Soviet Republic — `Hungarian Soviet Republic` (Q243652)
   - 1919-08-02 → 1919-08-07: República Popular d'Hongria, com abans
   - 1919-08-08 → 1920-02-28: República d'Hongria · República de Hungría · Hungarian Republic —
     `Hungarian Republic (1919–1920)` (Q16985296)
   - 1920-02-29 → 1946-01-31: Regne d'Hongria — `Kingdom of Hungary (1920–1946)` (Q600018)
   - després, Hongria (el que ve des del 1946 no és d'aquest lot).
   Les etiquetes d'aquests anys han de ser curtes: si «República Popular d'Hongria» es confon amb
   la del 1949-1989 al mapa, la fitxa ho aclareix amb l'enllaç.
3. **La capa d'ocupacions**, amb aquestes zones (§1.3: la capital marca les dates; entre
   fases, es veu el conflicte). Totes, `kind: occupation` tret de les indicades.
   - **Eslovàquia** (`by: 315`): de l'1 de gener del 1919 (Pozsony) al 1920-06-03, en tres trams
     perquè dues zones de les mateixes dates no es poden trepitjar: fins al 1919-06-05; del
     1919-06-06 al 07-07, el que no tenia l'Exèrcit Roig; i del 1919-07-08 al 1920-06-03. Forma:
     `slovakia` (315 ∩ 317). Causa: «Ocupació txecoslovaca, 1918».
   - **República Eslovaca dels Consells** (Q200896): del 1919-06-16 al 1919-07-07, `by: 310`,
     `kind: client`. Forma: línia a mà, del front del 24 de juny (Komárom, el Žitava, Rohožnica,
     10 km a l'est de Banská Štiavnica, 10 km al sud de Tisovec [6]) fins a Bardejov, amb un mapa
     de la font per fer-la; si no se'n troba cap, es deixa sense zona i només el fet.
   - **Transsilvània** (`by: 360`): del 1918-12-24 (Kolozsvár) al 1920-06-03. Forma: els comtats
     de Natural Earth Maramureș, Sălaj, Cluj, Bistrița-Năsăud, Mureș, Harghita, Covasna, Brașov,
     Sibiu, Alba i Hunedoara, que segueixen la línia de Csucsa i del Mureș del gener del 1919 [2]
     [3] [20], dins del 360 del 1920. Màramarossziget, des del 17 de gener: dins de la mateixa
     zona (regla de les zones grans).
   - **Partium** (`by: 360`): Satu Mare, Bihor i Arad al nord del Mureș, del 1919-04-20 (Nagyvárad)
     al 1920-06-03. El text diu que Arad va ser francesa fins al 17 de maig.
   - **Banat oriental** (Temesvár): `by: 340` del 1918-11-15 al 11-30, `345` fins al 1919-07-27,
     `220` del 07-28 al 08-02 (els francesos hi eren des del 3 de desembre: el text ho diu) i `360`
     del 1919-08-03 al 1920-06-03. Forma: Timiș i Caraș-Severin, més la part d'Arad i Mehedinți
     al sud del Mureș i a l'oest d'Orșova que era hongaresa, dins del 360 del 1920.
   - **Banat occidental, Bačka i Baranja iugoslaves** (`by: 340` fins al 1918-11-30, després
     `345`): del 1918-11-09 (Novi Sad) al 1920-06-03. Forma: el 345 del 1920-06-04 dins del 310
     del 1918-12-01, menys el Muraköz i el Muravidék.
   - **Muraköz** (Međimurje), `345`, del 1918-12-24 al 1920-06-03; **Muravidék** (Prekmurje),
     `345`, del 1919-08-12 al 1920-06-03. Formes: les dues meitats de `prekmurje-medjimurje`.
   - **Baranya i Baja** (`by: 340`/`345`): del 1918-11-14 (Pécs) al 1921-08-13, i la **República
     Serbohongaresa de Baranya-Baja** (Q156506), `kind: client`, `by: 345`, del 1921-08-14 al
     1921-08-20. Forma: el comtat de Baranya d'avui i la línia de demarcació fins a Baja, de
     Natural Earth (cal afegir HUN a `ADMIN_COUNTRIES`) i a mà, aproximada.
   - **Tiszántúl** (`by: 360`): del 1919-05-01 al 1920-03-30. Forma: dins del 310 del 1920, a l'est
     de la Tisza: Szabolcs-Szatmár-Bereg, Hajdú-Bihar i Békés, i una línia a mà per la Tisza a
     Jász-Nagykun-Szolnok i Csongrád.
   - **Entre la Tisza i el Danubi, amb Budapest** (`by: 360`): del 1919-08-04 al 1919-11-14. Forma:
     Budapest, Pest, Heves, Bács-Kiskun sense la zona de Baja, i Jász-Nagykun-Szolnok i Csongrád a
     l'oest de la Tisza, sense Szeged (francesa). La Transdanúbia (Győr, Veszprém, del 18 d'agost a
     l'octubre) no es dibuixa sense un mapa amb font: el text ho diu.
4. **La República del Banat** (Q156513): peça pròpia (§0.1, fila 5) del 1918-10-31 al
   1918-11-15, sobre el Banat (Timiș, Caraș-Severin i els tres districtes del Banat serbi de
   Natural Earth), damunt del 300 i del 310. Té un govern a Temesvár, el Consell del Poble, durant
   aquests quinze dies [8]. Si la fase 3 troba que la forma és massa incerta (l'exèrcit serbi
   ja era a Vršac el dia 10), es deixa en un fet.
5. **No es dibuixen**: Miskolc txecoslovaca (2-20 de maig del 1919), la franja de Salgótarján i
   Sátoraljaújhely (agost del 1919 – març del 1920), Makó i Szeged franceses, la República de
   Prekmurje (29 de maig – 6 de juny del 1919) i el cap de pont romanès de la Tisza del juliol: o
   són per sota de l'error de la línia o no hi ha una font amb les dates de la forma. Van al text
   de la zona veïna o a «Pendent».
6. **Fets i conflictes** (`content/events/`, `content/conflicts/`): la Revolució dels Asters
   (1918-10-31), l'armistici de Belgrad (1918-11-13), la República Soviètica (1919-03-21),
   l'entrada romanesa a Budapest (1919-08-04), Trianon (1920-06-04); i els conflictes guerra
   hongaresoromanesa (1918-11-13 → 1919-08-04, Q252298) i guerra hongaresotxecoslovaca (1918-11 →
   1919-07-07, Q1747429).

## Fet

- 2026-10-07 — La recerca (fase 2): les dates de cada règim i de cada ocupació, les discrepàncies
  i la proposta d'integració. Branca `history-map/recerca-1919-hongria`.

## Pendent

1. Fase 3: decidir la decisió 1 amb la sessió principal (és un criteri per a §0.1 que toca
   1918-iugoslavia i 1919-polonia) abans d'escriure cap correcció.
2. Confirmar amb una font llegida: el final de l'ocupació romanesa del Tiszántúl (28 o 30 de març
   del 1920) i el dia que l'exèrcit hongarès entra a Pécs (21-25 d'agost del 1921). Candidats:
   Ormos, *Padovától Trianonig*; Romsics, *A trianoni békeszerződés*; Tihany, *The Baranya
   dispute* (1978).
3. Un mapa amb font per a la línia de la República Eslovaca dels Consells i per a l'extensió
   romanesa a la Transdanúbia.
4. **Lot nou: `1919-rutenia`** — la Rutènia subcarpàtica del 1918 al 1920: la República Hutsul
   (Q950101), l'ocupació txecoslovaca (Ungvár el 1919-01-12, la resta des del 27 d'abril) i la
   romanesa de l'est, amb la línia de Pellé del 9 de maig del 1919 i el dia del traspàs.
5. **Al lot [1920-plebiscits](1920-plebiscits.md)**: afegir el Burgenland sencer, no només Sopron
   (CShapes el fa austríac des del 1918-11-03; el traspàs és del 1921-08-28; la Lajtabánság,
   Q695448, de l'octubre al novembre del 1921).
6. **Fora de l'abast, a apuntar**: CShapes deixa Bohèmia i Moràvia en blanc del 1918-11-03 al
   1918-11-10 (Txecoslovàquia es proclama el 1918-10-28). Lot nou o fila al de Txecoslovàquia.

## Relleu

- **Fase**: 2 (recerca) feta; ve la 3 (integració), en una sessió nova des de `main` amb aquesta
  PR fusionada.
- **Primera tasca**: el punt 1 de «Pendent». Si el criteri s'accepta, les correccions de la
  decisió 1 a `build-borders.mjs` i, després, els noms de la decisió 2.
- **Llegir**: aquest fitxer (Context, Discrepàncies, Decisions), DADES §0.1 i §1.3, i les zones
  `slovakia`, `backa-baranja`, `prekmurje-medjimurje` i `northern-transylvania` de
  `build-occupations.mjs`. **No cal** tornar a llegir les fonts per a les dates que ja són a
  «Troballes», només les del punt 2 de «Pendent».

## Fonts

1. «Armistice of Belgrade», Viquipèdia en anglès (cita Krizman 1970, Pastor 1970, Lendvai 2003).
   <https://en.wikipedia.org/wiki/Armistice_of_Belgrade>
2. «Hungarian–Romanian War», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Hungarian%E2%80%93Romanian_War>
3. «1919 in Hungary», Viquipèdia en anglès (cronologia; cita Romsics 2004, Ormos 1998, Csüllög
   2020, Gulyás 2021). <https://en.wikipedia.org/wiki/1919_in_Hungary>
4. «1920 in Hungary», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/1920_in_Hungary>
5. «Hungarian–Czechoslovak War», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Hungarian%E2%80%93Czechoslovak_War>
6. «Maďarsko-československá válka», Viquipèdia en txec.
   <https://cs.wikipedia.org/wiki/Ma%C4%8Farsko-%C4%8Deskoslovensk%C3%A1_v%C3%A1lka>
7. «Slovenská republika rád», Viquipèdia en eslovac.
   <https://sk.wikipedia.org/wiki/Slovensk%C3%A1_republika_r%C3%A1d>
8. «Banat Republic», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Banat_Republic>
9. Europa Liberă, «Centenar la Timișoara: reconstituirea intrării trupelor românești în oraș»,
   3-8-2019. <https://romania.europalibera.org/a/centenar-la-timi%C8%99oara-reconstituirea-intr%C4%83rii-trupelor-rom%C3%A2ne%C8%99ti-%C3%AEn-ora%C8%99-defil%C4%83ri-concerte-spectacole-%C8%99i-multe-flori/30090727.html>
10. «Serbian–Hungarian Baranya–Baja Republic», Viquipèdia en anglès (cita Tihany 1978).
    <https://en.wikipedia.org/wiki/Serbian%E2%80%93Hungarian_Baranya%E2%80%93Baja_Republic>
11. «Baranya (region)», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Baranya_(region)>
12. «First Hungarian Republic», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/First_Hungarian_Republic>
13. «Hungarian Soviet Republic», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Hungarian_Soviet_Republic>
14. «Hungarian Republic (1919–1920)», Viquipèdia en anglès (cita Térfy, *Magyar törvénytár*).
    <https://en.wikipedia.org/wiki/Hungarian_Republic_(1919%E2%80%931920)>
15. «Kingdom of Hungary (1920–1946)», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Kingdom_of_Hungary_(1920%E2%80%931946)>
16. «Treaty of Trianon», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Treaty_of_Trianon>
17. *Papers Relating to the Foreign Relations of the United States, The Paris Peace Conference,
    1919*, vol. XII, telegrames de Bandholtz del 15 de novembre del 1919.
    <https://history.state.gov/historicaldocuments/frus1919Parisv12/d346>,
    <https://history.state.gov/historicaldocuments/frus1919Parisv12/d347>
18. «Four Generals in Budapest. The Inter-Allied Military Mission in Hungary (1919-1920)»,
    Sapienza Università di Roma (resum). <https://research.uniroma1.it/node/45847>
19. V. Marek, «A scramble for the Carpathian ridges», armedconflicts.com, 3-10-2012.
    <https://www.armedconflicts.com/14714->
20. «Vix Note», Viquipèdia en anglès, i el mapa «Vix Note HU.JPG» (el límit del control hongarès
    al març del 1919). <https://en.wikipedia.org/wiki/Vix_Note>

Els QID, de la Viquipèdia anglesa (`prop=pageprops`): República Popular Q516160, Soviètica
Q243652, República Q16985296, Regne (1920-1946) Q600018, República Eslovaca dels Consells
Q200896, República del Banat Q156513, Baranya-Baja Q156506, República de Prekmurje Q913828,
República Hutsul Q950101, Lajtabánság Q695448, guerra hongaresoromanesa Q252298, guerra
hongaresotxecoslovaca Q1747429, armistici de Belgrad Q792386, Trianon Q181902.
