# 2014-ucraina-guerra

**Pregunta**: qui controlava cada tros d'Ucraïna (i de la província russa de Kursk) des del 2014,
fase a fase, amb el front de cada moment.

**Abast**: la capa d'ocupacions, del 27 de febrer del 2014 a avui: Crimea, el Donbàs de les
«repúbliques populars», la invasió del 2022 i l'annexió de quatre províncies, i l'ocupació
ucraïnesa de Kursk. No hi entren els fets ni el conflicte (ja hi eren), ni la resta de territoris
en disputa de l'antiga URSS.

**Estat**: tancat — recerca, integració i comprovació fetes el 2026-10-05.

## Context

DADES.md §0.1 (l'annexió que l'ONU declara nul·la no canvia la sobirania) i §1.3. Fitxers:
`scripts/build-occupations.mjs` (`FRONTS`, `front()`, les zones), `content/occupations/`,
`src/components/Sidebar.tsx` (la nota del front i la font).

## Troballes

- 2014-02-27 — soldats russos sense distintius prenen el parlament de Crimea; 2014-03-18, l'annexió
  (font: «Annexation of Crimea by the Russian Federation»; resolució 68/262 de l'ONU).
- 2014-09-05 — protocol de Minsk; 2015-02-18, Debaltseve (font: «Minsk agreements», «Battle of
  Debaltseve»). Del 2014-04 al 2014-09 el front es movia cada setmana: no s'hi dibuixa.
- 2022-03-02 Kherson; 2022-04-02 província de Kíiv alliberada; 2022-07-03 Lisitxansk; 2022-09-10
  Izium i Kupiansk; 2022-09-30 annexió de quatre províncies (resolució ES-11/4); 2022-11-11
  Kherson; 2024-02-17 Avdiivka; 2024-10-01 Vuhledar (ISW; Ucraïna anuncia la retirada el 2).
- Kursk: entrada el 2024-08-06, Sudja el 2024-08-15, recuperada per Rússia el 2025-03-13 (el
  ministeri rus ho anuncia la nit del 12; CNN, Moscow Times); Rússia dona la província per
  recuperada el 2025-04-26.
- 2025-2026: Pokrovsk i Myrnohrad (entrada el novembre del 2025, presa entre el desembre i el
  gener), Siversk (desembre del 2025), Huliaipole (desembre del 2025, ISW ho confirma el febrer).
  Kupiansk, que Rússia diu presa el novembre del 2025, surt ucraïnesa a DeepStateMap.
- DeepStateMap: historial públic des del 2022-04-03 (`/api/history/public`, una instantània per
  dia; `/api/history/<id>/geojson`). Els noms dels polígons canvien d'escriptura (i alguns venen
  amb caràcters trencats); els colors no. També hi surten territoris de fora d'Ucraïna amb
  etiquetes polítiques (Carèlia, Prússia Oriental…): per això tot es retalla amb Ucraïna o, a
  Kursk, amb Rússia i un requadre. La llicència no diu res de les geometries.
- Àrea ocupada fora de Crimea, segons DeepStateMap: ~98.500 km² a l'agost del 2022, ~81.500 després
  de Kherson, ~81.200 el febrer del 2024, ~84.300 a final del 2024, ~88.500 a final del 2025 i
  ~89.700 l'octubre del 2026.

## Decisions

- Les fases es parteixen pels fets que mouen el front i, on no n'hi ha cap (2025-2026), per
  semestres; la línia és la d'un dia de dins de la fase (criteri nou a DADES §0.1).
- Des del 2022-09-30, dues zones per fase: dins de les quatre províncies, `annexation`; fora,
  `occupation`. La vora entre totes dues és la de les províncies de Natural Earth.
- El Donbàs del 2014-2022 és `client` de Rússia; des del 2022-03-02 entra a la Ucraïna ocupada.
- La fase del març del 2022 és el màxim del mes (ocupat + ja alliberat a la primera instantània).

## Fet

- `build-occupations.mjs`: `FRONTS`, `front()`, `LINES.debaltseve`, `LINES.kursk`, 22 zones i la
  propietat `front` a la sortida. 22 fitxers a `content/occupations/`.
- La fitxa diu de quin dia és la línia i cita DeepStateMap. DADES, README i FULL-DE-RUTA, als
  tres idiomes on toca.

## Pendent

- Afegir una fase nova cada sis mesos (una instantània més a `FRONTS` i un fitxer més), o abans
  si un fet mou el front: tancar l'última amb `until` i obrir-ne una de nova.
