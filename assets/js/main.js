/* ==============================================================
   SATCORP – Main Javascript
   --------------------------------------------------------------
   Features:
   1️⃣ Dark / Light mode toggle (persists in localStorage)
   2️⃣ Smooth scroll fallback for older browsers
   3️⃣ Basic form validation (HTML5 does most of it)
   ============================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- 1️⃣ Dark‑mode toggle ------------------------------------- */
  const toggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  const setTheme = (theme) => {
    htmlEl.dataset.theme = theme;
    localStorage.setItem('satcorp-theme', theme);
    toggleBtn.innerHTML = theme === 'dark' ? feather.icons['sun'].toSvg() : feather.icons['moon'].toSvg();
  };

  // initialise from storage or system preference
  const saved = localStorage.getItem('satcorp-theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  toggleBtn.addEventListener('click', () => {
    const newTheme = htmlEl.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  /* ---- 2️⃣ Smooth scroll fallback (optional) ------------------- */
  // Already covered by CSS `scroll-behavior: smooth` on html,
  // but for browsers without it we add a tiny polyfill.
  if ('scrollBehavior' in document.documentElement.style === false) {
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
      .then(mod => mod.polyfill());
  }
});
