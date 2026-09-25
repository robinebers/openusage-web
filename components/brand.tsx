import { GaugeIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <GaugeIcon className="h-[1.15em] w-[1.15em] text-brand" />
      <span className="font-extrabold tracking-[-.03em]">OpenUsage</span>
    </span>
  );
}

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
