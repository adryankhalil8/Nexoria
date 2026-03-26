export type ExternalSignal = {
  windspeed: number;
  weathercode: number;
  temperature: number;
};

export type FixRecommendation = {
  title: string;
  impact: string;
  effort: string;
  why: string;
};

export type BlueprintDraft = {
  url: string;
  industry: string;
  revenueRange: string;
  goals: string[];
  externalSignal?: ExternalSignal;
};

export type BlueprintSummary = {
  id: number;
  url: string;
  industry: string;
  revenueRange: string;
  score: number;
  readyForRetainer: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type BlueprintScoreResult = {
  score: number;
  readyForRetainer: boolean;
  fixes: FixRecommendation[];
};

export type Blueprint = BlueprintSummary & {
  goals: string[];
  fixes: FixRecommendation[];
  externalSignal?: ExternalSignal;
};

export type Option = {
  label: string;
  value: string;
};

export const INDUSTRY_OPTIONS: Option[] = [
  { label: 'Tech / SaaS', value: 'Tech / SaaS' },
  { label: 'Consulting', value: 'Consulting' },
  { label: 'Marketing Agency', value: 'Marketing Agency' },
  { label: 'E-commerce', value: 'E-commerce' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Remodeling', value: 'Remodeling' },
  { label: 'Other', value: 'Other' },
];

export const REVENUE_OPTIONS: Option[] = [
  { label: 'Under $5k/mo', value: 'Under $5k/mo' },
  { label: '$5k-$10k/mo', value: '$5kâ€“$10k/mo' },
  { label: '$10k-$50k/mo', value: '$10kâ€“$50k/mo' },
  { label: '$50k-$200k/mo', value: '$50kâ€“$200k/mo' },
  { label: '$200k+/mo', value: '$200k+/mo' },
];

export const GOAL_OPTIONS: Option[] = [
  { label: 'More leads', value: 'More leads' },
  { label: 'Better retention', value: 'Better retention' },
  { label: 'Automate tasks', value: 'Automate tasks' },
  { label: 'Grow revenue', value: 'Grow revenue' },
  { label: 'Improve SEO', value: 'Improve SEO' },
];

const FIX_MAP: Record<string, FixRecommendation> = {
  automation: {
    title: 'Implement workflow automation',
    impact: 'High',
    effort: 'Medium',
    why: 'Manual processes are your biggest time drain. Automating lead follow-up and invoicing alone saves 8-12 hrs/week.',
  },
  leads: {
    title: 'Build a lead capture funnel',
    impact: 'High',
    effort: 'Medium',
    why: 'No systematic funnel means you rely on referrals. A simple landing page and email sequence can multiply inbound leads.',
  },
  retention: {
    title: 'Launch a client retention sequence',
    impact: 'High',
    effort: 'Low',
    why: 'Retaining existing clients is cheaper than acquiring new ones. A nurture sequence is usually the fastest win.',
  },
  seo: {
    title: 'Optimize on-page SEO',
    impact: 'Medium',
    effort: 'Low',
    why: 'Missing metadata and slow load times suppress organic traffic. Quick wins are available in under a day.',
  },
  analytics: {
    title: 'Set up conversion tracking',
    impact: 'High',
    effort: 'Low',
    why: "You can't improve what you don't measure. A simple analytics setup unlocks data-driven decisions quickly.",
  },
  payments: {
    title: 'Streamline payment and invoicing',
    impact: 'Medium',
    effort: 'Low',
    why: 'Late payments hurt cash flow. Automated invoicing reduces collection time significantly.',
  },
  social: {
    title: 'Systemize social content',
    impact: 'Medium',
    effort: 'Medium',
    why: 'Inconsistent posting kills reach. A short content calendar and scheduler creates repeatability.',
  },
  crm: {
    title: 'Deploy a lightweight CRM',
    impact: 'High',
    effort: 'Medium',
    why: 'Spreadsheets lead to missed follow-ups. A CRM pipeline keeps revenue opportunities visible.',
  },
  reporting: {
    title: 'Build an automated weekly report',
    impact: 'Medium',
    effort: 'Low',
    why: 'Stakeholders need visibility. Automated reporting reduces status-call overhead and improves trust.',
  },
  lowRevenue: {
    title: 'Introduce a recurring revenue offer',
    impact: 'High',
    effort: 'High',
    why: 'Project-based income is unpredictable. A retainer or subscription offer stabilizes cash flow.',
  },
  externalSignal: {
    title: 'Monitor external market conditions',
    impact: 'Low',
    effort: 'Low',
    why: 'Macro and weather signals can affect demand. Even a lightweight alert view adds useful context.',
  },
};

const GOAL_TO_FIX: Record<string, string[]> = {
  'More leads': ['leads', 'seo', 'social'],
  'Better retention': ['retention', 'crm', 'analytics'],
  'Automate tasks': ['automation', 'reporting', 'payments'],
  'Grow revenue': ['lowRevenue', 'leads', 'automation'],
  'Improve SEO': ['seo', 'analytics', 'social'],
};

const INDUSTRY_SCORES: Record<string, number> = {
  Remodeling: 72,
  'Marketing Agency': 68,
  Consulting: 74,
  'E-commerce': 65,
  Healthcare: 58,
  'Real Estate': 70,
  'Tech / SaaS': 80,
  Other: 63,
};

const REVENUE_SCORES: Record<string, number> = {
  'Under $5k/mo': 30,
  '$5kâ€“$10k/mo': 45,
  '$10kâ€“$50k/mo': 60,
  '$50kâ€“$200k/mo': 75,
  '$200k+/mo': 90,
};

const RETAINER_THRESHOLD = 45;
const RETAINER_REVENUE_OPTIONS = new Set(['$10kâ€“$50k/mo', '$50kâ€“$200k/mo', '$200k+/mo']);

export function getOptionLabel(options: Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function computeBlueprintPreview(draft: BlueprintDraft): BlueprintScoreResult {
  const industryBase = INDUSTRY_SCORES[draft.industry] ?? 63;
  const revenueBase = REVENUE_SCORES[draft.revenueRange] ?? 50;
  const goalBonus = Math.min(draft.goals.length * 5, 20);
  const extNorm = Math.min((draft.externalSignal?.windspeed ?? 10) / 100, 1);
  const extBonus = Math.round(extNorm * 30);

  const raw =
    (industryBase / 100) * 20 +
    (revenueBase / 100) * 20 +
    (goalBonus / 20) * 30 +
    (extBonus / 30) * 30;

  const score = Math.min(100, Math.max(1, Math.round(raw)));
  const readyForRetainer = score <= RETAINER_THRESHOLD && RETAINER_REVENUE_OPTIONS.has(draft.revenueRange);
  const fixes = buildFixes(draft.goals);

  return { score, readyForRetainer, fixes };
}

function buildFixes(goals: string[]): FixRecommendation[] {
  const selected = new Set<string>();

  goals.forEach((goal) => {
    (GOAL_TO_FIX[goal] ?? []).forEach((key) => {
      if (selected.size < 4) {
        selected.add(key);
      }
    });
  });

  selected.add('externalSignal');

  ['analytics', 'crm', 'reporting', 'seo', 'automation'].forEach((fallback) => {
    if (selected.size < 5) {
      selected.add(fallback);
    }
  });

  return Array.from(selected)
    .slice(0, 5)
    .map((key) => FIX_MAP[key]);
}
