"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, MapPin } from "lucide-react";
import { useState } from "react";

const nav = [["Home", "/"], ["About", "/about"], ["Products", "/products"], ["Services", "/services"], ["Contact", "/contact"]];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [open,setOpen]=useState(false);
  return <div className="site-wrap"><header className="site-header"><Link href="/" className="brand" aria-label="ANJ Global home"><img src="/anj-global-logo.png" alt="ANJ Global Import and Export" /></Link><nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label,href])=><Link key={href} className={path===href?"active":""} href={href}><span>{label}</span></Link>)}</nav><Link href="/contact" className="header-cta">Get a quote</Link><button className="menu-button" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<nav className="mobile-nav">{nav.map(([label,href])=><Link key={href} onClick={()=>setOpen(false)} href={href}>{label}</Link>)}</nav>}</header><main>{children}</main><footer><div className="footer-main section-shell"><div className="footer-brand"><img src="/anj-global-logo.png" alt="ANJ Global"/><p>Trade coordination from Tamil Nadu to India and global markets.</p></div><div><h4>Explore</h4>{nav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div><div><h4>Capabilities</h4><span>Fresh produce</span><span>Agricultural goods</span><span>Industry sourcing</span><span>Import & export</span></div><div><h4>Connect</h4><span><MapPin/> Tamil Nadu, India</span><a href="mailto:enquiry@anjglobal.in"><Mail/> enquiry@anjglobal.in</a></div></div><div className="footer-bottom section-shell"><span>© {new Date().getFullYear()} ANJ Global Import & Export</span><a href="https://www.pexels.com/video/cargo-container-ships-in-port-3840442/" target="_blank" rel="noreferrer">Film: Tom Fisk / Pexels</a></div></footer></div>
}
