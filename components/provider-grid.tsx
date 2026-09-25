import { ArrowUpRight } from "lucide-react";
import { plugins } from "@/lib/plugins";

const ADD_PROVIDER_URL =
  "https://github.com/robinebers/openusage/blob/main/docs/adding-a-provider.md";

const cell = "flex flex-col items-center justify-center gap-3 px-4 py-8 text-center";

export function ProviderGrid() {
  return (
    <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 border-t border-line px-gutter py-[clamp(56px,7vw,88px)]">
      <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[.95]">
        Built for your AI coding stack.
        <br />
        <span className="text-brand">{plugins.length} providers, one menu bar.</span>
      </h2>

      {/* Hairlines are the `bg-line` showing through the 1px gaps. */}
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
        {plugins.map(({ id, name, brandColor, Icon }) => (
          <li key={id} className={`${cell} bg-white`}>
            <Icon className="h-10 w-10" style={{ color: brandColor }} />
            <span className="text-[17px] font-bold tracking-[-.02em]">{name}</span>
          </li>
        ))}
        <li className={`${cell} bg-tint`}>
          <a
            href={ADD_PROVIDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 text-brand"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-colors group-hover:bg-brand-deep">
              <ArrowUpRight className="h-5 w-5" />
            </span>
            <span className="text-[17px] font-bold tracking-[-.02em]">Add yours</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
