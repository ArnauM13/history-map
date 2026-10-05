# 1919-fiume

**Pregunta**: com es dibuixa l'Adriàtic del nord del 1918 al 1920: l'ocupació italiana de l'Ístria
i Fiume, i la Regència del Carnaro de D'Annunzio.

**Abast**: del 1918-11-03 a Rapallo (1920-11-12). El que ve després ja és a DADES §1.1. La recerca
ha mostrat que tres coses d'aquest lot continuen després de Rapallo i hi entren: la Regència, que
no accepta el tractat fins al 1920-12-28; Krk i Rab, que ocupen els legionaris l'endemà de
Rapallo; i la Dalmàcia ocupada, que Itàlia evacua el 1921.

**Estat**: integrar — fase 2 (recerca) feta el 2026-10-05; falta la fase 3.

## Context

- DADES §1.2 ho dona com a error conegut: CShapes ho posa dins de Iugoslàvia (345) i no hi ha la
  Regència del Carnaro. DADES §1.1, files de Rapallo i de l'Estat Lliure de Fiume.
- Criteris de DADES §0.1 que hi toquen: la sobirania (fila 1), el dia que té efecte (fila 2), la
  revolta amb govern (fila 5) i el territori cedit sense amo (fila 8).
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

**L'armistici i l'ocupació italiana**

- 1918-11-03 — Armistici de Villa Giusti, signat el dia 3; l'alto el foc, el 4 a les 15:00. Obliga
  Àustria-Hongria a evacuar el Tirol del Sud, Tarvisio, la vall de l'Isonzo, Gorízia, Trieste,
  l'Ístria, la Carniola occidental i part de Dalmàcia: la línia del pacte de Londres (1915).
  (font: «Armistice of Villa Giusti»)
- 1918-11-03 — Les tropes italianes prenen Trieste, Rovinj i Pola el mateix dia de la signatura.
  (font: «Allied occupation of the eastern Adriatic»)
- 1918-11-03 — El general Petitti di Roreto pren el govern de la Venezia Giulia a Trieste
  (Governatorato militare). Decret-llei del 4 de juliol del 1919, n. 1081, i R.D. del 24 de juliol
  del 1919, n. 1251: passa a ser el Commissariato generale civile, fins al R.D.L. del 17 d'octubre
  del 1922, n. 1353. (font: Sistema Archivistico Nazionale, fitxa «Governatorato della Venezia
  Giulia poi Commissariato generale civile per la Venezia Giulia»)
- 1918-11-04 — Itàlia desembarca a Zara (14:30, abans de l'alto el foc) i ocupa Vis, Korčula,
  Mljet i Lastovo. Knin, l'1 de gener del 1919; tota la zona, el 20 de febrer del 1919.
  (font: «Allied occupation of the eastern Adriatic», «Governorate of Dalmatia»)
- 1918-11-19/21 — Governatorato della Dalmazia, amb l'almirall Millo, primer a Šibenik i des del
  gener del 1919 a Zara; s'acaba amb Rapallo. Zona: la costa de Zara a Šibenik i l'interior fins a
  Knin i Drniš. (font: «Governorate of Dalmatia»; l'article posa el decret el 19 i la creació el 21)

**Saint-Germain i Trianon: què es va cedir i a qui**

- 1919-09-10 — Saint-Germain, art. 36: «Austria renounces, so far as she is concerned, in favour
  of Italy all rights and title over the territory of the former Austro-Hungarian Monarchy situated
  beyond the frontiers of Austria laid down in Article 27 (2) [...] and lying between those
  frontiers, the former Austro-Hungarian frontier, the Adriatic Sea, and the eastern frontier of
  Italy **as subsequently determined**», i també el que altres tractats reconeguin com a italià.
  L'art. 46 fa el mateix a favor de l'Estat dels Serbis, Croats i Eslovens. En vigor, el
  1920-07-16. (font: text del tractat, forost.ungarisches-institut.de/pdf/19190910-1.pdf)
- 1920-06-04 — Trianon, art. 53: «Hungary renounces all rights and title over Fiume and the
  adjoining territories which belonged to the former Kingdom of Hungary and which lie within the
  boundaries which may subsequently be fixed». No diu a favor de qui. (font: text del tractat,
  gwpda.org/versa/tri1.htm)
- 1920-09-26 — Llei italiana n. 1322 (converteix el R.D. del 6 d'octubre del 1919, n. 1804):
  «I territori attribuiti all'Italia con questo Trattato e con gli atti successivi fanno parte
  integrante del Regno d'Italia». (font: Prassi Italiana di Diritto Internazionale, CNR, id 386 i
  2414; no s'ha pogut obrir el text sencer)

**Fiume** (font principal: D. L. Massagrande, «I governi di Fiume indipendente 1918-1924», sobre
L. Peteani, *La posizione internazionale di Fiume dall'armistizio all'annessione*, 1940)

- 1918-10-29 — L'últim governador hongarès lliura els poders al podestà. El Comitato Nazionale
  Fiumano se'ls queda, es diu Consiglio Nazionale Italiano i fa un Comitato Direttivo (president,
  Antonio Grossich): «il primo governo di Fiume indipendente».
- 1918-10-30 — Proclama de la «provvisoria indipendenza» de Fiume, en espera de l'annexió a Itàlia.
  El mateix dia, Rojčević, comissari del Consell Nacional de Zagreb, també hi pren l'autoritat; el
  31, el ban de Croàcia nomena Lenac. El control croat no va més enllà del palau del govern, la
  capitania i l'estació: un «condominio di fatto».
- 1918-11-17 — Entren les tropes italianes i el comitè croat es dissol. Ocupació interaliada
  (italians, francesos, britànics, americans), amb comandament italià; uns 20.000 soldats italians
  a principis del 1919. Els «Vespri fiumani», fins al 6 de juliol del 1919. (font: Massagrande;
  «Allied occupation of the eastern Adriatic»; «Impresa di Fiume»)
- 1919-09-12 — D'Annunzio entra a Fiume des de Ronchi; el 13 hi pren el comandament militar. El
  20 de setembre el Consiglio Nazionale li dona els poders i ell els hi torna el mateix dia: el
  govern continua sent el Comitato Direttivo, amb el vistiplau del Comando.
- 1919-12-18 — Plebiscit sobre el *modus vivendi* del govern italià; D'Annunzio l'anul·la.
- 1920-09-08 — Proclamació de la Regència italiana del Carnaro, des del balcó del palau del govern,
  i promulgació de la Carta del Carnaro. Govern provisional de set rectors el 23 de setembre.
- 1920-11-12 — Rapallo crea l'Estat Lliure de Fiume; la Regència no l'accepta.
- 1920-12-24 — L'exèrcit italià (Caviglia) ataca Fiume: el «Nadal de sang». Treva el 25; tornen a
  lluitar el 26. Unes cinquanta morts.
- 1920-12-28 — D'Annunzio i el govern provisional de la Regència dimiteixen i lliuren els poders al
  podestà (Riccardo Gigante) i a la representació municipal; el Consell de la Regència accepta
  «subire» Rapallo. El 29, una segona carta de dimissió («La Rinunzia»).
- 1920-12-31 — Acord d'Abbazia (Ferrario pel govern italià, Gigante i Host-Venturi per Fiume). La
  representació municipal reprèn els poders d'estat com a Consiglio Nazionale i ratifica l'acord i
  Rapallo. L'1 de gener del 1921 encarrega el govern a Grossich. D'Annunzio se'n va el 18 de gener.
- Territori de la Regència: el corpus separatum, uns 21 km² (la ciutat, Kozala, Drenova i Plase).
  El 31 de desembre la representació municipal recorda que el corpus separatum comprèn el Delta i
  Port Baross «e che attualmente lo comprende anche di fatto»: els tenien els legionaris.
  (font: «Corpus separatum (Fiume)»; Massagrande, document 11)
- 1920-11-13 — Els legionaris ocupen les illes de Krk (Veglia) i Rab (Arbe), que Rapallo dona a
  Iugoslàvia. El 30 de novembre Caviglia els ordena sortir-ne abans del 2 de desembre; el 19 de
  desembre, ultimàtum fins al 21. (font: Fondazione Anna Kuliscioff, guia de la mostra «Fiume
  Fiume», cronologia)

**L'evacuació de Dalmàcia** (font: A. Fiorio, «Tra Italia e Jugoslavia: la Dalmazia e la difficile
applicazione...», Università di Trieste, sobre L. Monzali, *Gli italiani di Dalmazia*)

- 1921-02-02 — Intercanvi de ratificacions de Rapallo; tres comissions per a l'evacuació.
- 1921-03-08 — Acord de Split: tres fases. La primera, des de l'1 d'abril: els districtes de Pag,
  Obrovac, Kistanje, Drniš, Knin, Trogir i Split i les illes de Korčula. La segona, des del 20
  d'abril: Šibenik, Skradin i Benkovac (es fa el juny; l'informe de l'evacuació de Šibenik és del
  13 de juny del 1921). La tercera: el districte de Zara i Zaravecchia que no és italià,
  ajornada.
- 1922-10-23 — Acords de Santa Margherita; ratificats el febrer del 1923. La tercera zona es lliura
  després.

### Discrepàncies

| Què | Fonts | Per què | Criteri |
| --- | --- | --- | --- |
| La proclamació de la Regència | 12 d'agost (WP en, cerca), 8 d'agost (WP it), 8 de setembre (WP en, Massagrande) | El 12 d'agost D'Annunzio l'anuncia en un discurs; el 8 de setembre la proclama formalment i promulga la Carta. El «8 d'agost» de la WP italiana sembla una errada per «8 de setembre». | La proclamació (§0.1, fila 2): **1920-09-08**. |
| La fi de la Regència | 28 (dimissió), 29 (segona carta), 30 (WP en: «capitulated»), 31 de desembre (Abbazia, WP it) | Són quatre passos d'un mateix final. El 28 la Regència deixa d'existir: el govern dimiteix i lliura els poders a la ciutat. El 31 la ciutat accepta Rapallo. | El dia que té efecte, com una abdicació: **la Regència fins al 1920-12-27; l'Estat Lliure, des del 1920-12-28**. |
| De qui és Fiume del 1918 al 1920 | CShapes: Àustria i després Iugoslàvia | Fiume era un corpus separatum de la corona d'Hongria, i Hongria no hi renuncia fins a Trianon, sense dir a favor de qui. Peteani i Massagrande donen un estat de Fiume, de fet, des del 1918-10-30. | Vegeu les decisions. |
| L'ocupació italiana de Rab (i de Krk?) el 1918 | WP en diu que Rab i Cres van quedar ocupades el 1918 | El pacte de Londres deixava Krk i Rab a Croàcia, i el 1920 els legionaris les «ocupen», cosa que vol dir que no eren italianes. | Pendent de comprovar; de moment, Rab i Krk no entren a l'ocupació del 1918. |

## Decisions

Proposades per a la integració. Les marcades amb ⇒ són criteri nou per a DADES §0.1.

1. **Fiume és una peça pròpia des del 1918-10-30** (la proclama del Consiglio Nazionale), no
   austríaca ni iugoslava. És la fila 5 de §0.1: un govern sobre el territori, el Consiglio
   Nazionale i el seu Comitato Direttivo, amb les dates d'aquest govern. Després de Trianon
   (1920-06-04) també és la fila 8: un territori cedit sense amo, amb el seu govern provisional.
   Tres noms al llarg del temps, amb el mateix QID o amb QIDs encadenats:
   - 1918-10-30 → 1920-09-07: Fiume (el Consiglio Nazionale; des del 12-9-1919, amb D'Annunzio).
   - 1920-09-08 → 1920-12-27: Regència italiana del Carnaro.
   - 1920-12-28 → 1924-02-21: Estat Lliure de Fiume (ara comença el 1920-11-12).
   La forma, fins a Rapallo, és el corpus separatum, sense la franja de costa que Rapallo hi va
   afegir al sud de Kastav; amb el Delta i Port Baross, que els legionaris tenien de fet, si es
   poden dibuixar amb una font.
2. **Saint-Germain cedeix a Itàlia el que hi ha a l'oest de la línia de Rapallo, el dia que es
   signa (1919-09-10).** L'art. 36 renuncia «in favour of Italy» al territori fins a «the eastern
   frontier of Italy as subsequently determined»: Rapallo no cedeix res, diu on és la línia d'una
   cessió que ja s'havia fet. Per tant, el territori de `AREAS.rapallo` és italià des del
   1919-09-10, no des del 1920-11-12; Zara, Cres, Lošinj i Lastovo també, per la segona frase de
   l'art. 36 («recognised as forming part of Italy by any treaties concluded for the purpose of
   completing the present settlement»). L'est de la línia (Kastav, Krk, Logatec, Šibenik) és del
   Regne SCS des del mateix dia, per l'art. 46, com ja fa CShapes.
   ⇒ Criteri: **un tractat que cedeix sense fixar la línia** — el territori és de qui el rep el dia
   que es signa la cessió, fins on arriba la línia que es fixa després. L'exemple de §0.1 («l'Ístria,
   italiana des de Rapallo») canvia: italiana des de Saint-Germain (signat el 1919-09-10, en vigor el
   1920-07-16), que també serveix d'exemple de signatura contra entrada en vigor. La fila de §1.1,
   igual.
3. **Del 1918-11-03 al 1919-09-09 el sobirà és Àustria** (fila 1), com ja fa CShapes, i el control
   italià va a la capa d'ocupacions. Quatre zones noves:
   - Venezia Giulia: `AREAS.rapallo` sense Zara; Itàlia, `occupation`, del 1918-11-03 (Trieste) al
     1919-09-09. Causa: armistici de Villa Giusti.
   - Fiume: Itàlia (amb els aliats), `occupation`, del 1918-11-17 al 1919-09-11. El text explica
     l'ocupació interaliada i que la ciutat la governava el Consiglio Nazionale.
   - Dalmàcia: la zona del Governatorato della Dalmazia (Zara, Šibenik, Knin, Drniš, i les illes
     de la línia de Londres), del 1918-11-04 a l'evacuació; Zara, només fins al 1919-09-09. Per la
     regla de les zones grans, l'evacuació de Šibenik, la capital del primer governatorat, marca la
     fi (juny del 1921, dia pendent); la tercera zona, a part, si se'n troba la data.
   - Krk i Rab, ocupades pels legionaris de la Regència des del 1920-11-13; el final, pendent.
     L'ocupant no és Itàlia: cal que `by` admeti el QID de la Regència.
4. **No es dibuixa l'avanç italià més enllà de la línia** (Vrhnika i Logatec, novembre del 1918):
   va durar dies i no hi ha cap font amb les dates.

## Fet

- La recerca d'aquest fitxer (2026-10-05). Cap canvi al codi.

## Pendent

Per a la fase 3, en aquest ordre:

1. Dates que falten: el dia que els legionaris surten de Krk i de Rab (desembre del 1920; mirar
   Massagrande, *Italia e Fiume 1921-1924*, 1982, o la premsa del 21-28 de desembre); el dia de
   l'evacuació de Šibenik (juny del 1921) i el de la tercera zona (1923); si Rab i Cres van ser
   ocupades el 1918.
2. El QID de la Regència italiana del Carnaro i el de la Fiume del Consiglio Nazionale (si Wikidata
   no en té cap per al període 1918-1920, es fa servir el de l'Estat Lliure, Q548114, amb noms
   segons la data a `countries.yaml`). L'API de la Viquipèdia limitava les consultes aquest dia.
3. `build-borders.mjs`: una línia `corpusSeparatum` a `LINES` (el límit del terme de Fiume a
   l'oest, a Kantrida); una correcció que dona el corpus separatum a la peça de Fiume des del
   1918-10-30 (traient-lo de 300, 305 i 345); la de Rapallo, des del 1919-09-10; l'Estat Lliure,
   des del 1920-12-28.
4. `content/occupations/`: les zones de la decisió 3, amb les fonts d'aquest fitxer.
5. DADES: el criteri nou a §0.1, l'exemple de Rapallo, les files de §1.1 i treure l'Adriàtic del
   1919-1920 de §1.2.
6. Comprovar al mapa (fase 4): Trieste, Koper, Pazin, Postojna, Fiume, Sušak, Kastav, Zara i
   Šibenik, a 1918-11-02, 1918-11-03, 1918-11-17, 1919-09-10, 1919-09-12, 1920-06-04, 1920-09-08,
   1920-11-13, 1920-12-28 i 1921-07-01.

**Lots nous que n'han sortit**

- `1918-iugoslavia`: CShapes deixa Eslovènia i Dalmàcia dins d'Àustria i Croàcia dins d'Hongria
  fins a Saint-Germain i Trianon, mentre que l'Estat dels Serbis, Croats i Eslovens (1918-10-29) i
  el Regne SCS (1918-12-01) les governaven. Sušak hi entra. Cal decidir-ho amb les files 1 i 5 de
  §0.1; no és d'aquest lot ni del d'Hongria.
