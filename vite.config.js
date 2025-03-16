import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.coingecko.com/api/v3",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        headers: {
          "x-cg-pro-api-key": 'CG-1zTCFE7wNHKRQbJMCPLkwyBY',  // ✅ Correct key placement
        },
      },
    },
  },
});
