import { plugins } from "@/lib/plugins";
import { DownloadButtons } from "@/components/download-buttons";
import { Logo, Marker } from "@/components/brand";
import { CopyCommand } from "@/components/copy-command";

interface HeroContentProps {
  betaUrl: string;
  betaVersion: string | null;
  stableUrl: string;
  stableVersion: string | null;
}

export function HeroContent({
  betaUrl,
  betaVersion,
  stableUrl,
  stableVersion,
}: HeroContentProps) {
  return (
    // Desktop width = the room left of the popover, which hangs off the menu bar's right edge.
    <div className="flex max-w-xl flex-col gap-7 pt-12 pb-16 lg:max-w-[min(740px,calc(100vw_-_620px))] lg:pt-24">
      <Logo className="text-[22px]" />

      <h1 className="display text-[clamp(44px,5.6vw,80px)] leading-[.92]">
        The Only AI Usage Tracker That&apos;s <Marker>Truly&nbsp;Yours</Marker>
      </h1>

      <p className="text-balance text-[clamp(20px,2vw,26px)] leading-[1.2] font-bold tracking-[-.03em] text-brand">
        All your AI limits, right in your menu bar.
      </p>

      <p className="text-pretty text-[clamp(17px,1.6vw,20px)] leading-normal">
        Track the exact metrics and subscriptions that matter to you. See what
        they cost, know before you run out, and never get cut off by surprise.
      </p>

      {/* Provider marks (labels live in the dedicated section below) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-muted sm:gap-x-5">
        {plugins.map(({ id, name, Icon }) => (
          <Icon key={id} className="h-6 w-6" aria-label={name} role="img" />
        ))}
      </div>

      <div className="flex flex-col gap-3.5">
        <DownloadButtons
          eventPrefix="hero"
          align="start"
          stableUrl={stableUrl}
          stableVersion={stableVersion}
          betaUrl={betaUrl}
          betaVersion={betaVersion}
        />
        <p className="text-[15px] text-muted">
          macOS 15+ &middot; Free and open source &middot; or{" "}
          <CopyCommand command="brew install --cask openusage" event="hero_brew_copied" />
        </p>
      </div>
    </div>
  );
}
