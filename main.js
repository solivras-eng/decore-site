/* ═══════════════════════════════════════════════════
   LE DÉCOR À L'ENVERS — Shared JS
   ═══════════════════════════════════════════════════ */

function siteConfig() {
  return window.DECOR_SITE || {};
}

function isEnglishPage() {
  return document.documentElement.lang === 'en' || /\/en\//.test(location.pathname);
}

const I18N = {
  fr: {
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    quickAction: 'Action rapide',
    formMisconfigured: 'Formulaire mal configuré (action Formspree manquante).',
    sendFailed: 'Envoi impossible. Réessayez ou écrivez à contact@agnesbouche.com.',
    network: 'Réseau indisponible. Réessayez dans un instant.',
  },
  en: {
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    quickAction: 'Quick action',
    formMisconfigured: 'Form is misconfigured (Formspree action missing).',
    sendFailed: 'Could not send. Please try again or email contact@agnesbouche.com.',
    network: 'Network unavailable. Please try again in a moment.',
  },
};

function t(key) {
  return I18N[isEnglishPage() ? 'en' : 'fr'][key];
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

/* ─── COOKIE CONSENT (Google Maps embed is the only non-essential
   cookie this site sets — no analytics, no ads) ──────────────── */
const MAP_CONSENT_KEY = 'decor_map_consent'; // 'accepted' | 'declined'

function getMapConsent() {
  try { return localStorage.getItem(MAP_CONSENT_KEY); } catch (_) { return null; }
}
function setMapConsent(value) {
  try { localStorage.setItem(MAP_CONSENT_KEY, value); } catch (_) { /* ignore */ }
}

function loadMapIframe(wrap) {
  if (wrap.querySelector('iframe')) return;
  const embedSrc = buildMapsEmbedUrl();
  if (!embedSrc) return;
  const placeholder = wrap.querySelector('.map-consent-placeholder');
  if (placeholder) placeholder.remove();
  const iframe = document.createElement('iframe');
  iframe.src = embedSrc;
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.setAttribute(
    'title',
    isEnglishPage()
      ? "Map — Le Décor à l'Envers, Bagnolet"
      : "Carte — Le Décor à l'Envers, Bagnolet"
  );
  iframe.setAttribute('allowfullscreen', '');
  wrap.appendChild(iframe);
}

function showMapConsentPlaceholder(wrap) {
  if (wrap.querySelector('.map-consent-placeholder') || wrap.querySelector('iframe')) return;
  const isEn = isEnglishPage();
  const placeholder = document.createElement('div');
  placeholder.className = 'map-consent-placeholder';
  const p = document.createElement('p');
  p.textContent = isEn
    ? 'This map is provided by Google and sets a third-party cookie. Show it only if you agree.'
    : "Cette carte est fournie par Google et dépose un cookie tiers. Affichez-la seulement si vous êtes d'accord.";
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-ghost';
  btn.textContent = isEn ? 'Show the map' : 'Afficher la carte';
  btn.addEventListener('click', () => {
    setMapConsent('accepted');
    loadMapIframe(wrap);
    hideCookieBanner();
  });
  placeholder.appendChild(p);
  placeholder.appendChild(btn);
  wrap.appendChild(placeholder);
}

function injectGoogleMaps() {
  const embedSrc = buildMapsEmbedUrl();
  const biz = String(siteConfig().googleBusinessUrl || '').trim();
  if (!embedSrc) return;

  document.querySelectorAll('[data-google-map]').forEach(wrap => {
    if (wrap.querySelector('iframe') || wrap.querySelector('.map-consent-placeholder')) return;
    if (getMapConsent() === 'accepted') {
      loadMapIframe(wrap);
    } else {
      showMapConsentPlaceholder(wrap);
    }

    const linkEl = wrap.parentElement && wrap.parentElement.querySelector('[data-google-map-link]');
    if (linkEl && biz) {
      linkEl.href = biz;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.hidden = false;
    }
  });
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.classList.remove('open');
  setTimeout(() => banner.remove(), 400);
}

function showCookieBanner() {
  if (document.getElementById('cookie-banner')) return;
  const isEn = isEnglishPage();
  const privacyHref = isEn ? 'privacy.html' : 'confidentialite.html';

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', isEn ? 'Cookie preferences' : 'Préférences cookies');

  const text = document.createElement('p');
  text.className = 'cookie-banner-text';
  text.appendChild(document.createTextNode(
    isEn
      ? 'We use a single optional cookie — Google Maps, to show the venue map on some pages. No tracking, no advertising, nothing else. '
      : 'Nous utilisons un seul cookie optionnel : Google Maps, pour afficher la carte du lieu sur certaines pages. Aucun traceur, aucune publicité, rien d’autre. '
  ));
  const link = document.createElement('a');
  link.href = privacyHref;
  link.textContent = isEn ? 'Learn more' : 'En savoir plus';
  text.appendChild(link);

  const actions = document.createElement('div');
  actions.className = 'cookie-banner-actions';
  const declineBtn = document.createElement('button');
  declineBtn.type = 'button';
  declineBtn.id = 'cookie-decline';
  declineBtn.className = 'btn btn-dark';
  declineBtn.textContent = isEn ? 'Decline' : 'Refuser';
  const acceptBtn = document.createElement('button');
  acceptBtn.type = 'button';
  acceptBtn.id = 'cookie-accept';
  acceptBtn.className = 'btn btn-primary';
  acceptBtn.textContent = isEn ? 'Accept' : 'Accepter';
  actions.appendChild(declineBtn);
  actions.appendChild(acceptBtn);

  banner.appendChild(text);
  banner.appendChild(actions);
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('open'));

  declineBtn.addEventListener('click', () => {
    setMapConsent('declined');
    hideCookieBanner();
  });
  acceptBtn.addEventListener('click', () => {
    setMapConsent('accepted');
    hideCookieBanner();
    document.querySelectorAll('[data-google-map]').forEach(loadMapIframe);
  });
}

function initCookieConsent() {
  if (getMapConsent() == null) showCookieBanner();

  const isEn = isEnglishPage();
  document.querySelectorAll('.footer-legal').forEach(el => {
    if (el.querySelector('[data-cookie-settings]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-cookie-settings', '');
    btn.textContent = isEn ? 'Cookie settings' : 'Gérer les cookies';
    btn.addEventListener('click', showCookieBanner);
    el.appendChild(btn);
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
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(assetPath('assets/data/reviews.json'), { signal: ctrl.signal });
    clearTimeout(timeout);
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

document.addEventListener('DOMContentLoaded', () => {
  // Les avis se chargent en arrière-plan : le reste de la page ne les attend pas.
  const reviewsReady = loadGoogleReviews();
  injectGoogleLinks();
  injectGoogleMaps();
  patchJsonLdSameAs();
  initCookieConsent();

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
    document.documentElement.classList.add('has-custom-cursor');
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
      // Onglet masqué : on suspend la boucle, elle repart à la reprise.
      if (document.hidden) {
        document.addEventListener('visibilitychange', animateRing, { once: true });
        return;
      }
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
    setInterval(() => { if (!document.hidden) updateCursorColor(); }, 200);
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
      hamburger.setAttribute('aria-label', open ? t('menuClose') : t('menuOpen'));
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
  // Démarre une fois les avis injectés (ou si le chargement a échoué).
  reviewsReady.then(() => { document.querySelectorAll('.testimonial-wrap').forEach(wrap => {
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

    quoteEl.setAttribute('aria-live', 'polite');

    let timer = null;
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      if (!prefersReducedMotion && !document.hidden) {
        timer = setInterval(() => show(current + 1), 5000);
      }
    };
    start();
    // Pause au survol, au focus clavier et quand l'onglet est masqué (WCAG 2.2.2).
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);
    wrap.addEventListener('focusin', stop);
    wrap.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    dots.forEach(d => d.addEventListener('click', start));
  }); });

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
      formSuccess.setAttribute('role', 'status');
      formSuccess.setAttribute('tabindex', '-1');
      formSuccess.focus({ preventScroll: false });
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
        showFormError(t('formMisconfigured'));
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

        let msg = t('sendFailed');
        try {
          const data = await res.json();
          if (data && data.error) {
            msg = typeof data.error === 'string' ? data.error : (data.error.title || msg);
          }
        } catch (_) { /* ignore */ }
        showFormError(msg);
      } catch (_) {
        if (submitBtn) submitBtn.disabled = false;
        showFormError(t('network'));
      }
    });
  }

  /* ─── MOBILE STICKY CTA (header btn hidden ≤1280px) ─ */
  (function mobileStickyCta() {
    if (document.querySelector('.mobile-sticky-cta')) return;
    const bar = document.createElement('div');
    bar.className = 'mobile-sticky-cta';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', t('quickAction'));
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

  /* ─── ZOOMABLE PHOTOS (standalone .img-frame[data-zoomable]) ─
     Lets any thumbnail cropped via object-fit:cover be opened
     full-frame (object-fit:contain) so the whole photo is always
     visible. Pages with their own gallery lightbox (galerie.html,
     oeuvres.html) don't use data-zoomable and are unaffected. */
  (function initZoomablePhotos() {
    const frames = Array.from(document.querySelectorAll('.img-frame[data-zoomable]'));
    if (!frames.length) return;
    const isEn = isEnglishPage();

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'zoom-lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="' + (isEn ? 'Close' : 'Fermer') + '">✕</button>' +
      '<button type="button" class="lightbox-nav lightbox-nav--prev" aria-label="' + (isEn ? 'Previous photo' : 'Photo précédente') + '">‹</button>' +
      '<button type="button" class="lightbox-nav lightbox-nav--next" aria-label="' + (isEn ? 'Next photo' : 'Photo suivante') + '">›</button>' +
      '<img src="" alt="">' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lightbox-caption');
    const lbClose = lb.querySelector('.lightbox-close');
    const lbPrev = lb.querySelector('.lightbox-nav--prev');
    const lbNext = lb.querySelector('.lightbox-nav--next');
    let index = 0;
    let focusReturn = null;

    if (frames.length < 2) {
      lbPrev.style.display = 'none';
      lbNext.style.display = 'none';
    }

    function show(i) {
      index = (i + frames.length) % frames.length;
      const img = frames[index].querySelector('img');
      if (!img) return;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lbCap.textContent = img.alt || '';
    }

    function openAt(i) {
      show(i);
      lb.classList.add('open');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', isEn ? 'Full-size photo' : 'Photo en entier');
      lb.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      focusReturn = document.activeElement;
      lbClose.focus();
    }

    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lb.removeAttribute('role');
      lb.removeAttribute('aria-modal');
      document.body.style.overflow = '';
      if (focusReturn && typeof focusReturn.focus === 'function') focusReturn.focus();
    }

    frames.forEach((frame, i) => {
      frame.setAttribute('role', 'button');
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('aria-label', isEn ? 'View full photo' : 'Voir la photo en entier');
      frame.addEventListener('click', () => openAt(i));
      frame.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
      });
    });

    lbPrev.addEventListener('click', e => { e.stopPropagation(); show(index - 1); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); show(index + 1); });
    lbClose.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });
  })();

});
