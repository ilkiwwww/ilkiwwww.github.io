import { CONTROL_BASE } from "./Button.jsx";

// Кнопка, де весь лейбл — іконка. Один розмір (48×48, висота `md`) і один вигляд:
// без заливки, на hover — `fill`. Те саме скруглення (`radius-control`), що в Button.
const LOOK = "h-12 w-12 border-transparent text-primary hover:bg-fill disabled:border-transparent";

export default function IconButton({ href, label, className = "", children, ...props }) {
  const classes = `${CONTROL_BASE} ${LOOK} ${className}`;

  if (href) {
    return (
      <a href={href} aria-label={label} title={label} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} className={classes} {...props}>
      {children}
    </button>
  );
}
