"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { FAILURES } from "@/data/companies";
import { PRESIDENTS, getEra } from "@/data/eras";

/* ── Derive scandal data from FAILURES ─────────────── */

// Real YC batch sizes by year (from YC blog, YCDB, TechCrunch)
const BATCH_SIZES: Record<number, number> = {
  2005: 11, 2006: 18, 2007: 32, 2008: 43, 2009: 42,
  2010: 62, 2011: 106, 2012: 148, 2013: 98, 2014: 155,
  2015: 217, 2016: 230, 2017: 242, 2018: 279, 2019: 350,
  2020: 371, 2021: 727, 2022: 654, 2023: 511, 2024: 610,
  2025: 630, 2026: 196,
};

// Group failures by era
type EraKey = "pg" | "altman" | "ralston" | "tan";
const ERA_LABELS: Record<EraKey, string> = {
  pg: "Paul Graham", altman: "Sam Altman", ralston: "Geoff Ralston", tan: "Garry Tan",
};
const ERA_YEARS: Record<EraKey, [number, number]> = {
  pg: [2005, 2014], altman: [2014, 2019], ralston: [2019, 2023], tan: [2023, 2027],
};
const ERA_COLORS: Record<EraKey, string> = {
  pg: "#22c55e", altman: "#eab308", ralston: "#f97316", tan: "#dc2626",
};

// Get the year a scandal surfaced (yearDied > last timeline event > yearFounded)
function getScandalYear(f: typeof FAILURES[number]): number {
  if (f.yearDied) return f.yearDied;
  if (f.timeline && f.timeline.length > 0) {
    const lastYear = Math.max(...f.timeline.map(t => parseInt(t.date)));
    if (!isNaN(lastYear)) return lastYear;
  }
  return f.yearFounded;
}

function getScandalEra(f: typeof FAILURES[number]): EraKey {
  const year = getScandalYear(f);
  if (year < 2014) return "pg";
  if (year < 2019) return "altman";
  if (year < 2023) return "ralston";
  return "tan";
}

function getEraStats(era: EraKey) {
  const [start, end] = ERA_YEARS[era];
  const years = Math.min(end, 2026) - start; // years of presidency
  const companies = Object.entries(BATCH_SIZES)
    .filter(([y]) => Number(y) >= start && Number(y) < end)
    .reduce((s, [, v]) => s + v, 0);
  const scandals = FAILURES.filter(f => getScandalEra(f) === era);
  const fraudCount = scandals.filter(f => f.status === "FRAUD" || f.status === "SCANDAL").length;
  const totalCount = scandals.length;
  return {
    companies,
    years,
    totalExhibits: totalCount,
    fraudScandals: fraudCount,
    exhibitsPerYear: years > 0 ? totalCount / years : 0,
    scandalRate: companies > 0 ? (totalCount / companies) * 100 : 0,
    fraudRate: companies > 0 ? (fraudCount / companies) * 100 : 0,
  };
}

const eraKeys: EraKey[] = ["pg", "altman", "ralston", "tan"];
const eraStats = Object.fromEntries(eraKeys.map(k => [k, getEraStats(k)])) as Record<EraKey, ReturnType<typeof getEraStats>>;
const maxExhibitsPerYear = Math.max(...eraKeys.map(k => eraStats[k].exhibitsPerYear));

// Per-year data for the detailed chart (using scandal year)
const YEARS = Object.keys(BATCH_SIZES).map(Number).sort();
const yearData = YEARS.map(year => {
  const batch = BATCH_SIZES[year];
  const yearFailures = FAILURES.filter(f => getScandalYear(f) === year);
  const incidents = yearFailures.map(f => `${f.company} (${f.status})`);
  return { year, batch, incidents, count: yearFailures.length };
});
const maxBatch = Math.max(...yearData.map(d => d.batch));

// Overall stats
const totalCompanies = Object.values(BATCH_SIZES).reduce((s, v) => s + v, 0);
const totalExhibits = FAILURES.length;

// Pre-Tan vs Tan comparison (by exhibits per year)
const preTanExhibits = FAILURES.filter(f => getScandalEra(f) !== "tan").length;
const preTanYears = 2023 - 2005; // 18 years
const tanExhibits = FAILURES.filter(f => getScandalEra(f) === "tan").length;
const tanYears = Math.min(2026, 2027) - 2023; // ~3 years
const preTanPerYear = preTanYears > 0 ? preTanExhibits / preTanYears : 0;
const tanPerYear = tanYears > 0 ? tanExhibits / tanYears : 0;
const rateMultiplier = preTanPerYear > 0 ? (tanPerYear / preTanPerYear).toFixed(1) : "∞";

/* ── Animated Counter ──────────────────────────────── */

function AnimatedStat({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const num = parseFloat(value.replace(/[^0-9.]/g, ""));
        const duration = 800;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = Math.round(num * eased);
          setDisplay(value.includes(".") ? (num * eased).toFixed(value.split(".")[1]?.length || 1) : current.toLocaleString());
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref} className="stat-value">{display}{suffix}</div>;
}

/* ── Page ───────────────────────────────────────────── */

export default function TimelinePage() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [eraVisible, setEraVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const eraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => { document.body.style.overflow = ""; document.body.style.height = ""; };
  }, []);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = eraRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEraVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--gap)", padding: "var(--gap) 16px" }}>

        {/* Hero */}
        <div className="block block--accent">
          <div className="block-inner" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
            <div className="label-group" style={{ justifyContent: "center" }}>
              <span className="pill-outline" style={{ borderColor: "#000" }}>(EXHIBIT)</span>
              <span className="pill-outline" style={{ borderColor: "#000" }}>DATA ANALYSIS</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.03em", color: "#fff", margin: "0.5rem 0" }}>
              The Decline of YC
            </h1>
            <p className="text-mono" style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", marginTop: "0.75rem" }}>
              {rateMultiplier}x MORE SCANDALS PER YEAR UNDER GARRY TAN
            </p>
          </div>
        </div>

        {/* ── ERA COMPARISON — The Main Chart ──────────── */}
        <div className="block" style={{ overflow: "visible" }}>
          <div className="block-inner">
            <div className="label-group">
              <span className="pill-outline">(EXHIBIT)</span>
              <span className="pill-solid accent">SCANDAL FREQUENCY BY YC PRESIDENT</span>
            </div>
            <p className="text-mono" style={{ fontSize: "0.7rem", color: "#999", marginBottom: "1.5rem" }}>
              DOCUMENTED EXHIBITS PER YEAR OF PRESIDENCY
            </p>

            <div ref={eraRef} style={{ display: "flex", alignItems: "flex-end", gap: "clamp(8px, 3vw, 16px)", height: "280px", padding: "0 0 40px" }}>
              {eraKeys.map((era, i) => {
                const stats = eraStats[era];
                const barHeight = maxExhibitsPerYear > 0 ? (stats.exhibitsPerYear / maxExhibitsPerYear) * 200 : 0;
                const color = ERA_COLORS[era];
                const isTan = era === "tan";
                const [start, end] = ERA_YEARS[era];

                return (
                  <div key={era} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", minWidth: 0 }}>
                    {/* Rate label above bar */}
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: isTan ? "clamp(1rem, 3.5vw, 1.4rem)" : "clamp(0.7rem, 2.5vw, 1rem)",
                      fontWeight: 800, color: isTan ? "#dc2626" : color,
                      marginBottom: "6px", whiteSpace: "nowrap",
                      opacity: eraVisible ? 1 : 0,
                      transform: eraVisible ? "translateY(0)" : "translateY(10px)",
                      transition: `all 0.5s ease-out ${i * 150 + 400}ms`,
                    }}>
                      {stats.exhibitsPerYear.toFixed(1)}/yr
                    </div>

                    {/* Bar */}
                    <div style={{
                      width: "100%", maxWidth: "140px",
                      height: `${barHeight}px`,
                      background: isTan ? "linear-gradient(to top, #dc2626, #ef4444)" : color,
                      borderRadius: "6px 6px 0 0",
                      opacity: isTan ? 0.9 : 0.3,
                      transform: eraVisible ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "bottom",
                      transition: `transform 0.6s ease-out ${i * 150}ms`,
                      position: "relative",
                    }}>
                      {/* Exhibit count inside bar */}
                      {barHeight > 30 && (
                        <div style={{
                          position: "absolute", bottom: "8px", left: 0, right: 0, textAlign: "center",
                          fontFamily: "var(--font-mono)", fontSize: "clamp(0.45rem, 1.5vw, 0.6rem)", fontWeight: 700,
                          color: isTan ? "#fff" : "rgba(0,0,0,0.4)",
                        }}>
                          {stats.totalExhibits} exhibits
                        </div>
                      )}
                    </div>

                    {/* Label below */}
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <div style={{
                        fontFamily: "var(--font-sans)", fontSize: "clamp(0.6rem, 2vw, 0.8rem)",
                        fontWeight: isTan ? 700 : 500, color: isTan ? "#dc2626" : "#999",
                      }}>
                        {ERA_LABELS[era]}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: "clamp(0.45rem, 1.3vw, 0.6rem)",
                        color: "#666", marginTop: "2px", lineHeight: 1.4,
                      }}>
                        {start}–{end > 2026 ? "now" : end}<br />{stats.years} yrs · {stats.companies.toLocaleString()} cos
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pre-Tan average line callout */}
            <div style={{
              background: "#fef2f2", border: "2px solid #dc2626", borderRadius: "var(--radius-md)",
              padding: "12px 16px", marginTop: "8px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "#dc2626" }}>
                GARRY TAN ERA: {eraStats.tan.exhibitsPerYear.toFixed(1)} exhibits/yr vs {preTanPerYear.toFixed(1)}/yr pre-Tan average — {rateMultiplier}x increase
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="stat-grid">
            <div className="stat-cell">
              <AnimatedStat value={totalCompanies.toLocaleString()} />
              <div className="stat-label">Companies Funded</div>
            </div>
            <div className="stat-cell">
              <AnimatedStat value={String(totalExhibits)} />
              <div className="stat-label" style={{ color: "var(--accent)" }}>Documented Exhibits</div>
            </div>
            <div className="stat-cell">
              <AnimatedStat value={preTanPerYear.toFixed(1)} suffix="/yr" />
              <div className="stat-label">2005–2022 Scandal Freq</div>
            </div>
            <div className="stat-cell">
              <div className="stat-value" style={{ color: "#dc2626" }}>{tanPerYear.toFixed(1)}/yr</div>
              <div className="stat-label" style={{ color: "#dc2626" }}>Garry Tan Era Freq</div>
            </div>
          </div>
        </div>

        {/* ── YEARLY SCANDAL TIMELINE — Exhibits Per Year ──────────── */}
        <div className="block" style={{ overflow: "visible" }}>
          <div className="block-inner">
            <div className="label-group">
              <span className="pill-outline">(EXHIBIT)</span>
              <span className="pill-solid accent">SCANDAL TIMELINE</span>
            </div>
            <p className="text-mono" style={{ fontSize: "0.7rem", color: "#999", marginBottom: "1.5rem" }}>
              DOCUMENTED EXHIBITS BY YEAR · EACH BLOCK = 1 SCANDAL · HOVER FOR DETAILS
            </p>

            {(() => {
              const maxCount = Math.max(...yearData.map(d => d.count), 1);
              return (
                <div ref={chartRef} style={{ position: "relative", height: "300px", display: "flex", alignItems: "flex-end", gap: "2px", padding: "0 0 32px" }}>
                  {/* Era background bands */}
                  {PRESIDENTS.map(p => {
                    const startIdx = yearData.findIndex(d => d.year === p.start);
                    const endIdx = p.end > 2026 ? yearData.length : yearData.findIndex(d => d.year === p.end);
                    if (startIdx < 0) return null;
                    const left = (startIdx / yearData.length) * 100;
                    const width = ((Math.min(endIdx, yearData.length) - startIdx) / yearData.length) * 100;
                    return (
                      <div key={p.name} style={{
                        position: "absolute", left: `${left}%`, width: `${width}%`,
                        top: 0, bottom: "32px",
                        background: `${p.color}08`, borderLeft: `2px solid ${p.color}20`,
                        zIndex: 0, pointerEvents: "none",
                      }}>
                        <div style={{ position: "absolute", top: "6px", left: "8px", pointerEvents: "none" }}>
                          <div style={{
                            fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 700,
                            color: p.color, opacity: 0.7, textTransform: "uppercase", whiteSpace: "nowrap",
                          }}>
                            {p.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {yearData.map((d, i) => {
                    const president = PRESIDENTS.find(p => d.year >= p.start && d.year < p.end);
                    const isHovered = hovered === i;
                    const isTan = d.year >= 2023;
                    const dimmed = hovered !== null && !isHovered;
                    const barColor = isTan ? "#dc2626" : "var(--accent)";
                    // Stack blocks: each exhibit = one unit of height
                    const blockHeight = d.count > 0 ? (d.count / maxCount) * 230 : 0;

                    return (
                      <div
                        key={d.year}
                        style={{
                          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                          position: "relative", zIndex: isHovered ? 50 : 1, cursor: "pointer",
                        }}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {/* Exhibit count above bar */}
                        {d.count > 0 && (
                          <div style={{
                            fontFamily: "var(--font-mono)", fontSize: "0.5rem", fontWeight: 800,
                            color: isTan ? "#dc2626" : "var(--accent)",
                            marginBottom: "2px",
                            opacity: dimmed ? 0.2 : 1,
                            transition: "opacity 0.15s",
                          }}>
                            {d.count}
                          </div>
                        )}

                        <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                          {d.count > 0 ? (
                            // Stacked blocks — one per exhibit
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
                              {Array.from({ length: d.count }).map((_, j) => (
                                <div key={j} style={{
                                  width: "100%", maxWidth: "32px",
                                  height: `${Math.max(blockHeight / d.count - 2, 8)}px`,
                                  background: barColor,
                                  borderRadius: "2px",
                                  opacity: dimmed ? 0.15 : (isHovered ? 0.95 : 0.7),
                                  transition: "all 0.25s ease-out",
                                  transform: visible ? "scaleY(1)" : "scaleY(0)",
                                  transformOrigin: "bottom",
                                  transitionDelay: `${i * 40 + j * 60}ms`,
                                }} />
                              ))}
                            </div>
                          ) : (
                            // Empty year — subtle tick mark
                            <div style={{
                              width: "100%", maxWidth: "32px", height: "3px", margin: "0 auto",
                              background: president?.color || "#888",
                              borderRadius: "1px",
                              opacity: dimmed ? 0.03 : 0.08,
                              transition: "opacity 0.15s",
                            }} />
                          )}
                        </div>

                        {/* Year label */}
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: isHovered ? "0.5rem" : "0.4rem",
                          fontWeight: isHovered ? 700 : 500,
                          color: isHovered ? (isTan ? "#dc2626" : "var(--accent)") : (dimmed ? "#ccc" : "#999"),
                          marginTop: "4px",
                          transform: "rotate(-45deg)", transformOrigin: "center",
                          whiteSpace: "nowrap", transition: "all 0.15s",
                        }}>
                          {"'" + String(d.year).slice(2)}
                        </span>

                        {/* Tooltip */}
                        {isHovered && (
                          <div style={{
                            position: "absolute",
                            bottom: `${blockHeight + 40}px`,
                            left: "50%",
                            transform: i < 3 ? "translateX(-5%)" : i > yearData.length - 4 ? "translateX(-95%)" : "translateX(-50%)",
                            background: "var(--surface-white)",
                            border: "var(--border-w) solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            padding: "14px 16px",
                            width: "260px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                            pointerEvents: "none",
                            zIndex: 100,
                          }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: "4px" }}>
                              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "1rem" }}>{d.year}</span>
                              {president && (
                                <span className="pill-outline" style={{ fontSize: "0.45rem", padding: "2px 8px", color: president.color, borderColor: president.color }}>
                                  {president.label}
                                </span>
                              )}
                            </div>
                            <div className="divider" style={{ margin: "6px 0" }} />
                            <div className="data-row">
                              <span className="text-mono" style={{ fontSize: "0.6rem", color: "#666" }}>COMPANIES FUNDED</span>
                              <span className="text-mono" style={{ fontSize: "0.75rem" }}>{d.batch}</span>
                            </div>
                            <div className="data-row" style={{ borderBottom: "none" }}>
                              <span className="text-mono" style={{ fontSize: "0.6rem", color: "#666" }}>EXHIBITS</span>
                              <span className="text-mono" style={{ fontSize: "0.75rem", color: d.count > 0 ? (isTan ? "#dc2626" : "var(--accent)") : "#999" }}>
                                {d.count || "NONE"}
                              </span>
                            </div>

                            {d.incidents.length > 0 && (
                              <div style={{ marginTop: "8px", borderTop: "1px solid #eee", paddingTop: "8px" }}>
                                {d.incidents.map((inc, j) => (
                                  <div key={j} style={{
                                    fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                                    color: isTan ? "#dc2626" : "#666",
                                    fontWeight: 600, lineHeight: 1.6,
                                  }}>
                                    → {inc}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: "0.5rem" }}>
              <div className="flex items-center gap-1">
                <div style={{ width: "12px", height: "12px", background: "var(--accent)", borderRadius: "2px" }} />
                <span className="text-mono" style={{ fontSize: "0.55rem", color: "#999" }}>EXHIBITS (PRE-TAN)</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{ width: "12px", height: "12px", background: "#dc2626", borderRadius: "2px" }} />
                <span className="text-mono" style={{ fontSize: "0.55rem", color: "#999" }}>EXHIBITS (GARRY TAN ERA)</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{ width: "4px", height: "12px", background: "#ddd", borderRadius: "1px" }} />
                <span className="text-mono" style={{ fontSize: "0.55rem", color: "#999" }}>EACH BLOCK = 1 EXHIBIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes */}
        <div className="block block--dark">
          <div className="block-inner" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "#fff", lineHeight: 1.4, maxWidth: "600px", margin: "0 auto" }}>
              &ldquo;If Paul Graham still has control, it&apos;s probably time for him to step in and right the ship before the brand goes to zero.&rdquo;
            </p>
            <p className="text-mono" style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: "1rem" }}>
              — ADAM COCHRAN, INVESTOR
            </p>
          </div>
        </div>

        <div className="block block--dark">
          <div className="block-inner" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "#fff", lineHeight: 1.4, maxWidth: "600px", margin: "0 auto" }}>
              &ldquo;Die slow motherf*ckers&rdquo;
            </p>
            <p className="text-mono" style={{ fontSize: "0.65rem", color: "#999", marginTop: "0.75rem", maxWidth: "500px", margin: "0.75rem auto 0" }}>
              Garry Tan&apos;s since-deleted tweet directed at seven San Francisco supervisors, which led to multiple police reports and death threats against elected officials.
            </p>
            <p className="text-mono" style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: "0.75rem" }}>
              — GARRY TAN, JAN 2024
            </p>
          </div>
        </div>

        <div className="block block--dark">
          <div className="block-inner" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "#fff", lineHeight: 1.4, maxWidth: "600px", margin: "0 auto" }}>
              &ldquo;Right now we&apos;re in a moment where AI lets you generate code faster than any human can review it, and the answer from people like Garry seems to be &lsquo;so stop reviewing.&rsquo;&rdquo;
            </p>
            <p className="text-mono" style={{ fontSize: "0.7rem", color: "var(--accent)", marginTop: "1rem" }}>
              — SOFTWARE ENGINEER, ON TAN&apos;S &ldquo;37,000 LINES/DAY&rdquo; CLAIM
            </p>
          </div>
        </div>

        {/* Sources */}
        <div className="block">
          <div className="block-inner" style={{ textAlign: "center" }}>
            <p className="text-mono" style={{ fontSize: "0.65rem", color: "#999" }}>
              BATCH DATA: YC OFFICIAL BLOG, YCDB, TECHCRUNCH · EXHIBITS: PUBLIC RECORDS · FREQUENCY = EXHIBITS / YEARS OF PRESIDENCY
            </p>
            <p className="text-mono" style={{ fontSize: "0.65rem", color: "#bbb", marginTop: "0.5rem" }}>
              SATIRICAL PROJECT. NOT AFFILIATED WITH Y COMBINATOR.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
