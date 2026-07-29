# Mobile gallery fullscreen carousel — Design

Date: 2026-07-29  
Project: Le Décor à l'Envers (`decore-site`)

## Problem

On mobile, gallery images open in a simple lightbox with prev/next arrow buttons only. There is no true fullscreen photo browsing and no touch-friendly swipe between images.

## Goal

On small viewports, tapping a gallery image opens a **fullscreen horizontal carousel** with native scroll-snap. Desktop keeps the existing arrow/keyboard lightbox.

## Scope

### In scope

- French and English pages:
  - `galerie.html` / `en/galerie.html`
  - `oeuvres.html` / `en/oeuvres.html`
  - `index.html` / `en/index.html` (homepage `.gallery-grid` section)
- Shared viewer module + CSS in `styles.css`
- Mobile: fullscreen carousel (swipe / scroll-snap)
- Desktop: preserve current lightbox behavior
- Respect active category filters when building the mobile slide list (Galerie / Œuvres)
- Captions + counter (e.g. `3 / 24`)
- Close via ✕, backdrop tap, Escape; restore focus to the opened thumbnail
- Safe-area insets and ≥44px touch targets on mobile

### Out of scope

- Redesign of grid layout, filter bar UX, or page heroes
- Pinch-to-zoom
- Third-party lightbox libraries
- Changing desktop visual design beyond wiring the shared module
- Pull-down-to-close if it conflicts with horizontal scroll (nice-to-have only if stable)

## Approaches considered

| Option | Description | Decision |
|--------|-------------|----------|
| A — Lightbox + swipe | Keep current overlay; add touch swipe | Rejected — less native feel |
| B — Fullscreen carousel | Black fullscreen track, scroll-snap | **Chosen** |
| C — Vertical stories feed | One photo per screen, vertical swipe | Rejected — wrong metaphor for venue/art gallery |

Desktop split: mobile carousel + desktop lightbox (chosen) vs one unified carousel everywhere (rejected to reduce risk).

## Behavior

### Open

1. User taps a gallery thumbnail (masonry item or homepage grid item).
2. Overlay opens fullscreen; body scroll locks.
3. Carousel (mobile) or single image (desktop) shows the tapped item.
4. Mobile track scrolls so the active slide is centered/snapped immediately.

### Navigate (mobile)

- Horizontal native scrolling with `scroll-snap-type: x mandatory`
- One slide = ~100vw, image `object-fit: contain`
- Optional discrete prev/next controls (secondary to swipe)
- Counter and caption update on scroll/snap settle
- Slide set = currently interactive/visible items only (filter-aware)

### Navigate (desktop)

- Existing prev/next buttons and arrow keys
- Same caption/counter if easy to share; otherwise keep current caption-only UX

### Close

- Close button, backdrop click, Escape
- Unlock body scroll; return focus to the thumbnail that opened the viewer

## Architecture

### Shared script

Add `gallery-viewer.js` (name may vary) included by Galerie, Œuvres, and homepage (FR + EN).

Responsibilities:

- Collect items from a configured selector (`.gallery-masonry-item`, `.gallery-item`, etc.)
- Filter to items that are currently openable (e.g. `pointer-events` not none / not hidden by filter)
- Pick best image URL from `src` / `srcset` for large display
- Switch mode by `matchMedia('(max-width: 900px)')` (align with existing filter scroll breakpoint)
- Manage open/close, keyboard, focus, aria (`role="dialog"`, `aria-modal`, localized labels)

Inline page scripts for lightbox/filters should be slimmed: filters stay page-local; viewer logic moves to the shared module.

### Markup

Reuse/extend the existing `.lightbox` root where present, or inject a single shared viewer shell once per page:

- Track container for mobile slides
- Single `<img>` path for desktop mode (or hide track and show one slide)
- Close, prev, next, caption, counter

Homepage currently has no lightbox markup — add the shared shell + script there.

### CSS

New BEM-ish classes under the viewer (e.g. `.gallery-viewer__track`, `__slide`, `__counter`) in `styles.css`:

- Mobile: full viewport, black background, snap track, safe areas
- Desktop: keep current centered contained image + nav chrome
- Prefer `prefers-reduced-motion` for open/scroll behavior where applicable

### i18n

FR/EN pages pass or hardcode aria strings already used (`Fermer` / `Close`, etc.). No new translation system.

## Testing

Manual:

1. Mobile width / real device: open Galerie → swipe through all; apply filter → open → only filtered set; close returns to grid
2. Œuvres: same with category filters
3. Homepage grid: open and swipe six images
4. Desktop ≥901px: lightbox arrows + keyboard still work; no broken layout
5. EN pages: labels and behavior match FR

## Success criteria

- On mobile, photos feel fullscreen and swipe between images feels native
- Filters do not put inactive images in the carousel
- Desktop gallery UX is not regressed
- One shared implementation, not three divergent copies
