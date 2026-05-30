import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        bypass(req) {
          if (
            req.method === "GET" &&
            req.url?.includes("/Usuarios/CambiarPassword")
          ) {
            return "/index.html";
          }
        },
      },
    },
  },
});
