import { useEffect, useState } from 'react';
import { blueprintApi } from '../api/blueprint';
import BlueprintCard from '../components/BlueprintCard';
import { INDUSTRY_OPTIONS, type Blueprint } from '../model/blueprint';

export default function BlueprintsGallery() {
  const [items, setItems] = useState<Blueprint[]>([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    blueprintApi
      .getAll()
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);

  async function removeBlueprint(id: number) {
    try {
      setError(null);
      await blueprintApi.delete(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unable to delete blueprint');
    }
  }

  if (error) {
    return (
      <main className="page">
        <article className="card error-text">Error: {error}</article>
      </main>
    );
  }

  const filtered = items
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .filter((item) => (industry === 'All' ? true : item.industry === industry))
    .filter((item) => item.url.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">Blueprint Library</p>
        <h1>Blueprint Gallery</h1>
        <p className="muted">
          Jump straight into a install plan.
          without leaving the protected workspace.
        </p>
      </section>

      <section className="card filter-bar">
        <label>
          Search
          <input onChange={(e) => setSearch(e.target.value)} placeholder="Search by URL" value={search} />
        </label>

        <label>
          Industry
          <select onChange={(e) => setIndustry(e.target.value)} value={industry}>
            <option value="All">All</option>
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="gallery-grid">
        {filtered.length ? (
          filtered.map((blueprint) => (
            <BlueprintCard blueprint={blueprint} key={blueprint.id} onDelete={(id) => void removeBlueprint(id)} />
          ))
        ) : (
          <article className="card empty-state">
            <h2>No blueprints match</h2>
            <p className="muted">Adjust the filters or generate a new blueprint from the admin create flow.</p>
          </article>
        )}
      </section>
    </main>
  );
}
