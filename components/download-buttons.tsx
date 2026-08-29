"use client";

import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { secondaryButtonClass } from "@/lib/button-styles";

interface DownloadButtonsProps {
  stableUrl: string;
  stableVersion: string | null;
  betaUrl: string;
  betaVersion: string | null;
  /** Hero is left-aligned; the bottom CTA is centered. */
  align?: "start" | "center";
  /** Differentiates analytics events between placements (e.g. "hero", "cta"). */
  eventPrefix: string;
}

export function DownloadButtons({
  stableUrl,
  stableVersion,
  betaUrl,
  betaVersion,
  align = "start",
  eventPrefix,
}: DownloadButtonsProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4",
        centered && "sm:justify-center"
      )}
    >
      {/* Primary: latest stable */}
      <a
        href={stableUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(`${eventPrefix}_download_clicked`)}
        className="inline-flex flex-col items-center justify-center rounded-lg px-6 py-2.5 transition-all hover:brightness-110 sm:min-w-[176px]"
        style={{
          backgroundColor: "var(--page-accent)",
          color: "var(--page-accent-fg)",
        }}
      >
        <span className="text-sm font-semibold">Download Latest</span>
        {stableVersion && (
          <span className="font-mono text-[11px] font-normal leading-tight opacity-80">
            v{stableVersion}
          </span>
        )}
      </a>

      {/* Secondary: beta channel */}
      <a
        href={betaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(`${eventPrefix}_beta_clicked`)}
        className={cn(
          secondaryButtonClass,
          "flex-col px-6 py-2.5 sm:min-w-[176px]"
        )}
      >
        <span className="text-sm font-semibold">Join the Beta</span>
        {betaVersion && (
          <span className="font-mono text-[11px] font-normal leading-tight opacity-70">
            v{betaVersion}
          </span>
        )}
      </a>
    </div>
  );
}
