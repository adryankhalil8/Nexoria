import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { BlueprintSummary } from '../model/blueprint';

export default function BlueprintDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<BlueprintSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiClient.get<BlueprintSummary>(`/blueprints/${id}`)
      .then((r) => setItem(r.data))
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Loading...</div>;

  return (
    <main>
      <h1>Blueprint detail</h1>
      <div>{item.url}</div>
      <div>Industry: {item.industry}</div>
      <div>Revenue: {item.revenueRange}</div>
      <div>Score: {item.score}</div>
      <div>Ready: {item.readyForRetainer ? 'Yes' : 'No'}</div>
    </main>
  );
}
