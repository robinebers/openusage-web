"use client";

import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/button-styles";

interface DownloadButtonsProps {
  stableUrl: string;
  stableVersion: string | null;
  betaUrl: string;
  betaVersion: string | null;
  /** Differentiates analytics events between placements (e.g. "hero", "cta"). */
  eventPrefix: string;
}

export function DownloadButtons({
  stableUrl,
  stableVersion,
  betaUrl,
  betaVersion,
  eventPrefix,
}: DownloadButtonsProps) {
  return (
    <div className="flex w-full flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
      {/* Primary: latest stable */}
      <a
        href={stableUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(`${eventPrefix}_download_clicked`)}
        className={cn(primaryButtonClass, "flex-col px-7 py-3 sm:min-w-[190px]")}
      >
        <span className="text-[16px] leading-tight">Download Latest</span>
        {stableVersion && (
          <span className="font-mono text-[11px] font-normal leading-tight opacity-75">
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
        className={cn(secondaryButtonClass, "flex-col px-7 py-3 sm:min-w-[190px]")}
      >
        <span className="text-[16px] leading-tight">Join the Beta</span>
        {betaVersion && (
          <span className="font-mono text-[11px] font-normal leading-tight text-muted">
            v{betaVersion}
          </span>
        )}
      </a>
    </div>
  );
}
