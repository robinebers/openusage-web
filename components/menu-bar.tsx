"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  AppleIcon,
  ControlCenterIcon,
  WifiIcon,
  ClaudeIcon,
  CodexIcon,
  CursorIcon,
  DevinIcon,
  GrokIcon,
} from "@/lib/icons";
import { useDemoStripGroups, useLayoutReady } from "@/lib/demo-timeline";
import { Panel } from "@/components/panel/panel";
import type { ProviderId } from "@/lib/types";

const STRIP_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

const STRIP_ICONS: Record<ProviderId, typeof ClaudeIcon> = {
  claude: ClaudeIcon,
  codex: CodexIcon,
  cursor: CursorIcon,
  devin: DevinIcon,
  grok: GrokIcon,
};

/** A provider's pinned values: one large number, or two tight stacked lines (read positionally). */
function StripValues({ values }: { values: string[] }) {
  if (values.length <= 1) {
    return (
      <span className="font-mono text-[12px] font-bold tabular-nums leading-none">
        {values[0] ?? ""}
      </span>
    );
  }
  return (
    <div className="flex flex-col items-end font-mono leading-[1.08]">
      {values.map((v, i) => (
        <span key={i} className="text-[9.5px] font-semibold tabular-nums">
          {v}
        </span>
      ))}
    </div>
  );
}

/** The OpenUsage menu-bar strip: a bold provider glyph + values per provider.
 *  `popover`, when given, is anchored directly below the strip with pure CSS so
 *  the panel renders in place (no JS measurement, visible on first paint). */
function MenuBarStrip({ id = "tray-icon", popover }: { id?: string; popover?: ReactNode }) {
  const groups = useDemoStripGroups();
  const layoutReady = useLayoutReady();
  return (
    <div id={id} className="relative flex items-center gap-3.5 select-none">
      {groups.map((group) => {
        const Icon = STRIP_ICONS[group.id];
        return (
          <motion.div
            // Remount when layout animations switch on so motion (re)creates the
            // projection node with `layout` enabled — see panel.tsx for the why.
            key={`${group.id}-${layoutReady ? "live" : "init"}`}
            layout={layoutReady}
            transition={STRIP_TRANSITION}
            className="flex items-center gap-1.5"
          >
            <Icon className="h-[22px] w-[22px] shrink-0" style={{ color: "var(--bar-fg)" }} />
            <StripValues values={group.values} />
          </motion.div>
        );
      })}
      {popover && (
        <div className="absolute left-1/2 top-full z-50 mt-[11px] -translate-x-1/2">
          {popover}
        </div>
      )}
    </div>
  );
}

/** macOS Battery icon */
function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 25 12" fill="currentColor" className={className}>
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
      />
      <rect x="23" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function formatTime(date: Date) {
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const d = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${month} ${d}\u2002${time}`;
}

function TimeDisplay() {
  const [display, setDisplay] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const update = () => setDisplay(formatTime(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-[13px] font-medium whitespace-nowrap"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      suppressHydrationWarning
    >
      {display}
    </span>
  );
}

export function MenuBar({ version }: { version: string | null }) {
  return (
    <div
      className="w-full h-[28px] flex items-center justify-between px-4 select-none"
      style={{
        background: "var(--bar-bg)",
        color: "var(--bar-fg)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left: Apple icon + app name */}
      <div className="flex items-center gap-4">
        <AppleIcon className="w-[11px] h-[13px] -translate-y-[1px] opacity-90" />
        <span className="text-[13px] font-semibold opacity-90">Finder</span>
        <span className="text-[13px] opacity-60">File</span>
        <span className="text-[13px] opacity-60">Edit</span>
        <span className="text-[13px] opacity-60">View</span>
        <span className="text-[13px] opacity-60">Go</span>
        <span className="text-[13px] opacity-60">Window</span>
        <span className="text-[13px] opacity-60">Help</span>
      </div>

      {/* Right: OpenUsage strip first, then system icons, then date/time.
          The popover hangs off the strip so it's positioned purely by CSS. */}
      <MenuBarTray popover={<Panel version={version} placement="absolute" />} />
    </div>
  );
}

export function MenuBarTray({
  trayIconId,
  popover,
}: { trayIconId?: string; popover?: ReactNode } = {}) {
  return (
    <div className="flex items-center gap-[10px]">
      <MenuBarStrip id={trayIconId} popover={popover} />
      <WifiIcon className="h-[11px] w-auto opacity-85" />
      <BatteryIcon className="w-[24px] h-[11px] opacity-85" />
      <ControlCenterIcon className="h-[11px] w-auto opacity-85" />
      <TimeDisplay />
    </div>
  );
}
