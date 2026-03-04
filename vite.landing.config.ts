import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "/landing-page/",
  build: {
    outDir: "dist-landing",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        landing: resolve(__dirname, "landing.html"),
        features: resolve(__dirname, "features.html"),
      },
    },
  },
  server: {
    port: 3000,
    open: "/landing.html",
  },
});
