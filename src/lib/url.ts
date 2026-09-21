// Gjer at lenker fungerer òg om sida ligg under ein undermappe (astro.config `base`).
export const url = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
