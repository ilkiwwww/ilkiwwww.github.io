// Кожен заголовок на сайті — один із цих рівнів. Розмір обирається роллю,
// не числом. Адаптив зашитий у рівень; line-height кратний 4.
//
//   display   h1 Work і фінальний CTA — Instrument Sans Medium 56 → 96 → 128 → 140/132 (Figma)
//   hero      заголовок першого екрана — Instrument Sans Medium 40 → 64 → 74/72 від lg (Figma 74.4/70, line-height до сітки 4)
//   statement теза секції, великі цифри, заголовок кейсу — Instrument Sans Medium 40 → 64/64,
//             рядок обрізаний до висоти великих літер (text-box, як у Figma)
//   cell      заголовок у клітинці сітки (Meet our team) — 40 → 64 → 92/72 від xl, text-box як у statement
// Один розмір шрифту — один рівень; усі розміри кратні 4.
const SCALES = {
  hero: "font-display font-medium text-40 leading-12 md:text-64 md:leading-16 lg:text-74 lg:leading-18",
  statement: "font-display font-medium text-40 leading-12 md:text-64 md:leading-16 [text-box:trim-both_cap_alphabetic]",
  cell: "font-display font-medium text-40 leading-12 md:text-64 md:leading-16 xl:text-92 xl:leading-18 [text-box:trim-both_cap_alphabetic]",
  display: "font-display font-medium text-56 leading-14 md:text-96 md:leading-23 lg:text-128 lg:leading-30 xl:text-140 xl:leading-33",
};

const ELEMENTS = {
  hero: "h1",
  statement: "h2",
  cell: "h2",
  display: "h2",
};

const TONES = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export default function Heading({ level = "statement", as, tone = "primary", className = "", children, ...props }) {
  const Component = as || ELEMENTS[level];
  return (
    <Component className={`${SCALES[level]} ${TONES[tone]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
