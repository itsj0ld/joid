/**
 * Ícones de interface em SVG inline.
 * Ficam separados dos ícones das plataformas (esses são arquivos em assets/icons).
 */
const svg = (paths, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${extra}>${paths}</svg>`;

export const icons = {
  arrowUpRight: svg('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
  arrowRight: svg('<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>'),
  arrowLeft: svg('<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>'),
  heart: svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>'),
  copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/>'),
  check: svg('<path d="m5 12 4.5 4.5L19 7"/>'),
};
