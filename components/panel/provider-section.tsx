"use client";

import { AnimatePresence, motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { ClaudeIcon, CodexIcon, CursorIcon, DevinIcon, GrokIcon } from "@/lib/icons";
import type { Provider, ProviderId } from "@/lib/types";
import { useLayoutReady } from "@/lib/demo-timeline";
import { MetricRow } from "./metric-row";

const ICONS: Record<ProviderId, typeof ClaudeIcon> = {
  claude: ClaudeIcon,
  codex: CodexIcon,
  cursor: CursorIcon,
  devin: DevinIcon,
  grok: GrokIcon,
};

const ROW_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/** Section header (provider + mark) over a grouped card whose rows animate as the demo reorders/replaces them. */
export function ProviderSection({ provider }: { provider: Provider }) {
  const Icon = ICONS[provider.id];
  const layoutReady = useLayoutReady();

  return (
    <div>
      <div className="flex items-center gap-1.5 px-1 pb-1.5">
        {/* Visual-only drag affordance — mirrors the app's reorderable rows. */}
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-hidden />
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
          {provider.name}
        </h3>
        <span className="text-[12px] text-muted-foreground">{provider.plan}</span>
        <div className="flex-1" />
        <Icon className="h-[17px] w-[17px] text-muted-foreground/60" />
      </div>

      {/* Grouped card. Rows carry `layout` so reorders (e.g. Weekly/Session
          swapping) slide; `popLayout` pulls an exiting row out of flow so the
          rest slide up to fill the gap, and `relative` anchors that popped
          (position: absolute) row. Enter/exit itself is a simple fade. */}
      <div
        className="relative rounded-xl py-1"
        style={{ backgroundColor: "rgba(0,0,0,0.035)" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {provider.rows.map((row) => (
            <motion.div
              key={row.label}
              layout={layoutReady}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={ROW_TRANSITION}
            >
              <MetricRow row={row} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
