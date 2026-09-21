import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ovingar = defineCollection({
  // Alle .md-filer under src/content/ovingar/ (undermapper lyrisk/ og teknisk/ er berre for oversikt)
  // id = filnamn utan mappe og .md, t.d. "lyrisk-01-lange-tonar" (brukt i URL-ar og delte lenker)
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/ovingar',
    generateId: ({ entry }) => entry.replace(/^.*\//, '').replace(/\.md$/, ''),
  }),
  schema: z.object({
    tittel: z.string(),
    kategori: z.enum(['lyrisk', 'teknisk']),
    nivaa: z.number().int().min(1).max(3).default(1), // 1 = nybyrjar, 3 = viderekomen
    fokus: z.string(), // ei linje: kva øver du på?
    tips: z.string().optional(), // kort tips til eleven
    tempo: z.string().optional(), // t.d. "♩ = 72"
    varigheit: z.number().optional(), // minutt
    lyd: z.string(), // filnamn i public/lyd/
    noter: z.string(), // filnamn i public/noter/
  }),
});

export const collections = { ovingar };
