import { MoreHorizontal } from "lucide-react";

interface PanelFooterProps {
  version: string | null;
}

export function PanelFooter({ version }: PanelFooterProps) {
  // Demo footer: only ever show a real, *stable* release — never a hardcoded
  // string and never a pre-release (beta/rc). Anything else is a bare "OpenUsage".
  const stableVersion = version && !version.includes("-") ? version : null;

  return (
    <div className="-mx-3.5 mt-2 flex items-center justify-between px-3.5 py-2.5">
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] text-muted-foreground">
          OpenUsage{stableVersion ? ` ${stableVersion}` : ""}
        </span>
        <span className="text-[11px] tabular-nums text-muted-foreground/80">
          Next update in 2m
        </span>
      </div>
      {/* Visual-only round button (non-interactive) — mirrors the app's overflow menu. */}
      <div
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground"
        style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </div>
    </div>
  );
}
