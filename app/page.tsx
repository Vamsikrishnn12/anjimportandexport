import Link from "next/link";
import { Boxes, CircleDot, Globe2, PackageCheck, Plane, Ship, Sprout, Truck } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const products = [
  { icon: Sprout, tag: "AGRI 01", title: "Fresh produce", copy: "Fruits and vegetables selected for market, season and journey." },
  { icon: PackageCheck, tag: "AGRI 02", title: "Seeds & staples", copy: "Agricultural seeds, grains, pulses, spices and food products." },
  { icon: Boxes, tag: "TRADE 03", title: "Industry goods", copy: "Requirement-led sourcing for commercial and industrial products." },
];

export default function Home() {
  return <SiteShell>
    <section className="cinema-hero">
      <video className="hero-film" autoPlay muted loop playsInline preload="auto" poster="/anj-global-logistics.jpeg"><source src="https://videos.pexels.com/video-files/37723633/15998681_1920_1080_30fps.mp4" type="video/mp4" /></video>
      <div className="film-shade" /><div className="motion-grid" aria-hidden="true" />
      <svg className="route-graphic" viewBox="0 0 900 420" aria-hidden="true"><path d="M55 340 C220 90 480 85 825 190" /><path d="M120 380 C370 240 555 280 835 80" /><circle cx="55" cy="340" r="7"/><circle cx="825" cy="190" r="7"/><circle cx="835" cy="80" r="7"/></svg>
      <div className="cinema-content section-shell">
        <div className="hero-status"><span>ANJ / GLOBAL TRADE</span><span className="live-mark">Network active</span></div>
        <div className="hero-title-wrap"><p>Import & export · Tamil Nadu · India</p><h1>Local roots.<br/><i>World-scale</i> reach.</h1></div>
        <div className="hero-lower"><p>We source, coordinate and move products across India and international markets—fresh produce, agricultural goods and industry requirements.</p><div className="hero-actions"><Link href="/contact" className="neon-button">Start a trade enquiry</Link><Link href="/products" className="ghost-button">View product range</Link></div></div>
        <div className="scroll-cue"><span>Scroll to explore</span><div /></div>
      </div>
    </section>

    <section className="signal-bar" aria-label="Trade capabilities"><div><span>GLOBAL SOURCING</span><i>●</i><span>IMPORT COORDINATION</span><i>●</i><span>EXPORT SUPPORT</span><i>●</i><span>PAN-INDIA NETWORK</span><i>●</i><span>GLOBAL SOURCING</span><i>●</i></div></section>

    <section className="section-shell intro-block"><div className="intro-index">01 / WHAT WE MOVE</div><div className="intro-statement"><h2>Goods do not just cross borders.<br/><span>They connect opportunity.</span></h2><p>ANJ Global brings responsive sourcing and careful shipment coordination into one clear trade relationship.</p></div></section>

    <section className="section-shell product-panels">
      {products.map(({icon:Icon,tag,title,copy},i)=><article key={title} className="product-panel"><div className="panel-number">0{i+1}</div><div className="panel-icon"><Icon/></div><span>{tag}</span><h3>{title}</h3><p>{copy}</p><Link href="/products">Explore category</Link></article>)}
    </section>

    <section className="network-section"><div className="network-visual"><div className="globe-core"><Globe2/><span className="ring r1"/><span className="ring r2"/><span className="ring r3"/></div><div className="mode-chip mode-air"><Plane/> Air</div><div className="mode-chip mode-sea"><Ship/> Sea</div><div className="mode-chip mode-road"><Truck/> Road</div></div><div className="network-copy"><span className="section-label">02 / CONNECTED MOVEMENT</span><h2>One network.<br/>Multiple modes.<br/><em>Clear direction.</em></h2><p>From source to destination, we align product, paperwork and transport around your requirement.</p><ul><li><CircleDot/> Buyer-led product sourcing</li><li><CircleDot/> Quality and packing alignment</li><li><CircleDot/> Shipment and document coordination</li></ul><Link className="neon-button" href="/services">See how we work</Link></div></section>

    <section className="trade-cta section-shell"><p>Have a market or product in mind?</p><h2>Let’s move it<br/><i>forward.</i></h2><Link href="/contact" className="neon-button">Talk to our team</Link></section>
  </SiteShell>
}
