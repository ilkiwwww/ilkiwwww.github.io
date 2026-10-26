// Маленький uppercase-лейбл над заголовком чи збоку від секції.
// Один розмір (16/24), одна вага, один колір (Figma: Inter Medium, білий 60%).
// Дрібні підписи 12/16 — `Text size="dense" weight="medium" uppercase`.
export default function Eyebrow({ as: Component = "p", className = "", children, ...props }) {
  return (
    <Component className={`text-16 leading-6 font-medium uppercase text-secondary ${className}`} {...props}>
      {children}
    </Component>
  );
}
