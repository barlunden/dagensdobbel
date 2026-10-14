// Ein stad for det du oftast vil endre.
export const SITE = {
  namn: 'Dagens Dobbel',
  undertittel: 'To korte øvingar til dagens øktar: ei om vakker tone, ei om presis teknikk.',
  lead: 'Trykk på knappen og få éi tilfeldig øving frå kvar av to grupper. Kvar øving har notar og ei lydfil som viser korleis det skal låte, og tek berre nokre få minutt. Gratis, utan innlogging.',
  // Bytt til di eiga Buy Me a Coffee-side:
  bmcUrl: 'https://buymeacoffee.com/DITT-BRUKARNAMN',
};

export const KATEGORIAR = {
  lyrisk: {
    namn: 'Lyrisk og klangfull',
    kort: 'Lyrisk',
    skildring: 'Tone, klang, frasering og song på instrumentet.',
    forklaring:
      'Her øver du på å spele vakkert: jamn og rund tone, lange liner og song på instrumentet. Lytt nøye, og la lufta og klangen føre an.',
  },
  teknisk: {
    namn: 'Teknisk og artikulert',
    kort: 'Teknisk',
    skildring: 'Artikulasjon, presisjon, fingerferdigheit og tempo.',
    forklaring:
      'Her øver du på å spele nøyaktig: tydeleg artikulasjon, jamn rytme og sikre fingrar eller tunge. Start sakte, og auk tempoet litt om gongen.',
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
