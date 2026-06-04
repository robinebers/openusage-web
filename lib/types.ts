export type PaceStatus = "ahead" | "on-track" | "behind";

export type ProviderId = "codex" | "claude" | "cursor" | "grok" | "devin";

export interface MetricLine {
  label: string;
  /** 0–100, percentage filled */
  percent: number;
  /** e.g. "73% left" */
  primaryValue: string;
  /** e.g. "Resets in 2h 18m" or "100% cap" */
  secondaryValue: string;
  pace: PaceStatus;
  /** Optional custom bar color */
  barColor?: string;
}

export interface Provider {
  id: ProviderId;
  name: string;
  planBadge: string;
  brandColor: string;
  /** Metrics shown on the overview (summary) */
  overviewMetrics: MetricLine[];
  /** All metrics shown on the detail view */
  detailMetrics: MetricLine[];
}

export type ActiveView = "overview" | ProviderId;
