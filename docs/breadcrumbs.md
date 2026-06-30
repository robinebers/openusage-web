# Breadcrumbs

## 2026-06-30

- Synced web provider list with Swift app `main` (9 providers). Added Copilot, OpenRouter, Z.ai to `lib/plugins.ts` + `lib/icons.tsx`. Icons/brand colors from `tauri-legacy` (Copilot, Z.ai) and Swift `ProviderIcons/openrouter.svg` (OpenRouter, not in tauri-legacy). Hero marks are now label-less; `components/provider-grid.tsx` rebuilt as a responsive 2/3-col card grid with hover lift + icon pop. See `docs/choices.md` for the "openusage"→OpenRouter interpretation. `tsc` + `eslint` clean.

## 2026-06-27

### First stable launch: dual-channel CTAs + restored contributors

- Context: v0.7.0 is the first **stable** Swift build; Swift is now default `main`, the old Tauri app is the `v0.6.28` tag (no `legacy` branch exists in the repo).
- `app/page.tsx` data layer rewritten: `getStableRelease()` (GitHub `releases/latest`), `getBetaRelease()` (`per_page=30`), removed `getVersion()`/`latest.json`. Added `ghHeaders()` (optional `GITHUB_TOKEN`).
- Contributors fixed (was 3, now 45): merge default-branch `/contributors` with Tauri authors aggregated from commits on the `v0.6.28` tag (`fetchLegacyContributors()`, ≤8 pages of 100). Bots filtered.
- New `components/download-buttons.tsx` (shared by hero + bottom CTA): blue "Download Latest" → stable, white "Join the Beta" → beta, each with an xs mono version subtext; muted "Looking for v0.6.28?" link → `releases/tag/v0.6.28`.
- `components/announcement-banner.tsx`: copy → "OpenUsage has changed. A brand new version is here. Download now" → `stableUrl` (event `banner_download_clicked`).
- macOS 14+ → **15+** (bottom CTA microcopy + hero badge "macOS 15+ · Free · Open Source").
- Analytics events renamed: `{hero,cta}_download_clicked`, `{hero,cta}_beta_clicked`, `{hero,cta}_legacy_clicked`.
- Verified: lint clean, prod build OK, live dev render shows 45 contributors, v0.7.0 / v0.7.0-beta.16 on the buttons, and the legacy link in both CTAs.

### Secondary button unified + Antigravity added

- New `lib/button-styles.ts` exports `secondaryButtonClass` (white glassy skin, background in a class so `hover:bg-black/5` actually applies). Applied to `download-buttons.tsx` "Join the Beta" and `app/page.tsx` "View on GitHub"; removed all inline bg/border/color/blur overrides + the `hover:brightness-125`. Root cause of the missing hero hover: inline `background-color` beat the hover utility.
- Added `AntigravityIcon` to `lib/icons.tsx` (path from `tauri-legacy:plugins/antigravity/icon.svg`, `fill="currentColor"`), added `{ id: "antigravity", name: "Antigravity", brandColor: "#4285F4" }` to `lib/plugins.ts` (now 6 providers), and made `ProviderGrid` responsive (`grid-cols-3 sm:grid-cols-6`).
- Source of truth: `../openusage` branch `tauri-legacy` (the old Tauri app's web plugins ship SVG icons; the Swift app uses `ProviderIconShape.swift`, not portable to web).
- Verified: lint + build pass; live render shows Antigravity (icon path `M85.2843`, ×2), `hover:bg-black/5` on all secondary buttons, 0 leftover inline secondary-bg overrides, 0 `hover:brightness-125`.
- Demo panel footer version flipped from beta → stable: `panelVersion = stable?.version ?? null` (was `beta?.version ?? stable?.version`). Now the mockup reads "OpenUsage 0.7.0" (verified ×2 — desktop popover + mobile panel). Supersedes the 2026-06-25 "panel shows beta version" choice now that a stable build ships.

- Sentry triage: `OPENUSAGE-WEB-N` (79 events, 1 user) and `OPENUSAGE-WEB-R` (27 events, 2 users) are the only unresolved `vercel-production` issues from the recent project search. Both stacks are exclusively injected browser script frames (`app:///userscript.html` / `app:///inpage.js`) on `https://www.openusage.ai/`.
- The remaining 11 unresolved issues in the same 7d/frequency search are `environment:development` localhost/Turbopack errors, including stale edit-time missing symbols/imports (`Puzzle`, `FlipList`, `stripGroups`, `useRotatingOrder`, `providers`) and a Next dev router initialization error.
- Added Sentry browser filtering in `instrumentation-client.ts`, Sentry Turbopack application-key config in `next.config.ts`, and production-only Sentry sends in client/server/edge config files. Verified with `bunx tsc --noEmit`, `bun run lint`, and `bun run build`.

## 2026-06-25

- Hero now offers two downloads: primary "Download for macOS" → latest GitHub pre-release (beta, resolved dynamically), secondary "Download {version} (stable)" → `releases/latest` (replaced the old "Contribute" button).
- Added sticky blue announcement bar (`components/announcement-banner.tsx`) at top of `app/page.tsx`: "OpenUsage is changing. … Try the beta →", dismissible (session-only).
- `getBetaRelease()` added to `app/page.tsx` (GitHub releases API, finds first non-draft prerelease, 24h revalidate).
- `body` overflow-x switched hidden → clip so the sticky bar pins correctly.
- Verified: lint clean, prod build OK, headless screenshot confirms layout.
