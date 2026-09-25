"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ClaudeIcon, CodexIcon, CursorIcon } from "@/lib/icons";
import type { Provider, ProviderId } from "@/lib/types";
import { useLayoutReady } from "@/lib/demo-timeline";
import { MetricRow } from "./metric-row";

const ICONS: Record<ProviderId, typeof ClaudeIcon> = {
  claude: ClaudeIcon,
  codex: CodexIcon,
  cursor: CursorIcon,
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const ROW_TRANSITION = { duration: 0.45, ease: EASE };

/** Section header (mark + provider + plan) over a grouped card. Rows animate as the demo
 *  reorders them; the chevron reveals the On Demand rows like the app's collapsed cards. */
export function ProviderSection({ provider }: { provider: Provider }) {
  const Icon = ICONS[provider.id];
  const layoutReady = useLayoutReady();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-[5px] px-1 py-0.5">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <h3 className="text-[14px] font-semibold text-foreground">{provider.name}</h3>
        <span className="translate-y-px text-[11px] text-muted-foreground">{provider.plan}</span>
      </div>

      {/* Rows carry `layout` so reorders slide; `popLayout` pulls an exiting row out of
          flow and `relative` anchors that popped (position: absolute) row. */}
      <div className="relative rounded-xl py-[5px]" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
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

        {provider.more.length > 0 && (
          <div className="flex justify-center py-0.5 text-muted-foreground">
            <motion.span
              animate={{ rotate: provider.expanded ? 180 : 0 }}
              transition={ROW_TRANSITION}
              className="flex"
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
            </motion.span>
          </div>
        )}

        <AnimatePresence initial={false}>
          {provider.expanded && (
            <motion.div
              key="more"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={ROW_TRANSITION}
              className="overflow-hidden"
            >
              {provider.more.map((row) => (
                <MetricRow key={row.label} row={row} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
