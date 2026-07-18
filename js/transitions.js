/**
 * transitions.js – Silky page-to-page fade transitions
 */

(function () {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  document.body.appendChild(overlay);

  /* Fade in on load */
  window.addEventListener('DOMContentLoaded', () => {
    overlay.classList.add('t-active');
    requestAnimationFrame(() => {
      setTimeout(() => {
        overlay.classList.remove('t-active');
      }, 50);
    });
  });

  /* Intercept all internal link clicks */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    /* Skip anchors, external links, mailto, tel */
    if (href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        link.target === '_blank') return;

    e.preventDefault();
    overlay.classList.add('t-active');
    setTimeout(() => {
      window.location.href = href;
    }, 420);
  });
})();
