import { MenuBar, MenuBarTray } from "@/components/menu-bar";
import { Panel } from "@/components/panel/panel";
import { HeroContent } from "@/components/hero-content";
import { ProviderGrid } from "@/components/provider-grid";
import { NoiseOverlay } from "@/components/noise-overlay";
import { TrackedLink } from "@/components/tracked-link";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Github, Gauge, BarChart3, Zap, Cpu, Radio } from "lucide-react";
import { ApiExample } from "@/components/api-example";
import { Maintainers } from "@/components/maintainers";

const RELEASES_URL = "https://github.com/robinebers/openusage/releases";
const STABLE_URL =
  "https://github.com/robinebers/openusage/releases/latest";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface BetaRelease {
  version: string;
  url: string;
}

/** Latest pre-release (beta channel). Betas ship ~daily, so we resolve this at
 *  request time (1h cache) instead of hardcoding a tag that goes stale. */
async function getBetaRelease(): Promise<BetaRelease | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/robinebers/openusage/releases?per_page=15",
      { next: { revalidate: 3600 } }
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

async function getVersion(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://github.com/robinebers/openusage/releases/latest/download/latest.json",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.version || null;
  } catch {
    return null;
  }
}

async function getContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/robinebers/openusage/contributors?per_page=30",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // Filter out bots
    return (data as Contributor[]).filter(
      (c) => !c.login.includes("[bot]") && c.login !== "dependabot"
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const [version, contributors, beta] = await Promise.all([
    getVersion(),
    getContributors(),
    getBetaRelease(),
  ]);

  const betaUrl = beta?.url ?? RELEASES_URL;

  return (
    <div className="relative min-h-screen" style={{ background: "var(--page-bg)" }}>
      <AnnouncementBanner betaUrl={betaUrl} betaVersion={beta?.version ?? null} />
      <NoiseOverlay />

      {/* ── Menu bar + hero wrapper (positioning context for panel) ── */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Full macOS menu bar — desktop only. The popover hangs off the tray
            icon inside the bar, so it's positioned by CSS (no JS measurement)
            and renders visible in the server HTML. */}
        <div className="max-lg:hidden">
          <MenuBar version={version} />
        </div>

        {/* Hero: just the marketing content */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 lg:pr-[380px] 2xl:pr-[340px]">
          <div className="lg:min-h-[600px]">
            <HeroContent
              betaUrl={betaUrl}
              betaVersion={beta?.version ?? null}
              stableUrl={STABLE_URL}
              stableVersion={version}
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
            <Panel version={version} placement="flow" />
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors hover:brightness-125"
              style={{
                border: "1px solid var(--btn-secondary-border)",
                backgroundColor: "var(--btn-secondary-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                color: "var(--page-fg)",
              }}
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
        <div className="flex items-center justify-center gap-4">
          <TrackedLink
            event="cta_download_clicked"
            href="https://github.com/robinebers/openusage/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
            style={{
              backgroundColor: "var(--page-accent)",
              color: "var(--page-accent-fg)",
            }}
          >
            Download for macOS
          </TrackedLink>
        </div>
        <p
          className="text-xs mt-4 text-pretty"
          style={{ color: "var(--page-fg-subtle)" }}
        >
          Requires macOS 14+{version ? <> &middot; v{version}</> : null} &middot; MIT License
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
