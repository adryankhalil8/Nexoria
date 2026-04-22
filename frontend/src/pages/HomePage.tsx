import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

const installPillars = [
  {
    title: 'Booking Path',
    description: 'A landing page and intake path built around booked jobs, deposits, qualified quote requests, inspections, appointments, or callbacks.',
  },
  {
    title: 'Follow-up Layer',
    description: 'Missed calls, stale estimates, form fills, and DMs get routed into a response system instead of sitting untracked.',
  },
  {
    title: 'Operator Console',
    description: 'Nexoria manages leads, scheduled diagnostics, blueprints, client-visible fixes, support, and results from one protected workspace.',
  },
];

const includedItems = [
  'Landing page or quote path',
  'Lead intake and scheduling',
  'Follow-up automations',
  'AI-assisted response layer',
  'Booked-job and deposit reporting',
];

const installSections = [
  {
    eyebrow: 'Install 01',
    title: 'Deposit Funnel Install',
    outcomes: [
      'For service businesses that need commitment before dispatch, diagnostic, appointment, or estimate.',
      'Clarifies the job value, service area, urgency, and next step before your team spends time chasing.',
      'Tracks the deposit or booked-job event instead of stopping at a form submission.',
    ],
    artifact: (
      <div className="system-card system-card--form">
        <div className="system-card__header">
          <strong>Deposit Path</strong>
          <span className="pill">Ready</span>
        </div>
        <div className="system-form">
          <div>
            <label>Service Needed</label>
            <span>HVAC diagnostic</span>
          </div>
          <div>
            <label>Service Area</label>
            <span>North Atlanta</span>
          </div>
          <div>
            <label>Event</label>
            <span>Deposit or booked job</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: 'Install 02',
    title: 'Quote-Request Funnel Install',
    outcomes: [
      'For businesses that need cleaner job details before pricing, quoting, or scheduling.',
      'Captures the information your team needs to qualify the work and avoid back-and-forth.',
      'Moves inquiries toward a qualified quote request, inspection, appointment, or callback.',
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
            <span>Need</span>
            <span>Status</span>
          </div>
          <div className="system-table__row">
            <span>Brightline Roofing</span>
            <span>Storm repair</span>
            <span>Inspection</span>
          </div>
          <div className="system-table__row">
            <span>Northside HVAC</span>
            <span>No heat</span>
            <span>Booked</span>
          </div>
          <div className="system-table__row">
            <span>Urban Concrete Co.</span>
            <span>Driveway quote</span>
            <span>Callback</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: 'Install 03',
    title: 'Missed-Lead Follow-Up Install',
    outcomes: [
      'For businesses with missed calls, stale leads, unclosed estimates, or no reactivation system.',
      'Adds response-speed coverage so interested prospects do not disappear before a human gets to them.',
      'Shows what is happening after the inquiry: follow-up, booking, deposit, handoff, and results state.',
    ],
    artifact: (
      <div className="system-card system-card--kpi">
        <div className="system-card__header">
          <strong>Weekly Service Snapshot</strong>
          <span className="muted">Last 7 days</span>
        </div>
        <div className="kpi-grid">
          <div>
            <span>Inquiries</span>
            <strong>73</strong>
          </div>
          <div>
            <span>Callbacks</span>
            <strong>41</strong>
          </div>
          <div>
            <span>Booked Jobs</span>
            <strong>16</strong>
          </div>
          <div>
            <span>Deposits</span>
            <strong>$8.4k</strong>
          </div>
        </div>
      </div>
    ),
  },
];

const timelineSteps = [
  {
    label: 'Days 1-3',
    title: 'Leak diagnosis and event definition',
    detail: 'We map where calls, forms, DMs, quote requests, and estimates are slowing down or going dark.',
  },
  {
    label: 'Days 4-10',
    title: 'Booking path and follow-up install',
    detail: 'We install the landing page, quote/deposit path, routing, reminders, and AI-assisted response layer around the chosen event.',
  },
  {
    label: 'Days 11-14',
    title: 'Blueprint approval, handoff, and reporting',
    detail: 'We approve the client-ready blueprint, expose the right fixes in the portal, and show the results structure your team will use.',
  },
];

const industries = [
  'Mechanics / auto repair',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Landscaping',
  'Cleaning',
  'Mobile detailing',
  'Appliance repair',
  'Pest control',
  'Junk removal',
  'Concrete / flooring / remodeling',
];

const workflowSteps = [
  'Visitor interest',
  'Intake',
  'Operator Diagnostic',
  'Admin review',
  'Qualified client account',
  'Approved blueprint',
  'Execution tasks',
  'Support and results',
];

const pricingOptions = [
  {
    eyebrow: 'Entry Point',
    title: 'Operator Diagnostic',
    audience: 'A 45-minute working call to map the leak, identify the closest bottleneck to booked jobs or deposits, and decide whether a 14-day install makes sense.',
    includes: [
      'Lead-flow review',
      'Booking or deposit bottleneck diagnosis',
      'Priority fixes and install recommendation',
    ],
    ctaLabel: 'Get Started',
    ctaHref: '/get-started',
    variant: 'secondary',
  },
  {
    eyebrow: 'Core Offer',
    title: 'Booked-Job System Install',
    audience: 'For blue-collar service businesses ready to install the quote/deposit path, follow-up layer, response coverage, and reporting in 14 days.',
    includes: [
      'Landing page or service intake path',
      'Follow-up and lead-routing setup',
      'Blueprint, client portal, support, and results view',
    ],
    ctaLabel: 'Book Operator Diagnostic',
    ctaHref: '/schedule?source=BOOK_A_CALL',
    variant: 'primary',
  },
];

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
            <a href="#industries">Industries</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="install-nav__actions">
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/schedule?source=BOOK_A_CALL">
              Book Operator Diagnostic
            </Link>
          </div>
        </div>

        <div className="install-hero__content">
          <div className="install-hero__copy">
            <p className="eyebrow">14-day blue-collar service install</p>
            <h1>Turn more service inquiries into booked jobs.</h1>
            <p className="install-hero__lede">
              Nexoria installs the quote/deposit path, follow-up automations, AI-assisted response layer,
              and reporting dashboard for blue-collar service businesses in 14 days.
            </p>
            <div className="install-hero__lede install-hero__points">
              <span>Booked jobs</span>
              <span>Paid deposits</span>
              <span>Quote requests</span>
              <span>Inspections</span>
              <span>Callbacks</span>
            </div>

            <div className="hero-actions">
              <Link className="primary-button" to="/get-started">
                Get Started
              </Link>
              <Link className="ghost-button" to="/schedule?source=BOOK_A_CALL">
                Book Operator Diagnostic
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
          <h2>A booked-job and deposit system, installed for you.</h2>
          <p className="muted">
            Most service businesses do not lose money because nobody is interested. They lose money because
            calls, DMs, forms, and quote requests move too slowly or get lost before a customer books.
            Nexoria installs the system that captures the inquiry, routes it, follows up, and tracks the
            booked-job or deposit event.
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
          <h2>From inquiry to install handoff.</h2>
          <p className="muted">
            The sale does not end at a form submission. The visitor moves into a guided diagnostic,
            blueprint, implementation, and handoff process.
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

      <section className="home-section home-section--split" id="industries">
        <div className="section-heading">
          <p className="eyebrow">Built for service operators</p>
          <h2>For businesses where every missed inquiry can become lost revenue.</h2>
          <p className="muted">
            Nexoria is for real service teams dealing with response speed, dispatch, diagnostic fees,
            service areas, no-shows, stale estimates, reviews, proof, and follow-up.
          </p>
        </div>

        <div className="two-column install-comparison">
          <div className="card stack">
            <h3>Target industries</h3>
            <div className="pill-row">
              {industries.map((industry) => (
                <span className="chip" key={industry}>
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="card stack">
            <h3>Operating workflow</h3>
            <ul className="comparison-list">
              {workflowSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Pricing / entry point</p>
          <h2>Start with the diagnostic, then install the system.</h2>
          <p className="muted">
            No disconnected service menu. Nexoria diagnoses the leak, then installs the system around one
            measurable service event.
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
          <h2>What service business owners usually ask before they book.</h2>
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
          <h2>Find the leak in your lead-to-job path.</h2>
          <p className="muted">
            Book a 45-minute Operator Diagnostic. We will map where leads are leaking, identify the closest
            bottleneck to booked jobs or deposits, and decide whether a 14-day install makes sense.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" to="/get-started">
            Start Intake
          </Link>
          <Link className="ghost-button" to="/schedule?source=BOOK_A_CALL">
            Book Operator Diagnostic
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
