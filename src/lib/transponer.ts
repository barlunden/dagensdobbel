// Transponering av toneart (berre namnet, ikkje oktav).
import { TONEARTAR, TONEART_NAMN, type Toneart } from './musikk';

/* ---------- Transponering av toneart ---------- */
// Tonika som tonehøgdeklasse (0–11) ut frå tal forteikn: kvart kryss = ei kvint opp, dur/moll skil med ein liten ters.
const tonika = (n: Toneart) => (((TONEARTAR[n] * 7 - (n.endsWith('-moll') ? 3 : 0)) % 12) + 12) % 12;

/** Flytt ei toneart `halvtonar` opp (negativ = ned). Vel namnet med færrast forteikn. Døme: C-dur −2 → B-dur. */
export function transponerToneart(namn: Toneart, halvtonar: number): Toneart {
  const moll = namn.endsWith('-moll');
  const mal = (((tonika(namn) + halvtonar) % 12) + 12) % 12;
  return TONEART_NAMN.filter((n) => n.endsWith('-moll') === moll && tonika(n) === mal).sort(
    (a, b) => Math.abs(TONEARTAR[a]) - Math.abs(TONEARTAR[b]),
  )[0];
}

/* ---------- Hjelparar for toneart (brukt òg i nettlesaren) ---------- */
const forteiknAv = (namn: string) => (TONEARTAR as Record<string, number>)[namn];

/** Sorteringsverdi: færrast forteikn først, dur før moll, kryss før b. */
export function toneartSortering(namn: string): number {
  const f = forteiknAv(namn);
  if (f === undefined) return NaN;
  return Math.abs(f) * 4 + (namn.endsWith('-moll') ? 2 : 0) + (f < 0 ? 1 : 0);
}

/** Tal forteikn (0–7). */
export const toneartTal = (namn: string) => (forteiknAv(namn) === undefined ? NaN : Math.abs(forteiknAv(namn)));

/** "2♭", "1♯" eller "0". */
export function toneartSymbol(namn: string): string {
  const f = forteiknAv(namn);
  if (f === undefined) return '';
  return f > 0 ? `${f}♯` : f < 0 ? `${-f}♭` : '0';
}
