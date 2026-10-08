"use client";

import GooeyNav from "./gooey-nav";
import SplashCursor from "./splash-cursor";
import { usePathname } from "next/navigation";
import { Globe2, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = element.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    items.forEach(item => reduced ? item.classList.add("is-visible") : observer.observe(item));
    element.classList.add("motion-ready");

    const updateScroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      element.style.setProperty("--scroll-progress", String(height > 0 ? scrollY / height : 0));
    };
    updateScroll();
    addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      observer.disconnect();
      removeEventListener("scroll", updateScroll);
    };
  }, [path]);

  return <>
    <SplashCursor RAINBOW_MODE={false} COLOR="#22c55e" />
    <div className="site-wrap" ref={root}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" />
      <header className="site-header">
        <div className="header-inner container">
          <a href="/" className="header-logo" aria-label="ANJ Global home">
            <img src="/anj-global-logo-transparent.png" alt="ANJ Global Import and Export" />
          </a>
          <GooeyNav items={nav} activeHref={path} />
          <a href="/contact" className="header-cta">Let’s talk <Plus size={16} /></a>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand"><img src="/anj-global-logo-transparent.png" alt="ANJ Global Import and Export" /></a>
            <p>Local knowledge.<br />Global possibilities.</p>
            <span><Globe2 size={15} /> Tamil Nadu, India</span>
          </div>
          <div><h3>Discover</h3>{nav.slice(1).map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <div><h3>We connect</h3><span>Products & markets</span><span>Buyers & suppliers</span><span>Origins & destinations</span><span>Ideas & opportunities</span></div>
          <div><h3>Have a requirement?</h3><p>Make the first connection.</p><a className="footer-email" href="mailto:enquiry@anjglobal.in">enquiry@anjglobal.in</a><a href="/contact" className="text-link">Start a trade enquiry</a></div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} ANJ Global Import & Export</span>
          <span>Built on connection. Driven by possibility.</span>
          <a href="#main-content">Back to top</a>
        </div>
      </footer>
    </div>
  </>;
}
