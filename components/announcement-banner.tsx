"use client";

import { track } from "@vercel/analytics";

export function AnnouncementBanner({
  betaUrl,
  betaVersion,
}: {
  betaUrl: string;
  betaVersion: string | null;
}) {
  return (
    <div
      className="sticky top-0 z-[60] w-full"
      style={{ background: "var(--page-accent)", color: "var(--page-accent-fg)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-6 py-2 text-center text-xs sm:text-sm">
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
      </div>
    </div>
  );
}
