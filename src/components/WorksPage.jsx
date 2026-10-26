import { useMemo, useState } from "react";
import { INDUSTRIES, SERVICES, WORKS } from "../data/works.js";
import Button from "./ui/Button.jsx";
import Heading from "./ui/Heading.jsx";
import { InView, Rise } from "./ui/Motion.jsx";
import Section from "./ui/Section.jsx";
import Select from "./ui/Select.jsx";
import Text from "./ui/Text.jsx";
import Page from "./Page.jsx";
import WorkMosaic from "./WorkMosaic.jsx";

// Сторінка «Work» (/work). UX — з прототипу emote-306ec.web.app/work,
// подача — «Showcase» (величезний заголовок, лінія, контурні фільтри в один
// ряд із галуззю) + «Mosaic» (кейси мозаїкою, як «Latest &
// Greatest» на головній: картки різної ширини, на hover росте, сусіди тьмяніють).
// Фільтри комбінуються; «Load more» додає ще PAGE карток. Внизу — той самий
// фінальний CTA з футером, що й на головній.
const PAGE = 12; // чотири ряди по три

export default function WorksPage() {
  const [service, setService] = useState(null);
  const [industry, setIndustry] = useState("");
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(
    () => WORKS.filter((w) => (!service || w.services.includes(service)) && (!industry || w.industry === industry)),
    [service, industry],
  );

  const pick = (next) => {
    setService(next);
    setShown(PAGE);
  };

  return (
    <Page>
      <Section rhythm="top" aria-labelledby="works-title">
        <InView className="flex flex-col gap-4">
          <Rise>
            <Heading id="works-title" level="display" as="h1" tone="primary">
              Case studies
              <br />
              across industries.
            </Heading>
          </Rise>
        </InView>

        {/* Лінія + фільтри: послуга — контурні чипи (один вибраний, білий),
            праворуч галузь. */}
        <InView className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-tertiary pt-6">
          <Rise delay={0.2} bleed>
            <div role="group" aria-label="Service" className="flex flex-wrap gap-2">
              {[null, ...SERVICES].map((s) => (
                <Button key={s ?? "all"} variant="outline" size="sm" active={service === s} aria-pressed={service === s} onClick={() => pick(s)}>
                  {s ?? "All work"}
                </Button>
              ))}
            </div>
          </Rise>
          <Rise delay={0.25} bleed>
            <div>
              <Select
                label="Industry"
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setShown(PAGE);
                }}
              >
                <option value="" className="bg-fill">Industry</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i} className="bg-fill">
                    {i}
                  </option>
                ))}
              </Select>
            </div>
          </Rise>
        </InView>

        {filtered.length > 0 ? (
          <WorkMosaic key={`${service}-${industry}`} works={filtered.slice(0, shown)} className="mt-10" />
        ) : (
          <Text size="lead" tone="secondary" className="mt-16">
            No cases here yet — try another filter.
          </Text>
        )}

        {shown < filtered.length && (
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="md" onClick={() => setShown((n) => n + PAGE)}>
              Load more
            </Button>
          </div>
        )}
      </Section>

    </Page>
  );
}
