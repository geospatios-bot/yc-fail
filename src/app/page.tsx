"use client";

import { useState, useEffect, useRef } from "react";
import {
  FAILURES,
  STATUS_CONFIG,
  computeStats,
  type YCFailure,
} from "@/data/companies";

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-3 sm:mx-4 overflow-hidden"
        style={{ background: "var(--surface-white)", border: "var(--border-w) solid var(--border-color)", borderRadius: "var(--radius-md)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-5 py-4" style={{ borderBottom: "var(--border-w) solid var(--border-color)" }}>
          <span style={{ color: "var(--accent)", marginRight: "12px", fontWeight: 900 }}>→</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exhibits..."
            className="flex-1 bg-transparent outline-none text-body"
            style={{ cursor: "text" }}
          />
          <kbd className="pill-outline" style={{ fontSize: "0.6rem", padding: "2px 8px" }}>ESC</kbd>
        </div>
        {results.length > 0 && (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {results.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document.getElementById(`exhibit-${f.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 100);
                }}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
                style={{ borderBottom: "1px solid #e5e5e5", transition: "background 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FFF3EB"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase" }}>{f.company}</div>
                  <div className="text-mono" style={{ fontSize: "0.65rem", color: "#999", marginTop: "2px" }}>
                    {f.batch} / {f.sector}
                  </div>
                </div>
                <span className="pill-solid accent" style={{ fontSize: "0.6rem" }}>{f.status}</span>
              </button>
            ))}
          </div>
        )}
        {q.length > 0 && results.length === 0 && (
          <div className="text-body" style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
            No corpses found. Maybe they got away with it.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────── */

function SidebarContent({ onOpenSearch }: { onOpenSearch: () => void }) {
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
      <div className="block block--accent">
        <div className="logo-block">
          <div className="label-group" style={{ justifyContent: "center", marginBottom: "2rem" }}>
            <span className="pill-outline" style={{ borderColor: "var(--border-color)" }}>(OFFICIAL ARCHIVE)</span>
          </div>
          <h1>YC.FAIL</h1>
          <p className="text-mono" style={{ fontSize: "0.8rem" }}>
            A Museum of Unicorn Corpses.<br />Not affiliated with Y Combinator.
          </p>
        </div>

        {/* Stat grid */}
        <div className="stat-grid">
          {[
            { value: stats.totalRaised, label: "Capital Incinerated" },
            { value: stats.totalCompanies, label: "Corpses Logged" },
            { value: `${stats.totalFraud + stats.totalScandal}`, label: "Fraud & Scandal" },
            { value: "0", label: "Lessons Learned" },
          ].map((s) => (
            <div key={s.label} className="stat-cell">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Twitter */}
        <div className="block-inner" style={{ background: "var(--surface-white)", borderTop: "var(--border-w) solid var(--border-color)" }}>
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
            className="pill-solid accent"
            style={{ padding: "12px 24px", fontSize: "1rem", width: "100%", justifyContent: "center", textDecoration: "none", marginTop: "8px" }}
          >
            @NOTONKETAMINE ↗
          </a>
        </div>
      </div>

      {/* Filter block */}
      <div className="block">
        <div className="block-inner">
          <div className="label-group">
            <span className="pill-outline">(FILTER EXHIBITS)</span>
          </div>
          <h3 className="text-lg" style={{ marginBottom: "1rem" }}>Categories</h3>
          {topSectors.map(([sector, count]) => (
            <div key={sector} className="data-row">
              <span className="text-mono">{sector}</span>
              <span className="pill-solid accent">{count}</span>
            </div>
          ))}
          <div className="data-row">
            <span className="text-mono">ALL</span>
            <span className="pill-solid">{FAILURES.length}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Featured Card ───────────────────────────────────── */

function FeaturedCard({ failure }: { failure: YCFailure }) {
  return (
    <div className="block block--dark">
      <div className="block-inner--hero">
        <div className="label-group">
          <span className="pill-outline">(FEATURED FAILURE)</span>
          <span className="pill-outline" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>MUSEUM CHOICE</span>
        </div>
        <h2 className="text-hero" style={{ margin: "1rem 0", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>
          {failure.company}
        </h2>
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
  const isAccentMeta = index % 3 === 1;

  return (
    <div id={`exhibit-${failure.id}`} className="block exhibit-card">
      {/* Content */}
      <div className="exhibit-content">
        <div className="label-group">
          <span className="pill-outline">(BATCH {failure.batch !== "—" ? failure.batch : "ADJ"})</span>
          <span className="pill-outline">(EXHIBIT {String(index + 1).padStart(3, "0")})</span>
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

      {/* Meta sidebar */}
      <div className={`exhibit-meta ${isAccentMeta ? "accent-bg" : ""}`}>
        <div>
          <div className="text-mono" style={{ color: isAccentMeta ? "var(--border-color)" : "#666", fontSize: "0.7rem", marginBottom: "0.5rem" }}>
            STATUS
          </div>
          <div className="status-toggle" style={isAccentMeta ? { background: "rgba(0,0,0,0.1)" } : undefined}>
            <span
              className="toggle-pill"
              style={isAccentMeta
                ? { background: "var(--border-color)", color: "var(--surface-white)" }
                : { background: "var(--accent)", color: "#000" }
              }
            >
              {failure.status}
            </span>
            <span className="toggle-empty" style={isAccentMeta ? { color: "var(--border-color)" } : undefined}>
              {failure.status === "DEAD" || failure.status === "FRAUD" ? "ALIVE" : "OK"}
            </span>
          </div>
        </div>

        <div className="divider" style={{ margin: 0, background: isAccentMeta ? "rgba(0,0,0,0.2)" : undefined }} />

        <div>
          <div className="data-row" style={isAccentMeta ? { borderColor: "rgba(0,0,0,0.2)" } : undefined}>
            <span className="text-mono" style={{ fontSize: "0.75rem" }}>Capital Raised</span>
            <span className="text-mono" style={{ fontSize: "1rem" }}>{failure.raised}</span>
          </div>
          {failure.valuation && (
            <div className="data-row" style={isAccentMeta ? { borderColor: "rgba(0,0,0,0.2)" } : undefined}>
              <span className="text-mono" style={{ fontSize: "0.75rem" }}>Peak Value</span>
              <span className="text-mono" style={{ fontSize: "1rem" }}>{failure.valuation}</span>
            </div>
          )}
          <div className="data-row" style={isAccentMeta ? { borderColor: "rgba(0,0,0,0.2)" } : undefined}>
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
            <div className="divider" style={{ margin: 0, background: isAccentMeta ? "rgba(0,0,0,0.2)" : undefined }} />
            <div>
              <div className="text-mono" style={{ fontSize: "0.65rem", color: isAccentMeta ? "var(--border-color)" : "#666", marginBottom: "0.5rem" }}>
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

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const featured = FAILURES[0]; // FTX
  const exhibits = FAILURES.slice(1);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile sticky header */}
      <div
        className="flex lg:hidden items-center justify-between"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          padding: "12px 16px",
          margin: "-16px -16px 0",
          borderBottom: "2px solid #222",
        }}
      >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center" style={{ width: "28px", height: "28px", background: "var(--accent)", borderRadius: "6px" }}>
              <span style={{ color: "white", fontSize: "10px", fontWeight: 900 }}>YC</span>
            </div>
            <span style={{ fontWeight: 900, color: "white", fontSize: "1rem" }}>.FAIL</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/NotOnKetamine"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-mono)" }}
            >
              @NOTONKETAMINE
            </a>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center"
              style={{ width: "28px", height: "28px", background: "#222", border: "2px solid #444", borderRadius: "8px", color: "var(--accent)", fontSize: "14px", cursor: "pointer" }}
            >
              ⌕
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="pill-solid accent"
              style={{ fontSize: "0.6rem", padding: "3px 10px" }}
            >
              {sidebarOpen ? "CLOSE" : "MENU"}
            </button>
          </div>
      </div>
      <div className="lg:hidden" style={{ height: "16px" }} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="flex lg:hidden flex-col" style={{ marginBottom: "var(--gap)", gap: "var(--gap)" }}>
          <SidebarContent onOpenSearch={() => { setSidebarOpen(false); setSearchOpen(true); }} />
        </div>
      )}

      {/* Layout grid */}
      <div className="layout-grid">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col sticky top-[var(--gap)]" style={{ gap: "var(--gap)" }}>
          <SidebarContent onOpenSearch={() => setSearchOpen(true)} />
        </aside>

        {/* Main exhibits */}
        <main className="exhibits">
          <FeaturedCard failure={featured} />

          {exhibits.map((failure, i) => (
            <ExhibitCard
              key={failure.id}
              failure={failure}
              index={i + 1}
            />
          ))}

          {/* Footer */}
          <div style={{ background: "transparent", padding: "2rem 0", textAlign: "center" }}>
            <p className="text-mono" style={{ color: "#666" }}>
              End of Directory. More corpses added daily.
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
