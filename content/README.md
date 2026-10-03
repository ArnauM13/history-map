# Historical content

This folder holds the texts of the map: events, conflicts and the names of states over time.
See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to add or edit entries.

```
countries.yaml     names of states by date and language
events/            one YAML file per event      (YYYY-MM-DD-short-name.yaml)
conflicts/         one YAML file per conflict   (short-name.yaml)
```

The schema is defined in [`src/content/schema.ts`](../src/content/schema.ts) and checked by
`npm test` on every pull request.

## Licence

The texts in this folder are licensed under
[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
You may share and adapt them, also commercially, as long as you credit "History Map
contributors" and share your adaptations under the same licence.
