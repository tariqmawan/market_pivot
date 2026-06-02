import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist/client",
    sourcemap: process.env.NODE_ENV !== "production",
    // Bumped because the admin console legitimately needs ~600KB of UI
    // (recharts + 11 CRUD modules). The chunking config below keeps vendor
    // code split out of the page bundles so each route stays small.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/recharts/") || id.includes("d3-")) return "vendor-charts-recharts";
          if (id.includes("/i18next/") || id.includes("/react-i18next/") || id.includes("/i18next-browser-languagedetector/")) return "vendor-i18n";
          if (id.includes("/react-router") || id.includes("/react-router-dom")) return "vendor-router";
          if (id.includes("/zustand/")) return "vendor-state";
          if (id.includes("/lucide-react/")) return "vendor-icons";
          return undefined;
        },
      },
    },
  },
});
