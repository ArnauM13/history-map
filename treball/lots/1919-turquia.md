# 1919-turquia

**Pregunta**: com es dibuixa l'Anatòlia i la Tràcia del 1918 a Lausana: les ocupacions aliades,
Esmirna grega i el govern d'Ankara.

**Abast**: l'armistici de Mudros, l'ocupació de Constantinoble, la zona d'Esmirna (1919-1922),
Sèvres (que no va entrar en vigor), la Tràcia oriental i Lausana. Hi entren també, perquè la
recerca les ha trobades dins de l'Anatòlia, la Cilícia francesa i la zona italiana d'Antalya. **No
hi entren**: Kars, Ardahan i Batum (lot [1918-caucas](1918-caucas.md)); Síria, l'Iraq i Mossul;
la Tràcia occidental del 1919-1920 i Hatay (lots nous, a Pendent).

**Estat**: integrar — fase 2 (recerca) feta el 2026-10-07.

## Context

- CShapes, el 640: peces del 1918-10-30, 1920-04-26, 1923-07-24 i 1923-10-14.
- DADES §0.1: la sobirania (fila 1), el dia que té efecte (fila 2), la revolta amb govern (fila 5)
  i la guerra llarga per fases (fila 11). Un tractat que no va entrar en vigor no hi és: criteri
  nou a Decisions.
- DADES §1.1 (Lausana: signat el 1923-07-24, en vigor el 1924-08-06; el Dodecanès) i §1.3 (la capa
  d'ocupacions).
- Fitxers que tocarà la integració: `content/occupations/` (zones noves),
  `scripts/build-occupations.mjs` (`ZONES`, `LINES`), `content/countries.yaml` (el 640, només si
  es canvia el criteri del nom), `content/events/` i DADES §0.1 i §1.3.

### Què dona el mapa ara (consultat a `public/data/borders.topo.json`)

La forma del 640 a l'Anatòlia i la Tràcia és **la mateixa del 1918-03-03 al 1923**: les peces només
canvien per coses de fora d'aquest lot.

| Peça del 640 | Què canvia |
| --- | --- |
| 1918-03-03 → 1918-10-29 | Kars, Ardahan i Batum, de Brest-Litovsk (lot [1918-caucas](1918-caucas.md)). |
| 1918-10-30 → 1920-04-25 | Res: la mateixa forma que l'anterior. Mudros no hi canvia res. |
| 1920-04-26 → 1923-07-23 | Se'n separen Síria, el Líban i l'Iraq (San Remo), com a `occupied` i després `mandate`. |
| 1923-07-24 → 1923-10-13 | Se'n va Rodes (la correcció del Dodecanès, DADES §1.1). |
| 1923-10-14 → | La capital passa a Ankara. |

Per llocs: Constantinoble, Esmirna, Edirne, Ankara, Antalya, Adana, Antep i Kars són del 640 tots
els dies del 1918 al 1939. Alexandrúpoli és búlgara fins al 1919-11-26 i grega des del 1919-11-27
(Neuilly). Antakya i Alexandreta (Hatay) són del 640 també del 1920 al 1939. Imbros, Tènedos i
Castellorizo no surten a cap data: CShapes no hi té cap peça. No hi ha cap zona d'ocupació
d'aquests anys.

Que CShapes no dibuixi Sèvres ni la Tràcia grega és el que toca (§0.1, fila 1): el que falta és la
capa d'ocupacions.

## Troballes

Cada font té un número, que remet a la llista de [Fonts](#fonts), al final.

### L'armistici i Constantinoble

- 1918-10-30 — Armistici de Mudros, signat a bord de l'HMS *Agamemnon*; té efecte l'endemà a
  migdia (1918-10-31). Dona als aliats el dret d'ocupar els forts dels Dardanels i del Bòsfor, i
  qualsevol punt «in case of disorder»; els otomans es retiren al Caucas a la frontera d'abans de
  la guerra. [1]
- 1918-11-12 — «The first French troops entered the city on 12 November 1918, followed by British
  troops the next day.» La infotaula posa l'ocupació del 12-11-1918 al 4-10-1923. [2]
- 1918-11-13 — La flota aliada fondeja davant de Constantinoble (50-61 vaixells, segons les fonts
  que cita l'article). [2]
- 1919-02-10 — La comissió aliada parteix la ciutat en tres zones de policia: Stambul, francesa;
  Pera-Galata, britànica; Kadıköy i Üsküdar, italianes. [2]
- 1920-03-16 — Els aliats declaren l'ocupació militar de la ciutat. [2]
- 1923-08-23 — Turquia ratifica Lausana. [8] Els aliats comencen a evacuar Constantinoble el mateix
  dia i acaben el **1923-10-04**; les tropes turques hi entren el 1923-10-06. [2]
- 1923-10-13 — Ankara passa a ser la capital («Angora had officially replaced Constantinople as
  the new Turkish capital city, on 13 October 1923»). [27] CShapes ho posa el 1923-10-14.

### Esmirna

- 1919-05-15 — Els grecs desembarquen a Esmirna, amb l'autorització dels aliats. [3] [10]
- 1919 — Arístidis Sterguiadis, alt comissari a Esmirna; els aliats aproven la línia Milne, que
  els grecs no poden passar. [3] (Sense dia a la font.)
- 1920-08-10 — Sèvres, art. 69: «The city of Smyrna and the territory defined in Article 66
  remain under Turkish sovereignty. Turkey, however, transfers to the Greek Government the
  exercise of her rights of sovereignty». Art. 83: al cap de cinc anys d'entrar en vigor, el
  parlament local podria demanar a la Societat de Nacions la incorporació a Grècia. [5]
- 1922-09-08 — Les tropes gregues evacuen Esmirna al vespre. [4] (Una altra secció del mateix
  article diu el 9.)
- 1922-09-09 — La cavalleria turca entra a Esmirna. [4] [10] L'incendi, del 13 al 22 de
  setembre. [4]
- 1922-09-18 — «The expulsion of the Greek Army from Anatolia was completed on 18 September.» [10]

### El front grec a l'Anatòlia

- 1920-06-22 — Ofensiva grega d'estiu: passen la línia Milne. Balıkesir (30-6), Bursa (8-7),
  Uşak (29-8; un altre paràgraf diu 29-6), Simav (3-9). [13]
- 1921-01-11 i 1921-03-30 — Primera i segona batalles d'İnönü: els turcs aturen l'avanç. [10]
- 1921-07-10 → 07-24 — Batalla de Kütahya-Eskişehir: els grecs prenen Kütahya i Eskişehir
  (sense dia a la font). [14]
- 1921-08-23 → 09-13 — Batalla del Sakarya. Els grecs es retiren cap a Eskişehir i Afyonkarahisar,
  «to the lines that they had held in June». [10] [15]
- 1922-08-26 — Gran Ofensiva turca. [10]

### La Tràcia oriental

- 1920-07-25 — «Edirne was occupied by the Greek on 25 July 1920.» [12]
- 1920-08-10 — Sèvres, art. 84: Turquia renuncia a favor de Grècia als seus territoris d'Europa de
  fora de la frontera que fixa el tractat (la Tràcia oriental fins a la línia de Çatalca), i a
  Imbros i Tènedos. [5]
- 1922-10-11 — Armistici de Mudanya; Grècia s'hi adhereix el 13 o el 14 (l'article diu totes dues
  coses), i té efecte el 1922-10-15. [9] [10] Els grecs s'han de retirar fins al Maritsa en quinze
  dies, i el poder civil passa als turcs trenta dies després que els grecs se'n vagin. [9]
- 1922-11-12 — «The Greeks surrendered to the Allies the administration of eastern Thrace», que la
  passen als turcs. [11]
- 1923-07-24 — Lausana, art. 2: la frontera amb Grècia és el Maritsa, menys un tros a l'oest del
  riu davant d'Edirne (Karaağaç i Bosna-Köy, a Turquia). Art. 14: Imbros i Tènedos, «remaining
  under Turkish sovereignty». [7] Karaağaç va ser grec del 1920 al 1923. [29]

### Sèvres, que no va entrar en vigor

- 1920-08-10 — Signat a Sèvres. No el va ratificar ningú: ni l'Imperi Otomà ni Grècia («never
  ratified the treaty»). La Gran Assemblea d'Ankara va declarar nuls, el 7 de juny del 1920, els
  tractats que signés el govern d'Istanbul des del 16 de març. Lausana el va substituir. [6]
- Fins i tot dins de Sèvres, Esmirna es quedava sota sobirania turca (art. 69). [5]

### Ankara i Istanbul: dos governs

- 1920-04-23 — S'obre la Gran Assemblea Nacional a Ankara i es forma el govern provisional
  (Q2949827). [25]
- 1921-01-20 — Llei d'Organització Fonamental (n. 85). L'art. 3 diu, tal com la cita la font,
  «Türkiye Devleti, Büyük Millet Meclisi tarafından idare olunur»: l'estat es diu Türkiye. [26]
- 1922-11-01 — L'Assemblea aboleix el soldanat. [25]
- 1923-10-29 — Proclamació de la República. [25]

### La Cilícia francesa i els vilayets del sud

- 1918-11-17 — Primer desembarcament francès a Mersin (uns 15.000 homes); Tarsus, el 19 de
  novembre. [20] La infotaula de l'article comença la guerra el 1918-12-07 (Dörtyol). [20]
- 1918-12 — Es crea l'OETA Nord, el vilayet d'Adana, sota administració francesa (Macmunn i
  Falls, citats a [24]). Sense dia.
- 1918-1919 — Maraş, Antep i Urfa, britànics per Mudros; l'acord anglofrancès del 15 de setembre
  del 1919 en passa l'ocupació a França. [23] Antep, francesa des del 29-10-1919 o el 5-11-1919
  (la mateixa font diu totes dues coses; també l'1-4-1919). [22] [19]
- 1920-02-11 — Els francesos evacuen Maraş. [20] 1920-04-10/11, Urfa. [20] [22]
- 1921-10-20 — Acord d'Ankara entre França i el govern de la Gran Assemblea; la frontera, al sud
  del ferrocarril de Bagdad; Alexandreta, amb un règim especial. [21]
- 1921-12-25 — L'últim soldat francès surt d'Antep. [22]
- 1922-01-03 → 01-07 — Evacuació de la Cilícia: Mersin i Dörtyol des del 3; **Adana**, Ceyhan i
  Tarsus el 5; Osmaniye, l'últim, el 7. [20] Adana, el 5, també a [23].

### La zona italiana

- 1919-03-28 — «Antalya was occupied by the Italians.» [19] Les altres fonts: el 9 de març [16]
  i el 29 d'abril [18].
- 1919-04-24 — Tropes italianes a Konya. [19] Antalya, Bodrum i Kuşadası (Scalanova), els primers
  objectius [17]; també Alanya, Konya, Izmit i Eskişehir, per poc temps [16].
- 1921-06-01 — Els italians comencen a buidar Antalya. [18] Les últimes unitats deixen les
  ciutats de la costa el 1922 [16] [17]. Sense dia.

### Discrepàncies

| Què | Fonts | Per què | Criteri |
| --- | --- | --- | --- |
| Quan comença l'ocupació de Constantinoble | 12-11-1918, les primeres tropes franceses [2]; 13-11-1918, la flota i els britànics [2] | Un destacament francès arriba un dia abans que el gros de les forces. | **1918-11-12**: el dia que hi entren les primeres tropes, com a 1919-fiume (Šibenik, Fiume). |
| Quan s'acaba | 23-8-1923, comença l'evacuació; 4-10-1923, surten els últims; 6-10-1923, entren els turcs [2] | Són tres passos. | **Fins al 1923-10-04** (§1.3: el dia que l'ocupant se'n va). |
| Quan surten els grecs d'Esmirna | Vespre del 8-9-1922 [4]; 9-9-1922 [4, una altra secció] | La cavalleria turca entra el matí del 9. | **Fins al 1922-09-09**, el dia que la capital de la zona canvia de mans (§1.3). |
| La capital, Ankara | 13-10-1923 [27]; CShapes, 14-10-1923 | CShapes comença la peça l'endemà. | **1923-10-13**, la llei. Correcció petita a `CORRECTIONS` (o deixar-ho, si la peça no es pot moure un dia sense tocar-ne la forma). |
| L'adhesió grega a Mudanya | 13-10 i 14-10-1922 [9] | El mateix article diu totes dues coses. | No cal decidir-ho: l'efecte és el 15 [10] i la zona s'acaba més tard. |
| L'inici de la zona italiana | 9-3-1919 [16]; 28-3-1919 [19]; 29-4-1919 [18] | No s'ha trobat per què. El 9 de març pot ser l'ordre, no el desembarcament. | **No es dibuixa** fins que no hi hagi una font primària (Cecini, 2010). |
| La fi de la zona italiana | 1-6-1921, comença l'evacuació d'Antalya [18]; «autumn of 1922» [16]; 1922 [17] | Antalya es buida el 1921; altres guarnicions de la costa, el 1922. | El mateix: un buit (Pendent). |
| L'inici de la Cilícia francesa | 17-11-1918, Mersin [20]; 7-12-1918, Dörtyol [20]; desembre del 1918, OETA Nord [24] | L'article no cita cap font per al 17-11; l'OETA és de desembre sense dia. | Pendent de confirmar el dia que els francesos entren a **Adana**; la zona s'integra quan se sàpiga. |
| Antep, francesa des de | 1-4-1919 [22]; 29-10-1919 [19] [22]; 5-11-1919 [22] | La primera data és britànica; el 29 d'octubre, Kilis; el 5 de novembre, Antep. | Fora de les zones proposades (vegeu Decisions, 4). |

## Decisions

Proposades per a la integració. Les marcades amb ⇒ són criteri nou o canvi per a DADES §0.1.

1. ⇒ **Un tractat que no va entrar en vigor no canvia res al mapa de fronteres.** Ni la sobirania
   ni el nom: el territori és de qui era fins que un tractat en vigor (o una annexió formal) el
   canvia (fila 1). El tractat va com a fet, i el que es va fer d'acord amb ell sobre el terreny,
   a la capa d'ocupacions. Fila nova per a §0.1, amb l'exemple: Sèvres (1920), que no va ratificar
   ningú [6]; la Tràcia oriental i Esmirna continuen sent del 640, i Grècia hi surt com a ocupant.
   Diferent de la fila 2 («el tractat, el dia que es va signar encara que entrés en vigor més
   tard»): allà el tractat sí que va entrar en vigor.
2. ⇒ **Dos governs que es disputen el mateix estat no són una revolta.** El govern d'Ankara no es
   volia separar de res: deia ser el govern de l'estat («Türkiye Devleti») [25] [26], i el 1922-11-01
   va abolir el soldanat. Una sola peça, el 640, amb el nom de l'estat; els dos governs, a la fitxa
   i com a fets. Fila nova per a §0.1, amb aquest exemple. El nom no canvia: «Imperi otomà» fins al
   1922-10-31 i «Turquia» des del 1922-11-01, com ja diu `countries.yaml`. (El que es pot discutir és
   si «Turquia» hauria de començar el 1921-01-20, quan la llei d'Ankara anomena l'estat Türkiye. Es
   proposa que no: fins a l'abolició del soldanat, l'estat que reconeixien els altres era el de
   la Porta.)
3. **Constantinoble ocupada**, zona nova a `content/occupations/` (`constantinople.yaml`):
   - Del **1918-11-12** al **1923-10-04**. Dos trams de `control`, tots dos `occupation`: fins al
     1920-03-15 (causa: armistici de Mudros, 1918) i des del 1920-03-16 (causa: ocupació militar
     de Constantinoble, 1920).
   - `by: 200`. L'ocupació era interaliada (britànics, francesos i italians, cadascú amb un sector
     de la ciutat [2]), però el comandament aliat era britànic; el text ho ha de dir. Si la
     integració vol ensenyar els tres, cal que `by` accepti una llista (canvi a l'esquema; no
     cal per a aquest lot).
   - Forma: la província d'Istanbul de Natural Earth, a les dues ribes. És aproximada: la zona
     aliada era la ciutat i les ribes del Bòsfor; la província arriba a Silivri i Şile. La fitxa ho
     diu.
   - `wikipedia: Occupation of Constantinople` (Q2854228).
4. **La zona grega de l'Anatòlia**, per fases (§0.1, fila 11), perquè el front es va moure tres anys:
   - **Fase 1, Esmirna: 1919-05-15 → 1920-06-21.** La línia Milne. Causa: desembarcament a Esmirna,
     1919. Forma: línia dibuixada a mà a partir del mapa de la línia Milne (font a buscar en
     integrar; l'art. 66 de Sèvres [5] la descriu amb llocs, i és semblant però no igual).
   - **Fase 2: 1920-06-22 → 1921-07-09.** Després de l'ofensiva d'estiu: de Bursa a Uşak. Causa:
     ofensiva grega d'estiu, 1920.
   - **Fase 3: 1921-07-10 → 1922-09-09.** Eskişehir, Kütahya i Afyonkarahisar: la línia d'on els
     grecs surten cap al Sakarya i a on tornen [10] [15]. L'avanç fins al Sakarya (agost-setembre
     del 1921) i la retirada del 1922 no es dibuixen: és el conflicte. S'acaba amb Esmirna
     (§1.3: la capital marca la data), encara que el front es trenqués el 26 d'agost; el text ho
     diu.
   - Totes, `by: 350`, `kind: occupation`. Fins al 1920-08-10, ocupació autoritzada pels aliats;
     des d'aleshores, l'administració que donava Sèvres (art. 69-70), però Sèvres no va entrar en
     vigor (decisió 1): continua sent ocupació. Les línies a mà, amb la font al costat i com a
     aproximades.
   - `wikipedia: Occupation of Smyrna` (Q2451365) per a la fase 1; `Greco-Turkish War (1919–1922)`
     per a les altres.
5. **La Tràcia oriental grega**, zona nova (`eastern-thrace.yaml`):
   - Del **1920-07-25** (Edirne [12]) al **1922-11-12** (els grecs lliuren l'administració [11]).
     `by: 350`, `occupation`. Causa: ofensiva grega d'estiu, 1920.
   - Forma: les províncies d'Edirne, Kırklareli i Tekirdağ de Natural Earth, i la part europea de la
     de Çanakkale sense la península de Gal·lípoli. Aproximada: la línia de Çatalca no és la vora
     de la província d'Istanbul. La Constantinoble de la decisió 3 i aquesta no es poden trepitjar
     (el test ho comprova).
   - Del 1922-10-15 al 1922-11-12 els grecs se'n van i els aliats en vigilen el traspàs; no es
     proposa un tram aliat, perquè no s'ha trobat amb quines dates ni on.
6. **La Cilícia francesa**, zona nova quan se sàpiga el dia d'Adana (Pendent, 1):
   - Fins al **1922-01-05**, el dia que els francesos surten d'Adana [20] [23]. `by: 220`,
     `occupation`. Causa: armistici de Mudros, 1918.
   - Forma: les províncies d'Adana, Mersin i Osmaniye de Natural Earth (el vilayet d'Adana,
     aproximat).
   - Antep, Maraş i Urfa no hi entren: van ser britànics i després francesos, i es van perdre en
     moments diferents (Maraş el 1920-02-11, Urfa l'abril del 1920, Antep el 1921-12-25). Són
     poques setmanes o ciutats soles; amb el conflicte n'hi ha prou.
7. **La zona italiana no es dibuixa.** Tres dates d'inici i tres de final [16] [18] [19], i eren
   guarnicions en ciutats de la costa, no una administració d'un territori. Un buit és millor que
   una zona falsa (Pendent, 2).
8. **Conflictes i fets.** `greco-turkish-war.yaml` ja hi és (1919-05-15 → 1922-10-11). Fets nous,
   amb el seu enllaç: l'armistici de Mudros (1918-10-30), el desembarcament a Esmirna
   (1919-05-15), la Gran Assemblea a Ankara (1920-04-23), Sèvres (1920-08-10, dient que no va
   entrar en vigor), l'armistici de Mudanya (1922-10-11), l'abolició del soldanat (1922-11-01),
   Lausana (1923-07-24) i la República (1923-10-29). Un conflicte nou, la guerra francoturca
   (1918-12-07 → 1921-10-20, [20]), si la integració vol la Cilícia.
9. **Ankara, capital des del 1923-10-13**, no del 14. Correcció a `CORRECTIONS` amb fila a DADES
   §1.1 (vegeu Discrepàncies).
10. **No es toca**: Karaağaç (grec del 1920 al 1923 [29]) és d'uns pocs km², per sota de l'error
    de CShapes; Imbros i Tènedos (gregues de fet fins al 1923, turques per Lausana [7]) no són a
    CShapes.

## Fet

- Recerca: aquest fitxer. Commits a la branca `history-map/recerca-1919-turquia`.

## Pendent

1. **El dia que els francesos entren a Adana** (1918), per obrir la zona de la Cilícia (decisió 6).
   Fonts a mirar: Macmunn i Falls, *Military Operations: Egypt and Palestine* (1930), p. 623; la
   història de l'exèrcit francès (*Les armées françaises dans la Grande Guerre*).
2. **La zona italiana**, amb Cecini, *Il Corpo di Spedizione italiano in Anatolia (1919-1922)*
   (USSME, 2010): on hi havia guarnicions, i quan van arribar i se'n van anar.
3. **Les línies del front grec** de les tres fases (decisió 4): un mapa amb font per a cada fase
   (Llewellyn Smith, *Ionian Vision*, o els de l'estat major grec).
4. **La península de Gal·lípoli i Çanakkale** (britàniques, 1918-1923) i **Izmit** (britànica fins
   al 1921): no s'han buscat les dates. Es poden afegir a la zona de Constantinoble o anar a part.
5. Lots nous:
   - `1919-tracia-occidental`: del tractat de Neuilly (1919-11-27) a l'entrada grega (maig del
     1920), la Tràcia occidental la governaven els aliats (el general Charpy) [28]: és la fila 8
     de §0.1 (territori cedit sense amo). CShapes la fa grega des de Neuilly.
   - `1920-hatay`: el sanjak d'Alexandreta va ser de Síria (mandat francès) de l'acord d'Ankara
     (1921) al 1938-1939 [21]; CShapes el dona al 640 tots els anys.
   - `1918-orient-mitja`: Síria, el Líban, l'Iraq i Mossul, que CShapes treu del 640 el
     1920-04-26 (San Remo), mentre que la renúncia turca és de Lausana (art. 16 [7]); Mossul, fins
     al tractat d'Ankara del 1926.

## Relleu

- **Fase**: 2 (recerca) feta; ve la 3 (integració), en una sessió nova des de `main`.
- **Primera tasca**: les files noves de DADES §0.1 (decisions 1 i 2), i després la zona de
  Constantinoble (decisió 3), que és la més senzilla: una província de Natural Earth i dues
  dates.
- **Llegir**: aquest fitxer (Context, Discrepàncies, Decisions i Pendent), DADES §0.1 i §1.3, i una
  zona d'exemple feta amb Natural Earth (`content/occupations/alsace-moselle.yaml` i la seva
  entrada a `ZONES`). **No cal** tornar a buscar les dates que ja hi ha: només les de Pendent.
- Les fases del front grec (decisió 4) necessiten primer el punt 3 de Pendent; es poden deixar per
  a una segona sessió d'integració.
- PR d'aquesta fase: <https://github.com/ArnauM13/history-map/pull/16>.

## Fonts

1. «Armistice of Mudros», Viquipèdia en anglès (cita Karsh, *Empires of the Sand*, 2001, p. 327).
   <https://en.wikipedia.org/wiki/Armistice_of_Mudros>
2. «Occupation of Constantinople», Viquipèdia en anglès (cita Sözcü, 2017; arxiu dels Carabinieri;
   arxius de la Societat de Nacions). <https://en.wikipedia.org/wiki/Occupation_of_Constantinople>
3. «Occupation of Smyrna», Viquipèdia en anglès (cita Llewellyn Smith, *Ionian Vision*).
   <https://en.wikipedia.org/wiki/Occupation_of_Smyrna>
4. «Burning of Smyrna», Viquipèdia en anglès (cita Clogg, 1992; Dobkin, 1971; Horton, 1926;
   Naimark, 2002). <https://en.wikipedia.org/wiki/Burning_of_Smyrna>
5. Tractat de Sèvres, 10 d'agost del 1920, seccions IV (Esmirna, art. 65-83) i V (Grècia, art.
   84-87), text anglès. <https://www.fransamaltingvongeusau.com/documents/dl1/h1/1.1.18.pdf>
6. «Treaty of Sèvres», Viquipèdia en anglès (cita Helmreich, 1974; Yakut, 2022).
   <https://en.wikipedia.org/wiki/Treaty_of_S%C3%A8vres>
7. Tractat de Lausana, 24 de juliol del 1923, art. 2, 12, 14-16 i 143, text anglès. World War I
   Document Archive (BYU). <https://wwi.lib.byu.edu/index.php/Treaty_of_Lausanne>
8. «Treaty of Lausanne», Viquipèdia en anglès (cita Martin, *Treaties of Peace 1919-1923*, 1924;
   Akçam i Kurt, 2015). <https://en.wikipedia.org/wiki/Treaty_of_Lausanne>
9. «Armistice of Mudanya», Viquipèdia en anglès (cita Psomiades, *The Eastern Question*, 2000).
   <https://en.wikipedia.org/wiki/Armistice_of_Mudanya>
10. «Greco-Turkish War (1919–1922)», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Greco-Turkish_War_(1919%E2%80%931922)>
11. Foundation of the Hellenic World, «The Armistice of Mudania».
    <https://www.fhw.gr/chronos/13/en/foreign_policy/institutions/10.html>
12. Nurten Çetin, «Edirne during the National Struggle», a *Local History of the National Struggle
    1918-1923*, vol. 10, TÜBA.
    <https://tuba.gov.tr/en/publications/non-periodical-publications/history/local-history-of-the-national-struggle-1918-1923-vol-10-edirne-kirklareli-tekirdag/edirne-during-the-national-struggle>
13. «Greek Summer Offensive», Viquipèdia en anglès (cita Sandler, 2002; Jukes, Simkins i Hickey,
    2002). <https://en.wikipedia.org/wiki/Greek_Summer_Offensive>
14. «Battle of Kütahya–Eskişehir», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Battle_of_K%C3%BCtahya%E2%80%93Eski%C5%9Fehir>
15. «Battle of Sakarya», Viquipèdia en anglès (cita Llewellyn Smith, pp. 233-234).
    <https://en.wikipedia.org/wiki/Battle_of_Sakarya>
16. «Italian occupation of Adalia», Viquipèdia en anglès (cita Cecini, 2010 i 2014).
    <https://en.wikipedia.org/wiki/Italian_occupation_of_Adalia>
17. «Corpo di spedizione italiano in Anatolia», Viquipèdia en italià.
    <https://it.wikipedia.org/wiki/Corpo_di_spedizione_italiano_in_Anatolia>
18. Feridun Emecen, «Antalya», *TDV İslâm Ansiklopedisi*. <https://islamansiklopedisi.org.tr/antalya>
19. Ministeri de Cultura i Turisme de Turquia, cronologia del 1919.
    <https://ktb.gov.tr/EN-103930/1919.html>
20. «Franco-Turkish War», Viquipèdia en anglès (les dates de l'evacuació, sense cita).
    <https://en.wikipedia.org/wiki/Franco-Turkish_War>
21. «Treaty of Ankara (1921)», Viquipèdia en anglès (cita *League of Nations Treaty Series*, vol.
    54). <https://en.wikipedia.org/wiki/Treaty_of_Ankara_(1921)>
22. «Güney Cephesi (Kurtuluş Savaşı)», Viquipèdia en turc.
    <https://tr.wikipedia.org/wiki/G%C3%BCney_Cephesi_(Kurtulu%C5%9F_Sava%C5%9F%C4%B1)>
23. Cengiz Şavkılı, «Adana'nın düşman işgalinden kurtuluşu…», *Afyon Kocatepe Üniversitesi Sosyal
    Bilimler Dergisi*, 24 (1), 2022, pp. 350-364.
    <https://acikerisim.aku.edu.tr/items/63b2f114-3828-4c2d-b4eb-85888c8f2844/full>
24. «Occupied Enemy Territory Administration», Viquipèdia en anglès (cita Macmunn i Falls, 1930).
    <https://en.wikipedia.org/wiki/Occupied_Enemy_Territory_Administration>
25. «Government of the Grand National Assembly», Viquipèdia en anglès (cita Gingeras, *Eternal
    Dawn*, 2019). <https://en.wikipedia.org/wiki/Government_of_the_Grand_National_Assembly>
26. Kemal Gözler, «1921 Teşkilât-ı Esasiye Kanunu», anayasa.gen.tr (l'art. 3, citat al comentari,
    no transcrit). <https://www.anayasa.gen.tr/1921ay.htm>
27. «Ankara», Viquipèdia en anglès (cita Britannica). <https://en.wikipedia.org/wiki/Ankara>
28. «Western Thrace», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Western_Thrace>
29. «Karaağaç, Edirne», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Karaa%C4%9Fa%C3%A7,_Edirne>
