"use client";

import { type ReactNode } from "react";
import Link from "next/link";

/*
  Shared navbar used on every page.
  Orange background, white text, fixed at top.

  Props:
    - right: nav links + buttons rendered on the right side
*/

export function NavLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="nav-link">
        {children}
      </a>
    );
  }
  return <Link href={href} className="nav-link">{children}</Link>;
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

export const NAVBAR_HEIGHT = 42; // px — fixed height set in CSS

export default function Navbar({ right }: { right?: ReactNode }) {
  return (
    <nav className="navbar">
      {/* Left: site name */}
      <Link href="/" className="navbar-brand">
        <span className="navbar-brand-text">ycombinator.fyi</span>
      </Link>

      {/* Right: nav items */}
      <div className="navbar-right">
        {right}
        <NavLink href="https://x.com/NotOnKetamine" external>
          <span style={{ textTransform: "none" }}>@NotOnKetamine</span>
        </NavLink>
      </div>
    </nav>
  );
}
