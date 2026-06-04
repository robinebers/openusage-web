import type { Provider } from "./types";

export const providers: Provider[] = [
  {
    id: "codex",
    name: "Codex",
    planBadge: "Pro",
    brandColor: "#74aa9c",
    overviewMetrics: [
      {
        label: "Session",
        percent: 73,
        primaryValue: "73% left",
        secondaryValue: "Resets in 2h 18m",
        pace: "on-track",
      },
      {
        label: "Weekly",
        percent: 91,
        primaryValue: "91% left",
        secondaryValue: "Resets in 4d 7h",
        pace: "ahead",
      },
    ],
    detailMetrics: [
      {
        label: "Session",
        percent: 73,
        primaryValue: "73% left",
        secondaryValue: "Resets in 2h 18m",
        pace: "on-track",
      },
      {
        label: "Weekly",
        percent: 91,
        primaryValue: "91% left",
        secondaryValue: "Resets in 4d 7h",
        pace: "ahead",
      },
      {
        label: "Reviews",
        percent: 58,
        primaryValue: "58% left",
        secondaryValue: "Resets in 4d 7h",
        pace: "on-track",
      },
      {
        label: "Extra usage",
        percent: 75,
        primaryValue: "$12.40 used",
        secondaryValue: "$50 limit",
        pace: "on-track",
      },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    planBadge: "Max",
    brandColor: "#de7356",
    overviewMetrics: [
      {
        label: "Session",
        percent: 100,
        primaryValue: "100% left",
        secondaryValue: "Resets in 4h 31m",
        pace: "ahead",
      },
      {
        label: "Weekly",
        percent: 42,
        primaryValue: "42% left",
        secondaryValue: "Resets in 1d 19h",
        pace: "behind",
      },
    ],
    detailMetrics: [
      {
        label: "Session",
        percent: 100,
        primaryValue: "100% left",
        secondaryValue: "Resets in 4h 31m",
        pace: "ahead",
      },
      {
        label: "Weekly",
        percent: 42,
        primaryValue: "42% left",
        secondaryValue: "Resets in 1d 19h",
        pace: "behind",
      },
      {
        label: "Sonnet",
        percent: 78,
        primaryValue: "78% left",
        secondaryValue: "Resets in 1d 19h",
        pace: "on-track",
      },
      {
        label: "Extra usage",
        percent: 79,
        primaryValue: "$4.20 used",
        secondaryValue: "$20 limit",
        pace: "ahead",
      },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    planBadge: "Ultra",
    brandColor: "#000000",
    overviewMetrics: [
      {
        label: "Plan usage",
        percent: 67,
        primaryValue: "$167.78 left",
        secondaryValue: "Resets in 8d 9h",
        pace: "ahead",
      },
    ],
    detailMetrics: [
      {
        label: "Plan usage",
        percent: 67,
        primaryValue: "$167.78 left",
        secondaryValue: "Resets in 8d 9h",
        pace: "ahead",
      },
      {
        label: "On-demand",
        percent: 3,
        primaryValue: "$487.50 left",
        secondaryValue: "$500 limit",
        pace: "ahead",
      },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    planBadge: "SuperGrok",
    brandColor: "#000000",
    overviewMetrics: [
      {
        label: "Credits used",
        percent: 41,
        primaryValue: "41% used",
        secondaryValue: "Resets in 6d 2h",
        pace: "on-track",
      },
    ],
    detailMetrics: [
      {
        label: "Credits used",
        percent: 41,
        primaryValue: "41% used",
        secondaryValue: "Resets in 6d 2h",
        pace: "on-track",
      },
      {
        label: "Pay as you go",
        percent: 18,
        primaryValue: "$9.00 used",
        secondaryValue: "$50 cap",
        pace: "ahead",
      },
    ],
  },
  {
    id: "devin",
    name: "Devin",
    planBadge: "Core",
    brandColor: "#000000",
    overviewMetrics: [
      {
        label: "Weekly quota",
        percent: 64,
        primaryValue: "64% left",
        secondaryValue: "Resets in 3d 4h",
        pace: "on-track",
      },
    ],
    detailMetrics: [
      {
        label: "Weekly quota",
        percent: 64,
        primaryValue: "64% left",
        secondaryValue: "Resets in 3d 4h",
        pace: "on-track",
      },
      {
        label: "Extra usage balance",
        percent: 62,
        primaryValue: "$18.50 left",
        secondaryValue: "$30 monthly",
        pace: "on-track",
      },
    ],
  },
];

/** Primary metric percent per provider for the tray icon mini bars */
export const trayBarData = [
  { percent: 73, label: "Codex" },
  { percent: 42, label: "Claude" },
  { percent: 67, label: "Cursor" },
  { percent: 41, label: "Grok" },
  { percent: 64, label: "Devin" },
];
