# Choices

## 2026-06-30

### Pull in new providers (Copilot, OpenRouter, Z.ai) + label-less hero marks + dedicated card grid

- Synced the web's provider list with the Swift app's current `main` provider set (`../openusage/Sources/OpenUsage/Providers/*`): Antigravity, Claude, Codex, Copilot, Cursor, Devin, Grok, OpenRouter, ZAI. The web previously showed 6; added **Copilot, OpenRouter, Z.ai** (now 9).
- Opinionated default: the user wrote "copilot, openusage, z.ai etc." There is no `openusage` provider in the Swift app (only an `openusage` app-icon mark used in the share card, not a tracked provider). The only provider in Swift `main` not yet on the web besides Copilot + Z.ai is **OpenRouter**, so I interpreted "openusage" as "OpenRouter" and added it. If a different provider was meant, drop it from `lib/plugins.ts`.
- Icons + brand colors sourced from the `tauri-legacy` branch per request (`plugins/<id>/plugin.json` `brandColor` + `plugins/<id>/icon.svg`): Copilot `#A855F7`, Z.ai `#2D2D2D`. OpenRouter is **not** in `tauri-legacy`, so its icon path came from the Swift app's bundled resource `Sources/OpenUsage/Resources/ProviderIcons/openrouter.svg` (single path, `currentColor`) and its brand color set to `#000000` (OpenRouter's mark is monochrome; matches the other near-black marks). Ported all three to `currentColor`-filled React components in `lib/icons.tsx` so `brandColor` tints them like the existing marks (Copilot's source `fill="white"` was switched to `currentColor`).
- Hero (`components/hero-content.tsx`): removed the per-mark name labels — the hero now shows a clean flex-wrap of muted provider marks only (labels live in the dedicated section). Marks carry `aria-label`/`role="img"` for a11y.
- Dedicated section (`components/provider-grid.tsx`): rebuilt as a responsive card grid — `grid-cols-2 sm:grid-cols-3` (9 marks → clean 3×3 from `sm` up, 2-col on phones). Each card: subtle `--page-card` fill + `--page-card-border`, brand-tinted icon (h-9/sm:h-11) in a fixed 14×/16× box, name below. Hover: `-translate-y-0.5` lift + `group-hover:scale-110` icon pop. Added a trailing "More providers on the way — everything in the app is plugin-driven." note. `tsc --noEmit` + `eslint` pass.

## 2026-06-27

### First stable launch: channel-correct CTAs + legacy anchored on the v0.6.28 tag

- Stable channel resolved via GitHub `releases/latest` (guaranteed non-prerelease/non-draft); dropped `getVersion()`/`latest.json` (Tauri-updater-specific, and `releases/latest` is the canonical stable pointer now). Supersedes the 2026-06-25 "stable label from latest.json" note.
- Beta `per_page` 15 → 30 so a stable release never falls off page 1 when many betas ship between stables (there were 16 betas between v0.6.28 and v0.7.0).
- **Legacy anchored on the `v0.6.28` tag, not a `legacy` branch.** The user said the old app lives in a "legacy branch", but none exists in the repo; the `v0.6.28` tag is immutable and reaches the entire Tauri history (507 commits, 47 authors). One `LEGACY_VERSION = "0.6.28"` constant drives both the "Looking for v0.6.28?" download link and the contributor backfill.
- Contributors restored (3 → 45) by merging default-branch `/contributors` (Swift `main`) with Tauri commit-authors. `/contributors` can't target a ref, so legacy authors are counted per-commit from `commits?sha=v0.6.28` (capped at 8 pages = 800 commits; history is ~500). Counts summed per login, bots filtered, sorted desc. Approximate counts are fine — the wall only sorts avatars.
- Optional `GITHUB_TOKEN` in `ghHeaders()` (zero-config if unset): the page now makes ~9 GitHub calls per ISR regeneration (1 stable + 1 beta + 1 contributors + ~6 legacy-commit pages); a token lifts the 60/hr unauthenticated limit if set on Vercel. Still fully unauthenticated by default.
- Bottom Download CTA now mirrors the hero (shared `components/download-buttons.tsx`) — supersedes the 2026-06-25 "scope kept to hero; bottom CTA left at stable" note; the user explicitly asked the bottom CTA to match.
- Button layout per request: two-line buttons with the version as xs mono subtext ("Download Latest" / v0.7.0, "Join the Beta" / v0.7.0-beta.16). Legacy link rendered in both placements (default; trivial to drop from one later).
- Hero badge "Beta {betaVersion} · Free · Open Source" → "macOS 15+ · Free · Open Source": versions now live on the buttons, so the badge surfaces the new system requirement instead. macOS floor bumped 14 → 15 per the user (Swift app's new minimum).

### Unified secondary button + Antigravity provider

- Secondary button root cause: it set `background-color` via inline `style` (`var(--btn-secondary-bg)`) while trying to hover with the `hover:bg-black/5` **class**. Inline styles beat utility classes, so the hover never applied — hence "no hover in the hero". The "View on GitHub" button avoided that by using `hover:brightness-125`, but that washes out the light border (already flagged 2026-06-22), so the two buttons looked different.
- Fix: extracted one `secondaryButtonClass` (`lib/button-styles.ts`) — the white glassy skin with the background in a CLASS (so `hover:` wins) and a uniform `hover:bg-black/5` tint. Removed every inline bg/border/color/blur override and the `hover:brightness-125`. Both the "Join the Beta" button and "View on GitHub" now compose it with their own size/layout classes via `cn()`. Primary (accent) button left as-is — its `hover:brightness-110` works fine on a solid fill and wasn't part of the complaint.
- Chose a shared class over a shadcn `Button` variant: the marketing surface uses its own `--page-*`/`--btn-secondary-*` palette (not shadcn's `--secondary`), and these are `<a>` links with differing padding/layout. A composable skin class is the least-friction "proper" fix.
- Antigravity provider: icon + color taken from the `tauri-legacy` branch of `../openusage` (`plugins/antigravity/{plugin.json,icon.svg}`) per request. Ported the single SVG path to `AntigravityIcon` with `fill="currentColor"` (so `brandColor` tints it like the other marks, instead of the baked `#4285F4`). `brandColor: "#4285F4"` matches `--brand-antigravity` in `globals.css`. Added as the 6th entry in `lib/plugins.ts`.
- `ProviderGrid` grid `grid-cols-5` → `grid-cols-3 sm:grid-cols-6`: six marks plus the long "Antigravity" label don't fit one mobile row, so it's 3×2 on phones and a single row of 6 from `sm` up. The hero (flex-wrap) needed no change.

### Sentry noise filtering for injected scripts

- Production Sentry noise was dominated by two errors from browser-injected scripts (`userscript.html` and `inpage.js`), not app bundle frames. Chose client-side filtering over Sentry issue mutation so future injected-script events are dropped before ingest while historical issues remain auditable.
- Used Sentry's Turbopack application-key filtering with `drop-error-if-exclusively-contains-third-party-frames`, not the broader "contains third-party frames" mode, so mixed app + external stacks are still reported.
- Added a narrow `beforeSend` fallback that drops events only when every stack frame filename is a known injected/extension script. This covers the current `app:///userscript.html` / `app:///inpage.js` issue shape without message-based filtering that could hide a real app error with similar text.
- Disabled Sentry sending when `NODE_ENV !== "production"` because 11 of 13 unresolved issues were localhost development/Turbopack errors. Local development can still be inspected in the browser console without polluting production triage.

## 2026-06-25

### Production domain is www.openusage.ai (NOT openusage.dev)

- `metadataBase`/`siteUrl` was hardcoded to `https://openusage.dev`, which 301s → `openusage.org` → 404. That made every OG/Twitter image + canonical point at a dead host, so social previews broke.
- Live site is on Vercel at apex `openusage.ai`, which 307-redirects to `https://www.openusage.ai/` (www is canonical). Fixed `siteUrl` in `app/layout.tsx` to `https://www.openusage.ai`. Verified prod build emits `og:image`/`twitter:image` = `https://www.openusage.ai/opengraph-image.png`.

### Hero CTAs split into beta + stable; sticky "OpenUsage is changing" banner

- Hero primary "Download for macOS" now points to the latest **pre-release** (beta channel); secondary button replaces "Contribute" with "Download {stableVersion} (stable)" → `releases/latest`.
- Beta link is resolved dynamically, not hardcoded: `getBetaRelease()` in `app/page.tsx` hits the GitHub releases API (`?per_page=15`, `revalidate: 3600` = 1h) and picks the first `prerelease && !draft`. Reason: betas ship ~daily, so a hardcoded `v0.7.0-beta.14` would go stale; 1h cache tracks the daily cadence with no manual edits, and there's no GitHub permalink for "latest pre-release" (`/releases/latest` returns stable only). Fallback when the fetch fails: `betaUrl` → `/releases` page, version label hidden.
- Hero primary label is "Download Latest Beta" (version-agnostic, so the text never goes stale even if cache briefly lags a new beta).
- Stable version label comes from existing `getVersion()` (latest.json → 0.6.27); falls back to literal "0.6.27" if null.
- Hero badge changed from "Free · Open Source · macOS" to "Beta {betaVersion} · Free · Open Source" so the primary button's beta nature is transparent (the explicit "(stable)" secondary already implies primary = newer).
- Announcement: chose a **slim sticky top bar** (`components/announcement-banner.tsx`) over a full section — a section is easy to scroll past; a sticky bar is a persistent, lightweight reminder. Blue (`--page-accent`), **not dismissible** (per request, stays until we change our minds — no X button).
- `globals.css`: `body { overflow-x: hidden }` → `overflow-x: clip`. `hidden` turns body into a scroll container and breaks `position: sticky`; `clip` prevents horizontal overflow without that side effect. Root-cause fix for the sticky bar.
- Scope kept to hero + banner per request; bottom Download CTA + footer left pointing at stable.
- Demo panel footer (`components/panel/panel-footer.tsx`) now shows the beta version: removed the old stable-only filter that stripped pre-releases; `app/page.tsx` passes `panelVersion = beta?.version ?? version` to `MenuBar`/`Panel`. The site previews the upcoming app, so the popover should read the beta (e.g. "OpenUsage 0.7.0-beta.14"), falling back to stable when no beta exists.

### Maintainers section

- New `components/maintainers.tsx` + section wired into `app/page.tsx` between the "Truly Open Source" contributors block and the Download CTA.
- Three maintainers (avatars from `~/Downloads`, converted to WebP at 256×256 q82 via `cwebp`, stored in `public/maintainers/`): `robinebers.webp`, `validatedev.webp`, `waosdx.webp`.
- Icon links use Hugeicons (`@hugeicons/react` + `@hugeicons-pro/core-solid-rounded`). Added the `@hugeicons-pro` registry + `HUGEICONS_TOKEN` auth to `.npmrc` (token shared via Vercel env, mirrors `../robinebershq`). Icons: `GithubIcon`, `NewTwitterIcon` (X), `GlobalIcon` (website).
- Bios ~same length as Robin's paragraph; links icon-only:
  - Robin → user bio; github → x.com/robinebers → robinebers.com (no architectprogram.ai).
  - Mert → bio tied to public GitHub/site: ML job title + macOS menu bar/Homebrew OSS (e.g. BrewServicesManager, Clamper, tap); not generic “production ML pipeline” copy.
  - David → bio tied to public GitHub: software engineer + OSS side projects (dotfiles, lexer4js, games, property-access-bench); not inferred “native apps/systems” unless repos show it.
- Icon-only links carry `aria-label` for a11y. Component is `"use client"` (HugeiconsIcon).

## 2026-06-22

### Light theme + reorder animation (native-app redesign revision)

- Flipped the whole marketing page to a white/light theme (`:root` shadcn tokens + `--page-*` extras in `app/globals.css`). The popover keeps its own `.panel` light theme.
- Source of the leftover green: `components/noise-overlay.tsx` lime glow (`rgba(191,255,0,…)`). Swapped for a faint brand-blue glow + softened paper grain (multiply @ 0.04).
- Kept two intentionally dark elements on the white page: the macOS menu bar (`--bar-bg`, it represents OS chrome) and the API/terminal code block in `components/api-example.tsx` (`#0d0f13`, conventional terminal look so the syntax colors read). Easy to flip if unwanted.
- Animations: removed the menu-bar glyph flip and the popover card bob. Now a deterministic, looping choreography driven by `lib/demo-timeline.ts` (a tiny `useSyncExternalStore` ping-pong over fixed frames F0→F5→F0), so the popover **and** menu bar stay in sync. Switched the FLIP/Web-Animations approach for the `motion` library (`motion/react`): section + metric reorder via `layout`, metric enter/exit via `AnimatePresence` (height/opacity). Beats (one change each so motion reads clearly): F0 default order Codex/Claude/Cursor → F1 Codex↔Claude swap (menu bar swaps too) → F2 Claude Weekly above Session → F3 Codex Weekly above Session → F4 Claude Today/Yesterday/Last30 → Extra usage → F5 Codex Last30 → Extra usage + Rate Limit Resets. `STEP_MS = 2000` (was 1000; user said too fast). Reduced-motion users hold F0.
- Drag affordance: re-added the `GripVertical` handle on section headers (visual only, no `grab` cursor — the demo is non-interactive). Matches the app's 2x3 grip dots.
- Three-dot footer menu: now a static round button (circular `rgba(0,0,0,0.05)` fill, `aria-hidden`, non-interactive) and dropped the footer top-border separator.
- Meter bars slimmed `h-2` → `h-1.5` (closer to the app). Text-only rows tightened `py-[7px]` → `py-[5px]`.
- Claude "Today" given a realistic in-progress burn ($118.90 · 240.3M tokens, ~yesterday's $/token rate) instead of $0.
- Provider showcase (`components/provider-grid.tsx`): dropped card bg/border/hover; icons now tinted with their real `brandColor` (near-black marks read fine on white) and spread full width via `grid-cols-5`. Removed the now-unused `displayColor` helper.
- Menu-bar provider icons enlarged 15px -> 22px.
- Codex: moved "Rate Limit Resets" to the end (after "Last 30 Days").
- Removed visible em/en dashes from copy; kept middot (·) separators (not dashes).
- Removed the popover entrance animation: dropped the panel opacity fade and the layout-driven "slide in" that happened when the panel re-anchored after measurement + web-font swap. New `useLayoutReady()` (in `lib/demo-timeline.ts`) gates motion `layout` until `document.fonts.ready` + a rAF (1200ms fallback), so the popover just appears, then animates only for the choreography.
- Favicon: replaced the old lime `app/icon.svg` with the new app-icon look — brand-blue (`#2b7fff`) rounded square + white `dashboard-3-line` glyph (same mark, recolored). Source of truth: `../openusage/assets/AppIcon.icon` (fill `extended-srgb:0.170,0.496,1.021` ≈ `#2b7fff`, white glyph). Added a subtle vertical gradient to mimic the icon's automatic gradient.
- Removed the popover arrow/notch (the native app has none): deleted the `.tray-arrow` element + its CSS and all arrow-only geometry code (`arrowRight` state, `ARROW_HALF_W`, `panelRef`, the flow-measure branch). The desktop `measure()` now only computes the panel's horizontal `marginRight`. Added an 8px gap (`pt-2` on the panel container) so the popover floats just below the menu bar.

### Hero copy rewrite

- Rewrote the hero H1 + subheadline (`components/hero-content.tsx`) around the ownership / "make it yours" angle. H1: "The Only AI Usage Tracker, Truly Yours" with **"Truly Yours"** highlighted in brand blue (inline `color: var(--page-accent)` span, matching the existing highlight pattern; the parallel unused `.hero-highlight` class mirrors it). Subheadline: "Track every AI coding subscription right in your menu bar. Pick the metrics that matter, arrange them your way, and skip the login. Just launch and make it yours." Dropped "free and open source" from the subcopy since the `Free · Open Source · macOS` badge already covers it. Buttons, badges, meta line, and `app/layout.tsx` title/meta left untouched.
- Kept the copy apostrophe-free (comma variant "..., Truly Yours" instead of "That's Truly Yours") so `react/no-unescaped-entities` (on via eslint-config-next) stays clean. `bunx tsc --noEmit` + `bun run lint` both pass.

### Contribute button hover fix

- Fixed the secondary "Contribute" button hover in `components/hero-content.tsx`. It used `hover:brightness-125`, which applied `filter: brightness(1.25)` to the whole element so the light gray border (`--btn-secondary-border` = `#d9dce1`) washed out toward white and visually disappeared on hover (white bg stayed white). Removed the brightness filter, moved the base white background off inline `style` into a class (`bg-[var(--btn-secondary-bg)]`) so a hover variant can apply, and now tint subtly on hover with `hover:bg-black/5` (same neutral as the MIT badge's `rgba(0,0,0,0.05)`). Border stays inline so it is always visible; `transition-colors` keeps the change deliberate. Label + hero copy unchanged. `bunx tsc --noEmit` + `bun run lint` pass.

### Remove "Two Minutes to Peace of Mind" section

- Deleted the "How It Works" `<section>` from `app/page.tsx` (H2 "Two Minutes to Peace of Mind" + the 3-step Download / Sign In / Automated Updates grid) plus its now-unused `steps` data array. Features ("Never Wonder Again") now flows straight into Open Source ("Read Every Line."). No imports became unused (the steps rendered no icons). `bunx tsc --noEmit` + `bun run lint` both pass.

### Open-source section: rename + "built with AI" + drop tech badges

- Open-source section in `app/page.tsx`: renamed H2 "Read Every Line." → "Truly Open Source", and rewrote the paragraph to "A native macOS app built with Swift and SwiftUI, and fully built with AI. Jump in, fix a bug, or add a provider. Every contribution makes it better for everyone." (adds the "fully built with AI" angle, drops the now-redundant "open source" phrasing, no em/en dashes).
- Removed the four `<Badge variant="outline">` tech pills (Swift, SwiftUI, AppKit, MIT) and their flex wrapper row; the contributors avatar grid now follows the paragraph directly. `Badge` had no other use in the file, so dropped the `import { Badge }` line too. Kept the Download CTA meta line "Requires macOS 14+ · v{version} · MIT License" (not a badge). `bunx tsc --noEmit` + `bun run lint` both pass.

### Open-source section: two-column layout (copy + CTA left, contributors wall right)

- Restructured the "Truly Open Source" card in `app/page.tsx` into two real columns inside the existing `flex flex-col md:flex-row justify-between` container (container, theme tokens, ring/hover, and `&s=64` query all preserved). Left column = heading + paragraph + the "View on GitHub" `TrackedLink` (moved in under the paragraph; bumped `space-y-3` to `space-y-4` and dropped the now-pointless `flex-shrink-0`). Right column = contributors as a "wall".
- The wall replaces the overlapping `-space-x-2` avatar strip with `flex flex-wrap gap-2` (no negative-margin overlap), avatars bumped 32px to 36px, width-constrained via `md:max-w-sm` and right-aligned with `md:justify-end` + `md:items-end` so it wraps into multiple rows on the right. The "{n} contributors" count label sits under the wall. Mobile stacks cleanly: `w-full md:w-auto` plus the `md:` prefixes keep it left-aligned/full-width when stacked below the text+button block. `bunx tsc --noEmit` + `bun run lint` pass; `curl` to localhost:3000 returns 200.

### Fix: Weekly/Session row swap not animating

- Symptom: in the popover demo, equal-height meter rows swapping within a section (Claude/Codex "Weekly" moving above "Session" and back, F1↔F2/F3) jumped instantly, while section reorders and row appear/disappear animated fine.
- Root cause: one `motion.div` per row carried BOTH the enter/exit `height: 0 ↔ "auto"` animation AND `layout="position"`. `height` is a motion "positional key"; animating it to `"auto"` makes motion measure the element by stripping/reapplying its transforms (`DOMKeyframesResolver.measureInitialState/measureEndState`), which collides with the projection transform `layout` uses to animate a reorder. On the same node the size-measurement path wins and the position (reorder) animation never starts. Section reorders worked because those nodes have no height animation (same pattern, clean node).
- Fix (`components/panel/provider-section.tsx`): split the two concerns onto nested nodes — outer keyed `motion.div` owns `layout={layoutReady ? "position" : false}` only (now structurally identical to the working section node in `panel.tsx`); inner `motion.div` owns `initial/animate/exit` height+opacity with `overflow:hidden`. No `LayoutGroup` needed.
- Constraints preserved: enter/exit still height+opacity with no scale squish (inner uses height, not layout scale); whole-section reorder untouched; no entrance-on-load — `AnimatePresence initial={false}` blocks the initial animation for its whole subtree via `PresenceContext.initial === false` (`use-visual-state.mjs`), so the nested inner node also skips its mount animation; `useLayoutReady` gating intact on the outer node. `bunx tsc --noEmit` + `bun run lint` both pass.

### Dynamic OG / social-share image (next/og)

- Added `app/opengraph-image.tsx` + `app/twitter-image.tsx` (Next auto-wires `og:image` / `twitter:image`); shared JSX lives in `app/og-image-content.tsx`. 1200x630 PNG, `runtime = "nodejs"`. There was previously no social-share image at all.
- Design: white bg, brand-blue gradient mark (`#3C86FF`→`#2b7fff`) + white gauge glyph (same path as `app/icon.svg`), "OpenUsage" wordmark, headline "The Only AI Usage Tracker That's Truly Yours" with "Truly Yours" in `#2b7fff`, footer "Free · Open Source · macOS" (middots, no dashes). Ink `#16181c`, muted `#6b7280`, ~80px padding. Satori needs explicit `display:flex` on every multi-child container.
- Font: load Geist Sans `.ttf` (Regular + Bold) from `node_modules/geist/dist/fonts/geist-sans` so the headline renders in true bold matching the site's own typeface — Satori's built-in font is weight-400 only, and the `geist/font` package ships woff2 (which Satori can't read), but static `.ttf` files are present. Read wrapped in try/catch: on failure `console.error` + fall back to the built-in font rather than 500-ing a share endpoint. Deliberate, scoped exception to the "no fallbacks" rule (cosmetic asset, must stay up); this is also why `runtime` must be `nodejs` (uses `node:fs`).
- `app/layout.tsx`: added `metadataBase: new URL("https://openusage.dev")` (additive only; needed so OG image URLs resolve absolutely). Did not touch title/description/openGraph/twitter.
- Verify: `bunx tsc --noEmit` + `bun run lint` pass. `curl /opengraph-image` and `/twitter-image` → `200 image/png`.
- Known stale-cache artifact (NOT from current source): the long-running dev server also serves `/opengraph-image.jpg` (`200 image/jpeg`) and emits a 2nd phantom `og:image` (jpeg) in the homepage head. Source: an `opengraph-image.jpg` that existed before this task (leftover `.next/**/opengraph-image*.jpg` build + dev cache). The PNG is listed first (primary for crawlers); `twitter-image` has no phantom (no prior static twitter jpg) which confirms the cause. Clears on `next build` / dev restart. Left `.next` untouched on purpose — servers are in use by other agents.

## 2026-06-04

### Add Grok + Devin, drop Windsurf

- Synced provider icons/list with `../openusage` plugins: added `grok` + `devin`, removed `windsurf`.
- `grok` brand color `#000000`, `devin` brand color `#000000` (from upstream `plugin.json`). Kept `name: "Grok"` (upstream manifest name) despite the request saying "grok build".
- Panel mockup: removed the non-navigable Copilot/Windsurf/Antigravity sidebar icons; made Grok + Devin navigable providers with mock data (like Codex/Claude/Cursor). Copilot + Antigravity still appear in the landing provider grid (`lib/plugins.ts`), so their icons/CSS vars stay.
- Mock data modeled on each plugin's real lines:
  - Grok: "Credits used" progress + "Pay as you go" cap (plan badge `SuperGrok`).
  - Devin: "Weekly quota" + "Daily quota" progress + "Extra usage balance" (plan badge `Core`).
- Added Grok + Devin to `trayBarData` so the menu-bar tray icon reflects all tracked providers (5 bars).

## 2026-06-22

### Real root cause of "reorder rows don't animate" (Weekly/Session swap)

- Supersedes the 2026-06-?? "split height vs layout onto nested nodes" note above — that hypothesis (height as a positional key) was wrong and that approach was reverted. Rows are back to a single `motion.div` per row inside `AnimatePresence mode="popLayout"`.
- Actual cause: motion bakes the `layout` setting into each element's projection node **once, at mount** (`framer-motion .../use-visual-element.mjs` → `createProjectionNode` reads `props.layout` and sets it on the node). Our `layout={layoutReady}` mounts every row/section/tray icon with `layout: false` (to avoid a slide-in while the popover settles), then flips the prop to `true`. Flipping updates React but NOT the stored projection option — when `MeasureLayout` finally mounts it spreads the stale options back (`{ ...projection.options }`), so `layout` stays `false` forever. Result: position/slide (layout) animations never turn on; only opacity fades (a separate system) work. That's why enter/exit looked fine but pure reorders (Weekly/Session, provider swaps, the menu-bar tray swap) jumped.
- Fix: remount the animated subtrees the moment `layoutReady` flips, so motion rebuilds the projection nodes with `layout` enabled. `components/panel/panel.tsx` keys the sections wrapper `key={layoutReady ? "live" : "init"}` (remounts sections + rows); `components/menu-bar.tsx` uses a compound key `${group.id}-${layoutReady ? "live" : "init"}`. Because the remount happens after the popover has settled, there's still no slide-in on load. `tsc` + `lint` pass.

### Cursor "Auto usage" → meter (bar)

- Was a `text` row with value `"$10.00 used"` (the user flagged it as invalid — Auto usage is a bar like Plan usage). Changed `ROWS.cursor.auto` to `kind: "meter"`, `percent: 45`, `"45% left"`, `"Resets in 8d 9h"` (same reset cycle as Plan). 45% is an opinionated value chosen to read distinctly next to Plan's 67%.
- Updated `stripGroups.cursor` tray value `"$10"` → `"45%"` so the menu-bar tray matches the popover and the other providers' two-percent tray format.

### Footer version: stable-only, never hardcoded/beta (Bugbot)

- `components/panel/panel-footer.tsx` was `OpenUsage {version ?? "0.7.0-beta.11"}` — when `getVersion()` returned `null` it showed a hardcoded beta that may not be the real latest build.
- User rule: footer must never show "beta anything", nothing hardcoded; fallback is a bare "OpenUsage" with no version.
- Fix: `stableVersion = version && !version.includes("-") ? version : null` (semver pre-release = has a hyphen), render `OpenUsage{stableVersion ? \` ${stableVersion}\` : ""}`. So it shows a real *stable* release when one exists, otherwise just "OpenUsage". Right now (latest is `v0.7.0-beta.*`) it renders "OpenUsage". No hardcoded string remains.

### Menu-bar tray reorders in lock-step with the popover (Bugbot)

- `useDemoStripGroups` returned the static `stripGroups[id]`, so tray percentages stayed Session-then-Weekly while the popover swapped Weekly above Session (F2/F3) — the two surfaces contradicted each other mid-animation.
- Fix (`lib/demo-timeline.ts`): derive tray values from the live frame — map `frame.rows[id]` → `ROWS[id][key]`, keep `kind === "meter"`, emit `` `${percent}%` ``. Each provider has exactly two meter rows in every frame, so tray count stays stable at 2 and the order now follows the popover.
- Removed the now-dead `stripGroups` (and its `StripGroup` import) from `lib/mock-data.ts`; `ROWS` (meter `percent`) is the single source of truth for tray + popover. The two stacked tray numbers are positional (`StripValues` keys by index), so the swap is a text update, not a slide — matches the native tray; `tsc` passes.
