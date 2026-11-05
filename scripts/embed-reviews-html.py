#!/usr/bin/env python3
"""Embed crawlable review cards from reviews.json into temoignages HTML."""

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "assets" / "data" / "reviews.json"
MARKER = "<!-- REVIEWS-HTML -->"
END_MARKER = "<!-- /REVIEWS-HTML -->"
FILES = [
    (ROOT / "temoignages.html", "fr"),
    (ROOT / "en" / "temoignages.html", "en"),
]

MONTHS_FR = [
    "", "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc.",
]
MONTHS_EN = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]


def format_date(iso: str, lang: str) -> str:
    parts = iso.split("-")
    if len(parts) != 3:
        return iso
    y, m, d = int(parts[0]), int(parts[1]), int(parts[2])
    if lang == "en":
        return f"{MONTHS_EN[m]} {d}, {y}"
    return f"{d} {MONTHS_FR[m]} {y}"


def stars(rating: int, lang: str) -> str:
    n = max(0, min(5, int(rating)))
    filled = "★" * n
    empty = "☆" * (5 - n)
    label = f"{n} sur 5" if lang == "fr" else f"{n} out of 5"
    return f'<span class="review-stars" aria-label="{label}">{filled}{empty}</span>'


def card_html(review: dict, lang: str) -> str:
    text = review.get("text", {})
    body = html.escape(text.get(lang) or text.get("fr") or text.get("en") or "", quote=False)
    author = html.escape(review.get("author", ""), quote=False)
    date = format_date(review.get("date", ""), lang)
    rating = review.get("rating", 5)
    return f"""      <article class="review-card" itemscope itemtype="https://schema.org/Review">
        {stars(rating, lang)}
        <blockquote class="review-card-quote" itemprop="reviewBody"><p>{body}</p></blockquote>
        <footer class="review-card-meta">
          <cite class="review-card-author" itemprop="author">{author}</cite>
          <span class="review-card-date">Google Maps · {date}</span>
        </footer>
      </article>"""


def build_grid(reviews: list, lang: str, total_reviews: int = 0) -> str:
    cards = "\n".join(card_html(r, lang) for r in reviews)
    total = total_reviews or len(reviews)
    intro = (
        f"Extraits illustratifs — les {total} avis vérifiés sont disponibles sur notre fiche Google."
        if lang == "fr"
        else f"Illustrative excerpts — all {total} verified reviews are on our Google listing."
    )
    heading = "Ce qu'ils en disent" if lang == "fr" else "What guests say"
    eyebrow = "Avis" if lang == "fr" else "Reviews"
    return f"""    <div class="section-header reveal" style="margin-bottom:2rem;">
      <span class="eyebrow text-rouille">{eyebrow}</span>
      <div class="gold-rule"></div>
      <h2 class="section-title" style="color:var(--navy); font-size:clamp(1.5rem,3vw,2rem);">{heading}</h2>
      <p class="body-text" style="max-width:42rem; margin-top:0.75rem;">{intro}</p>
    </div>
    <div class="review-grid-inner reveal">
{cards}
    </div>"""


LEGACY_RE = re.compile(
    re.escape(MARKER) + r'\n    <div class="section-header.*?<div class="review-grid-inner reveal">.*?\n    </div>',
    re.S,
)


def embed_file(path: Path, lang: str, reviews: list, total: int) -> None:
    """Idempotent: the generated block lives between MARKER and END_MARKER."""
    text = path.read_text(encoding="utf-8")
    if MARKER not in text:
        raise SystemExit(f"Marker not found in {path}")
    block = f"{MARKER}\n{build_grid(reviews, lang, total)}\n    {END_MARKER}"
    if END_MARKER in text:
        pattern = re.compile(re.escape(MARKER) + r".*?" + re.escape(END_MARKER), re.S)
        new_text = pattern.sub(lambda _: block, text, count=1)
    elif LEGACY_RE.search(text):
        # First run after the switch: replace the grid written by the old script.
        new_text = LEGACY_RE.sub(lambda _: block, text, count=1)
    else:
        new_text = text.replace(MARKER, block, 1)
    path.write_text(new_text, encoding="utf-8")
    print(f"Updated {path.relative_to(ROOT)}")


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    reviews = data.get("reviews", [])
    total = data.get("meta", {}).get("aggregateRating", {}).get("reviewCount", 0)
    for path, lang in FILES:
        embed_file(path, lang, reviews, total)


if __name__ == "__main__":
    main()
