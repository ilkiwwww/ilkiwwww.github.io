// Маленький uppercase-лейбл над заголовком чи збоку від секції.
// Один розмір (14/24 на мобільному, від md 16/24), одна вага, один колір (Figma: Inter Medium, білий 60%).
// Дрібні підписи 12/16 — `Text size="dense" weight="medium" uppercase`.
export default function Eyebrow({ as: Component = "p", className = "", children, ...props }) {
  return (
    <Component className={`text-14 leading-6 font-medium md:text-16 uppercase text-secondary ${className}`} {...props}>
      {children}
    </Component>
  );
}
