import {
  CodexIcon,
  ClaudeIcon,
  CursorIcon,
  CopilotIcon,
  DevinIcon,
  GrokIcon,
  AntigravityIcon,
  AmpIcon,
  KimiIcon,
  GeminiIcon,
  JetBrainsAiAssistantIcon,
  KiroIcon,
  MiniMaxIcon,
  FactoryIcon,
  PerplexityIcon,
  SyntheticIcon,
  ZaiIcon,
  OpenCodeGoIcon,
} from "./icons";

export interface Plugin {
  id: string;
  name: string;
  brandColor: string;
  Icon: typeof CodexIcon;
  /** Shown by name in the hero icon row */
  featured: boolean;
}

/**
 * brandColor from each `../openusage/plugins/<id>/plugin.json` (same keys as `id`).
 * Factory has no upstream manifest yet; keep in sync with `--brand-factory` in `app/globals.css`.
 */
const PLUGIN_MANIFEST_BRAND = {
  codex: "#74AA9C",
  claude: "#DE7356",
  cursor: "#000000",
  copilot: "#A855F7",
  antigravity: "#4285F4",
  amp: "#F34E3F",
  devin: "#000000",
  factory: "#020202",
  gemini: "#4285F4",
  grok: "#000000",
  "jetbrains-ai-assistant": "#7d5fe6",
  kiro: "#C09CFF",
  kimi: "#000000",
  minimax: "#F5433C",
  "opencode-go": "#000000",
  perplexity: "#20808D",
  synthetic: "#000000",
  zai: "#2D2D2D",
} as const satisfies Record<string, string>;

export const plugins: Plugin[] = [
  { id: "codex",       name: "Codex",       brandColor: PLUGIN_MANIFEST_BRAND.codex, Icon: CodexIcon,       featured: true },
  { id: "claude",      name: "Claude",      brandColor: PLUGIN_MANIFEST_BRAND.claude, Icon: ClaudeIcon,      featured: true },
  { id: "cursor",      name: "Cursor",      brandColor: PLUGIN_MANIFEST_BRAND.cursor, Icon: CursorIcon,      featured: true },
  { id: "copilot",     name: "Copilot",     brandColor: PLUGIN_MANIFEST_BRAND.copilot, Icon: CopilotIcon,     featured: false },
  { id: "antigravity", name: "Antigravity", brandColor: PLUGIN_MANIFEST_BRAND.antigravity, Icon: AntigravityIcon, featured: false },
  { id: "amp",         name: "Amp",         brandColor: PLUGIN_MANIFEST_BRAND.amp, Icon: AmpIcon,         featured: false },
  { id: "devin",       name: "Devin",       brandColor: PLUGIN_MANIFEST_BRAND.devin, Icon: DevinIcon,       featured: false },
  { id: "factory",     name: "Factory",     brandColor: PLUGIN_MANIFEST_BRAND.factory, Icon: FactoryIcon,     featured: false },
  { id: "gemini",      name: "Gemini",      brandColor: PLUGIN_MANIFEST_BRAND.gemini, Icon: GeminiIcon,      featured: false },
  { id: "grok",        name: "Grok",        brandColor: PLUGIN_MANIFEST_BRAND.grok, Icon: GrokIcon,        featured: false },
  { id: "jetbrains-ai-assistant", name: "JetBrains AI Assistant", brandColor: PLUGIN_MANIFEST_BRAND["jetbrains-ai-assistant"], Icon: JetBrainsAiAssistantIcon, featured: false },
  { id: "kiro",        name: "Kiro",        brandColor: PLUGIN_MANIFEST_BRAND.kiro, Icon: KiroIcon,        featured: false },
  { id: "kimi",        name: "Kimi",        brandColor: PLUGIN_MANIFEST_BRAND.kimi, Icon: KimiIcon,        featured: false },
  { id: "minimax",     name: "MiniMax",     brandColor: PLUGIN_MANIFEST_BRAND.minimax, Icon: MiniMaxIcon,     featured: false },
  { id: "opencode-go", name: "OpenCode Go", brandColor: PLUGIN_MANIFEST_BRAND["opencode-go"], Icon: OpenCodeGoIcon,  featured: false },
  { id: "perplexity",  name: "Perplexity",  brandColor: PLUGIN_MANIFEST_BRAND.perplexity, Icon: PerplexityIcon,  featured: false },
  { id: "synthetic",   name: "Synthetic",   brandColor: PLUGIN_MANIFEST_BRAND.synthetic, Icon: SyntheticIcon,   featured: false },
  { id: "zai",         name: "Z.ai",        brandColor: PLUGIN_MANIFEST_BRAND.zai, Icon: ZaiIcon,         featured: false },
];

/**
 * Returns white for very dark brand colors (so they're visible on the dark page).
 * Used by the provider grid and footer — NOT the light panel sidebar.
 */
export function displayColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r + g + b) / 3 < 50 ? "#ffffff" : hex;
}
