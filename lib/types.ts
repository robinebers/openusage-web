export type MetricSeverity = "normal" | "warning" | "critical";

export type ProviderId = "claude" | "codex" | "cursor" | "devin" | "grok";

/** A bounded metric: capsule meter + headline/reset reading (matches the app's bar rows). */
export interface MeterRow {
  kind: "meter";
  label: string;
  /** 0–100, percentage filled */
  percent: number;
  /** e.g. "100% left" */
  headline: string;
  /** e.g. "Resets in 5h" */
  trailing: string;
  /** Bar color; defaults to "normal" (blue). */
  severity?: MetricSeverity;
  /** Optional flame warning shown on the label line (running out). */
  warning?: string;
}

/** An unbounded metric: no bar, label on the left and a value on the right. */
export interface TextRow {
  kind: "text";
  label: string;
  /** e.g. "$218.04 · 438.5M tokens" */
  value: string;
  /** Show the small ⓘ affordance next to the label. */
  info?: boolean;
}

/** A day-by-day usage sparkline (the app's "Usage Trend" row). Bars draw
 *  proportional to the window's peak — visual only, never computed here. */
export interface TrendRow {
  kind: "trend";
  label: string;
  /** Per-day values, oldest → newest. */
  points: number[];
}

export type MetricRow = MeterRow | TextRow | TrendRow;

export interface Provider {
  id: ProviderId;
  name: string;
  plan: string;
  rows: MetricRow[];
}

/** One menu-bar segment: a provider glyph plus its 1–2 stacked tray values. */
export interface StripGroup {
  id: ProviderId;
  values: string[];
}
