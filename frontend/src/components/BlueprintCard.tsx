import { Link } from 'react-router-dom';
import { getOptionLabel, INDUSTRY_OPTIONS, REVENUE_OPTIONS, type BlueprintSummary } from '../model/blueprint';

interface BlueprintCardProps {
  blueprint: BlueprintSummary;
  onDelete?: (id: number) => void;
}

export default function BlueprintCard({ blueprint, onDelete }: BlueprintCardProps) {
  return (
    <article className="card blueprint-card">
      <div className="blueprint-card__header">
        <p className="eyebrow">Blueprint</p>
        <div className="blueprint-card__actions">
          <span className="pill">{blueprint.status}</span>
          {onDelete && (
            <button
              aria-label={`Delete blueprint ${blueprint.url}`}
              className="icon-delete-button"
              onClick={() => onDelete(blueprint.id)}
              type="button"
            >
              x
            </button>
          )}
        </div>
      </div>
      <h2>{blueprint.url}</h2>
      <p className="muted">
        {getOptionLabel(INDUSTRY_OPTIONS, blueprint.industry)} | {getOptionLabel(REVENUE_OPTIONS, blueprint.revenueRange)}
      </p>
      <div className="pill-row">
        <span className="pill">{blueprint.purchaseEventType.replace(/_/g, ' ')}</span>
      </div>
      <Link className="text-link" to={`/admin/blueprints/${blueprint.id}`}>
        View blueprint
      </Link>
    </article>
  );
}
