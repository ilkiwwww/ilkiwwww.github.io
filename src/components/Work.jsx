import { WORKS } from "../data/works.js";
import Section from "./ui/Section.jsx";
import SectionLabel from "./ui/SectionLabel.jsx";
import WorkMosaic from "./WorkMosaic.jsx";

// Третя секція «Latest & Greatest» — за Figma (UI-Design, node 40002037:422).
// Перші чотири кейси з `data/works.js` (YouSquared · VetLoop · Moodies · Threadly, ті самі обкладинки, що в Hero),
// мозаїкою (WorkMosaic); у другому ряду після картки — кільце «All works».
// Поява — як у Facts: eyebrow виїжджає, лінія розтягується, картки ряду
// виїжджають по черзі.
export default function Work() {
  return (
    <Section id="work" aria-label="Latest & Greatest">
      <SectionLabel>Latest &amp; Greatest</SectionLabel>

      <WorkMosaic works={WORKS.slice(0, 4)} orbit className="mt-10" />
    </Section>
  );
}
