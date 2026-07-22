/**
 * main.js – Core JS: scroll reveals, counters, navbar, curtain reveals,
 *            mobile menu, scroll-to-top, hero load animation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Hero Load Animation (above-the-fold) ─── */
  // Elements with delay classes inside .hero animate in on load, not scroll
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.querySelectorAll('[class*="delay-"]').forEach(el => {
      el.classList.add('hero-loaded');
    });
    // Also trigger the parent reveal immediately
    setTimeout(() => heroContent.classList.add('active'), 50);
  }

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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      // Skip hero content — it's handled by the load animation above
      if (el.closest('.hero')) return;
      revealObs.observe(el);
    });
  }

  /* ─── Curtain Image Reveal ─── */
  const curtains = document.querySelectorAll('.curtain-wrap');
  if (curtains.length) {
    const curtainObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
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
    }, { threshold: 0.2 }); // lowered from 0.5 so it fires on small screens
    countObs.observe(statsSection);
  }

  /* ─── Mobile Menu Toggle ─── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      menuToggle.textContent = isOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        menuToggle.textContent = '☰';
      });
    });
  }

  /* ─── Scroll to Top Button ─── */
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
