/* ==========================
   SATCORP.IO - Interactive JS Placeholders
   ========================== */

/* --------------------------
   Smooth Scrolling for Nav Links
--------------------------- */
const navLinks = document.querySelectorAll('header nav a');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetID = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetID);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

/* --------------------------
   Dummy Live Server Dashboards
--------------------------- */
const dashboardPlaceholder = document.querySelector('.dashboard-placeholder');

if (dashboardPlaceholder) {
    // Simulate 3 server cards
    for (let i = 1; i <= 3; i++) {
        const card = document.createElement('div');
        card.className = 'server-card';
        card.innerHTML = `
            <h3>Server ${i}</h3>
            <p>Status: <span class="status">Offline</span></p>
            <p>Players: <span class="players">0</span>/100</p>
        `;
        dashboardPlaceholder.appendChild(card);
    }

    // Simulate server updates
    setInterval(() => {
        const statusElements = document.querySelectorAll('.server-card .status');
        const playerElements = document.querySelectorAll('.server-card .players');

        statusElements.forEach((status, idx) => {
            const isOnline = Math.random() > 0.3; // 70% chance online
            status.textContent = isOnline ? 'Online' : 'Offline';
            status.style.color = isOnline ? '#00ffea' : '#ff0055';

            playerElements[idx].textContent = isOnline ? Math.floor(Math.random() * 100) : 0;
        });
    }, 3000);
}

/* --------------------------
   KYRAX AI Tool Placeholder
--------------------------- */
const kyraxPlaceholder = document.querySelector('.kyrax-placeholder');

if (kyraxPlaceholder) {
    const button = document.createElement('button');
    button.textContent = "Run KYRAX Simulation";
    button.className = 'kyrax-btn';
    kyraxPlaceholder.appendChild(button);

    button.addEventListener('click', () => {
        alert("KYRAX AI simulation placeholder executed.");
    });
}

/* --------------------------
   Forum Tabs Placeholder
--------------------------- */
const forumPlaceholder = document.querySelector('.forum-placeholder');

if (forumPlaceholder) {
    const tabs = ['General', 'Strategy', 'Lore'];
    const tabNav = document.createElement('div');
    tabNav.className = 'forum-tabs';

    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.textContent = "Select a tab to view forum posts.";

    tabs.forEach(tabName => {
        const tabButton = document.createElement('button');
        tabButton.textContent = tabName;
        tabButton.addEventListener('click', () => {
            tabContent.textContent = `Placeholder posts for "${tabName}" forum.`;
        });
        tabNav.appendChild(tabButton);
    });

    forumPlaceholder.appendChild(tabNav);
    forumPlaceholder.appendChild(tabContent);
}

/* --------------------------
   Donation Modal Placeholder
--------------------------- */
const donatePlaceholder = document.querySelector('.donate-placeholder');

if (donatePlaceholder) {
    const donateBtn = document.createElement('button');
    donateBtn.textContent = "Contribute Now";
    donateBtn.className = 'donate-btn';
    donatePlaceholder.appendChild(donateBtn);

    donateBtn.addEventListener('click', () => {
        alert("Donation modal placeholder triggered.");
    });
}

/* --------------------------
   Media Lightbox Placeholder
--------------------------- */
const mediaPlaceholder = document.querySelector('.media-placeholder');

if (mediaPlaceholder) {
    for (let i = 1; i <= 4; i++) {
        const img = document.createElement('div');
        img.className = 'media-item';
        img.textContent = `Media ${i}`;
        img.style.cssText = `
            background-color: #111122;
            color: #7c4dff;
            display: inline-block;
            margin: 0.5rem;
            padding: 2rem;
            cursor: pointer;
            border-radius: 8px;
            box-shadow: 0 0 10px #7c4dff33 inset;
        `;
        img.addEventListener('click', () => {
            alert(`Lightbox placeholder for Media ${i}`);
        });
        mediaPlaceholder.appendChild(img);
    }
}
