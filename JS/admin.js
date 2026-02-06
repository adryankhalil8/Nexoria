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

})();