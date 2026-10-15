// Oppsett for instrument, stemming, nøkkel og filer. Ein stad for det du kan tenkje deg å endre.

// Instrument: eleven vel stemming (og nøkkel) og får notar transponerte for instrumentet.
// Alle brukar same lydfil, så lyden er ikkje avhengig av instrumentet.
//  - forskyving: halvtonar notert toneart ligg frå notasjonen for B♭-instrument (referansen).
//    Berre brukt til å rekne ut og vise notert toneart (oktav vert ikkje rekna ut).
//  - nokkler: kva nøklar det finst notar for (fil: <stemming>-<nøkkel>.pdf).
//  - instrument: berre eksempel som vert viste til eleven, per nøkkel. Same instrument kan stå fleire stader:
//    i brassband les trombone, baryton, euphonium og tuba transponert i G-nøkkel (B♭ eller E♭),
//    i orkester og janitsjarkorps les dei utransponert i F-nøkkel (C-instrument).
export const STEMMINGAR = {
  c: {
    merke: 'C',
    instrument: {
      g: 'Fløyte, obo og andre instrument som les klingande tonar',
      f: 'Trombone, baryton, euphonium, tuba, utransponert (orkester og janitsjarkorps)',
    },
    nokkler: ['g', 'f'],
    forskyving: 0,
  },
  bb: {
    merke: 'B♭',
    instrument: { g: 'Trompet, kornett, klarinett, tenorsaksofon, tenorhorn, tenortrombone, baryton, euphonium og B♭-tuba' },
    nokkler: ['g'],
    forskyving: 2,
  },
  eb: {
    merke: 'E♭',
    instrument: { g: 'Altsaksofon, barytonsaksofon, E♭-kornett, althorn, E♭-tuba' },
    nokkler: ['g'],
    forskyving: 9,
  },
  f: { merke: 'F', instrument: { g: 'Waldhorn' }, nokkler: ['g'], forskyving: 7 },
} as const;
export type StemmingId = keyof typeof STEMMINGAR;

// Standardstemming: førehandsvald for elevar, og påkravd notefil per øving (<id>/bb-g.pdf).
export const STANDARD_STEMMING = 'bb' satisfies StemmingId;

// Lydfil per øving: public/lyd/<id>/<LYDFIL>. Éi fil, felles for alle instrument.
export const LYDFIL = 'bb.mp3';

// Nøklar. PDF-filene heiter <stemming>-<nøkkel>.pdf, t.d. bb-g.pdf eller c-f.pdf.
export const NOKKLAR = {
  g: { namn: 'G-nøkkel' },
  f: { namn: 'F-nøkkel' },
} as const;
export type NokkelId = keyof typeof NOKKLAR;
