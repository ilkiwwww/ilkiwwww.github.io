// Послуги для секції «Services» — за Figma (UI-Design, node 40002066:166).
// Назви — з emote.agency/services; підпослуги — зі старого сайту
// (~/Projects/emote-agency, src/data/services.js), на живому їх немає.
// Кожна підпослуга має свою картинку: public/services/<slug>.png (380×200,
// краще 760×400). Поки файлу немає, на його місці плейсхолдер з назвою.
const item = ([name, text]) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return { slug, name, text, image: `services/${slug}.png` };
};

// `text` — короткий опис підпослуги (два рядки): показується поруч із картинкою
// при наведенні й змінюється разом із нею. Тексти — заглушки, замінити на свої.
export const SERVICES = [
  {
    name: "UI/UX Design",
    items: [
      ["Design System", "One library of components and tokens that keeps every screen consistent as the product grows."],
      ["UX Audit", "We find where users get lost and turn it into a clear, prioritised list of fixes."],
      ["Product Design", "From first flow to polished interface, designed together with your team and users."],
    ].map(item),
  },
  {
    name: "Illustration",
    items: [
      ["Icon Set", "A cohesive family of icons drawn to your grid, ready for web and mobile."],
      ["Character Illustration", "Friendly characters that give your product a face and a voice."],
      ["Editorial Illustration", "Custom artwork for articles, campaigns and landing pages that stands out."],
    ].map(item),
  },
  {
    name: "Motion",
    items: [
      ["Micro-interactions", "Small, purposeful animations that make an interface feel alive and clear."],
      ["Product Animation", "Show how your product works in seconds, with smooth and precise motion."],
      ["Explainer Video", "A short story about your product, from script and style to final cut."],
    ].map(item),
  },
  {
    name: "3D",
    items: [
      ["Product Render", "Photoreal renders of your product, built for sites, ads and presentations."],
      ["3D Icon Set", "Depth and light for your icons, without losing consistency across the set."],
      ["3D Illustration", "Expressive 3D scenes that bring a brand idea to life in a single image."],
    ].map(item),
  },
  {
    name: "Branding",
    items: [
      ["Brand Identity", "Positioning, name, voice and visual language that make you recognisable."],
      ["Logo Design", "A mark that is simple, memorable and works from favicon to billboard."],
      ["Brand Guidelines", "Clear rules and ready assets, so everyone can use the brand correctly."],
    ].map(item),
  },
  {
    name: "Development",
    items: [
      ["Front-End Build", "Clean, fast code that matches the design down to the last pixel."],
      ["Design Handoff", "Specs, tokens and components organised so developers can start straight away."],
      ["QA & Launch Support", "We test against the design and stay with you until the release is live."],
    ].map(item),
  },
];
