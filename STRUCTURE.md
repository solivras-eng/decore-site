# Struttura del progetto

## Pagine HTML

### Francese (root)

| File | Contenuto indicativo |
|------|----------------------|
| `index.html` | Home |
| `le-loft.html` | Il loft |
| `evenements.html` | Eventi |
| `galerie.html` | Galleria foto |
| `temoignages.html` | Testimonianze |
| `disponibilites.html` | Disponibilità |
| `services.html` | Servizi |
| `l-artiste.html` | L'artista |
| `contact.html` | Contatto / preventivo (Formspree) |
| `mentions-legales.html` | Note legali |
| `confidentialite.html` | Privacy / RGPD |

### Inglese (`en/`)

| File | Contenuto indicativo |
|------|----------------------|
| `en/index.html` | Home EN |
| `en/le-loft.html` | The loft |
| `en/evenements.html` | Events |
| `en/galerie.html` | Gallery |
| `en/temoignages.html` | Testimonials |
| `en/disponibilites.html` | Availability |
| `en/services.html` | Services |
| `en/the-artist.html` | The artist |
| `en/contact.html` | Contact (Formspree) |
| `en/legal-notice.html` | Legal notice |
| `en/privacy.html` | Privacy |

Le pagine FR/EN sono collegate tra loro (switch lingua, `hreflang`, canonical).

## Risorse statiche (`assets/`)

| Percorso | Uso |
|----------|-----|
| `assets/logos/` | Logo header (es. `logo-header.png`) |
| `assets/photos/hero/` | Immagini hero responsive (`srcset`) |
| `assets/og-image.jpg` | Anteprima social (Open Graph / Twitter) |
| `assets/gallery/` | Libreria fotografica del sito (sottocartelle per ambiente: SALON, CUISINE, JARDIN, ecc.) |

I percorsi nelle pagine **FR** usano prefissi tipo `assets/...`; le pagine **EN** usano `../assets/...`.

## Script e configurazione

| File | Ruolo |
|------|--------|
| `styles.css` | Stile globale |
| `main.js` | Menu, drawer, cursore, lightbox galleria, invio form (validazione / messaggi) |
| `config.js` | `window.DECOR_SITE`: `siteBaseUrl`, `formspreeId` — usato da `main.js` e dalle pagine contact per l'endpoint Formspree |

## SEO e server

| File | Ruolo |
|------|--------|
| `sitemap.xml` | URL delle pagine per i motori di ricerca |
| `robots.txt` | Regole crawler + URL della sitemap |
| `vercel.json` | Configurazione deploy su Vercel (es. cache header per `/assets/*`) |
