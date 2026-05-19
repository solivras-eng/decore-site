# Mise en ligne (GitHub + Vercel + IONOS)

**Italiano (intro)** — Guida per pubblicare il sito: repository GitHub, deploy Vercel, dominio IONOS (`decoralenvers.com`), Formspree e Google Business. Repository: [solivras-eng/decore-site](https://github.com/solivras-eng/decore-site).

---

Ce dossier `decore-site` est la **racine du site** : HTML, CSS, JS et images sous `assets/`.

## 1. Dépôt GitHub

```bash
git clone https://github.com/solivras-eng/decore-site.git
cd decore-site
# … modifications …
git push -u origin main
```

Utilisez un compte avec droits d’écriture sur l’org **solivras-eng** (sinon erreur 403).

## 2. Vercel

1. [vercel.com](https://vercel.com) → import du dépôt.
2. **Framework Preset** : **Other** (site statique).
3. URL de prévisualisation : `*.vercel.app`.

## 3. Domaine IONOS → Vercel

**Domaine de production** : `https://www.decoralenvers.com`

1. Vercel → **Project → Settings → Domains** → `www.decoralenvers.com` + `decoralenvers.com`.
2. DNS IONOS : **CNAME** `www` → `cname.vercel-dns.com` ; apex → enregistrements **A** Vercel ou redirection vers `www`.
3. HTTPS automatique après validation.

## 4. URL canonique (`.com`)

Une seule base **sans slash final** :

- [`config.js`](config.js) → `siteBaseUrl`
- Balises `canonical`, `hreflang`, `og:url`, JSON-LD
- [`sitemap.xml`](sitemap.xml), [`robots.txt`](robots.txt)

## 5. Formulaire Formspree

**ID** : `xpqbkkoa` (dans `config.js` et pages contact).

### Checklist tableau de bord [formspree.io](https://formspree.io)

1. **Notifications** → email : `contact@agnesbouche.com`
2. **Allowed domains** (si demandé) :
   - `www.decoralenvers.com`
   - `decoralenvers.com`
   - votre `*.vercel.app` (tests)
3. **Test production** :
   - [contact.html](https://www.decoralenvers.com/contact.html) (FR)
   - [en/contact.html](https://www.decoralenvers.com/en/contact.html) (EN)
   - Vérifier : message de succès sur la page, entrée dans **Submissions**, mail reçue (spam inclus)

**Statut (mai 2026)** : les **Submissions Formspree** sont confirmées opérationnelles en production.

Le site envoie `_replyto` depuis l’email du visiteur pour répondre directement depuis votre boîte mail.

**Mentions légales** : adresse 18 rue Édouard Vaillant, directrice Agnès Bouche. Complétez `legal.siren` / `legal.siret` dans `config.js` (Kbis).

## 6. Google Business (gratuit, sans widget payant)

### Sur Google

1. [business.google.com](https://business.google.com) → fiche **Le Décor à l'Envers**.
2. **Site web** : `https://www.decoralenvers.com`
3. Copier :
   - URL de la fiche (Maps / g.page)
   - Lien **Demander des avis** / « Get more reviews »

### Dans le code ([`config.js`](config.js))

```js
googleBusinessUrl: 'https://…',  // fiche Google (Maps)
googleReviewUrl: 'https://…',    // lien « Demander des avis » uniquement
googleMaps: { lat, lng, zoom, embedUrl: '' },  // carte contact + le-loft
```

- **`googleBusinessUrl`** : lien **Partager** de la fiche Maps (déjà renseigné en prod).
- **`googleReviewUrl`** : lien **Demander des avis** (pas la fiche Maps) — voir ci-dessous.
- Carte intégrée sur `contact.html` et `le-loft.html` (iframe sans clé API).

**Statut (mai 2026)** : `googleReviewUrl` configuré — bouton avis actif sur [temoignages.html](temoignages.html).

### Avis sur le site (sans API payante)

1. Ouvrez votre fiche [Google Business](https://business.google.com) → section **Avis**.
2. Copiez le **texte** et le **prénom** de 3 à 6 avis récents (avec autorisation implicite via publication publique).
3. Éditez [`assets/data/reviews.json`](assets/data/reviews.json) :

```json
{
  "reviews": [
    {
      "quote": "Texte de l'avis…",
      "author": "Marie D.",
      "role": "Mariage — avis Google",
      "source": "google"
    }
  ]
}
```

4. Commit + push. Le carousel sur témoignages FR/EN se met à jour automatiquement (`main.js`).

Pas d’import automatique (évite API Google facturée).

### Images galerie (variantes responsive)

```bash
./scripts/optimize-gallery.sh          # génère -640 et -1280 (macOS sips)
python3 scripts/add-gallery-srcset.py  # après ajout d’images, met à jour le HTML
```

Voir [`scripts/README.md`](scripts/README.md).

### Google Search Console (recommandé, manuel)

1. [search.google.com/search-console](https://search.google.com/search-console) → **Ajouter une propriété**.
2. Choisir **Préfixe d’URL** : `https://www.decoralenvers.com`
3. **Vérification** : balise HTML (copier dans `<head>` de `index.html` temporairement) ou DNS TXT chez IONOS.
4. Une fois validé : **Sitemaps** → envoyer `https://www.decoralenvers.com/sitemap.xml`
5. **Inspection d’URL** → tester la home et `contact.html` pour demander l’indexation.
6. Surveiller **Couverture** et **Expérience** après 1–2 semaines.

## 7. Lighthouse mobile

Optimisations : `content-visibility`, fonts async, hero preload, variantes JPEG `-640`/`-1280` + `srcset` sur home et galerie ([`styles.css`](styles.css), [`scripts/`](scripts/)).

**Audit local** (Chrome Lighthouse ou CLI) :

```bash
npx lighthouse https://www.decoralenvers.com/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile \
  --output=html --output-path=./lighthouse-mobile.html
```

Cibles indicatives : Performance ≥ 85, Accessibilité ≥ 90, SEO ≥ 90.

Voir aussi [`docs/lighthouse-mobile.md`](docs/lighthouse-mobile.md) après chaque audit majeur.

## 8. Vérification post-deploy

| Test | URL / action |
|------|----------------|
| Home FR/EN | `/` et `/en/` |
| Form | Submissions Formspree OK (confirmé) |
| Mentions légales | Directrice + adresse ; SIREN dans `config.js` si dispo |
| Sitemap | `/sitemap.xml` (toutes URLs en `.com`) |
| JSON-LD | [Rich Results Test](https://search.google.com/test/rich-results) sur la home |
| Google / avis | Footer Google, bouton avis témoignages, mappa contact |
| Images | Home/galerie chargent `-640` sur mobile (srcset) |
| Photo Agnès | Déposer `assets/photos/agnes.jpg` + `artistPhoto` dans `config.js` |
