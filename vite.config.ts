import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as process from "process"; // ✅ Explicitly import process
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 3000, // Use VITE_PORT from .env
    },
    base: `/${env.VITE_TENET}-${env.VITE_BASE_URL}/`, // pakoman-digital-loan
    alias: {
      "@": path.resolve(__dirname, "src"), // Set alias for `src` folder
    },
  };
});
