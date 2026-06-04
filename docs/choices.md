# Choices

## 2026-06-04

### Add Grok + Devin, drop Windsurf

- Synced provider icons/list with `../openusage` plugins: added `grok` + `devin`, removed `windsurf`.
- `grok` brand color `#000000`, `devin` brand color `#000000` (from upstream `plugin.json`). Kept `name: "Grok"` (upstream manifest name) despite the request saying "grok build".
- Panel mockup: removed the non-navigable Copilot/Windsurf/Antigravity sidebar icons; made Grok + Devin navigable providers with mock data (like Codex/Claude/Cursor). Copilot + Antigravity still appear in the landing provider grid (`lib/plugins.ts`), so their icons/CSS vars stay.
- Mock data modeled on each plugin's real lines:
  - Grok: "Credits used" progress + "Pay as you go" cap (plan badge `SuperGrok`).
  - Devin: "Weekly quota" + "Daily quota" progress + "Extra usage balance" (plan badge `Core`).
- Added Grok + Devin to `trayBarData` so the menu-bar tray icon reflects all tracked providers (5 bars).
