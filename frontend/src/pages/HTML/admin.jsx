import React from "react";
import "../../../../CSS/admin.css";

export default function AdminDashboard() {
  return (
    <>
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">
            <img src="../../../../Images/logo.PNG" alt="Admin avatar" />
          </div>
          <h3>Admin User</h3>
        </div>

        <nav className="nav">
          <a href="#">Dashboard</a>
          <a href="#">Users</a>
          <a href="#">Settings</a>
          <a href="tml">Log Out</a>
        </nav>
      </aside>

      <main className="main">
        <section className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>
            Welcome to the Nexoria admin panel. This area will be used to manage
            users, content, and system settings.
          </p>
        </section>

        <section className="admin-content">
          <section className="panel" id="userPanel" aria-labelledby="panelTitle">
            <header className="panel-header">
              <h2 id="panelTitle">User Manager (Interactive)</h2>
              <p className="muted" id="panelSubtitle">
                Add users, validate input, and manage status dynamically.
              </p>
            </header>

            <form id="addUserForm" className="form" noValidate>
              <div className="grid">
                <div className="field">
                  <label htmlFor="emailInput">Email</label>
                  <input
                    id="emailInput"
                    name="email"
                    type="email"
                    placeholder="user@nexoria.com"
                    autoComplete="off"
                    required
                  />
                  <small className="error" id="emailError" role="alert"></small>
                </div>

                <div className="field">
                  <label htmlFor="usernameInput">Username</label>
                  <input
                    id="usernameInput"
                    name="username"
                    type="text"
                    placeholder="nexoria_user"
                    autoComplete="off"
                    minLength="3"
                    maxLength="16"
                    pattern="^[a-zA-Z0-9_]+$"
                    required
                  />
                  <small className="error" id="usernameError" role="alert"></small>
                </div>

                <div className="field">
                  <label htmlFor="roleSelect">Role</label>
                  <select id="roleSelect" name="role" required defaultValue="">
                    <option value="" disabled>
                      Choose role…
                    </option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <small className="error" id="roleError" role="alert"></small>
                </div>
              </div>

              <div className="actions">
                <button type="submit" id="addBtn">
                  Add User
                </button>
                <button type="button" id="clearBtn" className="secondary">
                  Clear All
                </button>
              </div>
            </form>

            <div className="filters" role="group" aria-label="Status filter">
              <button type="button" className="chip active" data-filter="all">
                All
              </button>
              <button type="button" className="chip" data-filter="Active">
                Active
              </button>
              <button type="button" className="chip" data-filter="Pending">
                Pending
              </button>
            </div>

            <div className="table-wrap">
              <table className="table" id="usersTable">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="col-actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody id="usersTbody"></tbody>
              </table>
            </div>

            <template id="userRowTemplate">
              <tr className="user-row">
                <td className="cell email"></td>
                <td className="cell role"></td>
                <td className="cell status"></td>
                <td className="cell actions">
                  <button type="button" className="mini" data-action="toggle">
                    Toggle
                  </button>
                  <button
                    type="button"
                    className="mini danger"
                    data-action="remove"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </template>
          </section>

          <section
            className="panel intake"
            id="intakePanel"
            aria-labelledby="intakeTitle"
          >
            <header className="panel-head">
              <div>
                <h2 id="intakeTitle">Client Intake Tracker</h2>
                <p>Create leads, search them, manage status, and open their website.</p>
              </div>
              <div className="intake-meta">
                <span className="limit-pill" id="leadLimitPill">
                  0 / 100
                </span>
                <button className="small-btn" id="refreshLeadsBtn" type="button">
                  Refresh
                </button>
              </div>
            </header>

            <div className="intake-grid">
              <div className="intake-left">
                <h3>New Lead</h3>
                <form id="leadForm" className="form-grid">
                  <input id="lCompany" placeholder="Company Name" required />
                  <input id="lContact" placeholder="Contact Name" required />
                  <input id="lEmail" type="email" placeholder="Email" required />
                  <input id="lWebsite" placeholder="Website (optional)" />
                  <input id="lIndustry" placeholder="Industry (optional)" />
                  <textarea id="lNotes" placeholder="Notes (optional)"></textarea>

                  <div className="row">
                    <label htmlFor="lStatus">Status</label>
                    <select id="lStatus">
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Closed</option>
                    </select>
                  </div>

                  <button type="submit" className="primary-btn">
                    Save Lead
                  </button>
                  <div
                    className="limit-alert"
                    id="limitAlert"
                    style={{ display: "none" }}
                  ></div>
                </form>

                <div className="enrich">
                  <h3>Enrichment / External API</h3>
                  <p>For now: website is stored + clickable. (Clearbit later.)</p>
                </div>
              </div>

              <div className="intake-right">
                <div className="toolbar">
                  <input
                    id="searchLeads"
                    placeholder="Search company, contact, email…"
                  />
                  <select id="filterStatus">
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="table-wrap">
                  <table className="table intake-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Website</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="leadsTbody"></tbody>
                  </table>
                </div>

                <div className="pager">
                  <button id="prevPageBtn" type="button">
                    Prev
                  </button>
                  <span id="pageInfo">Page 1</span>
                  <button id="nextPageBtn" type="button">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="modal" id="leadModal" aria-hidden="true">
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalTitle"
            >
              <div className="modal-head">
                <h3 id="modalTitle">Lead Details</h3>
                <button id="closeModalBtn" className="small-btn" type="button">
                  Close
                </button>
              </div>

              <form id="editForm" className="form-grid">
                <input id="eCompany" placeholder="Company Name" required />
                <input id="eContact" placeholder="Contact Name" required />
                <input id="eEmail" type="email" placeholder="Email" required />
                <input id="eWebsite" placeholder="Website" />
                <input id="eIndustry" placeholder="Industry" />
                <textarea id="eNotes" placeholder="Notes"></textarea>

                <div className="row">
                  <label htmlFor="eStatus">Status</label>
                  <select id="eStatus">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Closed</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="primary-btn">
                    Save Changes
                  </button>
                  <a
                    id="openWebsiteBtn"
                    className="small-btn"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Website
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <div className="toast" id="toast" role="status" aria-live="polite" aria-hidden="true"></div>
    </>
  );
}