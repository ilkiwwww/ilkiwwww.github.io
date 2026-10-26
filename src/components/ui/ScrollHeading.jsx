import Heading from "./Heading.jsx";
import { ScrollFill } from "./Motion.jsx";

// Заголовок секції, що заповнюється білим за скролом (Heading + ScrollFill в одному місці).
// Усі заголовки секцій сайту — він: `lines` — рядки, `level` — рівень Heading
// (statement за замовчуванням), `breakAlways`/`end` — як у ScrollFill.
export default function ScrollHeading({ lines, level = "statement", tone = "primary", breakAlways, end, ...props }) {
  return (
    <Heading level={level} tone={tone} {...props}>
      <ScrollFill lines={lines} breakAlways={breakAlways} end={end} />
    </Heading>
  );
}
