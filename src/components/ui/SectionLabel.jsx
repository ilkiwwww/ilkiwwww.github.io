import Eyebrow from "./Eyebrow.jsx";
import { Grow, InView, Rise } from "./Motion.jsx";

// Підпис секції над сіткою: eyebrow виїжджає, лінія під ним розтягується («Latest & Greatest»,
// «Our team»). Проміжок до вмісту задає сторінка (`mt-10` на вмісті).
export default function SectionLabel({ children }) {
  return (
    <InView className="flex flex-col gap-4">
      <Rise>
        <Eyebrow>{children}</Eyebrow>
      </Rise>
      <Grow delay={0.1} />
    </InView>
  );
}
