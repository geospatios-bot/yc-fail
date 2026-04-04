"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  FAILURES,
  STATUS_CONFIG,
  computeStats,
  type YCFailure,
  type Status,
} from "@/data/companies";

/* ── Search Modal ───────────────────────────────────────── */

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
    ? FAILURES.filter(
        (f) =>
          f.company.toLowerCase().includes(q) ||
          f.founders.some((fn) => fn.toLowerCase().includes(q)) ||
          f.sector.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-white border-2 border-[var(--border-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b-2 border-[var(--border-color)] px-4 py-3">
          <span className="text-[var(--text-dim)] mr-3 text-sm">→</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exhibits..."
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-[var(--text-dim)]"
          />
          <kbd className="text-[10px] font-semibold text-[var(--text-dim)] border border-[#ddd] px-1.5 py-0.5 tracking-wider">ESC</kbd>
        </div>
        {results.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto">
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
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FFF3EB] active:bg-[#FFF3EB] transition-colors border-b border-[#eee] last:border-0 text-left"
              >
                <div>
                  <div className="font-bold text-sm">{f.company}</div>
                  <div className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase mt-0.5">
                    {f.batch} / {f.sector}
                  </div>
                </div>
                <span className="status-badge text-[9px]" style={{ color: STATUS_CONFIG[f.status].color, borderColor: STATUS_CONFIG[f.status].color }}>
                  {f.status}
                </span>
              </button>
            ))}
          </div>
        )}
        {q.length > 0 && results.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-[var(--text-dim)]">
            No exhibits found. Maybe they got away with it.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Ticker ─────────────────────────────────────────────── */

function Ticker({ items, speed = 35 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-b-2 border-[var(--border-color)] bg-white">
      <div className="ticker-track whitespace-nowrap py-1.5" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-[10px] tracking-[0.15em] text-[var(--text-dim)] font-semibold uppercase px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Exhibit Card ───────────────────────────────────────── */

function ExhibitCard({ failure, index }: { failure: YCFailure; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id={`exhibit-${failure.id}`} className="exhibit-card">
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--yc-orange)] uppercase">
            EXH-{String(index + 1).padStart(3, "0")} // {failure.batch !== "—" ? failure.batch : "ADJ"}
          </div>
          <span
            className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm"
            style={{ background: STATUS_CONFIG[failure.status].color, color: "#fff" }}
          >
            {failure.sector}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase mb-1">
          {failure.company}
        </h3>
        <div className="text-[11px] text-[var(--text-dim)] font-medium mb-4">
          {failure.founders.join(" / ")}
        </div>

        {/* Original pitch */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Original Pitch</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed pl-3.5 border-l-2 border-[#e5e5e5]">
            &ldquo;{failure.oneLiner}&rdquo;
          </p>
        </div>

        {/* Dotted separator */}
        <div className="border-t border-dotted border-[#ccc] my-4" />

        {/* Autopsy report */}
        <div className="mb-4">
          <div className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2">Autopsy Report</div>
          <div className="autopsy-block">
            <p className="text-[12px] leading-relaxed">
              {failure.description}{" "}
              <span className="redacted" onClick={(e) => e.currentTarget.classList.toggle("revealed")}>
                {failure.redactedText}
              </span>{" "}
              {failure.descriptionAfter}
            </p>
          </div>
        </div>

        {/* Financials */}
        <div className="flex border-2 border-[var(--border-color)]">
          <div className="flex-1 p-3 border-r-2 border-[var(--border-color)]">
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[var(--text-dim)]">Raised</div>
            <div className="font-black text-base mt-0.5">{failure.raised}</div>
          </div>
          {failure.valuation && (
            <div className="flex-1 p-3 border-r-2 border-[var(--border-color)]">
              <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[var(--text-dim)]">Valuation</div>
              <div className="font-black text-base mt-0.5">{failure.valuation}</div>
            </div>
          )}
          <div className="flex-1 p-3">
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[var(--text-dim)]">
              {failure.yearDied ? "Lived" : "Since"}
            </div>
            <div className="font-black text-base mt-0.5">
              {failure.yearDied ? `${failure.yearFounded}–${failure.yearDied}` : String(failure.yearFounded)}
            </div>
          </div>
        </div>

        {/* Body count */}
        {failure.bodyCount && (
          <div className="mt-3 bg-[#FFF3EB] border-2 border-[var(--yc-orange)] px-3 py-2">
            <span className="text-[10px] font-bold text-[var(--yc-orange)] tracking-wider uppercase">
              DAMAGE: {failure.bodyCount}
            </span>
          </div>
        )}
      </div>

      {/* Sources toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 sm:px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] hover:text-[var(--yc-orange)] border-t-2 border-[var(--border-color)] transition-colors flex items-center justify-center gap-2 font-bold"
      >
        {expanded ? "Close" : "Sources"}
        <span className="transition-transform inline-block" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>↓</span>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 border-t-2 border-[var(--border-color)] bg-[var(--bg)]">
          <div className="pt-3 space-y-2">
            {failure.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-[11px] text-[var(--text-muted)] hover:text-[var(--yc-orange)] transition-colors"
              >
                <span className="text-[var(--yc-orange)] font-bold shrink-0">→</span>
                <span className="underline underline-offset-2 break-words min-w-0">{source.label}</span>
                <span className="text-[9px] tracking-[0.15em] text-[var(--text-dim)] ml-auto shrink-0 border border-[var(--border-color)] px-1.5 py-0.5 uppercase">
                  {source.type}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────── */

function Sidebar({
  activeFilter,
  onFilter,
  sidebarOpen,
  onCloseSidebar,
}: {
  activeFilter: Status | "ALL";
  onFilter: (f: Status | "ALL") => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}) {
  const stats = computeStats();
  const filters: { label: string; value: Status | "ALL"; count: number }[] = [
    { label: "All Autopsies", value: "ALL", count: FAILURES.length },
    { label: "Fraud", value: "FRAUD", count: stats.totalFraud },
    { label: "Scandal", value: "SCANDAL", count: stats.totalScandal },
    { label: "Dead", value: "DEAD", count: stats.totalDead },
    { label: "Zombie", value: "ZOMBIE", count: stats.totalZombie },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onCloseSidebar} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-[var(--bg)] border-r-2 border-[var(--border-color)] overflow-y-auto
          transition-transform duration-200
          lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-5">
          {/* Mobile close */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="font-black text-lg">YC.FAIL</span>
            <button onClick={onCloseSidebar} className="text-xl font-bold">×</button>
          </div>

          {/* W24 Archive badge */}
          <div className="hidden lg:flex items-center gap-2 mb-6">
            <span className="font-black text-2xl">YC.FAIL</span>
            <span className="text-[9px] font-bold tracking-wider bg-[var(--yc-orange)] text-white px-2 py-0.5 uppercase">
              Archive
            </span>
          </div>

          {/* Curator Filters */}
          <div className="mb-6">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-dim)] mb-3">
              Curator Filters
            </div>
            <div className="space-y-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { onFilter(f.value); onCloseSidebar(); }}
                  className={`filter-pill w-full ${activeFilter === f.value ? "active" : ""}`}
                >
                  <span>{f.label}</span>
                  <span className="count">{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System Telemetry */}
          <div className="border-t-2 border-[var(--border-color)] pt-4">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-dim)] mb-3">
              System Telemetry
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)]">Capital Incinerated:</span>
                <span className="font-bold text-[var(--yc-orange)]">{stats.totalRaised}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)]">Total Exhibits:</span>
                <span className="font-bold">{stats.totalCompanies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)]">Database Status:</span>
                <span className="font-bold text-[var(--yc-orange)]">EXPANDING</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Main Page ──────────────────────────────────────────── */

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Status | "ALL">("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const filtered = useMemo(
    () => activeFilter === "ALL" ? FAILURES : FAILURES.filter((f) => f.status === activeFilter),
    [activeFilter]
  );

  const sectionTitle = activeFilter === "ALL"
    ? "All Exhibits"
    : `${STATUS_CONFIG[activeFilter].label} Wing`;

  const tickerItems1 = FAILURES.map((f) => `${f.company} // ${f.raised} // ${f.status}`);
  const tickerItems2 = [
    "ARCHIVE OF PIVOTS",
    "POST-MORTEM REPORTS",
    "WARNING: HIGH VOLTAGE CAPITAL INCINERATION ZONE",
    "ARCHIVE OF PIVOTS",
    "POST-MORTEM REPORTS",
  ];

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Nav */}
      <nav className="sticky top-0 z-30 nav-blur border-b-2 border-[var(--border-color)]">
        <div className="px-4 sm:px-6 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-lg font-bold"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <a href="#" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[var(--yc-orange)] flex items-center justify-center">
                <span className="text-white text-xs font-black">YC</span>
              </div>
              <span className="font-bold text-sm tracking-tight">.FAIL</span>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 border-2 border-[var(--border-color)] px-3 py-1.5 hover:border-[var(--yc-orange)] transition-colors"
            >
              <span className="text-xs text-[var(--text-dim)]">Search...</span>
              <kbd className="hidden sm:inline text-[9px] font-semibold text-[var(--text-dim)] border border-[#ccc] px-1 py-0.5">⌘K</kbd>
            </button>
            <a
              href="https://x.com/NotOnKetamine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs font-bold tracking-wider text-[var(--yc-orange)] hover:underline uppercase"
            >
              @NotOnKetamine
            </a>
          </div>
        </div>
      </nav>

      {/* Double ticker */}
      <Ticker items={tickerItems1} speed={40} />
      <Ticker items={tickerItems2} speed={25} />

      {/* Layout: sidebar + main */}
      <div className="flex">
        <Sidebar
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0">
          {/* Section header */}
          <div className="border-b-2 border-[var(--border-color)] px-4 sm:px-6 py-4 flex items-baseline justify-between">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl sm:text-3xl italic">
              {sectionTitle}
            </h2>
            <div className="text-[10px] font-bold tracking-wider text-[var(--text-dim)] uppercase">
              Displaying {filtered.length} artifact{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Exhibit grid */}
          <div className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {filtered.map((failure, i) => (
                <ExhibitCard key={failure.id} failure={failure} index={FAILURES.indexOf(failure)} />
              ))}
            </div>
          </div>

          {/* Cemetery */}
          <section id="graveyard" className="bg-[var(--border-color)] text-white py-12 sm:py-16">
            <div className="px-4 sm:px-6">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--yc-orange)] uppercase mb-3">
                Permanent Collection
              </div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl italic mb-4">
                The <span className="text-[var(--yc-orange)]">Cemetery</span>
              </h2>
              <p className="text-sm text-[#999] max-w-xl mb-8 leading-relaxed">
                YC-backed companies that raised millions, shipped products nobody wanted, and quietly 404&apos;d into the void.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 border-2 border-[#333]">
                {[
                  "Tutorspree", "Meteor", "Exec", "Moki.tv", "Gobble", "Zidisha",
                  "Virool", "Backplane", "Lollipuff", "Bufferbox", "Shoptiques", "Cherry",
                  "Sprig", "Munchery", "Bento", "Washio", "Zirtual", "Prim",
                  "OMGPop", "Socialcam", "Cloudkick", "Scoopler", "Heyzap", "Lanyrd",
                ].map((name) => (
                  <div key={name} className="border border-[#333] p-3 text-center hover:bg-[var(--yc-orange)] hover:text-black transition-all group">
                    <div className="text-[10px] font-bold text-[#666] group-hover:text-black tracking-wide">{name}</div>
                    <div className="text-[9px] text-[#444] group-hover:text-black/60 mt-1 font-semibold tracking-[0.2em]">R.I.P.</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Gift Shop */}
          <section id="gift-shop" className="py-12 sm:py-16">
            <div className="px-4 sm:px-6">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--yc-orange)] uppercase mb-3">Before You Leave</div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl italic mb-6">
                The Gift Shop
              </h2>
              <div className="grid gap-0 md:grid-cols-3 border-2 border-[var(--border-color)] bg-white">
                {[
                  { title: "The Pattern", body: "Raise too much, too fast. Scale before product-market fit. Lie about metrics. Get caught. Blame the market." },
                  { title: "The Enablers", body: "Demo Day creates FOMO. Partners invest, then fund the next batch. Nobody checks on batch -3. The factory never stops." },
                  { title: "The Survivors", body: "For every FTX, there's an Airbnb. But survivorship bias is a hell of a drug. You're looking at the museum, not the map." },
                ].map((item, i) => (
                  <div key={item.title} className={`p-5 sm:p-6 ${i > 0 ? "border-t-2 md:border-t-0 md:border-l-2 border-[var(--border-color)]" : ""}`}>
                    <h3 className="font-black text-sm mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t-2 border-[var(--border-color)] py-8">
            <div className="px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-[var(--yc-orange)] flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">YC</span>
                  </div>
                  <span className="font-bold text-xs">.FAIL</span>
                </div>
                <p className="text-[10px] text-[var(--text-dim)] max-w-sm leading-relaxed">
                  Satirical project. Not affiliated with Y Combinator. All information from public records and court filings.
                </p>
              </div>
              <div className="text-[10px] text-[var(--text-dim)] sm:text-right font-medium">
                <div>Admission is free. The losses were not.</div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
