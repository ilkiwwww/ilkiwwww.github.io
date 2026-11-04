import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App.jsx";
import { WORKS } from "./data/works.js";

// Головна показує екран завантаження (Loader.jsx), коли сайт відкрито «з нуля»: адреса в рядку,
// закладка, посилання ззовні чи перезавантаження. Перехід з іншої сторінки сайту на головну
// (referrer — наш домен) його не повторює. Доки він іде, інтро Hero на паузі.
function firstVisit() {
  const reload = performance.getEntriesByType("navigation")[0]?.type === "reload";
  const internal = document.referrer && new URL(document.referrer).origin === window.location.origin;
  return reload || !internal;
}

const first = firstVisit();
if (first && window.location.pathname === "/" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.dataset.intro = "wait";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Плавний скрол, як на metalab.com. Без нього при reduced motion.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  new Lenis({ autoRaf: true });
}

// Поки користувач на головній, у фоні підтягуємо перше відео першого кейсу (кеш браузера):
// відкриття кейсу не чекає на завантаження файлу.
const warmCaseVideo = () => {
  const src = WORKS[0]?.chapters?.[0]?.media?.[0]?.src;
  if (!src || window.location.pathname.startsWith("/work/")) return;
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
};
(window.requestIdleCallback || ((fn) => setTimeout(fn, 1500)))(warmCaseVideo);
