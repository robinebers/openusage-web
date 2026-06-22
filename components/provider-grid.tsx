import { plugins } from "@/lib/plugins";

export function ProviderGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-12 lg:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight lg:text-4xl">
          Built for Your AI Coding Stack
        </h2>
        <p
          className="text-balance mx-auto mt-3 max-w-md text-sm lg:text-base"
          style={{ color: "var(--page-fg-muted)" }}
        >
          Track the subscriptions you actually pay for, all in one menu bar.
        </p>
      </div>

      <div className="grid grid-cols-5 items-start gap-3 sm:gap-8">
        {plugins.map(({ id, name, brandColor, Icon }) => (
          <div key={id} className="flex flex-col items-center gap-3">
            <Icon
              className="h-10 w-10 sm:h-14 sm:w-14"
              style={{ color: brandColor }}
            />
            <div
              className="text-xs font-semibold tracking-tight sm:text-base"
              style={{ color: "var(--page-fg)" }}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
