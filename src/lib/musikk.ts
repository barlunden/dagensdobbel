// Musikkteori-hjelparar. Éin stad for reglane som schema, kort og sortering bygger på.

/* ---------- Tonar ---------- */
// Engelsk notenamn + oktavnummer (vitskapleg notasjon). C4 = midt-C.
// OBS: engelsk B = norsk H, og engelsk Bb = norsk B.  Døme: "C4", "F#4", "Bb3".
export const TONE_RE = /^([A-G])([#b]?)(-?\d)$/;
const STAMME: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function toneTilMidi(tone: string): number {
  const m = TONE_RE.exec(tone);
  if (!m) throw new Error(`Ugyldig tone «${tone}». Bruk t.d. C4, F#4 eller Bb3.`);
  const [, bokstav, fortegn, oktav] = m;
  const justering = fortegn === '#' ? 1 : fortegn === 'b' ? -1 : 0;
  return (Number(oktav) + 1) * 12 + STAMME[bokstav] + justering;
}

/** "Bb3" -> "B♭3", "F#4" -> "F♯4" */
export const visTone = (tone: string) => tone.replace('#', '♯').replace(/^([A-G])b/, '$1♭');

/* ---------- Intervall ---------- */
// Indeks = tal halvtonar. Brukt både i schema (storsteIntervall) og til å vise ambitus.
export const INTERVALL_NAMN = [
  'prim', 'liten sekund', 'stor sekund', 'liten ters', 'stor ters', 'ren kvart',
  'tritonus', 'ren kvint', 'liten sekst', 'stor sekst', 'liten septim', 'stor septim',
  'ren oktav', 'liten none', 'stor none', 'liten desim', 'stor desim', 'ren undesim',
] as const;
export type IntervallNamn = (typeof INTERVALL_NAMN)[number];

export const ambitusNamn = (halvtonar: number) =>
  halvtonar < INTERVALL_NAMN.length ? INTERVALL_NAMN[halvtonar] : `${halvtonar} halvtonar`;

/* ---------- Toneartar ---------- */
// Verdi = tal forteikn (+ = kryss, − = b). Norske namn: H, B, Ess, As, Des, Ges, Fis, Cis …
export const TONEARTAR = {
  'C-dur': 0, 'G-dur': 1, 'D-dur': 2, 'A-dur': 3, 'E-dur': 4, 'H-dur': 5, 'Fis-dur': 6, 'Cis-dur': 7,
  'F-dur': -1, 'B-dur': -2, 'Ess-dur': -3, 'As-dur': -4, 'Des-dur': -5, 'Ges-dur': -6, 'Ces-dur': -7,
  'a-moll': 0, 'e-moll': 1, 'h-moll': 2, 'fis-moll': 3, 'cis-moll': 4, 'gis-moll': 5, 'dis-moll': 6, 'ais-moll': 7,
  'd-moll': -1, 'g-moll': -2, 'c-moll': -3, 'f-moll': -4, 'b-moll': -5, 'ess-moll': -6, 'as-moll': -7,
} as const;
export type Toneart = keyof typeof TONEARTAR;
export const TONEART_NAMN = Object.keys(TONEARTAR) as [Toneart, ...Toneart[]];

/* ---------- Rytme: ta-ka-di-mi ---------- */
// ta = slag, di = åttedel, ka/mi = sekstendelar, ki/da = trioler
export const STAVINGAR = ['ta', 'di', 'ka', 'mi', 'ki', 'da'] as const;
export type Staving = (typeof STAVINGAR)[number];
// Vekt brukt til å skilje like tal stavingar: slag < åttedel < sekstendel/triol
const VEKT: Record<Staving, number> = { ta: 0, di: 1, ka: 2, mi: 2, ki: 2, da: 2 };

/* ---------- Avleia verdiar ---------- */
interface Kjelde {
  toneart?: Toneart;
  lagast?: string;
  hogast?: string;
  storsteIntervall?: IntervallNamn;
  rytme: readonly Staving[];
}

export function avled(d: Kjelde) {
  const lagast = d.lagast ? { tekst: visTone(d.lagast), midi: toneTilMidi(d.lagast) } : undefined;
  const hogast = d.hogast ? { tekst: visTone(d.hogast), midi: toneTilMidi(d.hogast) } : undefined;

  const ambitus =
    lagast && hogast
      ? { halvtonar: hogast.midi - lagast.midi, namn: ambitusNamn(hogast.midi - lagast.midi) }
      : undefined;

  const sprang = d.storsteIntervall
    ? { halvtonar: INTERVALL_NAMN.indexOf(d.storsteIntervall), namn: d.storsteIntervall }
    : undefined;

  let toneart;
  if (d.toneart) {
    const forteikn = TONEARTAR[d.toneart];
    const moll = d.toneart.endsWith('-moll');
    const tal = Math.abs(forteikn);
    toneart = {
      namn: d.toneart,
      modus: moll ? 'moll' : 'dur',
      forteikn,
      tal,
      symbol: forteikn > 0 ? `${tal}♯` : forteikn < 0 ? `${tal}♭` : '0',
      // Sorteringsverdi: færrast forteikn først, dur før moll, kryss før b
      sortering: tal * 4 + (moll ? 2 : 0) + (forteikn < 0 ? 1 : 0),
    };
  }

  const stavingar = STAVINGAR.filter((s) => d.rytme.includes(s));
  const rytme = {
    stavingar,
    tekst: stavingar.join(' '),
    tal: stavingar.length,
    // Rytmisk kompleksitet: tal ulike stavingar først, så vekta sum
    verdi: stavingar.length * 100 + stavingar.reduce((sum, s) => sum + VEKT[s], 0),
  };

  return { lagast, hogast, ambitus, sprang, toneart, rytme };
}
