"use client";

import { LayoutGroup, motion } from "motion/react";
import { useDemoSections, useLayoutReady } from "@/lib/demo-timeline";
import { ProviderSection } from "./provider-section";
import { PanelFooter } from "./panel-footer";

const SECTION_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

interface PanelProps {
  version: string | null;
  /** "absolute" (default) = desktop overlay (fixed 320px, positioned by the
   *  tray icon via CSS); "flow" = inline mobile (fluid up to 320px). */
  placement?: "absolute" | "flow";
}

/**
 * The popover content only — it carries no positioning. Desktop anchors it
 * under the tray icon with pure CSS (see menu-bar.tsx) and mobile drops it in
 * document flow, so it renders visible in the server HTML and never waits on
 * client-side JS/measurement to appear.
 */
export function Panel({ version, placement = "absolute" }: PanelProps) {
  const sections = useDemoSections();
  const layoutReady = useLayoutReady();

  const widthClass = placement === "flow" ? "w-full max-w-[320px]" : "w-[320px]";

  return (
    <div className={`panel ${widthClass} text-foreground`}>
      {/* Popover container — mirrors the native app */}
      <div
        className="panel-box w-full overflow-hidden rounded-2xl border border-border bg-card"
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          boxShadow:
            "0 16px 40px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div className="flex flex-col px-3.5 pt-3.5 pb-0">
          <LayoutGroup>
            {/* motion locks in the `layout` setting when each element first
                mounts (it's stored on an internal projection node), so flipping
                `layout` false→true later updates React but NOT that stored
                setting — slides stay off forever. Keying this wrapper on
                `layoutReady` remounts the rows/sections once fonts have settled,
                giving them fresh projection nodes with layout enabled. That's
                what makes reorders (Weekly/Session, provider swaps) actually
                slide instead of jump, while still avoiding a slide-in on load. */}
            <div key={layoutReady ? "live" : "init"} className="flex flex-col gap-3.5">
              {sections.map((provider) => (
                <motion.div
                  key={provider.id}
                  layout={layoutReady ? "position" : false}
                  transition={SECTION_TRANSITION}
                >
                  <ProviderSection provider={provider} />
                </motion.div>
              ))}
            </div>
          </LayoutGroup>
          <PanelFooter version={version} />
        </div>
      </div>
    </div>
  );
}
