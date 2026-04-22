import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

const installPillars = [
  {
    title: 'Offer + Purchase Path',
    description: 'We sharpen the offer, clarify the next step, and make the path to action easy to follow.',
  },
  {
    title: 'Automation Layer',
    description: 'We install follow-up, routing, and reminders so leads do not stall after the first click.',
  },
  {
    title: 'Tracking + Reporting',
    description: 'We install reporting so you can see what is driving leads, purchases, and revenue.',
  },
];

const includedItems = [
  'Conversion page or mini-site',
  'Lead capture and routing',
  'Follow-up sequence',
  'Purchase event tracking',
];

const installSections = [
  {
    eyebrow: 'Install 01',
    title: 'Offer + Purchase Path Installed',
    outcomes: [
      'Clarifies your promise, niche, and next step in one clean decision path.',
      'Defines the purchase event for your business instead of treating traffic as the goal.',
      'Turns your homepage and intake flow into a system built to convert attention into action.',
    ],
    artifact: (
      <div className="system-card system-card--form">
        <div className="system-card__header">
          <strong>Discovery Intake</strong>
          <span className="pill">Get Started</span>
        </div>
        <div className="system-form">
          <div>
            <label>Business URL</label>
            <span>yourbusiness.com</span>
          </div>
          <div>
            <label>Niche</label>
            <span>Remodeling</span>
          </div>
          <div>
            <label>Primary goal</label>
            <span>More leads</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: 'Install 02',
    title: 'Follow-up Automation Installed',
    outcomes: [
      'Routes inbound opportunities into a simple tracker your team can use right away.',
      'Creates the first layer of follow-up so response gaps stop killing momentum.',
      'Gives you a clear place to manage outreach, status, and handoff.',
    ],
    artifact: (
      <div className="system-card system-card--table">
        <div className="system-card__header">
          <strong>Client Intake Tracker</strong>
          <span className="pill pill--success">Live</span>
        </div>
        <div className="system-table">
          <div className="system-table__row system-table__row--head">
            <span>Company</span>
            <span>Contact</span>
            <span>Status</span>
          </div>
          <div className="system-table__row">
            <span>Brightline Roofing</span>
            <span>Sam Ortiz</span>
            <span>Qualified</span>
          </div>
          <div className="system-table__row">
            <span>Northside Dental</span>
            <span>Mia Chen</span>
            <span>Follow-up</span>
          </div>
          <div className="system-table__row">
            <span>Urban Build Co.</span>
            <span>Dion Price</span>
            <span>Booked</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: 'Install 03',
    title: 'Tracking + Reporting Installed',
    outcomes: [
      'Makes weekly performance visible without waiting on a custom dashboard project.',
      'Connects traffic, leads, purchases, and revenue to the path we installed.',
      'Shows what to improve next so decisions are based on signals instead of guesswork.',
    ],
    artifact: (
      <div className="system-card system-card--kpi">
        <div className="system-card__header">
          <strong>Weekly KPI Snapshot</strong>
          <span className="muted">Last 7 days</span>
        </div>
        <div className="kpi-grid">
          <div>
            <span>Traffic</span>
            <strong>4,280</strong>
          </div>
          <div>
            <span>Leads</span>
            <strong>73</strong>
          </div>
          <div>
            <span>Purchases</span>
            <strong>11</strong>
          </div>
          <div>
            <span>Revenue</span>
            <strong>$18.4k</strong>
          </div>
        </div>
      </div>
    ),
  },
];

const timelineSteps = [
  {
    label: 'Days 1-3',
    title: 'Discovery and purchase-event definition',
    detail: 'We define the niche, offer, friction points, and what purchase actually means for your business.',
  },
  {
    label: 'Days 4-7',
    title: 'Path and automation install',
    detail: 'We build the conversion flow, intake capture, and follow-up logic that moves opportunities forward.',
  },
  {
    label: 'Days 8-14',
    title: 'Tracking, handoff, and reporting view',
    detail: 'We wire reporting, admin visibility, and the operating artifacts your team uses after launch.',
  },
];

const nicheExamples = [
  {
    niche: 'Service businesses',
    purchaseEvent: 'Booked consult or on-site estimate',
  },
  {
    niche: 'Programs and education',
    purchaseEvent: 'Application, enrollment, or deposit paid',
  },
  {
    niche: 'B2B operators',
    purchaseEvent: 'Qualified lead booked into sales follow-up',
  },
];

const pricingOptions = [
  {
    eyebrow: 'Entry Point',
    title: 'Operator Diagnostic',
    audience: 'For teams that want the bottleneck identified before committing to the full install.',
    includes: [
      'Discovery review',
      'Purchase-path diagnosis',
      'Priority fixes and install recommendation',
    ],
    ctaLabel: 'Get Started',
    ctaHref: '/get-started',
    variant: 'secondary',
  },
  {
    eyebrow: 'Core Offer',
    title: 'AI Operator Install (14 days)',
    audience: 'For teams ready to install the path, automation, and reporting layer now.',
    includes: [
      'Conversion path install',
      'Follow-up and lead-routing setup',
      'Tracking, reporting, and operator view',
    ],
    ctaLabel: 'Book a Call',
    ctaHref: '/schedule?source=BOOK_A_CALL',
    variant: 'primary',
  },
];

const faqItems = [
  {
    question: 'What exactly gets installed?',
    answer:
      'The install focuses on the purchase path, intake capture, follow-up automation, and the reporting view needed to run it.',
  },
  {
    question: 'Is this software or a done-with-you build?',
    answer:
      'This is positioned as a build and install, not a generic AI platform. The offer is a clear system setup with defined deliverables.',
  },
  {
    question: 'What happens when I click Get Started?',
    answer:
      'It takes you to a dedicated intake page where you enter your business details, review the first-pass diagnostic, and then continue into scheduling.',
  },
  {
    question: 'What happens when I click Book a Call?',
    answer:
      'It opens the scheduling page so you can choose from the live call times that are still open.',
  },
];

export default function HomePage() {
  return (
    <main className="homepage homepage--install">
      <section className="install-hero">
        <div className="install-nav">
          <Link className="brand-lockup" to="/">
            <img alt="Nexoria" src={logoImage} />
            <div>
              <strong>Nexoria</strong>
            </div>
          </Link>

          <div className="install-nav__links">
            <a href="#how-it-works">How it works</a>
            <a href="#what-you-get">What you get</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="install-nav__actions">
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/schedule?source=BOOK_A_CALL">
              Book a Call
            </Link>
          </div>
        </div>

        <div className="install-hero__content">
          <div className="install-hero__copy">
            <h1>AI Operator</h1>
            <div className="install-hero__lede install-hero__points">
              <span>Purchase path installed</span>
              <span>Follow-up automated</span>
              <span>Reporting made clear</span>
            </div>

            <div className="hero-actions">
              <Link className="ghost-button" to="/get-started">
                Get Started
              </Link>
              <Link className="primary-button" to="/schedule?source=BOOK_A_CALL">
                Book a Call
              </Link>
            </div>

            <div className="install-pillars">
              {installPillars.map((pillar) => (
                <article className="tone-card install-pillar" key={pillar.title}>
                  <p className="eyebrow">{pillar.title}</p>
                  <p>{pillar.description}</p>
                </article>
              ))}
            </div>

            <div className="included-strip">
              <span className="included-strip__label">Included in the install</span>
              <div className="included-strip__items">
                {includedItems.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" id="what-you-get">
        <div className="section-heading">
          <p className="eyebrow">What you get</p>
          <h2>A client-conversion system, installed for you.</h2>
          <p className="muted">
            Instead of vague promises, Nexoria gives you the actual operating pieces needed to capture,
            follow up with, and convert demand.
          </p>
        </div>

        <div className="install-showcase">
          {installSections.map((section) => (
            <article className="install-showcase__row" key={section.title}>
              <div className="install-showcase__copy">
                <p className="eyebrow">{section.eyebrow}</p>
                <h3>{section.title}</h3>
                <ul className="install-outcomes">
                  {section.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>
              <div className="install-showcase__artifact">{section.artifact}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>How the install works.</h2>
          <p className="muted">
            We keep the scope tight so you can go from idea to working system fast without dragging the
            project out for months.
          </p>
        </div>

        <div className="timeline-grid">
          {timelineSteps.map((step) => (
            <article className="card timeline-card" key={step.title}>
              <span className="pill">{step.label}</span>
              <h3>{step.title}</h3>
              <p className="muted">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--split">
        <div className="section-heading">
          <p className="eyebrow">Niches + purchase event</p>
          <h2>Define the sale before you automate the funnel.</h2>
          <p className="muted">
            More traffic does not fix a broken path. We start by defining the event that matters most for
            your niche, then build around it.
          </p>
        </div>

        <div className="two-column install-comparison">
          <div className="card stack">
            <h3>Examples by niche</h3>
            <ul className="faq-list">
              {nicheExamples.map((example) => (
                <li key={example.niche}>
                  <strong>{example.niche}</strong>
                  <p className="muted">Purchase event: {example.purchaseEvent}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card stack">
            <h3>DIY tools vs installed system</h3>
            <ul className="comparison-list">
              <li>Buying tools does not give you a working conversion system.</li>
              <li>More traffic does not fix a broken purchase path.</li>
              <li>Nexoria installs the wiring, follow-up, and tracking together.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Pricing / entry points</p>
          <h2>Two clear ways to move forward.</h2>
          <p className="muted">
            No fake SaaS tiers. Just the two real next steps for a business that wants better conversion.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingOptions.map((option) => (
            <article
              className={option.variant === 'primary' ? 'card pricing-card pricing-card--primary' : 'card pricing-card'}
              key={option.title}
            >
              <p className="eyebrow">{option.eyebrow}</p>
              <h3>{option.title}</h3>
              <p className="muted">{option.audience}</p>
              <ul className="install-outcomes">
                {option.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className={option.variant === 'primary' ? 'primary-button' : 'ghost-button'} to={option.ctaHref}>
                {option.ctaLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Questions potential clients usually ask before they click.</h2>
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

      <section className="final-cta card" id="contact">
        <div>
          <p className="eyebrow">Final CTA</p>
          <h2>Stop losing leads to a weak follow-up and conversion path.</h2>
          <p className="muted">
            If you want a cleaner system for turning traffic into booked calls and purchases, this is the
            next step.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="ghost-button" to="/get-started">
            Get Started
          </Link>
          <Link className="primary-button" to="/schedule?source=BOOK_A_CALL">
            Book a Call
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
