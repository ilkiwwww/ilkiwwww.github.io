// Текст. Шість розмірів за роллю, два тони.
//
//   quote  цитата у відгуку — Inter Regular 28 (з Figma)
//   hero   цитата на першому екрані — 14/24 на мобільному, від md 16/24 (Figma)
//   card   назва кейсу в картці — 20/28 на всіх екранах (lead на мобільному 16)
//   lead   речення, що несе hero чи CTA
//   body   дефолт
//   dense  підписи, підказки, legal — 12/16
const SIZES = {
  quote: "text-20 leading-7 md:text-28 md:leading-9",
  hero: "text-14 leading-6 md:text-16 md:leading-6",
  card: "text-20 leading-7",
  lead: "text-16 leading-6 md:text-20 md:leading-7",
  body: "text-16 leading-6",
  dense: "text-12 leading-4",
};

// `uppercase` — великі літери (малі підписи, legal).
// Вага: за замовчуванням Regular; `medium` — підписи й посилання (Figma: футер, Inter Medium 20).
const WEIGHTS = {
  regular: "",
  medium: "font-medium",
};

const TONES = {
  primary: "text-primary",
  secondary: "text-secondary",
};

export default function Text({ as: Component = "p", size = "body", tone = "primary", weight = "regular", uppercase = false, className = "", children, ...props }) {
  return (
    <Component className={`${SIZES[size]} ${WEIGHTS[weight]} ${TONES[tone]} ${uppercase ? "uppercase" : ""} ${className}`} {...props}>
      {children}
    </Component>
  );
}
