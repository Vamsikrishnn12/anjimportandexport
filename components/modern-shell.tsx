"use client";

import GooeyNav from "./gooey-nav";
import BrandLoader from "./brand-loader";
import { usePathname } from "next/navigation";
import { Globe2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const firstLoad = useRef(true);
  const navigationStartedAt = useRef(Date.now());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const minimum = firstLoad.current ? 850 : 320;
    const elapsed = Date.now() - navigationStartedAt.current;
    const timer = window.setTimeout(() => setIsLoading(false), Math.max(120, minimum - elapsed));
    firstLoad.current = false;
    return () => window.clearTimeout(timer);
  }, [path]);

  useEffect(() => {
    const handleNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!target || target.target === "_blank" || target.hasAttribute("download")) return;
      const destination = new URL(target.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const current = `${window.location.pathname}${window.location.search}`;
      const next = `${destination.pathname}${destination.search}`;
      if (next === current) return;
      navigationStartedAt.current = Date.now();
      setIsLoading(true);
      window.setTimeout(() => setIsLoading(false), 3000);
    };
    document.addEventListener("click", handleNavigation, true);
    return () => document.removeEventListener("click", handleNavigation, true);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(element.querySelectorAll<HTMLElement>(".reveal"));

    items.forEach((item, index) => {
      if (item.classList.contains("reveal-from-left") || item.classList.contains("reveal-from-right")) return;
      item.classList.add(index % 2 === 0 ? "reveal-from-left" : "reveal-from-right");
    });

    const headingSelector = [
      ".page-intro h1",
      ".intro-layout h2",
      ".section-heading h2",
      ".network-panel h2",
      ".closing-cta h2",
      ".about-statement h2",
      ".enquiry-aside h2",
      ".sourcing-guide h2",
    ].join(",");
    const headings = reduced ? [] : Array.from(element.querySelectorAll<HTMLElement>(headingSelector));

    headings.forEach(heading => {
      if (heading.dataset.letterReveal === "ready") return;
      const accessibleLabel = heading.textContent?.replace(/\s+/g, " ").trim();
      if (accessibleLabel) heading.setAttribute("aria-label", accessibleLabel);
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
      let characterIndex = 0;
      textNodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        Array.from(node.data).forEach(character => {
          if (/\s/.test(character)) {
            fragment.append(document.createTextNode(character));
            return;
          }
          const span = document.createElement("span");
          span.className = "letter-reveal__char";
          span.textContent = character;
          span.setAttribute("aria-hidden", "true");
          span.style.setProperty("--char-index", String(characterIndex++));
          fragment.append(span);
        });
        node.replaceWith(fragment);
      });
      heading.dataset.letterReveal = "ready";
      heading.classList.add("letter-reveal");
    });

    const motionItems = [...items, ...headings];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: .08, rootMargin: "0px 0px -7% 0px" });
    motionItems.forEach(item => reduced ? item.classList.add("is-visible") : observer.observe(item));
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
    <BrandLoader active={isLoading} />
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
