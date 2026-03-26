import { Link } from 'react-router-dom';
import { getOptionLabel, INDUSTRY_OPTIONS, REVENUE_OPTIONS, type BlueprintSummary } from '../model/blueprint';
import ScoreBadge from './ScoreBadge';

interface BlueprintCardProps {
  blueprint: BlueprintSummary;
}

export default function BlueprintCard({ blueprint }: BlueprintCardProps) {
  return (
    <article className="card blueprint-card">
      <div className="blueprint-card__header">
        <p className="eyebrow">Blueprint</p>
        <ScoreBadge score={blueprint.score} />
      </div>
      <h2>{blueprint.url}</h2>
      <p className="muted">
        {getOptionLabel(INDUSTRY_OPTIONS, blueprint.industry)} · {getOptionLabel(REVENUE_OPTIONS, blueprint.revenueRange)}
      </p>
      <div className="pill-row">
        <span className={blueprint.readyForRetainer ? 'pill pill--success' : 'pill'}>
          {blueprint.readyForRetainer ? 'Retainer Ready' : 'Needs Work'}
        </span>
      </div>
      <Link className="text-link" to={`/blueprints/${blueprint.id}`}>
        View blueprint
      </Link>
    </article>
  );
}
