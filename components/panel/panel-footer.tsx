import { ChevronDown } from "lucide-react";

interface PanelFooterProps {
  version: string | null;
}

export function PanelFooter({ version }: PanelFooterProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border px-3.5 py-3">
      <div className="flex flex-col text-[10px] leading-[1.3] text-muted-foreground">
        <span>OpenUsage{version ? ` ${version}` : ""}</span>
        <span className="tabular-nums">Next update in 3m</span>
      </div>
      {/* Visual-only (non-interactive) — mirrors the app's Options menu capsule. */}
      <div
        aria-hidden
        className="flex h-7 items-center gap-[5px] rounded-full border border-border bg-white pr-3 pl-3.5 text-[13px] font-semibold text-foreground"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
      >
        Options
        <ChevronDown className="h-3 w-3" strokeWidth={3} />
      </div>
    </div>
  );
}
