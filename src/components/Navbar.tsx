"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  Shared navbar used on every page.
  Orange background, white text, fixed at top.

  Left: brand + nav links (always visible)
  Right: @NotOnKetamine + optional extras (mobile hamburger)
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

export const NAVBAR_HEIGHT = 42; // px — fixed height set in CSS

export default function Navbar() {
  const pathname = usePathname();
  const isSubpage = pathname !== "/";

  return (
    <nav className="navbar">
      {/* Left: brand + navigation */}
      <div className="navbar-left">
        <Link href="/" className="navbar-brand">
          <span className="navbar-brand-text">ycombinator.fyi</span>
        </Link>
        <span className="navbar-sep">/</span>
        <NavLink href="/timeline">Timeline</NavLink>
        {isSubpage && (
          <NavLink href="/">← Directory</NavLink>
        )}
      </div>

      {/* Right */}
      <div className="navbar-right">
        <NavLink href="https://x.com/NotOnKetamine" external>
          @NotOnKetamine
        </NavLink>
      </div>
    </nav>
  );
}
