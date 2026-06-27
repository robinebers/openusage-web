import {
  CodexIcon,
  ClaudeIcon,
  CursorIcon,
  DevinIcon,
  GrokIcon,
  AntigravityIcon,
} from "./icons";

export interface Plugin {
  id: string;
  name: string;
  brandColor: string;
  Icon: typeof CodexIcon;
}

/**
 * The five providers OpenUsage currently tracks. `brandColor` mirrors each
 * `../openusage` provider mark and is used directly to tint the icon on the
 * white page (near-black marks read fine on white).
 */
export const plugins: Plugin[] = [
  { id: "claude", name: "Claude", brandColor: "#DE7356", Icon: ClaudeIcon },
  { id: "codex",  name: "Codex",  brandColor: "#74AA9C", Icon: CodexIcon },
  { id: "cursor", name: "Cursor", brandColor: "#000000", Icon: CursorIcon },
  { id: "devin",  name: "Devin",  brandColor: "#000000", Icon: DevinIcon },
  { id: "grok",   name: "Grok",   brandColor: "#000000", Icon: GrokIcon },
  { id: "antigravity", name: "Antigravity", brandColor: "#4285F4", Icon: AntigravityIcon },
];
