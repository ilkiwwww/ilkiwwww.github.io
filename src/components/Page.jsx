import BookCall from "./BookCall.jsx";
import Cta from "./Cta.jsx";
import TopBar from "./TopBar.jsx";
import Cursor from "./ui/Cursor.jsx";

// Каркас сторінки сайту: шапка, вміст, фінальний CTA з футером і курсор.
// `cta={false}` — без фінального CTA, лише футер (сторінка Contact).
export default function Page({ children, cta = true }) {
  return (
    <main>
      <TopBar />
      {children}
      <Cta footerOnly={!cta} />
      <BookCall />
      <Cursor />
    </main>
  );
}
