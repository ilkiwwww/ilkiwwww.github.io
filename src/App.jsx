import AboutPage from "./components/AboutPage.jsx";
import ContactPage from "./components/ContactPage.jsx";
import DesignSystemPage from "./components/DesignSystemPage.jsx";
import Facts from "./components/Facts.jsx";
import Loader from "./components/Loader.jsx";
import Hero from "./components/Hero.jsx";
import Page from "./components/Page.jsx";
import Services from "./components/Services.jsx";
import ServicesPage from "./components/ServicesPage.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Work from "./components/Work.jsx";
import WorkDetailPage from "./components/WorkDetailPage.jsx";
import WorksPage from "./components/WorksPage.jsx";

export default function App() {
  // Без роутера: /work — список кейсів, /work/<slug> — сторінка кейсу.
  const path = window.location.pathname.replace(/\/$/, "");
  if (path === "/design-system") return <DesignSystemPage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/services") return <ServicesPage />;
  if (path === "/work") return <WorksPage />;
  if (path.startsWith("/work/")) return <WorkDetailPage slug={path.slice(6)} />;
  return (
    <Page>
      <Loader />
      <Hero />
      <Facts />
      <Work />
      <Services />
      <Testimonials />
    </Page>
  );
}
