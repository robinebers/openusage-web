import { OpenUsageIcon } from "@/lib/icons";

/** Marker band behind a headline phrase. */
export function Marker({ children }: { children: React.ReactNode }) {
  return <span className="marker text-ink">{children}</span>;
}

/** Blue-tinted emphasis inside running copy. Wraps like normal text. */
export function Tint({ children }: { children: React.ReactNode }) {
  return (
    <span className="box-decoration-clone rounded-[.3em] bg-tint px-[.2em] py-[.04em] font-bold text-brand">
      {children}
    </span>
  );
}

/** The app icon (white mark on the OpenUsage blue squircle) and the wordmark. */
export function AppLogo() {
  return (
    <span className="inline-flex items-center gap-2.5 text-ink">
      <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-[26%] bg-linear-to-b from-[#4A93FF] via-ou-blue to-[#1F6BEB] text-white md:size-[30px]">
        <OpenUsageIcon className="size-[66%]" />
      </span>
      <span className="text-[19px] font-extrabold tracking-[-.03em] md:text-[21px]">OpenUsage</span>
    </span>
  );
}
