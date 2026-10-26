// Єдине джерело для кожної кнопки на сайті. Одна форма (повне скруглення),
// обери variant і size — ніколи не збирай кнопку className-ом.
// Рендерить <a> з `href`, інакше <button>.
//
// Значення з Figma (Hero): таб кейсу — sm, «Book a call» — md.
const VARIANTS = {
  // Суцільна біла на темному фоні — головний CTA («Book a call»).
  light: "border-primary bg-primary font-medium text-black hover:border-secondary hover:bg-secondary",
  // Контурна (друга кнопка системи): таби шапки, фільтри й вторинні дії. Вибрана — біла.
  outline: "border-tertiary bg-transparent font-normal text-primary hover:border-primary",
};

// Головні CTA: курсор-лого над ними «радіє» (ui/Cursor.jsx).
const CTA = new Set(["light"]);

// Зафіксований hover-стан (`active`), напр. вибраний кейс у списку.
const ACTIVE = {
  outline: "border-primary bg-primary font-normal text-black",
};

// Шкала контролів. Висота фіксована, не виводиться з padding.
export const CONTROL_SIZES = {
  sm: "h-9 px-6 text-16",
  md: "h-12 px-6 text-16",
};

export const CONTROL_BASE =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border whitespace-nowrap transition-colors duration-200 outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:border-tertiary disabled:text-secondary";

// Вигляд кнопки як рядок класів — для елементів, що мають виглядати як кнопка,
// але не клікабельні самі (напр., мітка «Next →» на фото, коли клікабельна вся картка).
export const controlClasses = (variant = "light", size = "md", active = false) =>
  `${CONTROL_BASE} ${active && ACTIVE[variant] ? ACTIVE[variant] : VARIANTS[variant]} ${CONTROL_SIZES[size]}`;

export default function Button({
  href,
  variant = "light",
  size = "md",
  active = false,
  className = "",
  children,
  ...props
}) {
  const classes = `${controlClasses(variant, size, active)} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} data-cursor={CTA.has(variant) ? "cta" : undefined} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} data-cursor={CTA.has(variant) ? "cta" : undefined} {...props}>
      {children}
    </button>
  );
}
