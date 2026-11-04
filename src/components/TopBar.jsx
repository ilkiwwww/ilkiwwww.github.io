import { useEffect, useState } from "react";
import { openBookCall } from "./BookCall.jsx";
import Button from "./ui/Button.jsx";
import Logo from "./ui/Logo.jsx";

// Навігація шапки — кожен таб веде на окрему сторінку (/work, /services, …),
// активний — той, чия сторінка відкрита.
const NAV = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function SiteNav() {
  const path = window.location.pathname.replace(/\/$/, "");
  return (
    <nav aria-label="Sections" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
      <ul className="flex items-center gap-2">
        {NAV.map((n) => {
          const active = path === `/${n.id}`;
          return (
            <li key={n.id}>
              <Button
                href={`/${n.id}`}
                variant="outline"
                size="sm"
                active={active}
                aria-current={active ? "page" : undefined}
              >
                {n.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function TopBar() {
  // На Home шапка чекає інтро Hero (1.1s); на решті сторінок інтро немає, тож з'їжджає майже одразу.
  const isHome = window.location.pathname === "/";
  // Коли сторінку прокручено, шапка збирається в плашку по центру (лого, таби, «Book a call» на суцільній
  // підкладці), щоб таби й лого було видно на будь-якому фоні. Стилі й плавність — `.site-bar` в index.css.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    // Уся шапка з'їжджає зверху одним рухом (.header-drop в index.css), без окремої анімації елементів.
    <header className={`${isHome ? "header-drop" : "header-drop header-drop-now"} fixed inset-x-0 top-12 z-40 px-6 md:top-5 md:px-10`}>
      <div className="site-bar relative mx-auto flex items-center justify-between" data-scrolled={scrolled || undefined}>
        <Logo className="site-logo" />
        <SiteNav />
        <Button variant="light" size="md" onClick={openBookCall}>
          Book a call
        </Button>
      </div>
    </header>
  );
}
