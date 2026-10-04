# Cómo contribuir

[Català](CONTRIBUTING.md) · **Castellano** · [English](CONTRIBUTING.en.md)

Gracias por querer echar una mano. Hay tres maneras de ayudar:

1. **Contenido**: hechos, conflictos, nombres de estados y banderas. No hace falta programar.
2. **Datos**: arreglar una frontera o añadir zonas a la capa de ocupaciones, como las de 1917 a
   1923 (ver la [hoja de ruta](FULL-DE-RUTA.md), §3, en catalán).
3. **Código**: funcionalidades, diseño, accesibilidad.

Si no sabes por dónde empezar, mira los *issues* con la etiqueta `content`, o abre uno y lo
hablamos.

## Ponerlo en marcha

```bash
git clone https://github.com/ArnauM13/history-map.git
cd history-map
npm install
npm run dev
```

Antes de abrir una *pull request*:

```bash
npm run lint && npm run typecheck && npm test && npm run format
```

## Añadir un hecho

Un archivo nuevo en `content/events/`, con el nombre `AAAA-MM-DD-nombre-corto.yaml`. El nombre del
archivo es su identificador.

```yaml
date: 1919-06-28 # AAAA-MM-DD, calendario gregoriano
category: treaty # war | treaty | revolution | independence | political | integration | crisis
location: [2.120, 48.805] # [longitud, latitud]; opcional, pone una marca en el mapa
countries: [255, 220, 200] # los estados que aparecen, con el código de content/countries.yaml
title:
  ca: Tractat de Versalles
  es: Tratado de Versalles
  en: Treaty of Versailles
summary:
  ca: >-
    …
  es: >-
    Dos o tres frases: qué pasó y por qué importa.
  en: >-
    …
wikipedia: # la fuente principal: el título del artículo de la Wikipedia en inglés
  en: Treaty of Versailles
sources: # opcional: otras fuentes, con título, quién la publica y el enlace
  - title: The Versailles Treaty, June 28, 1919
    publisher: The Avalon Project, Yale Law School
    url: https://…
```

**Ningún hecho sin fuente.** Hace falta como mínimo el título del artículo de la Wikipedia en inglés
o una fuente en `sources` (los tests no dejan entrar nada sin). No hace falta buscar el título en
catalán ni en castellano: cuando el cambio llega a GitHub, el workflow «Fonts» comprueba que el
artículo existe, saca su título en los otros idiomas (`content/wikipedia.json`) y abre cada enlace
de `sources` para ver que responde. En local, `npm run data:sources` hace lo mismo.

## Añadir un conflicto

Un archivo en `content/conflicts/nombre-corto.yaml`. Los mismos campos que un hecho, salvo la
fecha:

```yaml
start: 1936-07-17
end: 1939-04-01 # sin `end`, el conflicto sigue abierto
category: civil-war # world-war | interstate | civil-war | independence | uprising
location: [-3.7, 40.4] # obligatorio: un punto del frente principal
```

## Banderas

`content/flags.yaml` tiene tres partes:

```yaml
catalogue: # identificador → nombre del archivo en Wikimedia Commons
  es-1931: Flag of Spain (1931–1939).svg

about: # opcional: qué significa y por qué llegó, en dos o tres frases
  es-1931:
    es: >-
      La Segunda República cambió la franja roja de abajo por una morada…

states: # código del estado → sus banderas, por orden
  "230":
    - { until: 1931-04-13, flag: es-1785 } # until = el último día que se usó
    - { until: 1939-03-31, flag: es-1931 }
    - { flag: es } # la última no lleva until

sources: # de dónde salen las fechas: artículos de la Wikipedia en inglés
  "230": [Flag of Spain]
```

- El nombre del archivo, exactamente como sale en la página de la bandera en Wikimedia Commons (lo
  que va después de `File:`).
- `flag: null` quiere decir que el estado no tenía bandera propia esos años; una entrada sin
  `flag`, que todavía no está documentada.
- No hace falta descargar nada: cuando el cambio llega a GitHub, el workflow «Flags» descarga las
  imágenes a `public/flags/` y hace un commit. En local, `npm run data:flags` hace lo mismo.
- Las fechas tienen que salir de algún sitio: el artículo de `sources` del estado, o uno que añadas.

## Nombres de estados y de capitales

`content/countries.yaml` da el nombre de cada estado a lo largo del tiempo. Si un estado sale con
un nombre que no le tocaba en esa fecha, es aquí. Cada nombre cita el artículo de la Wikipedia en
inglés sobre el estado con ese nombre (`wiki: Russian Empire`). Las capitales vienen de CShapes en inglés y se
traducen en `content/capitals.yaml`. El código de un estado está en `public/data/labels.geojson`
(`gwcode`).

## Cómo se escribe

- **Neutral.** Explica qué pasó; si algo está en disputa, di quién lo disputa.
- **Breve.** Dos o tres frases. El detalle, en las fuentes.
- **Comprobable.** Todo lo que digas tiene que estar en las fuentes que enlazas.
- **Con tus palabras.** No copies de otros sitios: los textos se publican con CC BY-SA 4.0.
- **En los tres idiomas, si puedes.** Con uno basta: lo que falte se leerá en otro, y alguien lo
  traducirá.

## Fronteras

`public/data/` no se toca a mano: lo genera `npm run data:borders`. Una corrección a CShapes va en
la lista `CORRECTIONS` de `scripts/build-borders.mjs`, con su fila y la fuente en
[DADES.es.md](DADES.es.md).

## Ocupaciones

Una zona de la capa de ocupaciones tiene dos partes. El texto, en
`content/occupations/nombre-corto.yaml`:

```yaml
start: 1939-10-26 # el día en que el ocupante toma el control
control: # quién la controlaba y cómo, por orden; until = el último día
  - until: 1945-01-19
    by: 255
    kind: occupation # annexation | occupation | client
    cause: # por qué, en pocas palabras: sale en el mapa, bajo el nombre de la zona
      ca: Invasió de Polònia, 1939
countries: [290] # de quién era el territorio según las fronteras reconocidas
title:
  es: Gobierno General
label: # opcional: el nombre corto que va en el mapa
  es: …
summary:
  es: >-
    Dos o tres frases, como un hecho.
flag: sk-1939 # opcional: si el territorio usaba una propia
wikipedia:
  en: General Government
```

Y la forma, en `ZONES` de `scripts/build-occupations.mjs`: con un estado de CShapes, con las
divisiones actuales de Natural Earth o, si no hay nada más, con una línea dibujada a mano y la
fuente al lado. Después, `npm run data:occupations`. Cómo se hacen y qué fechas se usan, en
[DADES.es.md](DADES.es.md) §1.3.

## Código

Las convenciones están en [CLAUDE.md](CLAUDE.md) y el diseño, en [DESIGN.md](DESIGN.md) (los dos en
catalán). En resumen: comentarios y commits en catalán, textos de la interfaz en los tres idiomas,
ningún color fuera de los tokens, y todo comprobado en el navegador antes de subirlo.

## Las *pull requests*

- Una cosa por *pull request*; explica qué cambia y cómo lo has comprobado.
- Si es contenido, las fuentes, si no están ya en el archivo.
- Al contribuir, aceptas que el código se publique con licencia MIT y los textos con CC BY-SA 4.0.
