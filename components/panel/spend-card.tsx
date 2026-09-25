"use client";

import { motion } from "motion/react";
import { ChevronDown, Info, Share } from "lucide-react";
import { spendSlices } from "@/lib/mock-data";
import { useDemoSpendPeriod, useLayoutReady } from "@/lib/demo-timeline";
import type { SpendPeriod, SpendSlice } from "@/lib/types";

const PERIODS: { id: SpendPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last30", label: "30 Days" },
];

const TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

/** Ring geometry (matches the app: 104pt ring, golden-ratio hole). */
const RING = 104;
const OUTER = RING / 2;
const INNER = OUTER * 0.618;
const RADIUS = (OUTER + INNER) / 2;
const STROKE = OUTER - INNER;
/** Every slice gets at least this share so tiny providers stay visible. */
const MIN_SHARE = 0.025;
/** Hairline gap between slices, in path units (the circle is normalized to 100). */
const GAP = 0.8;

function formatCenter(amount: number) {
  return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}K` : `$${Math.round(amount)}`;
}

function formatAmount(amount: number) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function arcs(slices: SpendSlice[]) {
  const total = slices.reduce((sum, s) => sum + s.amount, 0);
  const floored = slices.map((s) => Math.max(s.amount / total, MIN_SHARE));
  const sum = floored.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return slices.map((slice, i) => {
    const share = floored[i] / sum;
    const arc = { ...slice, start: cursor, length: share };
    cursor += share;
    return arc;
  });
}

/** The dashboard's cross-provider Total Spend card. */
export function SpendCard() {
  const period = useDemoSpendPeriod();
  const layoutReady = useLayoutReady();
  const slices = spendSlices(period);
  const total = slices.reduce((sum, s) => sum + s.amount, 0);
  const selected = PERIODS.findIndex((p) => p.id === period);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-[5px] px-1 py-0.5 text-muted-foreground">
        <span className="text-[14px] font-semibold text-foreground">Cost</span>
        <ChevronDown className="h-2.5 w-2.5" strokeWidth={3} />
        <Info className="h-3 w-3" />
        <div className="flex-1" />
        <Share className="h-3.5 w-3.5" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl px-3.5 py-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
        {/* Capsule segmented period picker; the selected pill slides between segments. */}
        <div className="relative flex rounded-full p-[3px]" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
          <div className="pointer-events-none absolute inset-[3px]">
            <motion.div
              className="h-full w-1/3 rounded-full bg-white"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}
              initial={false}
              animate={{ x: `${selected * 100}%` }}
              transition={TRANSITION}
            />
          </div>
          {PERIODS.map((p) => (
            <span
              key={p.id}
              className={`relative flex-1 py-1 text-center text-[11px] ${
                p.id === period ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
              }`}
            >
              {p.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-[18px]">
          <div className="relative shrink-0" style={{ width: RING, height: RING }}>
            <svg viewBox={`0 0 ${RING} ${RING}`} className="-rotate-90" width={RING} height={RING}>
              {arcs(slices).map((arc) => (
                <motion.circle
                  key={arc.id}
                  cx={OUTER}
                  cy={OUTER}
                  r={RADIUS}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={STROKE}
                  pathLength={100}
                  initial={false}
                  animate={{
                    strokeDasharray: `${Math.max(arc.length * 100 - GAP, 0.3)} 100`,
                    strokeDashoffset: -arc.start * 100,
                  }}
                  transition={TRANSITION}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[13px] font-semibold tabular-nums text-foreground">{formatCenter(total)}</span>
              <span className="text-[9px] font-medium text-muted-foreground/70">dollars</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
            {slices.map((slice) => (
              <motion.div
                key={slice.id}
                layout={layoutReady ? "position" : false}
                transition={TRANSITION}
                className="flex items-center gap-[7px] text-[12px]"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="text-foreground">{slice.name}</span>
                <span className="ml-auto font-medium tabular-nums text-muted-foreground">
                  {formatAmount(slice.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
