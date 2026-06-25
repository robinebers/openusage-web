import type { MetricRow } from "./types";

/** The three providers the demo popover cycles through. */
export type DemoProviderId = "claude" | "codex" | "cursor";

export interface ProviderMeta {
  id: DemoProviderId;
  name: string;
  plan: string;
}

export const PROVIDER_META: Record<DemoProviderId, ProviderMeta> = {
  claude: { id: "claude", name: "Claude", plan: "Team 5x" },
  codex: { id: "codex", name: "Codex", plan: "Plus" },
  cursor: { id: "cursor", name: "Cursor", plan: "Ultra" },
};

/**
 * Catalog of every row a provider can show, keyed so the demo timeline can add,
 * remove, and reorder them. Visual only — mirrors the native app's popover.
 */
export const ROWS: Record<DemoProviderId, Record<string, MetricRow>> = {
  claude: {
    session: { kind: "meter", label: "Session", percent: 100, headline: "100% left", trailing: "Resets in 5h" },
    weekly: { kind: "meter", label: "Weekly", percent: 81, headline: "81% left", trailing: "Resets in 1d 16h" },
    today: { kind: "text", label: "Today", value: "$118.90 · 240.3M tokens", info: true },
    yesterday: { kind: "text", label: "Yesterday", value: "$218.04 · 438.5M tokens", info: true },
    last30: { kind: "text", label: "Last 30 Days", value: "$2.5K · 2.3B tokens", info: true },
    extra: { kind: "text", label: "Extra usage", value: "$24.80 used", info: true },
  },
  codex: {
    session: { kind: "meter", label: "Session", percent: 99, headline: "99% left", trailing: "Resets in 4h 57m" },
    weekly: { kind: "meter", label: "Weekly", percent: 63, headline: "63% left", trailing: "Resets in 3d 6h" },
    last30: { kind: "text", label: "Last 30 Days", value: "$18.75 · 25.7M tokens", info: true },
    extra: { kind: "text", label: "Extra usage", value: "$5.00 used", info: true },
    ratelimit: { kind: "text", label: "Rate Limit Resets", value: "2 available", info: true },
  },
  cursor: {
    usage: { kind: "meter", label: "Total Usage", percent: 73, headline: "73% left", trailing: "Resets in 18d 23h" },
    auto: { kind: "meter", label: "Auto Usage", percent: 98, headline: "98% left", trailing: "Resets in 18d 23h" },
    api: { kind: "meter", label: "API Usage", percent: 0, headline: "0% left", trailing: "Resets in 18d 23h", severity: "critical", warning: "Limit reached" },
    extra: { kind: "text", label: "Extra Usage", value: "$364.04 spent" },
    trend: {
      kind: "trend",
      label: "Usage Trend",
      points: [3, 4, 3, 5, 4, 6, 5, 4, 6, 7, 5, 8, 6, 7, 6, 9, 7, 8, 16, 6, 5],
    },
  },
};
