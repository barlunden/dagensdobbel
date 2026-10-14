# Dagens Dobbel

Astro (statisk) + content collections + vanleg CSS. Ingen backend.

## Kom i gang

```
npm install
npm run dev      # http://localhost:4321
npm run build    # ferdig side i dist/
```

## Legg til ei øving

1. Legg filene i ei mappe per øving, med same namn som `.md`-fila (utan `.md`):
   - Lyd, éi per stemming: `public/lyd/<id>/bb.mp3`, `c.mp3`, `eb.mp3`, `f.mp3`
     (lydfila klingar i stemminga: `bb.mp3` er til dømes Bb-dur når notane står i C-dur)
   - Notar, éi per nøkkel: `public/noter/<id>/g-nokkel.pdf` og `f-nokkel.pdf`
     (F-nøkkel = same lyd som C, notert ei oktav djupare)
   Berre `bb.mp3` (standardstemminga) og `g-nokkel.pdf` er påkravde. Manglar ei anna fil, får eleven ei melding
   og B♭/G-versjonen. Manglar påkravde filer, stoppar bygget med namnet på fila.
   Standardstemminga er sett med `STANDARD_STEMMING` i `src/site.config.ts`.
2. Lag ei ny fil i `src/content/ovingar/lyrisk/` eller `.../teknisk/` (kopier ei eksisterande).
3. Fyll ut frontmatter: `tittel`, `kategori`, `nivaa` (1–3), `fokus`, `tips`, `varigheit`
   og dei sorterbare felta (alle valfrie):
   - `tempo` – tal (slag/min). `tempoEining` – berre visning, standard `♩`
   - `toneart` – t.d. `"C-dur"`, `"a-moll"`, `"Ess-dur"` (norske namn: H, B, Ess, As, Fis …)
   - `lagast`, `hogast` – engelsk notenamn med oktav: `"C4"`, `"F#4"`, `"Bb3"` (engelsk B = norsk H). Ambitus vert rekna ut.
   - `storsteIntervall` – t.d. `"ren kvint"` (liste i `src/lib/musikk.ts`)
   - `rytme` – stavingar øvinga brukar: `["ta", "di", "ka", "mi"]`, trioler `["ta", "ki", "da"]`
   Feil felt eller filtype gjev feilmelding i terminalen (schema i `src/content.config.ts`).

## Det du oftast endrar

- `src/site.config.ts` – namn, undertittel, **Buy Me a Coffee-lenke**, kategorinamn
- `src/site.config.ts` (`STEMMINGAR`, `NOKKLAR`) – stemmingar, eksempelinstrument og filnamn for nøklar
- `src/scripts/instrument.ts` – instrumentvalet (hugsa i nettlesaren) og val av lyd/PDF
- `src/styles/global.css` – alle fargar er variablar øvst
- `src/scripts/dobbel.ts` – trekkelogikken (filtrering, "bytt denne", delbar lenke)
- `src/scripts/oversikt.ts` – søk, filter og sortering på oversiktssida
- `src/lib/musikk.ts` – toneartar, intervallnamn, ta-ka-di-mi og korleis sorteringsverdiane vert rekna ut
- `astro.config.mjs` – set `site` (og `base` om sida ligg i ein undermappe)

Byt ut plassholdar-filene (`lyrisk-01-…`, `teknisk-01-…`) med dine eigne.
