# Full de ruta

L'objectiu és un mapa on qualsevol pugui **veure com va canviar Europa** i **entendre per què**.
Les fronteres són el llenç; el que val és la història que s'hi explica a sobre.

De moment, **Europa del 1886 a avui**, que és d'on arrenca CShapes. Abans, unint-hi altres fonts (§5).

## 0. Els fonaments — fet

- [x] Una web estàtica: React, TypeScript, Vite i MapLibre.
- [x] Les fronteres del 1886 a avui, de CShapes 2.0, retallades i simplificades per a Europa.
- [x] El nom de cada estat segons la data, en català, castellà i anglès.
- [x] La línia temporal, mes a mes, amb reproducció i salts entre dates clau.
- [x] Fets i conflictes en YAML, validats als tests: 25 fets i 13 conflictes per començar.
- [x] La interfície en tres idiomes i adreces que es poden compartir.
- [x] També als tres idiomes: les capitals, els enllaços a la Viquipèdia i la documentació
      principal (README, CONTRIBUTING i DADES).
- [x] Les fonts de tot a la vista: cada fitxa diu d'on surten les fronteres, el nom, les dates de
      les banderes i els fets, i un workflow comprova cada setmana que les fonts existeixen.
- [x] CI (lint, format, tipus, tests i build) i publicació a GitHub Pages.

## 1. Les banderes — en marxa

- [x] La cronologia de les banderes d'una setantena d'estats (`content/flags.yaml`), amb les
      imatges de Wikimedia Commons, que baixa sol un workflow.
- [x] Al mapa, cada estat amb la seva bandera.
- [x] La pestanya Banderes: totes les d'aquell dia i les estrenades aquell any.
- [x] A la fitxa d'un estat, totes les banderes que ha tingut.
- [x] Dues frases per a les banderes amb més història: què volen dir i per què van canviar.
- [x] A la línia temporal, les marques dels canvis de bandera.
- [ ] Les variants simplificades (vegeu [DADES.md](DADES.md#2-les-banderes-wikimedia-commons)) i
      els estats de les vores del mapa (Egipte, Síria, l'Iraq…).
- [ ] Les banderes de les colònies, dels protectorats i dels estats de poca durada.
- [ ] Un text per a la resta de banderes.

## 2. Una primera versió sencera

El contingut:

- [ ] Uns cent fets i una trentena de conflictes que cobreixin tot el període, en els tres idiomes.
- [ ] Una fitxa curta per a cada estat: què era, com va néixer i com es va acabar.
- [ ] Fonts acadèmiques o primàries per a cada fet, a més de la Viquipèdia: el text dels tractats,
      les resolucions, historiografia de referència.
- [ ] Que algú amb formació d'historiador revisi tots els textos.

L'experiència:

- [ ] Un cercador d'estats, fets i conflictes.
- [ ] Enllaços que obrin un fet, un conflicte o un estat concret (`?sel=event:…`).
- [ ] **Històries guiades**: relats pas a pas que mouen el mapa i la línia (la Gran Guerra, el Teló
      d'Acer, la desintegració de Iugoslàvia).
- [ ] Dreceres de teclat i una revisió d'accessibilitat (contrast, lectors de pantalla).
- [ ] Una pàgina «Sobre el projecte» amb les fonts, traduïda.

## 3. La capa de fet — en marxa

CShapes, com la majoria de dades de fronteres, recull les **pactades** i no les ocupacions. És una
bona base, però deixa fora bona part del que fa entenedor el segle XX. Aquesta fase hi afegeix, a
part i ben marcat, el que es controlava de fet. Com es fa, a [DADES.md](DADES.md) §1.3.

- [x] Com: una zona per fitxer a `content/occupations/` (dates, qui la controlava i com: annexió,
      ocupació o estat client), i la forma, a `scripts/build-occupations.mjs`. Al mapa, del color
      de l'ocupant, ratllada, en una capa que es pot amagar.
- [x] D'on: fronteres de CShapes d'altres dates, les divisions d'avui de Natural Earth (domini
      públic) i línies dibuixades a mà, amb la font de cada una.
- [x] 1938-1945, l'expansió alemanya i l'oest: l'Anschluss, Bohèmia i Moràvia, l'Estat Eslovac,
      Memel, Zaolzie, la Rutènia hongaresa, Albània, la partició de Polònia i el Govern General,
      Dinamarca, Noruega, els Països Baixos, Bèlgica, Luxemburg i França (la zona ocupada, Vichy,
      Alsàcia i Mosel·la, la zona italiana i Còrsega).
- [ ] 1941-1945, els Balcans: l'Estat Independent de Croàcia i la partició de Iugoslàvia, la
      triple ocupació de Grècia, les annexions hongareses i búlgares, el nord de Transsilvània.
- [ ] 1941-1944, el front de l'Est: els països bàltics, Bielorússia, Ucraïna, Rússia i
      Transnístria. Depèn del front, i va amb la capa dels fronts (§4).
- [ ] 1943-1945, Itàlia: la República Social Italiana i les zones annexionades de fet per
      Alemanya.
- [ ] 1917-1923: els estats de poca durada de la guerra civil russa, Fiume, les zones de
      plebiscit.
- [ ] Del 1990 ençà, els territoris en disputa: Crimea, el Donbàs, Transnístria, Abkhàzia,
      Ossètia del Sud, el nord de Xipre, l'Alt Karabakh.

## 4. Més maneres de llegir el mapa

- [ ] **Aliances i blocs**: l'Entesa i les Potències Centrals, els Aliats i l'Eix, l'OTAN i el
      Pacte de Varsòvia, la CEE i la UE al llarg del temps.
- [ ] Els fronts de les dues guerres mundials en moments clau.
- [ ] Les capitals i les ciutats grans, amb els canvis de nom (Petrograd, Leningrad, Sant
      Petersburg).
- [ ] Les divisions internes on importen: les repúbliques soviètiques i iugoslaves, els estats
      alemanys.

## 5. Més enllà

- [x] Tirar enrere fins al 1886, on comença CShapes.
- [ ] Abans del 1886, tan enrere com es pugui: unir diverses fonts de fronteres en una sola
      capa, amb les mateixes dates i els mateixos codis que CShapes.
- [ ] *Vector tiles* (PMTiles), si les dades creixen més del que un fitxer pot dur.
- [ ] Que funcioni sense connexió.
- [ ] Una manera de contribuir sense Git, per a qui sap història i no vol saber de YAML.

Les idees i l'ordre es parlen als *issues* de GitHub: obre'n un.
