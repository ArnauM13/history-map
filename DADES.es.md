# Los datos — de dónde salen, con qué licencia y dónde fallan

[Català](DADES.md) · **Castellano** · [English](DADES.en.md)

El mapa mezcla datos de sitios distintos, y cada uno tiene su licencia. **Si reaprovechas algo,
mira la licencia de esa parte.**

| Qué | De dónde sale | Licencia |
| --- | --- | --- |
| El código (`src/`, `scripts/`…) | Este proyecto | MIT |
| Los textos (`content/`) | Quien contribuye | CC BY-SA 4.0 |
| Las fronteras (`public/data/`) | CShapes 2.0, recortado y simplificado aquí | CC BY-NC-SA 4.0 |
| Las fronteras anteriores a 1886 (`public/data/history/`) | Cliopatria y, de 1815 a 1870 en la Europa central, OpenHistoricalMap, recortados, simplificados y corregidos aquí (§1.4, §1.5) | CC BY 4.0 |
| Las zonas de ocupación (`public/data/occupations.geojson`) | CShapes 2.0, [Natural Earth](https://www.naturalearthdata.com/) y líneas dibujadas aquí (§1.3) | CC BY-NC-SA 4.0 |
| Las banderas (`public/flags/`) | Wikimedia Commons | La de cada imagen (§2) |
| Las letras del mapa (`public/fonts/`) | Open Sans, de [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0 |
| La letra de la interfaz | Roboto ([Fontsource](https://fontsource.org/)) | OFL 1.1 |
| Los iconos | [Material Symbols](https://fonts.google.com/icons) | Apache 2.0 |

---

## 0. De dónde sale cada dato

Todo lo que enseña el mapa tiene una fuente, y la ficha donde aparece la cita con un enlace.

| Qué se ve | De dónde sale | Dónde se cita |
| --- | --- | --- |
| Las fronteras y las capitales | CShapes 2.0 (§1) | En la ficha de cada estado |
| Las fronteras anteriores a 1886 | Cliopatria (§1.4) y OpenHistoricalMap (§1.5) | En la ficha de cada estado |
| El nombre de cada estado en cada época | El artículo de Wikipedia sobre el estado con ese nombre (`wiki` en `content/countries.yaml`) | En la ficha del estado |
| El nombre de cada entidad anterior a 1886 | El título del artículo de Wikipedia que cita Cliopatria, en catalán y castellano, o `content/countries.yaml` por el QID (§1.4) | En la ficha del estado |
| Las fechas de las banderas | Los artículos de Wikipedia sobre las banderas de cada estado (`sources` en `content/flags.yaml`) | En la ficha del estado |
| Las imágenes de las banderas | Wikimedia Commons (§2, `public/flags/credits.json`) | Bajo cada bandera |
| Las zonas ocupadas y anexionadas (1938-1945) | Fronteras de CShapes de otras fechas, divisiones actuales de Natural Earth y líneas dibujadas a mano (§1.3); las fechas, del artículo de Wikipedia de cada zona (`content/occupations/`) | En la ficha de cada zona |
| Los textos de las banderas, los hechos, los conflictos y las ocupaciones | Escritos por este proyecto a partir de las fuentes que citan (§3) | En la ficha de cada uno |
| Los títulos de Wikipedia en catalán y castellano | Los enlaces entre idiomas de la propia Wikipedia (`content/wikipedia.json`) | — |
| La traducción de los nombres de los estados y de las capitales | Este proyecto | — |

**Cómo se comprueba.** `npm run data:sources` mira que cada artículo citado exista en Wikipedia y
que cada enlace externo responda. El workflow «Fonts» lo ejecuta cuando cambia el contenido y cada
lunes, y falla si encuentra uno roto. Los tests, por su parte, no dejan entrar ningún hecho,
conflicto, ocupación, nombre de estado ni bandera sin fuente.

### 0.1 Cuando las fuentes no coinciden

El mapa quiere ser una referencia. Cuando dos fuentes dicen cosas distintas —una fecha, un nombre,
una frontera—, se investiga por qué, en Wikipedia y en las fuentes que cita, en el texto de los
tratados y en historiografía de referencia, y se saca un criterio que vale para todos los casos
iguales. Los criterios de ahora:

| Cuando | Criterio | Ejemplo |
| --- | --- | --- |
| Una fuente da a un estado el territorio que otro ocupaba en una guerra | El mapa dibuja la **soberanía**: el territorio es de quien lo tenía hasta que un tratado o una anexión formal lo cambia de manos. Las ocupaciones largas del siglo XX van en la capa de ocupaciones (§1.3). | Moscú en 1812 es rusa; Hamburgo es francés desde la anexión de 1811, no desde la ocupación de 1806. |
| Las fuentes ponen el cambio en fechas distintas | El **día en que tiene efecto**: la proclamación o la abdicación, para un cambio de régimen; el tratado, para una cesión, el día en que se firmó aunque entrara en vigor más tarde, si no fija otro día para el traspaso; el decreto, para una anexión. En el calendario gregoriano. | La Segunda República francesa, del 24 de febrero de 1848 al 2 de diciembre de 1852; Istria, italiana desde que se firmó el tratado de Rapallo (12 de noviembre de 1920), no desde la ratificación. |
| Dos estados tienen el mismo soberano | **Estados separados** mientras mantienen instituciones propias; uno solo cuando se unen por ley. | Sajonia y Polonia (1697-1763), Hannover y Gran Bretaña (1714-1837) y Escocia e Inglaterra (1603-1707), separados; Gran Bretaña desde 1707. |
| Un estado paga tributo o es vasallo de otro | **Estado propio**, si se gobernaba solo. | Valaquia y Moldavia, bajo el Imperio otomano. |
| Una revuelta | En el mapa, solo si tuvo **un gobierno sobre el territorio**, y con las fechas de ese gobierno. | El Estado Húngaro, del 14 de abril al 13 de agosto de 1849; la revuelta de Nalivaiko, dentro de la República de las Dos Naciones. |
| Un territorio se libera antes de la paz | Vuelve a su gobierno **el día en que se restaura**; si el ocupante no se va, sigue siendo suyo hasta el tratado. | Ginebra, república desde el 31 de diciembre de 1813; Hamburgo, francesa hasta el tratado de París (30 de mayo de 1814), porque Davout no la dejó. |
| Un territorio cedido que aún no tiene dueño | El **gobierno provisional** que lo gobernaba, si lo hay. | Bélgica, del tratado de París al Congreso de Viena: el Gobierno General de los aliados, ni Francia ni los Países Bajos. |
| El nombre | El que tenía el estado **entonces**, como lo llama la Wikipedia de cada idioma. | En 1700, el Reino de Francia; en 1810, el Primer Imperio francés. |

Si la discrepancia tiene importancia histórica (una frontera en disputa, una fecha que cada
historiografía pone distinta, una soberanía que depende de quién la reconocía), también se
documenta, aquí y en la ficha si el lector debe saberlo. Las correcciones que salen de aquí están
en §1.1 y §1.4.1.

---

## 1. Las fronteras: CShapes 2.0

[CShapes 2.0](https://icr.ethz.ch/data/cshapes/) dibuja las fronteras de los estados
independientes y de los territorios que dependían de ellos (colonias, protectorados, mandatos,
territorios ocupados) de 1886 a 2019, con el día exacto de cada cambio.

> Schvitz, G., Girardin, L., Rüegger, S., Weidmann, N. B., Cederman, L.-E., y Gleditsch, K. S.
> (2022). Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. _Journal of
> Conflict Resolution_, 66(1), 144–161.

- **Licencia**: CC BY-NC-SA 4.0. Los archivos de `public/data/` son una obra derivada con la misma
  licencia: se pueden compartir y adaptar citando el origen, **pero no con fines comerciales**.
- **Edición**: la de Gleditsch y Ward que trae el [paquete `cshapes` de R](https://github.com/cran/cshapes)
  (`cshapes_2_gw.topojson`).
- **Qué se hace con él** (`npm run data:borders`): se toma entero, de 1886 en adelante; se
  recorta a `[-28°, 30°, 78°, 82°]`, se simplifica hasta el 12 % de los vértices, las fechas pasan a
  enteros y se calculan los colores y dónde va cada nombre. Dos vecinos no comparten nunca color;
  además, los doce colores se reparten, y un ocupante no usa el del estado ocupado, para que la
  zona se distinga.

Los estados se identifican con los **códigos de Gleditsch y Ward** (`code`), los mismos de
CShapes y de buena parte de la ciencia política (los datos de conflictos del UCDP, por ejemplo).
Los hechos, los conflictos, los nombres y las banderas se refieren a ellos con estos códigos. Las
entidades anteriores a 1886 que no continúan ningún estado de CShapes llevan como código el QID de
Wikidata (`Q207162`) (§1.4). Los
nombres de los estados y de las capitales de CShapes están en inglés; los de la app salen de
`content/countries.yaml` y `content/capitals.yaml`, en los tres idiomas.

### 1.1 Dónde nos separamos

| Qué | Por qué |
| --- | --- |
| Crimea sigue en Ucrania después del 18 de marzo de 2014 | CShapes la pasa a Rusia. Aquí se dibuja la frontera reconocida internacionalmente, como hacen la resolución 68/262 de la Asamblea General de la ONU y la mayoría de atlas. La anexión se explica como hecho, e irá en la capa de ocupaciones. |
| Danzig, Ciudad Libre hasta el 1 de septiembre de 1939 | CShapes la termina el 31 de agosto de 1938 y la pone dentro de Alemania desde el 30 de septiembre de 1938: durante un mes no es de nadie. Es un error de un año; el Reich se la anexionó el 1 de septiembre de 1939. |
| La frontera de Rapallo, del 12 de noviembre de 1920 al 10 de febrero de 1947 | CShapes da a Yugoslavia lo que el tratado de Rapallo dio a Italia: el Litoral esloveno con Idrija y Postojna, Istria, Zara, Cres y Lošinj. Vuelve a ser italiano hasta el tratado de París. La línea, de Peč a Triglav, Snežnik y el golfo de Kvarner, está dibujada a mano a partir del artículo sobre el tratado (unos 2-5 km de error). |
| El Estado Libre de Fiume (1920-1924) y Fiume italiana (1924-1947) | CShapes no tiene el estado libre que creó Rapallo, y lo pone dentro de Yugoslavia. Aquí es un estado (con el QID de Wikidata como código) hasta el 22 de febrero de 1924, el decreto de anexión a Italia, y después italiano. Sušak, en la otra orilla del Rječina, sigue yugoslava. |
| El Dodecaneso, otomano hasta el 24 de julio de 1923 e italiano hasta el 10 de febrero de 1947 | CShapes lo hace griego desde 1913. Italia lo ocupaba desde 1912, pero Turquía no renunció a él hasta el tratado de Lausana; el tratado de París lo cedió a Grecia. |

**Las fechas, cuando las fuentes discrepan** (§0.1: una cesión va el día en que se firmó):

- **Rapallo** se firmó el 12 de noviembre de 1920; Italia lo aprobó por la ley del 19 de
  diciembre, y los nuevos límites entraron en vigor en enero de 1921.
- **Fiume.** El tratado de Roma es del 27 de enero de 1924, y la ratificación y el decreto de
  anexión, del 22 de febrero. El 16 de marzo, la fecha que dan muchos libros, el rey la visitó
  para proclamar la anexión: una ceremonia, no el cambio.
- **Lausana** se firmó el 24 de julio de 1923 y entró en vigor el 6 de agosto de 1924.
- **París** se firmó el 10 de febrero de 1947 y entró en vigor el 15 de septiembre: es cuando
  Yugoslavia recibió Pola y nació el Territorio Libre de Trieste. Grecia administró el Dodecaneso
  desde el 31 de marzo de 1947 y se lo anexionó formalmente el 7 de marzo de 1948.

Cada corrección es código, en la lista `CORRECTIONS` de `scripts/build-borders.mjs`, y tiene su
fila aquí. Los bordes nuevos se hacen después de simplificar, con las piezas de CShapes, para que
coincidan con los de los vecinos y la simplificación no se coma sus detalles (antes, el centro de
Fiume caía en Yugoslavia y Kastav en Italia); un test comprueba dónde cae cada lugar corregido,
año por año. Los archivos generados no se tocan nunca a mano.

### 1.2 Dónde fallan

- **Fronteras de tratado, no de ocupación.** CShapes recoge los cambios pactados —el acuerdo de
  Múnich, el primer arbitraje de Viena (1938), las anexiones soviéticas de 1940— pero no el
  territorio tomado por la fuerza, ni el segundo arbitraje de Viena (1940), que dio el norte de
  Transilvania a Hungría. Entre 1938 y 1945, Austria, Bohemia-Moravia y Polonia siguen saliendo.
  Lo explica la capa de ocupaciones (§1.3).
- **El Adriático, todavía a medias** (§1.1 corrige la frontera italiana). De 1919 a 1920, cuando
  Istria y Fiume estaban ocupadas por Italia y aún no se había pactado la frontera, CShapes las da
  a Yugoslavia, y aquí se deja así; tampoco está la Regencia del Carnaro de D'Annunzio. De 1947 a
  1954, Trieste sale italiana y Koper yugoslava, sin el Territorio Libre de Trieste. Lastovo,
  Palagruža y Saseno, italianas de 1920 a 1947, y Kastellorizo, no están en CShapes; y la
  simplificación borra casi todas las islas del Adriático, también Cres y Krk.
- **Sin microestados.** Andorra, Liechtenstein, Mónaco, San Marino y el Vaticano no están en
  CShapes.
- **Criterios de soberanía.** Algunas decisiones son de la lista de Gleditsch y Ward: Montenegro
  es parte de Yugoslavia de 1918 a 2006, y Alemania Occidental empieza en 1945, con las zonas de
  ocupación aliadas.
- **Se acaba en 2019.** Se da por hecho que ninguna frontera reconocida de Europa ha cambiado
  después; si cambia alguna, se añadirá a mano.
- **Geometría simplificada.** Para ver el continente basta; para medir distancias o superficies,
  no.

### 1.3 La capa de ocupaciones

Lo que se controlaba de hecho entre 1938 y 1945 va en una capa aparte, que se puede ocultar y
que pinta cada zona del color del estado que la controlaba, con el nombre, quién la controlaba y
por qué. Cada zona tiene un archivo en `content/occupations/`, con el texto, las fechas, quién la
controlaba, por qué (`cause`, un hecho con el año, sacado del texto de la zona) y la fuente, y
una forma que hace `npm run data:occupations` (`scripts/build-occupations.mjs`).

**Las fechas.** Una zona empieza el día en que el ocupante toma el control —la capitulación, el
armisticio, la anexión o la toma de la capital— y termina el día en que lo pierde: la retirada,
la capitulación o la liberación de la capital. Mientras se combatía, lo que sale en el mapa es el
conflicto, no la zona; los frentes no se dibujan. En las zonas grandes, la capital marca las dos
fechas aunque una parte cambiara de manos antes o después: Ucrania ocupada va de la toma de Kiev,
en septiembre de 1941, a su liberación, en noviembre de 1943, aunque el oeste no se liberó hasta
1944.

**La forma** se hace con piezas que ya existen, para que los bordes coincidan con los del mapa:

| De dónde | Para qué | Ejemplo |
| --- | --- | --- |
| Un estado de CShapes, de la misma época o de otra | La mayoría de las zonas | Austria es la Austria de 1938; Bohemia y Moravia, la Checoslovaquia de 1939 dentro de la Chequia actual |
| Las divisiones administrativas actuales, de [Natural Earth](https://www.naturalearthdata.com/) (dominio público) | Los bordes que seguían una división que todavía existe | Alsacia y Mosela son tres departamentos; la República Social Italiana, las provincias del norte de Italia; Kosovo, repartido por municipios |
| Líneas dibujadas a mano (`LINES` en el script), con la fuente al lado | Donde no hay nada más | El reparto de Polonia, la línea de demarcación francesa, el segundo arbitraje de Viena, Transnistria |

Las líneas dibujadas a mano son **aproximadas**, con un error de unos 10-20 km; las divisiones
actuales, tanto como se hayan movido desde entonces. La ficha de cada zona lo dice, y cita
Natural Earth si se usan sus divisiones. Un test comprueba que dos zonas de las mismas fechas no se
pisen.

**Qué hay**, en 59 zonas:

- **El oeste y el centro**: la expansión alemana de 1938-1939 (Austria, Bohemia y Moravia, el
  Estado Eslovaco, Memel), Zaolzie y la Rutenia húngara; el reparto de Polonia; la ocupación de
  Dinamarca, Noruega, los Países Bajos, Bélgica, Eupen-Malmedy, Luxemburgo y las islas del Canal,
  y la de Francia: la zona ocupada, la de Vichy, Alsacia y Mosela, las zonas de 1942 y Córcega.
- **Los Balcanes**: Albania; el reparto de Yugoslavia (el Estado Independiente de Croacia,
  Serbia, la Eslovenia alemana y la italiana, Dalmacia, lo que se añadió a la provincia de Fiume
  —Sušak, Kastav, Krk y Rab—, Pag, Brač y Hvar, ocupadas por Italia desde el 7 de septiembre de
  1941, Montenegro, Kosovo y el oeste de Macedonia unidos a Albania, la Macedonia búlgara, la
  Bačka y el Prekmurje húngaros) y el de Grecia (las zonas alemana, italiana y búlgara, y Creta).
  Lo que ya era italiano desde 1920 no entra: está en las fronteras (§1.1).
- **El Danubio y el Este**: el norte de Transilvania, Besarabia, el norte de Bucovina y
  Transnistria; los países bálticos, Bielorrusia, Ucrania y Crimea, ocupados de 1941 a 1944, y la
  Hungría ocupada de 1944.
- **Italia de 1943 a 1945**: la República Social Italiana, Roma y la Italia central, y las dos
  zonas de operaciones que Alemania se anexionó de hecho.

**Qué falta**:

- **La Rusia ocupada** de 1941 a 1943, de Smolensk al Cáucaso: cambió de manos con el frente, e
  irá con la capa de los frentes.
- **El resto de la Zona II**: el 7 de septiembre de 1941 Italia tomó el gobierno de toda la
  franja de la costa croata, no solo de Pag, Brač y Hvar. La franja de tierra aún sale dentro de
  Croacia.
- **El Dodecaneso alemán** de 1943 a 1945, y Zara, que tras el armisticio quedó bajo protección
  alemana hasta octubre de 1944.

### 1.4 Antes de 1886: Cliopatria

[Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria), de la Seshat Global
History Databank, dibuja las entidades políticas del mundo de 3400 a. C. a 2024, cada una con el año
en que empieza y en que termina cada forma. El mapa usa las de Europa de 1500 a 1885.

> Seshat Global History Databank. Cliopatria, versión 0.2.1. _Scientific Data_ (2025).
> https://doi.org/10.1038/s41597-025-04516-9

- **Licencia**: CC BY 4.0. Los archivos de `public/data/history/` son una obra derivada con la misma
  licencia.
- **Qué se hace** (`npm run data:history`, después de `npm run data:borders`, que da los colores):
  - Se quitan las agrupaciones (las filas entre paréntesis, que repiten las piezas de otras), y se
    recorta y se simplifica como CShapes.
  - Cada entidad lleva su QID de Wikidata. Si en 1885 ocupa el mismo lugar que un estado de CShapes
    de 1886, o está en la lista `SAME_STATE`, toma su código y su color: el Reino de Francia, la
    República y los dos Imperios son el 220, como la Francia de CShapes. La lista añade los
    predecesores que Gleditsch y Ward ya cuentan como el mismo estado (Prusia, el 255; el Reino de
    Cerdeña, el 325) y los que eran su núcleo (Inglaterra, el 200; la Monarquía de los Habsburgo, el 300).
  - El nombre es el título, en catalán y castellano, del artículo de Wikipedia que cita Cliopatria
    (`content/wikipedia.json`). Cuando no lo hay, o no es el de la entidad, lo pone
    `content/countries.yaml` por el QID.
  - Va en un archivo por siglo, y la app solo descarga el siglo que mira: todos juntos pesan diez
    veces las fronteras de CShapes.

**La precisión.** Cliopatria muestrea el mapa cada pocos años —cada año en los momentos agitados,
cada diez o más en los tranquilos— y cada forma vale hasta la muestra siguiente. Por eso las
fronteras cambian el 1 de enero y no el día en que ocurrió, y un cambio puede llegar uno o dos años
tarde. La ficha de cada estado lo dice, y la línea temporal lo marca con una franja rayada hasta
1886. Donde sabemos el día, el nombre sí cambia el día exacto (§1.4.1).

#### 1.4.1 Dónde nos separamos

Las correcciones son código, en `scripts/build-history.mjs`, y siguen los criterios de §0.1:
`CORRECTIONS` cambia de quién es una pieza y hasta cuándo; `SHAPES` devuelve un territorio a quien
era, y solo lo toma de quien lo ocupaba, para no tocar los cambios de verdad de los vecinos;
`TRANSITIONS` pone el cambio de los grandes tratados el día en que se firmaron. Cada una lleva la
descripción y las fechas al lado, comprobadas en Wikipedia. Donde Cliopatria no tiene la forma
buena (las ciudades libres, Ginebra, los enclaves de Gdansk y Toruń), `SHAPES` la toma de
OpenHistoricalMap (`OHM_SHAPES`) y, para la Cataluña que Francia se anexionó en 1812, de las
provincias de Natural Earth.

Las ocupaciones se han buscado pieza a pieza: un script recorre una cuadrícula de puntos cada medio
grado y apunta dónde un territorio cambia de manos y vuelve a quien lo tenía en menos de ocho años.
Cada caso se ha mirado en Wikipedia; los que eran control militar vuelven a quien eran, y los que
eran una cesión de verdad (Podolia, en 1672) se quedan.

| Qué | Por qué |
| --- | --- |
| Prusia, de 1809 a 1867 | Cliopatria le pone el nombre de la Confederación del Rin (1809-1814), en la que nunca entró, y el de la Confederación Germánica (1815-1867), que no era un estado. Su fila «Kingdom of Prussia» no llega a 2.000 km². |
| Ocupaciones contadas como soberanía | Cliopatria dibuja el control militar como si fuera una anexión, y la muestra lo alarga. Vuelven a quien eran: Viena, otomana en 1529-1533 y en 1683-1686 por dos asedios que fracasaron; Moscú y Lituania, francesas en 1812-1813 por seis meses de campaña; Viena (1805, 1809), Prusia y Varsovia (1807-1808) y España (1809-1811), francesas; París, alemán en 1870-1872; Barcelona, inglesa en 1706-1712; Sajonia, sueca y prusiana en las guerras de los Treinta Años y de los Siete Años, y prusiana en 1815-1819 y en 1866; Bohemia, prusiana en 1744 y en 1866; Brandeburgo, sueco en 1632-1647; Lombardía, sarda en 1848. |
| La guerra de los Treinta Años | Maguncia, Fráncfort, Wurzburgo, Erfurt, Mecklemburgo y Bremen-Verden salen suecos de 1632 a 1647, Hamburgo danés de 1622 a 1628, y Mecklemburgo, Hamburgo y Lübeck de los Habsburgo de 1629 a 1631. Suecia no gana nada hasta Westfalia (1648); el Mecklemburgo de Wallenstein era un feudo imperial. Todo vuelve al Sacro Imperio. |
| Valaquia y Moldavia | Vasallos otomanos, pero estados propios (§0.1). Cliopatria las hace rusas o austriacas en cada guerra (1769-1774, 1791, 1807-1812, 1828-1834, 1849-1856). Besarabia es rusa desde el tratado de Bucarest, el 28 de mayo de 1812, no desde 1807. |
| La revuelta bohemia | Del 23 de mayo de 1618 (la defenestración de Praga) a la Montaña Blanca, el 8 de noviembre de 1620, Bohemia se gobierna sola; Cliopatria la pone dentro del «Sacro Imperio» hasta 1621. |
| Más ocupaciones, buscadas pieza a pieza | Smolensk, Vilna y Kiev, rusos de 1654-1655 a la tregua de Andrusovo (9-2-1667), y la Livonia sueca, rusa de 1656 a 1661; Rusia, con unas cuantas villas de la guerra de Smolensk (1632-1634) y con la invasión sueca de 1708-1709; Finlandia, rusa de 1713 a 1721 (la Gran Ira); Holstein y Jutlandia, de los Habsburgo en 1627-1629; Silesia, Bohemia y Baviera, suecas en la guerra de los Treinta Años; Utrecht, francesa en 1672-1673; Saboya y Niza, francesas en 1691-1696 y en 1702-1705; el oeste de España, portugués en 1706-1708; Bohemia y el sur de Alemania, franceses en 1741-1743; en la guerra de los Siete Años, Bohemia prusiana, la Prusia Oriental y Pomerania rusas y Hesse y Westfalia francesas; el Budjak, ruso en 1769-1774 y en 1791; la Baja Baviera, austriaca en 1778-1779 (en Teschen, el 13 de mayo de 1779, Austria solo se queda el Innviertel); el suroeste de Alemania, francés en 1796; Bulgaria, rusa en 1877-1879: otomana hasta el tratado de Berlín (13-7-1878), y después el Principado de Bulgaria y Rumelia Oriental. Menorca, española desde 1783: Gran Bretaña la ocupó de 1798 a 1802, y Cliopatria se la vuelve a dar de 1806 a 1819. |
| La época napoleónica | Hannover, francés en 1803-1805; Portugal, francés en 1811; España, francesa en 1812-1813, cuando el Imperio solo se anexionó Cataluña (26 de enero de 1812); la Pomerania sueca, francesa en 1812-1813; Cracovia, del Gran Ducado de Varsovia desde Schönbrunn (14-10-1809) y no desde 1811; el Gran Ducado de Varsovia, ruso de 1813 al Congreso de Viena, cuando dejó de existir; Hannover, Hesse-Kassel y Brunswick, restaurados en 1813-1814 y que Cliopatria hace prusianos hasta 1815. Bélgica, del tratado de París (30 de mayo de 1814) al Congreso de Viena, es del Gobierno General de los aliados (§0.1), no de Francia. Luxemburgo y la orilla izquierda del Rin, no (§1.4.2). |
| Las ciudades libres | Hamburgo, Bremen y Lübeck, libres de 1806 a 1810: Francia las ocupa, pero no se las anexiona hasta 1811. Libres de nuevo, Bremen y Lübeck, en 1813, y Hamburgo, en el tratado de París (30 de mayo de 1814), porque Davout la defendió hasta el final. Fráncfort, ciudad imperial hasta 1806, de Dalberg (principado y, desde el 16 de febrero de 1810, gran ducado) hasta 1813, y libre después. Bremen, ciudad imperial, nunca sueca, danesa ni de Hannover, que tenían su entorno. Cliopatria las dibuja desplazadas (Bremen y Fráncfort, unos kilómetros al oeste) o confunde Lübeck con dos trozos de Mecklemburgo: la forma es la de OpenHistoricalMap de 1815. |
| Gdansk y Toruń | Polacas hasta la segunda partición (23-1-1793): en 1772 Prusia se queda el entorno, pero no las ciudades. La Ciudad Libre de Dánzig, del 21 de julio de 1807 al 2 de enero de 1814, y con el QID y el artículo de la napoleónica, no de la de 1920. |
| Finlandia | Rusa desde el tratado de Fredrikshamn (17 de septiembre de 1809), no desde el de Schönbrunn: la misma muestra de Cliopatria recoge los dos cambios. |
| Ginebra | República de 1534 a la anexión francesa (15 de abril de 1798) y del 31 de diciembre de 1813 al 19 de mayo de 1815, cuando entra en Suiza. Cliopatria la pone dentro de Saboya y, desde 1860, de Francia. |
| Solapamientos | Cliopatria deja el Piamonte al Reino de Cerdeña después de la anexión francesa (11 de septiembre de 1802), y Roma y el Lacio a los Estados Pontificios después de la del 17 de mayo de 1809: las dos piezas se solapaban. Wismar, que Suecia empeñó a Mecklemburgo el 26 de junio de 1803, era sueca y de Mecklemburgo a la vez. |
| Monarquías compuestas | La Austria y la Bohemia de Fernando I salen como parte de España (1529-1555); la Sajonia del elector que era rey de Polonia, como Polonia (1700-1756); la Toscana de los Habsburgo-Lorena, como Austria; Hannover, como británico o prusiano. Eran estados aparte. |
| Escocia | Reino aparte hasta el 1 de mayo de 1707, salvo durante la Commonwealth de Cromwell. Cliopatria la hace inglesa desde 1609 y la deja en blanco de 1640 a 1652. |
| Revueltas de pocos meses | El Estado Húngaro (14 de abril - 13 de agosto de 1849), la República de Baden (1 de junio - 23 de julio de 1849), la Sicilia de 1848 y el gobierno del Levantamiento de Noviembre (29 de noviembre de 1830 - 21 de octubre de 1831), con sus fechas; la muestra los alargaba hasta tres años. Las revueltas de Nalivaiko y de los hugonotes, dentro de su estado. |
| Los tratados, el día en que se firmaron | Westfalia (24-10-1648), los Pirineos (7-11-1659), Utrecht (11-4-1713), Passarowitz (21-7-1718), Nystad (10-9-1721), Aquisgrán (18-10-1748), las particiones de Polonia (5-8-1772, 23-1-1793 y 24-10-1795), Crimea (19-4-1783), Campo Formio (17-10-1797), Tilsit (9-7-1807), Schönbrunn (14-10-1809), Viena (9-6-1815), Bélgica (4-10-1830), Zúrich (10-11-1859), Turín (24-3-1860), Viena (30-10-1864), Praga (23-8-1866) y la Confederación de Alemania del Norte (1-7-1867); y, uno a uno, Andrusovo (9-2-1667), Fredrikshamn (17-9-1809) y Berlín (13-7-1878). Cliopatria los pone el 1 de enero de la muestra, y la segunda y la tercera partición de Polonia, un año antes. Cambian el mismo día todos los estados que se intercambian territorio, también los de fuera de la zona del tratado (en 1809, Suecia, que pierde Finlandia). |
| El día del cambio de régimen | Francia (1792, 1795, 1799, 1804, 1814, 1830, 1848, 1852, 1870), España (1873, 1874), Gran Bretaña (1707) y el Reino Unido (1801), Dinamarca y Noruega (1814), Suecia (1721), Prusia (1701), Austria-Hungría (1867), Italia (1861), la Italia napoleónica (1805), Nápoles (1806), la Toscana (1569), Grecia (1832), Serbia (1882) y Rumania (1862, 1881). |
| Nombres y artículos equivocados | «Serbs», el pueblo, para el Principado de Serbia; el condado de Urgel por Andorra; un «Reino de Mónaco»; los QID y los artículos de la Cataluña de hoy para la República Catalana de 1641, y de la Italia de hoy para la República Italiana de 1802; el Egipto de 1885, enlazado al «Reparto de África»; la Confederación Livonia, al idioma livonio; la Ciudad Libre de Dánzig de 1920 para la napoleónica; un «Reino de Hannover» en 1803, cuando lo fue desde 1814. |
| Francia en 1814 | Cliopatria da 100.000 km² alrededor de París al Gran Ducado de Berg, que tenía 15.000, en el Rin. |
| Alsacia y Lorena | Francesas hasta el tratado de Fráncfort (10 de mayo de 1871), no hasta el 1 de enero. |

**Discrepancias que lo son de verdad**, entre fuentes fiables, y el criterio que se ha tomado:

- **La tercera partición de Polonia.** Las tres potencias se ponen de acuerdo el 24 de octubre de
  1795, y el tratado que la cierra es del 26 de enero de 1797. El mapa usa 1795: es cuando la
  República de las Dos Naciones deja de existir de hecho, y el rey abdica un mes después.
- **El Imperio alemán.** Los tratados de adhesión de Baviera, Wurtemberg, Baden y Hesse entraron en
  vigor el 1 de enero de 1871; el emperador se proclamó el 18 de enero, y la constitución del
  Imperio es del 4 de mayo, la fecha que usa OpenHistoricalMap. El mapa usa el 1 de enero, cuando
  los estados del sur dejan de ser independientes.
- **Kiev de 1654 a 1667.** Tiene una guarnición rusa desde 1654, pero la República de las Dos
  Naciones no la cede hasta la tregua de Andrusovo, y aún por dos años: la paz perpetua de 1686 lo
  hace definitivo. El mapa sigue la soberanía: polaca hasta Andrusovo, y rusa desde entonces.
- **Bélgica en 1815.** Guillermo de Orange se proclama rey el 16 de marzo, y el Congreso de Viena la
  une a los Países Bajos el 9 de junio. El mapa usa el 9 de junio, como para el resto de cambios
  del Congreso.
- **Fráncfort de 1813 a 1815.** Wikipedia la hace libre desde 1813; OpenHistoricalMap, desde el 9 de
  julio de 1815, cuando vuelve la constitución de antes de Napoleón. El mapa la hace libre desde el
  1 de enero de 1814, cuando ya no hay gran duque.

#### 1.4.2 Dónde fallan

- **De año en año**, donde no hay un tratado o un régimen con la fecha puesta. Véase «La precisión»,
  arriba.
- **Más control de hecho**, donde no hay una forma buena para devolver el territorio a quien era:
  - **Luxemburgo y la orilla izquierda del Rin**, franceses hasta el Congreso de Viena, cuando desde
    el tratado de París (30 de mayo de 1814) eran de los gobiernos provisionales de los aliados.
  - **Podolia**, otomana del tratado de Buczacz (1672) al de Karlowitz (1699): Cliopatria solo la
    hace otomana de 1673 a 1676.
  - **Cerdeña y Sicilia**, españolas de 1718 a 1720, cuando España las había reconquistado pero el
    tratado de Utrecht las daba a Austria y a Saboya.
  - **Polonia de 1706 a 1713**, con el rey que puso Suecia (Estanislao I) como si fuera otro estado.
  - **El Período Tumultuoso** (1610-1618), con el oeste de Rusia polaco; **el Piamonte** de 1799,
    francés; **Lorena** en el siglo XVIII, entre Francia y el duque.
- **Estados pequeños fuera de 1815-1870.** Los del Sacro Imperio van juntos, con el nombre del
  Imperio, también los de Italia hasta 1740. Las ciudades libres sí están (§1.4.1), pero no el resto
  del Gran Ducado de Fráncfort (Aschaffenburg, Fulda, Hanau): salen Wurzburgo y Berg.
- **Bordes menos finos** que los de CShapes, y con un salto pequeño el 1 de enero de 1886, cuando
  empiezan los de CShapes.
- **Huecos.** El Hetmanato cosaco, que gobernaba la Ucrania central desde 1648, no está en
  Cliopatria: de 1653 a 1661 esa zona no es de nadie. La estepa, al sur de Rusia, está en blanco
  hasta que llega el Imperio ruso.
- **Piezas que se solapan**, pequeñas: España y Nápoles en Sicilia (1762), España, Austria y Saboya
  en Cerdeña y Sicilia (1721), el condado de Foix y la casa de Borbón dentro de Francia (1540-1563).
- **Sin banderas.** Empiezan en 1886: las anteriores aún no están documentadas.

### 1.5 La Europa central de 1815 a 1870: OpenHistoricalMap

Cliopatria no distingue bien los estados pequeños de la Confederación Germánica: pone Kassel dentro
de Hannover, Fráncfort dentro de Hesse-Darmstadt, Maguncia dentro de Fráncfort y Gotha dentro de
Prusia. [OpenHistoricalMap](https://www.openhistoricalmap.org/) (OHM, dominio público CC0) los tiene
todos, con el día de cada cambio y el QID de Wikidata. Entre el 9 de junio de 1815 (el Congreso de
Viena) y el 31 de diciembre de 1870 (el Imperio alemán), donde hay OHM manda OHM, y Cliopatria llena
el resto.

- **Qué se toma**: los estados de la Confederación Germánica, Austria y Prusia incluidas, la
  Confederación de Alemania del Norte, los de Italia, Liechtenstein, Luxemburgo, Mónaco y San
  Marino, y los gobiernos revolucionarios que gobernaron un territorio (Milán y Venecia en 1848,
  Sicilia en 1848-1849, las Provincias Unidas de Italia Central, Garibaldi en 1860). Los vecinos
  siguen siendo de Cliopatria: OHM tiene ahí errores que Cliopatria no tiene.
- **Dónde se corrige OHM**: la Prusia de 1829 a 1834 se adentra 13.000 km² en la Polonia rusa. La
  frontera occidental de Rusia no se movió de 1815 a 1914, y ahí manda CShapes. Al borde de la
  Ciudad Libre de Cracovia le faltan dos tramos, uno al norte y el del Vístula, que pasa por la
  ciudad, y el centro quedaba fuera: se cosen con una recta (`OHM.repair`), con un error de uno o
  dos kilómetros.
- **Los nombres**, de Wikidata (el nombre inglés y el artículo de Wikipedia), traducidos como los
  demás (§1.4), o de `content/countries.yaml`.
- **Se descarga una sola vez** (`npm run data:history`), en `data-raw/`: son unos cientos de MB.

Dónde falla:

- **Turingia antes de 1826.** OHM no tiene Sajonia-Gotha-Altemburgo, Sajonia-Hildburghausen ni
  Sajonia-Coburgo-Saalfeld antes de la reorganización del 12 de noviembre de 1826. En vez de poner
  lo que dice Cliopatria (Prusia, Baviera, Berg), el mapa dice lo que se sabe: **los ducados
  ernestinos**, sin separarlos.

---

## 2. Las banderas: Wikimedia Commons

La cronología —qué bandera usaba cada estado y hasta cuándo— es de este proyecto y vive en
`content/flags.yaml`. Las imágenes son de [Wikimedia Commons](https://commons.wikimedia.org/): las
descarga `npm run data:flags`, o el workflow «Flags» de GitHub cada vez que el archivo cambia.

- **Imágenes ligeras.** Se descarga el PNG de 330 px que renderiza Wikimedia, no el SVG original:
  algunos pasan del mega por los escudos detallados, y en el mapa una bandera mide 14 px de alto.
  Las ciento sesenta banderas ocupan un mega y medio.
- **Licencias.** Casi todas son de dominio público: una bandera no suele tener derechos de autor,
  o ya han caducado. Algunos dibujos de escudos son CC BY-SA, y entonces la app cita al autor bajo
  la bandera. Todas quedan anotadas en `public/flags/credits.json`.
- **Fechas.** Las de la adopción oficial, o la del primer uso si fue antes.
- **Cuando las fuentes no coinciden**, se usa el día en que tiene efecto la ley, el decreto o la
  constitución (§0.1), y el comentario del YAML dice qué otra fecha da la otra fuente. Las fechas
  que no están en la Wikipedia salen de [Flags of the World](https://www.fotw.info/), que cita los
  decretos. Los casos de ahora:
  - **Finlandia**: la cruz azul, desde la ley del 29 de mayo de 1918 (la Wikipedia dice el 28, el
    día que la votó el Parlamento). El león rojo, desde que se izó por primera vez, el 28 de
    diciembre de 1917.
  - **Bulgaria**: el decreto del 27 de enero de 1948 aprobó el primer escudo comunista; la
    Wikipedia lo usa como fecha del segundo, y Flags of the World dice que el primero duró dos
    meses más, sin día. Se toma el decreto. El cambio de 1967 es del decreto del 7 de diciembre (la
    Wikipedia dice el 5 de enero, sin fuente).
  - **Albania**: la bandera del reino, desde el Estatuto del 1 de diciembre de 1928 (Flags of the
    World dice el 22 de noviembre, y el dibujo lo fijó un decreto de agosto de 1929). Commons tiene
    una versión de 1928 a 1934 sin el casco de Skanderbeg que Flags of the World no recoge: en 1934
    solo se aclaró el rojo, y el mapa usa la del casco para todo el reino. Del 26 de julio al 7 de
    septiembre de 1943 no se sabe qué bandera usaba el Estado, y hay un hueco.
  - **Hungría**: el escudo de Kossuth vuelve a la bandera con la revolución, el 23 de octubre de
    1956 (Commons dice que oficialmente, el 12 de noviembre). La bandera con el agujero nunca fue
    oficial.
  - **China**: la bandera del Kuomintang, desde que Manchuria se adhiere al gobierno de Nankín (el
    29 de diciembre de 1928), que la usaba desde 1927 donde gobernaba. El dragón rectangular de la
    dinastía Qing se usaba en la marina desde 1881 y fue nacional en 1888 o 1889, y sale desde 1886.
- **Simplificaciones**, marcadas con un comentario en el YAML: Afganistán antes de 1929, cuando las
  banderas del emirato y del reino de Amanulá cambiaban a menudo y sin fechas exactas; la primera
  bandera de Irak (1921-1924) y la de la Federación Árabe (1958). Las colonias, los protectorados y
  los mandatos todavía no llevan ninguna (la India británica no tenía bandera nacional), ni Bujará,
  Jiva, Bosnia y Herzegovina bajo Austria-Hungría, Palestina, Gaza, Cisjordania y Cachemira. La
  Alemania ocupada (1945-1949) sale sin bandera propia, porque no la tenía.
- **Las banderas de regímenes como el nazi o el soviético** se enseñan en su contexto histórico y
  con finalidad educativa.

## 3. Los textos

Los hechos y los conflictos de `content/` los escriben quienes contribuyen, con licencia
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es). Todo lo que se dice se
tiene que poder comprobar: cada entrada enlaza al menos una fuente (Wikipedia vale para empezar).
Una fuente que no es Wikipedia va en `sources`, con el título, quién la publica y el enlace (la
resolución de la ONU sobre Crimea, por ejemplo). Cómo se escriben los textos está en
[CONTRIBUTING.es.md](CONTRIBUTING.es.md).
