// Кейси для Hero — назви з Figma. Картинка поки є лише в першого.
// `format` — `portrait` (картка 348×520, за замовчуванням) або `landscape` (780×520).
// `image` — картка кейсу (public/cases/, бажано x2–x3),
// `background` — необов'язковий фон на весь екран замість обкладинки Hero,
// `description` — короткий опис кейсу. Для Axentix, Momentum, Apex, Vortex,
// Resonance і Complete Tasks — заглушки, замінити реальними.
export const CASES = [
  {
    slug: "axentix",
    name: "Axentix",
    services: "Product design",
    // Заглушка — замінити реальним описом.
    description: "Axentix is an AI agent builder that lets teams design, test and launch their own agents without writing code.",
    image: "cases/agentix.png",
    background: null,
  },
  {
    slug: "veggy",
    name: "Veggy",
    services: "Product design",
    format: "landscape",
    // Текст із Figma — поки це копія опису Flowlet, замінити на опис Veggy.
    description:
      "Flowlet Mobile App is a real-time AI finance assistant that combines everyday banking, expense tracking, smart budgeting guidance, transfers, and financial insights in one mobile experience.",
    image: "cases/veggy.png",
    background: "cases/veggy-bg.jpg",
  },

  {
    slug: "vitalis",
    name: "Vitalis",
    services: "Product design",
    description:
      "Vitalis is a premium healthcare ecosystem designed for private clinics, creating a seamless connection between patients and healthcare professionals in one intuitive mobile experience.",
    image: "cases/vitalis.png",
    background: "cases/vitalis-bg.jpg",
  },
  {
    slug: "momentum",
    name: "Momentum",
    services: "Product design",
    description: "Momentum is a savings app that turns money habits into streaks and rewards consistency, not balances.",
    image: null,
    background: null,
  },
  {
    slug: "apex",
    name: "Apex",
    services: "Product design",
    description: "Apex is a booking platform for climbing gyms that keeps routes, passes and community in one place.",
    image: null,
    background: null,
  },
  {
    slug: "vortex",
    name: "Vortex",
    services: "Product design",
    description: "Vortex is a crypto wallet with onboarding that skips the jargon and gets people to their first transfer in minutes.",
    image: null,
    background: null,
  },
  {
    slug: "resonance",
    name: "Resonance",
    services: "Product design",
    description: "Resonance is a music learning app that listens as you play and gives feedback in real time.",
    image: null,
    background: null,
  },
  {
    slug: "complete-tasks",
    name: "Complete Tasks",
    services: "Product design",
    description: "Complete Tasks is a team task manager built around one daily focus list instead of endless boards.",
    image: null,
    background: null,
  },
];
