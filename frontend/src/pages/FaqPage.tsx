import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

const faqItems = [
  {
    question: 'Is Nexoria just a website, chatbot, or dashboard?',
    answer:
      'No. Those can be parts of the install, but the offer is the operating path that moves an inquiry toward a booked job, paid deposit, quote request, inspection, appointment, or callback.',
  },
  {
    question: 'What happens when I click Get Started?',
    answer:
      'You complete intake details such as website, industry, revenue range, current booking process, lead sources, and goals. Then you schedule the Operator Diagnostic.',
  },
  {
    question: 'Who gets portal access?',
    answer:
      'Portal access belongs to qualified clients moving through the install process. Registration is tied to an eligible lead, booked call, or approved client flow.',
  },
  {
    question: 'What is the blueprint?',
    answer:
      'The blueprint is the client-ready plan for fixing the lead-to-booked-job system. It includes goals, status, event type, prioritized fixes, owners, and what the client can see.',
  },
];

export default function FaqPage() {
  return (
    <main className="homepage homepage--install">
      <section className="home-section">
        <div className="install-nav install-nav--simple">
          <Link className="brand-lockup" to="/">
            <img alt="Nexoria" src={logoImage} />
            <div>
              <strong>Nexoria</strong>
            </div>
          </Link>

          <div className="install-nav__actions">
            <Link className="ghost-button" to="/">
              Home
            </Link>
            <Link className="primary-button" to="/schedule?source=BOOK_A_CALL">
              Book Operator Diagnostic
            </Link>
          </div>
        </div>

        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h1>What service business owners usually ask before they book.</h1>
          <p className="muted">
            Practical answers about the Operator Diagnostic, client portal access, and the 14-day booked-job
            system install.
          </p>
        </div>

        <div className="faq-grid">
          {faqItems.map((item) => (
            <article className="card faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p className="muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
