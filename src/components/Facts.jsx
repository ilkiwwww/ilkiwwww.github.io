import Eyebrow from "./ui/Eyebrow.jsx";
import Heading from "./ui/Heading.jsx";
import { Grow, InView, Rise } from "./ui/Motion.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import Section from "./ui/Section.jsx";
import Text from "./ui/Text.jsx";

// Друга секція — за Figma (UI-Design, node 40002037:317, 1440 ширини).
// Зліва eyebrow, праворуч теза і цифри агенції парами, розділені лініями.
// Поява при скролі — як на metalab.com/about: заголовок заповнюється білим за скролом, лінія
// розтягується, цифри й підписи виїжджають знизу. Кожен рядок стартує сам,
// коли доходить до екрана.
const FACTS = [
  [
    { value: "120+", label: "Products launched" },
    { value: "5M+", label: "Users on platforms we designed" },
  ],
  [
    { value: "8+", label: "Years in business" },
    { value: "$200M+", label: "Raised by our clients" },
  ],
];

// `delay` — зсув колонки в рядку: друга стартує трохи пізніше за першу.
export function Fact({ value, label, delay }) {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <Rise bleed delay={delay}>
        <Heading level="statement" tone="primary" as="p">
          {value}
        </Heading>
      </Rise>
      <Rise delay={delay + 0.08}>
        <Text tone="secondary">{label}</Text>
      </Rise>
    </div>
  );
}

export default function Facts() {
  return (
    <Section id="about" aria-labelledby="facts-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0">
        {/* Колонка eyebrow: від xl 40 + 520 = 560 — звідси починається контент (Figma); на lg вужча, щоб цифри вміщались. */}
        <InView className="shrink-0 lg:w-60 xl:w-130">
          <Rise>
            <Eyebrow>We do it</Eyebrow>
          </Rise>
        </InView>

        <div className="flex min-w-0 flex-1 flex-col gap-12 md:gap-20 lg:pr-10">
          {/* Заголовок заповнюється білим за скролом, слово за словом. */}
          <ScrollHeading id="facts-title" lines={["A product issue", "often reflects a business challenge."]} />

          <div className="flex flex-col gap-5 md:gap-10">
            {FACTS.map((row, i) => (
              <InView key={i} className="flex flex-col gap-5 md:gap-10">
                {/* Від md одна лінія на пару, на мобільному — лінія над кожним показником (Figma 40002524:11683). */}
                <div className="hidden md:block">
                  <Grow />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:flex md:gap-0">
                  {row.map((fact, j) => (
                    // Друга колонка стоїть на 348 від лінії (Figma).
                    <div key={fact.value} className={`flex flex-col gap-5 md:block ${j === 0 ? "md:w-87 md:shrink-0" : ""}`}>
                      <div className="md:hidden">
                        <Grow />
                      </div>
                      <Fact {...fact} delay={0.15 + j * 0.12} />
                    </div>
                  ))}
                </div>
              </InView>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
