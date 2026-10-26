import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Плавний скрол, як на metalab.com. Без нього при reduced motion.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  new Lenis({ autoRaf: true });
}
