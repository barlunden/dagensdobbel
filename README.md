# Dagens Dobbel

Astro (statisk) + content collections + vanleg CSS. Ingen backend.

## Kom i gang

```
npm install
npm run dev      # http://localhost:4321
npm run build    # ferdig side i dist/
```

## Legg til ei øving

1. Legg lydfil i `public/lyd/` og PDF i `public/noter/`.
2. Lag ei ny fil i `src/content/ovingar/lyrisk/` eller `.../teknisk/` (kopier ei eksisterande).
3. Fyll ut frontmatter: `tittel`, `kategori`, `nivaa` (1–3), `fokus`, `tips`, `varigheit`, `lyd`, `noter`
   og dei sorterbare felta (alle valfrie):
   - `tempo` – tal (slag/min). `tempoEining` – berre visning, standard `♩`
   - `toneart` – t.d. `"C-dur"`, `"a-moll"`, `"Ess-dur"` (norske namn: H, B, Ess, As, Fis …)
   - `lagast`, `hogast` – engelsk notenamn med oktav: `"C4"`, `"F#4"`, `"Bb3"` (engelsk B = norsk H). Ambitus vert rekna ut.
   - `storsteIntervall` – t.d. `"ren kvint"` (liste i `src/lib/musikk.ts`)
   - `rytme` – stavingar øvinga brukar: `["ta", "di", "ka", "mi"]`, trioler `["ta", "ki", "da"]`
   Feil felt eller filtype gjev feilmelding i terminalen (schema i `src/content.config.ts`).

## Det du oftast endrar

- `src/site.config.ts` – namn, undertittel, **Buy Me a Coffee-lenke**, kategorinamn
- `src/styles/global.css` – alle fargar er variablar øvst
- `src/scripts/dobbel.ts` – trekkelogikken (filtrering, "bytt denne", delbar lenke)
- `src/scripts/oversikt.ts` – søk, filter og sortering på oversiktssida
- `src/lib/musikk.ts` – toneartar, intervallnamn, ta-ka-di-mi og korleis sorteringsverdiane vert rekna ut
- `astro.config.mjs` – set `site` (og `base` om sida ligg i ein undermappe)

Byt ut plassholdar-filene (`lyrisk-01-…`, `teknisk-01-…`) med dine eigne.
