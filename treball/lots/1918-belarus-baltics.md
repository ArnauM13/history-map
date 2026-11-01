# 1918-belarus-baltics

**Pregunta**: què falta a CShapes entre el Bàltic i Bielorússia del 1918 al 1923, i amb quines
dates.

**Abast**: la República Popular Bielorussa, la RSS de Bielorússia i la RSS Lituanobielorussa
(Litbel); la Lituània Central (1920-1922); Memel sota administració aliada fins al 1923, i la
revolta de Klaipėda; el control real d'Estònia, Letònia i Lituània durant les guerres
d'independència (el Landeswehr i el govern Niedra, la RSS Letona, la Comuna estoniana i l'exèrcit
de Bermondt). La frontera polonesosoviètica i Vílnius fins a l'octubre del 1920 són de
[1919-polonia](1919-polonia.md): aquí només s'hi enllacen.

**Estat**: en marxa — fase 2 (recerca), des del 2026-11-01.

## Context

- CShapes: Estònia (366) des del 1918-11-11, Letònia (367) des del 1918-11-18, Lituània (368) des
  del 1918-02-16, amb canvis el 1920-10-07 i el 1922-04-18. Cal veure què hi ha a cada peça.
- Ja hi ha `content/occupations/vilnius.yaml` i `memel.yaml`, però són del 1939: no confondre-hi.
  Cap zona de la capa d'ocupacions no toca aquesta regió del 1917 al 1924.
- DADES §0.1, §1.3. La decisió 1 de [1920-plebiscits](1920-plebiscits.md) (zones sota una comissió
  internacional, estatus `international`) toca Memel.

## Troballes

Cada font té un número, que remet a la llista de [Fonts](#fonts), al final.

### Memel (Klaipėda)

- 1919-06-28 — Versalles, art. 99: Alemanya renuncia «in favour of the Principal Allied and
  Associated Powers» a tots els drets sobre el territori entre el Bàltic, la frontera nova de la
  Prússia Oriental (art. 28) i l'antiga frontera germanorussa, sense plebiscit. [7] El territori
  era prussià des de l'edat mitjana (la frontera germanorussa és la del 1422). [3] 2.657 km², 140 km
  de llarg i fins a 20 de ample, amb el nord de l'istme de Curlàndia. [3] [6]
- 1920-01-10 — Versalles en vigor. [2] [3]
- 1920-02-10 — Arriben les primeres tropes franceses (el 21è batalló de caçadors). [2]
- 1920-02-15 — Els alemanys lliuren oficialment el territori; el general Odry hi pren el govern
  com a alt comissari, en nom de les potències aliades. [1] [2] [6] El 17 forma un Directori de set
  membres, gairebé tots alemanys. [2] [3]
- 1920-06-08 → 1921-05-01 — Gabriel Petisné, comissari civil (el 8 de juny del 1920) i després
  alt comissari (l'1 de maig del 1921), fins al 1923. [1] [3]
- 1922-12-18 — Es forma a Klaipėda el Comitè Suprem de Salvació de la Lituània Menor. [2] El 20 de
  novembre, el govern lituà havia decidit en secret organitzar la revolta. [2]
- 1923-01-09 — Manifest de Šilutė: el Comitè es declara amb tot el poder i dissol el Directori.
  [2] [5]
- 1923-01-10 → 15 — La revolta: els fusellers lituans, vestits de voluntaris locals, entren per
  Kretinga i Tauragė; l'11 tenen tot el territori menys la ciutat; el 15, després d'un breu tiroteig,
  Petisné signa un alto el foc amb Budrys i les tropes franceses queden a les casernes. [2] [5]
  Dos soldats francesos, un gendarme alemany i dotze lituans morts. [5] (L'infobox de la WP
  anglesa diu del 10 al 15 de gener; el text, que comença el 9, el dia del manifest. [1])
- 1923-01-19 — El Comitè demana la incorporació a Lituània (la declaració de Šilutė), i el Seimas
  l'accepta el 24. [1] [2] La WP alemanya diu que el 19 se'n van les tropes i l'administració
  franceses [3]; la WP anglesa, que els vaixells francesos i britànics deixen el port el 19 de febrer
  [2].
- 1923-02-16 — La Conferència d'Ambaixadors renuncia als drets de Versalles i dona el territori a
  Lituània, amb condicions (l'autonomia) que s'han de fixar en una convenció. [4] [7] La WP alemanya
  ho diu el 16 [3]; la lituana [6] i la WP anglesa de la revolta [2], el 17.
- 1923-02-19 — El territori passa a Lituània: Petisné plega i Jonas Polovinskas-Budrys n'és
  plenipotenciari interí [1]; «nuo vasario 19 d.» el territori és de la República de Lituània, amb
  l'autonomia [6].
- 1924-03-14 — El Consell de la Societat de Nacions i Lituània accepten el projecte de convenció
  revisat. [7]
- 1924-05-08 — Conveni de Memel, signat a París per l'Imperi Britànic, França, Itàlia, el Japó i
  Lituània, amb l'Estatut de Memel (l'autonomia) com a annex. [4] [7] Lituània el ratifica el 27 de
  setembre del 1924 [8]; les altres parts, el 25 d'agost del 1925, que és quan entra en vigor per a
  tothom. [4] [7] [8]

### Què dona el mapa ara

Consultat a `public/data/borders.topo.json` (un punt dins de polígon, com el de
`src/map/borders.test.ts`). Els llocs i les dates, a les seccions de cada territori.

| Lloc | Què hi surt | Què hauria de ser |
| --- | --- | --- |
| Klaipėda, Šilutė, Nida | **365 del 1886 al 1918-02-15; 368 des del 1918-02-16** | 255 fins al 1920-02-14; administració aliada fins al 1923-02-18; 368 des del 19 (decisió 1) |
| Tilsit, Königsberg | 255 | 255 (bé) |

CShapes no dibuixa Memel mai com a alemany: fins al 1918 el posa dins de l'Imperi Rus, i des del
1918 dins de Lituània. És un error de 33 anys, i el més gros del lot.

### Discrepàncies

| Què | Fonts | Per què | Criteri |
| --- | --- | --- | --- |
| De qui és Memel del 1886 al 1920 | CShapes: rus fins al 1918 i lituà des del 1918-02-16; prussià fins a Versalles [3] [7] | CShapes dibuixa la Prússia Oriental des del 1886 amb la frontera nord que li va deixar Versalles (el Niemen), i dona la franja al veí. Per què, no ho diu enlloc. | **Alemany** fins que la comissió aliada en pren el govern (§0.1, fila 1). |
| Quan decideix la Conferència d'Ambaixadors | 16 de febrer del 1923 [3] [4] [7]; 17 [2] [6] | El FRUS, que és l'anotació oficial del tractat, diu el 16; el 17 deu ser el dia que es comunica. | **1923-02-16** per al fet. |
| Quan és lituà Memel | Per la força, el 1923-01-15 [2]; la decisió, el 16 de febrer [7]; el traspàs, el 19 [1] [6]; el conveni signat, el 1924-05-08; en vigor, el 1925-08-25 [7] | La Conferència cedeix la sobirania el 16 i Lituània hi governa des del 19, amb el consentiment dels aliats; el conveni només fixa l'autonomia. El FRUS diu que el traspàs té efecte el 1925, perquè és quan el conveni entra en vigor. | **1923-02-19**: el dia que el govern passa a Lituània (com a les comissions de plebiscit, que s'acaben el dia que tornen el govern). Decisió 1. |
| Quan se'n van els francesos | El 19 de gener [3]; el 19 de febrer, els vaixells [2] | Després del 15 de gener les tropes franceses queden a les casernes, i la comissió aliada de Clinchant arriba després; el 19 de febrer és el traspàs. | No mou cap data de la frontera: el fet pot dir «al febrer». |

## Decisions

Proposades per a la integració. Les marcades amb ⇒ són criteri nou o canvi per a DADES §0.1.

1. **Memel**:

   | Tram | Qui | Com |
   | --- | --- | --- |
   | fins al 1920-02-14 | 255 | Corregeix CShapes, que el fa rus fins al 1918 i lituà després |
   | 1920-02-15 → 1923-02-18 | Territori de Memel, administració aliada | Peça pròpia, estatus `international` (decisió 1 de [1920-plebiscits](1920-plebiscits.md)) |
   | 1923-01-15 → 1923-02-18 | Lituània (`by: 368`) | Capa d'ocupacions, sobre la peça aliada |
   | des del 1923-02-19 | 368 | Com ara |

   La forma és la frontera de Versalles (art. 28 i 99), que és la del 368 del 1923 al 1939 menys la
   resta de Lituània: es pot fer amb peces de CShapes (la diferència entre el 368 del 1922-04-18 i
   el de després del 1923, si CShapes en té cap; si no, la frontera de la Prússia Oriental del 255).
   **Depèn** de dues decisions obertes del [relleu](../relleu-2026-10-31.md): l'estatus
   `international`, i qui és sobirà fins als tractats (si es manté la fila 2 de §0.1 al peu de la
   lletra, Memel seria aliat fins al conveni signat, el 1924-05-08).

## Fet

## Pendent

## Relleu

## Fonts

1. «Klaipėda Region», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Klaip%C4%97da_Region>
2. «Klaipėda Revolt», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Klaip%C4%97da_Revolt>
3. «Memelland», Viquipèdia en alemany. <https://de.wikipedia.org/wiki/Memelland>
4. «Klaipėda Convention», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Klaip%C4%97da_Convention>
5. «Klaipėdos sukilimas», Viquipèdia en lituà.
   <https://lt.wikipedia.org/wiki/Klaip%C4%97dos_sukilimas>
6. «Klaipėdos kraštas», Viquipèdia en lituà.
   <https://lt.wikipedia.org/wiki/Klaip%C4%97dos_kra%C5%A1tas>
7. Tractat de Versalles, part III, secció X (Memel, art. 99), amb les anotacions del Departament
   d'Estat (*FRUS, The Paris Peace Conference, 1919*, vol. XIII).
   <https://history.state.gov/historicaldocuments/frus1919Parisv13/ch12subch10>
8. «Convention concerning the Territory of Memel», base de dades de tractats del Parlament del
   Regne Unit: les ratificacions. <https://api.parliament.uk/uk-treaties/treaties/9455> (el 2026-11-01
   tornava un error 500; les dates surten del resum de la cerca, i coincideixen amb [7]).
