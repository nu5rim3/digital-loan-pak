import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as process from "process";
import tailwindcss from "@tailwindcss/vite";
import http from "https";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.VITE_PORT) || 3000,
      proxy: {
        "/mobixCamsClientele": {
          target: "https://pomicroapiuat.lolc.com.pk",
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
          rewrite: (path: string) => {
            return path.replace(/^\/mobixCamsClientele/, "/mobixCamsClientele");
          },
        },
        "/mobixCamsCommon": {
          target: "https://pomicroapiuat.lolc.com.pk",
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
          rewrite: (path: string) => {
            return path.replace(/^\/mobixCamsCommon/, "/mobixCamsCommon");
          },
        },
        "/mobixCamsLoan": {
          target: "https://pomicroapiuat.lolc.com.pk",
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
          rewrite: (path: string) => {
            return path.replace(/^\/mobixCamsLoan/, "/mobixCamsLoan");
          },
        },
        "/mobixCamsCredit": {
          target: "https://pomicroapiuat.lolc.com.pk",
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
          rewrite: (path: string) => {
            return path.replace(/^\/mobixCamsCredit/, "/mobixCamsCredit");
          },
        },
        "/mobixCamsApproval": {
          target: "https://pomicroapiuat.lolc.com.pk",
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
          rewrite: (path: string) => {
            return path.replace(/^\/mobixCamsApproval/, "/mobixCamsApproval");
          },
        },
      },
      strictPort: true,
      host: true,
      cors: {
        origin: "https://pomicroapiuat.lolc.com.pk",
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
      cors: {
        origin: "https://pomicroapiuat.lolc.com.pk",
      },
    },
  };
});
