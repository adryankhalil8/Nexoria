const companyName = "Nexoria";
let activeUsers = 5;


// Hero updates
const heroTitle = document.getElementById("hero-title");
const heroSubtext = document.getElementById("hero-subtext");
const userCount = document.getElementById("user-count");


if (heroTitle) {
    heroTitle.textContent = `Welcome to ${companyName}`;
    heroSubtext.textContent = "We build scalable digital systems.";
    userCount.textContent = activeUsers;
}


// Signup simulation
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", e => {
        e.preventDefault();
        activeUsers++;
        alert(`Account created! Users: ${activeUsers}`);
    });
}


// Admin table
const table = document.getElementById("user-table");
if (table) {
    table.innerHTML = `
<tr><th>Email</th><th>Role</th><th>Status</th></tr>
<tr><td>admin@nexoria.com</td><td>Admin</td><td>Active</td></tr>
`;
}


// Remove loader
setTimeout(() => {
    document.getElementById("loader")?.remove();
}, 2500);