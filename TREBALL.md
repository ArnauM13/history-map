# Com es treballa per fases

El projecte és massa gran perquè una sola sessió (d'una persona o d'un agent) se l'empassi sencer.
Una sessió que llegeix massa acaba donant voltes a la mateixa cosa, oblida el que va trobar al
principi i gasta el doble. Per això la feina es parteix en **lots petits** que es passen el relleu
amb **documents escrits**, i el coneixement creix als documents, no a la memòria d'una sessió.

## 1. Les regles

- **Una sessió, un lot.** Un lot és una pregunta tancada: un país en una època («les fronteres de
  Polònia del 1918 al 1922»), un procés («la unificació italiana, 1859-1871»), un any concret o una
  capa («les banderes dels protectorats»). Si no es pot dir en una frase, és massa gran.
- **Pressupost: 200.000–250.000 tokens de context per sessió.** Quan una sessió s'hi acosta, no
  continua: escriu el relleu (§3) i en comença una de nova a partir d'aquí. Si un lot no hi cap,
  es parteix (per país, per dècada, per tipus de dada).
- **Res no es dona per sabut si no és escrit.** El que una sessió troba i no deixa a
  `treball/lots/` o a [DADES.md](DADES.md), per a la sessió següent no existeix.
- **No es torna a investigar el que ja és decidit.** Abans de començar, es llegeix DADES.md §0.1
  (els criteris) i el relleu del lot. Un criteri escrit s'aplica; només es reobre amb una font nova.

## 2. Les fases

Cada encàrrec gran passa per quatre fases, i cadascuna pot ser una sessió diferent:

| Fase | Què fa | Què llegeix | Què deixa |
| --- | --- | --- | --- |
| **1. Pla** | Parteix l'encàrrec en lots i els apunta a [treball/README.md](treball/README.md) | L'encàrrec, FULL-DE-RUTA, l'índex de DADES | Un fitxer per lot amb la pregunta i l'abast |
| **2. Recerca** | Respon la pregunta d'un lot: dates, fonts, discrepàncies | Viquipèdia, tractats, historiografia; les dades amb consultes, no senceres | El lot omplert: troballes amb font i criteri proposat |
| **3. Integració** | Passa les troballes al codi i al contingut | Només el lot i els fitxers que toca | `CORRECTIONS`, YAML, files a DADES |
| **4. Comprovació** | Mira el resultat al mapa (CLAUDE.md, «La fiabilitat, primer») | El lot i el mapa | El lot tancat, o un lot nou amb el que falla |

Exemple. Encàrrec: «revisar Europa el 1919-1923». El pla en fa lots com aquests:

- `1919-polonia-fronteres`: de Versalles a Riga, amb el plebiscit de l'Alta Silèsia.
- `1919-hongria-trianon`: la República dels Consells i Trianon.
- `1919-balcans-iugoslavia`: el Regne dels Serbis, Croats i Eslovens i Fiume.
- `1920-banderes-estats-nous`: les banderes dels estats nascuts del 1918 al 1920.

Cada lot de recerca pot anar en paral·lel en una sessió o un subagent propi. La integració, en
canvi, es fa d'un en un, perquè toca els mateixos fitxers (`build-borders.mjs`, `countries.yaml`).

## 3. El relleu

Cada lot és un fitxer a `treball/lots/`, amb el nom `AAAA-tema.md` (l'any o l'inici de l'època, i
el tema), fet a partir de [la plantilla](treball/lots/_plantilla.md). La sessió que hi treballa
l'actualitza **abans d'acabar**, encara que no hagi acabat la feina. Ha de servir perquè una sessió
que no sap res en pugui continuar llegint només aquell fitxer.

Quan un lot es tanca, el que val per sempre (un criteri, una correcció, una font) passa a
[DADES.md](DADES.md) i a [FULL-DE-RUTA.md](FULL-DE-RUTA.md); el fitxer del lot queda com a
història de com es va decidir.

## 4. Gastar poc

- **Les dades generades no es llegeixen senceres.** `public/data/` pesa megues: es consulta amb un
  script curt (`node -e` o `jq`) que respon la pregunta («a quin estat cau Varsòvia el 1920?»).
- **Buscar abans de llegir.** `grep` per trobar la línia, i llegir-ne només el tros.
- **Els subagents tornen conclusions**, no fitxers sencers: se'ls demana la resposta i la font.
- **Un lot no llegeix DADES.md sencer**: només la secció que el toca (l'índex és als títols).
- **La comprovació final** (`npm run lint && … && npm run build`) es fa a la integració, no a cada
  pas de la recerca.

## 5. Per començar una sessió

1. Llegir [treball/README.md](treball/README.md) i triar un lot obert (o fer el pla si no n'hi ha).
2. Llegir el fitxer del lot i les seccions de DADES que cita.
3. Treballar dins de l'abast del lot. El que surti de fora s'apunta com a lot nou, no es fa.
4. Abans d'acabar o d'arribar al pressupost: actualitzar el lot i l'índex, i fer el commit.
