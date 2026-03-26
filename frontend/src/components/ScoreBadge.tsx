interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const tone = score >= 70 ? 'score-badge score-badge--high' : score >= 45 ? 'score-badge score-badge--mid' : 'score-badge score-badge--low';

  return <span className={tone}>{score}/100</span>;
}
