import { Flame } from "lucide-react";
import type { MetricRow as MetricRowType, MeterRow, TextRow, TrendRow, MetricSeverity } from "@/lib/types";

const meterColor: Record<MetricSeverity, string> = {
  normal: "var(--meter-normal)",
  warning: "var(--meter-warning)",
  critical: "var(--meter-critical)",
};

export function MetricRow({ row }: { row: MetricRowType }) {
  if (row.kind === "meter") return <MeterRowView row={row} />;
  if (row.kind === "trend") return <TrendRowView row={row} />;
  return <TextRowView row={row} />;
}

/** Bounded metric: label (+ flame warning or pace note) → capsule meter (+ pace tick) → headline / reset reading. */
function MeterRowView({ row }: { row: MeterRow }) {
  const color = meterColor[row.severity ?? "normal"];

  return (
    <div className="flex flex-col gap-1 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-foreground">{row.label}</span>
        {row.warning ? (
          // Only the flame carries the severity color; the copy stays secondary, like the app.
          <span className="flex items-center gap-[3px] text-[12px] text-muted-foreground">
            <Flame className="h-[11px] w-[11px] fill-current" style={{ color }} />
            {row.warning}
          </span>
        ) : row.note ? (
          <span className="text-[12px] text-muted-foreground">{row.note}</span>
        ) : null}
      </div>

      <div className="relative h-[5px] w-full rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.08)" }}>
        {row.percent > 0 && (
          <div
            className="h-full min-w-[5px] rounded-full transition-[width] duration-500"
            style={{ width: `${row.percent}%`, backgroundColor: color }}
          />
        )}
        {row.pace !== undefined && (
          // Even-pace tick: pokes out above and below the bar without changing its height.
          <div
            className="absolute -top-[2px] h-[9px] w-[2px] -translate-x-1/2 rounded-[1px]"
            style={{ left: `${row.pace}%`, backgroundColor: "rgba(0,0,0,0.55)" }}
          />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 text-[12px]">
        <span className="tabular-nums text-foreground">{row.headline}</span>
        <span className="text-muted-foreground">{row.trailing}</span>
      </div>
    </div>
  );
}

/** Usage Trend: label on the left, a right-aligned day-by-day bar sparkline.
 *  Bars are proportional to the window's peak (a true zero shows a thin stub). */
const TREND_HEIGHT = 22;

function TrendRowView({ row }: { row: TrendRow }) {
  const peak = Math.max(1, ...row.points);
  return (
    <div className="flex items-center justify-between gap-2 px-3.5 py-1.5">
      <span className="text-[12px] font-semibold text-foreground">{row.label}</span>
      <div className="flex items-end gap-px" style={{ height: TREND_HEIGHT, width: 150 }}>
        {row.points.map((value, i) => {
          const ratio = Math.min(1, value / peak);
          const height = value <= 0 ? 2 : Math.max(TREND_HEIGHT * 0.18, TREND_HEIGHT * ratio);
          return (
            <div
              key={i}
              className="flex-1 rounded-[1px]"
              style={{ height, minWidth: 2, backgroundColor: meterColor.normal }}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Unbounded metric: label on the left, value on the right. No bar. */
function TextRowView({ row }: { row: TextRow }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-1.5 text-[12px]">
      <span className="font-semibold text-foreground">{row.label}</span>
      <span className="flex items-center gap-1 tabular-nums text-foreground">
        {row.dot && (
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meterColor[row.dot] }} />
        )}
        {row.value}
      </span>
    </div>
  );
}
