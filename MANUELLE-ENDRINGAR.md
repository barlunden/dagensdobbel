# Toneartsnyansering: frontmatter-`toneart` er no klingande toneart («natura»)

## Kopier inn (heile filer)
`src/scripts/instrument.ts`, `src/components/OvingKort.astro`, `README.md`

## 1. `src/instrument.config.ts` — nye forskyvingar
Forskyvinga er no rekna frå klingande toneart (ikkje frå B♭-notasjonen). Byt verdiane:

| stemming | før | no |
|---|---|---|
| c | -2 | 0 |
| bb | 0 | 2 |
| eb | 7 | 9 |
| f | 5 | 7 |

(og kommentaren over: «forskyving: halvtonar notert toneart ligg frå klingande toneart».)

## 2. `src/pages/ovingar/index.astro` — fire små endringar
1. Under dei andre importane:
   `import { STANDARD_STEMMING } from '../../instrument.config';`
   `import { toneartSortering, toneartSymbol, toneartTal } from '../../lib/transponer';`
2. I `g.rader.map`, rett etter `const f = filerFor(e.id, e.data.toneart);`:
   `const nt = f.toneart?.[STANDARD_STEMMING];`
3. På `<tr>`: byt tre attributt
   `data-toneart={nt}`
   `data-tonesort={nt && toneartSortering(nt)}`
   `data-forteikn={nt && toneartTal(nt)}`
4. Toneart-cella: `{nt ? <>{nt}<small>{toneartSymbol(nt)}</small></> : '–'}`

## 3. `src/content.config.ts` (valfritt, berre kommentar)
Kommentaren på `toneart`: «KLINGANDE toneart (som lydfila), t.d. 'B-dur' for B♭-dur».

## 4. Dine øvingar: gjer om `toneart` i frontmatter
Du må skrive klingande toneart. Alle eksisterande verdiar er notert for B♭-instrument, så flytt dei ei stor sekund ned:

C-dur→B-dur, G-dur→F-dur, D-dur→C-dur, A-dur→G-dur, E-dur→D-dur, F-dur→Ess-dur, B-dur→As-dur, Ess-dur→Des-dur,
a-moll→g-moll, e-moll→d-moll, h-moll→a-moll, d-moll→c-moll, g-moll→f-moll, c-moll→b-moll.
(`lagast`, `hogast` og `storsteIntervall` er uendra: framleis B♭-notasjon.)
