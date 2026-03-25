import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { BlueprintSummary } from '../model/blueprint';

export default function BlueprintsGallery() {
  const [items, setItems] = useState<BlueprintSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<BlueprintSummary[]>('/blueprints')
      .then((r) => setItems(r.data))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <h1>Blueprints</h1>
      <ul>
        {items.map((bp) => (
          <li key={bp.id}>
            <a href={`/blueprints/${bp.id}`}>{bp.url}</a> - {bp.score} - {bp.readyForRetainer ? 'Retainer' : 'No'}
          </li>
        ))}
      </ul>
    </main>
  );
}
