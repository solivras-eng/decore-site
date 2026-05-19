#!/usr/bin/env python3
"""Add srcset to gallery <img> tags that have -640/-1280 variants."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SRC_RE = re.compile(
    r'(src=")((?:\.\./)?assets/gallery/[^"]+\.(?:jpe?g|JPE?G))(")',
    re.IGNORECASE,
)

SIZES_GRID = '(max-width: 768px) 50vw, 400px'
SIZES_STACK = '(max-width: 768px) 90vw, 560px'
SIZES_HERO = '100vw'


def variant_path(rel_src: str, suffix: str) -> Path:
    clean = rel_src.replace("../", "")
    path = ROOT / clean
    return path.parent / f"{path.stem}{suffix}{path.suffix}"


def build_srcset(rel_src: str) -> str | None:
    if re.search(r"-\d+\.(jpe?g|JPE?G)$", rel_src, re.I):
        return None
    if not variant_path(rel_src, "-640").is_file():
        return None
    m = re.match(r"^(.+)(\.[^.]+)$", rel_src, re.I)
    if not m:
        return None
    base, ext = m.group(1), m.group(2)
    return f'{base}-640{ext} 640w, {base}-1280{ext} 1280w, {rel_src} 1920w'


def default_src(rel_src: str) -> str:
    m = re.match(r"^(.+)(\.[^.]+)$", rel_src, re.I)
    if not m:
        return rel_src
    base, ext = m.group(1), m.group(2)
    candidate = f"{base}-1280{ext}"
    if variant_path(rel_src, "-1280").is_file():
        return candidate
    return rel_src


def sizes_for(text: str, pos: int) -> str:
    window = text[max(0, pos - 120) : pos + 80]
    if "page-hero-bg" in window:
        return SIZES_HERO
    if "img-stack" in window:
        return SIZES_STACK
    return SIZES_GRID


def patch_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        prefix, src, suffix = m.group(1), m.group(2), m.group(3)
        start = m.start()
        window = text[max(0, start - 80) : start + 200]
        if "<img" not in window and "img-stack" not in window and "page-hero-bg" not in window:
            return m.group(0)
        if "srcset=" in window:
            return m.group(0)
        srcset = build_srcset(src)
        if not srcset:
            return m.group(0)
        new_src = default_src(src)
        sizes = sizes_for(text, start)
        count += 1
        return f'{prefix}{new_src}{suffix} srcset="{srcset}" sizes="{sizes}"'

    new_text = SRC_RE.sub(repl, text)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
    return count


def main() -> None:
    files = [
        ROOT / "index.html",
        ROOT / "en" / "index.html",
        ROOT / "galerie.html",
        ROOT / "en" / "galerie.html",
        ROOT / "contact.html",
        ROOT / "en" / "contact.html",
        ROOT / "l-artiste.html",
        ROOT / "en" / "the-artist.html",
    ]
    total = 0
    for fp in files:
        if not fp.is_file():
            continue
        n = patch_file(fp)
        print(f"{fp.relative_to(ROOT)}: {n} images updated")
        total += n
    print(f"Total: {total}")


if __name__ == "__main__":
    main()
