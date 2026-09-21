// Søk, filter og sortering på oversiktssida. Alt ligg som data-attributt på tabellradene.
const form = document.querySelector<HTMLFormElement>('[data-filter]')!;
const status = document.querySelector<HTMLElement>('[data-status]')!;
const tbodyar = Array.from(document.querySelectorAll<HTMLTableSectionElement>('tbody[data-gruppe]'));
const alleRader = document.querySelectorAll('tbody tr[data-id]');
const hovud = Array.from(document.querySelectorAll<HTMLElement>('th[data-kol]'));

// Tal frå data-attributt. Manglande verdi = NaN, og alle samanlikningar med NaN er usanne.
const n = (s?: string) => (s === undefined || s === '' ? NaN : Number(s));
const tittel = (r: HTMLElement) => r.querySelector('th a')?.textContent ?? '';

/* ---------- Filter ---------- */
function lagFilter() {
  const f = new FormData(form);
  const s = (k: string) => String(f.get(k) ?? '');
  const valfritt = (k: string) => (s(k) === '' ? undefined : Number(s(k)));
  const nivaa = new Set(f.getAll('nivaa').map(String));
  const stav = new Set(f.getAll('stav').map(String));
  const ord = s('q').toLowerCase().split(/\s+/).filter(Boolean);
  const modus = s('modus');
  const toneart = s('toneart');
  const forteikn = valfritt('forteikn');
  const tempoFra = valfritt('tempoFra');
  const tempoTil = valfritt('tempoTil');
  const lagastFra = valfritt('lagastFra');
  const hogastTil = valfritt('hogastTil');
  const ambitusMaks = valfritt('ambitusMaks');
  const sprangMaks = valfritt('sprangMaks');

  return (r: HTMLElement): boolean => {
    const d = r.dataset;
    if (ord.some((o) => !(d.sok ?? '').includes(o))) return false;
    if (!nivaa.has(d.nivaa ?? '')) return false;
    if (modus && d.modus !== modus) return false;
    if (toneart && d.toneart !== toneart) return false;
    // Manglar raden verdien (NaN), fell ho ut så snart filteret er sett
    if (forteikn !== undefined && !(n(d.forteikn) <= forteikn)) return false;
    if (tempoFra !== undefined && !(n(d.tempo) >= tempoFra)) return false;
    if (tempoTil !== undefined && !(n(d.tempo) <= tempoTil)) return false;
    if (lagastFra !== undefined && !(n(d.lagast) >= lagastFra)) return false;
    if (hogastTil !== undefined && !(n(d.hogast) <= hogastTil)) return false;
    if (ambitusMaks !== undefined && !(n(d.ambitus) <= ambitusMaks)) return false;
    if (sprangMaks !== undefined && !(n(d.sprang) <= sprangMaks)) return false;
    // Rytme: alle stavingane øvinga brukar må vere avkryssa
    if ((d.rytme ?? '').split(' ').filter(Boolean).some((x) => !stav.has(x))) return false;
    return true;
  };
}

/* ---------- Sortering ---------- */
const modusNr = (m?: string) => (m === 'dur' ? 0 : m === 'moll' ? 1 : NaN);
const NOKKEL: Record<string, (r: HTMLElement) => number[]> = {
  nivaa: (r) => [n(r.dataset.nivaa)],
  toneart: (r) => [n(r.dataset.tonesort)],
  modus: (r) => [modusNr(r.dataset.modus), n(r.dataset.tonesort)],
  tempo: (r) => [n(r.dataset.tempo)],
  lagast: (r) => [n(r.dataset.lagast)],
  hogast: (r) => [n(r.dataset.hogast)],
  ambitus: (r) => [n(r.dataset.ambitus)],
  sprang: (r) => [n(r.dataset.sprang)],
  rytme: (r) => [n(r.dataset.rytmeverdi)],
};

function samanlikn(a: HTMLElement, b: HTMLElement, key: string, retning: number): number {
  if (key === 'tittel') {
    const c = tittel(a).localeCompare(tittel(b), 'nn') * retning;
    if (c) return c;
  } else {
    const ka = NOKKEL[key](a);
    const kb = NOKKEL[key](b);
    for (let i = 0; i < ka.length; i++) {
      const manglarA = Number.isNaN(ka[i]);
      const manglarB = Number.isNaN(kb[i]);
      if (manglarA !== manglarB) return manglarA ? 1 : -1; // manglande verdi alltid sist
      if (!manglarA && ka[i] !== kb[i]) return (ka[i] - kb[i]) * retning;
    }
  }
  // Lik verdi: fast rekkjefølgje etter nivå, så tittel
  return n(a.dataset.nivaa) - n(b.dataset.nivaa) || tittel(a).localeCompare(tittel(b), 'nn');
}

/* ---------- Bruk ---------- */
function bruk() {
  const passar = lagFilter();
  const key = String(new FormData(form).get('sorter') ?? 'nivaa');
  const retning = Number(new FormData(form).get('retning') ?? 1);
  let synlege = 0;

  for (const tb of tbodyar) {
    const rader = Array.from(tb.querySelectorAll<HTMLTableRowElement>('tr[data-id]'));
    rader.forEach((r) => (r.hidden = !passar(r)));
    rader.sort((a, b) => samanlikn(a, b, key, retning)).forEach((r) => tb.append(r));
    const antal = rader.filter((r) => !r.hidden).length;
    synlege += antal;
    const tom = tb.querySelector<HTMLElement>('[data-tom]');
    if (tom) {
      tb.append(tom);
      tom.hidden = antal > 0;
    }
  }

  hovud.forEach((th) =>
    th.setAttribute('aria-sort', th.dataset.kol === key ? (retning > 0 ? 'ascending' : 'descending') : 'none'),
  );
  status.textContent = `Viser ${synlege} av ${alleRader.length} øvingar`;
}

// Klikk på kolonnehovud: vel kolonnen, eller snu retninga om ho allereie er vald
document.addEventListener('click', (e) => {
  const knapp = (e.target as HTMLElement).closest<HTMLElement>('[data-sort]');
  if (!knapp) return;
  const sorter = form.elements.namedItem('sorter') as HTMLSelectElement;
  const retning = form.elements.namedItem('retning') as HTMLSelectElement;
  if (sorter.value === knapp.dataset.sort) retning.value = retning.value === '1' ? '-1' : '1';
  else {
    sorter.value = knapp.dataset.sort!;
    retning.value = '1';
  }
  bruk();
});

form.addEventListener('input', bruk);
form.addEventListener('change', bruk);
form.addEventListener('submit', (e) => e.preventDefault());
form.addEventListener('reset', () => setTimeout(bruk));

// Filtera er opne som standard på brei skjerm
const meir = form.querySelector<HTMLDetailsElement>('[data-meir]');
if (meir && matchMedia('(min-width: 52rem)').matches) meir.open = true;

bruk();
