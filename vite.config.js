import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Відносні шляхи: збірку можна відкрити з будь-якої адреси (напр., Artifact).
  base: "./",
  plugins: [react(), tailwindcss()],
  // Скануємо лише сайт: окремі HTML-прототипи в корені (fur-logo.html) тягнуть three.js, якого в залежностях уже немає.
  optimizeDeps: { entries: ["index.html"] },
});
