import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { INTERVALL_NAMN, STAVINGAR, TONEART_NAMN, TONE_RE, toneTilMidi } from './lib/musikk';

const tone = z
  .string()
  .regex(TONE_RE, 'Bruk engelsk notenamn med oktav, t.d. C4, F#4 eller Bb3 (engelsk B = norsk H)');

const ovingar = defineCollection({
  // id = filnamn utan mappe og .md, t.d. "lyrisk-01-lange-tonar" (brukt i URL-ar og delte lenker)
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/ovingar',
    generateId: ({ entry }) => entry.replace(/^.*\//, '').replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      tittel: z.string(),
      kategori: z.enum(['lyrisk', 'teknisk']),
      nivaa: z.number().int().min(1).max(3).default(1), // 1 = nybyrjar, 3 = viderekomen
      fokus: z.string(), // ei linje: kva øver du på?
      tips: z.string().optional(), // kort tips til eleven
      varigheit: z.number().optional(), // minutt
      lyd: z.string(), // filnamn i public/lyd/
      noter: z.string(), // filnamn i public/noter/

      // --- Sorterbare parameterar (alle valfrie; manglande verdi hamnar sist) ---
      tempo: z.number().min(20).max(300).optional(), // slag per minutt
      tempoEining: z.string().default('♩'), // berre for visning, t.d. '♩.' i 6/8
      toneart: z.enum(TONEART_NAMN).optional(), // t.d. 'C-dur', 'a-moll', 'Ess-dur'
      lagast: tone.optional(), // lågaste tone, t.d. 'C4'
      hogast: tone.optional(), // høgaste tone, t.d. 'G5'  (ambitus vert rekna ut)
      storsteIntervall: z.enum(INTERVALL_NAMN).optional(), // største melodiske sprang
      // Stavingar øvinga brukar (ta-ka-di-mi-systemet). ki/da = trioler.
      rytme: z.array(z.enum(STAVINGAR)).min(1).default(['ta']),
    })
    .refine((d) => !d.lagast || !d.hogast || toneTilMidi(d.lagast) <= toneTilMidi(d.hogast), {
      message: '«hogast» kan ikkje vere lågare enn «lagast»',
      path: ['hogast'],
    })
    .refine(
      (d) =>
        !d.storsteIntervall ||
        !d.lagast ||
        !d.hogast ||
        INTERVALL_NAMN.indexOf(d.storsteIntervall) <= toneTilMidi(d.hogast) - toneTilMidi(d.lagast),
      {
        message: '«storsteIntervall» kan ikkje vere større enn ambitus (høgaste minus lågaste tone)',
        path: ['storsteIntervall'],
      },
    ),
});

export const collections = { ovingar };
