// Обгортка кожної секції: фон, бокові gutters і вертикальний ритм.
// Gutters ті самі, що в Hero (24 → 40). Ритм: `top` — перша секція
// сторінки, `default` — решта (Figma: 120 на desktop), `compact` — сторінка Contact (менший відступ від шапки: Figma 210 → 208), `none` — без вертикальних відступів
// (фінальний CTA: сцена впритул до країв).
const RHYTHMS = {
  top: "pt-40 pb-20 md:pt-60 md:pb-30",
  default: "py-20 md:py-30",
  compact: "pt-32 pb-20 md:pt-52 md:pb-30",
  none: "",
};

export default function Section({ as: Component = "section", rhythm = "default", className = "", children, ...props }) {
  return (
    <Component className={`px-6 md:px-10 bg-black ${RHYTHMS[rhythm]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
