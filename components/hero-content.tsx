"use client";

import { GaugeIcon } from "@/lib/icons";
import { plugins } from "@/lib/plugins";
import { DownloadButtons } from "@/components/download-buttons";

interface HeroContentProps {
  betaUrl: string;
  betaVersion: string | null;
  stableUrl: string;
  stableVersion: string | null;
  legacyUrl: string;
  legacyVersion: string;
}

export function HeroContent({
  betaUrl,
  betaVersion,
  stableUrl,
  stableVersion,
  legacyUrl,
  legacyVersion,
}: HeroContentProps) {
  return (
    <div className="flex flex-col justify-center gap-6 lg:gap-8 pt-12 lg:pt-24 pb-16 max-w-xl 2xl:max-w-none">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <GaugeIcon className="w-5 h-5" style={{ color: "var(--page-fg)" }} />
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: "var(--page-fg)" }}
        >
          OpenUsage
        </span>
      </div>

      {/* Headline */}
      <div className="space-y-4 text-pretty">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-pretty">
          The Only AI Usage Tracker That&apos;s <span style={{ color: "var(--page-accent)" }}>Truly Yours</span>
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="text-sm sm:text-base lg:text-lg leading-relaxed text-balance 2xl:max-w-xl"
        style={{ color: "var(--page-fg-muted)" }}
      >
        Track and customize the exact metrics and subscriptions that matter to you. Keep them at a glance in the menu bar. Just open the app, make it yours, and never look back.
      </p>

      {/* Provider icons */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        {plugins.map(({ id, name, Icon }) => (
          <div key={id} className="flex items-center gap-2">
            <Icon className="w-6 h-6" style={{ color: "var(--page-fg-muted)" }} />
            <span
              className="hidden sm:inline text-sm font-medium"
              style={{ color: "var(--page-fg-muted)" }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <DownloadButtons
        eventPrefix="hero"
        align="start"
        stableUrl={stableUrl}
        stableVersion={stableVersion}
        betaUrl={betaUrl}
        betaVersion={betaVersion}
        legacyUrl={legacyUrl}
        legacyVersion={legacyVersion}
      />

      {/* Channel badge */}
      <div>
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{
            color: "var(--page-fg-muted)",
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        >
          macOS 15+ &middot; Free &middot; Open Source
        </span>
      </div>
    </div>
  );
}
