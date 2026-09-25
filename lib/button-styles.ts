/**
 * Marketing button skins (pill shape, Attention Machine style). Compose with
 * per-button size/layout classes via `cn()`.
 */
const base =
  "inline-flex items-center justify-center rounded-full font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export const primaryButtonClass = `${base} bg-brand text-white hover:bg-brand-deep`;

export const secondaryButtonClass = `${base} border border-line bg-white text-ink hover:border-ink`;
