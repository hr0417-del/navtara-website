/**
 * main.js – Core JS: scroll reveals, counters, navbar, curtain reveals
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar Scroll Effect ─── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ─── Scroll Reveal (fade + slide) ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ─── Curtain Image Reveal ─── */
  const curtains = document.querySelectorAll('.curtain-wrap');
  if (curtains.length) {
    const curtainObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        // Slight delay so curtain wipes after the section enters
        setTimeout(() => entry.target.classList.add('curtain-open'), 100);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    curtains.forEach(el => curtainObs.observe(el));
  }

  /* ─── Animated Counters ─── */
  const counters = document.querySelectorAll('.counter-value');
  const statsSection = document.querySelector('.stats-section');
  if (counters.length && statsSection) {
    let hasCounted = false;
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          counters.forEach(counter => {
            const target   = +counter.getAttribute('data-target');
            const duration = 2000;
            const fps      = 60;
            const increment = target / (duration / (1000 / fps));
            let current = 0;
            const tick = () => {
              current += increment;
              if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(tick);
              } else {
                counter.innerText = target;
              }
            };
            tick();
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countObs.observe(statsSection);
  }

  /* ─── Mobile Menu Toggle ─── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });
  }
});
