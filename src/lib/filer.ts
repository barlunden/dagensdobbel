// Finn lyd- og notefilene til ei øving ut frå mappestrukturen (ingen filnamn i frontmatter):
//   public/lyd/<id>/bb.mp3                  éi lydfil, felles for alle instrument (namnet er LYDFIL i instrument.config)
//   public/noter/<id>/<stemming>-<nøkkel>.pdf   t.d. bb-g.pdf, c-g.pdf, c-f.pdf, eb-g.pdf, f-g.pdf
// Krav: lydfila og standardstemminga si G-nøkkel-PDF (bb-g.pdf). Resten er valfrie; manglar dei,
// får eleven ei melding i staden for feil noter.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { url } from './url';
import { LYDFIL, STANDARD_STEMMING, STEMMINGAR, type StemmingId } from '../instrument.config';
import type { Toneart } from './musikk';
import { transponerToneart } from './transponer';

export interface Filer {
  lyd: string;
  /** Nøkkel "<stemming>-<nøkkel>", t.d. "c-f", til URL. Berre filer som finst. */
  noter: Record<string, string>;
  /** Notert toneart per stemming (rekna ut frå `toneart`, som gjeld B♭-notasjonen). */
  toneart?: Record<StemmingId, string>;
}

const finst = (rel: string) => existsSync(join(process.cwd(), 'public', rel));

export const noteNokkel = (stemming: string, nokkel: string) => `${stemming}-${nokkel}`;

export function filerFor(id: string, toneart?: Toneart): Filer {
  const lydRel = `lyd/${id}/${LYDFIL}`;
  if (!finst(lydRel)) throw new Error(`Øvinga «${id}» manglar public/${lydRel}`);

  const noter: Record<string, string> = {};
  for (const [stemming, v] of Object.entries(STEMMINGAR)) {
    for (const nokkel of v.nokkler as readonly string[]) {
      const rel = `noter/${id}/${noteNokkel(stemming, nokkel)}.pdf`;
      if (finst(rel)) noter[noteNokkel(stemming, nokkel)] = url(rel);
    }
  }
  const standard = noteNokkel(STANDARD_STEMMING, 'g');
  if (!noter[standard]) throw new Error(`Øvinga «${id}» manglar public/noter/${id}/${standard}.pdf`);

  const ut: Filer = { lyd: url(lydRel), noter };
  if (toneart) {
    ut.toneart = Object.fromEntries(
      Object.entries(STEMMINGAR).map(([st, v]) => [st, transponerToneart(toneart, v.forskyving)]),
    ) as Record<StemmingId, string>;
  }
  return ut;
}

/** PDF for standardstemminga (G-nøkkel). Alltid til stades, ellers stoppar bygget. */
export const standardNoter = (f: Filer) => f.noter[noteNokkel(STANDARD_STEMMING, 'g')];

export const filerJson = (id: string, toneart?: Toneart) => JSON.stringify(filerFor(id, toneart));
