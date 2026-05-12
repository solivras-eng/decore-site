# Le Décor à l'Envers — sito statico

Sito vetrina per la location eventi **Le Décor à l'Envers** (Bagnolet). Contenuto in **HTML**, stili in **CSS** ([`styles.css`](styles.css)), comportamento condiviso in **JavaScript** ([`main.js`](main.js)). Versione francese nella root; versione inglese sotto [`en/`](en/).

**Repository GitHub:** [https://github.com/solivras-eng/decore-site](https://github.com/solivras-eng/decore-site)

### Organizzazione e account (importante)

Il codice vive sotto l’organizzazione **`solivras-eng`**, repository **`decore-site`** — non sotto un utente personale tipo `fedeforai`. Per **`git push`** e per collegare **Vercel** al repo, GitHub deve autenticarti con un account che ha **diritto di scrittura** su `solivras-eng/decore-site` (membro dell’org `solivras-eng`, deploy key, o PAT generato da quell’account). Se sul Mac è salvata la sessione di un altro utente (es. `fedeforai`), Git rifiuterà il push con **403**: usa `gh auth login` con l’account corretto oppure [revoca / aggiorna le credenziali](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories) in Accesso Portachiavi per `github.com`.

## Anteprima locale

Dalla root di questo progetto (la cartella che contiene `index.html`):

```bash
cd "/percorso/verso/decore-site"
python3 -m http.server 8080
```

Apri nel browser `http://localhost:8080/` (FR) e `http://localhost:8080/en/` (EN). Le immagini devono stare sotto [`assets/`](assets/); non servono build né installazione di dipendenze.

## Struttura (sintesi)

```
decore-site/
├── index.html          # Home FR
├── contact.html        # … altre pagine FR (.html)
├── en/                 # Stesse sezioni in inglese
├── assets/
│   ├── logos/
│   ├── photos/hero/
│   ├── gallery/        # Libreria foto per il sito
│   └── og-image.jpg
├── styles.css
├── main.js
├── config.js           # Formspree + URL base (vedi sotto)
├── sitemap.xml
├── robots.txt
├── vercel.json
├── DEPLOY.md           # GitHub, Vercel, dominio IONOS, Formspree
└── STRUCTURE.md        # Mappa dettagliata pagine e cartelle
```

## Configurazione rapida

- **[`config.js`](config.js)** — `siteBaseUrl` (URL canonico del sito) e `formspreeId` per il modulo contatti. Devono coincidere con i `action` del form in `contact.html` / `en/contact.html`.
- **Dominio** — Se cambi dominio, aggiorna anche canonical, Open Graph, JSON-LD, `sitemap.xml` e `robots.txt` (istruzioni in [`DEPLOY.md`](DEPLOY.md) sezione 4).

## Pubblicazione

Segui la guida **[DEPLOY.md](DEPLOY.md)** (GitHub già collegabile a questo repo, Vercel, DNS IONOS, test Formspree).

### Primo clone / push (sintesi)

```bash
git clone https://github.com/solivras-eng/decore-site.git
cd decore-site
```

Per autenticazione su `git push`: [GitHub CLI](https://cli.github.com/) (`gh auth login`), **Personal Access Token** (HTTPS) oppure **SSH** (`git@github.com:solivras-eng/decore-site.git`) se hai già una chiave registrata su GitHub.

**Errore 403 / «Permission denied»** — Di solito significa che Git sta usando un account **senza** permesso sull’org **`solivras-eng`** (es. push tentato come `fedeforai` verso `solivras-eng/decore-site`). Accedi con un utente membro di **`solivras-eng`** o con PAT/SSH associati a quell’accesso. Poi dalla cartella del sito:

```bash
git push -u origin main
```

### Repository pesante (immagini)

Se `assets/gallery/` supera i limiti consigliati da GitHub, valuta [Git LFS](https://git-lfs.com) o la compressione delle immagini prima del commit (vedi anche `DEPLOY.md`).
