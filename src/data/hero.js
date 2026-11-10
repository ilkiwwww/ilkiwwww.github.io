// Перший екран (Figma, node 40002452:3): цитата клієнта внизу ліворуч і назви кейсів
// унизу праворуч. Цитата — текст із макета; назви — перші шість кейсів студії.
export const HERO_QUOTE =
  "“EMOTE turned a messy MVP into a product our users actually enjoy. Activation went up in the first month after launch.”";

// Кейси Hero: назва внизу, а при наведенні — картка з обкладинкою, назвою й описом (Figma, кадри Moodies 23:786, VetLoop 55:1591, YouSquared 56:2518, Threadly 57:2774).
// Кожен кейс має власну обкладинку (`image`) і власний фон екрана (`bg`, під чорним 80%). `slug` — сторінка кейсу (`/work/<slug>`), `text` — опис із `data/works.js` (у Figma там спільна заглушка).
export const HERO_CASES = [
  { name: "Moodies", slug: "moodies", image: "hero/moodies.jpg", bg: "hero/moodies-bg.jpg", text: "Moodies is a bold and playful brand identity for functional gummies designed to match different moods and moments throughout the day." },
  { name: "VetLoop", slug: "vetloop", image: "hero/vetloop-cover.jpg", bg: "hero/vetloop-cover-bg.jpg", text: "A mobile pet care app designed to make veterinary care simpler, more accessible, and stress-free." },
  { name: "YouSquared", slug: "yousquared", image: "hero/yousquared.jpg", bg: "hero/yousquared-bg.jpg", text: "Human-crafted design for an AI-backed product: app UI, brand identity and website for an AI call secretary." },
  { name: "Threadly", slug: "threadly", image: "hero/threadly.jpg", bg: "hero/threadly-bg.jpg", text: "A modern fashion marketplace app that brings independent designers and local clothing brands together in one curated shopping experience." },
];
