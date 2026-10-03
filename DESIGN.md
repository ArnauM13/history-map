# Disseny

Una referència pràctica perquè el que s'hi afegeixi s'assembli al que ja hi ha. El llenguatge és
el de Petja: **targetes blanques sobre un fons suau, cantonades rodones, ombres fluixes, el color
amb intenció i els tocs a mida de dit.**

Tot l'estil viu en un sol fitxer, `src/styles.css`.

---

## 1. Tokens

**Cap component escriu un color.** Tots són tokens de `:root` i tenen valor als dos temes; el fosc
(`prefers-color-scheme: dark`) només en canvia el valor, mai el nom. Si has d'escriure un hex en
un component, vol dir que falta un token.

| Token | Clar | Fosc | Per a |
| --- | --- | --- | --- |
| `--c-bg` | `#f5f5f5` | `#121212` | Fons de pàgina |
| `--c-card` | `#ffffff` | `#1e1e1e` | Targetes |
| `--c-subtle` | `#fafafa` | `#252525` | Fons enfonsat (el text d'una bandera, comptadors) |
| `--c-text` · `-2` · `-3` | `#1a1a1a` · `#555` · `#6e6e6e` | `#f0f0f0` · `#aaa` · `#949494` | Títols · cos · detalls |
| `--c-border` · `-2` | `#d5d5d5` · `#e4e4e4` | `#4a4a4a` · `#3a3a3a` | Camps · fils interiors |
| `--c-brand` | `#006874` | `#00838f` | L'acció principal (reproduir), el que està triat |
| `--c-brand-ink` | = marca | marca cap al text | La marca **quan fa de lletra** |
| `--c-conflict` | `#d32f2f` | `#ef5350` | Conflictes: llista, mapa i línia |
| `--c-event` | `#d97706` | `#ff9800` | Fets: llista, mapa i línia |
| `--c-success` | `#2e7d32` | `#66bb6a` | La xapa «Nova» d'una bandera |

El mapa té els seus colors a `src/map/style.ts`: el mar, les fronteres i la paleta d'atles de paper
dels estats. No segueixen el tema: un mapa antic és clar també de nit.

**Mides**: marge de pàgina 16 px, espai entre targetes 12 px, dins d'una targeta `14px 14px 16px`.
**Radis**: targeta 18, fila 14, pastilla 20, botó rodó 50 %. **Ombra**: `0 2px 10px var(--c-shadow)`.

**Lletra**: Roboto (400, 500, 700, 800).

| Paper | Mida | Gruix | Color |
| --- | --- | --- | --- |
| Títol de pàgina o de fitxa | 20 px | 800 | `--c-text`, `letter-spacing: -0.2px` |
| Títol de secció | 14 px | 700 | `--c-text-2` |
| Nom d'una fila | 13 px | 700 | `--c-text` |
| Detall d'una fila | 11 px | 500 | `--c-text-3` |
| Cos de text | 13 px | 500 | `--c-text-2`, interlineat 1,5 |

## 2. La pàgina

Escriptori: el mapa i la línia temporal a l'esquerra, el panell a la dreta (400 px). Pantalla
estreta (< 860 px): mapa, línia i panell, un sota l'altre. **El mapa és una targeta més**, amb el
mateix radi i la mateixa ombra.

## 3. Targetes i files

```html
<section class="card-section">
  <div class="section-header">
    <Icon name="swords" />
    <h2 class="section-title">Conflictes oberts</h2>
    <span class="section-count">2</span>
  </div>
  <ul class="item-list">
    <li>
      <button class="item-card conflict" title="Segona Guerra Mundial">
        <span class="ic-icon"><Icon name="swords" /></span>
        <span class="ic-body">
          <span class="ic-name">Segona Guerra Mundial</span>
          <span class="ic-detail">1 de setembre del 1939 – 8 de maig del 1945</span>
        </span>
      </button>
    </li>
  </ul>
</section>
```

- **Una sola capa.** Dins d'una `.card-section` les files són `.item-card` (vora fina, sense
  ombra). Cap targeta dins d'una targeta.
- **Tota la fila és el botó.** Res de `<div>` amb `onClick`.
- **Una línia i prou.** `.ic-name` i `.ic-detail` es tallen amb punts suspensius; el text sencer va
  al `title`.
- **El color el porta `--ic`**: `.conflict`, `.event`, o el que posi la fila. La icona rodona i la
  vora de la fila triada en surten.

## 4. Botons i pastilles

- `.icon-btn`: rodó, 36 px. `.icon-btn.primary`: 40 px, ple de la marca; només per a l'acció
  principal de la pantalla (reproduir).
- `.segmented`: el selector lliscant de dues opcions del panell (Banderes / Fets). La pastilla es
  mou; el text triat va amb `--c-brand-ink`.
- `.chip`: la xapa d'una categoria o de «Nova», tenyida amb `--ic`.
- `.map-toggle`: l'interruptor que flota sobre el mapa. L'estat va també a la icona (bandera plena
  o buida) i a `aria-pressed`, no només al color.

## 5. Buits

El buit **ofereix**, no constata: «Cap fet d'aquest any, de moment. N'afegim un?», mai «No hi ha
dades». Va dins de la seva targeta, amb `.empty-state`.

## 6. Icones

Material Symbols, com a Petja, però en SVG: `components/Icon.tsx` importa només les que es fan
servir (la font sencera pesa més d'un mega). Sempre `aria-hidden`; el nom el porta el botó.

## 7. Banderes

- `<Flag id size label>`: `sm` 16 px, `md` 22 px, `lg` 72 px d'alçada; l'amplada, la de la
  bandera (Suïssa és quadrada).
- Sense imatge: un requadre puntejat amb «–» (sense bandera pròpia) o «?» (per documentar). Mai
  una icona trencada.
- Al mapa, la bandera va a sobre del nom, amb un marc prim perquè les blanques no es perdin.
- Sota la bandera gran d'una fitxa hi ha d'on surt la imatge; si la llicència ho demana, l'autor.

## 8. Interacció i accessibilitat

- **Hover**: fons `--c-hover`; mai no canvia la mida de res.
- **Prémer**: `transform: scale(0.94–0.98)`.
- **Tocs**: 36 px com a mínim.
- **Focus**: `outline: 2px solid var(--c-brand); outline-offset: 2px`.
- **Botó només amb icona**: sempre `aria-label`. `title` sol no existeix al mòbil.
- **L'estat no només amb color**: `aria-pressed`, `aria-selected` o `aria-current`, i si es pot, a
  la icona.
- **Moviment**: les animacions respecten `prefers-reduced-motion`.

## 9. Com s'escriu el CSS

- **Línies agrupades.** Les propietats que van juntes, a la mateixa línia:

  ```css
  /* sí */
  display: flex; align-items: center; gap: 7px;
  font-size: 14px; font-weight: 700; color: var(--c-text-2);
  ```

- **Niat** per a `&:hover`, `&[aria-current]` i fills.
- **`color-mix()`** per als fons tenyits d'un color de variable (`--ic`, `--c-brand`).
- **Cap emoji** a la interfície: icones.
