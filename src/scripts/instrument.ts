// Eleven vel stemming (C, B♭, E♭, F) og nøkkel (G, F). Valet gjeld alle sider og vert hugsa i nettlesaren.
// Kvart element med data-filer="{lyd:{…}, noter:{…}}" får rett lydfil og PDF.
import { STANDARD_STEMMING } from '../site.config';

type Stemming = 'c' | 'bb' | 'eb' | 'f';
type Nokkel = 'g' | 'f';
interface Filer {
  lyd: Partial<Record<Stemming, string>>;
  noter: Partial<Record<Nokkel, string>> & { g: string };
}

const LAGRING = 'dagens-dobbel:instrument';
const STEMMINGAR: Stemming[] = ['c', 'bb', 'eb', 'f'];
const val: { stemming: Stemming; nokkel: Nokkel } = { stemming: STANDARD_STEMMING, nokkel: 'g' };

try {
  const lagra = JSON.parse(localStorage.getItem(LAGRING) ?? 'null');
  if (lagra && STEMMINGAR.includes(lagra.stemming)) val.stemming = lagra.stemming;
  if (lagra && (lagra.nokkel === 'g' || lagra.nokkel === 'f')) val.nokkel = lagra.nokkel;
} catch {
  /* lagring ikkje tilgjengeleg – bruk standardval */
}

const bar = document.querySelector<HTMLElement>('[data-instrument]');
const merke = (s: Stemming) =>
  bar?.querySelector<HTMLInputElement>(`input[name="stemming"][value="${s}"]`)?.dataset.merke ?? s.toUpperCase();
// F-nøkkel høyrer til C-lyd, så andre stemmingar får alltid G-nøkkel
const effektivNokkel = (): Nokkel => (val.stemming === 'c' ? val.nokkel : 'g');

function oppdater(el: HTMLElement) {
  let filer: Filer;
  try {
    filer = JSON.parse(el.dataset.filer ?? '');
  } catch {
    return;
  }
  const meldingar: string[] = [];
  const st = merke(val.stemming);

  const lydSti = filer.lyd[val.stemming];
  const lyd = lydSti ?? (filer.lyd[STANDARD_STEMMING] as string);
  const std = merke(STANDARD_STEMMING);
  if (!lydSti) meldingar.push(`Lydfil i ${st} finst ikkje for denne øvinga enno. Du høyrer ${std}-versjonen, som klingar i feil toneart for instrumentet ditt.`);

  const nokkel = effektivNokkel();
  const noterSti = filer.noter[nokkel];
  const noter = noterSti ?? filer.noter.g;
  if (!noterSti) meldingar.push('F-nøkkel finst ikkje for denne øvinga enno. Du får G-nøkkel.');

  const audio = el.querySelector('audio');
  if (audio && audio.getAttribute('src') !== lyd) {
    audio.pause();
    audio.setAttribute('src', lyd);
  }
  el.querySelectorAll<HTMLAnchorElement>('[data-noter-lenke]').forEach((a) => (a.href = noter));
  el.querySelectorAll<HTMLIFrameElement>('[data-noter-ramme]').forEach((f) => {
    if (f.getAttribute('src') !== noter) f.setAttribute('src', noter);
  });

  const merkelapp = el.querySelector<HTMLElement>('[data-lydmerke]');
  if (merkelapp) merkelapp.textContent = lydSti ? `Lydfil for ${st}-instrument` : `Lydfil: ${std}-versjon (${st}-versjon er ikkje klar enno)`;
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
  const nokkelErAv = val.stemming !== 'c';
  bar.querySelectorAll<HTMLInputElement>('input[name="stemming"]').forEach((i) => (i.checked = i.value === val.stemming));
  bar.querySelectorAll<HTMLInputElement>('input[name="nokkel"]').forEach((i) => {
    i.checked = i.value === effektivNokkel();
    i.disabled = nokkelErAv;
  });
  bar.querySelector('[data-nokkel-gruppe]')?.classList.toggle('er-av', nokkelErAv);
  bar.querySelectorAll<HTMLElement>('[data-hjelp-for]').forEach((p) => (p.hidden = p.dataset.hjelpFor !== val.stemming));
  const nm = bar.querySelector<HTMLElement>('[data-nokkel-merknad]');
  if (nm) nm.hidden = !nokkelErAv;
}

bar?.addEventListener('change', (e) => {
  const inp = e.target as HTMLInputElement;
  if (inp.name === 'stemming') val.stemming = inp.value as Stemming;
  else if (inp.name === 'nokkel') val.nokkel = inp.value as Nokkel;
  else return;
  try {
    localStorage.setItem(LAGRING, JSON.stringify(val));
  } catch {
    /* ignorer */
  }
  synkBar();
  bruk();
});

if (bar) {
  synkBar();
  bar.hidden = false;
}
bruk();
