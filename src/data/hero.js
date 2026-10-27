// Перший екран (Figma, node 40002452:3): цитата клієнта внизу ліворуч і назви кейсів
// унизу праворуч. Цитата — текст із макета; назви — перші шість кейсів студії.
export const HERO_QUOTE =
  "“EMOTE turned a messy MVP into a product our users actually enjoy. Activation went up in the first month after launch.”";

// Кейси Hero: назва внизу, а при наведенні — картка з обкладинкою, назвою й описом (Figma, node 40002480:184).
// Назви, обкладинки й опис перших трьох (Cyclea, VetLoop, Corebit) — з Figma (кадри 40002480:184, 40002484:1922, 40002484:10926); текст опису там поки спільний заглушка. Решта — заглушки. `slug` — сторінка кейсу (`/work/<slug>`, `data/works.js`); поки це заглушки з перших шести робіт, замінити відповідними.
export const HERO_CASES = [
  { name: "Cyclea", slug: "gifted", image: "hero/cyclea.png", text: "Axentix is an AI agent builder that lets teams design, test and launch their own agents without writing code." },
  { name: "VetLoop", slug: "serpent", image: "hero/vetloop.png", text: "Axentix is an AI agent builder that lets teams design, test and launch their own agents without writing code." },
  { name: "Corebit", slug: "qure", image: "hero/corebit.png", text: "Axentix is an AI agent builder that lets teams design, test and launch their own agents without writing code." },
  { name: "Momentum", slug: "northline", image: "work/work-4.png", text: "Momentum is a habit tracker that turns small daily wins into a streak you actually want to keep." },
  { name: "Apex", slug: "ledger-loop", image: "work/work-5.png", text: "Apex is a trading dashboard that makes a busy market readable at a single glance." },
  { name: "Vortex", slug: "havenly", image: "work/work-6.png", text: "Vortex is a creative suite for teams that review, version and ship motion work together." },
];
