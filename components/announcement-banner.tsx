"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { track } from "@vercel/analytics";

export function AnnouncementBanner({
  betaUrl,
  betaVersion,
}: {
  betaUrl: string;
  betaVersion: string | null;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="sticky top-0 z-[60] w-full"
      style={{ background: "var(--page-accent)", color: "var(--page-accent-fg)" }}
    >
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-10 py-2 text-center text-xs sm:text-sm">
        <span className="font-semibold">OpenUsage is changing.</span>
        <span className="opacity-90">
          A brand-new version is on the way
          {betaVersion ? ` — preview the ${betaVersion} beta` : ""}.
        </span>
        <a
          href={betaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("banner_beta_clicked")}
          className="whitespace-nowrap font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          Try the beta &rarr;
        </a>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            setDismissed(true);
            track("banner_dismissed");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
