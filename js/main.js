/**
 * main.js – High-Performance Application Core v3.7
 * Navtara Projects Pvt. Ltd. Digital Headquarters
 * Locked 60 FPS, Zero-Jank Scroll, Instant Search & Synchronized Project Registry
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. Throttled 60 FPS Scroll Manager ─── */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  const navbar = document.querySelector('.navbar');
  const scrollBtn = document.getElementById('scroll-top-btn');

  let scrollTicking = false;

  function updateScrollState() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Top Progress Bar
    if (docHeight > 0) {
      const scrolled = (scrollY / docHeight) * 100;
      progressBar.style.width = scrolled + '%';
    }

    // Sticky Navbar Glass Toggle
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 30);
    }

    // Scroll to Top Button Visibility
    if (scrollBtn) {
      scrollBtn.classList.toggle('visible', scrollY > 360);
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollState);
      scrollTicking = true;
    }
  }, { passive: true });

  // Initial trigger
  updateScrollState();

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 2. Hero Content Entrance ─── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.querySelectorAll('[class*="delay-"]').forEach(el => {
      el.classList.add('hero-loaded');
    });
    setTimeout(() => heroContent.classList.add('active'), 40);
  }

  /* ─── 3. Scroll Reveal Observer (Zero GPU Memory Bloat) ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => {
      if (el.closest('.hero')) return;
      revealObs.observe(el);
    });
  }

  /* ─── 4. Curtain Image Reveal Observer ─── */
  const curtains = document.querySelectorAll('.curtain-wrap');
  if (curtains.length) {
    const curtainObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('curtain-open'), 80);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    curtains.forEach(el => curtainObs.observe(el));
  }

  /* ─── 5. Animated Numbers Counter ─── */
  const counters = document.querySelectorAll('.counter-value');
  const statsSection = document.querySelector('.stats-section');
  if (counters.length && statsSection) {
    let hasCounted = false;
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1600;
            const startTime = performance.now();

            const updateCount = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic formula
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeOut * target);

              counter.innerText = current;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                counter.innerText = target;
              }
            };
            requestAnimationFrame(updateCount);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    countObs.observe(statsSection);
  }

  /* ─── 6. Mobile Drawer Navigation ─── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
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

  /* ─── 7. Interactive Workflow Stepper ─── */
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

  /* ─── 8. Pan-India Radar Beacons ─── */
  const beaconNodes = document.querySelectorAll('.beacon-node');
  const siteTitle = document.getElementById('map-site-title');
  const siteClient = document.getElementById('map-site-client');
  const siteScope = document.getElementById('map-site-scope');

  if (beaconNodes.length && siteTitle) {
    beaconNodes.forEach(node => {
      node.addEventListener('click', () => {
        beaconNodes.forEach(b => b.classList.remove('active-node'));
        node.classList.add('active-node');

        const stateName = node.getAttribute('data-state-name');
        const client = node.getAttribute('data-site-client');
        const scope = node.getAttribute('data-site-scope');

        siteTitle.textContent = `${stateName} Deployment Hub`;
        if (siteClient) siteClient.textContent = client;
        if (siteScope) siteScope.textContent = scope;
      });
    });
  }

  /* ─── 9. Synchronized Project Filtering & Real-Time Search ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-v3');
  const tableRows = document.querySelectorAll('.portfolio-table tbody tr');
  const completedTableSection = document.getElementById('completed-projects-section');
  const searchInput = document.getElementById('project-search-input');
  const searchStats = document.getElementById('project-search-stats');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyProjectFilters() {
    let visibleCards = 0;
    let visibleRows = 0;

    // Filter Cards
    projectCards.forEach(card => {
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesCat = (activeCategory === 'all') ||
        (activeCategory === 'wip' && category.includes('wip')) ||
        (activeCategory === 'completed' && category.includes('completed')) ||
        (activeCategory !== 'wip' && activeCategory !== 'completed' && category.includes(activeCategory));

      const matchesSearch = !searchQuery || text.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCards++;
      } else {
        card.style.display = 'none';
      }
    });

    // Filter Table Rows
    tableRows.forEach(row => {
      const category = (row.getAttribute('data-category') || 'completed').toLowerCase();
      const text = row.textContent.toLowerCase();

      const matchesCat = (activeCategory === 'all') ||
        (activeCategory === 'wip' && category.includes('wip')) ||
        (activeCategory === 'completed' && category.includes('completed')) ||
        (activeCategory !== 'wip' && activeCategory !== 'completed' && category.includes(activeCategory));

      const matchesSearch = !searchQuery || text.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        row.style.display = '';
        visibleRows++;
      } else {
        row.style.display = 'none';
      }
    });

    // Toggle Completed Table Section visibility based on WIP filter
    if (completedTableSection) {
      if (activeCategory === 'wip') {
        completedTableSection.style.display = 'none';
      } else {
        completedTableSection.style.display = visibleRows > 0 ? 'block' : 'none';
      }
    }

    // Update Counter Stats
    if (searchStats) {
      const totalVisible = visibleCards + visibleRows;
      searchStats.textContent = `Showing ${totalVisible} of 35 engineering packages across India`;
    }
  }

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        applyProjectFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyProjectFilters();
    });
  }

  /* ─── 11. Interactive RFQ Generator & Dispatch Engine (Contact) ─── */
  const rfqCards = document.querySelectorAll('.option-radio-card');
  const messageBox = document.getElementById('message');

  let rfqState = {
    sector: 'Steel Plant Package',
    scope: 'Structural Fabrication & Erection',
    scale: '500 - 1,500 MT Scope'
  };

  function updateRFQDraft() {
    if (!messageBox) return;
    messageBox.value = `[OFFICIAL NAVTARA RFQ DOSSIER]
Target Sector: ${rfqState.sector}
Primary Engineering Scope: ${rfqState.scope}
Estimated Package Scale: ${rfqState.scale}

Please provide formal engineering feasibility, mobilization schedule, and preliminary commercial quotation for our project scope.`;
  }

  if (rfqCards.length) {
    rfqCards.forEach(card => {
      card.addEventListener('click', () => {
        const group = card.getAttribute('data-rfq-group');
        const val = card.getAttribute('data-rfq-val');

        document.querySelectorAll(`.option-radio-card[data-rfq-group="${group}"]`).forEach(c => {
          c.classList.remove('selected');
        });

        card.classList.add('selected');
        if (group && val) {
          rfqState[group] = val;
          updateRFQDraft();
        }
      });
    });
  }

  // Toast notification helper
  function showToast(msg) {
    let toast = document.getElementById('rfq-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'rfq-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  // Form Dispatch Handlers
  const contactForm = document.getElementById('contact-form');
  const copyBtn = document.getElementById('btn-copy-rfq');
  const emailBtn = document.getElementById('btn-email-rfq');
  const waBtn = document.getElementById('btn-wa-rfq');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = messageBox ? messageBox.value : '';
      navigator.clipboard.writeText(text).then(() => {
        showToast('RFQ Dossier copied to clipboard!');
      }).catch(() => {
        showToast('Please select and copy the text box.');
      });
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = encodeURIComponent(`Tender RFQ - ${rfqState.sector} (${rfqState.scale})`);
      const body = encodeURIComponent(messageBox ? messageBox.value : '');
      window.location.href = `mailto:Navtaraprojects@outlook.com?subject=${subject}&body=${body}`;
      showToast('Opening default email client (Outlook)...');
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = encodeURIComponent(`*Tender RFQ - Navtara Projects*\n\n` + (messageBox ? messageBox.value : ''));
      window.open(`https://wa.me/919838889618?text=${text}`, '_blank');
      showToast('Opening WhatsApp dispatch...');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = encodeURIComponent(`Tender Inquiry - ${rfqState.sector}`);
      const body = encodeURIComponent(messageBox ? messageBox.value : '');
      window.location.href = `mailto:Navtaraprojects@outlook.com?subject=${subject}&body=${body}`;
      showToast('Dispatching inquiry to estimation desk via email...');
    });
  }

});
