// Спільні дані й помічники для прототипів сторінки Services. Не частина сайту.
const E = (() => {
  const CATS = [
    { name:"Design", title:"We start with how people actually use it.", lead:"Research, flows and interfaces you can test before a line of code is written.", items:["UI/UX Design","Web Design","Mobile App Design","Website Redesign","UX/UI Audit"] },
    { name:"Branding", title:"Then it has to be recognisable.", lead:"A mark, a palette and a voice, drawn once and written down so it holds when other hands touch it.", items:["Brand Identity","Logo Design","Brand Guidelines"] },
    { name:"Illustration", title:"A visual language that isn't borrowed.", lead:"Icons, characters and scenes drawn for your product's tone. No stock packs, no lookalikes.", items:["Icon Set","Character Illustration","Editorial Illustration"] },
    { name:"Motion", title:"Motion shows why, not just what.", lead:"Feedback that confirms every tap, and short films that explain a feature in seconds.", items:["Micro-interactions","Product Animation","Explainer Video"] },
    { name:"3D", title:"Depth, where flat won't do.", lead:"Renders, icons and hero scenes with no photo shoot, even before the product exists.", items:["Product Render","3D Icon Set","3D Illustration"] },
    { name:"Development", title:"Built exactly as designed.", lead:"Pixel-perfect front-end, specs a dev team can build from, and the same people through launch.", items:["Front-End Build","Design Handoff","QA & Launch Support"] },
  ];
  const STEPS = [
    ["Discover, as partners","We start by diving into your project and its audience — not a generic template. You're in the room from day one: Slack, Figma, your workflow, not a handoff down a chain."],
    ["A strategy that holds up","Understanding the market is only half the job. We build thoughtful, system-based strategy and design that adapts as your product grows."],
    ["Structure, dev-ready by default","User flows and roadmaps you can test before launch, handed off as components — tokens, states, constraints."],
    ["Create, a process you can follow","Every stage gets confirmed with you, visible in Notion, Jira, Figma, or your stack. Scope, estimates and feedback loops stay open."],
    ["Product-led at every step","We work at the intersection of design and business — aligning UX with growth metrics, not just the user flow."],
    ["The Emote difference","Our edge isn't tools or templates — it's the people. Curious, invested, and obsessive about doing the right thing right."],
  ];
  // Заглушки: цифри, інструменти й FAQ — для макета.
  const STATS = [["9","years in product design"],["120+","products shipped"],["24","specialists in the team"],["92%","clients come back"]];
  const TOOLS = ["Figma","Framer","Webflow","React","Blender","After Effects","Spline","Notion","Jira","Storybook"];
  const FAQ = [
    ["How long does a typical project take?","Most design projects run 6–10 weeks, from discovery to a dev-ready handoff. Branding sprints are shorter, product work longer."],
    ["Do you work with early-stage startups?","Yes. We scope a lean first phase so you can validate with real users before committing to the full build."],
    ["Can you join our existing team?","We often plug into in-house teams — same Slack, same Figma, same rituals — and hand over clean components."],
    ["What do you need from us to start?","A short brief, access to the people who know the users, and a decision-maker we can reach in a day."],
    ["How does pricing work?","Fixed scope per phase, agreed up front. Your first call is free and we sign an NDA if you ask."],
  ];
  const n2 = i => String(i+1).padStart(2,"0");
  const clamp = (v,a=0,b=1) => Math.min(b, Math.max(a, v));
  const ss = t => t*t*(3-2*t);
  const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };
  const ticks = [];

  const header = (active="Services") => `<header class="hdr"><a class="logo" href="#">EMÖTE</a><nav>${["Work","Services","About","Contact"].map(t=>`<a class="chip ${t===active?"on":""}" href="#">${t}</a>`).join("")}</nav><a class="btn light" href="#">Book a call</a></header>`;
  const words = (t, d0=0) => t.split(" ").map((w,i)=>`<span class="rise"><span style="--d:${(d0+i*.07).toFixed(2)}s">${w}</span></span>`).join(" ");
  const fillText = t => t.split(" ").map(w=>`<span class="w">${w}</span>`).join(" ");
  const label = t => `<div class="label"><span class="eyebrow">${t}</span></div>`;

  const stats = () => `<section class="section"><div class="wrap-s">${label("In numbers")}<div class="stats" data-view>${STATS.map(([v,t],i)=>`<div class="stat"><b data-count="${v}">${v}</b><span class="sec">${t}</span></div>`).join("")}</div></div></section>`;
  const tools = () => `<section class="section tools" style="padding-left:0;padding-right:0"><div style="padding:0 40px">${label("Tools we think in")}</div><div class="marq"><div>${TOOLS.map(t=>`<span>${t}</span>`).join("")}</div><div>${TOOLS.map(t=>`<span>${t}</span>`).join("")}</div></div><div class="marq rev" style="margin-top:8px"><div>${TOOLS.slice().reverse().map(t=>`<span>${t}</span>`).join("")}</div><div>${TOOLS.slice().reverse().map(t=>`<span>${t}</span>`).join("")}</div></div></section>`;
  const faq = () => `<section class="section"><div class="wrap-s" style="display:grid;grid-template-columns:1fr 2fr;gap:64px">${`<div>${label("FAQ")}<div class="statement fill" data-fill>${fillText("Questions we hear a lot.")}</div></div>`}<div class="faq">${FAQ.map(([q,a],i)=>`<div class="faq-i ${i===0?"open":""}"><button class="faq-q"><span class="quote">${q}</span><i>+</i></button><div class="faq-a"><div><p class="sec lead">${a}</p></div></div></div>`).join("")}</div></div></section>`;
  const cta = () => `<section class="cta" id="cta"><div class="ring"></div><h2 data-view class="rise-wrap">${words("Let’s make")}<br>${words("it work.",.15)}</h2><a class="btn light">Book a call</a></section><footer class="foot"><span class="dense">© 2016–2026 The Emote Agency · Privacy policy</span><span><a href="#">Instagram</a><a href="#">Linkedin</a><a href="#">Dribbble</a></span></footer>`;

  function init(){
    // reveal on view
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); if(e.target.querySelector("[data-count]")) count(e.target); } }), {threshold:.2});
    document.querySelectorAll("[data-view], .rise, .up").forEach(el=>io.observe(el));
    // faq
    document.querySelectorAll(".faq").forEach(f=>f.addEventListener("click",e=>{ const i=e.target.closest(".faq-i"); if(!i) return; const was=i.classList.contains("open"); f.querySelectorAll(".faq-i").forEach(x=>x.classList.remove("open")); if(!was) i.classList.add("open"); }));
    // scroll fill
    const fills = [...document.querySelectorAll("[data-fill]")];
    ticks.push(()=>fills.forEach(el=>{ const ws=[...el.querySelectorAll(".w")]; const r=el.getBoundingClientRect(); const p=clamp((innerHeight*.85 - r.top)/(innerHeight*.45)); ws.forEach((w,i)=>w.classList.toggle("on", i < p*ws.length)); }));
    addEventListener("scroll",run,{passive:true}); addEventListener("resize",run); run();
  }
  function count(root){ root.querySelectorAll("[data-count]").forEach(b=>{ const m=b.dataset.count.match(/^(\d+)(.*)$/); if(!m) return; const to=+m[1], t0=performance.now(); (function f(t){ const k=clamp((t-t0)/1400); b.textContent=Math.round(to*(1-Math.pow(1-k,3)))+m[2]; if(k<1) requestAnimationFrame(f); })(t0); }); }
  const run = () => ticks.forEach(f=>f());
  return { CATS, STEPS, STATS, TOOLS, FAQ, n2, clamp, ss, prog, ticks, header, words, fillText, label, stats, tools, faq, cta, init };
})();
