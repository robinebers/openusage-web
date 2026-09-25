import {
  CodexIcon,
  ClaudeIcon,
  CursorIcon,
  DevinIcon,
  GrokIcon,
  AntigravityIcon,
  CopilotIcon,
  OllamaIcon,
  OpenCodeIcon,
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
 * Providers OpenUsage currently tracks, in the Swift app's `ProviderCatalog`
 * order. `brandColor` follows the app's `TotalSpendPalette` (light mode);
 * providers missing from it use their near-black mark.
 */
export const plugins: Plugin[] = [
  { id: "claude",      name: "Claude",      brandColor: "#DE7356", Icon: ClaudeIcon },
  { id: "codex",       name: "Codex",       brandColor: "#10A37F", Icon: CodexIcon },
  { id: "cursor",      name: "Cursor",      brandColor: "#13120A", Icon: CursorIcon },
  { id: "antigravity", name: "Antigravity", brandColor: "#4285F4", Icon: AntigravityIcon },
  { id: "copilot",     name: "Copilot",     brandColor: "#A855F7", Icon: CopilotIcon },
  { id: "devin",       name: "Devin",       brandColor: "#000000", Icon: DevinIcon },
  { id: "grok",        name: "Grok",        brandColor: "#000000", Icon: GrokIcon },
  { id: "ollama",      name: "Ollama",      brandColor: "#000000", Icon: OllamaIcon },
  { id: "opencode",    name: "OpenCode",    brandColor: "#6E6E73", Icon: OpenCodeIcon },
  { id: "openrouter",  name: "OpenRouter",  brandColor: "#6467F2", Icon: OpenRouterIcon },
  { id: "zai",         name: "Z.ai",        brandColor: "#2D2D2D", Icon: ZAIIcon },
];
