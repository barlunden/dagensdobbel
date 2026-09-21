// Ein stad for det du oftast vil endre.
export const SITE = {
  namn: 'Dagens Dobbel',
  undertittel: 'To korte etyder til dagens øvingsøkt: ei som handlar om klang, ei som handlar om teknikk.',
  lead: 'Trykk på knappen og få éi tilfeldig øving frå kvar av dei to gruppene. Kvar øving har notar og ei lydfil som akkompagnement. Det heile tek berre nokre få minutt. Gratis, utan innlogging.',
  // Bytt til di eiga Buy Me a Coffee-side:
  bmcUrl: 'https://buymeacoffee.com/DITT-BRUKARNAMN',
};

export const KATEGORIAR = {
  lyrisk: {
    namn: 'Lyrisk og klangfull',
    kort: 'Lyrisk',
    skildring: 'Tone, klang, frasering og song på instrumentet.',
    forklaring:
      'Her øver du på vakker klang: jamn og god tone, lange liner og song på instrumentet. Lytt nøye, og la lufta og klangen føre an.',
  },
  teknisk: {
    namn: 'Teknisk og artikulert',
    kort: 'Teknisk',
    skildring: 'Artikulasjon, presisjon, fingerferdigheit og tempo.',
    forklaring:
      'Her øver du på å spele nøyaktig: tydeleg artikulasjon, god puls og rytme. Raske og avslappa fingrar eller slide. Lytt til kompet, finn rytmen og spel saman med det.',
  },
} as const;

export type Kategori = keyof typeof KATEGORIAR;
