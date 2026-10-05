# 1919-fiume

**Pregunta**: com es dibuixa l'Adriàtic del nord del 1918 al 1920: l'ocupació italiana de l'Ístria
i Fiume, i la Regència del Carnaro de D'Annunzio.

**Abast**: del 1918-11-03 a Rapallo (1920-11-12). El que ve després ja és a DADES §1.1. La recerca
ha mostrat que tres coses d'aquest lot continuen després de Rapallo i hi entren: la Regència, que
no accepta el tractat fins al 1920-12-28; Krk i Rab, on els legionaris desembarquen l'endemà de
Rapallo; i la Dalmàcia ocupada, que Itàlia evacua del 1921 al 1923.

**Estat**: integrar — fase 2 (recerca) feta el 2026-10-05, amb una segona passada per contrastar
les fonts i buscar-hi consens; falta la fase 3.

## Context

- DADES §1.2 ho dona com a error conegut: CShapes ho posa dins de Iugoslàvia (345) i no hi ha la
  Regència del Carnaro. DADES §1.1, files de Rapallo i de l'Estat Lliure de Fiume.
- Criteris de DADES §0.1 que hi toquen: la sobirania (fila 1), el dia que té efecte (fila 2), la
  revolta amb govern (fila 5), el territori cedit sense amo (fila 8) i el territori ocupat que no
  és de cap estat (fila 10).
- Fitxers: `scripts/build-borders.mjs` (`LINES`, `AREAS`, `CORRECTIONS`, `FIUME_STATE`),
  `content/occupations/`, `scripts/build-occupations.mjs`, `content/countries.yaml`.

### Què dona CShapes ara (consultat a `public/data/borders.topo.json`)

| Lloc | 1918-11-03 → 1919-09-09 | 1919-09-10 → 1920-06-03 | 1920-06-04 → 1920-11-11 | Des de 1920-11-12 (amb les correccions) |
| --- | --- | --- | --- | --- |
| Trieste, Gorízia, Tarvisio | Àustria (305) | Itàlia (325) | Itàlia | Itàlia |
| Koper, Sežana, Pazin, Opatija, Idrija, Postojna, Zara | Àustria | **Iugoslàvia (345)** | Iugoslàvia | Itàlia |
| Fiume | **Àustria** | **Iugoslàvia** | Iugoslàvia | Estat Lliure (Q548114) |
| Sušak, Zagreb | Hongria (310) | Hongria | Iugoslàvia | Iugoslàvia |
| Ljubljana, Šibenik | Àustria | Iugoslàvia | Iugoslàvia | Iugoslàvia |

CShapes canvia de mans el dia de Saint-Germain (1919-09-10) i el de Trianon (1920-06-04), i
entre Saint-Germain i Rapallo dibuixa una frontera que no va existir mai: tota l'Ístria i el
Carst, fins a les portes de Trieste, iugoslaus. Fiume no va ser mai austríaca (era hongaresa) ni
iugoslava.

## Troballes

Cada font té un número, que remet a la llista de [Fonts](#fonts), al final.

### L'armistici i l'ocupació italiana

- 1918-11-03 — Armistici de Villa Giusti, signat el dia 3; l'alto el foc, el 4 a les 15:00. Obliga
  Àustria-Hongria a evacuar el Tirol del Sud, Tarvisio, la vall de l'Isonzo, Gorízia, Trieste,
  l'Ístria, la Carniola occidental i part de Dalmàcia: la línia del pacte de Londres (1915). [1]
- 1918-11-03 — Les tropes italianes prenen Trieste, Rovinj i Pola el mateix dia de la signatura. [2]
- 1918-11-03 — El general Petitti di Roreto pren el govern de la Venezia Giulia a Trieste
  (Governatorato militare). Decret-llei del 4 de juliol del 1919, n. 1081, i R.D. del 24 de juliol
  del 1919, n. 1251: passa a ser el Commissariato generale civile, que depèn del president del
  Consell de Ministres, fins al R.D.L. del 17 d'octubre del 1922, n. 1353. [3]
- 1918-11-04 — Itàlia desembarca a Zara a les 14:30-14:45, abans de l'alto el foc, i ocupa Vis,
  Korčula, Mljet i Lastovo. [2] [4]
- 1918-11-06 — Dues naus italianes entren al port de Šibenik a la tarda: comença l'ocupació. [5]
  («Diplomatic struggle for Zadar» diu «5-6 de novembre» [4].)
- 1918-11-13, 11-21, 11-26 — Itàlia ocupa Hvar (13), Pag (21), i Krk i Rab (26). [4] Knin, l'1 de
  gener del 1919; tota la zona, el 20 de febrer del 1919. [4] [6]
- 1918-11-19/21 — Governatorato della Dalmazia, amb l'almirall Millo, primer a Šibenik i des del
  gener del 1919 a Zara; s'acaba amb Rapallo. Zona: la costa de Zara a Šibenik i l'interior fins a
  Knin i Drniš. L'article posa el decret el 19 i la creació el 21. [6]
- Krk: «L'occupazione italiana durò dal 1918 al 1921», amb els arditi de D'Annunzio als últims
  mesos. [7]

### Saint-Germain, Trianon i Rapallo: què es va cedir, a qui i quan

- 1919-09-10 — Saint-Germain, art. 36: «Austria renounces, so far as she is concerned, in favour
  of Italy all rights and title over the territory of the former Austro-Hungarian Monarchy situated
  beyond the frontiers of Austria laid down in Article 27 (2) [...] and lying between those
  frontiers, the former Austro-Hungarian frontier, the Adriatic Sea, and the eastern frontier of
  Italy **as subsequently determined**», i també el que altres tractats reconeguin com a italià.
  L'art. 46 fa el mateix a favor de l'Estat dels Serbis, Croats i Eslovens. En vigor, el
  1920-07-16. [8] [9]
- 1920-06-04 — Trianon, art. 53: «Hungary renounces all rights and title over Fiume and the
  adjoining territories which belonged to the former Kingdom of Hungary and which lie within the
  boundaries which may subsequently be fixed». No diu a favor de qui. [10]
- 1920-09-26 — Llei italiana n. 1322 (converteix el R.D. del 6 d'octubre del 1919, n. 1804):
  «I territori attribuiti all'Italia con questo Trattato e con gli atti successivi fanno parte
  integrante del Regno d'Italia». [11]
- 1920-11-12 — Rapallo: la frontera, Zara, Cres, Lošinj, Lastovo i Palagruža a Itàlia; l'Estat
  Lliure de Fiume. [12] Llei del 19 de desembre del 1920, n. 1778, que l'aprova: els territoris
  que el tractat dona a Itàlia en fan «parte integrante». [13] Intercanvi de ratificacions, el
  1921-02-02. [14]
- **El consens**: la Venezia Giulia «was adjudicated to Italy by the 1919 Treaty of Saint-Germain
  and finally annexed according to the 1920 border Treaty of Rapallo» [15]; la Viquipèdia
  italiana i l'ANVGD diuen que Rapallo «unì all'Italia Trieste, Gorizia, Istria e Zara» [12] [16].
  Saint-Germain n'és la base; el canvi de sobirania, tots el posen a Rapallo.

### Fiume

Font principal: D. L. Massagrande, «I governi di Fiume indipendente 1918-1924» [17], que segueix L.
Peteani, *La posizione internazionale di Fiume dall'armistizio all'annessione* (1940), i reprodueix
els documents.

- 1918-10-23 — Tropes procroates entren a Fiume. [18]
- 1918-10-29 — L'últim governador hongarès lliura els poders al podestà i se'n va. El Comitato
  Nazionale Fiumano se'ls queda, es diu Consiglio Nazionale Italiano i fa un Comitato Direttivo
  (president, Antonio Grossich): «il primo governo di Fiume indipendente». [17] [18]
- 1918-10-30 — Proclama del Consiglio Nazionale. Massagrande, amb Peteani, hi llegeix la
  «provvisoria indipendenza» de Fiume en espera de l'annexió [17]; la Viquipèdia anglesa, que
  «proclaimed the annexation of Fiume to Italy» [19]. El mateix dia, Rojčević, comissari del Consell
  Nacional de Zagreb, també hi pren l'autoritat; el 31, el ban de Croàcia nomena Lenac. El control
  croat no va més enllà del palau del govern, la capitania i l'estació: un «condominio di fatto».
  [17]
- 1918-11-02 i 11-04 — Naus americanes (el 2) i italianes (el 4) entren al port. [18]
- 1918-11-15 — Arriba de Zagreb un batalló de 700 voluntaris iugoslaus. [18]
- 1918-11-17 — Entren les tropes italianes del general San Marzano, per Kastav, Opatija i
  Volosko; baixen la bandera croata del palau del govern. El comitè croat es dissol. [17] [20]
  Ocupació interaliada (italians, francesos, britànics, americans), amb comandament italià; uns
  20.000 soldats italians a principis del 1919. Els «Vespri fiumani», fins al 6 de juliol del
  1919. [2] [21]
- 1919-09-12 — D'Annunzio entra a Fiume des de Ronchi; el 13 hi pren el comandament militar. El
  20 de setembre el Consiglio Nazionale li dona els poders i ell els hi torna el mateix dia: el
  govern continua sent el Comitato Direttivo, amb el vistiplau del Comando. [17]
- 1919-12-18 — Plebiscit sobre el *modus vivendi* del govern italià; D'Annunzio l'anul·la. [21] [22]
- 1920-08-12 — Discurs de D'Annunzio que anuncia la Regència. [22] [23]
- 1920-09-08 — Proclamació de la Regència italiana del Carnaro, des del balcó del palau del govern,
  i promulgació de la Carta del Carnaro. [17] [22] Govern provisional de set rectors el 23 de
  setembre; el consell municipal l'aprova el 29. [17] [24]
- 1920-11-12 — Rapallo crea l'Estat Lliure de Fiume; la Regència no l'accepta. Els EUA, França i
  el Regne Unit el reconeixen de seguida. [25]
- 1920-11-13 i 11-15 — Els legionaris desembarquen a Krk (el 13) i a Rab (el 15), que Rapallo
  dona a Iugoslàvia; a Krk, uns trenta al principi i un miler a principis de desembre. El 30 de
  novembre Caviglia els ordena sortir-ne abans del 2 de desembre; el 19 de desembre, ultimàtum fins
  al 21. [24] [26]
- 1920-12-24 — L'exèrcit italià (Caviglia) ataca Fiume: el «Nadal de sang». Treva el 25; tornen a
  lluitar el 26. Unes cinquanta morts. [22] [24] [27]
- 1920-12-28 — D'Annunzio i el govern provisional de la Regència dimiteixen i lliuren els poders al
  podestà (Riccardo Gigante) i a la representació municipal; el Consell de la Regència accepta
  «subire» Rapallo. El 29, una segona carta de dimissió («La Rinunzia»). [17] [24]
- 1920-12-31 — Acord d'Abbazia, a les 16:30 (Ferrario pel govern italià, Gigante i Host-Venturi
  per Fiume). La representació municipal reprèn els poders d'estat com a Consiglio Nazionale i
  ratifica l'acord i Rapallo. L'1 de gener del 1921 encarrega el govern a Grossich. [17] [28]
  L'acord diu que els legionaris han d'evacuar Krk, Rab i Sveti Marko a partir del 5 de gener. [29]
- 1921-01 — Els legionaris deixen Krk i Rab «do kraja siječnja 1921» (abans d'acabar el gener).
  [26] D'Annunzio se'n va de Fiume el 18 de gener. [22] [24]
- Territori de la Regència: el corpus separatum, uns 21 km² (la ciutat, Kozala, Drenova i Plase)
  [30]; Wikidata li dona 28 km², la xifra de l'Estat Lliure [31] [25]. El 31 de desembre la
  representació municipal recorda que el corpus separatum comprèn el Delta i Port Baross «e che
  attualmente lo comprende anche di fatto»: els tenien els legionaris. [17]

### Després de Rapallo: l'evacuació

Font principal: A. Fiorio, «Tra Italia e Jugoslavia: la Dalmazia e la difficile applicazione del
Trattato di Rapallo» [14], que segueix L. Monzali, *Gli italiani di Dalmazia*.

- 1921-03-08 — Acord de Split: tres fases. La primera, des de l'1 d'abril: els districtes de Pag,
  Obrovac, Kistanje, Drniš, Knin, Trogir i Split i les illes de Korčula. La segona, des del 20
  d'abril: Šibenik, Skradin i Benkovac. La tercera: el districte de Zara i Zaravecchia que no és
  italià, ajornada. [14]
- 1921-06-12 — Els italians deixen Šibenik; el 13 hi entra l'exèrcit iugoslau. [32] (Fiorio cita
  l'informe de l'evacuació, del 13 de juny [14].)
- 1921-04-25 — Fi de l'ocupació italiana de Krk, segons un resum de cerca que no he pogut lligar a
  cap text; l'article de Bozanić [7] diu només «1918-1921». No es fa servir fins que es confirmi.
- 1922-10-23 — Acords de Santa Margherita; Itàlia els aprova per la llei del 21 de febrer del
  1923, n. 281. [14] [33] La «III zona» al voltant de Zara, ocupada «fino al 1923». [34]
- Sušak: Rapallo la deixa iugoslava, però l'exèrcit italià no se'n va fins al març del 1923. [18]
- 1922-03-03 i 03-17 — Cop dels feixistes a Fiume i entrada de les tropes italianes; el govern
  legal fuig a Kraljevica. [25] (Fora de l'abast: vegeu el pendent.)

### Discrepàncies

| Què | Fonts | Per què | Criteri |
| --- | --- | --- | --- |
| Quan la Venezia Giulia és italiana | Saint-Germain, 1919-09-10 [8]; Rapallo, 1920-11-12 [12] [15] [16]; la llei 1778, 1920-12-19 [13] | Saint-Germain renuncia a favor d'Itàlia però sense dir fins on; Rapallo diu fins on, i és el que la historiografia pren com a annexió. La llei és la ratificació. | **Rapallo**, com ja diu DADES §0.1 (fila 2). La primera passada d'aquest lot proposava Saint-Germain; no hi ha cap font que ho faci, i es descarta. |
| La proclamació de la Regència | 12 d'agost [23], 8 d'agost [22, WP it], 8 de setembre [17] [22] | El 12 d'agost D'Annunzio l'anuncia en un discurs; el 8 de setembre la proclama formalment i promulga la Carta. El «8 d'agost» de la WP italiana sembla una errada per «8 de setembre». | La proclamació (§0.1, fila 2): **1920-09-08**. |
| La fi de la Regència i l'inici de l'Estat Lliure | 12 de novembre (Rapallo) [12]; 28 (dimissió) [17]; 29 (segona carta) [17]; 30 (WP en: «capitulated» [27]; Wikidata, inici de l'Estat Lliure [31]); 31 de desembre (Abbazia) [28] | De dret, l'Estat Lliure neix a Rapallo; de fet, la Regència el governa fins que dimiteix. El 28 deixa d'existir: lliura els poders a la ciutat. El 31 la ciutat accepta Rapallo. | La revolta, amb les dates del seu govern (§0.1, fila 5), i el final com una abdicació: **la Regència fins al 1920-12-27; l'Estat Lliure, des del 1920-12-28**. |
| Què proclama el Consiglio Nazionale el 30 d'octubre | La independència provisional [17]; l'annexió a Itàlia [19] | El text proclama la unió a Itàlia «per autodecisione»; com que Itàlia no l'accepta, Peteani en dedueix que Fiume va ser un estat de fet fins al 1924. Les dues lectures no es contradiuen: governava sol, mentre demanava l'annexió. | Fiume té un govern propi des del 30 d'octubre (§0.1, fila 5). |
| Quan entren les tropes italianes a Fiume | 16 de novembre [18]; 17 de novembre [17] [20] | La WP anglesa no cita el dia a la font; Massagrande i FiumeFil, sí. | **1918-11-17**. |
| Quan entren els italians a Šibenik | 5-6 de novembre [4]; 6 de novembre, a la tarda [5] | El web de la ciutat ho data amb l'hora. | **1918-11-06**. |
| Krk i Rab el 1918 | Ocupades el 26 de novembre del 1918 [4], ocupació «1918-1921» [7]; però el pacte de Londres les deixava a Croàcia | El pacte de Londres i la línia de l'armistici no són el mateix: Itàlia va ocupar més del que el pacte li donava. | Itàlia les ocupa des del **1918-11-26** fins a l'evacuació (dia pendent); els legionaris, del 13 i el 15 de novembre del 1920 al gener del 1921. |

## Decisions

Proposades per a la integració. Les marcades amb ⇒ són criteri nou o canvi per a DADES §0.1.

1. **Fiume és una peça pròpia des del 1918-10-30**, el dia de la proclama del Consiglio Nazionale.
   No és austríaca ni iugoslava. És la fila 5 de §0.1: un govern sobre el territori, el Consiglio
   Nazionale i el seu Comitato Direttivo [17] [19], amb les dates d'aquest govern. Després de
   Trianon (1920-06-04) també és la fila 8: un territori cedit sense amo, amb el seu govern
   provisional. Tres noms al llarg del temps:
   - 1918-10-30 → 1920-09-07: Fiume (el Consiglio Nazionale Italiano; des del 12-9-1919, amb
     D'Annunzio al comandament militar). No té QID propi: Q548114, amb el nom segons la data.
   - 1920-09-08 → 1920-12-27: Regència italiana del Carnaro, **Q1423581** [31]. Noms: ca «Regència
     Italiana del Carnaro», es «Regencia italiana de Carnaro», en «Italian Regency of Carnaro».
   - 1920-12-28 → 1924-02-21: Estat Lliure de Fiume, Q548114 (ara comença el 1920-11-12).
   La forma, fins a Rapallo, és el corpus separatum, sense la franja de costa que Rapallo hi va
   afegir al sud de Kastav; amb el Delta i Port Baross, que els legionaris tenien de fet, si es
   poden dibuixar amb una font.
2. **La Venezia Giulia, italiana des de Rapallo, com ara.** És el consens (troballes i discrepàncies)
   i el criteri que ja hi ha a §0.1. Entremig hi ha dos trams:
   - **1918-11-03 → 1919-09-09: Àustria** (fila 1), com ja fa CShapes, amb el control italià a la
     capa d'ocupacions.
   - **1919-09-10 → 1920-11-11: territori ocupat que no és de cap estat** (fila 10). Àustria hi ha
     renunciat a Saint-Germain, i ningú no el té fins que Rapallo diu on és la frontera: ni Itàlia
     ni el Regne SCS. Peça pròpia, amb l'estatus de territori ocupat, i Itàlia a la capa
     d'ocupacions. És el que ja es fa amb Cisjordània del 1967 al 1988.
   - Abasta el que Itàlia governava i Saint-Germain deixava per fixar: la Venezia Giulia
     (`AREAS.rapallo` sense Zara; nom: Venezia Giulia) i la zona dàlmata (nom: Dalmàcia), amb Krk
     i Rab. La resta del Regne SCS ho és des de Saint-Germain, com ara.
   ⇒ Exemple per a la fila 10 de §0.1: la Venezia Giulia i la Dalmàcia ocupades, del 1919 al 1920.
3. **La capa d'ocupacions**, amb quatre zones noves:
   - Venezia Giulia: Itàlia, `occupation`, del 1918-11-03 (Trieste) al 1920-11-11. Causa:
     armistici de Villa Giusti.
   - Fiume: Itàlia (amb els aliats), `occupation`, del 1918-11-17 al 1919-09-11. El text explica
     l'ocupació interaliada i que la ciutat la governava el Consiglio Nazionale.
   - Dalmàcia: la zona del Governatorato della Dalmazia (Šibenik, Knin, Drniš, Pag, i les illes de
     la línia de Londres), Itàlia, del 1918-11-04 al 1921-06-12, l'evacuació de Šibenik, la
     capital del primer governatorat (regla de les zones grans). Zara hi és fins al 1920-11-11. La
     tercera zona, al voltant de Zara, a part, fins al 1923 (dia pendent).
   - Krk i Rab: Itàlia, del 1918-11-26 al 1920-11-12; la Regència (Q1423581), del 13 de novembre
     del 1920 (Rab, el 15) fins al gener del 1921; i Itàlia, fins al lliurament (dia pendent). Cal
     que `by` admeti el QID de la Regència.
4. **No es dibuixa l'avanç italià més enllà de la línia** (Vrhnika i Logatec, novembre del 1918):
   va durar dies i no hi ha cap font amb les dates.

## Fet

- 2026-10-05 — Primera passada de la recerca.
- 2026-10-05 — Segona passada: consens i fonts. Canvia la decisió 2 (Rapallo, no Saint-Germain).
  Es fixen el QID de la Regència i els dies de Šibenik, de l'entrada a Fiume i de Krk i Rab.
  Cap canvi al codi.

## Pendent

Per a la fase 3, en aquest ordre:

1. Dates que falten: el dia que els legionaris surten de Krk i de Rab (el gener del 1921) i el dia
   que Itàlia els lliura (l'abril del 1921?); el de la tercera zona de Dalmàcia (1923). Les
   fonts per mirar: D. L. Massagrande, *Italia e Fiume 1921-1924* (1982), i el text sencer de
   Martinaš [26] i Bozanić [7] (Hrčak demana un captcha).
2. Si no es troben, la zona s'acaba el dia que se sap segur i el text ho diu («fins al gener del
   1921»): un buit és millor que una dada falsa.
3. `build-borders.mjs`: una línia `corpusSeparatum` a `LINES` (el límit del terme de Fiume a
   l'oest, a Kantrida); una correcció que dona el corpus separatum a la peça de Fiume des del
   1918-10-30 (traient-lo de 300, 305 i 345); les dues peces de territori ocupat (decisió 2) del
   1919-09-10 al 1920-11-11; l'Estat Lliure, des del 1920-12-28.
4. `content/occupations/`: les zones de la decisió 3, amb les fonts d'aquest fitxer.
5. DADES: l'exemple nou de la fila 10 de §0.1, les files de §1.1, i treure l'Adriàtic del
   1919-1920 de §1.2.
6. Comprovar al mapa (fase 4): Trieste, Koper, Pazin, Postojna, Fiume, Sušak, Kastav, Krk, Zara i
   Šibenik, a 1918-11-02, 1918-11-03, 1918-11-17, 1919-09-10, 1919-09-12, 1920-06-04, 1920-09-08,
   1920-11-13, 1920-12-28 i 1921-07-01.

**Lots nous que n'han sortit**

- [1918-iugoslavia](1918-iugoslavia.md): CShapes deixa Eslovènia i Dalmàcia dins d'Àustria i
  Croàcia dins d'Hongria fins a Saint-Germain i Trianon, mentre que l'Estat dels Serbis, Croats i
  Eslovens (1918-10-29) i el Regne SCS (1918-12-01) les governaven.
- Fiume del 1922 al 1924: el cop feixista (1922-03-03) i l'ocupació italiana (des del 1922-03-17)
  fins a l'annexió [25]; i Sušak, el Delta i Port Baross, ocupats per Itàlia fins al març del 1923
  [18]. Van a la capa d'ocupacions; no tenen lot.

## Fonts

1. «Armistice of Villa Giusti», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Armistice_of_Villa_Giusti>
2. «Allied occupation of the eastern Adriatic», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Allied_occupation_of_the_eastern_Adriatic>
3. Sistema Archivistico Nazionale, «Governatorato della Venezia Giulia poi Commissariato generale
   civile per la Venezia Giulia».
   <http://dati.san.beniculturali.it/SAN/complarc_GGASI_san.cat.complArch.50183>
4. «Diplomatic struggle for Zadar», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Diplomatic_struggle_for_Zadar>
5. Grad Šibenik, «Na današnji dan, 06. studenog 1918. godine».
   <https://www.sibenik.hr/clanci/na-danasnji-dan-06-studenog-1918-godine/4432.html>
6. «Governorate of Dalmatia», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Governorate_of_Dalmatia>
7. A. Bozanić, «Prvi svjetski rat i promjene na otoku Krku za vrijeme i nakon rata», *Krčki
   zbornik*, 2021, pp. 153-167 (resum en anglès). <https://hrcak.srce.hr/clanak/411593>
8. Tractat de Saint-Germain-en-Laye (1919), text en anglès.
   <http://www.forost.ungarisches-institut.de/pdf/19190910-1.pdf>
9. «Treaty of Saint-Germain-en-Laye (1919)», Viquipèdia en anglès.
   <https://en.wikipedia.org/wiki/Treaty_of_Saint-Germain-en-Laye_(1919)>
10. Tractat de Trianon (1920), text en anglès. <http://www.gwpda.org/versa/tri1.htm>
11. Prassi Italiana di Diritto Internazionale (CNR), L. 26 settembre 1920 n. 1322.
    <http://www.prassi.cnr.it/prassi/content.html?id=2414>,
    <http://www.prassi.cnr.it/prassi/altriAtti.html?id=386>
12. «Trattato di Rapallo (1920)», Viquipèdia en italià.
    <https://it.wikipedia.org/wiki/Trattato_di_Rapallo_(1920)>
13. Prassi Italiana di Diritto Internazionale (CNR), L. 19 dicembre 1920 n. 1778.
    <http://www.prassi.cnr.it/prassi/content.html?id=1979>
14. A. Fiorio, «Tra Italia e Jugoslavia: la Dalmazia e la difficile applicazione del Trattato di
    Rapallo», Università di Trieste (OpenstarTs).
    <https://www.openstarts.units.it/bitstream/10077/32190/3/07-Fiorio.pdf>
15. «Venezia Giulia and the Treaty of Rapallo», Arcipelago Adriatico.
    <https://www.arcipelagoadriatico.it/en/la-venezia-giulia-e-il-trattato-di-rapallo/>
16. ANVGD, «Il Trattato di Rapallo unì all'Italia Trieste, Gorizia, Istria e Zara».
    <https://www.anvgd.it/il-trattato-di-rapallo-uni-allitalia-trieste-gorizia-istria-e-zara/>
17. D. L. Massagrande, «I governi di Fiume indipendente 1918-1924», amb els documents.
    <https://www.fiumemondo.com/wp-content/uploads/2021/05/Fiume-1918_1924_Massagrande.pdf>
18. «Fiume question», Viquipèdia en anglès. <https://en.wikipedia.org/wiki/Fiume_question>
19. «Italian National Council of Fiume», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Italian_National_Council_of_Fiume>
20. FiumeFil, «Il Corpo d'Occupazione Interalleato a Fiume».
    <https://www.fiumefil.com/storia/occupazione-interalleata/il-corpo-d-occupazione-interalleato-a-fiume>
21. «Impresa di Fiume», Viquipèdia en italià. <https://it.wikipedia.org/wiki/Impresa_di_Fiume>
22. «Italian Regency of Carnaro», Viquipèdia en anglès, i «Reggenza italiana del Carnaro», en
    italià. <https://en.wikipedia.org/wiki/Italian_Regency_of_Carnaro>,
    <https://it.wikipedia.org/wiki/Reggenza_italiana_del_Carnaro>
23. «Carta del Carnaro», Viquipèdia en italià. <https://it.wikipedia.org/wiki/Carta_del_Carnaro>
24. Fondazione Anna Kuliscioff, guia de la mostra «Fiume Fiume» (cronologia).
    <https://www.fondazioneannakuliscioff.it/wp-content/uploads/2023/02/Guida-alla-mostra-Fiume-bassa-risoluzione-per-web.pdf>
25. «Free State of Fiume», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Free_State_of_Fiume>
26. I. Martinaš, «Prve krčke poštanske marke: D'Annunzijeva okupacija kvarnerskih otoka Krka i
    Raba 1920. godine», *Krčki zbornik* 76, 2021, pp. 137-144. <https://hrcak.srce.hr/284379>,
    resum en anglès: <https://hrcak.srce.hr/clanak/411592>
27. «Bloody Christmas (1920)», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Bloody_Christmas_(1920)>
28. «Natale di sangue», Viquipèdia en italià. <https://it.wikipedia.org/wiki/Natale_di_sangue>
29. «Kronologija - Krvavi Božić ili Pet riječkih dana». <https://moja-rijeka.eu/rijeka_krvavi_bozic.html>
30. «Corpus separatum (Fiume)», Viquipèdia en anglès.
    <https://en.wikipedia.org/wiki/Corpus_separatum_(Fiume)>
31. Wikidata: Q1423581 (Regència italiana del Carnaro) i Q548114 (Estat Lliure de Fiume, inici
    1920-12-30). <https://www.wikidata.org/wiki/Q1423581>, <https://www.wikidata.org/wiki/Q548114>
32. Grad Šibenik, «Na današnji dan, 12. studenoga 1920. godine».
    <https://www.sibenik.hr/clanci/na-danasnji-dan-12-studenoga-1920-godine/6331.html>
33. Prassi Italiana di Diritto Internazionale (CNR), «Gli Accordi di Santa Margherita».
    <http://www.prassi.cnr.it/prassi/content.html?id=1047>
34. «Dalmazia», Enciclopedia Italiana (Treccani).
    <https://www.treccani.it/enciclopedia/dalmazia_res-929a0466-87e5-11dc-8e9d-0016357eee51_(Enciclopedia-Italiana)/>
