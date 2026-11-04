"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@vercel/analytics";

/** Pill button that copies a shell command. */
export function CopyCommand({ command, event }: { command: string; event: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    track(event);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy install command: ${command}`}
      className="inline-flex h-12 w-full max-w-[350px] cursor-pointer items-center justify-center gap-2.5 rounded-full border border-line bg-white px-[22px] font-mono text-[13px] text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ou-blue-strong md:h-[58px] md:w-auto md:max-w-none md:text-[14px]"
    >
      <span aria-hidden className="text-subtle">$</span>
      <code>{command}</code>
      {copied ? (
        <Check aria-hidden className="h-3.5 w-3.5 text-ou-blue-strong max-md:hidden" />
      ) : (
        <Copy aria-hidden className="h-3.5 w-3.5 text-subtle max-md:hidden" />
      )}
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
