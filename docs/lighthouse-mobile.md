# Lighthouse mobile — Le Décor à l'Envers

Audit **mobile** du site en production (`https://www.decoralenvers.com`).

## Commande

```bash
cd decore-site
npx lighthouse https://www.decoralenvers.com/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile \
  --output=html --output-path=./lighthouse-mobile.html
```

Pages utiles à tester en plus : `/galerie.html`, `/contact.html`.

## Optimisations déjà en place

| Zone | Mesure |
|------|--------|
| CSS | `content-visibility: auto` sur sections hors hero (mobile) |
| Effet grain | désactivé sur mobile (moins de repaint) |
| Hero | `preload` image LCP, `fetchpriority="high"` |
| Galerie | `loading="lazy"`, `width` / `height`, `decoding="async"` |
| Polices | Google Fonts avec `display=swap` |
| Assets | cache long via `vercel.json` |

## Cibles indicatives

| Catégorie | Objectif |
|-----------|----------|
| Performance | ≥ 85 |
| Accessibilité | ≥ 90 |
| Bonnes pratiques | ≥ 90 |
| SEO | ≥ 90 |

## Prochaines améliorations (optionnel)

- Remplacer la photo placeholder sur `l-artiste.html` par une image WebP optimisée (`width`/`height` fixes).
- Renseigner `googleBusinessUrl` dans `config.js` (lien Maps, pas d’impact Lighthouse direct).
- Compléter `legal.siren` / `legal.siret` dans `config.js` si vous souhaitez les afficher sur les mentions légales.

## Historique des scores

| Date | URL | Perf | A11y | BP | SEO | Notes |
|------|-----|------|------|-----|-----|-------|
| 2026-05-19 (prod, avant déploiement optimisations) | `/` | 67 | 96 | 96 | 100 | LCP ~7,3 s ; JPEG galerie très lourds ; fonts bloquantes |
| _après déploiement_ | `/` | — | — | — | — | fonts async, hero preload mobile, content-visibility |
