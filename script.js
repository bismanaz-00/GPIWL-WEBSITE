/**
 * GPIWL Website - script.js
 * Handles: navbar scroll, hamburger menu, smooth scroll,
 *          stats counter, scroll reveal, form validation, scroll-to-top
 */

/* =========================================================
   1. DOM Ready
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initStatsCounter();
  initFormValidation();
  initScrollTop();
  setActiveNavLink();
});

/* =========================================================
   2. Navbar: sticky shadow on scroll
   ========================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* =========================================================
   3. Hamburger Menu
   ========================================================= */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      // Allow dropdown toggle on mobile
      const parent = link.parentElement;
      if (parent.classList.contains('has-dropdown')) {
        parent.classList.toggle('open');
        return;
      }
      closeMobileMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* =========================================================
   4. Smooth Scroll for anchor links
   ========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const y = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* =========================================================
   5. Active Nav Link on Scroll (Intersection Observer)
   ========================================================= */
function setActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* =========================================================
   6. Scroll Reveal (Intersection Observer)
   ========================================================= */
function initScrollReveal() {
  // Add reveal classes to elements
  const revealMap = [
    { selector: '.program-card',    cls: 'reveal' },
    { selector: '.facility-card',   cls: 'reveal' },
    { selector: '.stat-item',       cls: 'reveal' },
    { selector: '.gallery-item',    cls: 'reveal' },
    { selector: '.about__media',    cls: 'reveal-left' },
    { selector: '.about__text',     cls: 'reveal-right' },
    { selector: '.admissions__text',cls: 'reveal-left' },
    { selector: '.admissions__form',cls: 'reveal-right' },
    { selector: '.contact-info',    cls: 'reveal-left' },
    { selector: '.contact-map',     cls: 'reveal-right' },
    { selector: '.section-header',  cls: 'reveal' },
  ];

  revealMap.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* =========================================================
   7. Stats Counter Animation
   ========================================================= */
function initStatsCounter() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10));
      });
    }
  }, { threshold: 0.4 });

  observer.observe(statsSection);
}

function animateCounter(el, target) {
  const duration  = 1800;
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (target - startVal) * ease);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* =========================================================
   8. Admission Form Validation
   ========================================================= */
function initFormValidation() {
  const form = document.getElementById('admissionForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.getElementById('formSuccess').classList.remove('show');

    // Full Name
    const name = document.getElementById('fname');
    if (!name.value.trim() || name.value.trim().length < 3) {
      showError('fnameErr', 'Please enter your full name (min 3 chars).');
      valid = false;
    }

    // Email
    const email = document.getElementById('femail');
    if (!isValidEmail(email.value.trim())) {
      showError('femailErr', 'Please enter a valid email address.');
      valid = false;
    }

    // Phone
    const phone = document.getElementById('fphone');
    if (!phone.value.trim() || phone.value.trim().length < 7) {
      showError('fphoneErr', 'Please enter a valid phone number.');
      valid = false;
    }

    // Program
    const prog = document.getElementById('fprogram');
    if (!prog.value) {
      showError('fprogramErr', 'Please select a program.');
      valid = false;
    }

    if (valid) {
      // Simulate submission
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        document.getElementById('formSuccess').classList.add('show');
      }, 1400);
    }
  });

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
}

/* =========================================================
   9. Scroll To Top Button
   ========================================================= */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
