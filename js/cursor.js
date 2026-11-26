/**
 * cursor.js – High-Performance GPU-Accelerated Custom Cursor v3.8
 * Navtara Projects Pvt. Ltd.
 * Uses hardware compositing (translate3d) for buttery smooth 120Hz/144Hz tracking
 */

(function () {
  // Only initialize on desktop devices with fine pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.classList.add('cursor-dot');
  ring.classList.add('cursor-ring');
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let initialized = false;
  let isHovered = false;
  let isClicked = false;

  // GPU translate3d positioning (Zero reflows, 100% composite)
  function render() {
    if (initialized) {
      // Lerp ring towards mouse with smooth inertia
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      const dotScale = isClicked ? 0.6 : isHovered ? 1.5 : 1;
      const ringScale = isClicked ? 1.4 : isHovered ? 1.5 : 1;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  window.addEventListener('mousemove', (e) => {
    if (e.clientX <= 2 && e.clientY <= 2) return;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!initialized) {
      initialized = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.style.opacity = '1';
      ring.style.opacity = '0.75';
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (initialized) {
      dot.style.opacity = '1';
      ring.style.opacity = '0.75';
    }
  });

  const interactables = 'a, button, .btn, .card, .project-card-v3, .highlight-stat-card, .leader-card-v3, .option-radio-card, .filter-btn, input, textarea, select';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactables)) {
      isHovered = true;
      dot.classList.add('cursor-grow');
      ring.classList.add('cursor-grow');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactables)) {
      isHovered = false;
      dot.classList.remove('cursor-grow');
      ring.classList.remove('cursor-grow');
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => {
    isClicked = true;
    dot.classList.add('cursor-click');
    ring.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    isClicked = false;
    dot.classList.remove('cursor-click');
    ring.classList.remove('cursor-click');
  });
})();
