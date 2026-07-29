/* ═══════════════════════════════════════════════════
   LE DÉCOR À L'ENVERS — Shared JS
   ═══════════════════════════════════════════════════ */

function siteConfig() {
  return window.DECOR_SITE || {};
}

function isEnglishPage() {
  return document.documentElement.lang === 'en' || /\/en\//.test(location.pathname);
}

function assetPath(relative) {
  return isEnglishPage() ? '../' + relative : relative;
}

function injectGoogleLinks() {
  const cfg = siteConfig();
  const biz = String(cfg.googleBusinessUrl || '').trim();
  const review = String(cfg.googleReviewUrl || '').trim();
  const isEn = isEnglishPage();

  if (biz) {
    document.querySelectorAll('.footer-social, .contact-social-links').forEach(el => {
      if (el.querySelector('[data-google-link]')) return;
      const a = document.createElement('a');
      a.href = biz;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Google';
      a.setAttribute('data-google-link', '');
      if (el.classList.contains('footer-social')) {
        const soon = el.querySelector('.footer-soon');
        if (soon) el.insertBefore(a, soon);
        else el.appendChild(a);
      } else {
        el.appendChild(a);
      }
    });
  }

  document.querySelectorAll('[data-gbp-disclaimer]').forEach(el => {
    if (!biz) return;
    const link = document.createElement('a');
    link.href = biz;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Google';
    link.style.color = 'var(--rouille)';
    const prefix = document.createTextNode(isEn ? ' and our ' : ' et notre fiche ');
    const suffix = document.createTextNode(isEn ? ' listing.' : '.');
    el.appendChild(prefix);
    el.appendChild(link);
    el.appendChild(suffix);
  });

  document.querySelectorAll('[data-gbp-review-cta]').forEach(el => {
    if (!review) return;
    const a = document.createElement('a');
    a.href = review;
    a.className = 'btn btn-outline';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = isEn ? 'Leave a review on Google' : 'Laisser un avis sur Google';
    el.appendChild(a);
    el.hidden = false;
    el.style.display = 'inline-block';
    el.style.marginTop = '1rem';
  });
}

function buildMapsEmbedUrl() {
  const cfg = siteConfig();
  const maps = cfg.googleMaps || {};
  const custom = String(maps.embedUrl || '').trim();
  if (custom) return custom;
  const lat = maps.lat;
  const lng = maps.lng;
  if (lat == null || lng == null) return '';
  const zoom = maps.zoom != null ? maps.zoom : 16;
  const q = encodeURIComponent(lat + ',' + lng);
  const hl = isEnglishPage() ? 'en' : 'fr';
  return 'https://maps.google.com/maps?q=' + q + '&hl=' + hl + '&z=' + zoom + '&output=embed';
}

function injectGoogleMaps() {
  const embedSrc = buildMapsEmbedUrl();
  const biz = String(siteConfig().googleBusinessUrl || '').trim();
  const isEn = isEnglishPage();
  if (!embedSrc) return;

  document.querySelectorAll('[data-google-map]').forEach(wrap => {
    if (wrap.querySelector('iframe')) return;
    const iframe = document.createElement('iframe');
    iframe.src = embedSrc;
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute(
      'title',
      isEn
        ? "Map — Le Décor à l'Envers, Bagnolet"
        : "Carte — Le Décor à l'Envers, Bagnolet"
    );
    iframe.setAttribute('allowfullscreen', '');
    wrap.appendChild(iframe);

    const linkEl = wrap.parentElement && wrap.parentElement.querySelector('[data-google-map-link]');
    if (linkEl && biz) {
      linkEl.href = biz;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.hidden = false;
    }
  });
}

function patchJsonLdSameAs() {
  const biz = String(siteConfig().googleBusinessUrl || '').trim();
  if (!biz) return;
  const el = document.querySelector('script[type="application/ld+json"]');
  if (!el) return;
  try {
    const data = JSON.parse(el.textContent);
    data.sameAs = data.sameAs || [];
    if (!data.sameAs.includes(biz)) data.sameAs.push(biz);
    el.textContent = JSON.stringify(data, null, 2);
  } catch (_) { /* ignore */ }
}

function reviewQuote(r) {
  if (r.quote) return r.quote;
  const t = r.text || {};
  if (typeof t === 'string') return t;
  return isEnglishPage() ? (t.en || t.fr || '') : (t.fr || t.en || '');
}

function formatReviewRole(r) {
  const isEn = isEnglishPage();
  const monthsFr = ['', 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const monthsEn = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let dateLabel = '';
  if (r.date) {
    const p = String(r.date).split('-');
    if (p.length === 3) {
      const y = p[0];
      const m = parseInt(p[1], 10);
      const d = p[2];
      dateLabel = isEn ? `${monthsEn[m]} ${d}, ${y}` : `${d} ${monthsFr[m]} ${y}`;
    }
  }
  const src = r.source || 'Google Maps';
  return dateLabel ? `${src} · ${dateLabel}` : (isEn ? 'Google review' : 'Avis Google');
}

async function loadGoogleReviews() {
  const stores = document.querySelectorAll('[data-testimonial-store]');
  if (!stores.length) return;
  try {
    const res = await fetch(assetPath('assets/data/reviews.json'));
    if (!res.ok) return;
    const data = await res.json();
    const reviews = Array.isArray(data.reviews) ? data.reviews : [];
    stores.forEach(store => {
      while (store.firstChild) store.removeChild(store.firstChild);
      reviews.forEach(r => {
        const quote = reviewQuote(r);
        if (!quote) return;
        const div = document.createElement('div');
        div.setAttribute('data-testimonial', '');
        div.dataset.quote = quote;
        div.dataset.author = r.author || '';
        div.dataset.role = formatReviewRole(r);
        div.dataset.source = 'google';
        if (r.rating != null) div.dataset.rating = String(r.rating);
        if (r.date) div.dataset.date = r.date;
        store.appendChild(div);
      });
    });
  } catch (_) { /* optional file */ }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadGoogleReviews();
  injectGoogleLinks();
  injectGoogleMaps();
  patchJsonLdSameAs();

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
  document.querySelectorAll('.drawer-nav a').forEach(a => {
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
    const dotsContainer = wrap.querySelector('.testimonial-dots');
    const quoteEl = wrap.querySelector('.testimonial-quote');
    const authorEl = wrap.querySelector('.testimonial-author');
    const roleEl = wrap.querySelector('.testimonial-role');

    if (!testimonials.length || !quoteEl || !authorEl) return;

    const dots = [];
    if (dotsContainer) {
      while (dotsContainer.firstChild) dotsContainer.removeChild(dotsContainer.firstChild);
      testimonials.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', (isEnglishPage() ? 'Testimonial ' : 'Témoignage ') + (i + 1));
        dotsContainer.appendChild(btn);
        dots.push(btn);
      });
    }

    let current = 0;

    let starsEl = wrap.querySelector('.testimonial-stars');
    if (!starsEl) {
      starsEl = document.createElement('div');
      starsEl.className = 'testimonial-stars';
      wrap.insertBefore(starsEl, quoteEl);
    }

    const renderStars = rating => {
      const n = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
      if (!n) {
        starsEl.textContent = '';
        starsEl.removeAttribute('aria-label');
        return;
      }
      starsEl.textContent = '★'.repeat(n) + '☆'.repeat(5 - n);
      starsEl.setAttribute(
        'aria-label',
        isEnglishPage() ? `${n} out of 5 stars` : `${n} sur 5`
      );
    };

    const show = idx => {
      current = (idx + testimonials.length) % testimonials.length;
      const t = testimonials[current];
      quoteEl.style.opacity = '0';
      authorEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = t.dataset.quote;
        authorEl.textContent = t.dataset.author;
        if (roleEl) roleEl.textContent = t.dataset.role || '';
        renderStars(t.dataset.rating);
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

      const emailInput = contactForm.querySelector('[name="email"]');
      const replytoInput = contactForm.querySelector('[name="_replyto"]');
      if (emailInput && replytoInput) replytoInput.value = emailInput.value.trim();

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

  /* ─── MOBILE STICKY CTA (header btn hidden ≤1280px) ─ */
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
