import { useOutletContext } from 'react-router-dom';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';
import type { TaskStatus } from '../model/blueprint';

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'NOT_STARTED', label: 'Not Started' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'BLOCKED', label: 'Blocked' },
  { status: 'DONE', label: 'Done' },
];

export default function ClientNextSteps() {
  const { portal, isLoading } = useOutletContext<ClientPortalOutletContext>();

  if (isLoading) {
    return <section className="card">Loading tasks...</section>;
  }

  if (!portal) {
    return <section className="card">No approved blueprint is available yet.</section>;
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Next steps</p>
        <h2>Install next steps</h2>
        <p className="muted">
          The action queue shows what needs to happen next, who completes it.
        </p>
      </div>

      <div className="client-kanban">
        {columns.map((column) => (
          <article className="card stack" key={column.status}>
            <div className="fix-list__header">
              <strong>{column.label}</strong>
              <span className="pill">
                {portal.tasks.filter((task) => task.status === column.status).length}
              </span>
            </div>

            <div className="stack">
              {portal.tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <div className="client-kanban-card" key={task.id}>
                    <strong>{task.title}</strong>
                    <p className="muted">{task.dueLabel}</p>
                    <div className="pill-row">
                      <span className={`pill client-owner-pill client-owner-pill--${task.owner.toLowerCase()}`}>
                        {task.owner}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
