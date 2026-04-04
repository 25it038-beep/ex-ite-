// ─── Theme Manager ───────────────────────────────────────────────
(function() {
  const THEME_KEY = 'flex_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const label = document.getElementById('themeLabel');
    const icon  = document.getElementById('themeIcon');
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    if (icon)  icon.textContent  = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // Apply saved or system preference immediately
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);

  window.toggleTheme = toggleTheme;

  // Re-apply after DOM ready (for icon/label elements)
  document.addEventListener('DOMContentLoaded', function() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(theme);
  });
})();
