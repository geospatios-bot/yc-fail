"use client";

import { useState } from "react";
import { FAILURES, STATUS_CONFIG, computeStats, type YCFailure } from "@/data/companies";

function Nav() {
  return (
    <nav className="sticky top-0 z-50 nav-blur border-b border-[#e5e5e5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--yc-orange)] rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">Y</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">
            YC<span className="text-[var(--yc-orange)]">.FAIL</span>
          </span>
        </a>
        <div className="flex items-center gap-4 sm:gap-8 text-[10px] sm:text-xs tracking-widest uppercase text-[#999]">
          <a href="#exhibits" className="hover:text-[var(--yc-orange)] transition-colors">
            Exhibits
          </a>
          <a href="#graveyard" className="hidden sm:inline hover:text-[var(--yc-orange)] transition-colors">
            Graveyard
          </a>
          <a href="#gift-shop" className="hover:text-[var(--yc-orange)] transition-colors">
            Gift Shop
          </a>
        </div>
      </div>
    </nav>
  );
}

function Ticker() {
  const items = FAILURES.map((f) => `${f.company} — ${f.raised} — ${f.status}`);
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrapper border-b border-[#e5e5e5] bg-white overflow-hidden py-1.5 sm:py-2">
      <div className="ticker-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-[10px] sm:text-xs tracking-wider text-[#999] mx-3 sm:mx-6">
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
    <section className="hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-24 pb-10 sm:pb-20">
        <div className="museum-label mb-4 sm:mb-6">Est. 2005 — Present</div>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl sm:text-6xl md:text-8xl leading-[0.95] tracking-tight mb-4 sm:mb-6">
          The Museum
          <br />
          of{" "}
          <span className="italic text-[var(--yc-orange)]">Failure</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#666] max-w-2xl leading-relaxed mb-8 sm:mb-12">
          A curated exhibition of Y Combinator&apos;s most spectacular failures, frauds, and
          flameouts. {stats.totalRaised}+ in capital raised. Gone.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "EXHIBITS", value: stats.totalCompanies, color: "var(--yc-orange)" },
            { label: "FRAUD CASES", value: stats.totalFraud, color: "var(--fraud-red)" },
            { label: "DECEASED", value: stats.totalDead, color: "var(--dead-black)" },
            { label: "ZOMBIES", value: stats.totalZombie, color: "var(--zombie-amber)" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card bg-white border border-[#e5e5e5] rounded-sm p-3 sm:p-5"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="museum-label mb-1 sm:mb-2">{stat.label}</div>
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
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
      style={{ color: config.color, background: config.bg }}
    >
      {config.label}
    </span>
  );
}

function ExhibitCard({ failure, index }: { failure: YCFailure; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isDead = failure.status === "DEAD";

  return (
    <div
      className={`exhibit-card ${isDead ? "tombstone" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 pb-0">
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
          <div className="min-w-0">
            <div className="museum-label mb-1">
              EXHIBIT {String(index + 1).padStart(3, "0")} —{" "}
              {failure.batch !== "—" ? `BATCH ${failure.batch}` : "YC ADJACENT"}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{failure.company}</h3>
            <div className="text-xs sm:text-sm text-[#999] mt-1">
              {failure.founders.join(", ")} · {failure.sector}
            </div>
          </div>
          <StatusBadge status={failure.status} />
        </div>

        <p className="text-xs sm:text-sm font-medium text-[var(--yc-orange)] mb-3 sm:mb-4 leading-relaxed">
          &ldquo;{failure.oneLiner}&rdquo;
        </p>
      </div>

      {/* Financials bar */}
      <div className="mx-4 sm:mx-6 border border-[#e5e5e5] rounded-sm mb-3 sm:mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-[#e5e5e5]">
          <div className="p-2 sm:p-3">
            <div className="museum-label">RAISED</div>
            <div className="font-bold text-xs sm:text-sm mt-1">{failure.raised}</div>
          </div>
          {failure.valuation && (
            <div className="p-2 sm:p-3">
              <div className="museum-label">VALUATION</div>
              <div className="font-bold text-xs sm:text-sm mt-1">{failure.valuation}</div>
            </div>
          )}
          <div className="p-2 sm:p-3">
            <div className="museum-label">
              {failure.yearDied ? "LIVED" : "STATUS"}
            </div>
            <div className="font-bold text-xs sm:text-sm mt-1">
              {failure.yearDied
                ? `${failure.yearFounded}–${failure.yearDied}`
                : `Since ${failure.yearFounded}`}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
        <p className="text-xs sm:text-sm leading-relaxed text-[#555]">
          {failure.description}{" "}
          <span className="redacted" onClick={(e) => e.currentTarget.classList.toggle("revealed")}>{failure.redactedText}</span>{" "}
          {failure.descriptionAfter}
        </p>
      </div>

      {/* Body count */}
      {failure.bodyCount && (
        <div className="mx-4 sm:mx-6 mb-3 sm:mb-4 bg-[#FFF3EB] border border-[#FFD4B2] rounded-sm px-3 sm:px-4 py-2">
          <span className="text-[10px] sm:text-xs font-semibold text-[var(--yc-orange)]">
            DAMAGE: {failure.bodyCount}
          </span>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs tracking-widest uppercase text-[#999] hover:text-[var(--yc-orange)] border-t border-[#e5e5e5] transition-colors flex items-center justify-center gap-2"
      >
        {expanded ? "Close exhibit" : "View sources"}
        <span
          className="transition-transform inline-block"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
        >
          ↓
        </span>
      </button>

      {/* Sources */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#e5e5e5] bg-[#FAFAF9]">
          <div className="pt-3 sm:pt-4 space-y-2">
            {failure.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-[10px] sm:text-xs text-[#555] hover:text-[var(--yc-orange)] transition-colors group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4d4d4] group-hover:bg-[var(--yc-orange)] transition-colors flex-shrink-0 mt-1" />
                <span className="underline underline-offset-2 break-words min-w-0">{source.label}</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#bbb] ml-auto flex-shrink-0">
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
      subtitle: "Criminal charges filed. Investors duped. Founders indicted.",
      items: fraud,
    },
    {
      title: "Scandal Gallery",
      subtitle: "Not dead yet, but the headlines were brutal.",
      items: scandals,
    },
    {
      title: "The Graveyard",
      subtitle: "Dead on arrival. Capital incinerated. Dreams deferred.",
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
    <section id="exhibits" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {sections.map((section) => (
        <div key={section.title} className="mb-10 sm:mb-16">
          <div className="flex items-baseline gap-3 sm:gap-4 mb-2">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl sm:text-3xl md:text-4xl italic">
              {section.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#999] mb-6 sm:mb-8">{section.subtitle}</p>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {section.items.map((failure) => {
              const idx = globalIndex++;
              return <ExhibitCard key={failure.id} failure={failure} index={idx} />;
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
    <section id="graveyard" className="bg-[#1a1a1a] text-white py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="museum-label text-[#666] mb-3 sm:mb-4">PERMANENT COLLECTION</div>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl md:text-5xl italic mb-4 sm:mb-6">
          The <span className="text-[var(--yc-orange)]">Cemetery</span>
        </h2>
        <p className="text-sm text-[#999] max-w-xl mb-8 sm:mb-12 leading-relaxed">
          A non-exhaustive list of YC-backed companies that raised millions, shipped products
          nobody wanted, and quietly 404&apos;d into the void.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {[
            "Tutorspree",  "Meteor",      "Exec",
            "Moki.tv",     "Gobble",      "Zidisha",
            "Virool",      "Backplane",   "Lollipuff",
            "Bufferbox",   "Shoptiques",  "Cherry",
            "Sprig",       "Munchery",    "Bento",
            "Washio",      "Zirtual",     "Prim",
            "OMGPop",      "Socialcam",   "Cloudkick",
            "Scoopler",    "Heyzap",      "Lanyrd",
          ].map((name) => (
            <div
              key={name}
              className="border border-[#333] rounded-sm p-2 sm:p-3 text-center text-[10px] sm:text-xs text-[#666] hover:border-[var(--yc-orange)] hover:text-[var(--yc-orange)] transition-colors"
            >
              {name}
              <div className="text-[9px] sm:text-[10px] text-[#444] mt-0.5 sm:mt-1">R.I.P.</div>
            </div>
          ))}
        </div>

        <p className="text-[9px] sm:text-[10px] text-[#555] mt-6 sm:mt-8 text-center tracking-wider uppercase">
          This is a partial list. The full cemetery requires a separate wing.
        </p>
      </div>
    </section>
  );
}

function GiftShopSection() {
  return (
    <section id="gift-shop" className="py-12 sm:py-20 bg-[var(--yc-orange-light)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="museum-label mb-3 sm:mb-4">BEFORE YOU LEAVE</div>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl md:text-5xl italic mb-4 sm:mb-6">
          The Gift Shop
        </h2>
        <p className="text-sm text-[#666] max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
          Take home a piece of the wreckage. Every failed startup leaves behind lessons — these
          are the ones YC would prefer you forget.
        </p>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 max-w-3xl mx-auto text-left">
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
          ].map((item) => (
            <div key={item.title} className="bg-white border border-[#e5e5e5] rounded-sm p-4 sm:p-6">
              <h3 className="font-semibold text-sm mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-xs text-[#666] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-[var(--yc-orange)] rounded-sm flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">Y</span>
              </div>
              <span className="font-semibold text-sm">
                YC<span className="text-[var(--yc-orange)]">.FAIL</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#999] max-w-md leading-relaxed">
              This is a satirical project. Not affiliated with Y Combinator. All information is
              sourced from public records, court filings, and news reports. Pattern recognition,
              not prediction.
            </p>
          </div>
          <div className="text-[10px] sm:text-xs text-[#999] md:text-right">
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
