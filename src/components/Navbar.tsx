"use client";

import { type ReactNode } from "react";
import Link from "next/link";

/*
  Shared navbar used on every page.
  Orange background, white text, fixed at top.

  Props:
    - right: nav links + buttons rendered on the right side
    - children: optional extra items between logo and right side
*/

const YC_LOGO = (
  <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M13.9012 11.7843H17.6595L22.4961 21.5325C23.203 22.9836 23.7984 24.3976 23.7984 24.3976C23.7984 24.3976 24.4313 23.021 25.175 21.5325L30.0868 11.7843H33.5843L25.2865 27.3746V37.309H22.1244V27.1884L13.9012 11.7843Z" fill="white"/>
  </svg>
);

export function NavLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const style = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 800,
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap" as const,
  };

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>;
  }
  return <Link href={href} style={style}>{children}</Link>;
}

export function NavButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center nav-btn"
    >
      {children}
    </button>
  );
}

export const NAVBAR_HEIGHT = 42; // px — padding (10*2) + content (22)

export default function Navbar({ right }: { right?: ReactNode }) {
  return (
    <>
      <nav className="navbar">
        {/* Left: logo + site name */}
        <Link href="/" className="navbar-brand">
          {YC_LOGO}
          <span>YCOMBINATOR.FYI</span>
        </Link>

        {/* Right: nav items */}
        <div className="navbar-right">
          {right}
          {/* Twitter — always visible, case-sensitive */}
          <NavLink href="https://x.com/NotOnKetamine" external>
            <span style={{ textTransform: "none" }}>@NotOnKetamine</span>
          </NavLink>
        </div>
      </nav>

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
    </>
  );
}
