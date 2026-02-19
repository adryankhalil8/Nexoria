(function () {

    // ── DOM References ──────────────────────────────────
    const form          = document.getElementById("addUserForm");
    const emailInput    = document.getElementById("emailInput");
    const usernameInput = document.getElementById("usernameInput");
    const roleSelect    = document.getElementById("roleSelect");
    const clearBtn      = document.getElementById("clearBtn");
    const tbody         = document.getElementById("usersTbody");
    const template      = document.getElementById("userRowTemplate");
    const toast         = document.getElementById("toast");
    const chips         = document.querySelectorAll(".chip");
    const panelTitle    = document.getElementById("panelTitle");

    // ── Config ──────────────────────────────────────────
    const STORAGE_KEY   = "nexoria_users_v1";
    const SEED_USERS    = [
        { email: "admin@nexoria.com",  username: "admin",  role: "Admin",  status: "Active"  },
        { email: "user@nexoria.com",   username: "user01", role: "User",   status: "Pending" }
    ];

    // ── State ───────────────────────────────────────────
    let filter = "all";
    let users  = loadUsers();

    if (users.length === 0) {
        users = structuredClone(SEED_USERS);   // fresh copy, never mutate the template
        saveUsers(users);
    }

    // ── Bootstrap ───────────────────────────────────────
    panelTitle.textContent = "User Manager";
    render();

    // ════════════════════════════════════════════════════
    //  EVENT LISTENERS
    // ════════════════════════════════════════════════════

    // ── Form submit ─────────────────────────────────────
    form.addEventListener("submit", onSubmit);

    // ── Delegated click: chips + row actions ────────────
    document.addEventListener("click", onClick);

    // ── Live validation (debounced so it isn't firing
    //    every single keystroke) ───────────────────────
    const debouncedValidate = debounce(validateForm, 180);
    emailInput.addEventListener("input",  debouncedValidate);
    usernameInput.addEventListener("input", debouncedValidate);

    // ── Clear all ───────────────────────────────────────
    clearBtn.addEventListener("click", onClearAll);

    // ════════════════════════════════════════════════════
    //  HANDLERS
    // ════════════════════════════════════════════════════

    function onSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            showToast("Fix the highlighted fields.");
            return;
        }

        const newUser = {
            email:    emailInput.value.trim(),
            username: usernameInput.value.trim(),
            role:     roleSelect.value,
            status:   "Pending"
        };

        // duplicate guard
        if (findUserByEmail(newUser.email)) {
            setError(emailInput, "emailError", "Email already exists.");
            showToast("Duplicate email blocked.");
            return;
        }

        users.unshift(newUser);
        saveUsers(users);
        render();
        showToast("User added.");
        form.reset();
    }

    function onClick(e) {
        // ── chip tap ──
        const chip = e.target.closest(".chip");
        if (chip) {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            filter = chip.dataset.filter;
            location.hash = "#users-" + filter;
            render();
            return;
        }

        // ── row-action button ──
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        const row = btn.closest("tr[data-user]");
        if (!row) return;

        const email  = row.dataset.user;          // clean read — no text parsing
        const action = btn.dataset.action;

        if (action === "toggle") {
            toggleStatus(email);
            flashRow(row);                          // highlight the row that changed
            saveUsers(users);
            render();
            showToast("Status toggled.");
        }

        if (action === "remove") {
            users = users.filter(u => u.email !== email);
            saveUsers(users);
            render();
            showToast("User removed.");
        }
    }

    function onClearAll() {
        users = [];
        saveUsers(users);
        render();
        showToast("All users cleared.");
    }

    // ════════════════════════════════════════════════════
    //  DATA HELPERS
    // ════════════════════════════════════════════════════

    /** Return the user object matching email, or undefined */
    function findUserByEmail(email) {
        return users.find(u => u.email === email);
    }

    /** Flip Active ↔ Pending for the given email */
    function toggleStatus(email) {
        const user = findUserByEmail(email);
        if (user) {
            user.status = user.status === "Active" ? "Pending" : "Active";
        }
    }

    // ════════════════════════════════════════════════════
    //  RENDER
    // ════════════════════════════════════════════════════

    function render() {
        tbody.innerHTML = "";

        const filtered = filter === "all"
            ? users
            : users.filter(u => u.status === filter);

        // ── empty state ──
        if (filtered.length === 0) {
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML =
                `<td colspan="4" class="empty-msg">
           <span class="empty-icon">👥</span>
           No users match this filter.
         </td>`;
            tbody.appendChild(emptyRow);
            return;
        }

        // ── build fragment with stagger index ──
        const frag = document.createDocumentFragment();

        filtered.forEach((u, i) => {
            const node = template.content.cloneNode(true);
            const tr   = node.querySelector("tr");

            // populate cells
            tr.querySelector(".email").textContent  = u.username + "  ·  " + u.email;
            tr.querySelector(".role").textContent   = u.role;
            tr.querySelector(".status").innerHTML   =
                `<span class="status-pill status-${u.status}">${u.status}</span>`;

            // data attribute (used by click handler)
            tr.dataset.user = u.email;

            // animation hooks
            tr.classList.add("row-enter");
            tr.style.setProperty("--row-i", i);     // CSS stagger delay

            frag.appendChild(node);
        });

        tbody.appendChild(frag);

        // update accessible label
        const table = tbody.closest("table");
        table.setAttribute("aria-label", `Users table with ${filtered.length} rows`);
    }

    // ════════════════════════════════════════════════════
    //  VALIDATION
    // ════════════════════════════════════════════════════

    function validateForm() {
        let ok = true;

        clearError(emailInput,    "emailError");
        clearError(usernameInput, "usernameError");
        clearError(roleSelect,    "roleError");

        if (!emailInput.checkValidity()) {
            setError(emailInput, "emailError", "Enter a valid email.");
            ok = false;
        }
        if (!usernameInput.checkValidity()) {
            setError(usernameInput, "usernameError", "3–16 chars, letters / numbers / _ only.");
            ok = false;
        }
        if (!roleSelect.value) {
            setError(roleSelect, "roleError", "Select a role.");
            ok = false;
        }
        return ok;
    }

    function setError(el, errorId, msg) {
        el.classList.add("invalid");
        el.setAttribute("aria-invalid", "true");
        document.getElementById(errorId).textContent = msg;
    }

    function clearError(el, errorId) {
        el.classList.remove("invalid");
        el.removeAttribute("aria-invalid");
        document.getElementById(errorId).textContent = "";
    }

    // ════════════════════════════════════════════════════
    //  UI FEEDBACK
    // ════════════════════════════════════════════════════

    /** Flash a table row (the one that was actually toggled) */
    function flashRow(row) {
        row.classList.remove("highlight");
        // force reflow so the class re-triggers the animation
        void row.offsetWidth;
        row.classList.add("highlight");
    }

    /** Toast with icon + auto-dismiss */
    function showToast(msg) {
        // build icon span once if missing
        if (!toast.querySelector(".toast-icon")) {
            const icon = document.createElement("span");
            icon.className = "toast-icon";
            icon.textContent = "✓";
            toast.insertBefore(icon, toast.firstChild);
        }

        // update message text node (the last child after the icon)
        const textNode = toast.querySelector(".toast-icon").nextSibling;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = msg;
        } else {
            // fallback: append
            toast.appendChild(document.createTextNode(msg));
        }

        toast.setAttribute("aria-hidden", "false");
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
            toast.setAttribute("aria-hidden", "true");
        }, 1400);
    }

    // ════════════════════════════════════════════════════
    //  PERSISTENCE
    // ════════════════════════════════════════════════════

    function loadUsers() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            console.warn("[nexoria] Corrupted localStorage — resetting.");
            return [];
        }
    }

    function saveUsers(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // ════════════════════════════════════════════════════
    //  UTILITY
    // ════════════════════════════════════════════════════

    /** Classic leading-edge debounce */
    function debounce(fn, ms) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    }
   // ─────────────────────────────────────────────
// Client Intake Tracker (localStorage)
// ─────────────────────────────────────────────
const LEADS_KEY = "nexoria_leads_v1";
const LIMIT = 100;
const PAGE_SIZE = 6;

const leadLimitPill = document.getElementById("leadLimitPill");
const refreshLeadsBtn = document.getElementById("refreshLeadsBtn");
const limitAlert = document.getElementById("limitAlert");

const leadForm = document.getElementById("leadForm");
const leadsTbody = document.getElementById("leadsTbody");

const searchLeads = document.getElementById("searchLeads");
const filterStatus = document.getElementById("filterStatus");

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");

// Modal
const leadModal = document.getElementById("leadModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editForm = document.getElementById("editForm");
const openWebsiteBtn = document.getElementById("openWebsiteBtn");

// Edit inputs
const eCompany = document.getElementById("eCompany");
const eContact = document.getElementById("eContact");
const eEmail = document.getElementById("eEmail");
const eWebsite = document.getElementById("eWebsite");
const eIndustry = document.getElementById("eIndustry");
const eNotes = document.getElementById("eNotes");
const eStatus = document.getElementById("eStatus");

let leadPage = 1;
let editingLeadId = null;

function uid(){
  return (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "_" + Math.random().toString(16).slice(2));
}
function normalizeUrl(value){
  const v = (value || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return "https://" + v;
}
function loadLeads(){
  try{
    const raw = localStorage.getItem(LEADS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  }catch{
    return [];
  }
}
function saveLeads(leads){
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}
function badgeClass(status){
  const s = (status || "New").toLowerCase();
  if (s === "new") return "new";
  if (s === "contacted") return "contacted";
  if (s === "qualified") return "qualified";
  if (s === "closed") return "closed";
  return "new";
}
function setLimitUI(count){
  if (!leadLimitPill) return;
  leadLimitPill.textContent = `${count} / ${LIMIT}`;

  if (limitAlert){
    if (count >= LIMIT){
      limitAlert.style.display = "block";
      limitAlert.textContent = "Limit reached: 100/100. New submissions should be blocked + show red UI.";
    } else {
      limitAlert.style.display = "none";
      limitAlert.textContent = "";
    }
  }
}
function getFiltered(leads){
  const q = (searchLeads?.value || "").trim().toLowerCase();
  const status = filterStatus?.value || "All";

  return leads.filter(l => {
    const matchesStatus = (status === "All") ? true : (l.status === status);
    const hay = `${l.companyName} ${l.contactName} ${l.email}`.toLowerCase();
    const matchesSearch = q ? hay.includes(q) : true;
    return matchesStatus && matchesSearch;
  });
}

function renderLeads(){
  if (!leadsTbody) return;

  const leads = loadLeads();
  setLimitUI(leads.length);

  const filtered = getFiltered(leads);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (leadPage > totalPages) leadPage = totalPages;

  const start = (leadPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  leadsTbody.innerHTML = "";

  if (pageItems.length === 0){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="padding:16px;opacity:.7;">No leads found.</td>`;
    leadsTbody.appendChild(tr);
  } else {
    pageItems.forEach(l => {
      const websiteLink = l.website ? `<a href="${l.website}" target="_blank" rel="noopener">Open</a>` : `<span style="opacity:.5;">—</span>`;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(l.companyName || "")}</td>
        <td>${escapeHtml(l.contactName || "")}<div style="opacity:.65;font-weight:700;font-size:.85rem">${escapeHtml(l.email || "")}</div></td>
        <td><span class="badge ${badgeClass(l.status)}">${escapeHtml(l.status || "New")}</span></td>
        <td>${websiteLink}</td>
        <td>
          <div class="actions">
            <button class="action-btn" data-action="view" data-id="${l.id}">View/Edit</button>
            <button class="action-btn" data-action="status" data-id="${l.id}">Next Status</button>
            <button class="action-btn danger" data-action="delete" data-id="${l.id}">Delete</button>
          </div>
        </td>
      `;
      leadsTbody.appendChild(tr);
    });
  }

  if (pageInfo) pageInfo.textContent = `Page ${leadPage} / ${totalPages}`;
  if (prevPageBtn) prevPageBtn.disabled = (leadPage <= 1);
  if (nextPageBtn) nextPageBtn.disabled = (leadPage >= totalPages);
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function openModal(lead){
  editingLeadId = lead.id;

  eCompany.value = lead.companyName || "";
  eContact.value = lead.contactName || "";
  eEmail.value = lead.email || "";
  eWebsite.value = lead.website || "";
  eIndustry.value = lead.industry || "";
  eNotes.value = lead.notes || "";
  eStatus.value = lead.status || "New";

  openWebsiteBtn.href = lead.website || "#";
  openWebsiteBtn.style.pointerEvents = lead.website ? "auto" : "none";
  openWebsiteBtn.style.opacity = lead.website ? "1" : ".5";

  leadModal.classList.add("show");
  leadModal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  leadModal.classList.remove("show");
  leadModal.setAttribute("aria-hidden", "true");
  editingLeadId = null;
}

function nextStatus(current){
  const order = ["New","Contacted","Qualified","Closed"];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

// Events
refreshLeadsBtn?.addEventListener("click", renderLeads);

searchLeads?.addEventListener("input", () => { leadPage = 1; renderLeads(); });
filterStatus?.addEventListener("change", () => { leadPage = 1; renderLeads(); });

prevPageBtn?.addEventListener("click", () => { leadPage = Math.max(1, leadPage - 1); renderLeads(); });
nextPageBtn?.addEventListener("click", () => { leadPage = leadPage + 1; renderLeads(); });

leadsTbody?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const leads = loadLeads();
  const lead = leads.find(x => x.id === id);
  if (!lead) return;

  if (action === "view"){
    openModal(lead);
  }
  if (action === "status"){
    lead.status = nextStatus(lead.status || "New");
    lead.updatedAt = new Date().toISOString();
    saveLeads(leads);
    renderLeads();
  }
  if (action === "delete"){
    const updated = leads.filter(x => x.id !== id);
    saveLeads(updated);
    renderLeads();
  }
});

closeModalBtn?.addEventListener("click", closeModal);
leadModal?.addEventListener("click", (e) => {
  if (e.target === leadModal) closeModal();
});

editForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!editingLeadId) return;

  const leads = loadLeads();
  const idx = leads.findIndex(x => x.id === editingLeadId);
  if (idx === -1) return;

  const updated = {
    ...leads[idx],
    companyName: eCompany.value.trim(),
    contactName: eContact.value.trim(),
    email: eEmail.value.trim(),
    website: normalizeUrl(eWebsite.value),
    industry: eIndustry.value.trim(),
    notes: eNotes.value.trim(),
    status: eStatus.value,
    updatedAt: new Date().toISOString()
  };

  leads[idx] = updated;
  saveLeads(leads);
  renderLeads();
  openModal(updated); // keep modal in sync
});

leadForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const leads = loadLeads();
  if (leads.length >= LIMIT){
    if (limitAlert){
      limitAlert.style.display = "block";
      limitAlert.textContent = "Limit reached: 100/100. You must delete leads to add more.";
    }
    return;
  }

  const lCompany = document.getElementById("lCompany").value.trim();
  const lContact = document.getElementById("lContact").value.trim();
  const lEmail = document.getElementById("lEmail").value.trim();
  const lWebsite = normalizeUrl(document.getElementById("lWebsite").value);
  const lIndustry = document.getElementById("lIndustry").value.trim();
  const lNotes = document.getElementById("lNotes").value.trim();
  const lStatus = document.getElementById("lStatus").value;

  if (!lCompany || !lContact || !lEmail) return;

  const lead = {
    id: uid(),
    companyName: lCompany,
    contactName: lContact,
    email: lEmail,
    website: lWebsite,
    industry: lIndustry,
    notes: lNotes,
    status: lStatus || "New",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  leads.unshift(lead);
  saveLeads(leads);
  leadForm.reset();
  leadPage = 1;
  renderLeads();
});



// Initial
renderLeads();

window.addEventListener("storage", (e) => {
  if (e.key === LEADS_KEY) renderLeads();
})})();