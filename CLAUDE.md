# YCOMBINATOR.FYI — The Museum of Failure

## Stack
- **Framework**: Next.js 15+ (App Router, `"use client"` — single page app)
- **Styling**: Tailwind CSS v4 with CSS custom properties in `globals.css`
- **Fonts**: Space Grotesk (body), Instrument Serif (display/headings)
- **Package manager**: bun
- **Dev server**: `bun dev` on port 3005

## Project Structure
```
src/
  app/
    page.tsx        — Main page component (all sections)
    globals.css     — CSS variables, animations, card styles
    layout.tsx      — Root layout with font imports, metadata
  data/
    companies.ts    — All failure data (source of truth)
  public/
    images/         — Self-hosted photos
```

## Key Architecture Decisions
- **Single page, no routes** — all content on one page with anchor sections (`#exhibits`, `#graveyard`, `#gift-shop`)
- **Data-driven** — all company data lives in `companies.ts`, UI is generated from it
- **Museum metaphor** — exhibits, wings, galleries, gift shop
- **Redacted text** — hover to reveal scandalous details (`.redacted` class)
- **Status taxonomy**: FRAUD (red), DEAD (black), ZOMBIE (amber), SCANDAL (purple)

## CSS Conventions
- Use CSS variables: `--bg`, `--yc-orange`, `--fraud-red`, `--zombie-amber`, `--scandal-purple`
- Card styles defined in `globals.css` (`.exhibit-card`, `.tombstone`)
- `.redacted` class: black background, orange text reveal on hover
- Ticker: `translateX(0) → translateX(-50%)` with doubled content
- `.museum-label`: 10px uppercase tracking for category labels
- `.nav-blur`: sticky nav with backdrop blur

## Data Model
- `FAILURES` array with `YCFailure` interface
- Each entry has: company, founders, batch, sector, raised, valuation, status, description, redactedText, sources[]
- `computeStats()` aggregates totals for the hero section
- Status types: `FRAUD | DEAD | ZOMBIE | SCANDAL`

## Editorial Tone
- Satirical but factual — all claims sourced from public records
- Redacted text reveals are the "punchline" of each exhibit
- "Museum" framing keeps it playful (exhibits, gift shop, cemetery)
- Not affiliated with YC — disclaimer in footer

## Deploy
- Target domain: ycombinator.fyi
- Deploy to Vercel from main branch
