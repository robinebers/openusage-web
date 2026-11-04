const REPO = "robinebers/openusage";
export const REPO_URL = `https://github.com/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases`;
/** Last release before the Swift rewrite (the old Tauri app). */
const LEGACY_VERSION = "0.6.28";

/** An optional token (set on Vercel) lifts the GitHub rate limit; calls are
 *  unauthenticated otherwise. */
function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface Release {
  version: string;
  url: string;
}

/** Latest stable release. GitHub's `releases/latest` already skips prereleases
 *  and drafts, so it always tracks the stable channel. */
export async function getStableRelease(): Promise<Release | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { tag_name: string; html_url: string };
    return { version: data.tag_name.replace(/^v/, ""), url: data.html_url };
  } catch {
    return null;
  }
}

/** Latest pre-release (beta channel). Betas ship ~daily, so we resolve this at
 *  request time (1h cache) instead of hardcoding a tag that goes stale. */
export async function getBetaRelease(): Promise<Release | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=30`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      tag_name: string;
      html_url: string;
      prerelease: boolean;
      draft: boolean;
    }>;
    const beta = data.find((r) => r.prerelease && !r.draft);
    if (!beta) return null;
    return { version: beta.tag_name.replace(/^v/, ""), url: beta.html_url };
  } catch {
    return null;
  }
}

/** The version the hero's "NEW" pill announces. */
export const NEW_IN_VERSION = "0.8.0";

function isAtLeast(version: string, min: string): boolean {
  const parts = (v: string) => v.split("-")[0].split(".").map(Number);
  const [a, b] = [parts(version), parts(min)];
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return true;
}

/** Where the "NEW" pill links: the stable release once it has shipped, else the
 *  newest pre-release of it, else the releases page. */
export function newInReleaseUrl(stable: Release | null, beta: Release | null): string {
  if (stable && isAtLeast(stable.version, NEW_IN_VERSION)) return `${RELEASES_URL}/tag/v${NEW_IN_VERSION}`;
  if (beta?.version.startsWith(`${NEW_IN_VERSION}-`)) return beta.url;
  return RELEASES_URL;
}

/** Contributors shown on the wall. The Swift rewrite lives on a fresh `main`
 *  history, so the contributors endpoint only sees a handful of people. We merge
 *  in everyone from the pre-Swift (Tauri) history — reachable via the v0.6.28
 *  tag — so long-time contributors don't disappear. */
export async function getContributors(): Promise<Contributor[]> {
  const [current, legacy] = await Promise.all([
    fetchRepoContributors(),
    fetchLegacyContributors(),
  ]);

  const merged = new Map<string, Contributor>();
  for (const c of [...current, ...legacy]) {
    const prev = merged.get(c.login);
    if (prev) prev.contributions += c.contributions;
    else merged.set(c.login, { ...c });
  }

  return [...merged.values()]
    .filter((c) => !c.login.includes("[bot]") && c.login !== "dependabot")
    .sort((a, b) => b.contributions - a.contributions);
}

/** Contributors on the current default branch (the Swift app). */
async function fetchRepoContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contributors?per_page=100`,
      { headers: ghHeaders(), next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    return (await res.json()) as Contributor[];
  } catch {
    return [];
  }
}

/** Authors from the Tauri history, aggregated from commits on the v0.6.28 tag.
 *  The contributors endpoint can't target a ref, so we count commits per author
 *  (capped at a few pages — the Tauri history is ~500 commits). */
async function fetchLegacyContributors(): Promise<Contributor[]> {
  const counts = new Map<string, Contributor>();
  try {
    for (let page = 1; page <= 8; page++) {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/commits?sha=v${LEGACY_VERSION}&per_page=100&page=${page}`,
        { headers: ghHeaders(), next: { revalidate: 86400 } }
      );
      if (!res.ok) break;
      const commits = (await res.json()) as Array<{
        author: { login: string; avatar_url: string; html_url: string } | null;
      }>;
      if (commits.length === 0) break;
      for (const { author } of commits) {
        if (!author?.login) continue;
        const prev = counts.get(author.login);
        if (prev) prev.contributions += 1;
        else
          counts.set(author.login, {
            login: author.login,
            avatar_url: author.avatar_url,
            html_url: author.html_url,
            contributions: 1,
          });
      }
      if (commits.length < 100) break;
    }
  } catch {
    // Return whatever we managed to collect.
  }
  return [...counts.values()];
}
