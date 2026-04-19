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
  owner: TaskOwner;
  status: TaskStatus;
  clientVisible: boolean;
};

export type BlueprintDraft = {
  url: string;
  industry: string;
  revenueRange: string;
  clientEmail?: string;
  goals: string[];
  externalSignal?: ExternalSignal;
};

export type BlueprintSummary = {
  id: number;
  url: string;
  industry: string;
  revenueRange: string;
  clientEmail?: string;
  score: number;
  readyForRetainer: boolean;
  status: BlueprintPortalStatus;
  purchaseEventType: PurchaseEventType;
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

export type BlueprintPortalStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ARCHIVED';
export type PurchaseEventType = 'PURCHASE' | 'DEPOSIT' | 'BOOKED_JOB';
export type TaskOwner = 'CLIENT' | 'NEXORIA' | 'SHARED';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';

export type BlueprintTask = {
  id: string;
  blueprintId: number;
  title: string;
  why: string;
  impact: string;
  effort: string;
  owner: TaskOwner;
  status: TaskStatus;
  dueLabel: string;
  steps: string[];
  resources: { label: string; href: string }[];
  comments: string[];
};

export type ClientBlueprintView = {
  blueprintId: number;
  name: string;
  industry: string;
  url: string;
  goals: string[];
  status: BlueprintPortalStatus;
  purchaseEventType: PurchaseEventType;
  score: number;
  diagnosis: string;
  installChecklist: string[];
  tasks: BlueprintTask[];
  weeklyNotes: string[];
  metrics: {
    leads7d: number;
    purchases7d: number;
    conversionRate: string;
    revenue7d: string;
    trackingConnected: boolean;
    missingIntegrations: string[];
  };
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
  { label: '$5k-$10k/mo', value: '$5k-$10k/mo' },
  { label: '$10k-$50k/mo', value: '$10k-$50k/mo' },
  { label: '$50k-$200k/mo', value: '$50k-$200k/mo' },
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
  automation: createFix(
    'Implement workflow automation',
    'High',
    'Medium',
    'Manual processes are your biggest time drain. Automating lead follow-up and invoicing alone saves 8-12 hrs/week.'
  ),
  leads: createFix(
    'Build a lead capture funnel',
    'High',
    'Medium',
    'No systematic funnel means you rely on referrals. A simple landing page and email sequence can multiply inbound leads.'
  ),
  retention: createFix(
    'Launch a client retention sequence',
    'High',
    'Low',
    'Retaining existing clients is cheaper than acquiring new ones. A nurture sequence is usually the fastest win.'
  ),
  seo: createFix(
    'Optimize on-page SEO',
    'Medium',
    'Low',
    'Missing metadata and slow load times suppress organic traffic. Quick wins are available in under a day.'
  ),
  analytics: createFix(
    'Set up conversion tracking',
    'High',
    'Low',
    "You can't improve what you don't measure. A simple analytics setup unlocks data-driven decisions quickly."
  ),
  payments: createFix(
    'Streamline payment and invoicing',
    'Medium',
    'Low',
    'Late payments hurt cash flow. Automated invoicing reduces collection time significantly.'
  ),
  social: createFix(
    'Systemize social content',
    'Medium',
    'Medium',
    'Inconsistent posting kills reach. A short content calendar and scheduler creates repeatability.'
  ),
  crm: createFix(
    'Deploy a lightweight CRM',
    'High',
    'Medium',
    'Spreadsheets lead to missed follow-ups. A CRM pipeline keeps revenue opportunities visible.'
  ),
  reporting: createFix(
    'Build an automated weekly report',
    'Medium',
    'Low',
    'Stakeholders need visibility. Automated reporting reduces status-call overhead and improves trust.'
  ),
  lowRevenue: createFix(
    'Introduce a recurring revenue offer',
    'High',
    'High',
    'Project-based income is unpredictable. A retainer or subscription offer stabilizes cash flow.'
  ),
  externalSignal: createFix(
    'Monitor external market conditions',
    'Low',
    'Low',
    'Macro and weather signals can affect demand. Even a lightweight alert view adds useful context.'
  ),
};

function createFix(title: string, impact: string, effort: string, why: string): FixRecommendation {
  return {
    title,
    impact,
    effort,
    why,
    owner: 'NEXORIA',
    status: 'NOT_STARTED',
    clientVisible: true,
  };
}

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
  '$5k-$10k/mo': 45,
  '$10k-$50k/mo': 60,
  '$50k-$200k/mo': 75,
  '$200k+/mo': 90,
};

const RETAINER_THRESHOLD = 45;
const RETAINER_REVENUE_OPTIONS = new Set(['$10k-$50k/mo', '$50k-$200k/mo', '$200k+/mo']);

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

export function buildClientBlueprintView(blueprint: Blueprint): ClientBlueprintView {
  const visibleFixes = blueprint.fixes.filter((fix) => fix.clientVisible);
  const tasks = visibleFixes.map((fix, index) => {
    return {
      id: `${blueprint.id}-${index + 1}`,
      blueprintId: blueprint.id,
      title: fix.title,
      why: fix.why,
      impact: fix.impact,
      effort: fix.effort,
      owner: fix.owner,
      status: fix.status,
      dueLabel: index === 0 ? 'This week' : index === 1 ? 'Next up' : `Week ${index + 1}`,
      steps: [
        fix.owner === 'CLIENT' ? 'Provide any needed access, copy, or approval.' : 'Review the current state and confirm the install scope.',
        'Implement the recommended change in the live path.',
        'Review the result and mark the task complete once verified.',
      ],
      resources: [
        { label: 'Live website', href: blueprint.url },
        { label: 'Blueprint detail', href: `/admin/blueprints/${blueprint.id}` },
      ],
      comments: [
        fix.owner === 'CLIENT'
          ? 'Waiting on client input before this can move forward.'
          : fix.owner === 'SHARED'
            ? 'Needs review from both sides before we close it out.'
            : 'Work is underway on the Nexoria side.',
      ],
    };
  });

  const purchases7d = Math.max(1, Math.round(blueprint.score / 12));
  const leads7d = Math.max(6, purchases7d * 5 + blueprint.goals.length * 2);
  const conversionRate = `${Math.max(2, Math.min(35, Math.round((purchases7d / leads7d) * 100)))}%`;
  const revenue7d = `$${(purchases7d * 1750).toLocaleString()}`;

  return {
    blueprintId: blueprint.id,
    name: `${blueprint.industry} Growth Blueprint`,
    industry: blueprint.industry,
    url: blueprint.url,
    goals: blueprint.goals,
    status: blueprint.status,
    purchaseEventType: blueprint.purchaseEventType,
    score: blueprint.score,
    diagnosis: `Your current path is creating interest, but the system still needs tighter follow-up, clearer handoff, and better visibility into what converts.`,
    installChecklist: [
      'Offer and CTA path approved',
      'Lead capture and routing configured',
      'Top priorities assigned with ownership',
      'Reporting cadence established',
    ],
    tasks,
    weeklyNotes: [
      'Homepage and intake path are aligned around the current offer.',
      'Next priority is moving the highest-impact task to complete and unblocking anything waiting on approval.',
      'We will keep measuring progress against the purchase event rather than generic traffic alone.',
    ],
    metrics: {
      leads7d,
      purchases7d,
      conversionRate,
      revenue7d,
      trackingConnected: Boolean(blueprint.externalSignal),
      missingIntegrations: blueprint.externalSignal ? [] : ['Analytics access', 'Calendar or booking data'],
    },
  };
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
