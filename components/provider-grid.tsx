import type { CSSProperties } from "react";

import { plugins, displayColor } from "@/lib/plugins";

const splitIndex = Math.ceil(plugins.length / 2);
const row1 = plugins.slice(0, splitIndex);
const row2 = plugins.slice(splitIndex);
const darkBrandColors = new Set(["#000000", "#020202", "#111111", "#2D2D2D"]);

function getChipStyles(brandColor: string): {
  color: string;
  iconBackground: string;
  borderColor: string;
} {
  const color = displayColor(brandColor);

  return {
    color,
    iconBackground: darkBrandColors.has(brandColor)
      ? "rgba(255, 255, 255, 0.12)"
      : `${brandColor}20`,
    borderColor: `${color}24`,
  };
}

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: typeof plugins;
  direction: "left" | "right";
  duration: number;
}) {
  return (
    <div className="marquee-fade">
      <div
        className={`marquee-track marquee-track--${direction}`}
        style={{ animationDuration: `${duration}s` } as CSSProperties}
      >
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="marquee-group flex shrink-0 gap-4"
            aria-hidden={copyIndex === 1}
          >
            {items.map(({ id, name, brandColor, Icon }) => {
              const chip = getChipStyles(brandColor);

              return (
                <div
                  key={`${id}-${copyIndex}`}
                  className="flex items-center gap-3 pl-2.5 pr-5 py-2 rounded-full shrink-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(24, 24, 24, 0.9), rgba(12, 12, 12, 0.88))",
                    border: `1px solid ${chip.borderColor}`,
                    boxShadow:
                      "inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: chip.iconBackground }}
                  >
                    <Icon className="w-4 h-4" style={{ color: chip.color }} />
                  </div>
                  <span
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: chip.color }}
                  >
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProviderGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="text-center mb-14">
        <h2
          className="text-3xl lg:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-geist-pixel-circle)" }}
        >
          Works with Your Tools
        </h2>
        <p
          className="mt-3 text-sm lg:text-base max-w-md mx-auto"
          style={{ color: "var(--page-fg-muted)" }}
        >
          Every provider is a plugin. Add what you use, ignore what you
          don&apos;t.
        </p>
      </div>

      <div className="space-y-4">
        <MarqueeRow items={row1} direction="left" duration={30} />
        <MarqueeRow items={row2} direction="right" duration={34} />
      </div>
    </section>
  );
}
