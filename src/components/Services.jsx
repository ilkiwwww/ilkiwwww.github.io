import { useState } from "react";
import { SERVICES } from "../data/services.js";
import Heading from "./ui/Heading.jsx";
import Media from "./ui/Media.jsx";
import { Grow, InView, Rise } from "./ui/Motion.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import Section from "./ui/Section.jsx";
import Text from "./ui/Text.jsx";

// Четверта секція «Services» — за Figma (UI-Design, node 40002066:166).
// Заголовок, під ним список послуг: назва ліворуч, підпослуги праворуч.
// Наведення (lg): рядок під курсором розкривається до 200px, і між назвою й
// підпослугами з'являється картинка першої підпослуги (380×200); жодна
// підпослуга не виділена. Наведення чи фокус на підпослузі робить її білою
// й міняє картинку — нова відкривається шторкою знизу поверх старої
// (.service-* в index.css); поруч із картинкою стоїть короткий опис підпослуги
// (.service-text) під підпослугами (вони в один рядок), він змінюється разом із нею. Курсор пішов зі списку — рядок згортається. Нижче lg картинок немає, лише список.
// Поява — як у Facts: заголовок і рядки виїжджають знизу, лінії розтягуються.
function ServiceRow({ service, open, active, onOpen, onPick, delay }) {
  return (
    <li className="service-row" data-open={open || undefined} onMouseEnter={onOpen} onFocus={onOpen}>
      <Rise delay={delay}>
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:gap-6">
          {/* Колонка назви фіксованої ширини: картинка в усіх рядках стоїть
              на одній вертикалі (Figma: 359 від лівого краю контенту). */}
          <div className="lg:w-55 lg:shrink-0 xl:w-85">
            <Text size="lead" weight="medium" as="h3">
              {service.name}
            </Text>
          </div>

          <div className="service-reveal hidden lg:grid" aria-hidden="true">
            <div>
              <div className="relative aspect-19/10 w-70 xl:w-95">
                {service.items.map((item, j) => (
                  <div key={item.slug} className="service-shot absolute inset-0" data-active={(open && (active ?? 0) === j) || undefined}>
                    <Media src={item.image} label={item.name} fill />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Праворуч: підпослуги в один рядок, під ними опис активної (міняється разом із картинкою). */}
          <div className="lg:ml-auto lg:flex lg:flex-col lg:items-end">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:justify-end xl:flex-nowrap">
              {service.items.map((item, j) => (
                <li key={item.slug} tabIndex={0} onMouseEnter={() => onPick(j)} onFocus={() => onPick(j)} className="outline-offset-4">
                  <Text as="span" tone={open && active === j ? "primary" : "secondary"} className="whitespace-nowrap transition-colors duration-300">
                    {item.name}
                  </Text>
                </li>
              ))}
            </ul>
            <div className="service-reveal hidden lg:grid" aria-hidden="true">
              <div>
                <div className="grid max-w-80 pt-4 text-right">
                  {service.items.map((item, j) => (
                    <div key={item.slug} className="service-text col-start-1 row-start-1" data-active={(open && (active ?? 0) === j) || undefined}>
                      <Text tone="secondary">{item.text}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Rise>
      <Grow delay={delay + 0.1} />
    </li>
  );
}

export default function Services() {
  // Відкритий рядок і активна підпослуга в ньому (null — жодна не вибрана,
  // показано картинку першої).
  const [state, setState] = useState({ row: null, item: null });

  const openRow = (row) => setState((s) => (s.row === row ? s : { row, item: null }));
  const close = () => setState({ row: null, item: null });

  return (
    <Section id="services" aria-labelledby="services-title">
      {/* Заголовок заповнюється білим за скролом, слово за словом (як у Facts). */}
      <ScrollHeading id="services-title" lines={["Our product design", "and development services."]} />

      <InView
        as="ul"
        className="mt-10"
        onMouseLeave={close}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) close();
        }}
      >
        <li aria-hidden="true">
          <Grow />
        </li>
        {SERVICES.map((service, i) => (
          <ServiceRow
            key={service.name}
            service={service}
            open={state.row === i}
            active={state.item}
            onOpen={() => openRow(i)}
            onPick={(j) => setState({ row: i, item: j })}
            delay={0.1 + i * 0.08}
          />
        ))}
      </InView>
    </Section>
  );
}
