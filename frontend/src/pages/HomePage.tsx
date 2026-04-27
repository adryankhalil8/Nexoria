import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

const installPillars = [
  {
    title: 'Capture',
    description: 'Turn calls, forms, and DMs into a clear next step before the lead cools off.',
  },
  {
    title: 'Follow Up',
    description: 'Route missed calls, stale estimates, and quote requests into a response path.',
  },
  {
    title: 'Track',
    description: 'See which inquiries become booked jobs, deposits, inspections, or callbacks.',
  },
];



const installSections = [
  {
    eyebrow: 'Install 01',
    title: 'Deposit Funnel Install',
    outcomes: [
      'Collect commitment before dispatch, diagnostics, appointments, or estimates.',
      'Filter no-shows and track the deposit or booked-job event.',
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
      'Capture job details before pricing, quoting, or scheduling.',
      'Move the right prospects toward a quote request, inspection, or callback.',
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
      'Recover missed calls, stale leads, and unclosed estimates.',
      'Add response coverage so interested buyers do not disappear.',
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
    title: 'Find the leak',
    detail: 'Map where inquiries slow down, get lost, or fail to turn into a real next step.',
  },
  {
    label: 'Days 4-10',
    title: 'Install the path',
    detail: 'Build the quote/deposit path, routing, reminders, and response layer around one event.',
  },
  {
    label: 'Days 11-14',
    title: 'Handoff and track',
    detail: 'Approve the blueprint, open the client portal, and show the results view.',
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
  'Intake',
  'Operator Diagnostic',
  'Admin review',
  'Approved blueprint',
  'Execution',
  'Support and results',
];

const pricingOptions = [
  {
    eyebrow: 'Entry Point',
    title: 'Operator Diagnostic',
    audience: 'A 45-minute working call to find the closest bottleneck to booked jobs or deposits.',
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
    audience: 'The quote/deposit path, follow-up layer, response coverage, and reporting installed in 14 days.',
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
            <Link to="/faq">FAQ</Link>
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
            <p className="eyebrow"></p>
            <h1>Operator Install</h1>
            <p className="install-hero__lede">
            </p>
            <div className="install-hero__lede install-hero__points">
              <span>Booked jobs</span>
              <span>Paid deposits</span>
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

            
          </div>
        </div>
      </section>

      <section className="home-section" id="what-you-get">
        <div className="section-heading">
          <p className="eyebrow">What you get</p>
          <h2>Systemized Process</h2>
          <p className="muted">
            Calls, views, DMs, and quote requests should not sit in scattered inboxes. Nexoria connects the
            intake, booking, follow-up, and reporting around one measurable outcome.
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
          <h2>Dignostic to Hand-Off</h2>
          <p className="muted">
            Start with a diagnostic. Leave with a client-ready blueprint, installed workflows, and a portal
            that shows what happens next.
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

      

      <section className="home-section" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Pricing / entry point</p>
          <h2>Start with the leak. Install only what moves the number.</h2>
          <p className="muted">
            No loose menu of websites, bots, or dashboards. The install is scoped around booked jobs,
            deposits, quote requests, inspections, appointments, or callbacks.
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

      <section className="final-cta card" id="contact">
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
