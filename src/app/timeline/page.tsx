"use client";

import { useState, useEffect, useRef } from "react";
import Navbar, { NavLink } from "@/components/Navbar";
import { PRESIDENTS, getPresident } from "@/data/eras";

/* ── Real YC Data ───────────────────────────────────── */

const CHART_DATA = [
  { year: 2005, batch: 11, incidents: [] as string[] },
  { year: 2006, batch: 18, incidents: [] as string[] },
  { year: 2007, batch: 32, incidents: [] as string[] },
  { year: 2008, batch: 43, incidents: [] as string[] },
  { year: 2009, batch: 42, incidents: [] as string[] },
  { year: 2010, batch: 62, incidents: [] as string[] },
  { year: 2011, batch: 106, incidents: [] as string[] },
  { year: 2012, batch: 148, incidents: [] as string[] },
  { year: 2013, batch: 98, incidents: [] as string[] },
  { year: 2014, batch: 155, incidents: [] as string[] },
  { year: 2015, batch: 217, incidents: ["Zenefits fraud — fake insurance licenses"] },
  { year: 2016, batch: 230, incidents: [] as string[] },
  { year: 2017, batch: 242, incidents: ["IRL launches (95% bot users revealed later)"] },
  { year: 2018, batch: 279, incidents: ["Katerra hemorrhaging cash ($2B)"] },
  { year: 2019, batch: 350, incidents: ["FTX founded — $8B fraud begins"] },
  { year: 2020, batch: 371, incidents: ["ScaleFactor shuts ($100M)", "Atrium shuts ($75M)", "Quibi dies in 6 months ($1.75B)"] },
  { year: 2021, batch: 727, incidents: ["Katerra bankruptcy ($2B)", "727 companies — all-time peak"] },
  { year: 2022, batch: 654, incidents: ["FTX collapses — $8B stolen", "W22: 414 per batch record"] },
  { year: 2023, batch: 511, incidents: ["Cruise cover-up exposed", "IRL shut down by SEC", "Flexport CEO coup", "Garry Tan takes over"] },
  { year: 2024, batch: 610, incidents: ["PearAI forks open-source", "Central clones Warp", "Rippling–Deel spy scandal", "4 batches/year begins"] },
  { year: 2025, batch: 630, incidents: ["GStack controversy", "Batch duplicates rampant", "Investors flag YC as red flag"] },
  { year: 2026, batch: 196, incidents: ["Delve expelled — 493 fake audits", "'Generational fumble' — Cochran", "ycombinator.fyi launches"] },
];

// Derived data
const maxBatch = Math.max(...CHART_DATA.map(d => d.batch));
const maxIncidents = Math.max(...CHART_DATA.map(d => d.incidents.length));

/* ── Animated Counter ───────────────────────────────── */

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
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
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

/* ── Page ────────────────────────────────────────────── */

export default function TimelinePage() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Unlock body scroll
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => { document.body.style.overflow = ""; document.body.style.height = ""; };
  }, []);

  // Animate bars on scroll into view
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Computed stats
  const totalCompanies = CHART_DATA.reduce((s, d) => s + d.batch, 0);
  const totalIncidents = CHART_DATA.reduce((s, d) => s + d.incidents.length, 0);
  const garryStart = CHART_DATA.findIndex(d => d.year === 2023);
  const garryData = CHART_DATA.filter(d => d.year >= 2023);
  const preGarryData = CHART_DATA.filter(d => d.year < 2023);
  const garryRate = (garryData.reduce((s, d) => s + d.incidents.length, 0) / garryData.reduce((s, d) => s + d.batch, 0)) * 100;
  const preGarryRate = (preGarryData.reduce((s, d) => s + d.incidents.length, 0) / preGarryData.reduce((s, d) => s + d.batch, 0)) * 100;
  const rateMultiplier = (garryRate / preGarryRate).toFixed(1);

  return (
    <>
      <Navbar right={<NavLink href="/">← DIRECTORY</NavLink>} />

      <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--gap)", padding: "var(--gap) 0" }}>

        {/* Hero callout */}
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
              {rateMultiplier}x HIGHER INCIDENT RATE UNDER GARRY TAN
            </p>
          </div>
        </div>

        {/* Main chart */}
        <div className="block" style={{ overflow: "visible" }}>
          <div className="block-inner">
            <div className="label-group">
              <span className="pill-outline">(EXHIBIT)</span>
              <span className="pill-solid accent">BATCH SIZE VS INCIDENTS</span>
            </div>
            <p className="text-mono" style={{ fontSize: "0.7rem", color: "#999", marginBottom: "1.5rem" }}>
              GRAY = COMPANIES FUNDED · ORANGE = DOCUMENTED INCIDENTS · HOVER FOR DETAILS
            </p>

            {/* Chart area */}
            <div ref={chartRef} style={{ position: "relative", height: "300px", display: "flex", alignItems: "flex-end", gap: "2px", padding: "0 0 32px" }}>

              {/* Presidential era bands */}
              {PRESIDENTS.map(p => {
                const startIdx = CHART_DATA.findIndex(d => d.year === p.start);
                const endIdx = p.end > 2026 ? CHART_DATA.length : CHART_DATA.findIndex(d => d.year === p.end);
                if (startIdx < 0) return null;
                const left = (startIdx / CHART_DATA.length) * 100;
                const width = ((Math.min(endIdx, CHART_DATA.length) - startIdx) / CHART_DATA.length) * 100;
                return (
                  <div key={p.name} style={{
                    position: "absolute",
                    left: `${left}%`, width: `${width}%`,
                    top: 0, bottom: "32px",
                    background: `${p.color}08`,
                    borderLeft: `2px solid ${p.color}20`,
                    zIndex: 0, pointerEvents: "none",
                  }}>
                    <div style={{
                      position: "absolute", top: "6px", left: "8px",
                      pointerEvents: "none",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 800,
                        color: p.color, opacity: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
                        lineHeight: 1,
                      }}>
                        {p.name}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: "0.45rem", fontWeight: 700,
                        color: p.color, opacity: 0.5, whiteSpace: "nowrap",
                        marginTop: "2px",
                      }}>
                        {p.start}–{p.end > 2026 ? "NOW" : p.end}
                      </div>
                    </div>
                  </div>
                );
              })}

              {CHART_DATA.map((d, i) => {
                const batchHeight = (d.batch / maxBatch) * 240;
                const incidentHeight = d.incidents.length > 0 ? Math.max((d.incidents.length / maxIncidents) * 240, 8) : 0;
                const president = getPresident(d.year);
                const isHovered = hovered === i;
                const isGarry = d.year >= 2023;
                const dimmed = hovered !== null && !isHovered;

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
                    {/* Stacked bar: batch (gray) with incident overlay (orange) */}
                    <div style={{ position: "relative", width: "100%", height: `${batchHeight}px` }}>
                      {/* Batch bar */}
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "100%",
                        background: president?.color || "#222",
                        borderRadius: "2px 2px 0 0",
                        opacity: dimmed ? 0.08 : (isHovered ? 0.4 : 0.18),
                        transition: "all 0.25s ease-out",
                        transform: visible ? "scaleY(1)" : "scaleY(0)",
                        transformOrigin: "bottom",
                        transitionDelay: `${i * 40}ms`,
                      }} />
                      {/* Incident overlay */}
                      {incidentHeight > 0 && (
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          height: `${incidentHeight}px`,
                          background: "var(--accent)",
                          borderRadius: "2px 2px 0 0",
                          opacity: dimmed ? 0.15 : (isHovered ? 1 : 0.75),
                          transition: "all 0.25s ease-out",
                          transform: visible ? "scaleY(1)" : "scaleY(0)",
                          transformOrigin: "bottom",
                          transitionDelay: `${i * 40 + 300}ms`,
                        }} />
                      )}
                    </div>

                    {/* Year label */}
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: isHovered ? "0.5rem" : "0.4rem",
                      fontWeight: isHovered ? 800 : 700,
                      color: isHovered ? (president?.color || "#000") : (dimmed ? "#444" : "#999"),
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
                        bottom: `${batchHeight + 12}px`,
                        left: "50%",
                        transform: i < 3 ? "translateX(-5%)" : i > CHART_DATA.length - 4 ? "translateX(-95%)" : "translateX(-50%)",
                        background: "var(--surface-white)",
                        border: "var(--border-w) solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        padding: "14px 16px",
                        width: "260px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                        pointerEvents: "none",
                        zIndex: 100,
                      }}>
                        {/* Header */}
                        <div className="flex items-center justify-between" style={{ marginBottom: "4px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "1rem" }}>{d.year}</span>
                          {president && (
                            <span className="pill-outline" style={{ fontSize: "0.45rem", padding: "2px 8px", color: president.color, borderColor: president.color }}>
                              {president.name}
                            </span>
                          )}
                        </div>
                        <div className="divider" style={{ margin: "6px 0" }} />

                        {/* Stats */}
                        <div className="data-row">
                          <span className="text-mono" style={{ fontSize: "0.6rem", color: "#666" }}>COMPANIES FUNDED</span>
                          <span className="text-mono" style={{ fontSize: "0.75rem" }}>{d.batch}</span>
                        </div>
                        <div className="data-row" style={{ borderBottom: d.incidents.length > 0 ? undefined : "none" }}>
                          <span className="text-mono" style={{ fontSize: "0.6rem", color: "#666" }}>INCIDENTS</span>
                          <span className="text-mono" style={{ fontSize: "0.75rem", color: d.incidents.length > 0 ? "var(--accent)" : "#999" }}>
                            {d.incidents.length || "NONE"}
                          </span>
                        </div>
                        {d.incidents.length > 0 && (
                          <div className="data-row" style={{ borderBottom: "none" }}>
                            <span className="text-mono" style={{ fontSize: "0.6rem", color: "#666" }}>INCIDENT RATE</span>
                            <span className="text-mono" style={{ fontSize: "0.75rem", color: isGarry ? "#dc2626" : "var(--accent)" }}>
                              {((d.incidents.length / d.batch) * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}

                        {/* Incident list */}
                        {d.incidents.length > 0 && (
                          <div style={{ marginTop: "8px", borderTop: "1px solid #eee", paddingTop: "8px" }}>
                            {d.incidents.map((inc, j) => (
                              <div key={j} style={{
                                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                                color: isGarry ? "#dc2626" : "#666",
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

            {/* Chart legend */}
            <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: "0.5rem" }}>
              <div className="flex items-center gap-1">
                <div style={{ width: "12px", height: "12px", background: "#888", borderRadius: "2px", opacity: 0.3 }} />
                <span className="text-mono" style={{ fontSize: "0.55rem", color: "#999" }}>BATCH SIZE</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{ width: "12px", height: "12px", background: "var(--accent)", borderRadius: "2px" }} />
                <span className="text-mono" style={{ fontSize: "0.55rem", color: "#999" }}>INCIDENTS</span>
              </div>
              <span className="text-mono" style={{ fontSize: "0.55rem", color: "#bbb", marginLeft: "auto" }}>
                2026 IS YTD (W26 ONLY)
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
              <AnimatedStat value={String(totalIncidents)} />
              <div className="stat-label" style={{ color: "var(--accent)" }}>Documented Incidents</div>
            </div>
            <div className="stat-cell">
              <AnimatedStat value={preGarryRate.toFixed(2)} suffix="%" />
              <div className="stat-label">2005–2022 Rate</div>
            </div>
            <div className="stat-cell">
              <div className="stat-value" style={{ color: "#dc2626" }}>{garryRate.toFixed(2)}%</div>
              <div className="stat-label" style={{ color: "#dc2626" }}>Garry Tan Rate</div>
            </div>
          </div>
        </div>

        {/* Callout block */}
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

        {/* Sources */}
        <div className="block">
          <div className="block-inner" style={{ textAlign: "center" }}>
            <p className="text-mono" style={{ fontSize: "0.65rem", color: "#999" }}>
              BATCH DATA: YC OFFICIAL BLOG, YCDB, TECHCRUNCH, ELLENOX · INCIDENTS: PUBLIC RECORDS
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
