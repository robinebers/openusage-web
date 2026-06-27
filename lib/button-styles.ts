/**
 * Shared "secondary" button skin for the marketing surface — a white, glassy
 * button with a subtle hover tint. The background lives in a CLASS (not inline
 * `style`) so the `hover:` variant can actually win; an inline background would
 * override it and kill the hover. Compose with per-button size/layout classes
 * via `cn()`.
 */
export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-[var(--btn-secondary-border)] bg-[var(--btn-secondary-bg)] text-[var(--page-fg)] backdrop-blur-[20px] transition-colors hover:bg-black/5";
