# Mapa histórico de Europa

[Català](README.md) · **Castellano** · [English](README.en.md)

**Europa de 1900 a hoy, en un mapa que se mueve: las fronteras, las banderas y lo que pasó.**

Eliges una fecha y el mapa te dice cómo era Europa ese día: qué estados había y cómo se llamaban,
qué bandera usaba cada uno, qué guerras estaban abiertas y qué pasó aquel año.

![Europa el 28 de junio de 1914](.github/captura.png)

---

## 1. El problema

La historia de Europa del siglo XX suele contarse con cuatro mapas —el de 1914, el de 1919, el de
1945 y el de 1991— y lo que pasa entre uno y otro hay que imaginarlo.

- **Fotos sueltas.** Entre 1918 y 1922 Europa cambia cada pocos meses. Cuatro mapas no lo
  explican; un mapa que se mueve, sí.
- **Todo por separado.** Un artículo para cada estado, otro para cada guerra y otro para cada
  bandera. Lo que pasaba a la vez nunca se ve junto.
- **Nombres que cambian.** El Imperio ruso, la Rusia soviética, la Unión Soviética y Rusia ocupan
  el mismo lugar del mapa. Si nadie te lo dice, parecen cuatro países.

## 2. La propuesta

| | |
| --- | --- |
| **Cualquier día** | Las fronteras de cualquier fecha de 1900 a hoy, con el día exacto de cada cambio. |
| **Cada bandera en su tiempo** | Cada estado lleva la bandera que tenía ese día, y su ficha las enseña todas. |
| **Lo que pasaba a la vez** | Los conflictos abiertos y los hechos del año, junto al mapa y en la línea temporal. |
| **Nada sin fuente** | Cada frontera y cada bandera dice de dónde sale y con qué licencia. |

## 3. Para quién es

- **Quien disfruta de la historia.** Quiere ver cómo se deshace Austria-Hungría mes a mes, o cuándo
  cambió de bandera España y por qué.
- **Docentes y estudiantes.** Necesitan un mapa que se pueda mover en clase y un enlace que abra
  exactamente la fecha que explican.
- **Quien colecciona banderas.** Encuentra la cronología de las banderas de Europa, con la imagen,
  la fecha y la fuente.

---

## 4. Qué hace

### 4.1 El mapa — Europa en una fecha

Las fronteras vigentes ese día, con el nombre que tenía cada estado en ese momento. Las colonias,
los protectorados y los territorios ocupados se distinguen de los estados independientes. Si
haces clic en un estado, se abre su ficha.

### 4.2 La línea temporal — un siglo, mes a mes

Se mueve mes a mes, se reproduce sola (un siglo en unos tres minutos) y salta de una fecha clave
a la siguiente. Debajo están los conflictos, en barras, y las marcas de los hechos o de los
cambios de bandera, según la pestaña que tengas abierta.

### 4.3 Banderas — todas, y cuándo cambiaron

En el mapa, cada estado lleva su bandera junto al nombre. En la pestaña Banderas están todas las
que ondeaban ese día y las que se estrenaron ese año. La ficha de un estado enseña todas las que
ha tenido, y al elegir una se salta a la fecha en que llegó. Las que tienen más historia llevan
dos frases que explican qué significan y por qué cambiaron.

### 4.4 Hechos y conflictos — qué pasó

Los conflictos abiertos en la fecha y los hechos del año, cada uno con dos o tres frases y el
enlace a Wikipedia, en tu idioma, para seguir leyendo.

### 4.5 Tres idiomas y un enlace

Catalán, castellano e inglés: la interfaz, los nombres de los estados y de las capitales, los
hechos, los conflictos y los textos de las banderas. La dirección lleva la fecha y el idioma
(`?d=1914-06-28&lang=es`): quien la recibe abre el mismo mapa.

## 5. Principios

1. **La fecha manda.** Lo que se ve —fronteras, nombres, banderas, conflictos— es lo de ese día,
   no lo de hoy.
2. **Nada sin fuente.** Cada hecho enlaza a donde se puede comprobar, y cada imagen dice de dónde
   sale.
3. **Neutral y breve.** Dos o tres frases que explican; el debate, en las fuentes.
4. **El contenido es de todos.** Añadir un hecho o corregir una bandera es editar un archivo de
   texto, sin programar.
5. **Una web estática.** Sin servidor, sin cuentas, sin nada que mantener que no sea el contenido.

## 6. Qué no hace (y es a propósito)

- **No es una enciclopedia.** Dos o tres frases y el enlace a Wikipedia; el resto está bien
  explicado allí.
- **No dibuja ocupaciones ni frentes, de momento.** Las fronteras son las de los tratados. Entre
  1938 y 1945, Austria y Polonia siguen saliendo (ver [DADES.es.md](DADES.es.md)). La capa de
  ocupaciones está en la [hoja de ruta](FULL-DE-RUTA.md) (en catalán).
- **No te pide nada.** Ni cuenta, ni cookies, ni datos tuyos.
- **No se puede usar comercialmente.** Las fronteras de CShapes son CC BY-NC-SA.

---

## 7. Cómo se ejecuta

Hace falta Node.js 22 o más reciente.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Orden | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Comprueba los tipos y deja la web en `dist/` |
| `npm test` | Tests, que también validan todos los archivos de contenido |
| `npm run lint` | oxlint |
| `npm run format` | Prettier |
| `npm run data:borders` | Vuelve a generar `public/data/` a partir de CShapes 2.0 |
| `npm run data:flags` | Descarga las banderas de `content/flags.yaml` |
| `npm run data:wikipedia` | Completa los enlaces a Wikipedia en catalán y castellano |

## 8. Cómo contribuir

Lo que más falta es contenido: hechos, conflictos, fechas de banderas. No hace falta saber
programar; es un archivo YAML corto. En [CONTRIBUTING.es.md](CONTRIBUTING.es.md) está cómo se hace.

## 9. Licencias

- **El código**: [MIT](LICENSE).
- **Los textos** de `content/`: [CC BY-SA 4.0](content/README.md).
- **Las banderas**: imágenes de [Wikimedia Commons](https://commons.wikimedia.org/), casi todas de
  dominio público; la de cada una está en `public/flags/credits.json` y en la app, bajo la bandera.
- **Las fronteras**: derivadas de [CShapes 2.0](https://icr.ethz.ch/data/cshapes/) (ETH Zúrich y
  Universidad de Constanza), CC BY-NC-SA 4.0: **solo uso no comercial**.

---

*El resto de la documentación está en catalán: el diseño en [DESIGN.md](DESIGN.md), lo que viene
en [FULL-DE-RUTA.md](FULL-DE-RUTA.md) y las convenciones del código en [CLAUDE.md](CLAUDE.md). Las
fuentes y las limitaciones de los datos, en [DADES.es.md](DADES.es.md).*
