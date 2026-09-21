type Kat = 'lyrisk' | 'teknisk';
const KATS: Kat[] = ['lyrisk', 'teknisk'];
const NIVAA_NAMN = ['alle nivå', 'nybyrjar', 'middels', 'viderekomen'];

const pool = Array.from(document.querySelectorAll<HTMLElement>('#pool [data-id]'));
const resultat = document.getElementById('resultat')!;
const merknad = document.getElementById('merknad')!;
const trekkKnapp = document.querySelector<HTMLButtonElement>('[data-trekk]')!;
const delKnapp = document.querySelector<HTMLButtonElement>('[data-del]')!;
const delStatus = document.querySelector<HTMLElement>('[data-delstatus]')!;
const nivaaKnappar = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-nivaa-val] button'));
const slots = Object.fromEntries(
  KATS.map((k) => [k, document.querySelector<HTMLElement>(`[data-slot="${k}"]`)!]),
) as Record<Kat, HTMLElement>;

const state = {
  nivaa: 0, // 0 = alle
  ids: { lyrisk: null, teknisk: null } as Record<Kat, string | null>,
};

const byId = (id: string | null) => pool.find((c) => c.dataset.id === id);

/** Kandidatar i ein kategori, filtrert på nivå. Fell tilbake til alle om nivået er tomt. */
function kandidatar(kat: Kat) {
  const alle = pool.filter((c) => c.dataset.kat === kat);
  if (!state.nivaa) return { liste: alle, fallback: false };
  const filtrert = alle.filter((c) => Number(c.dataset.nivaa) === state.nivaa);
  return filtrert.length ? { liste: filtrert, fallback: false } : { liste: alle, fallback: true };
}

function trekk(kat: Kat, unngaa: string | null = null) {
  const { liste, fallback } = kandidatar(kat);
  const val = liste.length > 1 ? liste.filter((c) => c.dataset.id !== unngaa) : liste;
  return { id: val[Math.floor(Math.random() * val.length)]?.dataset.id ?? null, fallback };
}

function visKort(kat: Kat) {
  const kilde = byId(state.ids[kat]);
  const slot = slots[kat];
  slot.replaceChildren();
  if (!kilde) {
    slot.innerHTML = '<p class="tom">Ingen øvingar i denne kategorien enno.</p>';
    return;
  }
  const kort = kilde.cloneNode(true) as HTMLElement;
  kort.classList.add('kort--ny');
  slot.append(kort);
}

function oppdaterUrl() {
  const p = new URLSearchParams();
  if (state.ids.lyrisk) p.set('l', state.ids.lyrisk);
  if (state.ids.teknisk) p.set('t', state.ids.teknisk);
  if (state.nivaa) p.set('n', String(state.nivaa));
  history.replaceState(null, '', `${location.pathname}#${p}`);
}

function oppdaterNivaaKnappar() {
  nivaaKnappar.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.nivaa) === state.nivaa)));
}

function visResultat(fokus = false) {
  KATS.forEach(visKort);
  resultat.hidden = false;
  trekkKnapp.textContent = 'Trekk på nytt';
  oppdaterUrl();
  if (fokus) resultat.focus({ preventScroll: false });
}

function nyttTrekk(fokus = true) {
  const fallbacks: string[] = [];
  KATS.forEach((k) => {
    const t = trekk(k, state.ids[k]);
    state.ids[k] = t.id;
    if (t.fallback) fallbacks.push(k);
  });
  merknad.hidden = fallbacks.length === 0;
  merknad.textContent = fallbacks.length
    ? `Fann ingen øvingar på nivået «${NIVAA_NAMN[state.nivaa]}» i ${fallbacks.join(' og ')} – trekte frå alle nivå.`
    : '';
  visResultat(fokus);
}

// Éin lydfil om gongen
document.addEventListener(
  'play',
  (e) => {
    document.querySelectorAll('audio').forEach((a) => a !== e.target && a.pause());
  },
  true,
);

trekkKnapp.addEventListener('click', () => nyttTrekk());

nivaaKnappar.forEach((b) =>
  b.addEventListener('click', () => {
    state.nivaa = Number(b.dataset.nivaa);
    oppdaterNivaaKnappar();
    if (!resultat.hidden) nyttTrekk(false);
  }),
);

// "Bytt denne" på enkeltkort
resultat.addEventListener('click', (e) => {
  const knapp = (e.target as HTMLElement).closest('[data-bytt]');
  if (!knapp) return;
  const kat = (knapp.closest('[data-kat]') as HTMLElement).dataset.kat as Kat;
  state.ids[kat] = trekk(kat, state.ids[kat]).id;
  visKort(kat);
  oppdaterUrl();
});

delKnapp.addEventListener('click', async () => {
  const lenke = location.href;
  try {
    if (navigator.share) await navigator.share({ title: document.title, url: lenke });
    else {
      await navigator.clipboard.writeText(lenke);
      delStatus.textContent = 'Lenke kopiert!';
    }
  } catch {
    /* brukaren avbraut */
  }
  setTimeout(() => (delStatus.textContent = ''), 3000);
});

// Les delt lenke: #l=<id>&t=<id>&n=<nivå>
const p = new URLSearchParams(location.hash.slice(1));
const n = Number(p.get('n'));
if (n >= 1 && n <= 3) state.nivaa = n;
oppdaterNivaaKnappar();
const l = p.get('l');
const t = p.get('t');
if (byId(l) || byId(t)) {
  state.ids.lyrisk = byId(l) ? l : trekk('lyrisk').id;
  state.ids.teknisk = byId(t) ? t : trekk('teknisk').id;
  visResultat(false);
}
