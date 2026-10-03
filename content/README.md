# El contingut

Els textos del mapa: els fets, els conflictes, el nom de cada estat i les seves banderes. Com
s'afegeixen i com s'escriuen, a [CONTRIBUTING.md](../CONTRIBUTING.md).

```
countries.yaml     el nom de cada estat segons la data
flags.yaml         les banderes de cada estat segons la data, i què volen dir
events/            un fitxer per fet          (AAAA-MM-DD-nom-curt.yaml)
conflicts/         un fitxer per conflicte    (nom-curt.yaml)
```

L'esquema és a [`src/content/schema.ts`](../src/content/schema.ts), i `npm test` el comprova a
cada *pull request*: un fitxer mal escrit no arriba a la web.

## Llicència

Els textos d'aquesta carpeta es publiquen amb
[Creative Commons Reconeixement-CompartirIgual 4.0 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).
Es poden compartir i adaptar, també amb finalitat comercial, citant «Mapa històric d'Europa» i
publicant les adaptacions amb la mateixa llicència.
