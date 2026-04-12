import type { CSSProperties } from "react";

import { plugins } from "@/lib/plugins";

const splitIndex = Math.ceil(plugins.length / 2);
const row1 = plugins.slice(0, splitIndex);
const row2 = plugins.slice(splitIndex);

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r + g + b) / 3 < 50;
}

function MarqueeRow({
  items,
  variant,
  reversed,
}: {
  items: typeof plugins;
  variant: 1 | 2;
  reversed: boolean;
}) {
  const doubled = reversed ? [...items, ...items].reverse() : [...items, ...items];

  return (
    <div
      className={`marquee-track flex gap-4 py-2 ${variant === 1 ? "marquee-track--slow" : ""}`}
    >
      {doubled.map(({ id, name, brandColor, Icon }, i) => {
        const dark = isDark(brandColor);
        const iconWell = dark ? "rgba(255,255,255,0.12)" : `${brandColor}20`;
        const iconColor = dark ? "#ffffff" : brandColor;
        const bgMix = variant === 1 ? "22%, transparent" : "18%, transparent";
        const whiteMix = variant === 1 ? "0.03" : "0.02";
        const insetMix = variant === 1 ? "35%" : "28%";

        return (
          <div
            key={`${id}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.1] px-4 py-2.5 shadow-sm backdrop-blur-sm"
            style={
              {
                background: `linear-gradient(135deg, color-mix(in oklab, ${brandColor} ${bgMix}), rgba(255,255,255,${whiteMix}))`,
                boxShadow: `inset 0 1px 0 color-mix(in oklab, ${brandColor} ${insetMix}, transparent)`,
              } as CSSProperties
            }
          >
            <div
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: iconWell }}
            >
              <Icon className="h-4 w-4 shrink-0" style={{ color: iconColor }} />
            </div>
            <div className="min-w-0 truncate text-base font-semibold tracking-tight text-zinc-100 lg:text-lg">
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProviderGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="text-center mb-8">
        <h2
          className="text-pretty text-3xl lg:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-geist-pixel-circle)" }}
        >
          Works with Your Tools
        </h2>
        <p
          className="text-pretty mt-3 text-sm lg:text-base max-w-md mx-auto"
          style={{ color: "var(--page-fg-muted)" }}
        >
          Every provider is a plugin. Add what you use, ignore what you
          don&apos;t.
        </p>
      </div>

      <div className="marquee-fade py-2">
        <MarqueeRow items={row1} variant={1} reversed={false} />
        <div className="marquee-row-2 -mt-1">
          <MarqueeRow items={row2} variant={2} reversed />
        </div>
      </div>
    </section>
  );
}
