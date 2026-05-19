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

Le site envoie `_replyto` depuis l’email du visiteur pour répondre directement depuis votre boîte mail.

## 6. Google Business (gratuit, sans widget payant)

### Sur Google

1. [business.google.com](https://business.google.com) → fiche **Le Décor à l'Envers**.
2. **Site web** : `https://www.decoralenvers.com`
3. Copier :
   - URL de la fiche (Maps / g.page)
   - Lien **Demander des avis** / « Get more reviews »

### Dans le code ([`config.js`](config.js))

```js
googleBusinessUrl: 'https://…',  // fiche Google
googleReviewUrl: 'https://…',    // lien « laisser un avis »
```

Tant que ces champs sont vides, les liens Google n’apparaissent pas (footer, témoignages).

### Avis sur le site (sans API payante)

- Fichier [`assets/data/reviews.json`](assets/data/reviews.json) : copiez manuellement 3–6 avis Google (texte, auteur).
- Pas d’import automatique (évite API Google facturée et widgets tiers).

### Search Console (recommandé)

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Propriété `https://www.decoralenvers.com`
3. Soumettre `https://www.decoralenvers.com/sitemap.xml`

## 7. Vérification post-deploy

| Test | URL / action |
|------|----------------|
| Home FR/EN | `/` et `/en/` |
| Form | Envoi test contact FR + EN |
| Sitemap | `/sitemap.xml` (toutes URLs en `.com`) |
| JSON-LD | [Rich Results Test](https://search.google.com/test/rich-results) sur la home |
| Google links | Après remplissage `config.js`, lien « Google » dans le footer |
