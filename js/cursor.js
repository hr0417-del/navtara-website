/**
 * cursor.js – Custom cursor + magnetic button logic
 * Degrades gracefully: hidden on touch/mobile devices
 */

(function () {
  /* ─── Skip on touch devices ─── */
  if (window.matchMedia('(hover: none)').matches) return;

  /* ─── Inject cursor elements ─── */
  const dot   = document.createElement('div');
  const ring  = document.createElement('div');
  dot.classList.add('cursor-dot');
  ring.classList.add('cursor-ring');
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let isHovering = false;

  /* ─── Track mouse ─── */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  /* ─── Smooth ring follow ─── */
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* ─── Hover state on interactive elements ─── */
  const interactables = 'a, button, .btn, .card, .project-card, .industry-card, .cap-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactables)) {
      dot.classList.add('cursor-grow');
      ring.classList.add('cursor-grow');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactables)) {
      dot.classList.remove('cursor-grow');
      ring.classList.remove('cursor-grow');
    }
  });

  /* ─── Click pulse ─── */
  document.addEventListener('mousedown', () => {
    dot.classList.add('cursor-click');
    ring.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('cursor-click');
    ring.classList.remove('cursor-click');
  });

  /* ─── Magnetic Buttons ─── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect   = this.getBoundingClientRect();
      const bx     = rect.left + rect.width  / 2;
      const by     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - bx) * 0.35;
      const dy     = (e.clientY - by) * 0.35;
      this.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
})();
