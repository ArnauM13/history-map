# 1919-fiume

**Pregunta**: com es dibuixa l'Adriàtic del nord del 1918 al 1920: l'ocupació italiana de l'Ístria
i Fiume, i la Regència del Carnaro de D'Annunzio.

**Abast**: del 1918-11-03 a Rapallo (1920-11-12). El que ve després ja és a DADES §1.1. Hi entren
també les evacuacions italianes del 1921, perquè són la data final de les zones ocupades d'abans de
Rapallo. No hi entra on comença el Regne dels Serbis, Croats i Eslovens fora de l'Adriàtic (lot nou
`1918-iugoslavia`, a sota), ni Fiume del 1921 al 1924.

**Estat**: integrar — fase 2 (recerca) feta el 2026-10-05; queden tres dates per tancar a la
integració (a «Pendent»).

## Context

- DADES §1.2 ho dona com a error conegut: CShapes ho posa dins de Iugoslàvia (345) i no hi ha la
  Regència del Carnaro. DADES §1.1, files de Rapallo i de l'Estat Lliure de Fiume.
- Probablement va a la capa d'ocupacions, amb peces de CShapes (§1.3).
- Criteris de §0.1 que hi toquen: la sobirania; «una revolta, només si va tenir un govern»; «un
  territori cedit que encara no té amo»; «un territori ocupat que no era de cap altre estat».

## Troballes

### Què dibuixa ara CShapes (consulta a `public/data/borders.topo.json`)

| Lloc | 1908-10-07 → 1918-11-02 | 1918-11-03 → 1919-09-09 | 1919-09-10 → 1920-11-11 | Des de 1920-11-12 |
| --- | --- | --- | --- | --- |
| Trieste, Gorizia | 300 Àustria-Hongria | **305 Àustria** | 325 Itàlia | 325 Itàlia |
| Koper, Pazin, Labin, Opatija, Idrija, Postojna, Zara | 300 | **305 Àustria** | **345 Iugoslàvia** | 325 Itàlia (correcció nostra) |
| Fiume | 300 | **305 Àustria** | **345 Iugoslàvia** | Q548114 Estat Lliure (nostre) |
| Sušak, Zagreb | 300 | 310 Hongria | 310 fins al 1920-06-03; 345 des de Trianon | 345 |
| Ljubljana, Šibenik | 300 | **305 Àustria** | 345 | 345 |

Les dues dates de tall de CShapes són les signatures de Saint-Germain (1919-09-10) i de Trianon
(1920-06-04). Hi ha tres errors, i cap no és una simplificació:

1. **Del 1918-11-03 al 1919-09-09, tot el Litoral, l'Ístria, Dalmàcia i Eslovènia són de la
   República d'Àustria Alemanya (305)**, que no els reclamava ni els governava. Fiume, a més, era
   hongaresa (corpus separatum), no austríaca.
2. **Del 1919-09-10 a Rapallo, Itàlia només té Trieste i Gorizia**, i l'Ístria, Zara i el Litoral
   eslovè són iugoslaus: una frontera que no va existir mai. Saint-Germain (art. 36) feia renunciar
   Àustria a favor de les Principals Potències Aliades, no del Regne SHS; la frontera es va pactar
   a Rapallo, i mentrestant tot era sota govern militar italià.
3. **Fiume, iugoslava del 1919-09-10 a Rapallo**, quan la tenien les tropes interaliades i després
   D'Annunzio.

### Les dates

- **1918-11-03** — Armistici de Villa Giusti, signat a les 15:00 del dia 3 i vigent des del dia 4
  a les 15:00. La clàusula militar 3 fixa la línia que evacua Àustria-Hongria, que és la del pacte
  de Londres: la carena dels Alps Julians fins al Snežnik (Schneeberg), «excloent tota la conca del
  Sava», i del Snežnik a la costa «de manera que incloguin Kastav, Matulji i Volosko»; a Dalmàcia,
  els límits de la província de llavors amb Lisarica i Tribanj al nord, i al sud fins al cap Planka
  amb totes les valls que baixen cap a Šibenik; i les illes de Premuda, Silba, Olib, Škarda, Maun,
  Pag i Vir fins a Mljet, amb Sveti Andrija, Biševo, Vis, Hvar, Šćedro, Korčula, Sušac, Lastovo i
  Palagruža, i sense Drvenik Veli i Mali, Čiovo, Šolta ni Brač. Fiume (Rijeka) queda **fora** de
  la línia. (Font: «Armistice of Villa Giusti», Viquipèdia i el text a Wikisource.)
- **1918-11-03** — Les tropes italianes desembarquen a Trieste; els dies següents ocupen fins a la
  línia. (Font: gov.si, «Italian Military Authority in the Occupied Slovenian Territory after the
  End of World War I», 2019.) Zara, el 4 de novembre a les 14:30; Šibenik, Vis i Lastovo, el 5 i 6;
  Hvar, el 13; Pag, el 21. (Font: «Governorate of Dalmatia» i «Allied occupation of the eastern
  Adriatic», Viquipèdia.)
- **Més enllà de la línia.** Itàlia també va ocupar Logatec, fora de la conca que deia
  l'armistici; el Govern Nacional d'Eslovènia va obrir una delegació a Cerknica per als municipis
  no ocupats (Begunje, Cerknica, Sveti Vid, Bloke, Lož, Stari trg). Logatec, Planina i Rakek van
  quedar iugoslaus a Rapallo; l'administració del districte de Logatec torna a funcionar el **març
  del 1921**. (Font: gov.si, «Seven Eggs for Two Kilos of Rice…», 2019.) Krk, que no era a la línia
  de Londres, també va ser ocupada per Itàlia del 1918 al 1921 («Krk», Viquipèdia).
- **Els governs militars.** Venècia Júlia: el general Carlo Petitti di Roreto, governador des del
  novembre del 1918. Dalmàcia: el «Governatorato militare della Dalmazia e delle isole dalmate e
  curzolane», creat el **1918-11-19**, amb l'almirall Enrico Millo, que en pren possessió el 21, a
  Šibenik, i el passa a Zara la primavera del 1919; Millo deixa el càrrec el 1920-12-22. (Font: la
  cerca sobre Millo, que cita l'estudi de Fiorio a openstarts.units.it; caldria comprovar-ho al
  PDF, que no responia.)
- **Fiume, 1918-10-28/29 → 1918-11-17.** Dos poders alhora: el Consell Nacional Italià d'Antonio
  Grossich (des del 28 d'octubre; el 30 proclama la unió a Itàlia) i l'administrador de l'Estat SHS,
  Rikard Lenac (des del 29). Naus nord-americanes hi entren el 2 de novembre, franceses i
  britàniques el 3 i italianes el 4. (Fonts: «List of governors and heads of state of Fiume»,
  «Allied occupation of the eastern Adriatic».)
- **1918-11-17** — Entra a Fiume el cos d'ocupació interaliat, sota comandament italià (el general
  San Marzano, de la III Armada); els croats se'n retiren i es canvia la bandera del Palau del
  Governador. Governadors militars italians: San Marzano (17-29 nov. 1918), Grazioli (fins al
  28-08-1919), Pittaluga (fins al 13-09-1919). (Fonts: fiumefil.com, «Il Corpo d'Occupazione
  Interalleato a Fiume»; «List of governors…».)
- **1919-09-12** — D'Annunzio entra a Fiume des de Ronchi amb uns 186 legionaris (al cap de pocs
  dies, uns 2.500); les tropes aliades se'n van, i ell proclama l'annexió a Itàlia, que el govern
  italià no reconeix i respon amb un bloqueig. És «Comandant de la Ciutat de Fiume» des del 14 de
  setembre. (Fonts: «Italian Regency of Carnaro», «Impresa di Fiume», «List of governors…».)
- **1919-12-18** — Plebiscit sobre el *modus vivendi* del govern italià: guanya el sí; D'Annunzio
  l'anul·la. (Font: «Italian Regency of Carnaro».)
- **1920-09-08** — Proclamació de la **Regència Italiana del Carnaro**, amb la Carta del Carnaro.
  *Discrepància*: l'article italià «Impresa di Fiume» dona el 12 d'agost del 1920; és el dia que
  D'Annunzio n'anuncia la intenció. La resta de fonts (l'article anglès i l'italià de la Regència,
  la llista de governants) donen el 8 de setembre. Criteri de §0.1 (un canvi de règim, el dia de
  la proclamació): **8 de setembre**.
- **1920-11-12** — Rapallo crea l'Estat Lliure de Fiume (art. 4). D'Annunzio el rebutja el 17 de
  novembre, i la Regència declara la guerra a Itàlia el 21. El **13 de novembre**, grups d'arditi
  ocupen Krk (Veglia) i Rab (Arbe), que Rapallo havia donat a Iugoslàvia; el 30 de novembre, el
  general Caviglia els mana sortir abans del 2 de desembre, i se'n van uns dies abans del Nadal.
  (Fonts: «Treaty of Rapallo (1920)», «Natale di sangue», lavoce.hr.)
- **1920-12-24 → 29** — Nadal de sang: l'exèrcit italià ataca la tarda del 24; treva el 25; el 26,
  els cuirassats *Andrea Doria* i *Duilio* bombardegen el Palau del Govern. El 28, D'Annunzio
  dimiteix per carta (a Host-Venturi i a l'alcalde Riccardo Gigante). Morts: 22 legionaris i 5
  civils a Fiume, i 4 legionaris a Krk. (Font: «Natale di sangue», Viquipèdia italiana.)
- **1920-12-31** — **Pacte d'Abbazia**: la rendició; la ciutat accepta Rapallo. *Discrepància*:
  la llista de governants acaba D'Annunzio el **29 de desembre**; la Viquipèdia italiana posa la fi
  de la Regència el **31**, amb el pacte. Els dos són certs: el 29 deixa de governar ell, i el 31
  la Regència deixa d'existir com a estat que no reconeix Rapallo.
- **1921-01-18** — Els militars passen el govern a un govern provisional; D'Annunzio se'n va a
  Venècia el mateix dia. Eleccions de l'Estat Lliure el 24 d'abril del 1921 (guanya Zanella).
  (Fonts: «Free State of Fiume», «Natale di sangue».)
- **Les evacuacions del 1921** (el final de les zones ocupades que Rapallo dona a Iugoslàvia):
  Logatec, març del 1921 (vegeu més amunt); Rab, autoritats civils el 23-24 d'abril i militars el
  **25 d'abril del 1921** (lafilatelia.it, que cita documents de l'evacuació: per contrastar);
  Šibenik, el **12 de juny del 1921** («Šibenik», Viquipèdia; un informe reservat italià del 13 de
  juny parla de l'evacuació de la «segona zona» dalmata); la missió naval nord-americana surt de
  Split el **29 de setembre del 1921**, i l'article dona el **21 de setembre del 1921** com a final
  de les ocupacions aliades de l'Adriàtic. Krk: «el 1921», sense dia.
- **Les zones aliades de Dalmàcia** (Venècia, 16 de novembre del 1918, o Roma, el 26): el nord
  per a Itàlia, Split per als Estats Units, el sud i Montenegro per a França i el Kvarner per a la
  Gran Bretanya. Fora de la zona italiana, era presència naval sobre territori que governava
  l'Estat SHS, no un govern d'ocupació. (Font: «Allied occupation of the eastern Adriatic».)

## Decisions

Proposades per a la integració; les marcades amb ★ passen a DADES §0.1.

1. **★ Un imperi que es desfà abans dels tractats.** CShapes dona cada tros d'Àustria-Hongria a
   l'hereu legal (Àustria o Hongria) fins al tractat de pau. És fals quan aquest hereu no el
   reclamava ni el governava: Àustria Alemanya no va tenir mai cap autoritat a Trieste, Ljubljana
   o Šibenik. Criteri: el territori va a **qui el governava** des del dia que l'imperi es desfà
   (el 1918-11-03 a CShapes), i el que un tercer ocupa per l'armistici es tracta com un
   territori en disputa (punt 2). Això toca també Eslovènia, Croàcia i Bòsnia, i va al lot nou
   `1918-iugoslavia`.
2. **El Litoral, l'Ístria i la Dalmàcia de la línia de Londres, del 1918-11-03 a Rapallo**: una
   **peça pròpia, en disputa**, amb Itàlia a la capa d'ocupacions. Ni d'Itàlia ni del Regne SHS:
   Àustria hi va renunciar a favor de les Principals Potències Aliades, i la frontera no es va
   decidir fins a Rapallo. És el mateix cas que el criteri «un territori ocupat que no era de cap
   altre estat» (Palestina), i també encaixa amb «un territori cedit que encara no té amo» (Bèlgica
   el 1814), on el govern provisional era el govern militar italià. Dues peces, pels dos governs
   militars: **Venècia Júlia** (amb Krk i Logatec) i **Dalmàcia** (Zara, Šibenik, Knin, Drniš i
   les illes de l'armistici). L'alternativa més simple —deixar la base com la dona CShapes i posar
   l'ocupació italiana a sobre— dibuixaria una Ístria iugoslava que no va existir.
3. **Les zones d'ocupació italiana** comencen el **1918-11-03** (Trieste; el criteri de §1.3 és
   l'armistici) i s'acaben: a la part que Rapallo dona a Itàlia, el **1920-11-11**, perquè des de
   l'endemà és sobirania (§1.1); a la que dona a Iugoslàvia, el dia de l'evacuació (Logatec, març
   del 1921; Rab, 1921-04-25; Šibenik i la Dalmàcia continental, 1921-06-12; Krk, per trobar).
   Mentrestant, la base d'aquests trossos ja és iugoslava (sobirania de Rapallo) i l'ocupació
   italiana hi continua a sobre.
4. **Fiume, peça pròpia tot el període** (el corpus separatum, a l'oest del Rječina; Sušak és
   hongarès i, des de Trianon, iugoslau, i no hi entra):
   - **1918-11-03 → 1919-09-11**: «Fiume», sense sobirà decidit. Del 1918-11-17 al 1919-09-11, zona
     d'ocupació **interaliada sota comandament italià**, del color d'Itàlia, i el text ho explica.
     Del 3 al 16 de novembre, dos poders (el Consell Nacional Italià i l'Estat SHS) sense
     ocupant: només la peça.
   - **1919-09-12 → 1920-09-07**: la Fiume de D'Annunzio, amb govern sobre el territori (criteri
     de les revoltes): peça pròpia, «Comandament de Fiume», sense ocupant.
   - **1920-09-08 → 1920-12-31**: **Regència Italiana del Carnaro**. Krk i Rab, ocupades pels
     legionaris del 13 de novembre a principis de desembre, no fan zona pròpia: ja hi era l'exèrcit
     italià. Es diu a la fitxa.
   - **Des de l'1 de gener del 1921**: l'Estat Lliure. **Canvia DADES §1.1**, que el fa començar
     el 1920-11-12: Rapallo el crea sobre el paper, però el govern del territori era la Regència,
     que no el reconeixia fins al pacte d'Abbazia. Criteri: el de les revoltes amb govern, que
     guanya al de la cessió perquè el que es veu al mapa ha de ser qui manava.
5. **Les zones aliades de Split i de Kotor no van al mapa**: no hi va haver govern d'ocupació.

## Fet

- Recerca d'aquest fitxer (2026-10-05). Cap canvi al codi ni a les dades.

## Pendent

1. **Integració**, en aquest ordre:
   - `build-borders.mjs`: les peces «Venècia Júlia» i «Dalmàcia» en disputa (1918-11-03 →
     1920-11-11) i les de Fiume (punt 4), retallades de 305/345; Fiume, amb la línia `fiume` que ja
     hi ha. Trieste i Gorizia, que CShapes ja dona a Itàlia des del 1919-09-10, també hi entren
     (eren tan en disputa com l'Ístria).
   - `content/countries.yaml`: els noms de les peces noves en tres idiomes, amb el QID de Wikidata
     (per buscar: la Regència del Carnaro; l'Estat Lliure és Q548114; el Governatorato della Dalmazia
     és Q2552789, però és l'article dels dos governs, 1918-1920 i 1941-1943).
   - `content/occupations/`: Venècia Júlia, Dalmàcia i Fiume interaliada (punt 3), amb la forma a
     `build-occupations.mjs`. La línia d'armistici, a mà (`LINES`), a partir del text de la clàusula
     3; Logatec, a la vora est.
   - Un fet o conflicte per a l'Empresa de Fiume (1919-09-12) i el Nadal de sang (1920-12-24/29).
   - DADES §0.1 (decisió 1), §1.1 (Fiume i la frontera del 1918-1920), §1.2 (treure l'error).
2. **Dates per tancar** (es poden buscar a la integració; si no surten, el mes amb precisió de
   mes): l'evacuació de Krk el 1921; les tres zones de Dalmàcia (el PDF de Fiorio, openstarts.units.it,
   «Tra Italia e Jugoslavia: la Dalmazia e la difficile applicazione…», no responia); el dia exacte
   de Logatec.
3. **Lots nous**:
   - `1918-iugoslavia`: on comença el Regne dels Serbis, Croats i Eslovens. CShapes deixa
     Eslovènia i Dalmàcia a Àustria (305) fins al 1919-09-10 i Croàcia a Hongria (310) fins al
     1920-06-04, quan l'Estat SHS les governava des del 1918-10-29 i el Regne SHS des del
     1918-12-01. Aplica la decisió 1. Es toca amb `1919-hongria` (el 310).
   - `1921-fiume`: l'Estat Lliure del 1921 al 1924, amb el cop feixista (1922-03-03) i l'ocupació
     militar italiana (1922-03-17 → 1924-02-22), i Sušak i Port Baross. Fora d'aquest encàrrec si
     no s'hi vol afegir.
