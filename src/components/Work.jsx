import { HERO_CASES } from "../data/hero.js";
import { WORKS } from "../data/works.js";
import Section from "./ui/Section.jsx";
import SectionLabel from "./ui/SectionLabel.jsx";
import WorkMosaic from "./WorkMosaic.jsx";

// Третя секція «Latest & Greatest» — за Figma (UI-Design, node 40002037:422).
// Ті самі чотири кейси й обкладинки, що в Hero (`data/hero.js`, рішення дизайнерки), мозаїкою (WorkMosaic);
// у другому ряду після картки — кільце «All works».
// Поява — як у Facts: eyebrow виїжджає, лінія розтягується, картки ряду
// виїжджають по черзі.
const LATEST = HERO_CASES.map((c) => ({ ...WORKS.find((w) => w.slug === c.slug), image: c.image, next: undefined }));

export default function Work() {
  return (
    <Section id="work" aria-label="Latest & Greatest">
      <SectionLabel>Latest &amp; Greatest</SectionLabel>

      <WorkMosaic works={LATEST} orbit className="mt-10" />
    </Section>
  );
}
