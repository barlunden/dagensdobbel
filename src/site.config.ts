// Ein stad for det du oftast vil endre.
export const SITE = {
  namn: 'Dagens Dobbel',
  undertittel: 'To øvingar. Ein lyrisk, ein teknisk. Spel dei i dag.',
  // Bytt til di eiga Buy Me a Coffee-side:
  bmcUrl: 'https://buymeacoffee.com/DITT-BRUKARNAMN',
};

export const KATEGORIAR = {
  lyrisk: {
    namn: 'Lyrisk og klangfull',
    kort: 'Lyrisk',
    skildring: 'Tone, klang, frasering og song på instrumentet.',
  },
  teknisk: {
    namn: 'Teknisk og artikulert',
    kort: 'Teknisk',
    skildring: 'Artikulasjon, presisjon, fingerferdigheit og tempo.',
  },
} as const;

export type Kategori = keyof typeof KATEGORIAR;
