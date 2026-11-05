# openusage-web

The website for [OpenUsage](https://github.com/robinebers/openusage), a free, open-source macOS
menu-bar app that tracks the usage limits of your AI coding plans. Live at
[openusage.ai](https://www.openusage.ai).

It's a single-page Next.js app. The app itself, its docs, and its releases live in
[robinebers/openusage](https://github.com/robinebers/openusage).

## Run locally

Installing needs `HUGEICONS_TOKEN` in your environment for the `@hugeicons-pro` packages (see
`.npmrc`).

```sh
bun install
bun dev        # http://localhost:3000
```

## Check and build

```sh
bunx tsc --noEmit
bun run lint
bun run build
bun run start  # serve the production build
```

`GITHUB_TOKEN` is optional. It lifts GitHub's rate limit on the release and contributor lookups.

## Deploy

Vercel builds a preview for every pull request and deploys `main` to production.

## Where things live

- `app/page.tsx`: page sections and feature copy
- `app/layout.tsx`: title, descriptions, and structured data
- `lib/plugins.ts`: the provider list, in the app's order, with display names and marks
- `app/opengraph-image.png` and `app/twitter-image.png`: static share images, so their text
  doesn't update with the page
