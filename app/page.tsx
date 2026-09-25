import { Github } from "lucide-react";
import { MenuBar, MenuBarTray } from "@/components/menu-bar";
import { Panel } from "@/components/panel/panel";
import { HeroContent } from "@/components/hero-content";
import { ProviderGrid } from "@/components/provider-grid";
import { TrackedLink } from "@/components/tracked-link";
import { DownloadButtons } from "@/components/download-buttons";
import { ApiExample } from "@/components/api-example";
import { Maintainers } from "@/components/maintainers";
import { Logo, Marker, Tint } from "@/components/brand";
import { cn } from "@/lib/utils";
import { secondaryButtonClass } from "@/lib/button-styles";
import {
  RELEASES_URL,
  REPO_URL,
  getBetaRelease,
  getContributors,
  getStableRelease,
  type Contributor,
} from "@/lib/github";

const FEATURES = [
  {
    title: "Total Spend at a glance",
    body: "See what Claude, Codex, Cursor and Grok cost today, yesterday or over 30 days, all in one ring.",
  },
  {
    title: "Know before you run out",
    body: "Pace markers and flame warnings tell you when you're burning too fast, and exactly when you'll hit the wall.",
  },
  {
    title: "Pinned to your menu bar",
    body: "Star up to two metrics per provider. Just look up and know where you stand.",
  },
  {
    title: "Arranged your way",
    body: "Turn providers and metrics on or off, drag them into order, and tuck the rest behind a tap.",
  },
  {
    title: "Every account, every Mac",
    body: "Track several Claude and Codex accounts side by side, with usage history synced over iCloud.",
  },
  {
    title: "No login, no leaks",
    body: "It reads the credentials already on your Mac, and hides your numbers while you share your screen.",
  },
];

const FOOTER_LINKS = [
  { event: "footer_github_clicked", href: REPO_URL, label: "GitHub" },
  { event: "footer_youtube_clicked", href: "https://itsbyrob.in/youtube", label: "YouTube" },
  { event: "footer_twitter_clicked", href: "https://itsbyrob.in/x", label: "X" },
  { event: "footer_newsletter_clicked", href: "https://robinebers.com", label: "Newsletter" },
];

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function Home() {
  const [stable, beta, contributors] = await Promise.all([
    getStableRelease(),
    getBetaRelease(),
    getContributors(),
  ]);

  const downloads = {
    stableUrl: stable?.url ?? `${RELEASES_URL}/latest`,
    stableVersion: stable?.version ?? null,
    betaUrl: beta?.url ?? RELEASES_URL,
    betaVersion: beta?.version ?? null,
  };
  // The demo panel mocks the shipping app, so it shows the latest stable version.
  const panelVersion = stable?.version ?? null;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Menu bar + hero (positioning context for the popover) ── */}
      <div className="relative">
        {/* Full macOS menu bar — desktop only. The popover hangs off the tray
            icon inside the bar, so it's positioned by CSS (no JS measurement)
            and renders visible in the server HTML. */}
        <div className="max-lg:hidden">
          <MenuBar version={panelVersion} />
        </div>

        <section className="mx-auto max-w-[1240px] px-gutter">
          <div className="lg:min-h-[760px]">
            <HeroContent {...downloads} />
          </div>
        </section>

        {/* Mobile: tray bar + panel below the hero */}
        <div className="flex flex-col items-center pb-14 md:items-end lg:hidden">
          <div
            className="flex h-[28px] w-full items-center justify-end px-4 select-none"
            style={{
              background: "var(--bar-bg)",
              color: "var(--bar-fg)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <MenuBarTray trayIconId="tray-icon-mobile" />
          </div>
          <div className="flex w-full flex-col items-center px-3 pt-2 md:items-end md:px-12">
            <Panel version={panelVersion} placement="flow" />
          </div>
        </div>
      </div>

      <ProviderGrid />

      {/* ── Features ── */}
      <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 border-t border-line px-gutter py-[clamp(56px,7vw,88px)]">
        <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[.95]">
          Never wonder again.
          <br />
          <span className="text-brand">Build without token anxiety.</span>
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-2.5 border-t-4 border-brand pt-4.5">
              <h3 className="text-[clamp(22px,2.2vw,27px)] leading-[1.15] font-bold tracking-[-.03em]">
                {f.title}
              </h3>
              <p className="text-pretty text-[17px] leading-normal">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Local API + CLI ── */}
      <section className="border-t border-line px-gutter py-[clamp(56px,7vw,88px)]">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[20px] border border-line lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5 border-b border-line p-[clamp(28px,4vw,56px)] lg:border-r lg:border-b-0">
            <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[.95]">
              One signal. <span className="text-brand">Every screen.</span>
            </h2>
            <p className="text-pretty text-[clamp(17px,1.8vw,20px)] leading-normal">
              Think of it like a weather station. OpenUsage does all the
              measuring. Your status line, your editor, your agents? They just
              read the forecast through a <Tint>local API</Tint> or the{" "}
              <Tint>openusage</Tint> command. No tokens, no auth, no setup.
            </p>
            <div className="mt-auto flex flex-col gap-1.5 font-mono text-[14px]">
              <p>
                <span className="text-muted">$ </span>curl{" "}
                <a href="http://localhost:6736/v1/limits" {...external} className="underline decoration-line underline-offset-4 hover:text-brand">
                  localhost:6736/v1/limits
                </a>
              </p>
              <p>
                <span className="text-muted">$ </span>openusage claude
              </p>
            </div>
          </div>
          <div className="min-w-0 bg-paper p-[clamp(16px,3vw,40px)]">
            <ApiExample />
          </div>
        </div>
      </section>

      {/* ── Open Source ── */}
      <section className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-start gap-10 border-t border-line px-gutter py-[clamp(56px,7vw,88px)] md:grid-cols-2">
        <div className="flex max-w-[560px] flex-col gap-5">
          <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[.95]">
            Truly open source.
            <br />
            <span className="text-brand">Fully built with AI.</span>
          </h2>
          <p className="text-pretty text-[clamp(17px,1.8vw,20px)] leading-normal">
            A native macOS app built with Swift and SwiftUI. Jump in, fix a
            bug, or add a provider. Every contribution makes it better for
            everyone.
          </p>
          <div>
            <TrackedLink
              event="view_on_github_clicked"
              href={REPO_URL}
              {...external}
              className={cn(secondaryButtonClass, "gap-2 px-6 py-3 text-[16px]")}
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </TrackedLink>
          </div>
        </div>
        {contributors.length > 0 && <ContributorWall contributors={contributors} />}
      </section>

      <Maintainers />

      {/* ── Final CTA ── */}
      <section className="border-t border-line bg-tint px-gutter py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-[clamp(32px,4vw,48px)] text-center">
          <h2 className="display text-[clamp(44px,7vw,104px)] leading-[.9]">
            Never get cut off
            <br />
            <Marker>by surprise.</Marker>
          </h2>
          <div className="flex w-full max-w-xl flex-col items-center gap-3.5">
            <DownloadButtons eventPrefix="cta" align="center" {...downloads} />
            <p className="text-[15px] text-muted">
              Requires macOS 15+
              {downloads.stableVersion ? <> &middot; v{downloads.stableVersion}</> : null} &middot; MIT License
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-3.5 border-t border-line px-gutter py-8 text-sm font-medium text-muted">
        <Logo className="text-[17px] text-ink" />
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2.5">
          {FOOTER_LINKS.map((link) => (
            <TrackedLink key={link.label} event={link.event} href={link.href} {...external} className="hover:text-brand">
              {link.label}
            </TrackedLink>
          ))}
        </div>
        <span>
          Made by{" "}
          <a href="https://robinebers.com" {...external} className="text-ink hover:text-brand">
            Robin Ebers
          </a>
        </span>
      </footer>
    </div>
  );
}

function ContributorWall({ contributors }: { contributors: Contributor[] }) {
  return (
    <div className="flex flex-col gap-3 md:items-end">
      <div className="flex flex-wrap gap-2 md:justify-end">
        {contributors.map((c) => (
          <a key={c.login} href={c.html_url} {...external} title={c.login}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${c.avatar_url}&s=80`}
              alt={c.login}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-white transition-shadow hover:ring-brand"
            />
          </a>
        ))}
      </div>
      <span className="text-[15px] text-muted">
        {contributors.length} contributor{contributors.length !== 1 && "s"}
      </span>
    </div>
  );
}
