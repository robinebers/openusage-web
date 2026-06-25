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
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-pretty">
          Meet the Maintainers
        </h2>
        <p
          className="text-balance mx-auto mt-3 max-w-md text-sm lg:text-base"
          style={{ color: "var(--page-fg-muted)" }}
        >
          The people keeping OpenUsage sharp, one provider at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {maintainers.map((m) => (
          <div
            key={m.name}
            className="flex flex-col items-center text-center rounded-2xl p-6"
            style={{
              border: "1px solid var(--page-card-border)",
              backgroundColor: "var(--page-card)",
            }}
          >
            <Image
              src={m.avatar}
              alt={m.name}
              width={80}
              height={80}
              className="rounded-full ring-2 ring-[var(--page-border)]"
            />
            <h3 className="mt-4 text-base font-bold text-pretty">{m.name}</h3>
            <p
              className="mt-1.5 text-sm leading-relaxed text-pretty flex-1"
              style={{ color: "var(--page-fg-muted)" }}
            >
              {m.subtitle}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
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
                    className="transition-colors hover:text-[var(--page-accent)]"
                    style={{ color: "var(--page-fg-subtle)" }}
                  >
                    <HugeiconsIcon icon={icon} className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
