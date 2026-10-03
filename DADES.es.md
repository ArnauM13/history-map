# Los datos — de dónde salen, con qué licencia y dónde fallan

[Català](DADES.md) · **Castellano** · [English](DADES.en.md)

El mapa mezcla datos de sitios distintos, y cada uno tiene su licencia. **Si reaprovechas algo,
mira la licencia de esa parte.**

| Qué | De dónde sale | Licencia |
| --- | --- | --- |
| El código (`src/`, `scripts/`…) | Este proyecto | MIT |
| Los textos (`content/`) | Quien contribuye | CC BY-SA 4.0 |
| Las fronteras (`public/data/`) | CShapes 2.0, recortado y simplificado aquí | CC BY-NC-SA 4.0 |
| Las banderas (`public/flags/`) | Wikimedia Commons | La de cada imagen (§2) |
| Las letras del mapa (`public/fonts/`) | Open Sans, de [openmaptiles/fonts](https://github.com/openmaptiles/fonts) | Apache 2.0 |
| La letra de la interfaz | Roboto ([Fontsource](https://fontsource.org/)) | OFL 1.1 |
| Los iconos | [Material Symbols](https://fonts.google.com/icons) | Apache 2.0 |

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
- **Qué se hace con él** (`npm run data:borders`): se queda lo que vale de 1900 en adelante, se
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
  Múnich y los arbitrajes de Viena (1938 y 1940), las anexiones soviéticas de 1940— pero no el
  territorio tomado por la fuerza. Entre 1938 y 1945 el mapa todavía enseña Austria,
  Bohemia-Moravia y Polonia, y ninguna ocupación del Eje. Es el mayor agujero que queda por tapar
  (ver la [hoja de ruta](FULL-DE-RUTA.md), en catalán); mientras tanto, lo explican los hechos y
  los conflictos.
- **Sin microestados.** Andorra, Liechtenstein, Mónaco, San Marino y el Vaticano no están en
  CShapes.
- **Criterios de soberanía.** Algunas decisiones son de la lista de Gleditsch y Ward: Montenegro
  es parte de Yugoslavia de 1918 a 2006, y Alemania Occidental empieza en 1945, con las zonas de
  ocupación aliadas.
- **Se acaba en 2019.** Se da por hecho que ninguna frontera reconocida de Europa ha cambiado
  después; si cambia alguna, se añadirá a mano.
- **Geometría simplificada.** Para ver el continente basta; para medir distancias o superficies,
  no.

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
Los enlaces a Wikipedia en catalán y castellano los saca `npm run data:wikipedia` de los enlaces
entre idiomas del artículo en inglés. Cómo se escriben los textos está en
[CONTRIBUTING.es.md](CONTRIBUTING.es.md).
