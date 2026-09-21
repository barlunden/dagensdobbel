# Dagens Dobbel

Astro (statisk) + content collections + vanleg CSS. Ingen backend.

## Kom i gang

```
npm install
npm run dev      # http://localhost:4321
npm run build    # ferdig side i dist/
```

## Legg til ei øving

1. Legg lydfil i `public/lyd/` og PDF i `public/noter/`.
2. Lag ei ny fil i `src/content/ovingar/lyrisk/` eller `.../teknisk/` (kopier ei eksisterande).
3. Fyll ut frontmatter: `tittel`, `kategori`, `nivaa` (1–3), `fokus`, `tips`, `tempo`, `varigheit`, `lyd`, `noter`.
   Feil felt eller filtype gjev feilmelding i terminalen (schema i `src/content.config.ts`).

## Det du oftast endrar

- `src/site.config.ts` – namn, undertittel, **Buy Me a Coffee-lenke**, kategorinamn
- `src/styles/global.css` – alle fargar er variablar øvst
- `src/scripts/dobbel.ts` – trekkelogikken (filtrering, "bytt denne", delbar lenke)
- `astro.config.mjs` – set `site` (og `base` om sida ligg i ein undermappe)

Byt ut plassholdar-filene (`lyrisk-01-…`, `teknisk-01-…`) med dine eigne.
