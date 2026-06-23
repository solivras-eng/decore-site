/**
 * JSON-LD : EventVenue enrichi (home) + avis détaillés (témoignages).
 * Charge après config.js ; fetch reviews.json sur pages concernées.
 */
(function () {
  var cfg = window.DECOR_SITE || {};
  var legal = cfg.legal || {};
  var biz = cfg.business || {};
  var maps = cfg.googleMaps || {};
  var base = String(cfg.siteBaseUrl || '').replace(/\/$/, '');
  var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var isTestimonials = /temoignages\.html$/i.test(location.pathname);

  function postalAddress() {
    return {
      '@type': 'PostalAddress',
      streetAddress: legal.addressLine || 'rue Édouard Vaillant',
      addressLocality: legal.city || undefined,
      postalCode: legal.postalCode || undefined,
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    };
  }

  function sameAsList() {
    var list = [
      'https://www.instagram.com/decoralenvers/',
      'https://www.facebook.com/ledecoralenvers/?locale=fr_FR',
      'https://www.abcsalles.com/lieu/le-decor-envers',
    ];
    var g = String(cfg.googleBusinessUrl || '').trim();
    if (g && list.indexOf(g) === -1) list.push(g);
    return list;
  }

  function aggregateRating() {
    var ar = biz.aggregateRating || { ratingValue: 5.0, reviewCount: 19 };
    return {
      '@type': 'AggregateRating',
      ratingValue: String(ar.ratingValue != null ? ar.ratingValue : 5),
      reviewCount: String(ar.reviewCount != null ? ar.reviewCount : 19),
      bestRating: '5',
      worstRating: '1',
    };
  }

  function venueBase() {
    var desc = isEn ? biz.descriptionEn : biz.descriptionFr;
    return {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      name: biz.publicName || legal.tradeName || "Le Décor à l'Envers",
      description: desc || undefined,
      url: isEn ? base + '/en/' : base + '/',
      email: cfg.contactEmail || 'contact@agnesbouche.com',
      address: postalAddress(),
      image: [
        base + '/assets/og-image.jpg',
        base + '/assets/photos/hero/PMIK5106-1920.jpg',
      ],
      sameAs: sameAsList(),
      priceRange: biz.priceRange || '€€',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: maps.lat != null ? maps.lat : 48.8567105,
        longitude: maps.lng != null ? maps.lng : 2.4163807,
      },
      aggregateRating: aggregateRating(),
    };
  }

  function reviewText(r) {
    var t = r.text || {};
    if (typeof r.text === 'string') return r.text;
    return (isEn ? t.en : t.fr) || t.fr || t.en || '';
  }

  function toSchemaReview(r) {
    var body = reviewText(r);
    if (!body) return null;
    return {
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author || 'Guest' },
      datePublished: r.date || undefined,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating != null ? r.rating : 5),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: body,
    };
  }

  function injectScript(data) {
    var el = document.querySelector('script[type="application/ld+json"]');
    if (el && !isTestimonials) {
      try {
        var existing = JSON.parse(el.textContent);
        Object.assign(existing, {
          name: data.name,
          description: data.description,
          geo: data.geo,
          priceRange: data.priceRange,
          aggregateRating: data.aggregateRating,
          sameAs: data.sameAs,
        });
        el.textContent = JSON.stringify(existing, null, 2);
        return;
      } catch (_) { /* fall through */ }
    }
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }

  function runWithReviews(reviews) {
    var data = venueBase();
    if (isTestimonials && Array.isArray(reviews)) {
      data.review = reviews
        .slice(0, 10)
        .map(toSchemaReview)
        .filter(Boolean);
      data.url = isEn ? base + '/en/temoignages.html' : base + '/temoignages.html';
    }
    injectScript(data);
  }

  if (isTestimonials) {
    var path = isEn ? '../assets/data/reviews.json' : 'assets/data/reviews.json';
    fetch(path)
      .then(function (res) {
        return res.ok ? res.json() : { reviews: [] };
      })
      .then(function (json) {
        runWithReviews(json.reviews || []);
      })
      .catch(function () {
        runWithReviews([]);
      });
  } else if (document.querySelector('script[type="application/ld+json"]')) {
    runWithReviews([]);
  }
})();
