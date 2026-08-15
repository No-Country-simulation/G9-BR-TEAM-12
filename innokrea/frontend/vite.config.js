import { defineConfig } from "vite";
import react from "./node_modules/@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {},
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
  },
});