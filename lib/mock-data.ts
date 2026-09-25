import type { MetricRow, SpendPeriod, SpendSlice } from "./types";

/** The three providers the demo popover cycles through. */
export type DemoProviderId = "claude" | "codex" | "cursor";

export interface ProviderMeta {
  id: DemoProviderId;
  name: string;
  plan: string;
}

export const PROVIDER_META: Record<DemoProviderId, ProviderMeta> = {
  claude: { id: "claude", name: "Claude", plan: "Team 5x" },
  codex: { id: "codex", name: "Codex", plan: "Pro 5x" },
  cursor: { id: "cursor", name: "Cursor", plan: "Ultra" },
};

/**
 * Catalog of every row a provider can show, keyed so the demo timeline can add,
 * remove, and reorder them. Visual only — mirrors the native app's popover.
 */
export const ROWS: Record<DemoProviderId, Record<string, MetricRow>> = {
  claude: {
    session: { kind: "meter", label: "Session", percent: 100, headline: "100% left", trailing: "Resets in 5h" },
    weekly: { kind: "meter", label: "Weekly", percent: 36, headline: "36% left", trailing: "Resets in 1d 6h", pace: 18, note: "~22% left at reset" },
    fable: { kind: "meter", label: "Fable", percent: 27, headline: "27% left", trailing: "Resets in 1d 6h", pace: 18, note: "~11% left at reset" },
    today: { kind: "text", label: "Today", value: "$49.85 · 35.8M tokens" },
    yesterday: { kind: "text", label: "Yesterday", value: "$61.30 · 43.4M tokens" },
    last30: { kind: "text", label: "Last 30 Days", value: "$2.5K · 2.3B tokens" },
  },
  codex: {
    session: { kind: "meter", label: "Session", percent: 58, headline: "58% left", trailing: "Resets in 2h 14m" },
    weekly: { kind: "meter", label: "Weekly", percent: 12, headline: "12% left", trailing: "Resets in 3d 6h", pace: 54, severity: "critical", warning: "Limit in 1d 4h" },
    today: { kind: "text", label: "Today", value: "$31.20 · 22.1M tokens" },
    last30: { kind: "text", label: "Last 30 Days", value: "$1.2K · 1.1B tokens" },
    ratelimit: { kind: "text", label: "Rate Limit Resets", value: "2 available", dot: "normal" },
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

/** On Demand rows per provider, revealed when the card is expanded. */
export const ON_DEMAND: Record<DemoProviderId, string[]> = {
  claude: ["today", "yesterday", "last30"],
  codex: ["today", "last30", "ratelimit"],
  cursor: ["extra", "trend"],
};

/** Total Spend ring colors, from the app's `TotalSpendPalette`. */
const SPEND_PROVIDERS = {
  claude: { name: "Claude", color: "#DE7356" },
  codex: { name: "Codex", color: "#10A37F" },
  cursor: { name: "Cursor", color: "#13120A" },
  grok: { name: "Grok", color: "#8E8E93" },
} as const;

type SpendProviderId = keyof typeof SPEND_PROVIDERS;

const SPEND_AMOUNTS: Record<SpendPeriod, Record<SpendProviderId, number>> = {
  today: { claude: 49.85, codex: 31.2, cursor: 12.4, grok: 0.9 },
  yesterday: { claude: 61.3, codex: 18.75, cursor: 22.1, grok: 1.31 },
  last30: { claude: 2480.12, codex: 1204.9, cursor: 864.04, grok: 38.2 },
};

/** Slices for a period, ranked largest first (ring reads clockwise in legend order). */
export function spendSlices(period: SpendPeriod): SpendSlice[] {
  return (Object.keys(SPEND_PROVIDERS) as SpendProviderId[])
    .map((id) => ({ id, ...SPEND_PROVIDERS[id], amount: SPEND_AMOUNTS[period][id] }))
    .sort((a, b) => b.amount - a.amount);
}
