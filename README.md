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
   - Lyd: éi fil, `public/lyd/<id>/bb.mp3`, felles for alle instrument (filnamnet er `LYDFIL` i `src/instrument.config.ts`).
   - Notar: éi PDF per instrument, transponert frå same musikk: `public/noter/<id>/<stemming>-<nøkkel>.pdf`

     | Fil | For | Notert i (når B♭-instrument les C-dur) |
     |---|---|---|
     | `bb-g.pdf` | B♭-instrument, G-nøkkel (**påkravd**) | C-dur |
     | `c-g.pdf` | C-instrument, G-nøkkel | B-dur |
     | `c-f.pdf` | C-instrument, F-nøkkel (ei oktav djupare) | B-dur |
     | `eb-g.pdf` | E♭-instrument | G-dur |
     | `f-g.pdf` | F-instrument (waldhorn) | F-dur |

   Berre `bb.mp3` og `bb-g.pdf` er påkravde, og bygget stoppar med namnet på fila om dei manglar.
   Manglar ei anna PDF, får eleven ei melding (F-nøkkel manglar: G-nøkkel; ingen: inga PDF).
   Eleven får aldri noter for ei anna stemming, for dei ville stått i feil toneart.
   Standardstemminga er sett med `STANDARD_STEMMING` i `src/instrument.config.ts`.
2. Lag ei ny fil i `src/content/ovingar/lyrisk/` eller `.../teknisk/` (kopier ei eksisterande).
3. Fyll ut frontmatter: `tittel`, `kategori`, `nivaa` (1–3), `fokus`, `tips`, `varigheit`
   og dei sorterbare felta (alle valfrie):
   - `tempo` – tal (slag/min). `tempoEining` – berre visning, standard `♩`
   - `toneart` – **klingande toneart («natura»)**, same som på lydfila: `"B-dur"` for B♭-dur, `"a-moll"`, `"Ess-dur"` (norske namn: H, B, Ess, As, Fis …). Notert toneart per instrument vert rekna ut.
   - `lagast`, `hogast` – engelsk notenamn med oktav: `"C4"`, `"F#4"`, `"Bb3"` (engelsk B = norsk H). Ambitus vert rekna ut.
   - `storsteIntervall` – t.d. `"ren kvint"` (liste i `src/lib/musikk.ts`)
   - `rytme` – stavingar øvinga brukar: `["ta", "di", "ka", "mi"]`, trioler `["ta", "ki", "da"]`
   `lagast`, `hogast` og `storsteIntervall` gjeld notasjonen for standardstemminga (B♭, G-nøkkel).
   `toneart` er derimot klingande. Kortet viser t.d. «Natura B-dur · notert i C-dur for B♭-instrument», og tonearten
   byter etter instrumentet eleven har valt (E♭: G-dur, C: B-dur, F: F-dur).
   Feil felt eller filtype gjev feilmelding i terminalen (schema i `src/content.config.ts`).

## Toneartvelgar og tilgjenge

Øvst på sida vel eleven stemming, nøkkel og toneart. Tonearten er den som står i notane til instrumentet
(t.d. hornisten vel G-dur når B♭-instrumenta spelar C-dur, same lydfil). Valet gjeld heile sida (trekking og oversikt).

- Ei øving er tilgjengeleg for eit instrument når PDF-en `<stemming>-<nøkkel>.pdf` finst (F-nøkkel, elles G-nøkkel).
- Toneartlista er unionen av toneartane i alle stemmingar. Toneartar utan øvingar for instrumentet er gråa ut med forklaring.
- Notert toneart for kvar stemming vert rekna ut frå klingande `toneart` i frontmatter (`src/lib/transponer.ts`, forskyvingar i `instrument.config.ts`).
- Delte lenker viser alltid øvinga, med melding om notane manglar for instrumentet.
- Tonehøgd (lågaste/høgaste tone, ambitus) er alltid oppgitt i B♭-notasjon.

## Det du oftast endrar

- `src/site.config.ts` – namn, undertittel, **Buy Me a Coffee-lenke**, kategorinamn
- `src/instrument.config.ts` – stemmingar, eksempelinstrument, nøklar, standardstemming og lydfilnamn
- `src/scripts/instrument.ts` – instrumentvalet (hugsa i nettlesaren) og val av lyd/PDF
- `src/styles/global.css` – alle fargar er variablar øvst
- `src/scripts/dobbel.ts` – trekkelogikken (filtrering, "bytt denne", delbar lenke)
- `src/scripts/oversikt.ts` – søk, filter og sortering på oversiktssida
- `src/lib/musikk.ts` – toneartar, intervallnamn, ta-ka-di-mi og korleis sorteringsverdiane vert rekna ut
- `astro.config.mjs` – set `site` (og `base` om sida ligg i ein undermappe)

Byt ut plassholdar-filene (`lyrisk-01-…`, `teknisk-01-…`) med dine eigne.
