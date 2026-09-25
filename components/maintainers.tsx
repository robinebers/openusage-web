"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  NewTwitterIcon,
  GlobalIcon,
} from "@hugeicons-pro/core-solid-rounded";

type LinkType = "github" | "x" | "website";

interface MaintainerLink {
  type: LinkType;
  href: string;
  label?: string;
}

interface Maintainer {
  name: string;
  avatar: string;
  subtitle: string;
  links: MaintainerLink[];
}

const linkMeta: Record<LinkType, { icon: typeof GithubIcon; label: string }> = {
  github: { icon: GithubIcon, label: "GitHub" },
  x: { icon: NewTwitterIcon, label: "X" },
  website: { icon: GlobalIcon, label: "Website" },
};

const maintainers: Maintainer[] = [
  {
    name: "Robin Ebers",
    avatar: "/maintainers/robinebers.webp",
    subtitle:
      "AI educator who helps businesses put AI to work: automate the emails, content, and reports nobody wants to do, and build the simple tools their customers need.",
    links: [
      { type: "github", href: "https://github.com/robinebers" },
      { type: "x", href: "https://x.com/robinebers" },
      { type: "website", href: "https://robinebers.com", label: "robinebers.com" },
    ],
  },
  {
    name: "Mert Can Demir",
    avatar: "/maintainers/validatedev.webp",
    subtitle:
      "Machine learning engineer who also ships macOS menu bar apps and Homebrew tools. Most of my public work is small utilities that fix everyday developer friction.",
    links: [
      { type: "github", href: "https://github.com/validatedev" },
      { type: "x", href: "https://x.com/validatedev" },
      { type: "website", href: "https://mertcandemir.dev" },
    ],
  },
  {
    name: "David Arutyunyan",
    avatar: "/maintainers/waosdx.webp",
    subtitle:
      "Software engineer with a long habit of open-source side projects: dotfiles, parsers, small games, and benchmarks when something needs measuring.",
    links: [
      { type: "github", href: "https://github.com/davidarny" },
      { type: "x", href: "https://x.com/waosdx" },
    ],
  },
];

export function Maintainers() {
  return (
    <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 border-t border-line px-gutter py-[clamp(56px,7vw,88px)]">
      <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[.95]">
        Meet the maintainers.
        <br />
        <span className="text-brand">Keeping it sharp, one provider at a time.</span>
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
        {maintainers.map((m) => (
          <figure key={m.name} className="flex flex-col gap-3.5 border-t-4 border-brand pt-4.5">
            <div className="flex items-center gap-3.5">
              <Image
                src={m.avatar}
                alt={m.name}
                width={52}
                height={52}
                className="size-13 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-[19px] leading-tight font-bold tracking-[-.02em]">{m.name}</h3>
                <div className="flex items-center gap-2.5 text-muted">
                  {m.links.map((link) => {
                    const { icon, label: defaultLabel } = linkMeta[link.type];
                    const label = link.label ?? defaultLabel;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on ${label}`}
                        title={label}
                        className="transition-colors hover:text-brand"
                      >
                        <HugeiconsIcon icon={icon} className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-pretty text-[17px] leading-normal">{m.subtitle}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
