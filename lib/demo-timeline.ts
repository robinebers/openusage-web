"use client";

import { useSyncExternalStore } from "react";
import type { MeterRow, Provider, StripGroup } from "./types";
import { PROVIDER_META, ROWS, type DemoProviderId } from "./mock-data";

interface Frame {
  /** Section order, top to bottom (also drives the menu-bar order). */
  order: DemoProviderId[];
  /** Visible row keys per provider, in order. */
  rows: Record<DemoProviderId, string[]>;
}

/**
 * A fixed, looping choreography that mirrors how the native app lets you
 * rearrange providers and metrics. It plays forward beat-by-beat to a "full"
 * state, then runs the same beats in reverse so the loop is seamless. Each beat
 * isolates a single change so the motion always reads clearly:
 *
 *  F0  default order (Codex, Claude, Cursor)
 *  F1  Codex and Claude swap places (and the menu bar swaps with them)
 *  F2  Claude's Weekly moves above its Session
 *  F3  Codex's Weekly moves above its Session
 *  F4  Claude's Today/Yesterday/Last 30 Days collapse into Extra usage
 *  F5  Codex's Last 30 Days becomes Extra usage and Rate Limit Resets pops up
 */
const FRAMES: Frame[] = [
  {
    order: ["codex", "claude", "cursor"],
    rows: {
      claude: ["session", "weekly", "today", "yesterday", "last30"],
      codex: ["session", "weekly", "last30"],
      cursor: ["plan", "auto", "today"],
    },
  },
  {
    order: ["claude", "codex", "cursor"],
    rows: {
      claude: ["session", "weekly", "today", "yesterday", "last30"],
      codex: ["session", "weekly", "last30"],
      cursor: ["plan", "auto", "today"],
    },
  },
  {
    order: ["claude", "codex", "cursor"],
    rows: {
      claude: ["weekly", "session", "today", "yesterday", "last30"],
      codex: ["session", "weekly", "last30"],
      cursor: ["plan", "auto", "today"],
    },
  },
  {
    order: ["claude", "codex", "cursor"],
    rows: {
      claude: ["weekly", "session", "today", "yesterday", "last30"],
      codex: ["weekly", "session", "last30"],
      cursor: ["plan", "auto", "today"],
    },
  },
  {
    order: ["claude", "codex", "cursor"],
    rows: {
      claude: ["weekly", "session", "extra"],
      codex: ["weekly", "session", "last30"],
      cursor: ["plan", "auto", "today"],
    },
  },
  {
    order: ["claude", "codex", "cursor"],
    rows: {
      claude: ["weekly", "session", "extra"],
      codex: ["weekly", "session", "extra", "ratelimit"],
      cursor: ["plan", "auto", "today"],
    },
  },
];

const STEP_MS = 2000;

let index = 0;
let direction = 1;
let timerId: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function tickDemoFrame() {
  direction =
    index >= FRAMES.length - 1 ? -1 : index <= 0 ? 1 : direction;
  index += direction;
  for (const listener of listeners) listener();
}

function startDemoTimer() {
  if (timerId !== undefined || listeners.size === 0) return;
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return; // hold the default frame for reduced-motion users
  }
  timerId = setInterval(tickDemoFrame, STEP_MS);
}

function stopDemoTimerIfIdle() {
  if (listeners.size > 0 || timerId === undefined) return;
  clearInterval(timerId);
  timerId = undefined;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  startDemoTimer();
  return () => {
    listeners.delete(onChange);
    stopDemoTimerIfIdle();
  };
}

function useFrame(): Frame {
  const i = useSyncExternalStore(
    subscribe,
    () => index,
    () => 0,
  );
  return FRAMES[i] ?? FRAMES[0];
}

/** Ordered provider sections (with current rows) for the popover. */
export function useDemoSections(): Provider[] {
  const frame = useFrame();
  return frame.order.map((id) => ({
    id,
    name: PROVIDER_META[id].name,
    plan: PROVIDER_META[id].plan,
    rows: frame.rows[id].map((key) => ROWS[id][key]).filter((r) => r !== undefined),
  }));
}

/** Ordered menu-bar strip groups. Mirrors both the section order AND each
 *  provider's current row order, so the tray's stacked percentages reorder in
 *  lock-step with the popover (e.g. when Weekly moves above Session). The tray
 *  shows the meter rows; each meter's `percent` is the single source of truth. */
export function useDemoStripGroups(): StripGroup[] {
  const frame = useFrame();
  return frame.order.map((id) => ({
    id,
    values: frame.rows[id]
      .map((key) => ROWS[id][key])
      .filter((row): row is MeterRow => row?.kind === "meter")
      .map((row) => `${row.percent}%`),
  }));
}

// ── Initial layout settle ───────────────────────────────────────────────────
// motion's `layout` animates ANY position change. On load the popover re-anchors
// once (measurement + web-font swap shifts the tray), which would otherwise
// slide all the contents in. Gate layout animations until that settle is done so
// the popover simply appears, then animates only for the choreography.
let layoutReady = false;
let readyArmed = false;
const readyListeners = new Set<() => void>();

function armLayoutReady() {
  if (readyArmed || typeof window === "undefined") return;
  readyArmed = true;
  const finish = () => {
    if (layoutReady) return;
    layoutReady = true;
    for (const listener of readyListeners) listener();
  };
  const fallback = setTimeout(finish, 1200);
  document.fonts?.ready.then(() =>
    requestAnimationFrame(() => {
      clearTimeout(fallback);
      finish();
    }),
  );
}

export function useLayoutReady(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      readyListeners.add(onChange);
      armLayoutReady();
      return () => {
        readyListeners.delete(onChange);
      };
    },
    () => layoutReady,
    () => false,
  );
}
