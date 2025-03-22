import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as process from "process"; // ✅ Explicitly import process
import tailwindcss from "@tailwindcss/vite";
import http from "https";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.VITE_PORT) || 3000, // Use VITE_PORT from .env
      proxy: {
        "/pak-digital-loan/oauth2": {
          target: "https://pakauthuat.lolc.com.pk",
          changeOrigin: true,
          secure: true,
          agent: new http.Agent(),
          rewrite: (path) => {
            return path.replace(/^\/pak-digital-loan/, "");
          },
          strictPort: true,
          host: true,
        },
      },
      // base: `/${env.VITE_TENET}-${env.VITE_BASE_URL}/`, // pakoman-digital-loan
    },
  };
});
