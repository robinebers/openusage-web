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

      <ul
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {plugins.map(({ id, name, brandColor, Icon }) => (
          <li
            key={id}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-7 text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{
              border: "1px solid var(--page-card-border)",
              backgroundColor: "var(--page-card)",
            }}
          >
            <span className="flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
              <Icon
                className="h-9 w-9 sm:h-11 sm:w-11 transition-transform duration-200 group-hover:scale-110"
                style={{ color: brandColor }}
              />
            </span>
            <span
              className="text-sm font-semibold tracking-tight sm:text-base"
              style={{ color: "var(--page-fg)" }}
            >
              {name}
            </span>
          </li>
        ))}
      </ul>

      <p
        className="mt-8 text-center text-xs sm:text-sm text-balance"
        style={{ color: "var(--page-fg-subtle)" }}
      >
        More providers on the way &mdash; everything in the app is plugin-driven.
      </p>
    </section>
  );
}
