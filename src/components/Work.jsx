import { WORKS } from "../data/works.js";
import Section from "./ui/Section.jsx";
import SectionLabel from "./ui/SectionLabel.jsx";
import WorkMosaic from "./WorkMosaic.jsx";

// Третя секція «Latest & Greatest» — за Figma (UI-Design, node 40002037:422).
// Мозаїка перших шести робіт (WorkMosaic), у другому ряду — кільце «All works».
// Поява — як у Facts: eyebrow виїжджає, лінія розтягується, картки ряду
// виїжджають по черзі.
export default function Work() {
  return (
    <Section id="work" aria-label="Latest & Greatest">
      <SectionLabel>Latest &amp; Greatest</SectionLabel>

      <WorkMosaic works={WORKS.slice(0, 6)} orbit className="mt-10" />
    </Section>
  );
}
