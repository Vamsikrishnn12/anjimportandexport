"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const nav = [["Home", "/"], ["About", "/about"], ["Products", "/products"], ["Services", "/services"], ["Contact", "/contact"]];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="site-wrap">
    <header className="site-header">
      <Link href="/" className="brand" aria-label="ANJ Global home"><img src="/anj-global-logo.png" alt="ANJ Global Import and Export" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([label, href]) => <Link key={href} className={path === href ? "active" : ""} href={href}>{label}</Link>)}
      </nav>
      <Link href="/contact" className="header-cta">Get a quote <ArrowUpRight size={16} /></Link>
      <button className="menu-button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(([label, href]) => <Link key={href} onClick={() => setOpen(false)} href={href}>{label}</Link>)}</nav>}
    </header>
    <main>{children}</main>
    <footer>
      <div className="footer-main section-shell">
        <div className="footer-brand"><img src="/anj-global-logo.png" alt="ANJ Global" /><p>Dependable import and export coordination from Tamil Nadu to markets across India and the world.</p></div>
        <div><h4>Navigate</h4>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div><h4>Products</h4><span>Fruits & vegetables</span><span>Seeds & agriculture</span><span>Spices & food goods</span><span>Industry products</span></div>
        <div><h4>Reach us</h4><span><MapPin size={15}/> Tamil Nadu, India</span><a href="mailto:enquiry@anjglobal.in"><Mail size={15}/> enquiry@anjglobal.in</a></div>
      </div>
      <div className="footer-bottom section-shell"><span>© {new Date().getFullYear()} ANJ Global Import & Export</span><span>Bridging businesses worldwide</span></div>
    </footer>
  </div>
}
