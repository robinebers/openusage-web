import { MenuBar, MenuBarTray } from "@/components/menu-bar";
import { Panel } from "@/components/panel/panel";
import { HeroContent } from "@/components/hero-content";
import { ProviderGrid } from "@/components/provider-grid";
import { NoiseOverlay } from "@/components/noise-overlay";
import { TrackedLink } from "@/components/tracked-link";
import { DownloadButtons } from "@/components/download-buttons";
import { Github, Gauge, BarChart3, Zap, Cpu, Radio } from "lucide-react";
import { ApiExample } from "@/components/api-example";
import { Maintainers } from "@/components/maintainers";
import { cn } from "@/lib/utils";
import { secondaryButtonClass } from "@/lib/button-styles";

const REPO = "robinebers/openusage";
const RELEASES_URL = `https://github.com/${REPO}/releases`;
/** Last release before the Swift rewrite (the old Tauri app). */
const LEGACY_VERSION = "0.6.28";

/** An optional token (set on Vercel) lifts the GitHub rate limit; calls are
 *  unauthenticated otherwise. */
function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface Release {
  version: string;
  url: string;
}

/** Latest stable release. GitHub's `releases/latest` already skips prereleases
 *  and drafts, so it always tracks the stable channel. */
async function getStableRelease(): Promise<Release | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { tag_name: string; html_url: string };
    return { version: data.tag_name.replace(/^v/, ""), url: data.html_url };
  } catch {
    return null;
  }
}

/** Latest pre-release (beta channel). Betas ship ~daily, so we resolve this at
 *  request time (1h cache) instead of hardcoding a tag that goes stale. */
async function getBetaRelease(): Promise<Release | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=30`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      tag_name: string;
      html_url: string;
      prerelease: boolean;
      draft: boolean;
    }>;
    const beta = data.find((r) => r.prerelease && !r.draft);
    if (!beta) return null;
    return { version: beta.tag_name.replace(/^v/, ""), url: beta.html_url };
  } catch {
    return null;
  }
}

/** Contributors shown on the wall. The Swift rewrite lives on a fresh `main`
 *  history, so the contributors endpoint only sees a handful of people. We merge
 *  in everyone from the pre-Swift (Tauri) history — reachable via the v0.6.28
 *  tag — so long-time contributors don't disappear. */
async function getContributors(): Promise<Contributor[]> {
  const [current, legacy] = await Promise.all([
    fetchRepoContributors(),
    fetchLegacyContributors(),
  ]);

  const merged = new Map<string, Contributor>();
  for (const c of [...current, ...legacy]) {
    const prev = merged.get(c.login);
    if (prev) prev.contributions += c.contributions;
    else merged.set(c.login, { ...c });
  }

  return [...merged.values()]
    .filter((c) => !c.login.includes("[bot]") && c.login !== "dependabot")
    .sort((a, b) => b.contributions - a.contributions);
}

/** Contributors on the current default branch (the Swift app). */
async function fetchRepoContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contributors?per_page=100`,
      { headers: ghHeaders(), next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    return (await res.json()) as Contributor[];
  } catch {
    return [];
  }
}

/** Authors from the Tauri history, aggregated from commits on the v0.6.28 tag.
 *  The contributors endpoint can't target a ref, so we count commits per author
 *  (capped at a few pages — the Tauri history is ~500 commits). */
async function fetchLegacyContributors(): Promise<Contributor[]> {
  const counts = new Map<string, Contributor>();
  try {
    for (let page = 1; page <= 8; page++) {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/commits?sha=v${LEGACY_VERSION}&per_page=100&page=${page}`,
        { headers: ghHeaders(), next: { revalidate: 86400 } }
      );
      if (!res.ok) break;
      const commits = (await res.json()) as Array<{
        author: { login: string; avatar_url: string; html_url: string } | null;
      }>;
      if (commits.length === 0) break;
      for (const { author } of commits) {
        if (!author?.login) continue;
        const prev = counts.get(author.login);
        if (prev) prev.contributions += 1;
        else
          counts.set(author.login, {
            login: author.login,
            avatar_url: author.avatar_url,
            html_url: author.html_url,
            contributions: 1,
          });
      }
      if (commits.length < 100) break;
    }
  } catch {
    // Return whatever we managed to collect.
  }
  return [...counts.values()];
}

export default async function Home() {
  const [stable, beta, contributors] = await Promise.all([
    getStableRelease(),
    getBetaRelease(),
    getContributors(),
  ]);

  const stableUrl = stable?.url ?? `${RELEASES_URL}/latest`;
  const stableVersion = stable?.version ?? null;
  const betaUrl = beta?.url ?? RELEASES_URL;
  const betaVersion = beta?.version ?? null;
  // The demo panel mocks the shipping app, so it shows the latest stable version.
  const panelVersion = stable?.version ?? null;

  return (
    <div className="relative min-h-screen" style={{ background: "var(--page-bg)" }}>
      <NoiseOverlay />

      {/* ── Menu bar + hero wrapper (positioning context for panel) ── */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Full macOS menu bar — desktop only. The popover hangs off the tray
            icon inside the bar, so it's positioned by CSS (no JS measurement)
            and renders visible in the server HTML. */}
        <div className="max-lg:hidden">
          <MenuBar version={panelVersion} />
        </div>

        {/* Hero: just the marketing content */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 lg:pr-[380px] 2xl:pr-[340px]">
          <div className="lg:min-h-[920px]">
            <HeroContent
              betaUrl={betaUrl}
              betaVersion={betaVersion}
              stableUrl={stableUrl}
              stableVersion={stableVersion}
            />
          </div>
        </section>

        {/* Mobile: tray bar + panel below hero */}
        <div className="lg:hidden flex flex-col items-center md:items-end pb-12">
          {/* Full-width tray bar, items right-aligned */}
          <div
            className="w-full h-[28px] flex items-center justify-end px-4 select-none"
            style={{
              background: "var(--bar-bg)",
              color: "var(--bar-fg)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <MenuBarTray trayIconId="tray-icon-mobile" />
          </div>
          {/* Panel, flow-positioned below the tray bar */}
          <div className="px-3 md:px-12 w-full flex flex-col items-center md:items-end">
            <Panel version={panelVersion} placement="flow" />
          </div>
        </div>
      </div>

      {/* ── Provider Grid ── */}
      <ProviderGrid />

      {/* ── Maintainers ── */}
      <Maintainers />

      {/* ── Features Section ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-pretty">
            Never Wonder Again
          </h2>
          <p
            className="mt-3 text-sm lg:text-base max-w-lg text-balance"
            style={{ color: "var(--page-fg-muted)" }}
          >
            Everything you need to build without token anxiety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl transition-colors"
              style={{
                border: "1px solid var(--page-card-border)",
                backgroundColor: "var(--page-card)",
              }}
            >
              <feature.icon
                className="w-5 h-5 mb-3"
                style={{ color: "var(--page-accent)" }}
              />
              <h3 className="text-base font-bold text-pretty mb-1.5">
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed text-pretty"
                style={{ color: "var(--page-fg-muted)" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Local HTTP API ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div
          className="rounded-2xl p-6 md:p-10"
          style={{
            border: "1px solid var(--page-card-border)",
            backgroundColor: "var(--page-card)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            {/* Copy */}
            <div className="space-y-3 lg:max-w-sm flex-shrink-0">
              <Radio
                className="w-12 h-12 mb-3"
                style={{ color: "var(--page-accent)" }}
              />
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-pretty">
                One Signal. Every Screen.
              </h2>
              <p
                className="text-sm lg:text-base leading-relaxed text-balance"
                style={{ color: "var(--page-fg-muted)" }}
              >
                Think of it like a weather station. OpenUsage does all the
                measuring. Your status line, your editor, your scripts? They
                just read the forecast through a local API. No tokens, no auth,
                no setup.
              </p>
              <div
                className="text-sm font-mono pt-2 space-y-1"
                style={{ color: "var(--page-fg-muted)" }}
              >
                <p>
                  <span style={{ color: "var(--page-fg-subtle)" }}>$ </span>
                  curl{" "}
                  <a
                    href="http://localhost:6736/v1/usage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--page-accent)]"
                  >
                    localhost:6736/v1/usage
                  </a>
                </p>
                <p>
                  <span style={{ color: "var(--page-fg-subtle)" }}>$ </span>
                  curl{" "}
                  <a
                    href="http://localhost:6736/v1/usage/claude"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--page-accent)]"
                  >
                    localhost:6736/v1/usage/claude
                  </a>
                </p>
              </div>
            </div>

            {/* Code example */}
            <div className="w-full lg:flex-1 min-w-0">
              <ApiExample />
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Source ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div
          className="rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{
            border: "1px solid var(--page-card-border)",
            backgroundColor: "var(--page-card)",
          }}
        >
          {/* Left: copy + CTA */}
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-pretty">
              Truly Open Source
            </h2>
            <p
              className="text-sm lg:text-base leading-relaxed text-balance"
              style={{ color: "var(--page-fg-muted)" }}
            >
              A native macOS app built with Swift and SwiftUI, and fully built
              with AI. Jump in, fix a bug, or add a provider. Every contribution
              makes it better for everyone.
            </p>
            <TrackedLink
              event="view_on_github_clicked"
              href="https://github.com/robinebers/openusage"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(secondaryButtonClass, "gap-2 px-6 py-3 text-sm font-semibold")}
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </TrackedLink>
          </div>

          {/* Right: contributors wall */}
          {contributors.length > 0 && (
            <div className="w-full md:w-auto md:max-w-sm flex flex-col gap-3 md:items-end">
              <div className="flex flex-wrap gap-2 md:justify-end">
                {contributors.map((c) => (
                  <a
                    key={c.login}
                    href={c.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={c.login}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${c.avatar_url}&s=64`}
                      alt={c.login}
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-[var(--card)] hover:ring-[var(--page-accent)] transition-all"
                    />
                  </a>
                ))}
              </div>
              <span
                className="text-xs"
                style={{ color: "var(--page-fg-muted)" }}
              >
                {contributors.length} contributor{contributors.length !== 1 && "s"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-pretty mb-4">
          Never Get Cut Off by Surprise.
        </h2>
        <p
          className="text-sm lg:text-base mb-8 max-w-md mx-auto text-balance"
          style={{ color: "var(--page-fg-muted)" }}
        >
          Download OpenUsage for macOS. It&apos;s free, and you&apos;ll
          never have to guess your limits again.
        </p>
        <div className="mx-auto max-w-xl">
          <DownloadButtons
            eventPrefix="cta"
            align="center"
            stableUrl={stableUrl}
            stableVersion={stableVersion}
            betaUrl={betaUrl}
            betaVersion={betaVersion}
          />
        </div>
        <p
          className="text-xs mt-4 text-pretty"
          style={{ color: "var(--page-fg-subtle)" }}
        >
          Requires macOS 15+{stableVersion ? <> &middot; v{stableVersion}</> : null} &middot; MIT License
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid var(--page-border)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs"
              style={{ color: "var(--page-fg-subtle)" }}
            >
              OpenUsage &middot; by{" "}
              <a
                href="https://itsbyrob.in/youtube"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--page-accent)]"
              >
                Robin Ebers
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <TrackedLink
              event="footer_github_clicked"
              href="https://github.com/robinebers/openusage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-[var(--page-accent)]"
              style={{ color: "var(--page-fg-subtle)" }}
            >
              GitHub
            </TrackedLink>
            <TrackedLink
              event="footer_youtube_clicked"
              href="https://itsbyrob.in/youtube"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-[var(--page-accent)]"
              style={{ color: "var(--page-fg-subtle)" }}
            >
              YouTube
            </TrackedLink>
            <TrackedLink
              event="footer_twitter_clicked"
              href="https://itsbyrob.in/x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-[var(--page-accent)]"
              style={{ color: "var(--page-fg-subtle)" }}
            >
              Twitter
            </TrackedLink>
            <TrackedLink
              event="footer_newsletter_clicked"
              href="https://itsbyrob.in/lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-[var(--page-accent)]"
              style={{ color: "var(--page-fg-subtle)" }}
            >
              Newsletter
            </TrackedLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Static data ── */

const features = [
  {
    icon: Gauge,
    title: "Every Tool, One Glance",
    description:
      "All your AI coding tools in one panel. No more digging through dashboards.",
  },
  {
    icon: BarChart3,
    title: "Always Visible",
    description:
      "OpenUsage lives in your menu bar. Just look up and know where you stand.",
  },
  {
    icon: Zap,
    title: "Know Before You Run Out",
    description:
      "See if you're using too much too fast. Stay ahead of your limits before it's too late.",
  },
  {
    icon: Cpu,
    title: "Native macOS App",
    description:
      "A fast, lightweight Swift app that sips resources and feels right at home in your menu bar.",
  },
];
