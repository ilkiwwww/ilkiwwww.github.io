import { CONTROL_SIZES } from "./Button.jsx";
import { ChevronDownIcon } from "./icons.jsx";

// Випадайка-фільтр: нативний <select> (клавіатура й тач працюють самі) у вигляді
// таба (контур `tertiary`), та сама висота, скруглення й вигляд, що в Button.
// Розмір зі спільної шкали контролів (sm · md).
export default function Select({ label, size = "sm", className = "", children, ...props }) {
  return (
    <label className={`relative inline-flex ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        className={`${CONTROL_SIZES[size]} cursor-pointer appearance-none rounded-control border border-tertiary bg-transparent pr-12 font-normal text-primary outline-offset-2 transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary`}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-primary" />
    </label>
  );
}
