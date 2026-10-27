// Сторінка «Services» (/services) — тексти з UX-прототипу emote-306ec.web.app/services.
// Картинки категорій: public/services/categories/<slug>.png (поки файлу немає — плейсхолдер).
// Це окремі дані від data/services.js (секція «Services» на головній з картинками підпослуг).
export const SERVICES_INTRO = {
  title: "From the first sketch to launch.",
  text: "For startups and growing teams that need a product people actually enjoy using. One team, one thread: here is how an idea becomes a product, step by step.",
};

export const CATEGORIES = [
  {
    slug: "design",
    range: "From a single landing page to a full product redesign.",
    cta: "Start a design project",
    name: "Design",
    title: "We start with how people actually use it.",
    lead: "Before a single screen, we sit with your product and the people it is for. Research, flows and wireframes you can test come first; the interface follows.",
    items: [
      ["UI/UX Design", "Interfaces built around how people actually use the product, not just how it looks."],
      ["Web Design", "Marketing sites and web apps designed to convert, not just to look good."],
      ["Mobile App Design", "Native and cross-platform UI/UX for iOS and Android."],
      ["Website Redesign", "Modernize an outdated site without starting from zero."],
      ["UX/UI Audit", "A clear-eyed look at what's slowing an existing product down."],
    ],
    next: "Once it works, it needs a face.",
  },
  {
    slug: "branding",
    range: "From a lean startup identity to a complete brand platform.",
    cta: "Start a branding project",
    name: "Branding",
    title: "Then it has to be recognisable.",
    lead: "A mark, a palette and a voice, drawn once and written down, so the identity holds when other hands touch it.",
    items: [
      ["Brand Identity", "A mark, palette, and type system built to be recognized at a glance."],
      ["Logo Design", "A mark that still works at 16px and on a billboard."],
      ["Brand Guidelines", "Rules that keep the identity consistent once other hands touch it."],
    ],
    next: "A brand this clear deserves a visual language of its own.",
  },
  {
    slug: "illustration",
    range: "From one icon set to a full illustration language.",
    cta: "Start an illustration project",
    name: "Illustration",
    title: "A visual language that isn't borrowed.",
    lead: "Icons, characters and scenes drawn for your product's tone. No stock packs, no lookalikes.",
    items: [
      ["Icon Set", "A custom icon system that matches the product's tone, not a stock library."],
      ["Character Illustration", "Distinct characters and scenes built for onboarding and empty states."],
      ["Editorial Illustration", "Artwork for landing pages, decks, and marketing that doesn't look borrowed."],
    ],
    next: "Every stage is signed off with you. Next, we make it move.",
  },
  {
    slug: "motion",
    range: "From a single micro-interaction to a launch film.",
    cta: "Start a motion project",
    name: "Motion",
    title: "Motion shows why, not just what.",
    lead: "Small feedback that confirms every tap, and short films that explain a feature in seconds.",
    items: [
      ["Micro-interactions", "Small moments of feedback that make an interface feel alive."],
      ["Product Animation", "Motion that explains a feature instead of just decorating it."],
      ["Explainer Video", "A short animated walkthrough for launch pages and pitches."],
    ],
    next: "Last, everything is built exactly the way it was designed.",
  },
  {
    slug: "development",
    range: "From a single page build to a design system in code.",
    cta: "Start a build",
    name: "Development",
    title: "Built exactly as designed.",
    lead: "Pixel-perfect front-end, specs a dev team can build from, and the same people through launch.",
    items: [
      ["Front-End Build", "The design shipped pixel-perfect, not approximated."],
      ["Design Handoff", "Specs and components a dev team can build from without guessing."],
      ["QA & Launch Support", "The same team that built it stays through launch."],
    ],
    next: "Your turn. Tell us what you’re building.",
  },
];

export const PROCESS = {
  label: "How we work",
  title: ["One process,", "followed every time."],
  cta: "Get in touch",
  steps: [
    ["Discover, as partners", "We start by diving into your project and its audience — not a generic template. You're in the room from day one: Slack, Figma, your workflow, not a handoff down a chain."],
    ["A strategy that holds up", "Understanding the market is only half the job. We build thoughtful, system-based strategy and design that adapts as your product grows, not something that cracks at the first change."],
    ["Structure, dev-ready by default", "User flows and roadmaps you can test before launch, handed off as components — tokens, states, constraints. We speak dev and design like we code, so nothing gets lost on the way."],
    ["Create, a process you can follow", "Every stage gets confirmed with you, visible in Notion, Jira, Figma, or your stack. Scope, estimates, and feedback loops stay open — this is your project, and you see it ship."],
    ["Product-led at every step", "We work at the intersection of design and business throughout — from product-market fit to scale-readiness — aligning UX with growth metrics, not just the user flow."],
    ["The Emote difference", "Our edge isn't tools or templates — it's the people. Curious, invested, and obsessive about doing the right thing right. That wow-effect at the end is what makes it Emote."],
  ],
};

