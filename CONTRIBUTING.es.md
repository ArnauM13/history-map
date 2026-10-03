# Cómo contribuir

[Català](CONTRIBUTING.md) · **Castellano** · [English](CONTRIBUTING.en.md)

Gracias por querer echar una mano. Hay tres maneras de ayudar:

1. **Contenido**: hechos, conflictos, nombres de estados y banderas. No hace falta programar.
2. **Datos**: arreglar una frontera o dibujar la capa de ocupaciones (ver la
   [hoja de ruta](FULL-DE-RUTA.md), §3, en catalán).
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
wikipedia: # el título del artículo en inglés; el catalán y el castellano los añade el workflow
  en: Treaty of Versailles
```

Basta con el título del artículo de la Wikipedia en inglés: cuando el cambio llega a GitHub, el
workflow «Wikipedia» busca el artículo en catalán y en castellano y añade su título. En local,
`npm run data:wikipedia` hace lo mismo.

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
```

- El nombre del archivo, exactamente como sale en la página de la bandera en Wikimedia Commons (lo
  que va después de `File:`).
- `flag: null` quiere decir que el estado no tenía bandera propia esos años; una entrada sin
  `flag`, que todavía no está documentada.
- No hace falta descargar nada: cuando el cambio llega a GitHub, el workflow «Flags» descarga las
  imágenes a `public/flags/` y hace un commit. En local, `npm run data:flags` hace lo mismo.
- En la *pull request*, di de dónde salen las fechas.

## Nombres de estados y de capitales

`content/countries.yaml` da el nombre de cada estado a lo largo del tiempo. Si un estado sale con
un nombre que no le tocaba en esa fecha, es aquí. Las capitales vienen de CShapes en inglés y se
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

## Código

Las convenciones están en [CLAUDE.md](CLAUDE.md) y el diseño, en [DESIGN.md](DESIGN.md) (los dos en
catalán). En resumen: comentarios y commits en catalán, textos de la interfaz en los tres idiomas,
ningún color fuera de los tokens, y todo comprobado en el navegador antes de subirlo.

## Las *pull requests*

- Una cosa por *pull request*; explica qué cambia y cómo lo has comprobado.
- Si es contenido, las fuentes, si no están ya en el archivo.
- Al contribuir, aceptas que el código se publique con licencia MIT y los textos con CC BY-SA 4.0.
