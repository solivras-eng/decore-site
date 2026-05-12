# Mise en ligne (GitHub + Vercel + IONOS)

**Italiano (intro)** — Questa guida spiega come pubblicare il sito: repository GitHub, deploy su Vercel, dominio (es. IONOS) e modulo Formspree. Il repository ufficiale è **`solivras-eng/decore-site`**: [https://github.com/solivras-eng/decore-site](https://github.com/solivras-eng/decore-site). Per panoramica del codice vedi anche [`README.md`](README.md) e [`STRUCTURE.md`](STRUCTURE.md).

---

Ce dossier `decore-site` est la **racine du site** : tout le HTML, CSS, JS et les images sous `assets/` (y compris `assets/gallery/`) doivent être versionnés et déployés ensemble.

## 1. Dépôt GitHub

1. Créez un dépôt vide sur GitHub.
2. En local, à la racine de **ce dossier** (`decore-site`) :

   ```bash
   git init
   git add .
   git commit -m "Initial site statique Le Décor à l'Envers"
   git branch -M main
   git remote add origin https://github.com/solivras-eng/decore-site.git
   git push -u origin main
   ```

Les photos dans `assets/gallery/` peuvent être lourdes ; si Git refuse le push, utilisez [Git LFS](https://git-lfs.com) pour `*.jpg` / `*.JPG` / `*.png`, ou compressez les images avant commit.

## 2. Vercel

1. Connectez-vous sur [vercel.com](https://vercel.com) avec GitHub.
2. **Add New Project** → importez le dépôt.
3. **Root Directory** : laissez `/` si le repo ne contient que `decore-site` ; si le repo est le dossier parent, indiquez `decore-site`.
4. **Framework Preset** : **Other** (aucun build ; site statique HTML/CSS/JS).
5. Déployez : l’URL `*.vercel.app` sert de prévisualisation.

## 3. Domaine IONOS → Vercel

1. Dans Vercel : **Project → Settings → Domains** → ajoutez votre domaine (ex. `www.exemple.fr` et/ou apex `exemple.fr`).
2. Suivez les instructions Vercel (souvent **CNAME** `www` → `cname.vercel-dns.com` ; pour l’apex, enregistrements **A** indiqués par Vercel ou **ALIAS** selon ce qu’IONOS propose).
3. Dans le panneau DNS IONOS, créez/modifiez les enregistrements ; la propagation peut prendre jusqu’à 48 h.
4. HTTPS est géré par Vercel une fois le domaine validé.

## 4. Quand l’URL canonique change

Alignez la même base **sans slash final** partout :

- [`config.js`](config.js) → `siteBaseUrl`
- Toutes les balises `link rel="canonical"`, `hreflang`, `og:url`, `twitter:image` (URLs absolues), blocs JSON-LD dans `index.html` et `en/index.html`
- [`sitemap.xml`](sitemap.xml) et [`robots.txt`](robots.txt) (ligne `Sitemap:`)

Recherche globale dans le projet : `https://www.decoralenvers.fr` → votre nouvelle URL.

## 5. Formulaire (Formspree)

1. Dans le tableau de bord Formspree : formulaire lié à l’ID dans `config.js` / pages contact.
2. Ajoutez le domaine Vercel (preview + production) aux domaines autorisés si demandé.
3. Vérifiez l’e-mail de notification (ex. `contact@agnesbouche.com`).
4. Testez un envoi depuis l’URL de production.
