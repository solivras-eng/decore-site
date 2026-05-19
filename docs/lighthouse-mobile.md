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
| Galerie | Variantes `-640` / `-1280`, `srcset` + `sizes` (home, galerie) |
| Galerie | `loading="lazy"`, `width` / `height`, `decoding="async"` |
| Polices | Google Fonts async (`media="print" onload`) |
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
- Réduire encore le poids des originaux galerie (option : ne pas servir les JPG 3000 px si `-1280` suffit).
- Compléter `legal.siren` / `legal.siret` dans `config.js` si vous souhaitez les afficher sur les mentions légales.

## Historique des scores

| Date | URL | Perf | A11y | BP | SEO | Notes |
|------|-----|------|------|-----|-----|-------|
| 2026-05-19 (avant variantes images) | `/` | 67 | 96 | 96 | 100 | LCP ~7,3 s ; JPEG galerie très lourds ; fonts bloquantes |
| 2026-05-19 (après commit `7a0f511`) | `/` | 70 | 96 | 96 | 100 | LCP ~5,5 s ; srcset galerie ; fonts non bloquantes ; ~555 KiB images encore optimisables |
