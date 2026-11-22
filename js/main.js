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
      document.body.classList.toggle('nav-open-lock', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        document.body.classList.remove('nav-open-lock');
        if (menuToggle) {
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close drawer when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('nav-open')) {
        navLinks.classList.remove('nav-open');
        document.body.classList.remove('nav-open-lock');
        if (menuToggle) {
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
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

  /* ─── 8. Pan-India State-by-State Project Inspector ─── */
  const stateHubs = {
    gujarat: {
      title: 'Gujarat (Mundra) Mega Hub',
      client: 'Adani Petrochemical / Ardee Infrastructure',
      scope: '₹13.0 Cr Structural Fabrication (₹8 Cr) & Erection (₹5 Cr) Package for coal conveyor gantry and transfer towers.',
      m1: '₹13.0 Cr', l1: 'Contract Scale',
      m2: '4,200 MT', l2: 'Fabrication',
      m3: '100% NDT', l3: 'Weld Clearance',
      caps: 'Heavy fabrication shop, ACE 15T mobile hydra cranes, Lincoln 500A inverter MIG welding, airless painting & certified NDT inspection.',
      telemetry: 'LOC: 22.84° N, 69.72° E | MUNDRA RADAR LOCK'
    },
    odisha: {
      title: 'Odisha (Angul & Paradip Port) Hub',
      client: 'Jindal Steel & Power Ltd. & ISGEC Heavy Eng',
      scope: '15,000+ MT Sa 2.5 Grit Blasting & Polyurethane Coating + Paradip Marine Scaffolding & Mechanical Rigging.',
      m1: '₹4.2 Cr+', l1: 'Active Packages',
      m2: '15,000+ MT', l2: 'Blasting & Coating',
      m3: 'Sa 2.5', l3: 'Profile 75µ',
      caps: 'Graco Xtreme 70:1 airless spray units, 750 CFM screw compressors, copper slag blast pots & NACE Level II inspection.',
      telemetry: 'LOC: 20.84° N, 85.10° E | ANGUL & PARADIP LOCK'
    },
    maharashtra: {
      title: 'Maharashtra (Nagpur) Power Utility Hub',
      client: 'Mahagenco Thermal Power Station',
      scope: '₹2.9 Cr High-Pressure Fire Fighting Water Piping, Pump House Erection & Thermal Line Fabrication (Nagpur).',
      m1: '₹2.9 Cr', l1: 'Piping Package',
      m2: '8,500 RMT', l2: 'Pipe Erection',
      m3: '40 Bar', l3: 'Hydro-Tested',
      caps: 'Pipe bevelling machines, TIG/MIG orbital welding units, calibrated hydro-testing skids & IBR-qualified pipe welders.',
      telemetry: 'LOC: 21.14° N, 79.08° E | NAGPUR RADAR LOCK'
    },
    telangana: {
      title: 'Telangana (Cement & Power) Hub',
      client: 'KEC Maha Cement & BHEL Power Sector',
      scope: '1,200 MT Clinker Line Structural Fabrication, Raw Mill Ducting & BHEL Thermal Sheeting Installation.',
      m1: '1,200 MT', l1: 'Clinker Line Fab',
      m2: '18,000 SQM', l2: 'Industrial Sheeting',
      m3: 'On-Schedule', l3: 'Milestone Delivery',
      caps: 'Heavy plate bending rolls, 400A welding rectifiers, 50m boom cranes & certified height-safety rigging crews.',
      telemetry: 'LOC: 17.14° N, 79.62° E | SURYAPET RADAR LOCK'
    },
    jharkhand: {
      title: 'Jharkhand (Steel Plant Engineering) Hub',
      client: 'Tata Projects Contractor Network',
      scope: 'Heavy Crane Girder Fabrication, Rolling Mill Foundation Inserts & High-Bay Erection Packages (Jamshedpur / Bokaro).',
      m1: '850 MT', l1: 'Crane Girders',
      m2: '100% UT', l2: 'Groove Welds',
      m3: 'Zero Defect', l3: 'Shop Sign-Off',
      caps: 'Submerged arc welding (SAW), automated gantry cutting torches, ultrasonic flaw detectors & ASME IX certified crew.',
      telemetry: 'LOC: 22.80° N, 86.20° E | JAMSHEDPUR RADAR LOCK'
    },
    chhattisgarh: {
      title: 'Chhattisgarh (Central Industrial Basin) Hub',
      client: 'AM/NS India • Struc-Rite • DCPL Cement',
      scope: '₹2.5 Cr Thermal Spray Metalising, BEC Heavy Equipment Painting & DCPL Cement Plant Fabrication (Bhilai / Durg / Raipur).',
      m1: '₹2.5 Cr', l1: 'Metalising & Painting',
      m2: '250 Micron', l2: 'High-Build Epoxy',
      m3: 'ISO Sa 3', l3: 'Metalising Substrate',
      caps: 'Twin-wire arc spray metalising systems, blast chambers, mobile hydra units & protective coating inspection.',
      telemetry: 'LOC: 21.19° N, 81.28° E | BHILAI RADAR LOCK'
    }
  };

  const statePills = document.querySelectorAll('.state-pill');
  const beaconNodes = document.querySelectorAll('.beacon-node');
  const siteTitle = document.getElementById('map-site-title');
  const siteClient = document.getElementById('map-site-client');
  const siteScope = document.getElementById('map-site-scope');
  const hubM1 = document.getElementById('hub-m1');
  const hubL1 = document.getElementById('hub-l1');
  const hubM2 = document.getElementById('hub-m2');
  const hubL2 = document.getElementById('hub-l2');
  const hubM3 = document.getElementById('hub-m3');
  const hubL3 = document.getElementById('hub-l3');
  const siteCaps = document.getElementById('map-site-caps');
  const radarTelemetry = document.getElementById('radar-telemetry-text');

  function selectStateHub(hubId) {
    const hub = stateHubs[hubId];
    if (!hub) return;

    // Update Pill active states
    statePills.forEach(p => p.classList.toggle('active', p.getAttribute('data-state-id') === hubId));

    // Update Beacon active states
    beaconNodes.forEach(b => b.classList.toggle('active-node', b.getAttribute('data-state-id') === hubId));

    // Update Details
    if (siteTitle) siteTitle.textContent = hub.title;
    if (siteClient) siteClient.textContent = hub.client;
    if (siteScope) siteScope.textContent = hub.scope;
    if (hubM1) hubM1.textContent = hub.m1;
    if (hubL1) hubL1.textContent = hub.l1;
    if (hubM2) hubM2.textContent = hub.m2;
    if (hubL2) hubL2.textContent = hub.l2;
    if (hubM3) hubM3.textContent = hub.m3;
    if (hubL3) hubL3.textContent = hub.l3;
    if (siteCaps) siteCaps.innerHTML = `<strong>Site Capabilities:</strong> ${hub.caps}`;
    if (radarTelemetry && hub.telemetry) radarTelemetry.textContent = hub.telemetry;
  }

  if (statePills.length) {
    statePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const hubId = pill.getAttribute('data-state-id');
        selectStateHub(hubId);
      });
    });
  }

  if (beaconNodes.length && siteTitle) {
    beaconNodes.forEach(node => {
      node.addEventListener('click', () => {
        const hubId = node.getAttribute('data-state-id');
        if (hubId && stateHubs[hubId]) {
          selectStateHub(hubId);
        } else {
          beaconNodes.forEach(b => b.classList.remove('active-node'));
          node.classList.add('active-node');
          const stateName = node.getAttribute('data-state-name');
          const client = node.getAttribute('data-site-client');
          const scope = node.getAttribute('data-site-scope');
          siteTitle.textContent = `${stateName} Deployment Hub`;
          if (siteClient) siteClient.textContent = client;
          if (siteScope) siteScope.textContent = scope;
        }
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

  /* ─── 10. Technical Tender Prequalification FAQ Accordion ─── */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          const parentAccordion = item.closest('.faq-accordion');
          if (parentAccordion) {
            parentAccordion.querySelectorAll('.faq-item').forEach(other => {
              if (other !== item) {
                other.classList.remove('active');
                const btn = other.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
              }
            });
          }

          if (isActive) {
            item.classList.remove('active');
            questionBtn.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
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

  /* ─── 12. Instant 60-Second EPC Tonnage & Mobilization Estimator (Home) ─── */
  const estButtons = document.querySelectorAll('.estimator-btn');
  const estTimeVal = document.getElementById('est-time-val');
  const estFleetVal = document.getElementById('est-fleet-val');
  const estCrewVal = document.getElementById('est-crew-val');
  const estWindowVal = document.getElementById('est-window-val');
  const estWaBtn = document.getElementById('btn-est-wa');
  const estEmailBtn = document.getElementById('btn-est-email');

  let estimatorState = {
    sector: 'Steel Plant',
    scope: 'Structural Fabrication & Erection',
    scale: '500 - 1,500 MT'
  };

  const scaleProfiles = {
    '< 500 MT': {
      time: '7–10 Working Days',
      fleet: '1x ACE 15T Hydra + 6x 400A Inverter Welders',
      crew: '25–35 Certified Fabricators & Welders',
      window: '45–60 Calendar Days'
    },
    '500 - 1,500 MT': {
      time: '7–10 Working Days',
      fleet: '2x ACE 15T Hydra + 12x 500A Inverters + Graco Airless',
      crew: '45–65 Certified Fabricators & AWS 3G/6G Welders',
      window: '75–100 Calendar Days'
    },
    '1,500 - 5,000 MT': {
      time: '10–14 Working Days',
      fleet: '3x Heavy Cranes + Submerged Arc (SAW) + 20x Inverters',
      crew: '85–120 Multi-Disciplinary Riggers & NDT Technicians',
      window: '120–160 Calendar Days'
    },
    '5,000+ MT': {
      time: '14–18 Working Days',
      fleet: 'Full Dedicated On-Site Shop + Heavy Rigging Fleet',
      crew: '150–220 Structural Boilersmiths & ASNT Level II Team',
      window: '180–240 Calendar Days'
    }
  };

  function updateEstimatorDisplay() {
    const profile = scaleProfiles[estimatorState.scale] || scaleProfiles['500 - 1,500 MT'];
    if (estTimeVal) estTimeVal.textContent = profile.time;
    if (estFleetVal) estFleetVal.textContent = profile.fleet;
    if (estCrewVal) estCrewVal.textContent = profile.crew;
    if (estWindowVal) estWindowVal.textContent = profile.window;
  }

  if (estButtons.length) {
    estButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.getAttribute('data-est-group');
        const val = btn.getAttribute('data-est-val');
        if (!group || !val) return;

        document.querySelectorAll(`.estimator-btn[data-est-group="${group}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        estimatorState[group] = val;
        updateEstimatorDisplay();
      });
    });
  }

  if (estWaBtn) {
    estWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const profile = scaleProfiles[estimatorState.scale] || scaleProfiles['500 - 1,500 MT'];
      const text = encodeURIComponent(`*Tender Inquiry - Navtara Projects*\n\nTarget Sector: ${estimatorState.sector}\nPrimary Scope: ${estimatorState.scope}\nEstimated Scale: ${estimatorState.scale}\nEstimated Mobilization: ${profile.time}\nEstimated Fleet: ${profile.fleet}\nEstimated Crew: ${profile.crew}\n\nPlease share formal engineering feasibility, mobilization schedule, and preliminary quotation.`);
      window.open(`https://wa.me/919838889618?text=${text}`, '_blank');
      showToast('Opening WhatsApp with your project parameters...');
    });
  }

  if (estEmailBtn) {
    estEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const profile = scaleProfiles[estimatorState.scale] || scaleProfiles['500 - 1,500 MT'];
      const subject = encodeURIComponent(`Tender RFQ - ${estimatorState.sector} (${estimatorState.scale})`);
      const body = encodeURIComponent(`Dear Navtara Projects Estimations Team,\n\nWe require an official commercial proposal and mobilization timeline for our project:\n\n- Target Sector: ${estimatorState.sector}\n- Engineering Scope: ${estimatorState.scope}\n- Estimated Scale: ${estimatorState.scale}\n- Expected Mobilization: ${profile.time}\n- Expected Crew: ${profile.crew}\n\nPlease review feasibility and get in touch.\n\nThank you.`);
      window.location.href = `mailto:Navtaraprojects@outlook.com?subject=${subject}&body=${body}`;
      showToast('Opening Outlook email with RFQ specs...');
    });
  }

});
