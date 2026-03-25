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
