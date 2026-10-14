// Finn lyd- og notefilene til ei øving ut frå mappestrukturen (ingen filnamn i frontmatter):
//   public/lyd/<id>/c.mp3, bb.mp3, eb.mp3, f.mp3      (éi per stemming)
//   public/noter/<id>/g-nokkel.pdf, f-nokkel.pdf      (éi per nøkkel)
// Krav: standardstemminga (bb.mp3) og g-nokkel.pdf. Resten er valfrie; manglar dei, fell sida tilbake med ei melding.
// @ts-expect-error Node.js types are not included in this project’s TypeScript config.
import { existsSync } from 'node:fs';
// @ts-expect-error Node.js types are not included in this project’s TypeScript config.
import { join } from 'node:path';
// @ts-expect-error Node.js types are not included in this project’s TypeScript config.
import { cwd } from 'node:process';
import { url } from './url';
import { NOKKLAR, STANDARD_STEMMING, STEMMINGAR, type NokkelId, type StemmingId } from '../site.config';

export interface Filer {
  lyd: Partial<Record<StemmingId, string>>;
  noter: Partial<Record<NokkelId, string>>;
}

const finst = (rel: string) => existsSync(join(cwd(), 'public', rel));

export function filerFor(id: string): Filer & { lyd: Record<typeof STANDARD_STEMMING, string>; noter: { g: string } } {
  const lyd: Filer['lyd'] = {};
  for (const s of Object.keys(STEMMINGAR) as StemmingId[]) {
    const rel = `lyd/${id}/${s}.mp3`;
    if (finst(rel)) lyd[s] = url(rel);
  }
  const noter: Filer['noter'] = {};
  for (const n of Object.keys(NOKKLAR) as NokkelId[]) {
    const rel = `noter/${id}/${NOKKLAR[n].fil}`;
    if (finst(rel)) noter[n] = url(rel);
  }
  if (!lyd[STANDARD_STEMMING]) throw new Error(`Øvinga «${id}» manglar public/lyd/${id}/${STANDARD_STEMMING}.mp3`);
  if (!noter.g) throw new Error(`Øvinga «${id}» manglar public/noter/${id}/${NOKKLAR.g.fil}`);
  return { lyd: lyd as Record<typeof STANDARD_STEMMING, string>, noter: noter as { g: string } };
}

export const filerJson = (id: string) => JSON.stringify(filerFor(id));
