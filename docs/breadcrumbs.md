# Breadcrumbs

## 2026-06-25

- Hero now offers two downloads: primary "Download for macOS" → latest GitHub pre-release (beta, resolved dynamically), secondary "Download {version} (stable)" → `releases/latest` (replaced the old "Contribute" button).
- Added sticky blue announcement bar (`components/announcement-banner.tsx`) at top of `app/page.tsx`: "OpenUsage is changing. … Try the beta →", dismissible (session-only).
- `getBetaRelease()` added to `app/page.tsx` (GitHub releases API, finds first non-draft prerelease, 24h revalidate).
- `body` overflow-x switched hidden → clip so the sticky bar pins correctly.
- Verified: lint clean, prod build OK, headless screenshot confirms layout.
