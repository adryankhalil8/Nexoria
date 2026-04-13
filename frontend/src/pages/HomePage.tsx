import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

import {
  GOAL_OPTIONS,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
  computeBlueprintPreview,
} from '../model/blueprint';

export const HOMEPAGE_BLUEPRINT_DRAFT_KEY = 'nexoria-home-blueprint-draft';
const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

const installPillars = [
  {
    title: 'Offer + Purchase Path',
    description: 'We tighten the page, CTA flow, and purchase event so the path to yes is obvious.',
  },
  {
    title: 'Automation Layer',
    description: 'We wire follow-up, routing, and reminders so leads do not stall in someone’s inbox.',
  },
  {
    title: 'Tracking + Reporting',
    description: 'We install the scorecard so you can see traffic, leads, purchases, and revenue clearly.',
  },
];

const includedItems = [
  'Conversion page / mini-site',
  'Lead capture + routing',
  'Follow-up sequence',
  'Purchase event tracking',
];

const installSections = [
  {
    eyebrow: 'Install 01',
    title: 'Offer + Purchase Path Installed',
    outcomes: [
      'Clarifies the promise, niche, and next step in one tight page.',
      'Defines the purchase event for your business instead of treating “traffic” as the goal.',
      'Turns the homepage and intake flow into one connected decision path.',
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
      'Routes inbound opportunities into a simple operating tracker your team can use fast.',
      'Creates the first layer of follow-up so manual response gaps stop killing momentum.',
      'Gives you a clean place to manage outreach, status, and handoff.',
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
      'Makes weekly performance visible without waiting for a custom dashboard project.',
      'Connects traffic, leads, purchases, and revenue to the installed path.',
      'Creates the operating rhythm for what to improve next instead of guessing.',
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
    title: 'Discovery + purchase event definition',
    detail: 'We define the niche, offer, friction points, and what “purchase” actually means for your business.',
  },
  {
    label: 'Days 4-7',
    title: 'Path and automation install',
    detail: 'We build the conversion flow, intake capture, and follow-up logic that moves opportunities forward.',
  },
  {
    label: 'Days 8-14',
    title: 'Tracking, handoff, and operator view',
    detail: 'We wire reporting, admin visibility, and the operational artifacts your team uses after launch.',
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
    audience: 'For teams that need the bottleneck identified before a full build.',
    includes: [
      'Discovery review',
      'Purchase-path diagnosis',
      'Priority fixes and install recommendation',
    ],
    ctaLabel: 'Get Started',
    ctaHref: '#discovery',
    variant: 'secondary',
  },
  {
    eyebrow: 'Core Offer',
    title: 'AI Operator Install (14 days)',
    audience: 'For teams ready to install the path, automation, and reporting layer now.',
    includes: [
      'Conversion path install',
      'Follow-up and lead routing setup',
      'Tracking, reporting, and admin operating view',
    ],
    ctaLabel: 'Book a Call',
    ctaHref: 'mailto:hello@nexoria.co?subject=Book%20a%20Call',
    variant: 'primary',
  },
];

const faqItems = [
  {
    question: 'What exactly gets installed?',
    answer:
      'The install focuses on the purchase path, intake capture, follow-up automation, and the reporting view needed to operate it.',
  },
  {
    question: 'Is this a software subscription or a done-with-you build?',
    answer:
      'The positioning here is a build and install, not a pretend all-purpose AI platform. The page sells a system setup with clear deliverables.',
  },
  {
    question: 'What does Get Started do?',
    answer:
      'It opens the discovery intake flow so we can capture your business context and move you into account creation or the protected blueprint workflow.',
  },
  {
    question: 'What does Book a Call do?',
    answer:
      'Right now it opens the call request path so you can start a conversation directly while scheduling is still being finalized.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('Remodeling');
  const [revenueRange, setRevenueRange] = useState('Under $5k/mo');
  const [goals, setGoals] = useState<string[]>(['More leads']);

  const preview = useMemo(
    () =>
      computeBlueprintPreview({
        url: url || 'https://yourbusiness.com',
        industry,
        revenueRange,
        goals,
      }),
    [goals, industry, revenueRange, url]
  );

  function toggleGoal(goal: string) {
    setGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]
    );
  }

  function sendToBlueprintFlow(event: FormEvent) {
    event.preventDefault();

    sessionStorage.setItem(
      HOMEPAGE_BLUEPRINT_DRAFT_KEY,
      JSON.stringify({
        url,
        industry,
        revenueRange,
        goals,
      })
    );

    if (localStorage.getItem('nexoria-token')) {
      navigate('/admin/blueprints/new');
      return;
    }

    navigate('/register?next=/admin/blueprints/new');
  }

  return (
    <main className="homepage homepage--install">
      <section className="install-hero">
        <div className="install-nav">
          <Link className="brand-lockup" to="/">
            <img alt="Nexoria" src={logoImage} />
            <div>
              <strong>Nexoria</strong>
              <p>AI operator install</p>
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
            <a className="primary-button" href="mailto:hello@nexoria.co?subject=Book%20a%20Call">
              Book a Call
            </a>
          </div>
        </div>

        <div className="install-hero__content">
          <div className="install-hero__copy">
            <p className="eyebrow">System install</p>
            <h1>AI Operator Install. Revenue system built in 14 days.</h1>
            <p className="muted install-hero__lede">
              We install the purchase path, follow-up automation, and tracking so you generate purchases
              with less manual work.
            </p>

            <div className="hero-actions">
              <a className="ghost-button" href="#discovery">
                Get Started
              </a>
              <a className="primary-button" href="mailto:hello@nexoria.co?subject=Book%20a%20Call">
                Book a Call
              </a>
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
              <span className="included-strip__label">What&apos;s included</span>
              <div className="included-strip__items">
                {includedItems.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="install-hero__panel card">
            <div className="system-card system-card--stack">
              <div className="system-card__header">
                <strong>Operator view</strong>
                <span className="pill">14-day install</span>
              </div>
              <div className="system-stack">
                <div>
                  <span>Path</span>
                  <strong>Homepage to intake to purchase event</strong>
                </div>
                <div>
                  <span>Automation</span>
                  <strong>Lead routing + follow-up sequence</strong>
                </div>
                <div>
                  <span>Reporting</span>
                  <strong>Traffic, leads, purchases, revenue</strong>
                </div>
              </div>
            </div>

            <div className="hero-metrics">
              <div>
                <strong>{preview.score}/100</strong>
                <span>Blueprint score preview</span>
              </div>
              <div>
                <strong>{goals.length}</strong>
                <span>Goals selected</span>
              </div>
              <div>
                <strong>{preview.fixes.length}</strong>
                <span>Priority fixes surfaced</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="home-section" id="what-you-get">
        <div className="section-heading">
          <p className="eyebrow">What you get</p>
          <h2>Installed outcomes, not vague platform promises.</h2>
          <p className="muted">
            The page needs to prove the system is real, so each section shows the artifacts a business
            actually operates with after the install.
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
          <h2>One install, delivered over 14 days.</h2>
          <p className="muted">
            This gives the offer structure and makes the timeline believable without pretending there is a
            giant team hiding behind the curtain.
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
            More traffic does not solve a broken purchase path. The install starts by defining the event
            that matters for the niche.
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
              <li>Tools do not equal a working system.</li>
              <li>More traffic does not fix a broken purchase path.</li>
              <li>The install includes wiring, follow-up, and tracking together.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Pricing / entry points</p>
          <h2>Two ways to move forward.</h2>
          <p className="muted">
            This stays clean and honest by showing the real entry choices instead of fake SaaS tiers.
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
              <a
                className={option.variant === 'primary' ? 'primary-button' : 'ghost-button'}
                href={option.ctaHref}
              >
                {option.ctaLabel}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="discovery">
        <div className="section-heading">
          <p className="eyebrow">Get started</p>
          <h2>Run the discovery intake, then continue into the protected build flow.</h2>
          <p className="muted">
            This is the live handoff point between the landing page and the installed operator workspace.
          </p>
        </div>

        <div className="two-column two-column--home">
          <form className="card stack-form diagnostic-card" onSubmit={sendToBlueprintFlow}>
            <label>
              Website URL
              <input
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://yourbusiness.com"
                type="url"
                value={url}
              />
            </label>

            <label>
              Industry
              <select onChange={(event) => setIndustry(event.target.value)} value={industry}>
                {INDUSTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Monthly Revenue Range
              <select onChange={(event) => setRevenueRange(event.target.value)} value={revenueRange}>
                {REVENUE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="goal-grid">
              <legend>Goals</legend>
              {GOAL_OPTIONS.map((goal) => (
                <label className={goals.includes(goal.value) ? 'choice choice--active' : 'choice'} key={goal.value}>
                  <input
                    checked={goals.includes(goal.value)}
                    onChange={() => toggleGoal(goal.value)}
                    type="checkbox"
                  />
                  <span>{goal.label}</span>
                </label>
              ))}
            </fieldset>

            <button className="primary-button" type="submit">
              Get Started
            </button>
          </form>

          <div className="card stack">
            <div className="preview-header">
              <div>
                <p className="eyebrow">Installed preview</p>
                <h3>What the first pass is surfacing</h3>
              </div>
              <span className={preview.readyForRetainer ? 'pill pill--success' : 'pill'}>
                {preview.readyForRetainer ? 'Install Ready' : 'Needs Work'}
              </span>
            </div>

            <ul className="fix-list">
              {preview.fixes.map((fix) => (
                <li key={fix.title}>
                  <div className="fix-list__header">
                    <strong>{fix.title}</strong>
                    <span className="muted">
                      {fix.impact} impact | {fix.effort} effort
                    </span>
                  </div>
                  <p className="muted">{fix.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section" id="faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Short answers for the objections that actually matter.</h2>
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
          <h2>Stop leaking leads. Install the purchase path.</h2>
          <p className="muted">
            Choose the path that fits your next move: run discovery now or start the conversation with a
            call.
          </p>
        </div>
        <div className="hero-actions">
          <a className="ghost-button" href="#discovery">
            Get Started
          </a>
          <a className="primary-button" href="mailto:hello@nexoria.co?subject=Book%20a%20Call">
            Book a Call
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
