import { plugins } from "@/lib/plugins";
import { AppleIcon } from "@/lib/icons";
import { NEW_IN_VERSION } from "@/lib/github";
import { focusRing } from "@/lib/button-styles";
import { CopyCommand } from "@/components/copy-command";
import { TrackedLink } from "@/components/tracked-link";
import { Trailer } from "@/components/trailer";
import { external } from "@/lib/utils";

interface HeroContentProps {
  stableUrl: string;
  stableVersion: string | null;
  /** Release the "NEW" pill points at (see `newInReleaseUrl`). */
  newInUrl: string;
}

const NAMED_PROVIDERS = 4;

export function HeroContent({ stableUrl, stableVersion, newInUrl }: HeroContentProps) {
  return (
    <section className="mx-auto flex w-full max-w-[1384px] flex-col items-center px-gutter pb-[clamp(56px,7vw,96px)]">
      <div className="flex flex-col items-center gap-5 pt-9 pb-9 text-center md:gap-7 md:pt-[72px] md:pb-0">
        <TrackedLink
          event="hero_new_pill_clicked"
          href={newInUrl}
          {...external}
          className={`inline-flex h-[30px] items-center gap-[7px] rounded-full bg-ou-tint pr-3 pl-[5px] text-[13px] font-semibold text-ou-blue-ink transition-colors hover:bg-[#d3e4ff] md:h-[34px] md:gap-2 md:pr-3.5 md:pl-1.5 md:text-[15px] ${focusRing}`}
        >
          <span className="rounded-full bg-ou-blue-strong px-2 py-[3px] text-[11px] font-bold tracking-[.02em] text-white md:px-[9px] md:text-[12px]">
            NEW
          </span>
          <span>{NEW_IN_VERSION} puts what&apos;s running out first</span>
        </TrackedLink>

        <h1 className="display text-[clamp(46px,7.2vw,104px)] leading-[.95] md:leading-[.923]">
          Every AI limit,
          <br />
          <span className="text-ou-blue">one glance away.</span>
        </h1>

        <p className="max-w-[720px] text-[17px] leading-[25px] text-pretty text-body md:text-[22px] md:leading-8">
          OpenUsage lives in your menu bar and tracks every AI plan you pay for. What&apos;s
          closest to running out comes first<span className="max-md:hidden">, so nothing cuts you off mid-task</span>.
        </p>

        <div className="flex w-full flex-col items-center gap-2.5 md:w-auto md:flex-row md:gap-3 md:pt-1.5">
          <TrackedLink
            event="hero_download_clicked"
            href={stableUrl}
            {...external}
            className={`inline-flex h-[54px] w-full max-w-[350px] items-center justify-center gap-2.5 rounded-full bg-ou-blue-strong px-7 font-bold whitespace-nowrap text-white shadow-[0_8px_24px_rgba(26,102,240,0.28)] transition-colors hover:bg-[#1557d6] md:h-[58px] md:w-auto md:max-w-none ${focusRing}`}
          >
            <AppleIcon aria-hidden className="h-[18px] w-[15px] -translate-y-px" />
            <span className="text-[17px]">Download for Mac</span>
            {stableVersion && (
              <span className="font-mono text-[12px] font-normal text-white">v{stableVersion}</span>
            )}
          </TrackedLink>
          <CopyCommand command="brew install --cask openusage" event="hero_brew_copied" />
        </div>
      </div>

      {/* Phones show the provider row under the trailer. */}
      <div className="flex flex-col items-center gap-3 pt-7 pb-2 text-center max-md:order-last md:gap-3.5 md:pt-[38px] md:pb-14">
        <div aria-hidden className="flex items-center gap-2 text-muted md:gap-[18px]">
          {plugins.map(({ id, Icon }) => (
            <Icon key={id} className="size-[18px] md:size-[22px]" />
          ))}
        </div>
        <p className="text-[13px] leading-[19px] text-subtle md:text-[14px]">
          macOS 15+ · Free and open source
          <span className="max-md:hidden"> · </span>
          <br className="md:hidden" />
          Claude, ChatGPT, Cursor, Copilot and {plugins.length - NAMED_PROVIDERS} more
        </p>
      </div>

      <Trailer />
    </section>
  );
}
