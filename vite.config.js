import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Відносні шляхи: збірку можна відкрити з будь-якої адреси (напр., Artifact).
  base: "./",
  plugins: [react(), tailwindcss()],
});
