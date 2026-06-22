import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OpenUsage - the only AI usage tracker that's truly yours";

const accent = "#2b7fff";
const ink = "#16181c";
const muted = "#6b7280";

// Geist is the site's typeface (geist/font/sans). Satori needs raw ttf bytes,
// so read the static files already shipped by the `geist` dependency. If the
// read fails for any reason, log loudly and let ImageResponse fall back to its
// built-in font rather than 500-ing a social-share endpoint.
async function loadFonts() {
  try {
    const dir = join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-sans",
    );
    const [regular, bold] = await Promise.all([
      readFile(join(dir, "Geist-Regular.ttf")),
      readFile(join(dir, "Geist-Bold.ttf")),
    ]);
    return [
      { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Geist", data: bold, weight: 700 as const, style: "normal" as const },
    ];
  } catch (error) {
    console.error("[opengraph-image] failed to load Geist font:", error);
    return [];
  }
}

const glyphPath =
  "M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM15.8329 7.33748C16.0697 7.17128 16.3916 7.19926 16.5962 7.40381C16.8002 7.60784 16.8267 7.92955 16.6587 8.16418C14.479 11.2095 13.2796 12.8417 13.0607 13.0607C12.4749 13.6464 11.5251 13.6464 10.9393 13.0607C10.3536 12.4749 10.3536 11.5251 10.9393 10.9393C11.3126 10.5661 12.9438 9.36549 15.8329 7.33748ZM17.5 11C18.0523 11 18.5 11.4477 18.5 12C18.5 12.5523 18.0523 13 17.5 13C16.9477 13 16.5 12.5523 16.5 12C16.5 11.4477 16.9477 11 17.5 11ZM6.5 11C7.05228 11 7.5 11.4477 7.5 12C7.5 12.5523 7.05228 13 6.5 13C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11ZM8.81802 7.40381C9.20854 7.79433 9.20854 8.4275 8.81802 8.81802C8.4275 9.20854 7.79433 9.20854 7.40381 8.81802C7.01328 8.4275 7.01328 7.79433 7.40381 7.40381C7.79433 7.01328 8.4275 7.01328 8.81802 7.40381ZM12 5.5C12.5523 5.5 13 5.94772 13 6.5C13 7.05228 12.5523 7.5 12 7.5C11.4477 7.5 11 7.05228 11 6.5C11 5.94772 11.4477 5.5 12 5.5Z";

export async function createOgImage() {
  const fonts = await loadFonts();
  const fontFamily = fonts.length > 0 ? "Geist" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          padding: 80,
          fontFamily,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: `linear-gradient(180deg, #3C86FF, ${accent})`,
              marginRight: 28,
            }}
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={glyphPath} fill="#ffffff" />
            </svg>
          </div>
          <div
            style={{ display: "flex", fontSize: 48, fontWeight: 700, color: ink }}
          >
            OpenUsage
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
            }}
          >
            <div style={{ display: "flex", color: ink }}>
              The Only AI Usage Tracker
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ color: ink, marginRight: 20 }}>{"That's"}</span>
              <span style={{ color: accent }}>Truly Yours</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: muted }}>
          Free · Open Source · macOS
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
