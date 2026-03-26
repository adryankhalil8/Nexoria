import { useEffect, useState } from 'react';
import { blueprintApi } from '../api/blueprint';
import BlueprintCard from '../components/BlueprintCard';
import { INDUSTRY_OPTIONS, type Blueprint } from '../model/blueprint';

export default function BlueprintsGallery() {
  const [items, setItems] = useState<Blueprint[]>([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [readyOnly, setReadyOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    blueprintApi
      .getAll()
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);

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
    .filter((item) => (readyOnly ? item.readyForRetainer : true))
    .filter((item) => item.url.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">Blueprint Library</p>
        <h1>All scored blueprints in one React gallery</h1>
        <p className="muted">
          The old gallery flow has been moved into the authenticated app. Filter by industry, search by URL,
          and drill directly into recommendations.
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

        <label className="checkbox-inline">
          <input checked={readyOnly} onChange={(e) => setReadyOnly(e.target.checked)} type="checkbox" />
          <span>Retainer ready only</span>
        </label>
      </section>

      <section className="gallery-grid">
        {filtered.length ? (
          filtered.map((blueprint) => <BlueprintCard blueprint={blueprint} key={blueprint.id} />)
        ) : (
          <article className="card empty-state">
            <h2>No blueprints match</h2>
            <p className="muted">Adjust the filters or generate a new blueprint from the create flow.</p>
          </article>
        )}
      </section>
    </main>
  );
}
