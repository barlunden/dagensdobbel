// Ein stad for det du oftast vil endre.
export const SITE = {
  namn: 'Dagens Dobbel',
  undertittel: 'Ei øving for klang og ei for teknikk. Tilfeldig valt, kvar dag.',
  lead: 'Dagens Dobbel gir eleven to tilfeldige øvingar. Den eine har fokus på klang, den andre teknikk. Resultatet er ei lita, konkret økt som er enkel å gå i gang med. Øvinga kan vere ei typisk dagleg øving, ein liten song eller ei lita etyde.',
  // Bytt til di eiga Buy Me a Coffee-side:
  bmcUrl: 'https://buymeacoffee.com/barlunden',
};

export const KATEGORIAR = {
  lyrisk: {
    namn: 'Lange linjer og klang',
    kort: 'Linjer',
    skildring: 'Klang, lange linjer og frasering',
    forklaring:
      'Her øver du på å skape vakker klang, lange liner og song på instrumentet. Lytt nøye, og lat lufta lede deg fram.',
  },
  teknisk: {
    namn: 'Teknikk og artikulasjon',
    kort: 'Teknisk',
    skildring: 'Artikulasjon, presisjon, koordinasjon og tempo.',
    forklaring:
      'Her øver du på å spele nøyaktig: tydeleg artikulasjon, stødig rytme og sikre rørsler. Finn øvingar som passar for ditt nivå.',
  },
} as const;

export type Kategori = keyof typeof KATEGORIAR;

// Instrument: stemming bestemmer kva lydfil eleven får, nøkkel kva PDF.
// Alle les same noter (t.d. C-dur), men lydfila klingar i instrumentet si stemming.
// `instrument` er berre eksempel som vert viste til eleven – endre fritt.
export const STEMMINGAR = {
  c: { merke: 'C', instrument: 'Fløyte, trombone, tuba, fagott, obo' },
  bb: { merke: 'B♭', instrument: 'Trompet, kornett, klarinett, tenorsaksofon, tenorhorn, euphonium' },
  eb: { merke: 'E♭', instrument: 'Altsaksofon, barytonsaksofon, ess-kornett, ess-tuba' },
  f: { merke: 'F', instrument: 'Waldhorn' },
} as const;
export type StemmingId = keyof typeof STEMMINGAR;

// Standardstemming: førehandsvald for elevar, påkravd lydfil per øving (<id>/bb.mp3),
// og reserve når ei anna stemming manglar lydfil.
export const STANDARD_STEMMING = 'bb' satisfies StemmingId;

// F-nøkkel = same lydfil som C-instrument, notert ei oktav djupare.
export const NOKKLAR = {
  g: { namn: 'G-nøkkel', fil: 'g-nokkel.pdf' },
  f: { namn: 'F-nøkkel', fil: 'f-nokkel.pdf' },
} as const;
export type NokkelId = keyof typeof NOKKLAR;
