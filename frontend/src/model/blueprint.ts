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
  status?: BlueprintPortalStatus;
  purchaseEventType?: PurchaseEventType;
  fixes?: FixRecommendation[];
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
  { label: 'Mechanics / auto repair', value: 'Mechanics / auto repair' },
  { label: 'HVAC', value: 'HVAC' },
  { label: 'Plumbing', value: 'Plumbing' },
  { label: 'Electrical', value: 'Electrical' },
  { label: 'Roofing', value: 'Roofing' },
  { label: 'Landscaping', value: 'Landscaping' },
  { label: 'Cleaning', value: 'Cleaning' },
  { label: 'Mobile detailing', value: 'Mobile detailing' },
  { label: 'Appliance repair', value: 'Appliance repair' },
  { label: 'Pest control', value: 'Pest control' },
  { label: 'Junk removal', value: 'Junk removal' },
  { label: 'Concrete / flooring / remodeling', value: 'Concrete / flooring / remodeling' },
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
  { label: 'Book more jobs', value: 'Book more jobs' },
  { label: 'Collect paid deposits', value: 'Collect paid deposits' },
  { label: 'Qualify quote requests', value: 'Qualify quote requests' },
  { label: 'Recover missed calls', value: 'Recover missed calls' },
  { label: 'Follow up stale estimates', value: 'Follow up stale estimates' },
  { label: 'Improve response speed', value: 'Improve response speed' },
];

const FIX_MAP: Record<string, FixRecommendation> = {
  responseLayer: createFix(
    'Install AI-assisted response coverage',
    'High',
    'Medium',
    'Slow replies turn interested service inquiries into lost jobs. Response coverage keeps calls, forms, and DMs moving toward a real next step.'
  ),
  bookingPath: createFix(
    'Build the booked-job intake path',
    'High',
    'Medium',
    'The current path needs to capture the service need, urgency, area, and contact details before the lead cools off.'
  ),
  depositPath: createFix(
    'Add a deposit commitment step',
    'High',
    'Low',
    'A paid diagnostic, dispatch fee, or appointment deposit filters no-shows and creates commitment before your team spends time.'
  ),
  quoteRequest: createFix(
    'Clean up the quote-request flow',
    'Medium',
    'Low',
    'Better job details reduce back-and-forth, make pricing easier, and help the team decide whether to quote, inspect, or call back.'
  ),
  tracking: createFix(
    'Track booked jobs and deposits',
    'High',
    'Low',
    'The business needs to see which inquiries become booked jobs, deposits, inspections, appointments, or callbacks.'
  ),
  missedLead: createFix(
    'Install missed-lead follow-up',
    'Medium',
    'Low',
    'Missed calls, stale leads, and unclosed estimates need a follow-up path before they disappear or choose another provider.'
  ),
  serviceArea: createFix(
    'Clarify service area and dispatch rules',
    'Medium',
    'Medium',
    'Clear service-area and job-fit rules help the funnel route the right customers to booking, deposit, quote request, or callback.'
  ),
  crm: createFix(
    'Deploy a lightweight lead tracker',
    'High',
    'Medium',
    'Scattered notes and inboxes make it too easy to lose a job. A simple tracker keeps lead status, owner, and next step visible.'
  ),
  reporting: createFix(
    'Build the weekly operator report',
    'Medium',
    'Low',
    'The team needs a simple weekly view of inquiries, callbacks, booked jobs, deposits, and the next bottleneck.'
  ),
  proof: createFix(
    'Strengthen reviews and proof near the decision point',
    'High',
    'Medium',
    'Service buyers need confidence before booking. Reviews, photos, guarantees, and service examples should support the quote or deposit path.'
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
  'Book more jobs': ['bookingPath', 'crm', 'tracking'],
  'Collect paid deposits': ['depositPath', 'bookingPath', 'tracking'],
  'Qualify quote requests': ['quoteRequest', 'serviceArea', 'crm'],
  'Recover missed calls': ['missedLead', 'responseLayer', 'crm'],
  'Follow up stale estimates': ['missedLead', 'proof', 'reporting'],
  'Improve response speed': ['responseLayer', 'missedLead', 'tracking'],
};

const INDUSTRY_SCORES: Record<string, number> = {
  'Mechanics / auto repair': 74,
  HVAC: 78,
  Plumbing: 78,
  Electrical: 74,
  Roofing: 76,
  Landscaping: 70,
  Cleaning: 68,
  'Mobile detailing': 66,
  'Appliance repair': 72,
  'Pest control': 72,
  'Junk removal': 70,
  'Concrete / flooring / remodeling': 72,
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

  const raw =
    (industryBase / 100) * 20 +
    (revenueBase / 100) * 20 +
    (goalBonus / 20) * 60;

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
        { label: 'Message Nexoria', href: '/portal/support' },
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

  const bookedJobs7d = Math.max(1, Math.round(blueprint.score / 12));
  const leads7d = Math.max(6, bookedJobs7d * 5 + blueprint.goals.length * 2);
  const conversionRate = `${Math.max(2, Math.min(35, Math.round((bookedJobs7d / leads7d) * 100)))}%`;
  const revenue7d = `$${(bookedJobs7d * 1750).toLocaleString()}`;

  return {
    blueprintId: blueprint.id,
    name: `${blueprint.industry} Booked-Job Blueprint`,
    industry: blueprint.industry,
    url: blueprint.url,
    goals: blueprint.goals,
    status: blueprint.status,
    purchaseEventType: blueprint.purchaseEventType,
    score: blueprint.score,
    diagnosis: `Your current path is creating interest, but inquiries still need faster follow-up, clearer handoff, and better visibility into what becomes a booked job or paid deposit.`,
    installChecklist: [
      'Service offer and booking path approved',
      'Lead capture and routing configured',
      'Top priorities assigned with ownership',
      'Booked-job and deposit reporting cadence established',
    ],
    tasks,
    weeklyNotes: [
      'Landing page and intake path are aligned around the current service offer.',
      'Next priority is moving the highest-impact task to complete and unblocking anything waiting on approval.',
      'We will keep measuring progress against booked jobs or deposits rather than generic traffic alone.',
    ],
    metrics: {
      leads7d,
      purchases7d: bookedJobs7d,
      conversionRate,
      revenue7d,
      trackingConnected: false,
      missingIntegrations: ['Analytics access', 'Booking or calendar event', 'Deposit or booked-job event source'],
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

  ['tracking', 'crm', 'reporting', 'bookingPath', 'responseLayer'].forEach((fallback) => {
    if (selected.size < 5) {
      selected.add(fallback);
    }
  });

  return Array.from(selected)
    .slice(0, 5)
    .map((key) => FIX_MAP[key]);
}
