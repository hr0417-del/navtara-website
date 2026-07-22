/**
 * main.js – Core Application Logic v3.0
 * Navtara Projects Pvt. Ltd. Digital Headquarters
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Hero Animation Initializer ─── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.querySelectorAll('[class*="delay-"]').forEach(el => {
      el.classList.add('hero-loaded');
    });
    setTimeout(() => heroContent.classList.add('active'), 50);
  }

  /* ─── Navbar Scroll Effect ─── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── Scroll Reveal Observer ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      if (el.closest('.hero')) return;
      revealObs.observe(el);
    });
  }

  /* ─── Curtain Image Reveal Observer ─── */
  const curtains = document.querySelectorAll('.curtain-wrap');
  if (curtains.length) {
    const curtainObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('curtain-open'), 100);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

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
            const duration = 1800;
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
    }, { threshold: 0.15 });

    countObs.observe(statsSection);
  }

  /* ─── Mobile Navigation Toggle ─── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      menuToggle.textContent = isOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        if (menuToggle) menuToggle.textContent = '☰';
      });
    });
  }

  /* ─── Scroll to Top Button ─── */
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 380);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Interactive Workflow Stepper Logic ─── */
  const workflowSteps = document.querySelectorAll('.workflow-step');
  const workflowPanes = document.querySelectorAll('.workflow-pane');
  if (workflowSteps.length && workflowPanes.length) {
    workflowSteps.forEach(step => {
      step.addEventListener('click', () => {
        const targetStep = step.getAttribute('data-step');
        workflowSteps.forEach(s => s.classList.remove('active'));
        workflowPanes.forEach(p => p.classList.remove('active'));

        step.classList.add('active');
        const activePane = document.getElementById(`workflow-pane-${targetStep}`);
        if (activePane) activePane.classList.add('active');
      });
    });
  }

  /* ─── Interactive Case Study Modal ─── */
  const modal = document.getElementById('project-detail-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const projectTriggers = document.querySelectorAll('[data-project-trigger]');

  if (modal) {
    projectTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-title') || 'Industrial Heavy Engineering Package';
        const client = btn.getAttribute('data-client') || 'Tier-1 Enterprise EPC';
        const loc = btn.getAttribute('data-loc') || 'Pan-India Operations';
        const value = btn.getAttribute('data-value') || 'Multi-Crore Scope';
        const scope = btn.getAttribute('data-scope') || 'Fabrication, Erection & Surface Protection';
        const desc = btn.getAttribute('data-desc') || 'Full turn-key structural engineering package executed under strict AWS D1.1 & ASME quality benchmarks.';

        const modalTitle = document.getElementById('modal-project-title');
        const modalClient = document.getElementById('modal-project-client');
        const modalLoc = document.getElementById('modal-project-loc');
        const modalVal = document.getElementById('modal-project-value');
        const modalScope = document.getElementById('modal-project-scope');
        const modalDesc = document.getElementById('modal-project-desc');

        if (modalTitle) modalTitle.textContent = title;
        if (modalClient) modalClient.textContent = client;
        if (modalLoc) modalLoc.textContent = loc;
        if (modalVal) modalVal.textContent = value;
        if (modalScope) modalScope.textContent = scope;
        if (modalDesc) modalDesc.textContent = desc;

        modal.classList.add('active');
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

});
