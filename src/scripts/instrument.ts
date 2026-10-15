// Eleven vel stemming (C, B♭, E♭, F), nøkkel (G, F) og eventuelt toneart. Valet gjeld alle sider og vert hugsa i nettlesaren.
// Alle brukar same lydfil. Kvart element med data-filer="{lyd, noter, toneart}" får rett PDF
// (transponert for instrumentet) og notert toneart. Trekk og oversikt brukar `egnar` til å vise berre
// øvingar som finst for instrumentet (og tonearten, om ho er vald), og lyttar på `instrument-endra`.
import { STANDARD_STEMMING } from '../instrument.config';

type Stemming = 'c' | 'bb' | 'eb' | 'f';
type Nokkel = 'g' | 'f';
interface Filer {
  lyd: string;
  noter: Record<string, string>;
  toneart?: Partial<Record<Stemming, string>>;
}

export const INSTRUMENT_ENDRA = 'instrument-endra';
const LAGRING = 'dagens-dobbel:instrument';
const STEMMINGAR: Stemming[] = ['c', 'bb', 'eb', 'f'];
const val: { stemming: Stemming; nokkel: Nokkel; toneart: string } = { stemming: STANDARD_STEMMING, nokkel: 'g', toneart: '' };

try {
  const lagra = JSON.parse(localStorage.getItem(LAGRING) ?? 'null');
  if (lagra && STEMMINGAR.includes(lagra.stemming)) val.stemming = lagra.stemming;
  if (lagra && (lagra.nokkel === 'g' || lagra.nokkel === 'f')) val.nokkel = lagra.nokkel;
  if (lagra && typeof lagra.toneart === 'string') val.toneart = lagra.toneart;
} catch {
  /* lagring ikkje tilgjengeleg – bruk standardval */
}

const bar = document.querySelector<HTMLElement>('[data-instrument]');
const velgar = bar?.querySelector<HTMLSelectElement>('select[name="toneart"]');
// toneart (notert for stemminga) -> tal øvingar med notar, per stemming. Kjem frå innhaldet ved bygging.
let matrise: Record<string, Record<string, number>> = {};
try {
  matrise = JSON.parse(bar?.dataset.toneartar ?? '{}');
} catch {
  /* tom matrise */
}

const radio = (s: Stemming) => bar?.querySelector<HTMLInputElement>(`input[name="stemming"][value="${s}"]`);
const merke = (s: Stemming) => radio(s)?.dataset.merke ?? s.toUpperCase();
// Kva nøklar stemminga har notar for (frå data-nokkler på radioknappen)
const tillatne = (s: Stemming) => (radio(s)?.dataset.nokkler ?? 'g').split(',');
const effektivNokkel = (): Nokkel => (tillatne(val.stemming).includes(val.nokkel) ? val.nokkel : 'g');
const harInnhald = (toneart: string, s: Stemming) => (matrise[toneart]?.[s] ?? 0) > 0;
// Vald toneart gjeld berre når ho har øvingar for stemminga (elles: alle toneartar)
const effektivToneart = () => (val.toneart && harInnhald(val.toneart, val.stemming) ? val.toneart : '');

/** Gjeldande val. toneart er tom streng når eleven ikkje har valt ei. */
export const hent = () => ({ stemming: val.stemming, nokkel: effektivNokkel(), toneart: effektivToneart(), merke: merke(val.stemming) });

const cache = new WeakMap<HTMLElement, Filer | null>();
function filerAv(el: HTMLElement): Filer | null {
  if (!cache.has(el)) {
    try {
      cache.set(el, JSON.parse(el.dataset.filer ?? ''));
    } catch {
      cache.set(el, null);
    }
  }
  return cache.get(el) ?? null;
}

const harNoterFiler = (f: Filer) => !!(f.noter[`${val.stemming}-${effektivNokkel()}`] ?? f.noter[`${val.stemming}-g`]);
const passarToneart = (f: Filer) => {
  const t = effektivToneart();
  return !t || f.toneart?.[val.stemming] === t;
};
/** Finst det notar for valt instrument (valt nøkkel, elles G-nøkkel)? */
export const harNoter = (el: HTMLElement) => {
  const f = filerAv(el);
  return !!f && harNoterFiler(f);
};
/** Skal øvinga vere med for valt instrument og vald toneart? */
export const egnar = (el: HTMLElement) => {
  const f = filerAv(el);
  return !!f && harNoterFiler(f) && passarToneart(f);
};

function oppdater(el: HTMLElement) {
  const filer = filerAv(el);
  if (!filer) return;
  const meldingar: string[] = [];
  const st = merke(val.stemming);
  const nokkel = effektivNokkel();

  let noter: string | undefined = filer.noter[`${val.stemming}-${nokkel}`];
  if (!noter && nokkel !== 'g') {
    noter = filer.noter[`${val.stemming}-g`];
    if (noter) meldingar.push(`${nokkel.toUpperCase()}-nøkkel finst ikkje for denne øvinga enno. Du får G-nøkkel.`);
  }
  // Aldri vis noter frå ei anna stemming: dei står i feil toneart for instrumentet
  if (!noter) meldingar.push(`Notar for ${st}-instrument finst ikkje for denne øvinga enno.`);

  el.querySelectorAll<HTMLAnchorElement>('[data-noter-lenke]').forEach((a) => {
    a.hidden = !noter;
    if (noter) a.href = noter;
    else a.removeAttribute('href');
  });
  el.querySelectorAll<HTMLIFrameElement>('[data-noter-ramme]').forEach((fr) => {
    fr.hidden = !noter;
    if (!noter) fr.removeAttribute('src');
    else if (fr.getAttribute('src') !== noter) fr.setAttribute('src', noter);
  });
  el.querySelectorAll<HTMLElement>('[data-noter-mangler]').forEach((m) => (m.hidden = !!noter));

  const toneart = filer.toneart?.[val.stemming];
  if (toneart) el.querySelectorAll<HTMLElement>('[data-vis-toneart]').forEach((t) => (t.textContent = toneart));
  el.querySelectorAll<HTMLElement>('[data-vis-merke]').forEach((t) => (t.textContent = st));

  const merknad = el.querySelector<HTMLElement>('[data-instr-merknad]');
  if (merknad) {
    merknad.textContent = meldingar.join(' ');
    merknad.hidden = meldingar.length === 0;
  }
}

/** Bruk valet på alle element med data-filer under `rot` (eller `rot` sjølv). */
export function bruk(rot: ParentNode = document) {
  const mål = Array.from(rot.querySelectorAll<HTMLElement>('[data-filer]'));
  if (rot instanceof HTMLElement && rot.matches('[data-filer]')) mål.push(rot);
  mål.forEach(oppdater);
}

function synkBar() {
  if (!bar) return;
  const ok = tillatne(val.stemming);
  const nokkel = effektivNokkel();
  bar.querySelectorAll<HTMLInputElement>('input[name="stemming"]').forEach((i) => (i.checked = i.value === val.stemming));
  const nokkelRadioar = bar.querySelectorAll<HTMLInputElement>('input[name="nokkel"]');
  nokkelRadioar.forEach((i) => {
    i.checked = i.value === nokkel;
    i.disabled = !ok.includes(i.value);
  });
  const manglarNokkel = ok.length < nokkelRadioar.length;
  bar.querySelector('[data-nokkel-gruppe]')?.classList.toggle('er-av', manglarNokkel);

  const hjelpId = bar.querySelector(`[data-hjelp-for="${val.stemming}-${nokkel}"]`) ? `${val.stemming}-${nokkel}` : `${val.stemming}-g`;
  bar.querySelectorAll<HTMLElement>('[data-hjelp-for]').forEach((p) => (p.hidden = p.dataset.hjelpFor !== hjelpId));
  const nm = bar.querySelector<HTMLElement>('[data-nokkel-merknad]');
  if (nm) nm.hidden = !manglarNokkel;

  // Toneartar utan øvingar for stemminga vert grå og kan ikkje veljast
  if (velgar) {
    let utanInnhald = 0;
    velgar.querySelectorAll<HTMLOptionElement>('option[data-namn]').forEach((o) => {
      const ledig = harInnhald(o.value, val.stemming);
      o.disabled = !ledig;
      o.textContent = ledig ? (o.dataset.namn ?? o.value) : `${o.dataset.namn} (ingen enno)`;
      if (!ledig) utanInnhald++;
    });
    velgar.value = effektivToneart();
    const tm = bar.querySelector<HTMLElement>('[data-toneart-merknad]');
    if (tm) {
      tm.hidden = utanInnhald === 0;
      tm.textContent = `Toneartar i grått har ingen øvingar for ${merke(val.stemming)}-instrument enno.`;
    }
  }
}

bar?.addEventListener('change', (e) => {
  const inp = e.target as HTMLInputElement | HTMLSelectElement;
  if (inp.name === 'stemming') {
    val.stemming = inp.value as Stemming;
    // Tonearten gjeld ikkje om ho manglar øvingar for den nye stemminga
    if (val.toneart && !harInnhald(val.toneart, val.stemming)) val.toneart = '';
  } else if (inp.name === 'nokkel') val.nokkel = inp.value as Nokkel;
  else if (inp.name === 'toneart') val.toneart = inp.value;
  else return;
  try {
    localStorage.setItem(LAGRING, JSON.stringify(val));
  } catch {
    /* ignorer */
  }
  synkBar();
  bruk();
  document.dispatchEvent(new CustomEvent(INSTRUMENT_ENDRA));
});

if (bar) {
  synkBar();
  bar.hidden = false;
}
bruk();
