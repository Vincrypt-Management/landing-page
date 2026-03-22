import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const REPO = "Vincrypt-Management/flowfolio";
const STATIC_FALLBACK_VERSION = "v0.2.2";

async function fetchLatestVersion(): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) {
      console.warn(`[build] GitHub API returned ${res.status}, using fallback version ${STATIC_FALLBACK_VERSION}`);
      return STATIC_FALLBACK_VERSION;
    }
    const data = await res.json() as { tag_name?: string };
    return data.tag_name ?? STATIC_FALLBACK_VERSION;
  } catch (err) {
    console.warn(`[build] Could not fetch latest release version:`, err);
    return STATIC_FALLBACK_VERSION;
  }
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const latestVersion = await fetchLatestVersion();
  console.log(`[build] Latest release version: ${latestVersion}`);

  return {
    plugins: [react()],
    root: ".",
    base: "/landing-page/",
    define: {
      __LATEST_RELEASE_VERSION__: JSON.stringify(latestVersion),
    },
    build: {
      outDir: "dist-landing",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
          features: resolve(__dirname, "features.html"),
          releases: resolve(__dirname, "releases.html"),
          privacy: resolve(__dirname, "privacy.html"),
        },
      },
    },
    server: {
      port: 3000,
      open: "/",
    },
  };
});
