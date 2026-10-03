# Full de ruta

L'objectiu és un mapa on qualsevol pugui **veure com va canviar Europa** i **entendre per què**.
Les fronteres són el llenç; el que val és la història que s'hi explica a sobre.

De moment, **Europa del 1900 a avui**. Abans del 1900, potser més endavant (§5).

## 0. Els fonaments — fet

- [x] Una web estàtica: React, TypeScript, Vite i MapLibre.
- [x] Les fronteres del 1900 a avui, de CShapes 2.0, retallades i simplificades per a Europa.
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

## 3. La capa de fet — la gran feina de dades

CShapes, com la majoria de dades de fronteres, recull les **pactades** i no les ocupacions. És una
bona base, però deixa fora bona part del que fa entenedor el segle XX. Aquesta fase hi afegeix, a
part i ben marcat, el que es controlava de fet:

- [ ] 1938-1945: l'Anschluss, el Protectorat de Bohèmia i Moràvia, la partició de Polònia i el
      Govern General, la França de Vichy i la zona ocupada, l'Estat Independent de Croàcia, les
      ocupacions de l'Eix als Balcans i a la Unió Soviètica…
- [ ] 1917-1923: els estats de poca durada de la guerra civil russa, Fiume, Memel, les zones de
      plebiscit.
- [ ] Del 1990 ençà, els territoris en disputa: Crimea, el Donbàs, Transnístria, Abkhàzia,
      Ossètia del Sud, el nord de Xipre, l'Alt Karabakh.
- [ ] Com: GeoJSON amb dates, un `kind` (ocupació, annexió, estat titella, en disputa) i un
      `controlledBy`, dibuixat ratllat i en una capa que es pot amagar.
- [ ] D'on: [historical-basemaps](https://github.com/aourednik/historical-basemaps) (GPL-3.0),
      les zones en disputa de Natural Earth (domini públic) i mapes de domini públic digitalitzats
      a mà.

## 4. Més maneres de llegir el mapa

- [ ] **Aliances i blocs**: l'Entesa i les Potències Centrals, els Aliats i l'Eix, l'OTAN i el
      Pacte de Varsòvia, la CEE i la UE al llarg del temps.
- [ ] Els fronts de les dues guerres mundials en moments clau.
- [ ] Les capitals i les ciutats grans, amb els canvis de nom (Petrograd, Leningrad, Sant
      Petersburg).
- [ ] Les divisions internes on importen: les repúbliques soviètiques i iugoslaves, els estats
      alemanys.

## 5. Més enllà

- [ ] Tirar enrere fins al segle XIX (CShapes comença el 1886; per al 1815-1886 caldran altres
      fonts).
- [ ] *Vector tiles* (PMTiles), si les dades creixen més del que un fitxer pot dur.
- [ ] Que funcioni sense connexió.
- [ ] Una manera de contribuir sense Git, per a qui sap història i no vol saber de YAML.

Les idees i l'ordre es parlen als *issues* de GitHub: obre'n un.
