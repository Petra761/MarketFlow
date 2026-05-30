import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // El backend ASP.NET usa el puerto 5173 en launchSettings; el front va en 3000
    port: 3000,
  },
});
