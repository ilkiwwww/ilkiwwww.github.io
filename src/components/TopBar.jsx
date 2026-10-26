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
  return (
    // Уся шапка з'їжджає зверху одним рухом (.header-drop в index.css), без окремої анімації елементів.
    <header className={`${isHome ? "header-drop" : "header-drop header-drop-now"} fixed inset-x-0 top-5 z-40 flex items-center justify-between px-6 md:px-10`}>
      <Logo />
      <SiteNav />
      <Button variant="light" size="md" onClick={openBookCall}>
        Book a call
      </Button>
    </header>
  );
}
