# Los datos — de dónde salen, con qué licencia y dónde fallan

[Català](DADES.md) · **Castellano** · [English](DADES.en.md)

El mapa mezcla datos de sitios distintos, y cada uno tiene su licencia. **Si reaprovechas algo,
mira la licencia de esa parte.**

| Qué | De dónde sale | Licencia |
| --- | --- | --- |
| El código (`src/`, `scripts/`…) | Este proyecto | MIT |
| Los textos (`content/`) | Quien contribuye | CC BY-SA 4.0 |
| Las fronteras (`public/data/`) | CShapes 2.0, recortado y simplificado aquí | CC BY-NC-SA 4.0 |
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
| El nombre de cada estado en cada época | El artículo de Wikipedia sobre el estado con ese nombre (`wiki` en `content/countries.yaml`) | En la ficha del estado |
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
  enteros y se calculan los colores y dónde va cada nombre.

Los estados se identifican con los **códigos de Gleditsch y Ward** (`gwcode`), los mismos de
CShapes y de buena parte de la ciencia política (los datos de conflictos del UCDP, por ejemplo).
Los hechos, los conflictos, los nombres y las banderas se refieren a ellos con estos códigos. Los
nombres de los estados y de las capitales de CShapes están en inglés; los de la app salen de
`content/countries.yaml` y `content/capitals.yaml`, en los tres idiomas.

### 1.1 Dónde nos separamos

| Qué | Por qué |
| --- | --- |
| Crimea sigue en Ucrania después del 18 de marzo de 2014 | CShapes la pasa a Rusia. Aquí se dibuja la frontera reconocida internacionalmente, como hacen la resolución 68/262 de la Asamblea General de la ONU y la mayoría de atlas. La anexión se explica como hecho, e irá en la capa de ocupaciones. |

Cada corrección es código, en la lista `CORRECTIONS` de `scripts/build-borders.mjs`, y tiene su
fila aquí. Los archivos generados no se tocan nunca a mano.

### 1.2 Dónde fallan

- **Fronteras de tratado, no de ocupación.** CShapes recoge los cambios pactados —el acuerdo de
  Múnich, el primer arbitraje de Viena (1938), las anexiones soviéticas de 1940— pero no el
  territorio tomado por la fuerza, ni el segundo arbitraje de Viena (1940), que dio el norte de
  Transilvania a Hungría. Entre 1938 y 1945, Austria, Bohemia-Moravia y Polonia siguen saliendo.
  Lo explica la capa de ocupaciones (§1.3).
- **Danzig** sale dentro de Alemania desde el 30 de septiembre de 1938. Fue ciudad libre hasta el
  1 de septiembre de 1939, cuando el Reich se la anexionó.
- **La frontera italiana de 1920 a 1947.** Istria, Fiume, el Litoral esloveno con Postojna y las
  islas de Cres y Lošinj salen dentro de Yugoslavia, y el Dodecaneso, dentro de Grecia, cuando
  eran italianos. La capa de ocupaciones no los cuenta en el reparto de Yugoslavia de 1941;
  corregir las fronteras está en la [hoja de ruta](FULL-DE-RUTA.md), §3 (en catalán).
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

Lo que se controlaba de hecho entre 1938 y 1945 va en una capa aparte, rayada y que se puede
ocultar. Cada zona tiene un archivo en `content/occupations/`, con el texto, las fechas, quién la
controlaba y la fuente, y una forma que hace `npm run data:occupations`
(`scripts/build-occupations.mjs`).

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

**Qué hay**, en 57 zonas:

- **El oeste y el centro**: la expansión alemana de 1938-1939 (Austria, Bohemia y Moravia, el
  Estado Eslovaco, Memel), Zaolzie y la Rutenia húngara; el reparto de Polonia; la ocupación de
  Dinamarca, Noruega, los Países Bajos, Bélgica, Eupen-Malmedy, Luxemburgo y las islas del Canal,
  y la de Francia: la zona ocupada, la de Vichy, Alsacia y Mosela, las zonas de 1942 y Córcega.
- **Los Balcanes**: Albania; el reparto de Yugoslavia (el Estado Independiente de Croacia,
  Serbia, la Eslovenia alemana y la italiana, Dalmacia, Montenegro, Kosovo y el oeste de Macedonia
  unidos a Albania, la Macedonia búlgara, la Bačka y el Prekmurje húngaros) y el de Grecia (las
  zonas alemana, italiana y búlgara, y Creta).
- **El Danubio y el Este**: el norte de Transilvania, Besarabia, el norte de Bucovina y
  Transnistria; los países bálticos, Bielorrusia, Ucrania y Crimea, ocupados de 1941 a 1944, y la
  Hungría ocupada de 1944.
- **Italia de 1943 a 1945**: la República Social Italiana, Roma y la Italia central, y las dos
  zonas de operaciones que Alemania se anexionó de hecho.

**Qué falta**:

- **La Rusia ocupada** de 1941 a 1943, de Smolensk al Cáucaso: cambió de manos con el frente, e
  irá con la capa de los frentes.
- **Trozos pequeños de las anexiones italianas de 1941**: lo que se añadió a la provincia de
  Fiume (Sušak, Kastav, Krk y Rab) y, desde el otoño, Hvar y Pag. Salen dentro de Croacia.

---

## 2. Las banderas: Wikimedia Commons

La cronología —qué bandera usaba cada estado y hasta cuándo— es de este proyecto y vive en
`content/flags.yaml`. Las imágenes son de [Wikimedia Commons](https://commons.wikimedia.org/): las
descarga `npm run data:flags`, o el workflow «Flags» de GitHub cada vez que el archivo cambia.

- **Imágenes ligeras.** Se descarga el PNG de 330 px que renderiza Wikimedia, no el SVG original:
  algunos pasan del mega por los escudos detallados, y en el mapa una bandera mide 14 px de alto.
  Las cien banderas ocupan menos de un mega.
- **Licencias.** Casi todas son de dominio público: una bandera no suele tener derechos de autor,
  o ya han caducado. Algunos dibujos de escudos son CC BY-SA, y entonces la app cita al autor bajo
  la bandera. Todas quedan anotadas en `public/flags/credits.json`.
- **Fechas.** Las de la adopción oficial, o la del primer uso si fue antes.
- **Simplificaciones**, marcadas con un comentario en el YAML: faltan algunas variantes de poca
  duración (Albania de 1914 a 1946, Bulgaria de 1946 a 1948 y de 1967 a 1971, Hungría de 1918 a
  1919 y de 1956 a 1957, el león rojo de Finlandia de 1917 a 1918). Las colonias, los
  protectorados y los mandatos todavía no llevan ninguna. La Alemania ocupada (1945-1949) sale sin
  bandera propia, porque no la tenía.
- **Las banderas de regímenes como el nazi o el soviético** se enseñan en su contexto histórico y
  con finalidad educativa.

## 3. Los textos

Los hechos y los conflictos de `content/` los escriben quienes contribuyen, con licencia
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es). Todo lo que se dice se
tiene que poder comprobar: cada entrada enlaza al menos una fuente (Wikipedia vale para empezar).
Una fuente que no es Wikipedia va en `sources`, con el título, quién la publica y el enlace (la
resolución de la ONU sobre Crimea, por ejemplo). Cómo se escriben los textos está en
[CONTRIBUTING.es.md](CONTRIBUTING.es.md).
