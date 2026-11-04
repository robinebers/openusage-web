"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

/** AV1 first (about 40% smaller at the same quality), H.264 as the fallback. 1080p on
 *  wider screens, 720p on phones. Browsers that ignore `media` take the first source
 *  they can play. */
const SOURCES = [
  { src: "/trailer/trailer-1080-av1.mp4", type: 'video/mp4; codecs="av01.0.09M.08, mp4a.40.2"', media: "(min-width: 768px)" },
  { src: "/trailer/trailer-1080-h264.mp4", type: 'video/mp4; codecs="avc1.640032, mp4a.40.2"', media: "(min-width: 768px)" },
  { src: "/trailer/trailer-720-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"' },
  { src: "/trailer/trailer-720-h264.mp4", type: 'video/mp4; codecs="avc1.640020, mp4a.40.2"' },
];

const POSTER_SIZES = "(min-width: 1384px) 1240px, calc(100vw - 40px)";
const posterSet = (ext: string) => `/trailer/poster-960.${ext} 960w, /trailer/poster-1920.${ext} 1920w`;

function TrafficLights() {
  return (
    <div className="flex gap-1.5 md:gap-2">
      <span className="size-2 rounded-full bg-[#FF5F57] md:size-3" />
      <span className="size-2 rounded-full bg-[#FEBC2E] md:size-3" />
      <span className="size-2 rounded-full bg-[#28C840] md:size-3" />
    </div>
  );
}

/** Safari-style toolbar. Decorative, so it's hidden from assistive tech. */
function SafariToolbar() {
  return (
    <div
      aria-hidden
      className="flex h-[34px] items-center gap-3 border-b border-line bg-[#F5F5F7] px-3 text-[#8E8E93] md:relative md:h-[52px] md:justify-between md:px-[18px]"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="flex items-center gap-[22px]">
        <TrafficLights />
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className="max-md:hidden">
          <rect x="1" y="1" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6.5 1v12" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <div className="flex gap-[18px] max-md:hidden">
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M7.5 1.5L2 7l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" opacity="0.5">
            <path d="M1.5 1.5L7 7l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="flex h-[22px] flex-1 items-center justify-center gap-1.5 rounded-[7px] bg-black/[.055] text-[11px] font-medium text-[#3A3A3C] md:absolute md:top-1/2 md:left-1/2 md:h-8 md:w-[min(460px,36%)] md:flex-none md:-translate-1/2 md:rounded-[10px] md:text-[13px]">
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="max-md:hidden">
          <rect x="1" y="5" width="8" height="6.5" rx="1.5" fill="currentColor" />
          <path d="M2.8 5V3.6a2.2 2.2 0 014.4 0V5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        openusage.ai
      </div>
      <div className="w-[34px] md:hidden" />
      <div className="flex items-center gap-5 max-md:hidden">
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
          <path d="M7 1v10M3.5 4.5L7 1l3.5 3.5M2 8v7h10V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <svg width="17" height="15" viewBox="0 0 17 15" fill="none">
          <rect x="1" y="4" width="11" height="10" rx="2.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 1.2h8.3A2.7 2.7 0 0116 3.9V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/** The launch trailer in a Safari window. Poster and play button first; the video
 *  loads nothing until it's played, then plays in place with sound and native controls. */
export function Trailer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // The play button unmounts on start, so hand keyboard focus to the video.
  useEffect(() => {
    if (started) videoRef.current?.focus();
  }, [started]);

  function play() {
    setStarted(true);
    videoRef.current?.play().catch((error) => console.error("Trailer playback failed", error));
    track("hero_trailer_played");
  }

  return (
    <div className="w-full max-w-[1240px] overflow-hidden rounded-[12px] border border-line bg-white shadow-[0_20px_50px_rgba(14,17,24,0.16)] md:rounded-[14px] md:shadow-[0_40px_100px_rgba(14,17,24,0.16),0_8px_24px_rgba(14,17,24,0.06)]">
      <SafariToolbar />
      <div className="relative aspect-video bg-ou-blue">
        <video
          ref={videoRef}
          className="absolute inset-0 size-full"
          preload="none"
          playsInline
          controls={started}
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          aria-label="OpenUsage launch trailer"
        >
          {SOURCES.map((source) => (
            <source key={source.src} {...source} />
          ))}
        </video>
        {/* Stays up until the first frame plays, so there's no blank flash on start. */}
        {!playing && (
          <picture className="pointer-events-none absolute inset-0">
            <source type="image/avif" srcSet={posterSet("avif")} sizes={POSTER_SIZES} />
            <source type="image/webp" srcSet={posterSet("webp")} sizes={POSTER_SIZES} />
            <img
              src="/trailer/poster-1920.jpg"
              srcSet={posterSet("jpg")}
              sizes={POSTER_SIZES}
              alt=""
              width={1920}
              height={1080}
              decoding="async"
              className="size-full object-cover"
            />
          </picture>
        )}
        {!started && (
          <button
            type="button"
            onClick={play}
            aria-label="Play the OpenUsage launch trailer, 27 seconds, with sound"
            className="group absolute inset-0 cursor-pointer focus-visible:outline-none"
          >
            <span className="absolute top-1/2 left-1/2 flex size-14 -translate-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_40px_rgba(14,17,24,0.35)] transition-transform group-hover:scale-105 group-focus-visible:outline-4 group-focus-visible:outline-offset-4 group-focus-visible:outline-white md:size-24">
              <svg viewBox="0 0 17 19" className="ml-[8%] h-[38%] w-[34%]" aria-hidden>
                <path d="M2 1.8v15.4c0 .8.9 1.3 1.6.9l12.6-7.7c.6-.4.6-1.3 0-1.7L3.6.9C2.9.5 2 1 2 1.8z" fill="var(--color-ou-blue-strong)" />
              </svg>
            </span>
            <span className="absolute bottom-2.5 left-2.5 flex h-6 items-center gap-1.5 rounded-full bg-[#0e1118]/75 px-[9px] md:bottom-6 md:left-6 md:h-[34px] md:gap-2 md:px-3.5">
              <span className="size-[5px] rounded-full bg-[#FF453A] md:size-[7px]" />
              <span className="text-[11px] font-semibold text-white md:text-[14px]">Launch trailer</span>
              <span className="font-mono text-[10px] text-white/75 md:text-[13px]">0:27</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
