/* ============================================================
   script.js — Portfolio Interactivity
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Sticky header ────────────────────────────────────── */
  const header = $('#header');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initialize on load

  /* ── Active nav link on scroll ────────────────────────── */
  const navLinks = $$('.nav__link');
  const sections = $$('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 100;
    let current = '';

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  /* ── Mobile navigation toggle ─────────────────────────── */
  const navToggle = $('#navToggle');
  const navList = $('#navList');

  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    });
  });

  /* ── Project filter tabs ──────────────────────────────── */
  const filterBtns = $$('.filter__btn');
  const projectCards = $$('.project__card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show / hide cards
      projectCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          // Re-trigger fade-in animation
          card.classList.remove('fade-in');
          void card.offsetWidth; // reflow
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Scroll reveal animation ──────────────────────────── */
  const revealEls = $$('.project__card, .about__inner, .contact__form, .stat');
  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── Contact form ─────────────────────────────────────── */
  const contactForm = $('#contactForm');
  const formFeedback = $('#formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formFeedback.textContent = '';
      formFeedback.className = 'form__feedback';

      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const message = $('#message').value.trim();
      let valid = true;

      // Simple validation
      [
        { id: 'name', value: name },
        { id: 'email', value: email },
        { id: 'message', value: message },
      ].forEach(({ id, value }) => {
        const el = $(`#${id}`);
        if (!value) {
          el.classList.add('error');
          valid = false;
        } else {
          el.classList.remove('error');
        }
      });

      // Email format check
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $('#email').classList.add('error');
        valid = false;
      }

      if (!valid) {
        formFeedback.textContent = 'Please fill in all required fields correctly.';
        formFeedback.classList.add('error');
        return;
      }

      // Simulate submission (no backend)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        contactForm.reset();
        formFeedback.textContent = '✓ Your message has been sent. I'll be in touch soon!';
        formFeedback.classList.add('success');

        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className = 'form__feedback';
        }, 5000);
      }, 1200);
    });

    // Clear error state on input
    $$('#contactForm input, #contactForm textarea').forEach((el) => {
      el.addEventListener('input', () => el.classList.remove('error'));
    });
  }

  /* ── Footer year ──────────────────────────────────────── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
