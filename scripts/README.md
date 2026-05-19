# Scripts decore-site

## optimize-gallery.sh

Generates responsive JPEG variants next to each original in `assets/gallery/`:

- `filename-1280.jpg` — long edge max 1280 px
- `filename-640.jpg` — long edge max 640 px

Originals are **not** modified.

```bash
cd decore-site
chmod +x scripts/optimize-gallery.sh
./scripts/optimize-gallery.sh
```

Requires **macOS** `sips` (built-in). After running, commit the new `-640` / `-1280` files.

## add-gallery-srcset.py

Adds `srcset` / `sizes` to gallery `<img>` tags in main HTML pages (run after `optimize-gallery.sh`):

```bash
python3 scripts/add-gallery-srcset.py
```

## embed-reviews-html.py

Embeds static review cards into `temoignages.html` and `en/temoignages.html` at the `<!-- REVIEWS-HTML -->` marker (crawlable HTML for SEO). Run after editing `assets/data/reviews.json`:

```bash
python3 scripts/embed-reviews-html.py
```
