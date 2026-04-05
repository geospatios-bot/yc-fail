"use client";

import { useEffect } from "react";
import { STATUS_CONFIG, type YCFailure } from "@/data/companies";
import Navbar, { NavLink } from "@/components/Navbar";
import Link from "next/link";

const EVENT_COLORS: Record<string, string> = {
  founding: "#22c55e",
  funding: "#3b82f6",
  scandal: "#f97316",
  death: "#dc2626",
  legal: "#7c3aed",
};

export default function ExhibitPage({
  failure,
  prev,
  next,
}: {
  failure: YCFailure;
  prev: YCFailure | null;
  next: YCFailure | null;
}) {
  const cfg = STATUS_CONFIG[failure.status];

  // Unlock body scroll (main page locks it on desktop)
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const lifespan = failure.yearDied
    ? `${failure.yearDied - failure.yearFounded} YRS`
    : `${new Date().getFullYear() - failure.yearFounded}+ YRS`;

  const statCells = [
    { value: failure.raised, label: "Capital Raised" },
    ...(failure.valuation ? [{ value: failure.valuation, label: "Peak Value" }] : []),
    { value: lifespan, label: "Lifespan" },
    ...(failure.bodyCount ? [{ value: failure.bodyCount, label: "Body Count" }] : []),
  ];

  return (
    <>
      <Navbar right={<NavLink href="/">← DIRECTORY</NavLink>} />

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap)",
          padding: "var(--gap) 0",
        }}
      >
        {/* ── Hero Block ──────────────────────────────── */}
        <div className="block block--dark">
          {failure.imageUrl && (
            <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
              <img
                src={failure.imageUrl}
                alt={`${failure.company}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 30%",
                  filter: "grayscale(100%) contrast(1.1)",
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 30%, #222 100%)",
                }}
              />
            </div>
          )}

          <div
            className="block-inner--hero"
            style={failure.imageUrl ? { marginTop: -80, position: "relative" } : undefined}
          >
            {/* Labels */}
            <div className="label-group">
              <span
                className="pill-outline"
                style={{ color: cfg.color, borderColor: cfg.color }}
              >
                {cfg.label}
              </span>
              <span className="pill-outline">
                {failure.batch !== "—" ? `BATCH ${failure.batch}` : "ADJACENT"}
              </span>
              <span className="pill-outline">{failure.sector}</span>
            </div>

            {/* Company name */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "1rem 0" }}>
              {failure.domain && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${failure.domain}&sz=128`}
                  alt={`${failure.company} logo`}
                  width={48}
                  height={48}
                  style={{ borderRadius: 10, background: "#333", flexShrink: 0 }}
                />
              )}
              <h1
                className="text-hero"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                {failure.company}
              </h1>
            </div>

            {/* One-liner */}
            <p className="text-mono" style={{ color: "var(--accent)", fontSize: "1.2rem" }}>
              {failure.oneLiner}
            </p>
          </div>
        </div>

        {/* ── Key Metrics Block ───────────────────────── */}
        <div className="block">
          <div className="stat-grid">
            {statCells.map((s) => (
              <div key={s.label} className="stat-cell">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Autopsy Block ───────────────────────────── */}
        <div className="block">
          <div className="block-inner">
            <h2 className="text-lg" style={{ marginBottom: "1rem" }}>
              AUTOPSY REPORT
            </h2>
            <div className="divider" />
            <p className="text-body">
              {failure.description}{" "}
              <span
                className="redacted"
                onClick={(e) => e.currentTarget.classList.toggle("revealed")}
              >
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
        </div>

        {/* ── Timeline Block ──────────────────────────── */}
        {failure.timeline && failure.timeline.length > 0 && (
          <div className="block">
            <div className="block-inner">
              <h2 className="text-lg" style={{ marginBottom: "1rem" }}>
                TIMELINE
              </h2>
              <div className="divider" />
              <div className="exhibit-timeline">
                {failure.timeline.map((evt, i) => (
                  <div key={i} className="timeline-event">
                    <div
                      className="timeline-dot"
                      style={{
                        borderColor: evt.type ? EVENT_COLORS[evt.type] ?? "var(--border-color)" : "var(--border-color)",
                        background: evt.type ? EVENT_COLORS[evt.type] ?? "var(--surface-white)" : "var(--surface-white)",
                      }}
                    />
                    <span className="timeline-date">{evt.date}</span>
                    <span className="timeline-text">{evt.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Sources Block ───────────────────────────── */}
        {failure.sources.length > 0 && (
          <div className="block">
            <div className="block-inner">
              <h2 className="text-lg" style={{ marginBottom: "1rem" }}>
                SOURCES
              </h2>
              <div className="divider" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {failure.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      color: "inherit",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                  >
                    → {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Block ────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0 2rem" }}>
          {prev ? (
            <Link
              href={`/exhibit/${prev.id}`}
              className="pill-outline"
              style={{ textDecoration: "none", color: "#fff", borderColor: "#555", padding: "8px 20px" }}
            >
              ← {prev.company}
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/exhibit/${next.id}`}
              className="pill-outline"
              style={{ textDecoration: "none", color: "#fff", borderColor: "#555", padding: "8px 20px" }}
            >
              {next.company} →
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <p className="text-mono" style={{ color: "#444", fontSize: "0.7rem" }}>
            Satirical project. Not affiliated with Y Combinator. All information from public records.
          </p>
        </div>
      </div>
    </>
  );
}
