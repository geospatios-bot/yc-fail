"use client";

import { useState, useEffect, useRef } from "react";
import {
  FAILURES,
  STATUS_CONFIG,
  computeStats,
  parseRaised,
  type YCFailure,
} from "@/data/companies";
import Navbar, { NavLink, NavButton, NAVBAR_HEIGHT } from "@/components/Navbar";

type SortKey = "default" | "recent" | "biggest" | "oldest" | "a-z";

/* ── Search Modal ────────────────────────────────────── */

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.toLowerCase();
  const results = q.length > 0
    ? FAILURES.filter((f) =>
        f.company.toLowerCase().includes(q) ||
        f.founders.some((fn) => fn.toLowerCase().includes(q)) ||
        f.sector.toLowerCase().includes(q)
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-[100]"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="search-modal-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exhibits..."
          />
          <kbd>ESC</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="search-modal-results">
            {results.map((f) => {
              const cfg = STATUS_CONFIG[f.status];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    window.history.replaceState(null, "", `#${f.id}`);
                    setTimeout(() => {
                      document.getElementById(`exhibit-${f.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }}
                  className="search-modal-result"
                >
                  <div>
                    <span className="search-result-name">{f.company}</span>
                    <span className="search-result-meta">{f.batch} · {f.sector}</span>
                  </div>
                  <span className="search-result-status" style={{ color: cfg.color }}>{f.status}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {q.length > 0 && results.length === 0 && (
          <div className="search-modal-empty">
            No corpses match that query.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────── */

function SidebarContent({ onOpenSearch, activeFilter, onFilter }: { onOpenSearch: () => void; activeFilter: string | null; onFilter: (sector: string | null) => void }) {
  const stats = computeStats();

  const sectors = FAILURES.reduce((acc, f) => {
    acc[f.sector] = (acc[f.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSectors = Object.entries(sectors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <>
      {/* Logo block */}
      <div className="block block--accent" style={{ flexShrink: 0 }}>
        <div className="logo-block">
          <div className="label-group" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
            <span className="pill-outline" style={{ borderColor: "var(--border-color)" }}>(OFFICIAL ARCHIVE)</span>
          </div>
          <h1>YCOMBINATOR.FYI</h1>
          {/* YC Badge */}
          <div className="flex items-center justify-center" style={{ marginTop: "1.25rem" }}>
            <div className="yc-badge flex items-center" style={{ gap: "8px", background: "#000", borderRadius: "999px", padding: "6px 16px", border: "2px solid #333", cursor: "pointer" }}>
              <span style={{ fontSize: "1rem", fontWeight: 400, color: "#888", fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0", lineHeight: 1 }}>
                <span className="not-text">Not </span>Backed by
              </span>
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: "5px", flexShrink: 0 }}>
                <path d="M47.9985 47.9994H0V0H47.9985V47.9994Z" fill="#FF6600"/>
                <path d="M13.9012 11.7843H17.6595L22.4961 21.5325C23.203 22.9836 23.7984 24.3976 23.7984 24.3976C23.7984 24.3976 24.4313 23.021 25.175 21.5325L30.0868 11.7843H33.5843L25.2865 27.3746V37.309H22.1244V27.1884L13.9012 11.7843Z" fill="white"/>
              </svg>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0", lineHeight: 1 }}>
                Combinator
              </span>
            </div>
          </div>
        </div>

        {/* Stat grid */}
        <div className="stat-grid">
          {[
            { value: stats.totalRaised, label: "Capital Incinerated" },
            { value: stats.totalCompanies, label: "Exhibits Filed" },
            { value: `${stats.totalFraud + stats.totalScandal}`, label: "Fraud & Scandal" },
            { value: `${stats.totalCopycat + stats.totalGrift}`, label: "Copycats & Grifts" },
          ].map((s) => (
            <div key={s.label} className="stat-cell">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Twitter */}
        <div className="block-inner" style={{ borderTop: "var(--border-w) solid var(--border-color)" }}>
          <button
            onClick={onOpenSearch}
            className="pill-solid"
            style={{ padding: "12px 24px", fontSize: "1rem", width: "100%", justifyContent: "center", cursor: "pointer" }}
          >
            SEARCH ⌘K
          </button>
          <a
            href="https://x.com/NotOnKetamine"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-solid"
            style={{ padding: "12px 24px", fontSize: "1rem", width: "100%", justifyContent: "center", textDecoration: "none", marginTop: "8px" }}
          >
            <span style={{ textTransform: "none" }}>@NotOnKetamine</span> ↗
          </a>
        </div>
      </div>

      {/* Filter block */}
      <div className="block" style={{ flexShrink: 0 }}>
        <div className="block-inner">
          <div className="label-group">
            <span className="pill-outline">(FILTER EXHIBITS)</span>
          </div>
          <h3 className="text-lg" style={{ marginBottom: "1rem" }}>Categories</h3>
          {topSectors.map(([sector, count]) => (
            <div
              key={sector}
              className="data-row"
              onClick={() => onFilter(activeFilter === sector ? null : sector)}
              style={{ cursor: "pointer", opacity: activeFilter && activeFilter !== sector ? 0.4 : 1, transition: "opacity 0.15s" }}
            >
              <span className="text-mono">{sector}</span>
              <span className="pill-solid accent">{count}</span>
            </div>
          ))}
          <div
            className="data-row"
            onClick={() => onFilter(null)}
            style={{ cursor: "pointer", opacity: activeFilter ? 0.4 : 1, transition: "opacity 0.15s" }}
          >
            <span className="text-mono">ALL</span>
            <span className="pill-solid">{FAILURES.length}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Featured Card ───────────────────────────────────── */

function CopyLinkButton({ id, dark }: { id: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const url = `${window.location.origin}/#${id}`;
    navigator.clipboard.writeText(url);
    window.history.replaceState(null, "", `#${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="copy-link-btn"
      style={dark ? { borderColor: "#555", color: "#999" } : undefined}
      title="Copy link to this exhibit"
    >
      {copied ? "✓ COPIED" : "⌗ LINK"}
    </button>
  );
}

function FeaturedCard({ failure }: { failure: YCFailure }) {
  return (
    <div id={`exhibit-${failure.id}`} className="block block--dark">
      {/* Hero image */}
      {failure.imageUrl && (
        <div style={{ position: "relative", width: "100%", height: "280px", overflow: "hidden" }}>
          <img
            src={failure.imageUrl}
            alt={`${failure.company} team`}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(100%) contrast(1.1)", opacity: 0.4 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #222 100%)" }} />
        </div>
      )}
      <div className="block-inner--hero" style={failure.imageUrl ? { marginTop: "-80px", position: "relative" } : undefined}>
        <div className="label-group">
          <span className="pill-outline">(FEATURED FAILURE)</span>
          <span className="pill-outline" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>MUSEUM CHOICE</span>
          <CopyLinkButton id={failure.id} dark />
        </div>
        <div className="flex items-center gap-4" style={{ margin: "1rem 0" }}>
          {failure.domain && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${failure.domain}&sz=128`}
              alt={`${failure.company} logo`}
              width={48}
              height={48}
              style={{ borderRadius: "10px", background: "#333", flexShrink: 0 }}
            />
          )}
          <h2 className="text-hero" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>
            {failure.company}
          </h2>
        </div>
        <p className="text-mono" style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "2rem" }}>
          {failure.oneLiner}
        </p>
        <div className="divider" />
        <p className="text-body" style={{ maxWidth: "600px", opacity: 0.9 }}>
          {failure.description}{" "}
          <span className="redacted" onClick={(e) => e.currentTarget.classList.toggle("revealed")}>
            {failure.redactedText}
          </span>{" "}
          {failure.descriptionAfter}
        </p>
        <svg className="huge-arrow" viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M50 10 v80 M20 60 l30 30 l30 -30" />
        </svg>
      </div>
    </div>
  );
}

/* ── Exhibit Card ────────────────────────────────────── */

function ExhibitCard({ failure, index }: { failure: YCFailure; index: number }) {
  const isAccent = failure.status === "FRAUD" || failure.status === "SCANDAL";

  return (
    <div id={`exhibit-${failure.id}`} className="block exhibit-card">
      {/* Content */}
      <div className="exhibit-content">
        <div className="label-group">
          <span className="pill-outline">(BATCH {failure.batch !== "—" ? failure.batch : "ADJ"})</span>
          <span className="pill-outline">(EXHIBIT {String(index + 1).padStart(3, "0")})</span>
          <CopyLinkButton id={failure.id} />
        </div>
        <h2 className="text-xl" style={{ marginBottom: "1rem" }}>{failure.company}</h2>
        <p className="text-mono" style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "2rem" }}>
          {failure.oneLiner}
        </p>

        <div className="divider" />

        <h3 className="text-lg" style={{ marginBottom: "1rem" }}>Autopsy Report:</h3>
        <p className="text-body">
          {failure.description}{" "}
          <span className="redacted" onClick={(e) => e.currentTarget.classList.toggle("revealed")}>
            {failure.redactedText}
          </span>{" "}
          {failure.descriptionAfter}
        </p>

        {failure.bodyCount && (
          <div style={{ marginTop: "1.5rem" }}>
            <span className="pill-solid accent" style={{ padding: "6px 16px" }}>
              DAMAGE: {failure.bodyCount}
            </span>
          </div>
        )}
      </div>

      {/* Meta sidebar — orange for FRAUD/SCANDAL, gray for others */}
      <div className={`exhibit-meta ${isAccent ? "accent-bg" : ""}`}>
        <div>
          <div className="text-mono" style={{ color: isAccent ? "var(--border-color)" : "#666", fontSize: "0.7rem", marginBottom: "0.5rem" }}>
            STATUS
          </div>
          <div className="status-toggle" style={isAccent ? { background: "rgba(0,0,0,0.1)" } : undefined}>
            <span
              className="toggle-pill"
              style={isAccent
                ? { background: "var(--border-color)", color: "var(--surface-white)" }
                : { background: "var(--accent)", color: "#000" }
              }
            >
              {failure.status}
            </span>
            <span className="toggle-empty" style={isAccent ? { color: "var(--border-color)" } : undefined}>
              {failure.status === "DEAD" || failure.status === "FRAUD" ? "ALIVE" : failure.status === "COPYCAT" ? "ORIGINAL" : failure.status === "GRIFT" ? "LEGIT" : "OK"}
            </span>
          </div>
        </div>

        <div className="divider" style={{ margin: 0, background: isAccent ? "rgba(0,0,0,0.2)" : undefined }} />

        <div>
          <div className="data-row" style={isAccent ? { borderColor: "rgba(0,0,0,0.2)" } : undefined}>
            <span className="text-mono" style={{ fontSize: "0.75rem" }}>Capital Raised</span>
            <span className="text-mono" style={{ fontSize: "1rem" }}>{failure.raised}</span>
          </div>
          {failure.valuation && (
            <div className="data-row" style={isAccent ? { borderColor: "rgba(0,0,0,0.2)" } : undefined}>
              <span className="text-mono" style={{ fontSize: "0.75rem" }}>Peak Value</span>
              <span className="text-mono" style={{ fontSize: "1rem" }}>{failure.valuation}</span>
            </div>
          )}
          <div className="data-row" style={isAccent ? { borderColor: "rgba(0,0,0,0.2)" } : undefined}>
            <span className="text-mono" style={{ fontSize: "0.75rem" }}>Lifespan</span>
            <span className="text-mono" style={{ fontSize: "1rem" }}>
              {failure.yearDied
                ? `${failure.yearDied - failure.yearFounded} YRS`
                : `${new Date().getFullYear() - failure.yearFounded}+ YRS`}
            </span>
          </div>
        </div>

        {/* Sources */}
        {failure.sources.length > 0 && (
          <>
            <div className="divider" style={{ margin: 0, background: isAccent ? "rgba(0,0,0,0.2)" : undefined }} />
            <div>
              <div className="text-mono" style={{ fontSize: "0.65rem", color: isAccent ? "var(--border-color)" : "#666", marginBottom: "0.5rem" }}>
                SOURCES
              </div>
              {failure.sources.slice(0, 2).map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "inherit", transition: "color 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "inherit"}
                >
                  → {s.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────── */

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("default");
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // Scroll to company on page load if URL has hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(`exhibit-${hash}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const featured = FAILURES[0]; // FTX

  const sortedExhibits = (() => {
    let list = FAILURES.slice(1);
    if (filter) list = list.filter(f => f.sector === filter);
    switch (sort) {
      case "recent":
        return [...list].sort((a, b) => (b.yearDied ?? b.yearFounded) - (a.yearDied ?? a.yearFounded));
      case "biggest":
        return [...list].sort((a, b) => parseRaised(b.raised) - parseRaised(a.raised));
      case "oldest":
        return [...list].sort((a, b) => a.yearFounded - b.yearFounded);
      case "a-z":
        return [...list].sort((a, b) => a.company.localeCompare(b.company));
      default:
        return list;
    }
  })();

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <Navbar right={
        <>
          <NavLink href="/timeline">TIMELINE</NavLink>
          <NavButton onClick={() => setSearchOpen(true)}>⌕</NavButton>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
            style={{
              width: "30px", height: "30px", background: "rgba(255,255,255,0.2)",
              border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px",
              fontWeight: 900, cursor: "pointer", alignItems: "center", justifyContent: "center",
            }}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </>
      } />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className={`fixed inset-x-0 bottom-0 z-[60] lg:hidden`}
          style={{ top: `${NAVBAR_HEIGHT}px` }}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm sidebar-backdrop" />
          <div
            className="absolute inset-0 flex flex-col sidebar-slide"
            style={{ padding: "16px", gap: "var(--gap)", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onOpenSearch={() => { setSidebarOpen(false); setSearchOpen(true); }} activeFilter={filter} onFilter={setFilter} />
          </div>
        </div>
      )}

      {/* Layout grid */}
      <div className="layout-grid" style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col scrollbar-hide" style={{ gap: "var(--gap)", overflowY: "auto", height: "100%", padding: "var(--gap) 0 24px 0" }}>
          <SidebarContent onOpenSearch={() => setSearchOpen(true)} activeFilter={filter} onFilter={setFilter} />
        </aside>

        {/* Main exhibits */}
        <main className="exhibits scrollbar-hide" style={{ overflowY: "auto", height: "100%", paddingTop: "var(--gap)" }}>
          {(!filter || featured.sector === filter) && <FeaturedCard failure={featured} />}

          {/* Sort bar */}
          <div className="flex items-center gap-2 flex-wrap" style={{ padding: "0.5rem 0" }}>
            <span className="text-mono" style={{ fontSize: "0.65rem", color: "#666", marginRight: "4px" }}>SORT:</span>
            {([
              ["default", "DEFAULT"],
              ["recent", "RECENT"],
              ["biggest", "BIGGEST"],
              ["oldest", "OLDEST"],
              ["a-z", "A → Z"],
            ] as [SortKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={sort === key ? "pill-solid accent" : "pill-outline"}
                style={{
                  fontSize: "0.6rem",
                  padding: "3px 10px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  ...(sort !== key ? { color: "#999", borderColor: "#555" } : {}),
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {sortedExhibits.map((failure, i) => (
            <ExhibitCard
              key={failure.id}
              failure={failure}
              index={i + 1}
            />
          ))}

          {/* Footer */}
          <div style={{ background: "transparent", padding: "2rem 0", textAlign: "center" }}>
            <p className="text-mono" style={{ color: "#666" }}>
              End of Directory. More exhibits added daily.
            </p>
            <p className="text-mono" style={{ color: "#444", fontSize: "0.7rem", marginTop: "0.5rem" }}>
              Satirical project. Not affiliated with Y Combinator. All information from public records.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
