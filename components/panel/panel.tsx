"use client";

import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { LayoutGroup, motion } from "motion/react";
import { useDemoSections, useLayoutReady } from "@/lib/demo-timeline";
import { ProviderSection } from "./provider-section";
import { PanelFooter } from "./panel-footer";

const SECTION_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

const PANEL_W = 320;

interface PanelProps {
  version: string | null;
  /** Which tray element to anchor the panel to (defaults to "tray-icon"). */
  trayIconId?: string;
  /** "absolute" (default) = desktop overlay; "flow" = inline in document flow. */
  placement?: "absolute" | "flow";
}

export function Panel({ version, trayIconId = "tray-icon", placement = "absolute" }: PanelProps) {
  const [panelRight, setPanelRight] = useState<number | null>(null);

  const isFlow = placement === "flow";

  const measure = useCallback(() => {
    if (isFlow) return; // inline (mobile): sits in document flow, no positioning

    const tray = document.getElementById(trayIconId);
    if (!tray) return;

    const trayRect = tray.getBoundingClientRect();
    const trayCenterX = trayRect.left + trayRect.width / 2;

    const MIN_RIGHT_PAD = 12;
    const viewportW = window.innerWidth;

    const idealRight = viewportW - trayCenterX - PANEL_W / 2;
    const clampedRight = Math.max(MIN_RIGHT_PAD, idealRight);
    setPanelRight(clampedRight);
  }, [trayIconId, isFlow]);

  useLayoutEffect(() => {
    // Measure DOM geometry and position the panel before paint, so it never
    // flashes at the wrong spot. setState-in-layout-effect is the intended
    // pattern here (we're syncing React to a measured layout, not a render loop).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measure();
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }, [measure]);

  useEffect(() => {
    document.fonts.ready.then(measure);

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 80);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  const sections = useDemoSections();
  const layoutReady = useLayoutReady();

  const widthClass = isFlow ? "w-full max-w-[320px]" : "w-[320px]";
  const measured = isFlow ? true : panelRight != null;

  return (
    <div
      className={`panel flex flex-col items-end pt-2${isFlow ? " w-full max-w-[320px]" : ""}`}
      style={{
        ...(isFlow ? {} : { marginRight: panelRight ?? 16 }),
        opacity: measured ? 1 : 0,
      }}
    >
      {/* Popover container — mirrors the native app */}
      <div
        className={`panel-box rounded-2xl overflow-hidden ${widthClass} bg-card border border-border`}
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
                `layoutReady` remounts the rows/sections once the popover has
                settled, giving them fresh projection nodes with layout enabled.
                That's what makes reorders (Weekly/Session, provider swaps)
                actually slide instead of jump, while still avoiding a slide-in
                on load. */}
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
