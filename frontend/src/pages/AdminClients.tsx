import { useEffect, useMemo, useState } from 'react';
import { leadsApi } from '../api/leads';
import type { Lead, LeadDraft, LeadStatus } from '../model/admin';
import { LEAD_STATUS_OPTIONS } from '../model/admin';

const EMPTY_LEAD: LeadDraft = {
  company: '',
  contactName: '',
  email: '',
  website: '',
  industry: '',
  notes: '',
  status: 'NEW',
};

export default function AdminClients() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<LeadDraft>(EMPTY_LEAD);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<LeadDraft>(EMPTY_LEAD);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLeads(await leadsApi.getAll());
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to load leads');
    }
  }

  async function createLead(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const created = await leadsApi.create(form);
      setLeads((current) => [created, ...current]);
      setForm(EMPTY_LEAD);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to save lead');
    }
  }

  async function saveLeadEdits(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedLead) {
      return;
    }

    try {
      const updated = await leadsApi.update(selectedLead.id, editForm);
      setLeads((current) => current.map((lead) => (lead.id === selectedLead.id ? updated : lead)));
      setSelectedLead(null);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to update lead');
    }
  }

  async function removeLead(id: number) {
    try {
      await leadsApi.delete(id);
      setLeads((current) => current.filter((lead) => lead.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to delete lead');
    }
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setEditForm({
      company: lead.company,
      contactName: lead.contactName,
      email: lead.email,
      website: lead.website ?? '',
      industry: lead.industry ?? '',
      notes: lead.notes ?? '',
      status: lead.status,
    });
  }

  const filteredLeads = useMemo(
    () =>
      leads
        .filter((lead) => (statusFilter === 'ALL' ? true : lead.status === statusFilter))
        .filter((lead) => {
          const haystack = `${lead.company} ${lead.contactName} ${lead.email} ${lead.website ?? ''}`.toLowerCase();
          return haystack.includes(search.toLowerCase());
        }),
    [leads, search, statusFilter]
  );

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Client Tracker</p>
        <h2>Capture leads, search the pipeline, and keep details editable.</h2>
      </div>

      <div className="two-column">
        <form className="card stack-form" onSubmit={createLead}>
          <label>
            Company
            <input onChange={(event) => setForm({ ...form, company: event.target.value })} required value={form.company} />
          </label>
          <label>
            Contact Name
            <input
              onChange={(event) => setForm({ ...form, contactName: event.target.value })}
              required
              value={form.contactName}
            />
          </label>
          <label>
            Email
            <input
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            Website
            <input onChange={(event) => setForm({ ...form, website: event.target.value })} value={form.website} />
          </label>
          <label>
            Industry
            <input onChange={(event) => setForm({ ...form, industry: event.target.value })} value={form.industry} />
          </label>
          <label>
            Status
            <select
              onChange={(event) => setForm({ ...form, status: event.target.value as LeadStatus })}
              value={form.status}
            >
              {LEAD_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Notes
            <textarea
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              rows={5}
              value={form.notes}
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-button" type="submit">
            Save Lead
          </button>
        </form>

        <div className="card stack">
          <div className="toolbar">
            <input onChange={(event) => setSearch(event.target.value)} placeholder="Search leads" value={search} />
            <select onChange={(event) => setStatusFilter(event.target.value as LeadStatus | 'ALL')} value={statusFilter}>
              <option value="ALL">All</option>
              {LEAD_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Website</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.company}</td>
                    <td>{lead.contactName}</td>
                    <td>{lead.status}</td>
                    <td>
                      {lead.website ? (
                        <a href={lead.website} rel="noreferrer" target="_blank">
                          Visit
                        </a>
                      ) : (
                        <span className="muted">None</span>
                      )}
                    </td>
                    <td className="table-actions">
                      <button className="ghost-button ghost-button--small" onClick={() => openLead(lead)} type="button">
                        View
                      </button>
                      <button className="danger-button" onClick={() => void removeLead(lead.id)} type="button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedLead && (
        <div className="modal-backdrop" onClick={() => setSelectedLead(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Lead Details</p>
                <h3>{selectedLead.company}</h3>
              </div>
              <button className="ghost-button ghost-button--small" onClick={() => setSelectedLead(null)} type="button">
                Close
              </button>
            </div>

            <form className="stack-form" onSubmit={saveLeadEdits}>
              <label>
                Company
                <input
                  onChange={(event) => setEditForm({ ...editForm, company: event.target.value })}
                  value={editForm.company}
                />
              </label>
              <label>
                Contact Name
                <input
                  onChange={(event) => setEditForm({ ...editForm, contactName: event.target.value })}
                  value={editForm.contactName}
                />
              </label>
              <label>
                Email
                <input
                  onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                  type="email"
                  value={editForm.email}
                />
              </label>
              <label>
                Website
                <input
                  onChange={(event) => setEditForm({ ...editForm, website: event.target.value })}
                  value={editForm.website}
                />
              </label>
              <label>
                Industry
                <input
                  onChange={(event) => setEditForm({ ...editForm, industry: event.target.value })}
                  value={editForm.industry}
                />
              </label>
              <label>
                Status
                <select
                  onChange={(event) => setEditForm({ ...editForm, status: event.target.value as LeadStatus })}
                  value={editForm.status}
                >
                  {LEAD_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Notes
                <textarea
                  onChange={(event) => setEditForm({ ...editForm, notes: event.target.value })}
                  rows={5}
                  value={editForm.notes}
                />
              </label>

              <div className="modal-actions">
                <button className="primary-button" type="submit">
                  Save Changes
                </button>
                {editForm.website && (
                  <a className="ghost-button" href={editForm.website} rel="noreferrer" target="_blank">
                    Open Website
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
