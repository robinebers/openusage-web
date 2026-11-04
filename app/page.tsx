import { Github } from "lucide-react";
import { HeroContent } from "@/components/hero-content";
import { SiteNav } from "@/components/site-nav";
import { ProviderGrid } from "@/components/provider-grid";
import { TrackedLink } from "@/components/tracked-link";
import { DownloadButtons } from "@/components/download-buttons";
import { ApiExample } from "@/components/api-example";
import { Maintainers } from "@/components/maintainers";
import { AppLogo, Marker, Tint } from "@/components/brand";
import { cn } from "@/lib/utils";
import { secondaryButtonClass } from "@/lib/button-styles";
import {
  RELEASES_URL,
  REPO_URL,
  getBetaRelease,
  getContributors,
  getStableRelease,
  newInReleaseUrl,
  type Contributor,
} from "@/lib/github";

const FEATURES = [
  {
    title: "What's running out, first",
    body: "Priority lists the limits running low, soonest to run out at your pace first, then what's used up and which accounts need you.",
  },
  {
    title: "Right in your menu bar",
    body: "The limits closest to running out sit in the menu bar on their own, up to five. Just look up and know where you stand.",
  },
  {
    title: "Arranged your way",
    body: "Pin the metrics you care about, hide the rest, and drag accounts and metrics into your order.",
  },
  {
    title: "Every account, side by side",
    body: "Add every Claude, ChatGPT or Cursor account you pay for, personal and work, and give each one a name.",
  },
  {
    title: "A heads-up before you run out",
    body: "Get a notification when a limit drops under 30% left, and hover a bar to see where your pace lands at reset.",
  },
  {
    title: "Your keys stay yours",
    body: "Sign in to each account inside the app. OpenUsage never reads other tools' credentials, and it can hide your usage from the menu bar while you share your screen.",
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

  return (
    <div className="min-h-screen bg-white">
      <SiteNav downloadUrl={downloads.stableUrl} />
      <HeroContent
        stableUrl={downloads.stableUrl}
        stableVersion={downloads.stableVersion}
        newInUrl={newInReleaseUrl(stable, beta)}
      />

      <ProviderGrid />

      {/* ── Features ── */}
      <section id="features" className="scroll-mt-6 mx-auto flex w-full max-w-[1240px] flex-col gap-12 border-t border-line px-gutter py-[clamp(56px,7vw,88px)]">
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

      {/* ── CLI ── */}
      <section className="border-t border-line px-gutter py-[clamp(56px,7vw,88px)]">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[20px] border border-line lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5 border-b border-line p-[clamp(28px,4vw,56px)] lg:border-r lg:border-b-0">
            <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[.95]">
              One signal. <span className="text-brand">Every screen.</span>
            </h2>
            <p className="text-pretty text-[clamp(17px,1.8vw,20px)] leading-normal">
              Think of it like a weather station. OpenUsage does all the
              measuring. Your status line, your editor, your agents? They just
              read the forecast with the <Tint>openusage</Tint> command, as JSON.
              No tokens, no network calls.
            </p>
            <div className="mt-auto flex flex-col gap-1.5 font-mono text-[14px]">
              <p>
                <span className="text-muted">$ </span>openusage
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
        <AppLogo />
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
