# YCOMBINATOR.FYI — The Unofficial YC Record

## Stack
- **Framework**: Next.js 15+ (App Router, `"use client"`)
- **Styling**: Tailwind CSS v4 + CSS custom properties in `globals.css`
- **Fonts**: Inter (body), JetBrains Mono (mono/labels), Instrument Serif (display)
- **Package manager**: bun
- **Dev server**: `bun dev` on port 3005

## Project Structure
```
src/
  app/
    page.tsx           — Main directory page
    timeline/page.tsx  — YC decline chart page
    globals.css        — All CSS: variables, components, animations
    layout.tsx         — Root layout, fonts, metadata
  components/
    Navbar.tsx         — Shared navbar (used on every page)
  data/
    companies.ts       — All company/exhibit data (source of truth)
```

## Shared Components

### Navbar (`src/components/Navbar.tsx`)
- Used on EVERY page. Never hand-roll a navbar.
- Orange bg (`var(--accent)`), white text, fixed at top.
- `NAVBAR_HEIGHT = 42px` — use this constant for spacers and offsets.
- Always includes `@NotOnKetamine` link (case-sensitive, always visible, all breakpoints).
- Pass page-specific items via `right` prop using `<NavLink>` and `<NavButton>`.
- CSS lives in `globals.css` under `.navbar`, `.navbar-brand`, `.navbar-right`, `.nav-btn`.

## Design System

### CSS Variables (`:root` in globals.css)
```
--bg: #000000              — page background (black)
--surface-white: #FFFFFF   — card backgrounds
--surface-gray: #E8E8E8    — meta sidebar backgrounds
--accent: #FF6600          — YC orange, used for navbar, highlights, CTAs
--border-w: 3px            — universal border width
--border-color: #000000    — universal border color
--radius-lg: 32px          — card border radius
--radius-md: 16px          — tooltip/inner element radius
--radius-pill: 999px       — pill badge radius
--gap: 24px                — spacing between blocks
```

### Card Blocks
- `.block` — white bg, 3px black border, 32px radius. Base for all cards.
- `.block--accent` — orange bg variant
- `.block--dark` — dark (#222) bg, white text
- `.block-inner` — standard padding (1.25rem mobile, 2rem desktop)
- `.block-inner--hero` — larger padding for hero content

### Typography Classes
- `.text-hero` — clamp(3.5rem, 6vw, 5rem), uppercase, 900 weight
- `.text-xl` — clamp(2.5rem, 4vw, 3.5rem), uppercase, 900 weight
- `.text-lg` — 1.5rem, uppercase, 900 weight
- `.text-mono` — JetBrains Mono, 0.9rem, 700 weight, uppercase
- `.text-body` — 1.1rem, 600 weight, normal case

### Badge Classes
- `.pill-outline` — border only, mono font, 0.7rem, 800 weight, uppercase
- `.pill-solid` — filled black bg, white text
- `.pill-solid.accent` — filled orange bg, black text
- `.label-group` — flex container for pill badges, 8px gap, bottom margin

### Data Display
- `.stat-grid` — 2-column grid for stats, with `.stat-cell`, `.stat-value`, `.stat-label`
- `.data-row` — flex row with label/value, bottom border, used in meta sidebars
- `.divider` — full-width 3px line separator

### Interactive
- `.redacted` — black-on-black text, reveals orange on hover/click
- `.copy-link-btn` — pill-shaped button, orange on hover
- `.search-modal` — cmd-k search palette (dark theme, positioned top-center)

## Data Model
- `FAILURES` array with `YCFailure` interface
- Status types: `FRAUD | DEAD | ZOMBIE | SCANDAL | COPYCAT | GRIFT`
- `STATUS_CONFIG` maps each status to `{ label, color, bg }`
- `computeStats()` aggregates totals for the sidebar
- `parseRaised()` converts "$1.8B" strings to numbers for sorting

## Rules
- **Navbar**: Always use `<Navbar>` from `src/components/Navbar.tsx`. Never inline navbar markup.
- **@NotOnKetamine**: Always visible on navbar, all breakpoints. Exact casing: `NotOnKetamine`.
- **New pages**: Must use `<Navbar>` + body scroll override useEffect (see timeline/page.tsx).
- **Cards**: Always use `.block` class. Never raw divs with inline border/radius.
- **Tooltips**: Use `var(--surface-white)` bg, `var(--border-w)` border, `var(--radius-md)` radius.
- **Stats**: Use `.stat-grid` / `.stat-cell` pattern. Never custom stat layouts.
- **Colors**: Use CSS variables, never raw hex for theme colors.
- **Spacing**: Use `var(--gap)` between blocks, `var(--border-w)` for borders.

## Editorial Tone
- Satirical but factual — all claims sourced from public records
- Redacted text reveals are the "punchline" of each exhibit
- Not affiliated with YC — disclaimer in footer of every page

## Deploy
- Domain: ycombinator.fyi
- Deploy to Vercel from main branch
