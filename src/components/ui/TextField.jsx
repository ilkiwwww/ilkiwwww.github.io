import Text from "./Text.jsx";

// Поле форми (Figma, сторінка Contact): підпис — це сам плейсхолдер великого розміру (`lead`, білий), під ним
// лише нижня лінія `tertiary` (у фокусі й при наведенні світліша), без рамки й скруглення. Однорядкове — висота 56;
// `multiline` — textarea, що росте разом із текстом. `label` стає плейсхолдером і `aria-label`. `hint` — підказка
// чи помилка під полем (колір не міняємо: помилка — біла лінія й текст підказки).
export default function TextField({ label, multiline = false, hint, invalid = false, className = "", ...props }) {
  const look = `w-full border-b bg-transparent text-16 leading-6 text-primary outline-none transition-colors duration-200 placeholder:text-primary hover:border-secondary focus:border-primary md:text-20 md:leading-7 ${invalid ? "border-primary" : "border-tertiary"}`;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {multiline ? (
        <textarea rows={1} placeholder={label} aria-label={label} className={`${look} min-h-14 resize-none py-3 field-sizing-content`} aria-invalid={invalid || undefined} {...props} />
      ) : (
        <input placeholder={label} aria-label={label} className={`${look} h-14`} aria-invalid={invalid || undefined} {...props} />
      )}
      {hint && (
        <Text size="dense" tone={invalid ? "primary" : "secondary"}>
          {hint}
        </Text>
      )}
    </div>
  );
}
