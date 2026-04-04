"use client";

import { useState, useEffect, useRef } from "react";
import {
  FAILURES,
  STATUS_CONFIG,
  computeStats,
  type YCFailure,
} from "@/data/companies";

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.length > 0
    ? FAILURES.filter(
        (f) =>
          f.company.toLowerCase().includes(query.toLowerCase()) ||
          f.founders.some((fn) => fn.toLowerCase().includes(query.toLowerCase())) ||
          f.sector.toLowerCase().includes(query.toLowerCase()) ||
          f.status.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-white border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--border-color)]"
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
          <kbd className="text-[10px] font-semibold text-[var(--text-dim)] border border-[#ddd] px-1.5 py-0.5 tracking-wider">
            ESC
          </kbd>
        </div>
        {results.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto">
            {results.map((f) => (
              <a
                key={f.id}
                href={`#exhibits`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#FFF3EB] transition-colors border-b border-[#eee] last:border-0"
              >
                <div>
                  <div className="font-bold text-sm">{f.company}</div>
                  <div className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase mt-0.5">
                    {f.batch} / {f.sector}
                  </div>
                </div>
                <span
                  className="status-badge text-[9px]"
                  style={{ color: STATUS_CONFIG[f.status].color, borderColor: STATUS_CONFIG[f.status].color }}
                >
                  {f.status}
                </span>
              </a>
            ))}
          </div>
        )}
        {query.length > 0 && results.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-[var(--text-dim)]">
            No exhibits found. Maybe they got away with it.
          </div>
        )}
      </div>
    </div>
  );
}

function Nav() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav className="sticky top-0 z-50 nav-blur border-b-2 border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--yc-orange)] flex items-center justify-center">
              <span className="text-white text-xs font-black">YC</span>
            </div>
            <span className="font-bold text-sm tracking-tight">
              .FAIL
            </span>
          </a>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-6 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--text-dim)]">
              <a href="#exhibits" className="hover:text-[var(--yc-orange)] transition-colors">
                Exhibits
              </a>
              <a href="#graveyard" className="hover:text-[var(--yc-orange)] transition-colors">
                Cemetery
              </a>
              <a href="#gift-shop" className="hover:text-[var(--yc-orange)] transition-colors">
                Exit
              </a>
            </div>

            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 border-2 border-[var(--border-color)] px-3 py-1.5 hover:border-[var(--yc-orange)] transition-colors"
            >
              <span className="text-xs text-[var(--text-dim)]">Search...</span>
              <kbd className="hidden sm:inline text-[9px] font-semibold text-[var(--text-dim)] border border-[#ccc] px-1 py-0.5">
                ⌘K
              </kbd>
            </button>

            {/* Twitter */}
            <a
              href="https://x.com/vincentweisser"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs font-semibold tracking-wider text-[var(--yc-orange)] hover:underline uppercase"
            >
              @vincentweisser
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

function Ticker() {
  const items = FAILURES.map(
    (f) => `${f.company} /// ${f.raised} /// ${f.status}`
  );
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrapper border-b-2 border-[var(--border-color)] bg-white overflow-hidden py-2">
      <div className="ticker-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[10px] sm:text-xs tracking-[0.15em] text-[var(--text-dim)] font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const stats = computeStats();
  return (
    <section className="bg-[var(--yc-orange)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-28 pb-12 sm:pb-24">
        <div className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-black/50 mb-6 sm:mb-8">
          THE MUSEUM OF STARTUP FAILURES
        </div>

        <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl md:text-[120px] leading-[0.9] tracking-tight mb-6 sm:mb-8 text-white">
          Museum
          <br />
          <span className="italic text-black">of </span>
          Startup
          <br />
          <span className="italic text-black">Failures</span>
        </h1>

        <p className="text-sm sm:text-base text-white/80 max-w-lg leading-relaxed mb-10 sm:mb-16">
          A curated exhibition of Y Combinator&apos;s most spectacular
          failures, frauds, and flameouts. {stats.totalRaised}+ in capital.
          Gone.
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-black bg-white">
          {[
            {
              label: "CAPITAL INCINERATED",
              value: stats.totalRaised,
              color: "var(--yc-orange)",
            },
            {
              label: "FRAUD CASES",
              value: String(stats.totalFraud).padStart(2, "0"),
              color: "var(--fraud-red)",
            },
            {
              label: "CONFIRMED DEAD",
              value: String(stats.totalDead).padStart(2, "0"),
              color: "var(--dead-black)",
            },
            {
              label: "ZOMBIES",
              value: String(stats.totalZombie).padStart(2, "0"),
              color: "var(--zombie-amber)",
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-animate p-4 sm:p-6 ${i > 0 ? "border-l-2 border-black" : ""} ${i >= 2 ? "border-t-2 md:border-t-0 border-black" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="museum-label mb-2 sm:mb-3 text-[9px] sm:text-[10px] text-[var(--text-dim)]">
                {stat.label}
              </div>
              <div
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: YCFailure["status"] }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`status-badge ${status === "FRAUD" ? "fraud-pulse" : ""}`}
      style={{ color: config.color, borderColor: config.color }}
    >
      {config.label}
    </span>
  );
}

function ExhibitCard({
  failure,
  index,
}: {
  failure: YCFailure;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDead = failure.status === "DEAD";

  return (
    <div className={`exhibit-card ${isDead ? "tombstone" : ""}`}>
      {/* Header */}
      <div className="p-4 sm:p-6 pb-0">
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
          <div className="min-w-0">
            <div className="museum-label mb-1.5 text-[var(--yc-orange)]">
              EXHIBIT {String(index + 1).padStart(3, "0")} /{" "}
              {failure.batch !== "—"
                ? `BATCH ${failure.batch}`
                : "YC ADJACENT"}
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {failure.company}
            </h3>
            <div className="text-xs text-[var(--text-dim)] mt-1 font-medium">
              {failure.founders.join(" / ")} &mdash; {failure.sector}
            </div>
          </div>
          <StatusBadge status={failure.status} />
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[var(--yc-orange)] mb-3 sm:mb-4 leading-relaxed">
          &ldquo;{failure.oneLiner}&rdquo;
        </p>
      </div>

      {/* Financials bar */}
      <div className="mx-4 sm:mx-6 border-2 border-[var(--border-color)] mb-3 sm:mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x-2 divide-[var(--border-color)]">
          <div className="p-2.5 sm:p-3">
            <div className="museum-label text-[9px]">RAISED</div>
            <div className="font-black text-sm sm:text-base mt-1">
              {failure.raised}
            </div>
          </div>
          {failure.valuation && (
            <div className="p-2.5 sm:p-3">
              <div className="museum-label text-[9px]">PEAK VALUATION</div>
              <div className="font-black text-sm sm:text-base mt-1">
                {failure.valuation}
              </div>
            </div>
          )}
          <div className="p-2.5 sm:p-3">
            <div className="museum-label text-[9px]">
              {failure.yearDied ? "LIVED" : "STATUS"}
            </div>
            <div className="font-black text-sm sm:text-base mt-1">
              {failure.yearDied
                ? `${failure.yearFounded}–${failure.yearDied}`
                : `Since ${failure.yearFounded}`}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
        <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
          {failure.description}{" "}
          <span
            className="redacted"
            onClick={(e) =>
              e.currentTarget.classList.toggle("revealed")
            }
          >
            {failure.redactedText}
          </span>{" "}
          {failure.descriptionAfter}
        </p>
      </div>

      {/* Body count */}
      {failure.bodyCount && (
        <div className="mx-4 sm:mx-6 mb-3 sm:mb-4 bg-[#FFF3EB] border-2 border-[var(--yc-orange)] px-3 sm:px-4 py-2">
          <span className="text-[10px] sm:text-xs font-bold text-[var(--yc-orange)] tracking-wider uppercase">
            DAMAGE REPORT: {failure.bodyCount}
          </span>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 sm:px-6 py-3 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--text-dim)] hover:text-[var(--yc-orange)] border-t-2 border-[var(--border-color)] transition-colors flex items-center justify-center gap-2 font-semibold"
      >
        {expanded ? "Close exhibit" : "View sources"}
        <span
          className="transition-transform inline-block text-sm"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          ↓
        </span>
      </button>

      {/* Sources */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t-2 border-[var(--border-color)] bg-[var(--bg)]">
          <div className="pt-3 sm:pt-4 space-y-2.5">
            {failure.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-[10px] sm:text-xs text-[var(--text-muted)] hover:text-[var(--yc-orange)] transition-colors group"
              >
                <span className="text-[var(--yc-orange)] font-bold flex-shrink-0">
                  →
                </span>
                <span className="underline underline-offset-2 break-words min-w-0">
                  {source.label}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] ml-auto flex-shrink-0 border border-[var(--border-color)] px-1.5 py-0.5">
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

function ExhibitsSection() {
  const fraud = FAILURES.filter((f) => f.status === "FRAUD");
  const dead = FAILURES.filter((f) => f.status === "DEAD");
  const zombies = FAILURES.filter((f) => f.status === "ZOMBIE");
  const scandals = FAILURES.filter((f) => f.status === "SCANDAL");

  const sections = [
    {
      title: "Fraud Wing",
      subtitle:
        "Criminal charges filed. Investors duped. Founders indicted.",
      items: fraud,
    },
    {
      title: "Scandal Gallery",
      subtitle: "Not dead yet, but the headlines were brutal.",
      items: scandals,
    },
    {
      title: "The Graveyard",
      subtitle:
        "Dead on arrival. Capital incinerated. Dreams deferred.",
      items: dead,
    },
    {
      title: "Zombie Hall",
      subtitle: "Still technically alive. Nobody knows why.",
      items: zombies,
    },
  ].filter((s) => s.items.length > 0);

  let globalIndex = 0;

  return (
    <section id="exhibits" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {sections.map((section) => (
        <div key={section.title} className="mb-12 sm:mb-20">
          <div className="flex items-baseline gap-4 mb-2">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl md:text-5xl italic">
              {section.title}
            </h2>
            <div className="h-[2px] flex-1 bg-[var(--border-color)] opacity-10" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-dim)] mb-6 sm:mb-10 font-medium tracking-wide">
            {section.subtitle}
          </p>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {section.items.map((failure) => {
              const idx = globalIndex++;
              return (
                <ExhibitCard
                  key={failure.id}
                  failure={failure}
                  index={idx}
                />
              );
            })}
          </div>
          <hr className="section-divider" />
        </div>
      ))}
    </section>
  );
}

function CemeterySection() {
  return (
    <section id="graveyard" className="bg-[var(--border-color)] text-white py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="museum-label text-[var(--yc-orange)] mb-3 sm:mb-4">
          PERMANENT COLLECTION
        </div>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-5xl md:text-6xl italic mb-4 sm:mb-6">
          The <span className="text-[var(--yc-orange)]">Cemetery</span>
        </h2>
        <p className="text-sm text-[#999] max-w-xl mb-8 sm:mb-12 leading-relaxed">
          A non-exhaustive list of YC-backed companies that raised millions,
          shipped products nobody wanted, and quietly 404&apos;d into the
          void.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-0 border-2 border-[#333]">
          {[
            "Tutorspree",
            "Meteor",
            "Exec",
            "Moki.tv",
            "Gobble",
            "Zidisha",
            "Virool",
            "Backplane",
            "Lollipuff",
            "Bufferbox",
            "Shoptiques",
            "Cherry",
            "Sprig",
            "Munchery",
            "Bento",
            "Washio",
            "Zirtual",
            "Prim",
            "OMGPop",
            "Socialcam",
            "Cloudkick",
            "Scoopler",
            "Heyzap",
            "Lanyrd",
          ].map((name) => (
            <div
              key={name}
              className="border border-[#333] p-3 sm:p-4 text-center hover:bg-[var(--yc-orange)] hover:text-black transition-all group"
            >
              <div className="text-[10px] sm:text-xs font-bold text-[#666] group-hover:text-black tracking-wide">
                {name}
              </div>
              <div className="text-[9px] text-[#444] group-hover:text-black/60 mt-1 font-semibold tracking-[0.2em]">
                R.I.P.
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-[#555] mt-8 sm:mt-12 text-center tracking-[0.2em] uppercase font-semibold">
          This is a partial list. The full cemetery requires a separate wing.
        </p>
      </div>
    </section>
  );
}

function GiftShopSection() {
  return (
    <section id="gift-shop" className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="museum-label text-[var(--yc-orange)] mb-3 sm:mb-4">
          BEFORE YOU LEAVE
        </div>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl md:text-5xl italic mb-4 sm:mb-6">
          The Gift Shop
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-xl mb-8 sm:mb-12 leading-relaxed">
          Take home a piece of the wreckage. Every failed startup leaves
          behind lessons — these are the ones YC would prefer you forget.
        </p>

        <div className="grid gap-0 md:grid-cols-3 border-2 border-[var(--border-color)] bg-white">
          {[
            {
              title: "The Pattern",
              body: "Raise too much, too fast. Scale before product-market fit. Lie about metrics. Get caught. Blame the market.",
            },
            {
              title: "The Enablers",
              body: "Demo Day creates FOMO. Partners invest, then fund the next batch. Nobody checks on batch -3. The factory never stops.",
            },
            {
              title: "The Survivors",
              body: "For every FTX, there's an Airbnb. But survivorship bias is a hell of a drug. You're looking at the museum, not the map.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`p-5 sm:p-8 ${i > 0 ? "border-t-2 md:border-t-0 md:border-l-2 border-[var(--border-color)]" : ""}`}
            >
              <h3 className="font-black text-sm sm:text-base mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-[var(--border-color)] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[var(--yc-orange)] flex items-center justify-center">
                <span className="text-white text-[10px] font-black">
                  YC
                </span>
              </div>
              <span className="font-bold text-sm">.FAIL</span>
            </div>
            <p className="text-[10px] sm:text-xs text-[var(--text-dim)] max-w-md leading-relaxed">
              This is a satirical project. Not affiliated with Y Combinator.
              All information sourced from public records, court filings,
              and news reports. Pattern recognition, not prediction.
            </p>
          </div>
          <div className="text-[10px] sm:text-xs text-[var(--text-dim)] md:text-right font-medium">
            <div className="mb-1">Admission is free. The losses were not.</div>
            <div>Built with regret and public filings.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Ticker />
      <main>
        <Hero />
        <ExhibitsSection />
        <CemeterySection />
        <GiftShopSection />
      </main>
      <Footer />
    </>
  );
}
