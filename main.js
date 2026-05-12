/* ═══════════════════════════════════════════════════
   LE DÉCOR À L'ENVERS — Shared JS
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const useFineCursor = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion;

  /* ─── FILM GRAIN ──────────────────────────────── */
  if (!prefersReducedMotion) {
    const grain = document.createElement('div');
    grain.className = 'grain';
    document.body.appendChild(grain);
  }

  /* ─── CUSTOM CURSOR (desktop uniquement) ──────── */
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let dot = null;
  let ring = null;

  if (useFineCursor) {
    dot = document.createElement('div');
    ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
    });

    function updateCursorColor() {
      const el = document.elementFromPoint(mx, my);
      if (!el) return;
      const bg = window.getComputedStyle(el.closest('[class*="section"]') || el).backgroundColor;
      const isDark = bg.includes('10, 18, 40') || bg.includes('17, 29, 58');
      document.body.classList.toggle('cursor-dark', isDark);
    }
    setInterval(updateCursorColor, 200);
  }

  /* ─── HEADER SCROLL ───────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 55);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── ACTIVE NAV LINK ─────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav a, .drawer-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ─── MOBILE MENU ─────────────────────────────── */
  const hamburger    = document.querySelector('.hamburger');
  const drawer       = document.querySelector('.drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  if (hamburger && drawer) {
    const toggleMenu = open => {
      hamburger.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
      drawerOverlay?.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };

    hamburger.addEventListener('click', () => toggleMenu(!drawer.classList.contains('open')));
    drawerOverlay?.addEventListener('click', () => toggleMenu(false));
    document.querySelectorAll('.drawer-nav a').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });
  }

  /* ─── REVEAL ON SCROLL ────────────────────────── */
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  /* ─── TESTIMONIAL CAROUSEL (one block per .testimonial-wrap) ─ */
  document.querySelectorAll('.testimonial-wrap').forEach(wrap => {
    const root = wrap.closest('.container') || document;
    const testimonials = root.querySelectorAll('[data-testimonial]');
    const dots = wrap.querySelectorAll('.testimonial-dot');
    const quoteEl = wrap.querySelector('.testimonial-quote');
    const authorEl = wrap.querySelector('.testimonial-author');
    const roleEl = wrap.querySelector('.testimonial-role');

    if (!testimonials.length || !quoteEl || !authorEl) return;

    let current = 0;

    const show = idx => {
      current = (idx + testimonials.length) % testimonials.length;
      const t = testimonials[current];
      quoteEl.style.opacity = '0';
      authorEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = t.dataset.quote;
        authorEl.textContent = t.dataset.author;
        if (roleEl) roleEl.textContent = t.dataset.role || '';
        quoteEl.style.opacity = '1';
        authorEl.style.opacity = '1';
      }, 280);
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
    show(0);

    let timer = null;
    if (!prefersReducedMotion) {
      timer = setInterval(() => show(current + 1), 5000);
    }
    dots.forEach(d => {
      d.addEventListener('click', () => {
        if (timer) clearInterval(timer);
        if (!prefersReducedMotion) {
          timer = setInterval(() => show(current + 1), 5000);
        }
      });
    });
  });

  /* ─── CONTACT FORM (Formspree, fetch JSON) ─────── */
  const contactForm = document.querySelector('.contact-form');
  const formSuccess = document.querySelector('.form-success');
  const formErrorEl = document.getElementById('form-error');

  function showFormSuccess(formEl) {
    if (!formEl || !formSuccess) return;
    formEl.style.opacity = '0';
    formEl.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      formEl.style.display = 'none';
      formSuccess.style.display = 'block';
      setTimeout(() => { formSuccess.style.opacity = '1'; }, 20);
    }, 400);
  }

  function showFormError(message) {
    if (!formErrorEl) return;
    formErrorEl.textContent = message;
    formErrorEl.hidden = false;
  }

  function clearFormError() {
    if (!formErrorEl) return;
    formErrorEl.textContent = '';
    formErrorEl.hidden = true;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      clearFormError();

      const action = contactForm.getAttribute('action');
      if (!action || !/^https:\/\/formspree\.io\//i.test(action)) {
        showFormError('Formulaire mal configuré (action Formspree manquante).');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (submitBtn) submitBtn.disabled = false;

        if (res.ok) {
          showFormSuccess(contactForm);
          return;
        }

        let msg = 'Envoi impossible. Réessayez ou écrivez à contact@agnesbouche.com.';
        try {
          const data = await res.json();
          if (data && data.error) {
            msg = typeof data.error === 'string' ? data.error : (data.error.title || msg);
          }
        } catch (_) { /* ignore */ }
        showFormError(msg);
      } catch (_) {
        if (submitBtn) submitBtn.disabled = false;
        showFormError('Réseau indisponible. Réessayez dans un instant.');
      }
    });
  }

  /* ─── MOBILE STICKY CTA (header btn hidden ≤1024px) ─ */
  (function mobileStickyCta() {
    if (document.querySelector('.mobile-sticky-cta')) return;
    const bar = document.createElement('div');
    bar.className = 'mobile-sticky-cta';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Action rapide');
    const page = (location.pathname.split('/').pop() || '').toLowerCase();
    const href = page === 'contact.html' ? '#contact-form' : 'contact.html';
    const link = document.createElement('a');
    link.href = href;
    link.className = 'btn btn-primary mobile-sticky-cta__btn';
    link.textContent = document.documentElement.lang === 'en' ? 'Request a quote' : 'Demander un devis';
    bar.appendChild(link);
    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-sticky-cta');
  })();

  /* ─── PARALLAX (subtle) ───────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.innerWidth > 768 && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${y}px) scale(1.06)`;
    }, { passive: true });
  }

  /* ─── SMOOTH ANCHOR SCROLL ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
