import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { openBookCall } from "./BookCall.jsx";
import Button from "./ui/Button.jsx";
import IconButton from "./ui/IconButton.jsx";
import { CloseIcon, MenuIcon } from "./ui/icons.jsx";
import Logo from "./ui/Logo.jsx";
import Text from "./ui/Text.jsx";

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

// Меню до lg (там таби шапки ховаються): повноекранна панель під шапкою з тими самими чотирма сторінками.
function MobileMenu({ onClose }) {
  const path = window.location.pathname.replace(/\/$/, "");
  // У body, а не в шапці: на шапці стоїть transform (.header-drop), він ламає `fixed` у дітях.
  return createPortal(
    // data-lenis-prevent: плавний скрол сторінки не перехоплює колесо, поки меню відкрите.
    <div id="site-menu" data-lenis-prevent className="fixed inset-0 z-30 overflow-y-auto bg-black px-6 pt-32 pb-10 md:px-10 md:pt-36 lg:hidden">
      <nav aria-label="Sections">
        <ul className="border-t border-tertiary">
          {NAV.map((n) => {
            const active = path === `/${n.id}`;
            return (
              <li key={n.id} className="border-b border-tertiary">
                <a
                  href={`/${n.id}`}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className="block py-5 outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Text as="span" size="quote" tone={active ? "primary" : "secondary"}>
                    {n.label}
                  </Text>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>,
    document.body,
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
  const [menuOpen, setMenuOpen] = useState(false);
  // Поки меню відкрите, сторінка під ним не скролиться; Esc закриває.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    document.documentElement.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);
  return (
    // Уся шапка з'їжджає зверху одним рухом (.header-drop в index.css), без окремої анімації елементів.
    <header className={`${isHome ? "header-drop" : "header-drop header-drop-now"} fixed inset-x-0 top-12 z-40 px-6 md:top-5 md:px-10`}>
      <div className="site-bar relative mx-auto flex items-center justify-between" data-scrolled={scrolled || undefined}>
        <Logo className="site-logo" />
        <SiteNav />
        <div className="flex items-center gap-2">
          <Button variant="light" size="md" onClick={openBookCall}>
            Book a call
          </Button>
          <IconButton
            label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
      </div>
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
