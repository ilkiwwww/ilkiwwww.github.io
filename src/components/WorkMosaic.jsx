import OrbitLink from "./ui/OrbitLink.jsx";
import { InView, Rise } from "./ui/Motion.jsx";
import WorkCard from "./WorkCard.jsx";

// Мозаїка кейсів «Latest & Greatest» (головна й /work): ряди по три; на desktop
// картки ділять ряд пропорційно ширинам з макету (390·260·606 і 340·370·254) —
// це їхні flex-grow, на hover картка росте, сусіди тьмяніють (.work-* в
// index.css). Висота йде з пропорцій фото. Нижче lg — звичайна сітка.
// `orbit` — кільце «All works» праворуч від другого ряду (головна).
const PATTERNS = [
  [
    { grow: "lg:grow-390 lg:hover:grow-449", shape: "lg:aspect-39/50" },
    { grow: "lg:grow-260 lg:hover:grow-299", shape: "lg:aspect-13/15" },
    { grow: "lg:grow-606 lg:hover:grow-697", shape: "lg:aspect-303/250" },
  ],
  [
    { grow: "lg:grow-340 lg:hover:grow-391", shape: "lg:aspect-17/25" },
    { grow: "lg:grow-370 lg:hover:grow-426", shape: "lg:aspect-37/50" },
    { grow: "lg:grow-254 lg:hover:grow-292", shape: "lg:aspect-127/150" },
  ],
];

const chunk = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

export default function WorkMosaic({ works, orbit = false, className = "" }) {
  return (
    <div className={`flex flex-col gap-16 ${className}`}>
      {chunk(works, 3).map((row, i) => (
        <InView key={i} early={i === 0} className="work-row grid gap-y-16 md:grid-cols-2 md:gap-x-3 lg:flex lg:items-start lg:gap-3">
          {row.map((work, j) => {
            const look = PATTERNS[i % 2][j];
            return (
              <Rise key={work.slug} delay={0.1 + j * 0.1} className={`work-card w-full lg:w-auto lg:basis-0 ${look.grow}`}>
                <WorkCard work={work} shape={`h-100 w-full lg:h-auto ${look.shape}`} />
              </Rise>
            );
          })}
          {orbit && i === 1 && (
            <div className="ml-8 hidden shrink-0 lg:block">
              <OrbitLink href="/work" label="All works" />
            </div>
          )}
        </InView>
      ))}
    </div>
  );
}
