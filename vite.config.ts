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
        "/mobixCamsClientele": {
          target: "https://pomicroapiuat.lolc.com.pk",
          changeOrigin: true,
          secure: false,
          agent: new http.Agent(),
          rewrite: (path: string) => {
            return path.replace(/^\/mobixCamsClientele/, "/mobixCamsClientele");
          },
          // configure: (proxy, options) => {
          //   proxy.on('proxyReq', (proxyReq, req, res) => {
          //     // Add the 'x-auth-token' header to the request
          //     proxyReq.setHeader('x-auth-token', 'your-auth-token');
          //   });
          // },
        },
      },
      strictPort: true,
      host: true,
      cors: {
        origin: "https://pomicroapiuat.lolc.com.pk",
        // allowedHeaders: ['x-auth-token', 'Content-Type'],
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
      cors: {
        origin: "https://pomicroapiuat.lolc.com.pk",
        // allowedHeaders: ['x-auth-token', 'Content-Type'],
      },
    },
  };
});

// https://pomicroapiuat.lolc.com.pk/mobixCamsLoan/v1/appraisals
//https://pomicroapiuat.lolc.com.pk/mobixCamsCommon/v1/sms/vendors
