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
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-white border-[3px] border-black rounded-[var(--radius-lg)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b-[3px] border-black px-5 py-4">
          <span className="text-[var(--accent)] mr-3 font-black">→</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exhibits..."
            className="flex-1 bg-transparent outline-none text-sm font-semibold placeholder:text-gray-400 font-[family-name:var(--font-sans)]"
          />
          <kbd className="text-[10px] font-bold text-gray-400 border-2 border-gray-300 rounded-full px-2 py-0.5 font-[family-name:var(--font-mono)]">ESC</kbd>
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
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#FFF3EB] active:bg-[#FFF3EB] transition-colors border-b border-gray-200 last:border-0 text-left"
              >
                <div>
                  <div className="font-black text-sm uppercase">{f.company}</div>
                  <div className="text-[10px] text-gray-400 font-[family-name:var(--font-mono)] font-bold uppercase mt-0.5">
                    {f.batch} / {f.sector}
                  </div>
                </div>
                <span className="pill-solid accent text-[9px]">{f.status}</span>
              </button>
            ))}
          </div>
        )}
        {q.length > 0 && results.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400 font-semibold">
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
        <div className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-6">
            <span className="pill-outline" style={{ borderColor: "var(--border-color)" }}>(OFFICIAL ARCHIVE)</span>
          </div>
          <h1 className="text-[4rem] font-black uppercase leading-[0.9] tracking-tighter mb-4">
            YC.FAIL
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[0.8rem] font-bold uppercase">
            A Museum of Unicorn Corpses.<br />Not affiliated with Y Combinator.
          </p>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 border-t-[3px] border-black">
          {[
            { value: stats.totalRaised, label: "Capital Incinerated" },
            { value: stats.totalCompanies, label: "Corpses Logged" },
            { value: `${stats.totalFraud + stats.totalScandal}`, label: "Fraud & Scandal" },
            { value: "0", label: "Lessons Learned" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`p-4 sm:p-5 text-center border-b-[3px] border-black ${i % 2 === 0 ? "border-r-[3px]" : ""}`}
            >
              <div className="font-[family-name:var(--font-mono)] text-xl sm:text-2xl font-extrabold mb-1">{s.value}</div>
              <div className="text-[0.7rem] font-extrabold uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Twitter */}
        <div className="bg-white border-t-[3px] border-black p-4 flex flex-col gap-3">
          <button
            onClick={onOpenSearch}
            className="pill-solid w-full justify-center py-3 text-sm gap-2 hover:bg-[#333] transition-colors"
          >
            SEARCH EXHIBITS
            <kbd className="hidden sm:inline text-[9px] border border-white/30 px-1.5 py-0.5 rounded-full ml-1 font-normal">⌘K</kbd>
          </button>
          <a
            href="https://x.com/NotOnKetamine"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-solid accent w-full justify-center py-3 text-sm no-underline hover:brightness-110 transition-all"
          >
            @NOTONKETAMINE ↗
          </a>
        </div>
      </div>

      {/* Filter block */}
      <div className="block">
        <div className="p-6">
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="pill-outline">(FILTER EXHIBITS)</span>
          </div>
          <h3 className="text-xl font-black uppercase mb-4">Categories</h3>
          {topSectors.map(([sector, count]) => (
            <div key={sector} className="data-row">
              <span className="font-[family-name:var(--font-mono)] text-[0.85rem] font-bold uppercase">{sector}</span>
              <span className="pill-solid accent">{count}</span>
            </div>
          ))}
          <div className="data-row">
            <span className="font-[family-name:var(--font-mono)] text-[0.85rem] font-bold uppercase">ALL</span>
            <span className="pill-solid">{FAILURES.length}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Exhibit Card ────────────────────────────────────── */

function ExhibitCard({ failure, index }: { failure: YCFailure; index: number }) {
  const config = STATUS_CONFIG[failure.status];
  const isAccentMeta = index % 3 === 1;
  const isDead = failure.status === "DEAD" || failure.status === "FRAUD";

  return (
    <div id={`exhibit-${failure.id}`} className="block">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
        {/* Content */}
        <div className="p-6 sm:p-8 lg:border-r-[3px] border-black">
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="pill-outline">(BATCH {failure.batch !== "—" ? failure.batch : "ADJ"})</span>
            <span className="pill-outline">(EXHIBIT {String(index + 1).padStart(3, "0")})</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase leading-[0.9] tracking-tighter mb-2">
            {failure.company}
          </h2>
          <p className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-base sm:text-lg font-bold uppercase mb-6">
            {failure.oneLiner}
          </p>

          <div className="h-[3px] bg-black w-full my-5" />

          <h3 className="text-lg font-black uppercase mb-3">Autopsy Report:</h3>
          <p className="text-base font-semibold leading-relaxed">
            {failure.description}{" "}
            <span className="redacted" onClick={(e) => e.currentTarget.classList.toggle("revealed")}>
              {failure.redactedText}
            </span>{" "}
            {failure.descriptionAfter}
          </p>

          {failure.bodyCount && (
            <div className="mt-4 inline-block">
              <span className="pill-solid accent py-1.5 px-4 text-xs">
                DAMAGE: {failure.bodyCount}
              </span>
            </div>
          )}
        </div>

        {/* Meta sidebar */}
        <div className={`p-5 sm:p-6 flex flex-col gap-5 ${isAccentMeta ? "bg-[var(--accent)]" : "bg-[var(--surface-gray)]"}`}>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[0.7rem] font-bold uppercase text-[#666] mb-2">Status</div>
            <div className={`status-toggle ${isAccentMeta ? "!bg-black/10" : ""}`}>
              <span className={`toggle-pill ${isDead ? "" : "!bg-transparent !text-white/50"}`}>
                {failure.status}
              </span>
              {isDead && <span className="toggle-empty">ALIVE</span>}
            </div>
          </div>

          <div className={`h-[3px] w-full ${isAccentMeta ? "bg-black/20" : "bg-black"}`} />

          <div>
            <div className={`data-row ${isAccentMeta ? "!border-black/20" : ""}`}>
              <span className="font-[family-name:var(--font-mono)] text-[0.75rem] font-bold uppercase">Capital Raised</span>
              <span className="font-[family-name:var(--font-mono)] text-base font-bold">{failure.raised}</span>
            </div>
            {failure.valuation && (
              <div className={`data-row ${isAccentMeta ? "!border-black/20" : ""}`}>
                <span className="font-[family-name:var(--font-mono)] text-[0.75rem] font-bold uppercase">Peak Value</span>
                <span className="font-[family-name:var(--font-mono)] text-base font-bold">{failure.valuation}</span>
              </div>
            )}
            <div className={`data-row ${isAccentMeta ? "!border-black/20" : ""}`}>
              <span className="font-[family-name:var(--font-mono)] text-[0.75rem] font-bold uppercase">Lifespan</span>
              <span className="font-[family-name:var(--font-mono)] text-base font-bold">
                {failure.yearDied
                  ? `${failure.yearDied - failure.yearFounded} YRS`
                  : `${new Date().getFullYear() - failure.yearFounded}+ YRS`}
              </span>
            </div>
          </div>

          {/* Sources */}
          {failure.sources.length > 0 && (
            <>
              <div className={`h-[3px] w-full ${isAccentMeta ? "bg-black/20" : "bg-black"}`} />
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[0.65rem] font-bold uppercase text-[#666] mb-2">Sources</div>
                {failure.sources.slice(0, 2).map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[0.7rem] font-semibold underline underline-offset-2 mb-1 truncate hover:text-[var(--accent)] transition-colors"
                  >
                    → {s.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Featured Card ───────────────────────────────────── */

function FeaturedCard({ failure }: { failure: YCFailure }) {
  return (
    <div className="block block--dark">
      <div className="p-8 sm:p-12">
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="pill-outline" style={{ borderColor: "white", color: "white" }}>(FEATURED FAILURE)</span>
          <span className="pill-outline" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>MUSEUM CHOICE</span>
        </div>
        <h2 className="font-[family-name:var(--font-serif)] text-[clamp(3rem,6vw,5rem)] font-normal italic text-white leading-[0.9] tracking-tight my-4">
          {failure.company}
        </h2>
        <p className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-lg font-bold uppercase mb-4">
          {failure.oneLiner}
        </p>
        <div className="h-[3px] bg-white w-full my-6" />
        <p className="text-lg font-semibold leading-relaxed text-white/90 max-w-2xl">
          {failure.description}{" "}
          <span className="redacted" onClick={(e) => e.currentTarget.classList.toggle("revealed")}>
            {failure.redactedText}
          </span>{" "}
          {failure.descriptionAfter}
        </p>
        {/* Big arrow */}
        <svg className="w-16 sm:w-20 mt-8" viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M50 10 v80 M20 60 l30 30 l30 -30" />
        </svg>
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

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">YC</span>
          </div>
          <span className="font-black text-white text-lg">.FAIL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="pill-outline text-white border-white/40 text-[9px]"
          >
            Search ⌘K
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="pill-solid text-[10px] py-1.5"
            style={{ background: "var(--accent)", color: "#000", borderColor: "var(--accent)" }}
          >
            {sidebarOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden mb-6 space-y-4">
          <SidebarContent onOpenSearch={() => { setSidebarOpen(false); setSearchOpen(true); }} />
        </div>
      )}

      {/* Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-[var(--gap)] max-w-[1600px] mx-auto items-start">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col gap-[var(--gap)] sticky top-[var(--gap)]">
          <SidebarContent onOpenSearch={() => setSearchOpen(true)} />
        </aside>

        {/* Main exhibits */}
        <main className="flex flex-col gap-[var(--gap)]">
          <FeaturedCard failure={featured} />

          {exhibits.map((failure, i) => (
            <ExhibitCard
              key={failure.id}
              failure={failure}
              index={i + 1}
            />
          ))}

          {/* Footer */}
          <div className="py-6 text-center">
            <p className="font-[family-name:var(--font-mono)] text-[#666] text-sm font-bold uppercase">
              End of Directory. More corpses added daily.
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[#444] text-xs mt-2">
              Satirical project. Not affiliated with Y Combinator. All information from public records.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
