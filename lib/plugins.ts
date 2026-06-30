import {
  CodexIcon,
  ClaudeIcon,
  CursorIcon,
  DevinIcon,
  GrokIcon,
  AntigravityIcon,
  CopilotIcon,
  OpenRouterIcon,
  ZAIIcon,
} from "./icons";

export interface Plugin {
  id: string;
  name: string;
  brandColor: string;
  Icon: typeof CodexIcon;
}

/**
 * Providers OpenUsage currently tracks, mirroring `../openusage`'s Swift app
 * provider set. `brandColor` mirrors each provider's mark (sourced from the
 * tauri-legacy plugin manifests) and tints the icon on the white page.
 */
export const plugins: Plugin[] = [
  { id: "claude",     name: "Claude",     brandColor: "#DE7356", Icon: ClaudeIcon },
  { id: "codex",      name: "Codex",      brandColor: "#74AA9C", Icon: CodexIcon },
  { id: "cursor",     name: "Cursor",     brandColor: "#000000", Icon: CursorIcon },
  { id: "copilot",    name: "Copilot",    brandColor: "#A855F7", Icon: CopilotIcon },
  { id: "devin",      name: "Devin",      brandColor: "#000000", Icon: DevinIcon },
  { id: "grok",       name: "Grok",       brandColor: "#000000", Icon: GrokIcon },
  { id: "openrouter", name: "OpenRouter", brandColor: "#000000", Icon: OpenRouterIcon },
  { id: "zai",        name: "Z.ai",       brandColor: "#2D2D2D", Icon: ZAIIcon },
  { id: "antigravity", name: "Antigravity", brandColor: "#4285F4", Icon: AntigravityIcon },
];
