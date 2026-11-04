import Link from "next/link";
import { AppLogo } from "@/components/brand";
import { TrackedLink } from "@/components/tracked-link";
import { RELEASES_URL, REPO_URL } from "@/lib/github";
import { focusRing } from "@/lib/button-styles";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const link = `rounded-[4px] text-[16px] font-medium text-subtle transition-colors hover:text-ink max-md:hidden ${focusRing}`;

export function SiteNav({ downloadUrl }: { downloadUrl: string }) {
  return (
    <header className="mx-auto flex h-14 w-full max-w-[1384px] items-center justify-between px-gutter md:h-[76px]">
      <Link href="/" prefetch={false} aria-label="OpenUsage home" className={`rounded-[8px] ${focusRing}`}>
        <AppLogo />
      </Link>
      <nav aria-label="Main" className="flex items-center gap-8">
        <a href="#features" className={link}>
          Features
        </a>
        <TrackedLink event="nav_changelog_clicked" href={RELEASES_URL} {...external} className={link}>
          Changelog
        </TrackedLink>
        <TrackedLink event="nav_github_clicked" href={REPO_URL} {...external} className={link}>
          GitHub
        </TrackedLink>
        <TrackedLink
          event="nav_download_clicked"
          href={downloadUrl}
          {...external}
          className={`inline-flex h-9 items-center rounded-full bg-ink px-4 text-[14px] font-bold text-white transition-colors hover:bg-black md:h-10 md:px-[18px] md:text-[15px] ${focusRing}`}
        >
          Download
        </TrackedLink>
      </nav>
    </header>
  );
}
