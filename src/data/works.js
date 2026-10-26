// Кейси сторінки «Work» (/work) — назви, галузі й описи з UX-прототипу
// (emote-306ec.web.app/work). Перші шість — з прототипу; Orbit Wallet, Atlas
// Stays, Lumen Health, Freightly, Casa Nova, Maison Ora, Coinfold і Wanderly — заглушки, щоб працювало «Load more» (замінити реальними).
// Картинки — public/work/ (ті самі, що в секції «Latest & Greatest»), поки
// немає окремих обкладинок.
export const SERVICES = ["UI/UX Design", "Branding", "Web Development", "Illustration", "Motion"];
export const INDUSTRIES = ["Fintech", "Healthcare", "Logistics", "E-commerce", "SaaS", "Crypto", "Real Estate", "Fashion", "Travel"];

// Необов'язкові поля сторінки кейсу: `chapters` (розділи історії; перший без заголовка:
// label, text, layout wide|pair|offset, media [{ src, label }]), `stats` ([{ value, label }]) із `statsImage`,
// `quote`, `quoteBy` (автор цитати), `story`. Без них сторінка показує заглушки. Розділи Qure — чернетка з макета.
export const WORKS = [
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
