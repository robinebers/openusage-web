export type MetricSeverity = "normal" | "warning" | "critical";

export type ProviderId = "claude" | "codex" | "cursor";

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
  /** Flame warning on the label line (e.g. "Limit reached", "Limit in 3h 45m"). */
  warning?: string;
  /** Quiet pace projection on the label line (e.g. "~22% left at reset"). */
  note?: string;
  /** 0–100 position of the even-pace tick on the bar. */
  pace?: number;
}

/** An unbounded metric: no bar, label on the left and a value on the right. */
export interface TextRow {
  kind: "text";
  label: string;
  /** e.g. "$218.04 · 438.5M tokens" */
  value: string;
  /** Status dot before the value (e.g. reset credits). */
  dot?: MetricSeverity;
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
  /** Always Visible rows. */
  rows: MetricRow[];
  /** On Demand rows, revealed by the card's chevron. */
  more: MetricRow[];
  expanded: boolean;
}

/** One menu-bar segment: a provider glyph plus its 1–2 stacked tray values. */
export interface StripGroup {
  id: ProviderId;
  values: string[];
}

export type SpendPeriod = "today" | "yesterday" | "last30";

export interface SpendSlice {
  id: string;
  name: string;
  color: string;
  amount: number;
}
