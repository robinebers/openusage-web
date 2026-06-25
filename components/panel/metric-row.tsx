import type { CSSProperties } from "react";
import { Info, Flame } from "lucide-react";
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

/** Bounded metric: label (+ optional flame) → capsule meter → headline / reset reading. */
function MeterRowView({ row }: { row: MeterRow }) {
  const severity = row.severity ?? "normal";
  const fill: CSSProperties = { width: `${row.percent}%`, backgroundColor: meterColor[severity] };

  return (
    <div className="px-3.5 py-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-foreground">{row.label}</span>
        {row.warning && (
          // Only the flame carries the severity color; the copy stays muted —
          // matching the native app (tint on glass is reserved for the symbol).
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <Flame className="h-3 w-3" style={{ color: meterColor[severity] }} />
            {row.warning}
          </span>
        )}
      </div>

      {/* Full-width capsule meter — flat severity color over a quiet track. */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(0,0,0,0.09)" }}
      >
        <div className="h-full rounded-full transition-[width] duration-500" style={fill} />
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[12px] tabular-nums text-foreground">{row.headline}</span>
        <span className="text-[12px] text-muted-foreground">{row.trailing}</span>
      </div>
    </div>
  );
}

/** Usage Trend: label on the left, a right-aligned day-by-day bar sparkline.
 *  Bars are proportional to the window's peak (a true zero shows a thin stub),
 *  in meter-blue so the trend reads as part of the card's visual language. */
const TREND_HEIGHT = 22;

function TrendRowView({ row }: { row: TrendRow }) {
  const peak = Math.max(1, ...row.points);
  return (
    <div className="flex items-center justify-between gap-2 px-3.5 py-[5px]">
      <span className="text-[12px] font-semibold text-foreground">{row.label}</span>
      <div
        className="flex items-end gap-px"
        style={{ height: TREND_HEIGHT, width: 150 }}
      >
        {row.points.map((value, i) => {
          const ratio = peak > 0 ? Math.min(1, value / peak) : 0;
          const height =
            value <= 0 ? 2 : Math.max(TREND_HEIGHT * 0.18, TREND_HEIGHT * ratio);
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
    <div className="flex items-center justify-between gap-3 px-3.5 py-[5px]">
      <span className="flex items-center gap-1 text-[12px] font-medium text-foreground">
        {row.label}
        {row.info && <Info className="h-3 w-3 text-muted-foreground/70" />}
      </span>
      <span className="text-[12px] tabular-nums text-muted-foreground">{row.value}</span>
    </div>
  );
}
