"use client";

import { GaugeIcon } from "@/lib/icons";
import { plugins } from "@/lib/plugins";
import { Github } from "lucide-react";
import { track } from "@vercel/analytics";

export function HeroContent() {
  return (
    <div className="flex flex-col justify-center gap-6 lg:gap-8 pt-12 lg:pt-24 pb-16 max-w-xl">
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
        className="text-sm sm:text-base lg:text-lg leading-relaxed text-pretty"
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <a
          href="https://github.com/robinebers/openusage/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{
            backgroundColor: "var(--page-accent)",
            color: "var(--page-accent-fg)",
          }}
          onClick={() => track("hero_download_clicked")}
        >
          Download for macOS
        </a>
        <a
          href="https://github.com/robinebers/openusage"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors bg-[var(--btn-secondary-bg)] hover:bg-black/5"
          style={{
            border: "1px solid var(--btn-secondary-border)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "var(--page-fg)",
          }}
          onClick={() => track("hero_contribute_clicked")}
        >
          <Github className="w-4 h-4" />
          Contribute
        </a>
      </div>

      {/* MIT badge */}
      <div>
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{
            color: "var(--page-fg-muted)",
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        >
          Free &middot; Open Source &middot; macOS
        </span>
      </div>
    </div>
  );
}
