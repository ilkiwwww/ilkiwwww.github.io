// Кейси сторінки «Work» (/work) — назви, галузі й описи з UX-прототипу
// (emote-306ec.web.app/work). Перші шість — з прототипу; Orbit Wallet, Atlas
// Stays, Lumen Health, Freightly, Casa Nova, Maison Ora, Coinfold і Wanderly — заглушки, щоб працювало «Load more» (замінити реальними).
// Картинки — public/work/ (ті самі, що в секції «Latest & Greatest»), поки
// немає окремих обкладинок.
export const SERVICES = ["UI/UX Design", "Branding", "Web Development", "Illustration", "Motion"];
export const INDUSTRIES = ["Fintech", "Healthcare", "Logistics", "E-commerce", "SaaS", "Crypto", "Real Estate", "Fashion", "Travel"];

// Необов'язкові поля сторінки кейсу: `chapters` (розділи історії; перший без підпису: label, title, text, textAt, layout wide|pair|offset|statement|head, joined (ближче до попереднього на 64), media [{ src, label }], more [{ layout, reverse, media }]), `stats` ([{ value, label }]) із `statsImage`,
// `quote`, `quoteBy` (автор цитати), `story`. Без них сторінка показує заглушки. Розділи Qure — чернетка з макета.
export const WORKS = [
  // Moodies — розкладка за Figma (кадр 40002561:36135), тексти з Dribbble (dribbble.com/shots/27729558-Ecommerce-Branding), картинки з Figma (кадр 40002556:34415). Цитата клієнта — заглушка.
  { slug: "moodies", name: "Moodies", industry: "E-commerce", services: ["Branding", "Illustration", "Motion", "UI/UX Design"], description: "A bold and playful brand identity for functional gummies designed to match different moods and moments throughout the day.", image: "work/work-5.png", next: "work/work-5-hover.webp",
    story: { challenge: "Moodies is a bold and playful brand identity for functional gummies designed to match different moods and moments throughout the day.",
      approach: "The visual system combines vibrant colors, expressive typography, playful graphics, and character-driven packaging to give each flavor its own personality. From Blueberry Dream and Apple Momentum to Happy Strawberry and Orange Spark, every product is built around a distinct mood while still feeling part of one cohesive brand.",
      results: ["A fresh, energetic brand that makes functional wellness feel fun, approachable, and easy to understand"] },
    chapters: [
      { layout: "wide", media: [{ src: "cases/moodies/branding.mp4", label: "Branding" }] },
      { label: "Sweating the details", title: "Every interaction\nserves a purpose.", layout: "head" },
      { layout: "wide", media: [{ src: "cases/moodies/moods.jpg", label: "Flavors" }] },
      { layout: "statement", joined: true, text: "Every product is built around a distinct mood while still feeling part of one cohesive brand.",
        more: [{ layout: "pair", media: [{ src: "cases/moodies/candy.jpg", label: "Packaging" }, { src: "cases/moodies/woman.jpg", label: "Campaign" }] },
          { layout: "offset", media: [{ src: "cases/moodies/strawberry.jpg", label: "Art direction" }, { src: "cases/moodies/bag.jpg", label: "Packaging" }] }] },
      { layout: "statement", text: "The project explores the full identity across packaging, art direction, social media, digital touchpoints, and campaign visuals." },
      { layout: "wide", textAt: "start", text: "Five flavors. Five moods. One delicious way to feel good.", media: [{ src: "cases/moodies/cycle.mp4", label: "Campaign" }],
        more: [{ layout: "offset", reverse: true, media: [{ src: "cases/moodies/orange.jpg", label: "Orange Spark" }, { src: "cases/moodies/gummy.jpg", label: "Product" }] }] },
    ],
    stats: [{ value: "5", label: "flavors, each with its own personality" }, { value: "5", label: "moods, from morning to night" }, { value: "1", label: "cohesive brand across every touchpoint" }],
    statsImage: "cases/moodies/laptop.jpg" },
  // YouSquared — розкладка за Figma (кадр 40002577:9532), тексти з промо-відео (U2_Promo), картинки з Figma й кадри відео. Цифри й цитата клієнта — чернетка.
  { slug: "yousquared", name: "YouSquared", industry: "SaaS", services: ["UI/UX Design", "Branding", "Web Development", "Illustration"], description: "Human-crafted design for an AI-backed product: app UI, brand identity and website for an AI call secretary.", image: "cases/yousquared/poster.jpg",
    story: { challenge: "YouSquared is an AI call secretary, a voice agent that makes sure no important call is missed. The goal was to make an AI-backed product feel human.",
      approach: "We started with product first, not brand. We explored three directions, from too cold through almost there to perfect, and crafted the whole UI by humans. Then the branding was refined for launch, with the YouSquared team leading and Emöte staying close: one team, shared vision, connected tools.",
      results: ["A product UI, brand identity and website designed to launch", "Designed to launch. Ready to connect."] },
    chapters: [
      { layout: "wide", media: [{ src: "cases/yousquared/yousquared.mp4", poster: "cases/yousquared/poster.jpg", label: "Promo" }] },
      { label: "The goal", title: "Make AI\nfeel human.", layout: "head" },
      { layout: "wide", media: [{ src: "cases/yousquared/brand.jpg", label: "Brand guidelines" }] },
      { layout: "statement", joined: true, text: "YouSquared branding, refined by Emöte Agency.",
        more: [{ layout: "pair", media: [{ src: "cases/yousquared/phone-hand.jpg", label: "App" }, { src: "cases/yousquared/calls.jpg", label: "Never miss calls" }] },
          { layout: "offset", media: [{ src: "cases/yousquared/secretary.jpg", label: "Never miss calls" }, { src: "cases/yousquared/logo.jpg", label: "Logo" }] }] },
      { layout: "statement", text: "Same DNA. Different contexts." },
      { layout: "wide", textAt: "start", text: "Your team leads. We stay close: one team, shared vision, connected tools.", media: [{ src: "cases/yousquared/collab.jpg", label: "Workshop" }],
        more: [{ layout: "offset", reverse: true, media: [{ src: "cases/yousquared/tote.jpg", label: "Merch" }, { src: "cases/yousquared/insta.jpg", label: "Social" }] }] },
    ],
    stats: [{ value: "3", label: "directions explored: too cold, almost there, perfect" }, { value: "100%", label: "of the UI crafted by humans" }, { value: "1", label: "team, with shared vision and connected tools" }],
    statsImage: "cases/yousquared/results.mp4" },
  // VetLoop — тексти, відео й кадри з Dribbble-шота (dribbble.com/shots/27828737-Mobile-App-Pet-Care-Veterinary); розкладка за Figma (кадр 40002594:15906), картинки від дизайнерки; слот поруч з Oliver — кадр «2» із Figma VetLoop (24969:9089). Цифри — чернетка.
  { slug: "vetloop", name: "VetLoop", industry: "Healthcare", services: ["UI/UX Design", "Branding", "Illustration", "Motion"], description: "A mobile pet care app designed to make veterinary care simpler, more accessible, and stress-free.", image: "cases/vetloop/poster.jpg",
    story: { challenge: "Managing pet health often means juggling appointments, medical records, and vaccination schedules across different channels. The challenge was to create an intuitive mobile experience that simplifies everyday pet care, improves communication with veterinarians, and helps owners stay on top of their pets' health.",
      approach: "A playful visual identity with a vibrant orange and blue palette, expressive shapes, and friendly visuals. An intuitive dashboard with quick access to pets, upcoming appointments, and reminders. Built-in messaging with veterinarians, and clear vaccination and care reminders that help owners stay organized and proactive.",
      results: ["A seamless digital experience that strengthens the connection between pet owners and veterinary clinics", "Simpler appointment booking and easier access to care information", "Designed to increase customer retention and reduce missed appointments"] },
    chapters: [
      { layout: "wide", media: [{ src: "cases/vetloop/vetloop.mp4", poster: "cases/vetloop/poster.jpg", label: "VetLoop" }] },
      { label: "Product overview", title: "Vet care, made\nsimple and stress-free.", layout: "head" },
      { layout: "wide", media: [{ src: "cases/vetloop/smarter.jpg", label: "Home" }] },
      { layout: "statement", joined: true, text: "A vibrant orange and blue palette, expressive shapes, and friendly visuals create a welcoming experience.",
        more: [{ layout: "pair", media: [{ src: "cases/vetloop/woman.jpg", label: "Pet owner" }, { src: "cases/vetloop/chat.jpg", label: "Vet chat" }] },
          { layout: "offset", media: [{ src: "cases/vetloop/health.jpg", label: "Health" }, { src: "cases/vetloop/logo.jpg", label: "Logo" }] }] },
      { layout: "statement", text: "Built-in messaging allows pet owners to connect with veterinarians, share updates, and manage follow-ups." },
      { layout: "wide", textAt: "start", text: "Clear vaccination and care reminders help owners stay organized and proactive.", media: [{ src: "cases/vetloop/flow.jpg", label: "Booking" }],
        more: [{ layout: "offset", reverse: true, media: [{ src: "cases/vetloop/oliver.jpg", label: "Pet profile" }, { src: "cases/vetloop/reminders.jpg", label: "Reminders" }] }] },
    ],
    stats: [{ value: "3", label: "steps to book a visit: pet, clinic, time" }, { value: "1", label: "app for appointments, vaccinations and vet chat" }, { value: "4", label: "design highlights: identity, dashboard, vet chat, reminders" }],
    statsImage: "cases/vetloop/tilted.jpg" },
  { slug: "gifted", name: "Gifted", industry: "SaaS", services: ["UI/UX Design", "Web Development"], description: "A website for an all-in-one gifting platform that automates employee and client appreciation.",
    story: { challenge: "Gifted is an all-in-one gifting platform that simplifies employee and client appreciation through automated campaigns. The goal was a professional, intuitive interface that balances robust functionality with a delightful user experience, while highlighting key use cases like birthdays, work anniversaries and spot bonuses.",
      approach: "Every section of the homepage is structured around a use case, with scalable layouts, clean navigation, consistent iconography and clear CTAs. The design gives high visibility to real-time reporting, global gift catalogs and HR integrations.",
      results: ["A seamless site that makes thoughtful gifting effortless, personalized and accessible at scale"] } },
  { slug: "serpent", name: "Serpent", industry: "Fintech", services: ["UI/UX Design", "Branding"], description: "Brand and product design for a cross-border payments platform.", image: "work/work-1.png" },
  { slug: "qure", name: "Qure", industry: "Healthcare", services: ["UI/UX Design", "Web Development"], description: "A patient companion app taking people from booking through follow-up.", image: "work/work-2.png",
    chapters: [
      { label: "The vision", layout: "wide", text: "Patients were juggling calls, portals and paper letters. We replaced them with a single thread that follows the person through booking, the visit and aftercare." },
      { label: "Sweating the details", layout: "pair", text: "Guided steps keep the next action obvious, so nobody has to think about where to tap." },
      { label: "Old meets new", layout: "offset" },
    ] },
  { slug: "northline", name: "Northline", industry: "Logistics", services: ["UI/UX Design", "Branding"], description: "A fleet tracking platform built for dispatchers on twelve-hour shifts.", image: "work/work-3.png" },
  { slug: "ledger-loop", name: "Ledger Loop", industry: "Fintech", services: ["Web Development", "UI/UX Design"], description: "A ledger dashboard that helps finance teams close the books faster.", image: "work/work-4.png", next: "work/work-4-hover.png",
    quote: "Finance teams now close the books days faster with fewer reconciliation errors — the dashboard has been adopted across every team.",
    stats: [{ value: "4 days", label: "faster to close the books" }, { value: "60%", label: "fewer reconciliation errors" }, { value: "6", label: "finance teams adopted it" }],
    story: { challenge: "Finance teams were reconciling in years-old spreadsheets — closing the books took a week.", results: ["4 days faster to close the books", "60% fewer reconciliation errors", "Adopted by all 6 finance teams"] } },
  { slug: "havenly", name: "Havenly", industry: "E-commerce", services: ["Branding", "Illustration"], description: "A rebrand and packaging system for a home goods label.", image: "work/work-5.png", next: "work/work-5-hover.webp" },
  { slug: "pulse-metrics", name: "Pulse Metrics", industry: "SaaS", services: ["UI/UX Design", "Motion"], description: "An analytics product redesigned around a single weekly report.", image: "work/work-6.png", next: "work/work-6-hover.webp" },
  // Заглушки
  { slug: "orbit-wallet", name: "Orbit Wallet", industry: "Crypto", services: ["UI/UX Design", "Web Development"], description: "A self-custody wallet that makes every transaction readable at a glance.", image: "work/work-2.png" },
  { slug: "atlas-stays", name: "Atlas Stays", industry: "Travel", services: ["Branding", "Web Development"], description: "A booking brand and site for long-stay apartments in twelve cities.", image: "work/work-3.png" },
  { slug: "lumen-health", name: "Lumen Health", industry: "Healthcare", services: ["UI/UX Design", "Illustration"], description: "A care-plan app that explains every treatment step in plain language.", image: "work/work-4.png", next: "work/work-4-hover.png" },
  { slug: "freightly", name: "Freightly", industry: "Logistics", services: ["Web Development", "UI/UX Design"], description: "A shipment booking portal that quotes in seconds.", image: "work/work-5.png", next: "work/work-5-hover.webp" },
  { slug: "casa-nova", name: "Casa Nova", industry: "Real Estate", services: ["Branding", "Web Development"], description: "A brand and listing site for a boutique property studio.", image: "work/work-6.png", next: "work/work-6-hover.webp" },
  { slug: "maison-ora", name: "Maison Ora", industry: "Fashion", services: ["Branding", "Motion"], description: "A seasonal lookbook identity with motion at its core.", image: "work/work-1.png" },
  { slug: "coinfold", name: "Coinfold", industry: "Crypto", services: ["UI/UX Design", "Motion"], description: "A portfolio tracker that turns volatility into a calm daily summary.", image: "work/work-2.png" },
  { slug: "wanderly", name: "Wanderly", industry: "Travel", services: ["UI/UX Design", "Illustration"], description: "A trip planner with hand-drawn city guides.", image: "work/work-3.png" },
];
